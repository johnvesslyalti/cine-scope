// src/app/movie/[id]/page.tsx
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
      disabled={pending}
      className={`
        flex items-center gap-2
        px-4 py-2 rounded-xl font-medium
        transition-colors duration-300
        ${isInWatchlist ? "bg-red-500 hover:bg-red-600" : "bg-yellow-400 hover:bg-yellow-500"}
        ${pending ? "opacity-70 cursor-not-allowed" : ""}
      `}
    >
      {/* Icon */}
      {!pending && (
        <span>
          {isInWatchlist ? "−" : "+"}
        </span>
      )}

      {/* Label */}
      {pending
        ? "Processing..."
        : isInWatchlist
          ? "Remove from Watchlist"
          : "Add to Watchlist"}
    </button>
  );
}
