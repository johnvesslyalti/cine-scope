'use server';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function removeFromWatchlist(tmdbId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

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