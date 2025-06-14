'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie, useCineStore } from '@/store/cineStore';
import Link from 'next/link';
import { TMDB_API } from '@/lib/tmdb';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import Image from 'next/image';
import { addToWatchlist } from '@/lib/addToWatchlist';
import { WatchListMovie } from '@/types';
import { useAuth } from '@/store/useAuth';

export default function Popular() {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addedMovieIds, setAddedMovieIds] = useState<Set<string>>(new Set());

  const { watchlist } = useCineStore();
  const { token } = useAuth();

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      try {
        const res = await axios.get(TMDB_API.popular);
        setPopular(res.data.results);
      } catch (error) {
        console.error('Failed to fetch popular movies:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  const handleAdd = async (movie: WatchListMovie) => {
    try {
      console.log('Token being sent', token);
      const result = await addToWatchlist(movie, token);
      setAddedMovieIds((prev) => new Set(prev).add(movie.id)); 
      console.log("Token", token);
      alert('Added to Watchlist');
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Already in Watchlist or failed');
    }
  };

  if (loading) return <p className="text-white px-6">Loading...</p>;
  if (error) return <p className="text-red-500 px-6">Failed to load popular movies.</p>;

  return (
    <section className="px-6 py-8 bg-black">
      <h2 className="text-3xl font-bold mb-6 text-white">Popular Movies</h2>

      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {popular.map((movie) => {
          const isAdded = addedMovieIds.has(movie.id.toString());

          return (
            <div
              key={movie.id}
              className="relative min-w-[160px] max-w-[160px] hover:scale-105 transition-transform duration-300 snap-start"
            >
              <button
                className={`absolute top-2 right-2 z-10 p-1 rounded-full transition ${
                  isAdded
                    ? 'bg-yellow-400 text-black'
                    : 'bg-black/60 text-white hover:bg-white/80 hover:text-black'
                }`}
                onClick={() =>
                  handleAdd({
                    id: movie.id.toString(),
                    title: movie.title,
                    poster_path: movie.poster_path,
                  })
                }
                disabled={isAdded}
                title={isAdded ? 'Already in Watchlist' : 'Add to Watchlist'}
              >
                {isAdded ? <FaBookmark /> : <FaRegBookmark />}
              </button>

              <Link href={`/movie/${movie.id}`} passHref>
                <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900 shadow-md relative">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              <p className="mt-2 text-sm text-center text-gray-200 truncate px-1">
                {movie.title}
              </p>
              <p className="text-xs text-center text-yellow-400">
                ★ {movie.vote_average?.toFixed(1)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
