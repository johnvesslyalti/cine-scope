// src/app/watchlist/RemoveButton.tsx
"use client";

import { useTransition } from "react";
import { FaTrash } from "react-icons/fa";
import { removeFromWatchlist } from "@/actions/watchlist/removeFromWatchlist";

export default function RemoveButton({ movieId }: { movieId: string }) {
    const [pending, startTransition] = useTransition();

    return (
        <button
            onClick={() => startTransition(() => removeFromWatchlist(movieId))}
            disabled={pending}
            className="absolute top-2 right-2 bg-black/70 p-2 rounded-full text-red-400 hover:text-red-600 hover:bg-black/90 transition"
        >
            <FaTrash size={16} />
        </button>
    );
}
