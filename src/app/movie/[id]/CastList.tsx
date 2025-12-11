import Image from "next/image";
import { TMDB_IMAGE } from "@/lib/tmdb";

export default function CastList({ cast }: { cast: any[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-5 mt-4">
      {cast.map((member) => (
        <div
          key={member.id}
          className="flex flex-col items-center text-center"
        >
          {/* Avatar */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-md bg-black/20">
            {member.profile_path ? (
              <Image
                src={TMDB_IMAGE(member.profile_path, "w185")}
                alt={member.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Name */}
          <div className="mt-2 font-semibold text-white text-sm">
            {member.name}
          </div>

          {/* Character */}
          <div className="text-xs text-white/60">{member.character}</div>
        </div>
      ))}
    </div>
  );
}
