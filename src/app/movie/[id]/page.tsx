// src/app/movie/[id]/page.tsx

import { getFullMovieData } from "@/lib/movieService";
import MovieHeader from "./MovieHeader";
import MovieTabs from "./MovieTabs";
import CastList from "./CastList";
import SimilarMovies from "./SimilarMovies";
import WatchlistButton from "./WatchlistButton";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function MoviePage({
  params,
}: {
  // params might be a Promise in modern Next.js/Turbopack
  params: { id: string }
}) {
  // FIX: Await params to unwrap the route segment data
  const { id } = await params;
  const tmdbId = id; // Renamed to tmdbId for consistency with original code

  // ✔ Next.js automatically injects request context in server components
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // ✔ Fetch TMDB + sync DB (no try/catch here — avoids RSC crash)
  // This will now successfully proceed, assuming tmdb.ts fix is also applied.
  const { dbMovie, tmdbMovie, cast, similar } = await getFullMovieData(tmdbId);

  // Detect if movie is in user's watchlist
  let isInWatchlist = false;

  if (session?.user) {
    const entry = await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: dbMovie.id,
        },
      },
    });

    isInWatchlist = Boolean(entry);
  }

  return (
    <div className="min-h-screen text-white">
      {/* Top Banner + Title */}
      <MovieHeader movie={tmdbMovie} />

      <div className="max-w-7xl mx-auto py-10 space-y-8">

        {/* Watchlist Button (client component) */}
        <WatchlistButton
          tmdbId={tmdbId}
          isInWatchlist={isInWatchlist}
        />

        {/* Overview / Cast / Similar tabs */}
        <MovieTabs
          overview={tmdbMovie.overview}
          cast={<CastList cast={cast} />}
          similar={<SimilarMovies movies={similar} />}
        />

      </div>
    </div>
  );
}