"use client";

import React, { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatMessage } from "@/types";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading = false }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">No messages yet</p>
          <p className="text-sm">
            Start a conversation by sending a message below
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          role={message.role}
          content={message.content}
          thinkingContent={message.thinkingContent}
          error={message.error}
          // Statistics props
          tokensPerSecond={message.tokensPerSecond}
          totalTokens={message.totalTokens}
          inputTokens={message.inputTokens}
          outputTokens={message.outputTokens}
          cachedTokens={message.cachedTokens}
          timeToFirstToken={message.timeToFirstToken}
          stopReason={message.stopReason}
          cost={message.cost}
        />
      ))}

      {isLoading && (
        <div className="flex gap-3 mb-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Loader2 className="h-5 w-5 text-primary-foreground animate-spin" />
          </div>
          <div className="rounded-lg px-4 py-3 bg-muted text-foreground">
            <div className="flex items-center gap-2">
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
