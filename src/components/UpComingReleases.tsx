'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie, useCineStore } from '@/store/cineStore';
import { TMDB_API } from '@/lib/tmdb';
import Link from 'next/link';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';

export default function UpcomingReleases() {
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const { watchlist, addToWatchlist, removeFromWatchlist } = useCineStore();

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await axios.get(TMDB_API.upcoming);
        setUpcoming(res.data.results.slice(0, 15));
      } catch (err) {
        console.error("Failed to fetch upcoming releases:", err);
      }
    };

    fetchUpcoming();
  }, []);

  const isInWatchlist = (movieId: number) => {
    return watchlist.some((movie: Movie) => movie.id === movieId);
  };

  const toggleWatchlist = (movie: Movie) => {
    isInWatchlist(movie.id)
      ? removeFromWatchlist(movie.id)
      : addToWatchlist(movie);
  };

  if (!upcoming.length) {
    return (
      <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mt-10" />
    );
  }

  return (
    <section className="px-6 py-8 bg-black">
      <h2 className="text-3xl font-bold mb-6 text-white">Upcoming Releases</h2>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {upcoming.map((movie) => (
          <div
            key={movie.id}
            className="relative min-w-[160px] max-w-[160px] hover:scale-105 transition-transform duration-300"
          >
            {/* Watchlist Toggle */}
            <button
              title={isInWatchlist(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
              aria-label={isInWatchlist(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className="absolute top-2 right-2 z-10 text-white bg-black/60 p-1 rounded-full hover:bg-white/80 hover:text-black transition"
              onClick={() => toggleWatchlist(movie)}
            >
              {isInWatchlist(movie.id) ? <FaBookmark /> : <FaRegBookmark />}
            </button>

            {/* Movie Link */}
            <Link href={`/movie/${movie.id}`} passHref>
              <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900 shadow-md">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-white bg-zinc-700">
                    No Image
                  </div>
                )}
              </div>
            </Link>

            {/* Title and Release Date */}
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-200 truncate px-1">
                {movie.title}
              </p>
              <p className="text-xs text-gray-400">
                {movie.release_date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
