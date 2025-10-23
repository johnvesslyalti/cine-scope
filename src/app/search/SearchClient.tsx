"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaFilter, FaHistory, FaStar, FaCalendarAlt, FaTimes } from "react-icons/fa";
import AISearchAssistant from "@/components/AISearchAssistant";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface Genre {
  id: number;
  name: string;
}

export default function SearchClient() {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const genreFilter = searchParams.get("genre") || "";
  const yearFilter = searchParams.get("year") || "";
  const ratingFilter = searchParams.get("rating") || "";

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Load genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch('/api/genres');
        const data = await res.json();
        setGenres(data);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    const searchUrl = `/api/search?query=${encodeURIComponent(query)}&page=${currentPage}&genre=${genreFilter}&year=${yearFilter}&rating=${ratingFilter}`;
    
    fetch(searchUrl)
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (data.results && Array.isArray(data.results)) {
            setResults(data.results);
            setTotalPages(Math.min(data.total_pages || 1, 500)); // TMDB max is 500
          } else if (Array.isArray(data)) {
            setResults(data);
            setTotalPages(1);
          } else {
            console.error("Unexpected JSON structure:", data);
            setResults([]);
            setTotalPages(0);
          }
        } catch {
          console.error("Failed to parse JSON:", text);
          setResults([]);
          setTotalPages(0);
        }
      })
      .finally(() => setLoading(false));

    // Add to search history
    if (query.trim()) {
      const newHistory = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  }, [query, currentPage, genreFilter, yearFilter, ratingFilter]);

  const handleFilterChange = (filterType: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(filterType, value);
    } else {
      params.delete(filterType);
    }
    params.set('page', '1');
    setCurrentPage(1);
    router.push(`/search?${params.toString()}`);
  };

  const handleHistoryClick = (historyQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(historyQuery)}`);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
  const ratings = [9, 8, 7, 6, 5, 4, 3, 2, 1];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-zinc-900 to-black text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            {query ? `Search Results for "${query}"` : "Search Movies"}
          </h1>
          
          <div className="flex gap-2">
            <AISearchAssistant 
              onSearch={(query) => router.push(`/search?q=${encodeURIComponent(query)}`)}
              currentQuery={query}
              searchHistory={searchHistory}
            />
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              <FaFilter />
              Filters
            </button>
            
            {searchHistory.length > 0 && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
              >
                <FaHistory />
                History
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Genre</label>
                <select
                  value={genreFilter}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <select
                  value={yearFilter}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Min Rating</label>
                <select
                  value={ratingFilter}
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option value="">Any Rating</option>
                  {ratings.map((rating) => (
                    <option key={rating} value={rating}>
                      {rating}+ Stars
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search History */}
        {showFilters && searchHistory.length > 0 && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FaHistory />
                Recent Searches
              </h3>
              <button
                onClick={clearHistory}
                className="text-red-400 hover:text-red-300 transition"
              >
                <FaTimes />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((historyQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(historyQuery)}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 transition"
                >
                  {historyQuery}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="text-lg animate-pulse">Searching movies...</div>
          </div>
        ) : results.length === 0 ? (
          <div className="flex justify-center items-center h-60">
            <div className="text-gray-400 text-lg text-center">
              {query ? "No movies found matching your criteria." : "Enter a search term to find movies."}
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {results.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden transition-transform hover:scale-105 hover:shadow-lg border border-white/10 group"
                >
                  <div className="relative">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        width={300}
                        height={450}
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <div className="w-full h-[450px] flex items-center justify-center bg-gray-700 text-white text-sm">
                        No Image
                      </div>
                    )}
                    
                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h2 className="text-sm font-semibold truncate group-hover:text-yellow-400 transition">
                      {movie.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                      <FaCalendarAlt />
                      {new Date(movie.release_date).getFullYear()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
