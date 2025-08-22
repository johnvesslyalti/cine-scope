// app/api/search/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const page = searchParams.get('page') || '1';
    const genre = searchParams.get('genre');
    const year = searchParams.get('year');
    const rating = searchParams.get('rating');

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    // Build the search URL with filters
    let searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}&language=en-US&include_adult=false`;

    // Add genre filter if provided
    if (genre) {
      searchUrl += `&with_genres=${genre}`;
    }

    // Add year filter if provided
    if (year) {
      searchUrl += `&primary_release_year=${year}`;
    }

    // Add rating filter if provided
    if (rating) {
      searchUrl += `&vote_average.gte=${rating}`;
    }

    const res = await fetch(searchUrl);

    if (!res.ok) {
      return NextResponse.json({ error: 'TMDb request failed' }, { status: res.status });
    }

    const data = await res.json();

    // Return the full response with pagination info
    return NextResponse.json({
      results: data.results || [],
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0,
      page: data.page || 1
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
