'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import { deleteFromWatchlist, getWatchlist } from '@/lib/watchlistAPI';

interface WatchlistItem {
  movieId: string;
  title: string;
  posterUrl: string;
  createdAt: string;
}

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getWatchlist();
        setWatchlist(res.data || []);
      } catch (err) {
        console.error('Fetch watchlist error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleRemove = async (movieId: string) => {
    try {
      await deleteFromWatchlist(movieId);
      setWatchlist((prev) => prev.filter((m) => m.movieId !== movieId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (watchlist.length === 0) {
    return <p>No movies in your watchlist.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {watchlist.map((movie) => (
        <div key={movie.movieId} className="relative rounded-xl overflow-hidden shadow-md group">
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            width={200}
            height={300}
            className="object-cover w-full h-auto"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm flex justify-between items-center">
            <span>{movie.title}</span>
            <button
              onClick={() => handleRemove(movie.movieId)}
              className="hover:text-red-400 transition"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
