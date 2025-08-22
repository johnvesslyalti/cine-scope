'use client';

import { FaFilm } from 'react-icons/fa';

interface LoadingSkeletonProps {
  type?: 'movie-card' | 'movie-details' | 'search-results' | 'watchlist';
  count?: number;
}

export default function LoadingSkeleton({ type = 'movie-card', count = 6 }: LoadingSkeletonProps) {
  const renderMovieCardSkeleton = () => (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 animate-pulse">
      <div className="aspect-[2/3] bg-gray-700 flex items-center justify-center">
        <FaFilm className="text-gray-500 text-4xl" />
      </div>
      <div className="p-3">
        <div className="h-4 bg-gray-700 rounded mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  );

  const renderMovieDetailsSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Poster Skeleton */}
        <div className="flex-shrink-0">
          <div className="w-80 h-[480px] bg-gray-700 rounded-xl animate-pulse flex items-center justify-center">
            <FaFilm className="text-gray-500 text-6xl" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 space-y-6">
          <div>
            <div className="h-12 bg-gray-700 rounded mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse"></div>
          </div>

          <div className="flex flex-wrap gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 bg-gray-700 rounded w-20 animate-pulse"></div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>

          <div className="bg-white/10 rounded-xl p-6">
            <div className="h-8 bg-gray-700 rounded mb-4 animate-pulse"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSearchResultsSkeleton = () => (
    <div className="min-h-screen p-6 bg-gradient-to-b from-zinc-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="h-12 bg-gray-700 rounded mb-6 animate-pulse"></div>
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i}>{renderMovieCardSkeleton()}</div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWatchlistSkeleton = () => (
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 bg-gray-700 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i}>{renderMovieCardSkeleton()}</div>
          ))}
        </div>
      </div>
    </div>
  );

  switch (type) {
    case 'movie-details':
      return renderMovieDetailsSkeleton();
    case 'search-results':
      return renderSearchResultsSkeleton();
    case 'watchlist':
      return renderWatchlistSkeleton();
    default:
      return (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i}>{renderMovieCardSkeleton()}</div>
          ))}
        </div>
      );
  }
}
