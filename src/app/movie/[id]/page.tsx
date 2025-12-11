// src/app/movie/[id]/page.tsx
"use server";

import { getFullMovieData } from "@/lib/movieService";
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

  const session = await auth.api.getSession({ headers: await headers() });
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
    <div className="min-h-screen text-white">

      {/* BACKDROP */}
      <div
        className="h-[55vh] w-full bg-cover bg-center opacity-40"
        style={{
          backgroundImage: `url(${TMDB_IMAGE(
            tmdbMovie.backdrop_path,
            "w1280"
          )})`,
        }}
      />

      {/* HERO CONTENT — NORMAL FLOW */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10">

          {/* POSTER + WATCHLIST */}
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden shadow-2xl">
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

          {/* MOVIE INFO */}
          <div className="space-y-6 pt-10">
            <h1 className="text-4xl md:text-5xl font-bold">
              {tmdbMovie.title}
            </h1>

            {tmdbMovie.tagline && (
              <p className="text-yellow-300 italic text-lg md:text-xl">
                “{tmdbMovie.tagline}”
              </p>
            )}

            {/* Date & Rating */}
            <div className="flex gap-4 text-white/80 text-sm md:text-base">
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
          </div>
        </div>
      </div>

      {/* TABS ALWAYS STAY JUST AFTER INFO */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <MovieTabs
          overview={tmdbMovie.overview}
          cast={<CastList cast={cast} />}
          similar={<SimilarMovies movies={similar} />}
        />
      </div>

    </div>
  );
}
