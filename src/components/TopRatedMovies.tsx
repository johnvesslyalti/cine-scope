'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '@/store/cineStore';

export default function TopRatedMovies() {
  const [topRated, setTopRated] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchTopRated = async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      setTopRated(res.data.results);
    };

    fetchTopRated();
  }, []);

  return (
    <section className="px-6 py-4">
      <h2 className="text-2xl font-semibold mb-4 text-white">Top Rated Movies</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar">
        {topRated.map((movie) => (
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
