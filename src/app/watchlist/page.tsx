'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useAuth } from '@/store/useAuth';
import { FaTrash } from 'react-icons/fa';
import { WatchlistItem } from '@/types';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/watchlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWatchlist(res.data.data);
      } catch (err) {
        console.error('Failed to fetch watchlist:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchWatchlist();
  }, [token]);

  const handleRemove = async (movieId: string) => {
    try {
      await axios.delete('/api/watchlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { movieId },
      });

      setWatchlist((prev) => prev.filter((movie) => movie.movieId !== movieId));
      alert('Removed from Watchlist');
    } catch (err: any) {
      console.error('Failed to remove from watchlist:', err);
      alert(err?.response?.data?.error || 'Failed to remove');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 border-b border-zinc-700 pb-2">
          Your Watchlist
        </h1>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load your watchlist.</p>
        ) : watchlist.length === 0 ? (
          <p className="text-gray-400">Your watchlist is empty.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {watchlist.map((movie) => (
              <div
                key={movie.id}
                className="bg-zinc-900 w-40 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow relative"
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(movie.movieId)}
                  title="Remove from Watchlist"
                  className="absolute top-1.5 right-1.5 z-10 bg-red-600 hover:bg-red-500 text-white p-1.5 rounded-full"
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
                </div>

                {/* Movie Info */}
                <div className="p-3">
                  <h2 className="text-sm font-semibold truncate">{movie.title}</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(movie.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
