"use client";

import Image from "next/image";
import { TMDB_IMAGE } from "@/lib/tmdb";

export default function MovieHeader({ movie }: { movie: any }) {
  return (
    <div className="relative h-[60vh] w-full overflow-hidden group">
      {/* Backdrop */}
      {movie.backdrop_path && (
        <Image
          src={TMDB_IMAGE(movie.backdrop_path, "w1280")}
          alt={movie.title}
          fill
          priority
          className="
            object-cover 
            opacity-40 
            scale-105 
            transition-transform 
            duration-[6000ms] 
            ease-out 
            group-hover:scale-110 
          "
        />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
    </div>
  );
}
