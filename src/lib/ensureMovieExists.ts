import prisma from "./prisma";
import { getMovieDetails } from "./tmdb";
import { TMDB_IMAGE } from "./tmdb"; // add this import

export async function ensureMovieExists(tmdbId: string) {
    const existing = await prisma.movie.findUnique({
        where: { tmdbId },
    });

    if (existing) return existing;

    const data = await getMovieDetails(tmdbId);

    const director =
        data.credits?.crew.find((c: any) => c.job === "Director")?.name || null;

    const cast = data.credits?.cast?.slice(0, 5).map((c: any) => c.name) || [];

    return prisma.movie.create({
        data: {
            tmdbId,
            title: data.title,
            releaseYear: Number(data.release_date?.split("-")[0] ?? 0),
            runtimeMinutes: data.runtime ?? null,

            // ⭐ FIX: SAVE FULL POSTER URL
            posterUrl: TMDB_IMAGE(data.poster_path, "w500"),

            // ⭐ (Optional Extra Fix)
            backdropUrl: TMDB_IMAGE(data.backdrop_path, "w1280"),

            genres: data.genres?.map((g: any) => g.name) || [],
            cast,
            director,
            plotSummary: data.overview,
            ratingTmdb: data.vote_average ?? null,
        },
    });
}
