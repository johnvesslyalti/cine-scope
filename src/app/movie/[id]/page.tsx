// src/app/movie/[id]/page.tsx
"use server";

import { getFullMovieData } from "@/lib/movieService";
import MovieHeader from "./MovieHeader";
import MovieTabs from "./MovieTabs";
import CastList from "./CastList";
import SimilarMovies from "./SimilarMovies";
import WatchlistButton from "./WatchlistButton";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { TMDB_IMAGE } from "@/lib/tmdb";

export default async function MoviePage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const tmdbId = id;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { dbMovie, tmdbMovie, cast, similar } = await getFullMovieData(tmdbId);

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
    <div className="min-h-screen text-white relative">

      {/* BACKDROP */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <img
          src={TMDB_IMAGE(tmdbMovie.backdrop_path, "w1280")}
          alt="backdrop"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black" />
      </div>

      {/* POSTER + INFO OVERLAY */}
      <div className="
        absolute top-[30vh] left-1/2 -translate-x-1/2
        w-full max-w-7xl px-4
        grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10
      ">

        {/* POSTER + WATCHLIST */}
        <div className="space-y-4">
          <div className="w-full rounded-xl overflow-hidden shadow-2xl">
            <img
              src={TMDB_IMAGE(tmdbMovie.poster_path, "w500")}
              alt={tmdbMovie.title}
              className="w-full object-cover"
            />
          </div>

          <div className="flex justify-center">
            <WatchlistButton tmdbId={tmdbId} isInWatchlist={isInWatchlist} />
          </div>
        </div>

        {/* TITLE + DETAILS + TABS */}
        <div className="space-y-6">

          <h1 className="text-4xl md:text-5xl font-bold">
            {tmdbMovie.title}
          </h1>

          {tmdbMovie.tagline && (
            <p className="text-yellow-300 italic text-lg md:text-xl">
              “{tmdbMovie.tagline}”
            </p>
          )}

          {/* Release date & rating */}
          <div className="flex flex-wrap gap-4 text-white/80 text-sm md:text-base">
            {tmdbMovie.release_date && (
              <span>📅 {tmdbMovie.release_date}</span>
            )}
            {tmdbMovie.vote_average && (
              <span>⭐ {tmdbMovie.vote_average.toFixed(1)}</span>
            )}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {tmdbMovie.genres?.map((g: any) => (
              <span
                key={g.id}
                className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-sm"
              >
                {g.name}
              </span>
            ))}
          </div>

          {/* Budget */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full max-w-sm">
            <p className="text-sm text-white/60">Budget</p>
            <p className="font-semibold text-lg">
              ${tmdbMovie.budget?.toLocaleString() || "—"}
            </p>
          </div>

          {/* Tabs */}
          <MovieTabs
            overview={tmdbMovie.overview}
            cast={<CastList cast={cast} />}
            similar={<SimilarMovies movies={similar} />}
          />

        </div>
      </div>

      <div className="pt-[65vh]" />
    </div>
  );
}
