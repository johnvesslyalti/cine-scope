// src/app/actions/movieData.ts
"use server";

import { cache } from 'react'; // Import the React cache utility

export interface Genre {
    id: number;
    name: string;
}

// ----------------------------------------------------
// GET MOVIE GENRES (CACHED SERVER ACTION)
// ----------------------------------------------------

// Use `cache` to memoize the function. This ensures the function runs only once 
// per request/render pass on the server, even if called multiple times.
export const getMovieGenres = cache(async (): Promise<Genre[] | { error: string }> => {
    // Use a private environment variable for better security
    const TMDB_API_KEY = process.env.TMDB_API_KEY;

    if (!TMDB_API_KEY) {
        console.error('TMDB_API_KEY is not set.');
        return { error: 'TMDB API key is missing.' };
    }

    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`;

    try {
        const res = await fetch(url, {
            // Optional: Add a revalidate time to the fetch options to control Next.js data caching
            next: { revalidate: 60 * 60 * 24 }, // Cache for 24 hours (genres rarely change)
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`TMDb request failed with status ${res.status}: ${errorText}`);
            return { error: 'TMDb request failed' };
        }

        const data: { genres: Genre[] } = await res.json();
        return data.genres || [];

    } catch (error) {
        console.error('Genres fetch error:', error);
        return { error: 'Internal server error during genre fetch.' };
    }
});