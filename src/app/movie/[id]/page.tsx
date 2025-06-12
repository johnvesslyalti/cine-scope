// app/movie/[id]/page.tsx
import axios from 'axios';
import Image from 'next/image';

export default async function MovieDetails({ params }: { params: { id: string } }) {
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
  );
  const movie = res.data;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
      <p className="text-gray-400 mb-4">{movie.tagline}</p>
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={300}
          height={450}
          className="rounded-lg"
        />
        <div>
          <p className="mb-2"><strong>Release Date:</strong> {movie.release_date}</p>
          <p className="mb-2"><strong>Rating:</strong> {movie.vote_average} / 10</p>
          <p className="mb-2"><strong>Overview:</strong> {movie.overview}</p>
          <p className="mb-2"><strong>Genres:</strong> {movie.genres.map((g: any) => g.name).join(', ')}</p>
        </div>
      </div>
    </div>
  );
}
