import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { title, overview, genres } = await request.json();

    if (!title || !overview) {
      return NextResponse.json(
        { error: 'Title and overview are required' },
        { status: 400 }
      );
    }

    const analysis = await AIService.analyzeMovie(title, overview, genres || []);

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Error analyzing movie:', error);
    return NextResponse.json(
      { error: 'Failed to analyze movie' },
      { status: 500 }
    );
  }
}

