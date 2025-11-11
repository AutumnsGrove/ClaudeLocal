"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThinkingSectionProps {
  content: string;
  className?: string;
  hasContent?: boolean;
}

export function ThinkingSection({
  content,
  className,
  hasContent,
}: ThinkingSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto-collapse when regular content starts streaming
  useEffect(() => {
    if (hasContent) {
      setIsExpanded(false);
    }
  }, [hasContent]);

  // Return null if content is empty or whitespace
  if (!content || !content.trim()) {
    return null;
  }

  return (
    <div
      className={cn(
        "border-l-2 border-purple-500/50 bg-purple-50/50 dark:bg-purple-950/20 rounded-r-lg overflow-hidden",
        className,
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center gap-2 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-colors text-left"
      >
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
        )}
        <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
        <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
          Model Thinking
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 py-3 border-t border-purple-200/50 dark:border-purple-800/50 bg-purple-100/30 dark:bg-purple-950/40">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}
