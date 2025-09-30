import Anthropic from '@anthropic-ai/sdk';
import { getAnthropicApiKey } from '@/lib/secrets';
import { prisma } from '@/lib/db';
import { getCheapestModel } from '@/lib/pricing';

/**
 * Generate a concise title for a conversation
 * @param conversationId - The ID of the conversation
 * @returns The generated title or null if generation failed
 */
export async function generateConversationTitle(
  conversationId: string
): Promise<string | null> {
  console.log('[generateTitle] Starting title generation for conversation:', conversationId);
  try {
    // Fetch conversation and its first messages
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 2, // Get first user message and first assistant response
        },
      },
    });

    if (!conversation || conversation.messages.length < 2) {
      console.log('[generateTitle] Not enough messages, skipping generation');
      return null;
    }

    console.log('[generateTitle] Current title:', conversation.title);
    console.log('[generateTitle] Message count:', conversation.messages.length);

    // Don't regenerate if title has been customized (not the default truncated message)
    const firstMessage = conversation.messages[0];
    const isDefaultTitle = conversation.title === firstMessage?.content.slice(0, 100) ||
                          conversation.title === 'New Conversation';

    console.log('[generateTitle] Is default title?', isDefaultTitle);

    if (!isDefaultTitle) {
      console.log('[generateTitle] Title already customized, skipping');
      return conversation.title;
    }

    // Get conversation context for title generation
    const context = conversation.messages
      .slice(0, 2)
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n\n');

    // Use cheapest model for title generation
    console.log('[generateTitle] Calling Anthropic API for title generation...');
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

    console.log('[generateTitle] Generated title:', title);

    // Update conversation title
    console.log('[generateTitle] Updating database with new title...');
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { title },
    });

    console.log('[generateTitle] Title generation complete!');
    return title;
  } catch (error: any) {
    console.error('Title generation error:', error);
    return null;
  }
}
