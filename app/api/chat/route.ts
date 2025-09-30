import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getAnthropicApiKey } from '@/lib/secrets';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messages,
      model = 'claude-sonnet-4-5-20250929',
      temperature = 1.0,
      maxTokens = 8192,
      conversationId,
      projectId,
    } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: getAnthropicApiKey(),
    });

    // Create or update conversation
    let conversation;
    let project = null;

    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { project: true },
      });
      project = conversation?.project;
    } else {
      // Create new conversation
      const title = messages[0].content.slice(0, 100) || 'New Conversation';
      conversation = await prisma.conversation.create({
        data: {
          title,
          model,
          temperature,
          maxTokens,
          projectId: projectId || null,
        },
        include: { project: true },
      });
      project = conversation?.project;
    }

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Save user message
    const userMessage = messages[messages.length - 1];
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: userMessage.content,
      },
    });

    // Prepare messages with prompt caching
    // Mark older messages for caching to save tokens (90% cost reduction!)
    const formattedMessages = messages.map((msg: any, index: number) => {
      const isLastUserMessage = index === messages.length - 1;
      const shouldCache = !isLastUserMessage && messages.length > 2;

      return {
        role: msg.role,
        content: shouldCache
          ? [
              {
                type: 'text',
                text: msg.content,
                cache_control: { type: 'ephemeral' },
              },
            ]
          : msg.content,
      };
    });

    // Build system message with project instructions (if available)
    const systemMessages = [];
    if (project?.instructions) {
      // Cache project instructions for huge token savings in multi-turn conversations
      systemMessages.push({
        type: 'text',
        text: project.instructions,
        cache_control: { type: 'ephemeral' },
      });
    }

    // Create streaming response with prompt caching
    const stream = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      ...(systemMessages.length > 0 && { system: systemMessages }),
      messages: formattedMessages,
      stream: true,
    });

    let fullResponse = '';

    // Create a ReadableStream for the response
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta') {
              if (event.delta.type === 'text_delta') {
                const text = event.delta.text;
                fullResponse += text;

                // Send the text chunk to the client
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                );
              }
            } else if (event.type === 'message_stop') {
              // Save assistant message to database
              await prisma.message.create({
                data: {
                  conversationId: conversation.id,
                  role: 'assistant',
                  content: fullResponse,
                },
              });

              // Update conversation timestamp
              await prisma.conversation.update({
                where: { id: conversation.id },
                data: { updatedAt: new Date() },
              });

              // Send completion signal
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ done: true, conversationId: conversation.id })}\n\n`
                )
              );
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
