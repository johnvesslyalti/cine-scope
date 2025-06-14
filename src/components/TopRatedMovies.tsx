'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie, useCineStore } from '@/store/cineStore';
import Link from 'next/link';
import { TMDB_API } from '@/lib/tmdb';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'; 

export default function TopRatedMovies() {
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const { watchlist, addToWatchlist, removeFromWatchlist } = useCineStore();

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

  const isInWatchlist = (movieId: number) => {
    return watchlist.some((movie: Movie) => movie.id === movieId);
  };

  const toggleWatchlist = (movie: Movie) => {
    isInWatchlist(movie.id)
      ? removeFromWatchlist(movie.id)
      : addToWatchlist(movie);
  };

  return (
    <section className="px-6 py-8 bg-black">
      <h2 className="text-3xl font-bold mb-6 text-white">Top Rated Movies</h2>

      <div className="flex gap-4 overflow-x-auto no-scrollbar">
        {topRated.map((movie) => (
          <div key={movie.id} className="relative min-w-[160px] max-w-[160px] hover:scale-105 transition-transform duration-300">
            {/* Watchlist Button */}
            <button
              className="absolute top-2 right-2 z-10 text-white bg-black/60 p-1 rounded-full hover:bg-white/80 hover:text-black transition"
              onClick={() => toggleWatchlist(movie)}
            >
              {isInWatchlist(movie.id) ? <FaBookmark /> : <FaRegBookmark />}
            </button>

            {/* Movie Link */}
            <Link href={`/movie/${movie.id}`} passHref>
              <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900 shadow-md">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>

            <p className="mt-2 text-sm text-center text-gray-200 truncate px-1">
              {movie.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
