"use client";

import { useNotifications } from "./Notification";
import { useAuth } from "@/store/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";
import { FaBrain, FaStar, FaEye } from "react-icons/fa";

interface AIRecommendation {
  movieId: string;
  title: string;
  reason: string;
  confidence: number;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
}

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheMessage, setCacheMessage] = useState<string>("");
  const { user } = useAuth();
  const { showError, showSuccess } = useNotifications();

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCacheMessage("");

    try {
      const response = await fetch("/api/ai/recommendations");
      const data = await response.json();

      if (response.ok) {
        setRecommendations(data.recommendations || []);

        // Show cache/fallback messages
        if (data.cached) {
          setCacheMessage("Using cached recommendations");
        } else if (data.fallback) {
          setCacheMessage(data.message || "Using TMDB recommendations");
        } else if (data.message) {
          setCacheMessage(data.message);
        }

        if (data.recommendations?.length > 0) {
          showSuccess(
            "Success",
            `Found ${data.recommendations.length} recommendations for you!`
          );
        }
      } else {
        const errorMsg = data.error || "Failed to load recommendations";
        setError(errorMsg);

        // Check if it's a rate limit error
        if (
          data.isRateLimit ||
          errorMsg.includes("rate limit") ||
          errorMsg.includes("quota")
        ) {
          showError(
            "Rate Limit Reached",
            "AI service temporarily unavailable. Please try again in a few minutes."
          );
        } else {
          showError("Error", errorMsg);
        }
      }
    } catch {
      const errorMsg = "Failed to load recommendations";
      setError(errorMsg);
      showError("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  // Deduplicate recommendations on the client side as a safety measure
  const uniqueRecommendations = useMemo(() => {
    const seen = new Set<string>();
    return recommendations.filter((movie) => {
      if (!movie.movieId || seen.has(movie.movieId)) {
        return false;
      }
      seen.add(movie.movieId);
      return true;
    });
  }, [recommendations]);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user, fetchRecommendations]);

  if (!user) {
    return null; // Don't show for non-authenticated users
  }

  if (loading) {
    return (
      <div className="py-12 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
            <h2 className="text-2xl font-bold text-white">
              AI is analyzing your taste...
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={`skeleton-${i}`} className="animate-pulse">
                <div className="bg-zinc-800 rounded-lg h-64 mb-2"></div>
                <div className="bg-zinc-800 rounded h-4 mb-1"></div>
                <div className="bg-zinc-800 rounded h-3 w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              AI Recommendations
            </h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchRecommendations}
              className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 rounded-lg font-semibold transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (uniqueRecommendations.length === 0) {
    return (
      <div className="py-12 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              AI Recommendations
            </h2>
            <p className="text-gray-400 mb-4">
              Add some movies to your watchlist to get personalized AI
              recommendations!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 rounded-lg font-semibold transition-all duration-200"
            >
              Discover Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg">
            <FaBrain className="text-white text-xl" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">
              AI Recommendations
            </h2>
            <p className="text-gray-400">
              Personalized picks based on your watchlist
            </p>
            {cacheMessage && (
              <p className="text-cyan-400 text-sm mt-1">ℹ️ {cacheMessage}</p>
            )}
          </div>
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {uniqueRecommendations.map((movie, index) => (
            <div
              key={`movie-${movie.movieId}-${index}`}
              className="group relative bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Movie Poster */}
              <div className="relative aspect-[2/3]">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-zinc-600 text-sm">No Image</span>
                  </div>
                )}

                {/* Confidence Badge */}
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold flex items-center gap-1">
                  <FaBrain className="text-cyan-400" />
                  {movie.confidence}/10
                </div>

                {/* Rating Badge */}
                {movie.vote_average && (
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    {movie.vote_average.toFixed(1)}
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 right-3">
                    <Link
                      href={`/movie/${movie.movieId}`}
                      className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                      <FaEye size={12} />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>

              {/* Movie Info */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                  {movie.title}
                </h3>

                {movie.release_date && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                )}

                {/* AI Reason */}
                <div className="mt-2 p-2 bg-zinc-800/50 rounded-lg">
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                    {movie.reason}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            💡 These recommendations are powered by AI analysis of your
            watchlist preferences
          </p>
        </div>
      </div>
    </div>
  );
}
