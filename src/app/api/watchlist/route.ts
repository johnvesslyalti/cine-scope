import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromToken(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized'}, { status: 401 });

        const { movieId } = await req.json();
        if (!movieId) return NextResponse.json({ error: 'movieId is required'}, { status: 400});

        const existing = await prisma.watchlist.findFirst({
            where: { userId: user.id, movieId },
        })

        if (existing) {
            return NextResponse.json({ message: 'Already in Watchlist'}, { status: 409 });
        }

        const added = await prisma.watchlist.create({
            data: {
                userId: user.id,
                movieId,
            }
        });

        return NextResponse.json(added, { status: 201 })
    } catch (error) {
        console.error("[WATCHLIST_POST]", error);
        return NextResponse.json({ error: 'Internal Server Error '}, { status: 500});
    }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const list = await prisma.watchlist.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}