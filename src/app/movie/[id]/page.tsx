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

export default async function MoviePage({ params }: { params: { id: string } }) {
  const tmdbId = params.id;

  // 🔐 FIXED: Await the session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // ❗ Optionally you can allow users without login to view the page
  // If you want to allow unauth viewers, remove this:
  // if (!session) throw new Error("Unauthorized");

  // 🎬 Fetch TMDB + ensure movie saved in DB
  const { dbMovie, tmdbMovie, cast, similar } = await getFullMovieData(tmdbId);

  let isInWatchlist = false;

  if (session?.user) {
    const watchlistEntry = await prisma.watchlist.findUnique({
      where: {
        userId_movieId: {
          userId: session.user.id,   // ✔ Now TS is happy
          movieId: dbMovie.id,
        },
      },
    });

    isInWatchlist = Boolean(watchlistEntry);
  }

  return (
    <div className="min-h-screen text-white">
      <MovieHeader movie={tmdbMovie} />

      <div className="max-w-7xl mx-auto py-10 space-y-8">
        <WatchlistButton tmdbId={tmdbId} isInWatchlist={isInWatchlist} />

        <MovieTabs
          overview={tmdbMovie.overview}
          cast={<CastList cast={cast} />}
          similar={<SimilarMovies movies={similar} />}
        />
      </div>
    </div>
  );
}
