"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

export default function SearchClient() {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            setResults(data);
          } else {
            console.error("Unexpected JSON structure:", data);
            setResults([]);
          }
        } catch {
          console.error("Failed to parse JSON:", text);
          setResults([]);
        }
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-zinc-900 to-black text-white">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6">
        Search Results for &quot;{query}&quot;
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <p className="text-lg animate-pulse">Searching movies...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex justify-center items-center h-60">
          <p className="text-gray-400 text-lg">No movies found.</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden transition-transform hover:scale-105 hover:shadow-lg border border-white/10"
            >
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
              <div className="p-3">
                <h2 className="text-sm font-semibold truncate">
                  {movie.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
