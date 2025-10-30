import { AIServiceGemini } from "@/lib/ai";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// ------------------- In-Memory Cache -------------------
interface CacheEntry {
  data: any[];
  timestamp: number;
  userId: string;
}

const recommendationsCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const MIN_REQUEST_INTERVAL = 60 * 1000; // 1 minute between requests per user

function getCacheKey(userId: string, watchlistHash: string): string {
  return `${userId}-${watchlistHash}`;
}

function getWatchlistHash(watchlist: any[]): string {
  // Create a simple hash from movieIds to detect watchlist changes
  return watchlist
    .map(item => item.movieId)
    .sort()
    .join(',');
}

function getCachedRecommendations(userId: string, watchlistHash: string): any[] | null {
  const cacheKey = getCacheKey(userId, watchlistHash);
  const cached = recommendationsCache.get(cacheKey);
  
  if (!cached) return null;
  
  const now = Date.now();
  const age = now - cached.timestamp;
  
  // Check if cache is still valid
  if (age < CACHE_DURATION) {
    console.log(`✅ Using cached recommendations (age: ${Math.round(age / 1000)}s)`);
    return cached.data;
  }
  
  // Check rate limit
  if (age < MIN_REQUEST_INTERVAL) {
    const waitTime = Math.ceil((MIN_REQUEST_INTERVAL - age) / 1000);
    console.log(`⏳ Rate limited. Please wait ${waitTime}s before requesting again.`);
    return cached.data; // Return stale cache rather than failing
  }
  
  return null;
}

function setCachedRecommendations(userId: string, watchlistHash: string, data: any[]): void {
  const cacheKey = getCacheKey(userId, watchlistHash);
  recommendationsCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
    userId,
  });
  
  // Clean up old cache entries (older than 1 hour)
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [key, entry] of recommendationsCache.entries()) {
    if (entry.timestamp < oneHourAgo) {
      recommendationsCache.delete(key);
    }
  }
}

// ------------------- Helper Functions -------------------
function deduplicateByMovieId(movies: any[]): any[] {
  const seen = new Set<string>();
  return movies.filter((movie) => {
    const id = movie.movieId?.toString();
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

async function fetchTMDBWithRetry(url: string, retries = 3): Promise<Response | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.warn(`⚠️ TMDB fetch attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Exponential backoff
      }
    }
  }
  return null;
}

async function getTMDBFallbackRecommendations(
  watchlist: any[],
  tmdbKey: string
): Promise<any[]> {
  const fallbackRecs: any[] = [];
  const maxSeeds = 3;

  for (const item of watchlist.slice(0, maxSeeds)) {
    try {
      const simUrl = `https://api.themoviedb.org/3/movie/${encodeURIComponent(
        item.movieId
      )}/similar?api_key=${tmdbKey}`;
      
      const simRes = await fetchTMDBWithRetry(simUrl);
      if (!simRes?.ok) continue;
      
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
      
      await new Promise((r) => setTimeout(r, 300));
    } catch (error) {
      console.error(`❌ Failed to get similar movies for ${item.title}:`, error);
    }
  }

  return deduplicateByMovieId(fallbackRecs);
}

async function enrichWithTMDBData(
  recommendations: any[],
  tmdbKey: string
): Promise<any[]> {
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

      const searchResponse = await fetchTMDBWithRetry(url);
      
      if (!searchResponse?.ok) {
        console.warn(`TMDB responded with status ${searchResponse?.status} for ${rec.title}`);
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

    await new Promise((r) => setTimeout(r, 300));
  }

  return enrichedRecommendations;
}

// ------------------- Main Route -------------------
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
          error: "No watchlist found. Add some movies to get personalized recommendations.",
        },
        { status: 400 }
      );
    }

    // 🧩 3.1️⃣ Check cache first
    const watchlistHash = getWatchlistHash(watchlist);
    const cachedRecs = getCachedRecommendations(session.user.id, watchlistHash);
    
    if (cachedRecs && cachedRecs.length > 0) {
      return NextResponse.json({
        success: true,
        recommendations: cachedRecs,
        count: cachedRecs.length,
        cached: true,
        message: "Cached recommendations (to avoid rate limits)",
      });
    }

    // 🧩 4️⃣ Try AI recommendations with error handling
    let recommendations: any[] = [];
    let usedFallback = false;
    
    try {
      recommendations = await AIServiceGemini.getPersonalizedRecommendations(
        session.user.id
      );
    } catch (aiError: any) {
      console.error("⚠️ Gemini AI service error:", aiError);
      
      // Check if it's a rate limit error
      const isRateLimit = 
        aiError?.message?.includes("429") ||
        aiError?.message?.includes("quota") ||
        aiError?.message?.includes("rate limit");
      
      if (isRateLimit) {
        console.log("📊 Rate limit hit - using TMDB fallback");
        usedFallback = true;
        
        // Use TMDB fallback
        recommendations = await getTMDBFallbackRecommendations(watchlist, tmdbKey);
        
        if (recommendations.length > 0) {
          const deduped = deduplicateByMovieId(recommendations);
          const final = deduped.slice(0, 10);
          
          // Cache the fallback results
          setCachedRecommendations(session.user.id, watchlistHash, final);
          
          return NextResponse.json({
            success: true,
            recommendations: final,
            count: final.length,
            message: "AI rate limit reached. Using TMDB similar movies instead.",
            fallback: true,
          });
        }
      }
      
      // If not rate limit or fallback failed, return error
      return NextResponse.json(
        { 
          error: "AI recommendation service temporarily unavailable. Please try again in a few minutes.",
          isRateLimit,
        },
        { status: 503 }
      );
    }

    // 🧩 4.1️⃣ Fallback to TMDB if AI returned no results
    if (!recommendations?.length) {
      console.log("📊 No AI recommendations - using TMDB fallback");
      recommendations = await getTMDBFallbackRecommendations(watchlist, tmdbKey);
      usedFallback = true;
      
      if (recommendations.length === 0) {
        return NextResponse.json({
          success: true,
          recommendations: [],
          count: 0,
          message: "No recommendations available at this time.",
        });
      }
      
      const deduped = deduplicateByMovieId(recommendations);
      const final = deduped.slice(0, 10);
      
      // Cache the results
      setCachedRecommendations(session.user.id, watchlistHash, final);
      
      return NextResponse.json({
        success: true,
        recommendations: final,
        count: final.length,
        message: "Using TMDB similar-movies recommendations",
        fallback: true,
      });
    }

    // 🧩 5️⃣ Enrich AI recommendations with TMDB data
    const enrichedRecommendations = await enrichWithTMDBData(recommendations, tmdbKey);
    
    // 🧩 6️⃣ Deduplicate and return
    const deduped = deduplicateByMovieId(enrichedRecommendations);
    const final = deduped.slice(0, 10);
    
    // Cache the successful results
    if (final.length > 0) {
      setCachedRecommendations(session.user.id, watchlistHash, final);
    }

    return NextResponse.json({
      success: true,
      recommendations: final,
      count: final.length,
      message: usedFallback ? "Using TMDB fallback" : "AI-powered recommendations",
    });
    
  } catch (error) {
    console.error("💥 Error generating AI recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}