'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useAuth } from '@/store/useAuth';
import { FaTrash, FaEye, FaCalendarAlt } from 'react-icons/fa';
import { WatchlistItem } from '@/types';
import { useNotifications } from '@/components/Notification';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/watchlist');
        setWatchlist(res.data.data);
      } catch (err) {
        console.error('Failed to fetch watchlist:', err);
        setError(true);
        showError('Error', 'Failed to load your watchlist. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchWatchlist();
  }, [user, showError]);

  const handleRemove = async (movieId: string, movieTitle: string) => {
    try {
      await axios.delete('/api/watchlist', {
        data: { movieId },
      });

      setWatchlist((prev) => prev.filter((movie) => movie.movieId !== movieId));
      showSuccess('Removed from Watchlist', `${movieTitle} has been removed from your watchlist.`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Failed to remove from watchlist:', err);
        showError('Error', err.response?.data?.error || 'Failed to remove movie from watchlist');
      } else {
        console.error('Unexpected error:', err);
        showError('Error', 'An unexpected error occurred while removing the movie');
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 border-b border-zinc-700 pb-2">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Your Watchlist
          </h1>
          {watchlist.length > 0 && (
            <span className="text-sm text-gray-400">
              {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="text-gray-400 text-lg">Loading your watchlist...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-60">
            <div className="text-red-500 text-center">
              <div className="text-lg font-semibold mb-2">Failed to load watchlist</div>
              <div className="text-sm text-gray-400">Please try refreshing the page</div>
            </div>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-4">Start exploring movies and add them to your watchlist!</p>
            <a
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Discover Movies
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {watchlist.map((movie) => (
              <div
                key={movie.id}
                className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 relative group"
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(movie.movieId, movie.title)}
                  title="Remove from Watchlist"
                  className="absolute top-2 right-2 z-10 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                >
                  <FaTrash size={12} />
                </button>

                {/* Movie Poster */}
                <div className="aspect-[2/3] relative">
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
                </div>

                {/* Movie Info */}
                <div className="p-3">
                  <h2 className="text-sm font-semibold truncate group-hover:text-cyan-400 transition-colors">
                    {movie.title}
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <FaCalendarAlt size={10} />
                    <span>{new Date(movie.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-3 left-3 right-3">
                    <a
                      href={`/movie/${movie.movieId}`}
                      className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                      <FaEye size={12} />
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
