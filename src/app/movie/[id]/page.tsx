'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  FaStar,
  FaCalendarAlt,
  FaFilm,
  FaBookmark,
  FaRegBookmark,
} from 'react-icons/fa';
import { TMDB_API, TMDB_IMAGE } from '@/lib/tmdb';
import { addToWatchlist, deleteFromWatchlist } from '@/lib/watchlistAPI';
import { useAuth } from '@/store/useAuth';

// --- Types ---
interface Genre {
  id: number;
  name: string;
}

interface MovieDetails {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  tagline?: string;
  overview: string;
  genres?: Genre[];
}

interface WatchlistItem {
  movieId: string;
}

export default function MovieDetails() {
  const { id } = useParams() as { id: string };
  const { token } = useAuth();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(TMDB_API.moviedetails(id));
        setMovie(res.data);
      } catch (err) {
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    const checkWatchlist = async () => {
      if (!token) return;
      try {
        const res = await axios.get('/api/watchlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const isPresent = res.data.data.some(
          (item: WatchlistItem) => item.movieId.toString() === id
        );
        setIsInWatchlist(isPresent);
      } catch (err) {
        console.error('Failed to check watchlist:', err);
      }
    };

    fetchDetails();
    checkWatchlist();
  }, [id, token]);

  const handleToggleWatchlist = async () => {
    if (!movie || !token) return;

    const payload = {
      id: movie.id.toString(),
      title: movie.title,
      poster_path: movie.poster_path,
    };

    try {
      if (isInWatchlist) {
        await deleteFromWatchlist(payload.id, token);
        setIsInWatchlist(false);
      } else {
        await addToWatchlist(payload, token);
        setIsInWatchlist(true);
      }
    } catch (err) {
      console.error('Error updating watchlist:', err);
    }
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;
  if (!movie) return <p className="text-red-500 p-6">Movie not found.</p>;

  return (
    <div className="relative min-h-screen text-white">
        {movie.backdrop_path && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={TMDB_IMAGE(movie.backdrop_path, 'w1280')}
            alt={`${movie.title} backdrop`}
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-10 bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
          <Image
            src={TMDB_IMAGE(movie.poster_path)}
            alt={movie.title}
            width={300}
            height={450}
            className="rounded-lg object-cover shadow-md"
          />

          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-extrabold">{movie.title}</h1>
                {movie.tagline && (
                  <p className="text-yellow-400 italic mt-1">
                    &ldquo;{movie.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Watchlist Button */}
              {token && (
                <button
                  onClick={handleToggleWatchlist}
                  className={`ml-4 p-2 rounded-full text-lg ${
                    isInWatchlist
                      ? 'bg-yellow-400 text-black'
                      : 'bg-black/40 text-white hover:bg-white/80 hover:text-black'
                  }`}
                  title={
                    isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'
                  }
                >
                  {isInWatchlist ? <FaBookmark /> : <FaRegBookmark />}
                </button>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <FaCalendarAlt />
                <span>{new Date(movie.release_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span>{movie.vote_average.toFixed(1)} / 10</span>
              </div>
              <div className="flex items-center gap-2">
                <FaFilm />
                <span>{movie.genres?.map((g) => g.name).join(', ')}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-1">Overview</h2>
              <p className="text-gray-200 leading-relaxed">{movie.overview}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
