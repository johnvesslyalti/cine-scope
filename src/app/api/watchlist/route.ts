import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const watchlist = await prisma.watchlist.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: watchlist.map(item => ({
        id: item.id,
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, poster_path } = body;

    if (!id || !title || !poster_path) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if movie already exists in watchlist
    const existingItem = await prisma.watchlist.findFirst({
      where: {
        userId: session.user.id,
        movieId: id,
      },
    });

    if (existingItem) {
      return NextResponse.json({ error: 'Movie already in watchlist' }, { status: 409 });
    }

    const watchlistItem = await prisma.watchlist.create({
      data: {
        userId: session.user.id,
        movieId: id,
        title: title,
        posterUrl: `https://image.tmdb.org/t/p/w500${poster_path}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: watchlistItem.id,
        movieId: watchlistItem.movieId,
        title: watchlistItem.title,
        posterUrl: watchlistItem.posterUrl,
        createdAt: watchlistItem.createdAt,
      },
    });
  } catch (error) {
    console.error('Watchlist POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId } = body;

    if (!movieId) {
      return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }

    const deletedItem = await prisma.watchlist.deleteMany({
      where: {
        userId: session.user.id,
        movieId: movieId,
      },
    });

    if (deletedItem.count === 0) {
      return NextResponse.json({ error: 'Movie not found in watchlist' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Movie removed from watchlist' });
  } catch (error) {
    console.error('Watchlist DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
