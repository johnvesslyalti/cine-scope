"use client";

import { addToWatchlist } from "@/actions/watchlist/addToWatchlist";
import { removeFromWatchlist } from "@/actions/watchlist/removeFromWatchlist";
import { useTransition } from "react";

export default function WatchlistButton({
  tmdbId,
  isInWatchlist,
}: {
  tmdbId: string;
  isInWatchlist: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      if (isInWatchlist) {
        await removeFromWatchlist(tmdbId);
      } else {
        await addToWatchlist(tmdbId);
      }
    });
  };

  return (
    <button
      onClick={toggle}
      className={`px-4 py-2 rounded-lg ${isInWatchlist ? "bg-red-500" : "bg-yellow-400"
        }`}
    >
      {pending ? "Processing..." : isInWatchlist ? "Remove" : "Add to Watchlist"}
    </button>
  );
}
