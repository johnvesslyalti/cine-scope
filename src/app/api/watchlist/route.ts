import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/watchlist
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const watchlist = await prisma.watchlist.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: watchlist.map((item) => ({
        movieId: item.movieId,
        title: item.title,
        posterUrl: item.posterUrl,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    console.error('Watchlist GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/watchlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, poster_path } = body;

    if (!id || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const movieId = id.toString();

    const existing = await prisma.watchlist.findFirst({
      where: { userId: session.user.id, movieId },
    });

    if (existing) {
      return NextResponse.json({ error: 'Movie already in watchlist' }, { status: 409 });
    }

    const posterUrl = poster_path
      ? `https://image.tmdb.org/t/p/w500${poster_path}`
      : '/fallback-poster.png';

    const item = await prisma.watchlist.create({
      data: { userId: session.user.id, movieId, title, posterUrl },
    });

    return NextResponse.json({
      success: true,
      data: {
        movieId: item.movieId,
        title: item.title,
        posterUrl: item.posterUrl,
        createdAt: item.createdAt,
      },
    });
  } catch (error) {
    console.error('Watchlist POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/watchlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId } = body;

    if (!movieId) {
      return NextResponse.json({ error: 'Movie ID required' }, { status: 400 });
    }

    const deleted = await prisma.watchlist.deleteMany({
      where: { userId: session.user.id, movieId: movieId.toString() },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Movie not found in watchlist' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Movie removed' });
  } catch (error) {
    console.error('Watchlist DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
