"use client";

import React from "react";
import { Zap, Hash, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageStatsProps {
  tokensPerSecond?: number;
  totalTokens?: number;
  inputTokens?: number;
  outputTokens?: number;
  timeToFirstToken?: number;
  stopReason?: string;
  cost?: number;
  className?: string;
}

export function MessageStats({
  tokensPerSecond,
  totalTokens,
  timeToFirstToken,
  stopReason,
  cost,
  className,
}: MessageStatsProps) {
  const stats = [];

  // Tokens per second
  if (tokensPerSecond !== undefined && tokensPerSecond > 0) {
    stats.push(
      <span key="tps" className="flex items-center gap-1">
        <Zap className="h-3 w-3" />
        {tokensPerSecond.toFixed(2)} tok/sec
      </span>
    );
  }

  // Total tokens
  if (totalTokens !== undefined && totalTokens > 0) {
    stats.push(
      <span key="total" className="flex items-center gap-1">
        <Hash className="h-3 w-3" />
        {totalTokens} tokens
      </span>
    );
  }

  // Time to first token
  if (timeToFirstToken !== undefined && timeToFirstToken > 0) {
    stats.push(
      <span key="ttft" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {timeToFirstToken.toFixed(2)}s
      </span>
    );
  }

  // Stop reason
  if (stopReason) {
    stats.push(
      <span key="stop" className="flex items-center">
        {stopReason}
      </span>
    );
  }

  // Cost
  if (cost !== undefined && cost > 0) {
    stats.push(
      <span key="cost" className="flex items-center gap-1">
        <DollarSign className="h-3 w-3" />
        ${cost.toFixed(4)}
      </span>
    );
  }

  // If no stats are available, don't render anything
  if (stats.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground mt-2",
        className
      )}
    >
      {stats.map((stat, index) => (
        <React.Fragment key={stat.key}>
          {index > 0 && <span className="text-muted-foreground/50">•</span>}
          {stat}
        </React.Fragment>
      ))}
    </div>
  );
}
