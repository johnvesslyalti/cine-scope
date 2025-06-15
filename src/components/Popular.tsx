'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '@/store/cineStore';
import { TMDB_API } from '@/lib/tmdb';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { addToWatchlist, deleteFromWatchlist } from '@/lib/watchlistAPI';
import { useAuth } from '@/store/useAuth';
import { Alert, AlertDescription } from './ui/alert';
import { WatchlistMovie } from '@/types';

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
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error('Failed to fetch popular movies:', err.message);
        } else {
          console.error('Unknown error while fetching popular movies');
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPopular();
  }, []);

  // Fetch current watchlist
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
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error('Failed to fetch watchlist:', err.message);
        } else {
          console.error('Unknown error while fetching watchlist');
        }
      }
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
        setTimeout(() => setAlertMessage(null), 3000);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setAlertMessage(err.response?.data?.error || 'Failed to remove');
        } else {
          setAlertMessage('Unknown error while removing');
        }
      }
    } else {
      try {
        await addToWatchlist(movie, token);
        setAddedMovieIds(prev => new Set(prev).add(movieId));
        setAlertMessage('Added to Watchlist');
        setTimeout(() => setAlertMessage(null), 3000);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          alert(err.response?.data?.error || 'Failed to add');
        } else {
          alert('Unknown error while adding');
        }
      }
    }
  };

  if (loading) return <p className="text-white px-6">Loading...</p>;
  if (error) return <p className="text-red-500 px-6">Failed to load popular movies.</p>;

  return (
    <section className="px-6 py-8 bg-black">
      {alertMessage && (
        <Alert className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm rounded-xl border border-green-500 bg-green-900 text-green-200 shadow-xl transition-all duration-300">
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
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
