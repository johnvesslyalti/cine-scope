'use server';

import { authClient } from "@/lib/auth-client";
import prisma from "@/lib/prisma";

export async function removeFromWatchlist(tmdbId: string) {
    const { data: session } = authClient.useSession()

    if (!session) throw new Error("Unauthorized");

    const userId = session.user.id;

    const movie = await prisma.movie.findUnique({
        where: { tmdbId },
    });

    if (!movie) return { success: true };

    await prisma.watchlist.deleteMany({
        where: {
            userId,
            movieId: movie.id,
        }
    });

    return { success: true }
}