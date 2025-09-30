import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all conversations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const archived = searchParams.get('archived') === 'true';

    const conversations = await prisma.conversation.findMany({
      where: {
        ...(projectId && { projectId }),
        archived,
      },
      include: {
        _count: {
          select: { messages: true },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(conversations);
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST create a new conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, model, projectId, temperature = 1.0, maxTokens = 4096 } = body;

    if (!title || !model) {
      return NextResponse.json(
        { error: 'Title and model are required' },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.create({
      data: {
        title,
        model,
        projectId: projectId || null,
        temperature,
        maxTokens,
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error: any) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
