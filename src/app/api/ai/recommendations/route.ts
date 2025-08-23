import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AIService } from '@/lib/ai';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // ✅ Fixed: no "movie" include
    const watchlist = await prisma.watchlist.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    if (watchlist.length === 0) {
      return NextResponse.json(
        { error: 'No watchlist found. Add some movies to get personalized recommendations.' },
        { status: 400 }
      );
    }

    const watchlistMovies = watchlist.map(item => ({
      title: item.title,
      genre_ids: [] // still empty unless you enrich with TMDB
    }));

    let recommendations = [];
    try {
      recommendations = await AIService.getPersonalizedRecommendations(watchlistMovies);
    } catch (aiError) {
      console.error('AIService error:', aiError);
      return NextResponse.json(
        { error: 'AI recommendation service failed' },
        { status: 502 }
      );
    }

    const enrichedRecommendations = await Promise.all(
      recommendations.map(async (rec) => {
        try {
          const searchResponse = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(rec.title)}&api_key=${process.env.TMDB_API_KEY}`
          );
          const searchData = await searchResponse.json();

          if (searchData.results && searchData.results.length > 0) {
            const movie = searchData.results[0];
            return {
              ...rec,
              movieId: movie.id.toString(),
              poster_path: movie.poster_path,
              release_date: movie.release_date,
              vote_average: movie.vote_average
            };
          }
          return null;
        } catch (err) {
          console.error(`TMDB lookup failed for ${rec.title}:`, err);
          return null;
        }
      })
    );

    const validRecommendations = enrichedRecommendations.filter(Boolean);

    return NextResponse.json({
      success: true,
      recommendations: validRecommendations,
      count: validRecommendations.length
    });

  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
