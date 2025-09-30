'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChatMessage, CLAUDE_MODELS } from '@/types';

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
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(CLAUDE_MODELS[0].id);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId);
  const [skipNextFetch, setSkipNextFetch] = useState(false);

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
  }, [conversationId]);

  const fetchMessages = async (convId: string) => {
    try {
      const response = await fetch(`/api/conversations/${convId}/messages`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(
        data.map((msg: any) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
        }))
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    const isFirstMessage = messages.length === 0;
    console.log('[ChatInterface] Sending message, isFirstMessage:', isFirstMessage, 'current message count:', messages.length);
    setInputValue('');
    setIsLoading(true);

    // Add user message immediately
    const tempUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMessage,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      // Create conversation if this is the first message
      let convId = currentConversationId;
      if (!convId) {
        const createResponse = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: selectedModel,
            title: userMessage.slice(0, 50),
          }),
        });

        if (!createResponse.ok) {
          throw new Error('Failed to create conversation');
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: convId,
          message: userMessage,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Handle SSE streaming
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let assistantMessageId = '';

      if (reader) {
        const assistantMsgTemp: ChatMessage = {
          id: `temp-assistant-${Date.now()}`,
          role: 'assistant',
          content: '',
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsgTemp]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();

              if (data === '[DONE]') {
                break;
              }

              try {
                const parsed = JSON.parse(data);

                if (parsed.type === 'content') {
                  assistantMessage += parsed.content;
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastMsg = updated[updated.length - 1];
                    if (lastMsg.role === 'assistant') {
                      lastMsg.content = assistantMessage;
                    }
                    return updated;
                  });
                } else if (parsed.type === 'done' && parsed.messageId) {
                  assistantMessageId = parsed.messageId;
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }

        // Update with final message ID
        if (assistantMessageId) {
          setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg.role === 'assistant') {
              lastMsg.id = assistantMessageId;
            }
            return updated;
          });
        }

        // Refresh conversation list after streaming completes
        // This will pick up any title changes from auto-generation
        if (isFirstMessage) {
          // First exchange complete, title may have been generated
          console.log('[ChatInterface] First message complete, scheduling title refresh...');
          setTimeout(() => {
            console.log('[ChatInterface] Refreshing conversation list for title update');
            onConversationUpdated?.();
          }, 3000); // Delay to ensure title generation completes
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, there was an error processing your message. Please try again.',
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, currentConversationId, selectedModel, onConversationCreated, onConversationUpdated, messages.length]);

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

        <div className="text-sm text-muted-foreground">
          {currentConversationId ? (
            <span>{messages.length} messages</span>
          ) : (
            <span>New conversation</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Input */}
      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSendMessage}
        disabled={isLoading}
      />
    </div>
  );
}
