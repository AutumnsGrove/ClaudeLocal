import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAnthropicApiKey } from "@/lib/secrets";
import { prisma } from "@/lib/db";
import { generateConversationTitle } from "@/lib/generate-title";
import { calculateMessageCost } from "@/lib/cost-calculator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      messages,
      model = "claude-sonnet-4-5-20250929",
      temperature = 1.0,
      maxTokens = 8192,
      conversationId,
      projectId,
      thinkingEnabled,
    } = body;

    // Handle both 'message' (single) and 'messages' (array) formats
    let messagesToProcess = messages;

    if (!messagesToProcess && message) {
      // If single message provided, need to fetch conversation history first
      if (conversationId) {
        const existingMessages = await prisma.message.findMany({
          where: { conversationId },
          orderBy: { createdAt: "asc" },
        });
        messagesToProcess = [
          ...existingMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: "user", content: message },
        ];
      } else {
        messagesToProcess = [{ role: "user", content: message }];
      }
    }

    if (
      !messagesToProcess ||
      !Array.isArray(messagesToProcess) ||
      messagesToProcess.length === 0
    ) {
      return NextResponse.json(
        { error: "Message or messages array is required" },
        { status: 400 },
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
      const title =
        messagesToProcess[0].content.slice(0, 100) || "New Conversation";
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
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Save user message
    const userMessage = messagesToProcess[messagesToProcess.length - 1];
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: userMessage.content,
      },
    });

    // Prepare messages with prompt caching
    // Mark older messages for caching to save tokens (90% cost reduction!)
    const formattedMessages = messagesToProcess.map(
      (msg: { role: "user" | "assistant"; content: string }, index: number) => {
        const isLastUserMessage = index === messagesToProcess.length - 1;
        const shouldCache = !isLastUserMessage && messagesToProcess.length > 2;

        return {
          role: msg.role,
          content: shouldCache
            ? [
                {
                  type: "text" as const,
                  text: msg.content,
                  cache_control: { type: "ephemeral" as const },
                },
              ]
            : msg.content,
        };
      },
    );

    // Build system message with project instructions (if available)
    const systemMessages: Array<{
      type: "text";
      text: string;
      cache_control: { type: "ephemeral" };
    }> = [];
    if (project?.instructions) {
      // Cache project instructions for huge token savings in multi-turn conversations
      systemMessages.push({
        type: "text" as const,
        text: project.instructions,
        cache_control: { type: "ephemeral" as const },
      });
    }

    // If thinking is enabled, we need a larger max_tokens to accommodate both thinking and response
    // max_tokens must be greater than thinking.budget_tokens
    const effectiveMaxTokens = thinkingEnabled ? 16384 : maxTokens;

    // Create streaming response with prompt caching
    const streamParams: any = {
      model,
      max_tokens: effectiveMaxTokens,
      temperature,
      ...(systemMessages.length > 0 && { system: systemMessages }),
      messages: formattedMessages,
      stream: true,
    };

    // Add thinking parameter if enabled
    if (thinkingEnabled) {
      console.log("[API DEBUG] 🧠 Extended thinking ENABLED - configuring with 10k token budget");
      streamParams.thinking = {
        type: "enabled",
        budget_tokens: 10000,
      };
    } else {
      console.log("[API DEBUG] Extended thinking disabled");
    }

    console.log("[API DEBUG] 📡 Creating Anthropic stream with params:", {
      model: streamParams.model,
      max_tokens: streamParams.max_tokens,
      hasThinking: !!streamParams.thinking,
    });

    const stream = (await anthropic.messages.create(
      streamParams,
    )) as unknown as AsyncIterable<any>;

    let fullResponse = "";

    // Metrics tracking object
    const metrics = {
      startTime: Date.now(),
      firstTokenTime: null as number | null,
      totalTokens: 0,
      inputTokens: 0,
      outputTokens: 0,
      cachedTokens: 0,
      stopReason: "",
      thinkingContent: [] as string[],
      thinkingStartTime: null as number | null,
      thinkingDuration: null as number | null,
      thinkingTokens: 0,
    };

    let currentBlockType: string | null = null;

    // Create a ReadableStream for the response
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const event of stream) {
            console.log("[API DEBUG] 📩 Anthropic event:", event.type, event);

            if (event.type === "message_start") {
              // Capture initial usage data from message start
              if (event.message?.usage) {
                metrics.inputTokens = event.message.usage.input_tokens || 0;
                metrics.outputTokens = event.message.usage.output_tokens || 0;
              }
            } else if (event.type === "content_block_start") {
              // Track block type for thinking content
              currentBlockType = event.content_block.type;
              console.log("[API DEBUG] 📝 Content block started:", currentBlockType);
            } else if (event.type === "content_block_delta") {
              // Capture first token time
              if (metrics.firstTokenTime === null) {
                metrics.firstTokenTime = Date.now();
              }

              // Handle thinking_delta - thinking content comes with delta.thinking
              if (event.delta.type === "thinking_delta") {
                const thinkingText = event.delta.thinking;

                // Track when thinking starts
                if (metrics.thinkingStartTime === null) {
                  metrics.thinkingStartTime = Date.now();
                  console.log("[API DEBUG] 💭 Thinking started");
                }

                console.log("[API DEBUG] 💭 Thinking delta received:", thinkingText);
                metrics.thinkingContent.push(thinkingText);
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: "thinking", content: thinkingText })}\n\n`,
                  ),
                );
              }
              // Handle text_delta - regular response content comes with delta.text
              else if (event.delta.type === "text_delta") {
                const text = event.delta.text;
                fullResponse += text;
                // Send the text chunk to the client
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: "content", content: text })}\n\n`,
                  ),
                );
              }
            } else if (event.type === "content_block_stop") {
              // Send thinking_done event when thinking block completes
              if (currentBlockType === "thinking") {
                // Calculate thinking duration
                if (metrics.thinkingStartTime !== null) {
                  metrics.thinkingDuration = (Date.now() - metrics.thinkingStartTime) / 1000; // Convert to seconds
                }

                // Estimate thinking tokens (rough approximation: 1 token ≈ 4 characters)
                const thinkingText = metrics.thinkingContent.join("");
                metrics.thinkingTokens = Math.ceil(thinkingText.length / 4);

                console.log("[API DEBUG] ✅ Thinking block completed:", {
                  duration: metrics.thinkingDuration,
                  tokens: metrics.thinkingTokens,
                  chunks: metrics.thinkingContent.length,
                });

                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: "thinking_done" })}\n\n`,
                  ),
                );
              }
              console.log("[API DEBUG] 🛑 Content block stopped:", currentBlockType);
              currentBlockType = null;
            } else if (event.type === "message_delta") {
              // Capture cumulative output tokens from message delta
              if (event.usage?.output_tokens) {
                metrics.outputTokens = event.usage.output_tokens;
                metrics.totalTokens =
                  metrics.inputTokens + metrics.outputTokens;
              }
              // Capture stop reason from message delta
              if (event.delta?.stop_reason) {
                metrics.stopReason = event.delta.stop_reason;
              }
            } else if (event.type === "message_stop") {
              // Calculate performance metrics after message is complete
              const duration = (Date.now() - metrics.startTime) / 1000; // in seconds
              const tokensPerSecond =
                metrics.totalTokens > 0 ? metrics.totalTokens / duration : 0;
              const timeToFirstToken = metrics.firstTokenTime
                ? (metrics.firstTokenTime - metrics.startTime) / 1000
                : 0;

              // Calculate cost
              const cost = calculateMessageCost({
                model,
                inputTokens: metrics.inputTokens,
                outputTokens: metrics.outputTokens,
                cachedTokens: metrics.cachedTokens,
              });

              // Save assistant message to database with all metrics
              const assistantMessage = await prisma.message.create({
                data: {
                  conversationId: conversation.id,
                  role: "assistant",
                  content: fullResponse,
                  tokensPerSecond,
                  totalTokens: metrics.totalTokens,
                  inputTokens: metrics.inputTokens,
                  outputTokens: metrics.outputTokens,
                  cachedTokens: metrics.cachedTokens,
                  timeToFirstToken,
                  stopReason: metrics.stopReason,
                  modelConfig: JSON.stringify({
                    model,
                    temperature,
                    maxTokens,
                  }),
                  cost,
                  thinkingContent: metrics.thinkingContent.join(""),
                  thinkingDuration: metrics.thinkingDuration,
                  thinkingTokens: metrics.thinkingTokens,
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
                  console.error("Title generation failed:", err),
                );
              }

              // Send statistics before completion
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "statistics",
                    statistics: {
                      tokensPerSecond,
                      totalTokens: metrics.totalTokens,
                      inputTokens: metrics.inputTokens,
                      outputTokens: metrics.outputTokens,
                      cachedTokens: metrics.cachedTokens,
                      timeToFirstToken,
                      stopReason: metrics.stopReason,
                      modelConfig: JSON.stringify({
                        model,
                        temperature,
                        maxTokens,
                      }),
                      cost,
                      thinkingDuration: metrics.thinkingDuration,
                      thinkingTokens: metrics.thinkingTokens,
                      thinkingContent: metrics.thinkingContent.join(""),
                    },
                  })}\n\n`,
                ),
              );

              // Send completion signal with messageId
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "done", messageId: assistantMessage.id, conversationId: conversation.id })}\n\n`,
                ),
              );
            }
          }
        } catch (error) {
          console.error("Streaming error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`,
            ),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
