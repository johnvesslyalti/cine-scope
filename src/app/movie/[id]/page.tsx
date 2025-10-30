"use client";

import { useNotifications } from "@/components/Notification";
import TrailerModal from "@/components/TrailerModal";
import { TMDB_API, TMDB_IMAGE } from "@/lib/tmdb";
import { addToWatchlist, deleteFromWatchlist } from "@/lib/watchlistAPI";
import { useAuth } from "@/store/useAuth";
import { TabKey, WatchlistItem } from "@/types";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaStar,
  FaCalendarAlt,
  FaFilm,
  FaBookmark,
  FaRegBookmark,
  FaUsers,
  FaEye,
  FaYoutube,
} from "react-icons/fa";

interface Genre {
  id: number;
  name: string;
}
interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}
interface MovieDetails {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  tagline?: string;
  overview: string;
  genres?: Genre[];
  budget?: number;
  revenue?: number;
}
interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

export default function MovieDetails() {
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [similarMovies, setSimilarMovies] = useState<SimilarMovie[]>([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "cast" | "similar">(
    "overview"
  );
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Fetch movie data
  useEffect(() => {
    let mounted = true;

    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const [movieRes, castRes, similarRes] = await Promise.all([
          axios.get(TMDB_API.moviedetails(id)),
          axios.get(TMDB_API.moviecredits(id)),
          axios.get(TMDB_API.similarmovies(id)),
        ]);

        if (!mounted) return;

        setMovie(movieRes.data);
        setCast(castRes.data.cast.slice(0, 10));
        setSimilarMovies(similarRes.data.results.slice(0, 6));
      } catch (err) {
        console.error("Error fetching movie data:", err);
        if (mounted) showError("Error", "Failed to load movie details.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMovieData();

    return () => {
      mounted = false;
    };
  }, [id, showError]); // ✅ Added showError to dependencies

  // Check if movie is in watchlist (only when user exists)
  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const checkWatchlist = async () => {
      try {
        const res = await axios.get("/api/watchlist");
        if (!mounted) return;
        setIsInWatchlist(
          res.data.data.some(
            (item: WatchlistItem) => item.movieId.toString() === id
          )
        );
      } catch (err) {
        console.error("Failed to check watchlist:", err);
      }
    };

    checkWatchlist();
    return () => {
      mounted = false;
    };
  }, [user, id]);

  const handleToggleWatchlist = async () => {
    if (!movie || !user) return;
    const payload = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
    };
    try {
      if (isInWatchlist) {
        await deleteFromWatchlist(payload.id.toString());
        setIsInWatchlist(false);
        showSuccess(
          "Removed from Watchlist",
          `${movie.title} has been removed from your watchlist.`
        );
      } else {
        await addToWatchlist(payload);
        setIsInWatchlist(true);
        showSuccess(
          "Added to Watchlist",
          `${movie.title} has been added to your watchlist!`
        );
      }
    } catch (err) {
      console.error("Error updating watchlist:", err);
      showError("Error", "Failed to update watchlist. Please try again.");
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-xl">
        Loading movie details...
      </div>
    );
  if (!movie)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-500 text-xl">
        Movie not found.
      </div>
    );

  return (
    <div className="relative min-h-screen text-white">
      {movie.backdrop_path && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={TMDB_IMAGE(movie.backdrop_path, "w1280")}
            alt={`${movie.title} backdrop`}
            fill
            className="object-cover opacity-30 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column - Poster and Actions */}
          <div className="flex-shrink-0">
            <div className="relative">
              <Image
                src={TMDB_IMAGE(movie.poster_path)}
                alt={movie.title}
                width={320}
                height={480}
                className="rounded-xl object-cover shadow-lg shadow-yellow-500/10"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {user && (
                  <button
                    onClick={handleToggleWatchlist}
                    className={`p-3 rounded-full text-xl transition-all duration-200 transform hover:scale-110 ${
                      isInWatchlist
                        ? "bg-yellow-400 text-black shadow-lg shadow-yellow-500/50"
                        : "bg-black/40 text-white hover:bg-white/80 hover:text-black"
                    }`}
                    title={
                      isInWatchlist
                        ? "Remove from Watchlist"
                        : "Add to Watchlist"
                    }
                  >
                    {isInWatchlist ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                )}
                <button
                  onClick={() => setShowTrailerModal(true)}
                  className="p-3 rounded-full text-xl bg-red-600 hover:bg-red-500 text-white transition-all duration-200 transform hover:scale-110 shadow-lg"
                  title="Watch Trailer"
                >
                  <FaYoutube />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Movie Details */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold drop-shadow-lg">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-yellow-400 italic mt-2 text-lg">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Movie Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-yellow-300" />
                <span>{new Date(movie.release_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span>{movie.vote_average.toFixed(1)} / 10</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEye className="text-yellow-300" />
                <span>{movie.vote_count.toLocaleString()} votes</span>
              </div>
              {movie.runtime && (
                <div className="flex items-center gap-2">
                  <FaFilm className="text-yellow-300" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex items-center gap-2 flex-wrap">
              <FaFilm className="text-yellow-300" />
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="px-3 py-1 bg-white/10 rounded-full border border-white/20 text-xs"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Financial Info */}
            {(movie.budget || movie.revenue) && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                {movie.budget && (
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-gray-400">Budget</div>
                    <div className="font-semibold">
                      {formatCurrency(movie.budget)}
                    </div>
                  </div>
                )}
                {movie.revenue && (
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-gray-400">Revenue</div>
                    <div className="font-semibold">
                      {formatCurrency(movie.revenue)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
              {[
                { key: "overview", label: "Overview", icon: FaEye },
                { key: "cast", label: "Cast", icon: FaUsers },
                { key: "similar", label: "Similar Movies", icon: FaFilm },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as TabKey)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === key
                      ? "bg-yellow-400 text-black font-semibold"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold mb-3">Overview</h2>
                  <p className="text-gray-200 leading-relaxed">
                    {movie.overview}
                  </p>
                </div>
              )}
              {activeTab === "cast" && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Cast</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {cast.map((member) => (
                      <div key={member.id} className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-2">
                          {member.profile_path ? (
                            <Image
                              src={TMDB_IMAGE(member.profile_path, "w185")}
                              alt={member.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gray-600 flex items-center justify-center">
                              <FaUsers className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-semibold">
                          {member.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {member.character}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "similar" && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">
                    Similar Movies
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {similarMovies.map((similar) => (
                      <a
                        key={similar.id}
                        href={`/movie/${similar.id}`}
                        className="group block"
                      >
                        <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                          {similar.poster_path ? (
                            <Image
                              src={TMDB_IMAGE(similar.poster_path, "w185")}
                              alt={similar.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                              <FaFilm className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-semibold truncate">
                          {similar.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {similar.vote_average.toFixed(1)} ⭐
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={showTrailerModal}
        onClose={() => setShowTrailerModal(false)}
        movieId={id}
        movieTitle={movie.title}
      />
    </div>
  );
}
