// src/app/movie/[id]/page.tsx
import { getFullMovieData } from "@/lib/movieService";
import MovieHeader from "./MovieHeader";
import WatchlistButton from "./WatchlistButton";
import MovieTabs from "./MovieTabs";
import CastList from "./CastList";
import SimilarMovies from "./SimilarMovies";

export default async function MoviePage({ params }: { params: { id: string } }) {
  const { dbMovie, tmdbMovie, cast, similar } = await getFullMovieData(params.id);

  return (
    <div className="min-h-screen text-white">
      <MovieHeader movie={tmdbMovie} />

      <div className="max-w-7xl mx-auto py-10">
        <WatchlistButton movie={dbMovie} />

        <MovieTabs
          overview={tmdbMovie.overview}
          cast={<CastList cast={cast} />}
          similar={<SimilarMovies movies={similar} />}
        />
      </div>
    </div>
  );
}
