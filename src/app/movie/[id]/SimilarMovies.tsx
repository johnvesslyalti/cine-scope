import Image from "next/image";
import { TMDB_IMAGE } from "@/lib/tmdb";

export default function SimilarMovies({ movies }: { movies: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      {movies.map((m) => (
        <a href={`/movie/${m.id}`} key={m.id}>
          <div className="aspect-[2/3] relative">
            <Image
              src={TMDB_IMAGE(m.poster_path)}
              alt={m.title}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <p className="text-sm mt-2">{m.title}</p>
        </a>
      ))}
    </div>
  );
}
