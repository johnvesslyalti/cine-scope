import Image from "next/image";
import { TMDB_IMAGE } from "@/lib/tmdb";

export default function SimilarMovies({ movies }: { movies: any[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
      {movies.map((m) => (
        <a
          href={`/movie/${m.id}`}
          key={m.id}
          className="group block"
        >
          {/* Poster */}
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden bg-white/10">
            <Image
              src={TMDB_IMAGE(m.poster_path)}
              alt={m.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Title */}
          <p className="text-sm text-white/80 mt-2 group-hover:text-white transition-colors">
            {m.title}
          </p>
        </a>
      ))}
    </div>
  );
}
