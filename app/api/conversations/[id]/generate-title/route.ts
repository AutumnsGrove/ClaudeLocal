import { NextRequest, NextResponse } from 'next/server';
import { generateConversationTitle } from '@/lib/generate-title';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const title = await generateConversationTitle(id);

    if (!title) {
      return NextResponse.json(
        { error: 'Failed to generate title' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      title,
      generated: true,
    });
  } catch (error: any) {
    console.error('Title generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate title' },
      { status: 500 }
    );
  }
}
