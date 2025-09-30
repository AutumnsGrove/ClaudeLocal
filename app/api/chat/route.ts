import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getAnthropicApiKey } from '@/lib/secrets';
import { prisma } from '@/lib/db';
import { generateConversationTitle } from '@/lib/generate-title';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      messages,
      model = 'claude-sonnet-4-5-20250929',
      temperature = 1.0,
      maxTokens = 8192,
      conversationId,
      projectId,
    } = body;

    // Handle both 'message' (single) and 'messages' (array) formats
    let messagesToProcess = messages;

    if (!messagesToProcess && message) {
      // If single message provided, need to fetch conversation history first
      if (conversationId) {
        const existingMessages = await prisma.message.findMany({
          where: { conversationId },
          orderBy: { createdAt: 'asc' },
        });
        messagesToProcess = [
          ...existingMessages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: message }
        ];
      } else {
        messagesToProcess = [{ role: 'user', content: message }];
      }
    }

    if (!messagesToProcess || !Array.isArray(messagesToProcess) || messagesToProcess.length === 0) {
      return NextResponse.json(
        { error: 'Message or messages array is required' },
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
      const title = messagesToProcess[0].content.slice(0, 100) || 'New Conversation';
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
    const userMessage = messagesToProcess[messagesToProcess.length - 1];
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: userMessage.content,
      },
    });

    // Prepare messages with prompt caching
    // Mark older messages for caching to save tokens (90% cost reduction!)
    const formattedMessages = messagesToProcess.map((msg: any, index: number) => {
      const isLastUserMessage = index === messagesToProcess.length - 1;
      const shouldCache = !isLastUserMessage && messagesToProcess.length > 2;

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
    const systemMessages: Array<{ type: 'text'; text: string; cache_control: { type: 'ephemeral' } }> = [];
    if (project?.instructions) {
      // Cache project instructions for huge token savings in multi-turn conversations
      systemMessages.push({
        type: 'text' as const,
        text: project.instructions,
        cache_control: { type: 'ephemeral' as const },
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
                  encoder.encode(`data: ${JSON.stringify({ type: 'content', content: text })}\n\n`)
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

              // Generate title if this is the first assistant message
              const messageCount = await prisma.message.count({
                where: { conversationId: conversation.id },
              });

              if (messageCount === 2) {
                // First exchange complete, trigger title generation asynchronously
                generateConversationTitle(conversation.id).catch((err) =>
                  console.error('Title generation failed:', err)
                );
              }

              // Send completion signal with messageId
              const savedMessage = await prisma.message.findFirst({
                where: { conversationId: conversation.id },
                orderBy: { createdAt: 'desc' },
              });

              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: 'done', messageId: savedMessage?.id, conversationId: conversation.id })}\n\n`
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
