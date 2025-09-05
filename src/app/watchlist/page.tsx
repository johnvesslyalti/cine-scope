'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
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

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-800 animate-pulse rounded-xl h-[300px]"
          />
        ))}
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <Image
          src="/empty-watchlist.svg"
          alt="Empty"
          width={200}
          height={200}
          className="mb-4"
        />
        <p className="text-lg font-semibold">Your watchlist is empty</p>
        <p className="text-gray-400">Start adding movies you love!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {watchlist.map((movie) => (
        <motion.div
          key={movie.movieId}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-xl overflow-hidden shadow-md group"
        >
          {/* Poster */}
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            width={200}
            height={300}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />

          {/* Gradient + Title */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
            <span className="text-white font-semibold text-sm line-clamp-1">
              {movie.title}
            </span>
          </div>

          {/* Remove Button (Always visible) */}
          <button
            onClick={() => handleRemove(movie.movieId)}
            className="absolute top-2 right-2 bg-black/70 p-2 rounded-full text-red-400 hover:text-red-600 hover:bg-black/90 transition"
          >
            <FaTrash size={16} />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
