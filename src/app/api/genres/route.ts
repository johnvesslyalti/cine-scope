import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'TMDb request failed' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data.genres || []);
  } catch (error) {
    console.error('Genres API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
