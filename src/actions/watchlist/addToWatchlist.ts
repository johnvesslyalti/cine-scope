'use server';

import { auth } from "@/lib/auth";
import { ensureMovieExists } from "@/lib/ensureMovieExists";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function addToWatchlist(tmdbId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) throw new Error("Unauthorized");

    const userId = session.user.id

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