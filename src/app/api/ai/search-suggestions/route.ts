import { AIServiceGemini } from '@/lib/ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, searchHistory = [] } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const suggestions = await AIServiceGemini.getSearchSuggestions(query, searchHistory);

    return NextResponse.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Error generating search suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate search suggestions' },
      { status: 500 }
    );
  }
}

