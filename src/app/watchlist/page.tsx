// src/app/watchlist/page.tsx
import Image from "next/image";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import RemoveButton from "./RemoveButton";

export default async function WatchlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
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
      movie: true, // ❤️ THIS FETCHES THE MOVIE DATA
    },
  });

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {watchlist.map((item) => (
        <div
          key={item.movieId}
          className="relative rounded-xl overflow-hidden shadow-md group"
        >
          <Image
            src={item.movie.posterUrl}
            alt={item.movie.title}
            width={200}
            height={300}
            className="object-cover w-full h-full"
          />

          {/* Title overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
            <span className="text-white font-semibold text-sm line-clamp-1">
              {item.movie.title}
            </span>
          </div>

          {/* Remove button */}
          <RemoveButton movieId={item.movie.tmdbId} />
        </div>
      ))}
    </div>
  );
}
