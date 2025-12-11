// src/app/watchlist/page.tsx
import Image from "next/image";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import RemoveButton from "./RemoveButton";

export default async function WatchlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold">You must be logged in</p>
        <p className="text-gray-400">Please sign in to view your watchlist.</p>
      </div>
    );
  }

  // FETCH WATCHLIST + MOVIE DETAILS
  const watchlist = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      movie: true,
    },
  });

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Image
          src="/empty-watchlist.svg"
          alt="Empty"
          width={200}
          height={200}
          className="mb-4"
        />
        <p className="text-lg font-semibold">Your watchlist is empty</p>
        <p className="text-gray-400">Start adding movies you love!</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 pb-20">
      <h1 className="text-2xl text-white font-bold mb-5 flex items-center gap-2">
        Your Watchlist 🎬
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
        {watchlist.map((item) => (
          <div
            key={item.movieId}
            className="group relative rounded-xl overflow-hidden shadow-lg bg-zinc-900 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            {/* Entire card clickable */}
            <Link href={`/movie/${item.movie.tmdbId}`} className="block">
              <Image
                src={item.movie.posterUrl}
                alt={item.movie.title}
                width={300}
                height={450}
                className="object-cover w-full h-[260px]"
              />

              {/* Title overlay */}
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black via-black/40 to-transparent">
                <p className="text-white font-semibold text-sm truncate">
                  {item.movie.title}
                </p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            </Link>

            {/* Remove button — stays clickable */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
              <RemoveButton movieId={item.movie.tmdbId} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
