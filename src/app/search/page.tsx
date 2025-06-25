'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

export default function SearchPage() {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

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
            console.error('Unexpected JSON structure:', data);
            setResults([]);
          }
        } catch {
          console.error('Failed to parse JSON:', text);
          setResults([]);
        }
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for &quot;{query}&quot;
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((movie) => (
            <div
              key={movie.id}
              className="rounded overflow-hidden shadow hover:scale-105 transition"
            >
              <Link href={`movie/${movie.id}`}>
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={300}
                    height={450}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="bg-gray-300 w-full h-[450px] flex items-center justify-center text-gray-600">
                    No Image
                  </div>
                )}
                <div className="p-2">
                  <h2 className="font-semibold">{movie.title}</h2>
                  <p className="text-sm text-gray-500">{movie.release_date}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
