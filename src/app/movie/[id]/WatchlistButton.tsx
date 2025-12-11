"use client";

import { useTransition } from "react";
import { addToWatchlist } from "@/actions/addToWatchlist";

export default function WatchlistButton({ movie }: { movie: any }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => addToWatchlist(movie.tmdbId))}
      className="px-4 py-2 bg-yellow-400 text-black rounded-lg"
    >
      {pending ? "Adding..." : "Add to Watchlist"}
    </button>
  );
}
