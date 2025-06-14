'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useAuth } from '@/store/useAuth';

interface WatchlistItem {
  id: string;
  movieId: string;
  title: string;
  posterUrl: string;
  createdAt: string;
}

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

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 border-b border-zinc-700 pb-2">
          Your Watchlist
        </h1>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-500">Failed to load your watchlist.</p>
        ) : watchlist.length === 0 ? (
          <p className="text-gray-400">Your watchlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map((movie) => (
              <div
                key={movie.id}
                className="bg-zinc-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[2/3] relative">
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
                  <p className="text-sm text-gray-400 mt-1">Added on {new Date(movie.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
