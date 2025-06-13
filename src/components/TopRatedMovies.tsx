'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '@/store/cineStore';
import Link from 'next/link';
import { TMDB_API } from '@/lib/tmdb';

export default function TopRatedMovies() {
  const [topRated, setTopRated] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const res = await axios.get(TMDB_API.top_rated);
        setTopRated(res.data.results);
      } catch (error) {
        console.error("Failed to fetch top rated movies:", error);
      }
    };

    fetchTopRated();
  }, []);

  return (
    <section className="px-6 py-8 bg-black">
      <h2 className="text-3xl font-bold mb-6 text-white">Top Rated Movies</h2>
      
      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {topRated.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id} passHref>
            <div className="min-w-[160px] max-w-[160px] hover:scale-105 transition-transform duration-300">
              <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900 shadow-md">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-sm text-center text-gray-200 truncate px-1">
                {movie.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
