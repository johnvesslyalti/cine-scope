import { AIServiceGemini } from "@/lib/ai";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 🧩 1️⃣ Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // 🧩 2️⃣ Validate TMDB key
    const tmdbKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!tmdbKey) {
      console.error("❌ Missing TMDB_API_KEY in environment variables");
      return NextResponse.json(
        { error: "Server misconfiguration: Missing TMDB API key" },
        { status: 500 }
      );
    }

    // 🧩 3️⃣ Fetch user watchlist
    const watchlist = await prisma.watchlist.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (watchlist.length === 0) {
      return NextResponse.json(
        {
          error:
            "No watchlist found. Add some movies to get personalized recommendations.",
        },
        { status: 400 }
      );
    }

    // 🧩 4️⃣ Call Gemini for AI-based recommendations
    let recommendations = [] as any[];
    try {
      recommendations = await AIServiceGemini.getPersonalizedRecommendations(
        session.user.id
      );
    } catch (aiError) {
      console.error("⚠️ Gemini AI service error:", aiError);
      return NextResponse.json(
        { error: "AI recommendation service failed" },
        { status: 502 }
      );
    }

    // 🧩 4.1️⃣ Fallback to TMDB similar movies if AI returned none
    if (!recommendations?.length) {
      const fallbackRecs: any[] = [];
      try {
        const maxSeeds = 3;
        for (const item of watchlist.slice(0, maxSeeds)) {
          const simUrl = `https://api.themoviedb.org/3/movie/${encodeURIComponent(
            item.movieId
          )}/similar?api_key=${tmdbKey}`;
          const simRes = await fetch(simUrl);
          if (!simRes.ok) continue;
          const simData = await simRes.json();
          const top = (simData?.results || []).slice(0, 5);
          for (const movie of top) {
            if (!movie?.id || !movie?.title) continue;
            fallbackRecs.push({
              movieId: movie.id?.toString(),
              title: movie.title,
              reason: `Similar to ${item.title}`,
              confidence: 7,
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              vote_average: movie.vote_average,
            });
          }
          // small delay to avoid TMDB rate limits
          await new Promise((r) => setTimeout(r, 300));
        }

        // de-duplicate by movieId
        const seen = new Set<string>();
        const deduped = fallbackRecs.filter((r) => {
          if (seen.has(r.movieId)) return false;
          seen.add(r.movieId);
          return true;
        });

        if (deduped.length > 0) {
          return NextResponse.json({
            success: true,
            recommendations: deduped.slice(0, 10),
            count: Math.min(10, deduped.length),
            message: "Using TMDB similar-movies fallback",
          });
        }
      } catch (fallbackErr) {
        console.error("⚠️ Fallback TMDB similar failed:", fallbackErr);
      }

      // If still nothing, return empty with message
      return NextResponse.json({
        success: true,
        recommendations: [],
        count: 0,
        message: "No recommendations available",
      });
    }

    // 🧩 5️⃣ Fetch TMDB data safely (sequential with delay)
    const enrichedRecommendations = [];
    for (const rec of recommendations) {
      try {
        if (!rec?.title || typeof rec.title !== "string") {
          console.warn("⚠️ Skipping invalid recommendation:", rec);
          continue;
        }

        const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          rec.title
        )}&api_key=${tmdbKey}`;

        console.log("🎬 Fetching TMDB:", url);

        const searchResponse = await fetch(url);
        if (!searchResponse.ok) {
          console.warn(
            `TMDB responded with status ${searchResponse.status} for ${rec.title}`
          );
          continue;
        }

        const searchData = await searchResponse.json();
        if (searchData.results?.length > 0) {
          const movie = searchData.results[0];
          enrichedRecommendations.push({
            ...rec,
            movieId: movie.id?.toString(),
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
          });
        } else {
          console.warn(`No TMDB match found for: ${rec.title}`);
        }
      } catch (err) {
        console.error(`❌ TMDB lookup failed for ${rec.title}:`, err);
      }

      // small delay (300ms) to avoid TMDB rate limits
      await new Promise((r) => setTimeout(r, 300));
    }

    // 🧩 6️⃣ Return valid recommendations
    return NextResponse.json({
      success: true,
      recommendations: enrichedRecommendations,
      count: enrichedRecommendations.length,
    });
  } catch (error) {
    console.error("💥 Error generating AI recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
