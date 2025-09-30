import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getAnthropicApiKey } from '@/lib/secrets';
import { prisma } from '@/lib/db';
import { getCheapestModel } from '@/lib/pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch conversation and its first user message
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 2, // Get first user message and first assistant response
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Don't regenerate if title has been customized (not the default truncated message)
    const firstMessage = conversation.messages[0];
    if (
      conversation.title !== firstMessage?.content.slice(0, 100) &&
      conversation.title !== 'New Conversation'
    ) {
      return NextResponse.json({
        title: conversation.title,
        generated: false,
      });
    }

    // Get conversation context for title generation
    const context = conversation.messages
      .slice(0, 2)
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n\n');

    // Use cheapest model for title generation
    const anthropic = new Anthropic({
      apiKey: getAnthropicApiKey(),
    });

    const response = await anthropic.messages.create({
      model: getCheapestModel(),
      max_tokens: 50,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: `Generate a very short, concise title (3-6 words) that describes this conversation. Be specific and descriptive. Only return the title, nothing else.\n\nConversation:\n${context}`,
        },
      ],
    });

    const title =
      response.content[0].type === 'text'
        ? response.content[0].text.trim().replace(/^["']|["']$/g, '')
        : conversation.title;

    // Update conversation title
    await prisma.conversation.update({
      where: { id },
      data: { title },
    });

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
