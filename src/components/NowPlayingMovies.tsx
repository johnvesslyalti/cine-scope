'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '@/store/cineStore';
import { TMDB_API } from '@/lib/tmdb';

export default function NowPlayingMovies() {
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await axios.get(TMDB_API.nowplaying);
        setNowPlaying(res.data.results.slice(0, 15));
      } catch (err) {
        console.error("Failed to fetch now playing movies:", err);
      }
    };

    fetchNowPlaying();
  }, []);

  if (!nowPlaying.length) {
    return (
      <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mt-10" />
    );
  }

  return (
    <section className="px-6 py-4">
      <h2 className="text-2xl font-semibold mb-4 text-white">Now Playing</h2>
      <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-2">
        {nowPlaying.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[160px] hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <div className="aspect-[2/3] w-full rounded-lg overflow-hidden shadow-lg bg-gray-800">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-sm text-center text-gray-100 truncate">
              {movie.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
