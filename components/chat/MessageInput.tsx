"use client";

import React, { useRef, useEffect, useState, KeyboardEvent } from "react";
import { Send, Paperclip, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  thinkingEnabled?: boolean;
  onThinkingToggle?: (enabled: boolean) => void;
}

export function MessageInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Type your message...",
  thinkingEnabled = false,
  onThinkingToggle,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isThinkingEnabled, setIsThinkingEnabled] = useState(thinkingEnabled);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSubmit();
    }
  };

  const handleThinkingToggle = () => {
    const newValue = !isThinkingEnabled;
    setIsThinkingEnabled(newValue);
    onThinkingToggle?.(newValue);
  };

  return (
    <div className="border-t bg-background p-4">
      <div className="flex gap-2 items-end">
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="flex-shrink-0"
          title="Attach file (coming soon)"
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleThinkingToggle}
          disabled={disabled}
          className={cn(
            "h-10 w-10 flex-shrink-0",
            isThinkingEnabled && "bg-primary/10 text-primary",
          )}
          title="Enable extended thinking"
        >
          <Brain className="h-5 w-5" />
        </Button>

        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "min-h-[60px] max-h-[200px] resize-none pr-12",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            rows={1}
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {value.length > 0 && <span>{value.length} chars</span>}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          size="icon"
          className="flex-shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 ml-14">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
