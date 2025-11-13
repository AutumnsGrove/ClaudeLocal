"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { SessionCostTracker } from "./SessionCostTracker";
import { Menu, Sliders, MoreVertical, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChatMessage, CLAUDE_MODELS } from "@/types";

interface ChatInterfaceProps {
  conversationId: string | null;
  onConversationCreated?: (conversationId: string) => void;
  onConversationUpdated?: () => void;
  onToggleSidebar?: () => void;
}

export function ChatInterface({
  conversationId,
  onConversationCreated,
  onConversationUpdated,
  onToggleSidebar,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(CLAUDE_MODELS[0].id);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(conversationId);
  const [skipNextFetch, setSkipNextFetch] = useState(false);
  const [thinkingEnabled, setThinkingEnabled] = useState(false);
  const [appSettings, setAppSettings] = useState<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const shouldAutoSendRef = useRef(false);

  // Load app settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setAppSettings(data);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    loadSettings();
  }, []);

  // Apply default model from settings for new conversations
  useEffect(() => {
    if (appSettings?.defaultModel && !currentConversationId) {
      setSelectedModel(appSettings.defaultModel);
    }
  }, [appSettings, currentConversationId]);

  // Apply default thinking mode from settings
  useEffect(() => {
    if (appSettings?.enableThinking !== undefined && !currentConversationId) {
      setThinkingEnabled(appSettings.enableThinking);
    }
  }, [appSettings, currentConversationId]);

  // Fetch messages when conversationId changes
  useEffect(() => {
    if (conversationId) {
      // Skip fetch if we just created this conversation (messages already in state)
      if (skipNextFetch && conversationId === currentConversationId) {
        setSkipNextFetch(false);
        return;
      }
      fetchMessages(conversationId);
      setCurrentConversationId(conversationId);
    } else {
      setMessages([]);
      setCurrentConversationId(null);
    }
  }, [conversationId, skipNextFetch, currentConversationId]);

  const fetchMessages = async (convId: string) => {
    try {
      const response = await fetch(`/api/conversations/${convId}/messages`);
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(
        data.map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
        })),
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleStopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  const handleRegenerate = useCallback(
    async (messageId: string) => {
      if (isLoading || !currentConversationId) return;

      // Find the message to regenerate
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1 || messages[messageIndex].role !== "assistant") {
        return;
      }

      // Find the previous user message
      let userMessageIndex = messageIndex - 1;
      while (
        userMessageIndex >= 0 &&
        messages[userMessageIndex].role === "assistant"
      ) {
        userMessageIndex--;
      }

      if (userMessageIndex < 0) {
        console.error("Could not find user message to regenerate from");
        return;
      }

      const userMessage = messages[userMessageIndex];
      const userMessageContent = userMessage.content;

      // Delete all messages from the message being regenerated onwards
      const messageIdsToDelete = messages.slice(messageIndex).map((m) => m.id);

      try {
        setIsLoading(true);

        // Delete messages from the API
        const deleteResponse = await fetch(
          `/api/conversations/${currentConversationId}/messages`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messageIds: messageIdsToDelete,
            }),
          },
        );

        if (!deleteResponse.ok) {
          console.error("Failed to delete messages");
          setIsLoading(false);
          return;
        }

        // Remove the deleted messages from local state
        setMessages((prev) =>
          prev.filter((m) => !messageIdsToDelete.includes(m.id)),
        );

        // Set input and mark for auto-send
        shouldAutoSendRef.current = true;
        setInputValue(userMessageContent);
      } catch (error) {
        console.error("Error regenerating message:", error);
        setIsLoading(false);
      }
    },
    [messages, isLoading, currentConversationId],
  );

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    const isFirstMessage = messages.length === 0;
    setInputValue("");
    setIsLoading(true);

    // Add user message immediately
    const tempUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: userMessage,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      // Create conversation if this is the first message
      let convId = currentConversationId;
      if (!convId) {
        const createResponse = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: selectedModel,
            title: userMessage.slice(0, 50),
            temperature: appSettings?.defaultTemperature ?? 1.0,
            maxTokens: appSettings?.defaultMaxTokens ?? 4096,
          }),
        });

        if (!createResponse.ok) {
          throw new Error("Failed to create conversation");
        }

        const newConversation = await createResponse.json();
        convId = newConversation.id;
        setCurrentConversationId(convId);
        setSkipNextFetch(true); // Don't refetch - messages already in state
        if (convId) {
          onConversationCreated?.(convId);
        }
      }

      // Send message with SSE streaming
      // Create and store abort controller for this request
      abortControllerRef.current = new AbortController();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: convId,
          message: userMessage,
          model: selectedModel,
          thinkingEnabled,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Handle SSE streaming
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let assistantMessageId = "";

      if (reader) {
        const assistantMsgTemp: ChatMessage = {
          id: `temp-assistant-${Date.now()}`,
          role: "assistant",
          content: "",
          createdAt: new Date(),
          thinkingContent: "", // Explicitly initialize to empty string
        };
        setMessages((prev) => [...prev, assistantMsgTemp]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();

              if (data === "[DONE]") {
                break;
              }

              try {
                const parsed = JSON.parse(data);

                if (parsed.type === "thinking") {
                  // Update thinking content in real-time
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastMsg = updated[updated.length - 1];
                    if (lastMsg.role === "assistant") {
                      lastMsg.thinkingContent =
                        (lastMsg.thinkingContent || "") + parsed.content;
                    }
                    return updated;
                  });
                } else if (parsed.type === "thinking_done") {
                  // Thinking is complete, regular content will start
                  // No action needed - auto-collapse will be handled by ThinkingSection
                } else if (parsed.type === "content") {
                  assistantMessage += parsed.content;
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastMsg = updated[updated.length - 1];
                    if (lastMsg.role === "assistant") {
                      lastMsg.content = assistantMessage;
                    }
                    return updated;
                  });
                } else if (parsed.type === "statistics") {
                  // Update the assistant message with all statistics
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastMsg = updated[updated.length - 1];
                    if (lastMsg.role === "assistant") {
                      Object.assign(lastMsg, parsed.statistics);
                    }
                    return updated;
                  });
                } else if (parsed.type === "done" && parsed.messageId) {
                  assistantMessageId = parsed.messageId;
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }

        // Update with final message ID
        if (assistantMessageId) {
          setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg.role === "assistant") {
              lastMsg.id = assistantMessageId;
            }
            return updated;
          });
        }

        // Refresh conversation list after streaming completes
        // This will pick up any title changes from auto-generation
        if (isFirstMessage) {
          setTimeout(() => {
            onConversationUpdated?.();
          }, 1500); // Delay to ensure title generation completes (Haiku is fast!)
        }
      }
    } catch (error) {
      // Don't show error message if request was aborted (user clicked STOP)
      if (error instanceof Error && error.name === "AbortError") {
        // Request was aborted, no error to show
      } else {
        console.error("Error sending message:", error);
        // Add error message
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "Sorry, there was an error processing your message. Please try again.",
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [
    inputValue,
    isLoading,
    currentConversationId,
    selectedModel,
    thinkingEnabled,
    appSettings?.defaultMaxTokens,
    appSettings?.defaultTemperature,
    onConversationCreated,
    onConversationUpdated,
    messages.length,
  ]);

  // Auto-send message when regenerating
  useEffect(() => {
    if (shouldAutoSendRef.current && inputValue.trim() && !isLoading) {
      shouldAutoSendRef.current = false;
      handleSendMessage();
    }
  }, [inputValue, isLoading, handleSendMessage]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[240px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLAUDE_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {model.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <SessionCostTracker messages={messages} />
          <div className="text-sm text-muted-foreground">
            {currentConversationId ? (
              <span>{messages.length} messages</span>
            ) : (
              <span>New conversation</span>
            )}
          </div>

          {/* Header action buttons - only show when conversation exists */}
          {currentConversationId && (
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => console.log("Toggle chat settings panel")}
                className="p-2 rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Chat settings"
                disabled={isLoading}
              >
                <Sliders className="h-5 w-5" />
              </button>

              <button
                onClick={() => console.log("Export conversation")}
                className="p-2 rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Export conversation"
                disabled={isLoading}
              >
                <Download className="h-5 w-5" />
              </button>

              <button
                onClick={() => console.log("More options")}
                className="p-2 rounded-md hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="More options"
                disabled={isLoading}
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        isLoading={isLoading}
        onRegenerate={handleRegenerate}
      />

      {/* Input */}
      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSendMessage}
        onStop={handleStopStreaming}
        disabled={isLoading}
        thinkingEnabled={thinkingEnabled}
        onThinkingToggle={setThinkingEnabled}
      />
    </div>
  );
}
