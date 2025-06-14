import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { movieId, title, posterUrl } = await req.json();

    const exists = await prisma.watchlist.findFirst({
      where: {
        userId: user.id,
        movieId,
      },
    });

    if (exists) {
      return NextResponse.json({ error: 'Movie already in watchlist' }, { status: 400 });
    }

    const watchlistItem = await prisma.watchlist.create({
      data: {
        userId: user.id,
        movieId,
        title,
        posterUrl,
      },
    });

    return NextResponse.json({ message: 'Added to watchlist', data: watchlistItem });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const watchlist = await prisma.watchlist.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ data: watchlist });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
