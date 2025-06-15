'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { TMDB_API } from '@/lib/tmdb';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { addToWatchlist, deleteFromWatchlist } from '@/lib/watchlistAPI';
import { useAuth } from '@/store/useAuth';
import { Movie } from '@/store/cineStore';
import { Alert, AlertDescription } from './ui/alert';
import { WatchlistMovie } from '@/types';

export default function UpcomingReleases() {
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [addedMovieIds, setAddedMovieIds] = useState<Set<string>>(new Set());
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { token } = useAuth();

  // Fetch upcoming movies
  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await axios.get(TMDB_API.upcoming);
        setUpcoming(res.data.results.slice(0, 15));
      } catch (err) {
        console.error('Failed to fetch upcoming releases:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcoming();
  }, []);

  // Fetch user's watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!token) return;

      try {
        const res = await axios.get('/api/watchlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const ids = res.data.data.map((item: { movieId: string }) => item.movieId.toString());
        setAddedMovieIds(new Set(ids));
      } catch (err) {
        console.error('Failed to fetch watchlist:', err);
      }
    };

    fetchWatchlist();
  }, [token]);

  // Watchlist toggle
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
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setAlertMessage(err.response?.data?.error || 'Failed to remove');
        } else if (err instanceof Error) {
          setAlertMessage(err.message);
        } else {
          setAlertMessage('Failed to remove');
        }
      }
    } else {
      try {
        await addToWatchlist(movie, token);
        setAddedMovieIds((prev) => new Set(prev).add(movieId));
        setAlertMessage('Added to Watchlist');
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setAlertMessage(err.response?.data?.error || 'Failed to add');
        } else if (err instanceof Error) {
          setAlertMessage(err.message);
        } else {
          setAlertMessage('Failed to add');
        }
      }
    }

    setTimeout(() => setAlertMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mt-10" />
    );
  }

  if (error) {
    return <p className="text-red-500 px-6">Failed to load upcoming releases.</p>;
  }

  return (
    <section className="px-6 py-8 bg-black">
      {alertMessage && (
        <Alert className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm rounded-xl border border-green-500 bg-green-900 text-green-200 shadow-xl transition-all duration-300">
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <h2 className="text-3xl font-bold mb-6 text-white">Upcoming Releases</h2>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
        {upcoming.map((movie) => {
          const isAdded = addedMovieIds.has(movie.id.toString());

          return (
            <div
              key={movie.id}
              className="relative min-w-[160px] max-w-[160px] hover:scale-105 transition-transform duration-300 snap-start"
            >
              {/* Bookmark Toggle */}
              <button
                className={`absolute top-2 right-2 z-10 p-1 rounded-full transition ${
                  isAdded
                    ? 'bg-yellow-400 text-black'
                    : 'bg-black/60 text-white hover:bg-white/80 hover:text-black'
                }`}
                onClick={() =>
                  handleToggleWatchlist({
                    id: movie.id.toString(),
                    title: movie.title,
                    poster_path: movie.poster_path,
                  })
                }
                title={isAdded ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                {isAdded ? <FaBookmark /> : <FaRegBookmark />}
              </button>

              {/* Poster */}
              <Link href={`/movie/${movie.id}`} passHref>
                <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900 shadow-md relative">
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-white bg-zinc-700">
                      No Image
                    </div>
                  )}
                </div>
              </Link>

              {/* Title and Date */}
              <div className="mt-2 text-center">
                <p className="text-sm text-gray-200 truncate px-1">{movie.title}</p>
                <p className="text-xs text-gray-400">{movie.release_date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
