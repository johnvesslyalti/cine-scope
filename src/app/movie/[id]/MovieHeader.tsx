"use client";

import Image from "next/image";
import { TMDB_IMAGE } from "@/lib/tmdb";

export default function MovieHeader({ movie }: { movie: any }) {
  return (
    <div className="relative h-[50vh] w-full overflow-hidden">
      {movie.backdrop_path && (
        <Image
          src={TMDB_IMAGE(movie.backdrop_path, "w1280")}
          alt={movie.title}
          fill
          className="object-cover opacity-30"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black flex items-end p-10">
        <h1 className="text-5xl font-bold">{movie.title}</h1>
      </div>
    </div>
  );
}
