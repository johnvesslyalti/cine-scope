// app/movie/[id]/page.tsx
import { TMDB_API, TMDB_IMAGE } from '@/lib/tmdb';
import axios from 'axios';
import Image from 'next/image';
import { FaStar, FaCalendarAlt, FaFilm } from 'react-icons/fa';

export default async function MovieDetails({ params }: { params: { id: string } }) {
  let movie;

  try {
    const res = await axios.get(TMDB_API.moviedetails(params.id));
    movie = res.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return (
      <div className="p-6 text-red-500">
        Failed to load movie details. Please try again later.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      {/* Backdrop Image */}
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
          {/* Poster */}
          <Image
            src={TMDB_IMAGE(movie.poster_path)}
            alt={movie.title || 'Movie Poster'}
            width={300}
            height={450}
            className="rounded-lg object-cover shadow-md"
          />

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-extrabold">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-yellow-400 italic mt-1">"{movie.tagline}"</p>
              )}
            </div>

            {/* Meta Info */}
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
                <span>{movie.genres?.map((g: any) => g.name).join(', ')}</span>
              </div>
            </div>

            {/* Overview */}
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
