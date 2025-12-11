'use server';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function removeFromWatchlist(tmdbId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    const userId = session.user.id;

    const movie = await prisma.movie.findUnique({
        where: { tmdbId },
    });

    // FIX: return nothing (void)
    if (!movie) return;

    await prisma.watchlist.deleteMany({
        where: {
            userId,
            movieId: movie.id,
        },
    });

    // optional: if you want instant UI refresh
    revalidatePath("/watchlist");
}
