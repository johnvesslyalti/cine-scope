'use server';

import { authClient } from "@/lib/auth-client";
import { ensureMovieExists } from "@/lib/ensureMovieExists";
import prisma from "@/lib/prisma";

export async function addToWatchlist(tmdbId: string) {
    const { data: session } = authClient.useSession()

    if (!session) throw new Error("Unauthorized");

    const userId = session.user.id;

    const movie = await ensureMovieExists(tmdbId);

    const exists = await prisma.watchlist.findUnique({
        where: {
            userId_movieId: { userId, movieId: movie.id }
        },
    });

    if (exists) return { already: true };

    await prisma.watchlist.create({
        data: {
            userId,
            movieId: movie.id,
        },
    });

    return { success: true }
}