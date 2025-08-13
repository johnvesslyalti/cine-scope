'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '@/store/cineStore';
import Link from 'next/link';
import { TMDB_API } from '@/lib/tmdb';
import { FaBookmark, FaRegBookmark, FaStar } from 'react-icons/fa';
import { useAuth } from '@/store/useAuth';
import { WatchlistMovie } from '@/types';
import { addToWatchlist, deleteFromWatchlist } from '@/lib/watchlistAPI';
import { Alert, AlertDescription } from './ui/alert';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface WatchlistResponse {
  data: { movieId: string }[];
}

export default function TopRatedMovies() {
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [addedMovieIds, setAddedMovieIds] = useState<Set<string>>(new Set());
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const res = await axios.get(TMDB_API.top_rated);
        setTopRated(res.data.results);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTopRated();
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchWatchList = async () => {
      try {
        const res = await axios.get<WatchlistResponse>('/api/watchlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddedMovieIds(new Set(res.data.data.map((item) => item.movieId.toString())));
      } catch {}
    };
    fetchWatchList();
  }, [token]);

  const handleToggleWatchlist = async (movie: WatchlistMovie) => {
    const movieId = movie.id;
    if (addedMovieIds.has(movieId)) {
      try {
        await deleteFromWatchlist(movieId, token);
        setAddedMovieIds((prev) => {
          const updated = new Set(prev);
          updated.delete(movieId);
          return updated;
        });
        setAlertMessage('Removed from Watchlist');
      } catch {
        setAlertMessage('Failed to remove');
      }
    } else {
      try {
        await addToWatchlist(movie, token);
        setAddedMovieIds((prev) => new Set(prev).add(movieId));
        setAlertMessage('Added to Watchlist');
      } catch {
        setAlertMessage('Failed to add');
      }
    }
    setTimeout(() => setAlertMessage(null), 2500);
  };

  if (loading) return <p className="text-white px-6">Loading...</p>;
  if (error) return <p className="text-red-500 px-6">Failed to load Top Rated Movies.</p>;

  return (
    <section className="px-6 py-10 bg-gradient-to-b from-black via-zinc-900 to-black">
      {alertMessage && (
        <Alert className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm rounded-xl border border-green-500 bg-green-900 text-green-200 shadow-xl">
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <h2 className="text-3xl font-extrabold mb-6 text-white tracking-tight">
        ⭐ Top Rated Movies
      </h2>

      <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
        {topRated.map((movie) => {
          const isAdded = addedMovieIds.has(movie.id.toString());
          return (
            <motion.div
              key={movie.id}
              className="relative min-w-[160px] max-w-[160px] rounded-xl overflow-hidden snap-start group shadow-lg bg-zinc-900"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.25 }}
            >
              {/* Movie poster */}
              <Link href={`/movie/${movie.id}`}>
                <div className="relative aspect-[2/3] w-full">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>
              </Link>

              {/* Bookmark button */}
              {token && (
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() =>
                    handleToggleWatchlist({
                      id: movie.id.toString(),
                      title: movie.title,
                      poster_path: movie.poster_path,
                    })
                  }
                  className={`absolute top-2 right-2 z-10 p-2 rounded-full shadow-md transition ${
                    isAdded
                      ? 'bg-yellow-400 text-black'
                      : 'bg-black/60 text-white hover:bg-white hover:text-black'
                  }`}
                  title={isAdded ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  {isAdded ? <FaBookmark /> : <FaRegBookmark />}
                </motion.button>
              )}

              {/* Title & Rating */}
              <div className="bg-zinc-900/80 py-2 px-2">
                <p className="text-sm font-semibold text-white truncate">{movie.title}</p>
                <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs mt-1">
                  <FaStar size={10} /> {movie.vote_average?.toFixed(1)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
