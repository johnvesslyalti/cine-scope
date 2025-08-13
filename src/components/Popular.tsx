'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '@/store/cineStore';
import { TMDB_API } from '@/lib/tmdb';
import { FaBookmark, FaRegBookmark, FaStar } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { addToWatchlist, deleteFromWatchlist } from '@/lib/watchlistAPI';
import { useAuth } from '@/store/useAuth';
import { Alert, AlertDescription } from './ui/alert';
import { WatchlistMovie } from '@/types';
import { motion } from 'framer-motion';

export default function Popular() {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [addedMovieIds, setAddedMovieIds] = useState<Set<string>>(new Set());
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { token } = useAuth();

  // Fetch popular movies
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await axios.get(TMDB_API.popular);
        setPopular(res.data.results);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  // Fetch watchlist (only if logged in)
  useEffect(() => {
    if (!token) return;
    const fetchWatchlist = async () => {
      try {
        const res = await axios.get('/api/watchlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ids = res.data.data.map((item: { movieId: string }) => item.movieId.toString());
        setAddedMovieIds(new Set(ids));
      } catch {}
    };
    fetchWatchlist();
  }, [token]);

  // Toggle watchlist
  const handleToggleWatchlist = async (movie: WatchlistMovie) => {
    const movieId = movie.id;
    if (addedMovieIds.has(movieId)) {
      try {
        await deleteFromWatchlist(movieId, token);
        setAddedMovieIds(prev => {
          const updated = new Set(prev);
          updated.delete(movieId);
          return updated;
        });
        setAlertMessage('Removed from Watchlist');
      } catch {}
    } else {
      try {
        await addToWatchlist(movie, token);
        setAddedMovieIds(prev => new Set(prev).add(movieId));
        setAlertMessage('Added to Watchlist');
      } catch {}
    }
    setTimeout(() => setAlertMessage(null), 2500);
  };

  if (loading) return <p className="text-white px-6">Loading...</p>;
  if (error) return <p className="text-red-500 px-6">Failed to load popular movies.</p>;

  return (
    <section className="px-6 py-8 bg-gradient-to-b from-black via-zinc-900 to-black">
      {alertMessage && (
        <Alert className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-sm rounded-xl border border-green-500 bg-green-900 text-green-200 shadow-xl">
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <h2 className="text-3xl font-extrabold mb-6 text-white tracking-tight">
        🔥 Popular Movies
      </h2>

      <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
        {popular.map(movie => {
          const isAdded = addedMovieIds.has(movie.id.toString());
          return (
            <motion.div
              key={movie.id}
              className="relative min-w-[160px] max-w-[160px] rounded-xl overflow-hidden snap-start group shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.25 }}
            >
              {/* Poster */}
              <Link href={`/movie/${movie.id}`}>
                <div className="relative aspect-[2/3] w-full">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>
              </Link>

              {/* Bookmark button (only show if logged in) */}
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
