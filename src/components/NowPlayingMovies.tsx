'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { TMDB_API } from '@/lib/tmdb';
import { FaBookmark, FaRegBookmark, FaStar } from 'react-icons/fa';
import { addToWatchlist, deleteFromWatchlist } from '@/lib/watchlistAPI';
import { useAuth } from '@/store/useAuth';
import { Movie } from '@/store/cineStore';
import { Alert, AlertDescription } from './ui/alert';
import { WatchlistMovie } from '@/types';
import { authClient } from '@/lib/auth-client';

export default function NowPlayingMovies() {
  const { user } = useAuth();
  const { data: session, isPending } = authClient.useSession();

  // --- State ---
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [addedMovieIds, setAddedMovieIds] = useState<Set<string>>(new Set());
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // --- Fetch Now Playing ---
  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await axios.get(TMDB_API.nowplaying);
        setNowPlaying(res.data.results.slice(0, 15));
      } catch (err) {
        console.error('Failed to fetch now playing movies:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
  }, []);

  // --- Fetch Watchlist ---
  useEffect(() => {
    if (isPending) return; // Wait for BetterAuth session to load

    if (!user || !session?.user) {
      setAddedMovieIds(new Set());
      return;
    }

    const fetchWatchlist = async () => {
      try {
        const res = await axios.get('/api/watchlist');
        const ids = res.data.data.map(
          (item: { movieId: string }) => item.movieId.toString()
        );
        setAddedMovieIds(new Set(ids));
      } catch (err) {
        console.error('Failed to fetch watchlist:', err);
      }
    };

    fetchWatchlist();
  }, [user, session, isPending]);

  // --- Toggle Watchlist ---
  const handleToggleWatchlist = async (movie: WatchlistMovie) => {
    if (!user || !session?.user) return;

    const movieId = movie.id.toString();

    if (addedMovieIds.has(movieId)) {
      // Remove
      try {
        await deleteFromWatchlist(movieId);
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
      // Add
      try {
        await addToWatchlist(movie);
        setAddedMovieIds((prev) => new Set(prev).add(movieId));
        setAlertMessage('Added to Watchlist');
      } catch {
        setAlertMessage('Failed to add');
      }
    }

    setTimeout(() => setAlertMessage(null), 3000);
  };

  // --- UI Loading Skeleton ---
  if (loading) {
    return (
      <div className="flex gap-4 px-6 mt-10 overflow-x-auto no-scrollbar">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-[160px] h-[240px] rounded-xl bg-zinc-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 px-6">Failed to load now playing movies.</p>;
  }

  // --- Main UI ---
  return (
    <section className="px-6 py-8 bg-black relative">
      {alertMessage && (
        <Alert className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm rounded-xl border border-green-500 bg-green-900 text-green-200 shadow-xl transition-all duration-300">
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <h2 className="text-3xl font-extrabold mb-6 text-white tracking-tight">
        🎬 Now Playing
      </h2>

      <div className="relative">
        <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-black to-transparent z-10" />

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
          {nowPlaying.map((movie) => {
            const isAdded = addedMovieIds.has(movie.id.toString());

            return (
              <div
                key={movie.id}
                className="relative min-w-[160px] max-w-[160px] hover:scale-105 transition-transform duration-300 snap-start group"
              >
                {/* Watchlist button */}
                {user && session?.user && (
                  <button
                    className={`absolute top-2 right-2 z-20 p-2 rounded-full shadow-md transition-transform transform hover:scale-110 ${isAdded
                      ? 'bg-yellow-400 text-black'
                      : 'bg-black/70 text-white hover:bg-white/80 hover:text-black'
                      }`}
                    onClick={() =>
                      handleToggleWatchlist({
                        id: movie.id,
                        title: movie.title,
                        poster_path: movie.poster_path,
                      })
                    }
                    title={isAdded ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  >
                    {isAdded ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                )}

                {/* Poster */}
                <Link href={`/movie/${movie.id}`} passHref>
                  <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900 shadow-lg relative group-hover:shadow-yellow-500/40 transition-all duration-300">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-white bg-zinc-700">
                        No Image
                      </div>
                    )}
                  </div>
                </Link>

                {/* Title & Rating */}
                <div className="mt-2 text-center">
                  <p
                    className="text-sm font-medium text-gray-200 truncate px-1 group-hover:text-yellow-400 transition-colors duration-200"
                    title={movie.title}
                  >
                    {movie.title}
                  </p>
                  <p className="text-xs text-center text-yellow-400 flex items-center justify-center gap-1">
                    <FaStar /> {movie.vote_average?.toFixed(1)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
