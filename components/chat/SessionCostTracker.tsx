"use client";

import React, { useMemo } from "react";
import { DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionCostTrackerProps {
  messages: Array<{
    cost?: number;
  }>;
  className?: string;
}

export function SessionCostTracker({
  messages,
  className,
}: SessionCostTrackerProps) {
  // Calculate total cost by summing all message costs
  const totalCost = useMemo(() => {
    return messages.reduce((sum, msg) => sum + (msg.cost || 0), 0);
  }, [messages]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md border bg-muted/50 text-sm text-muted-foreground",
        className,
      )}
    >
      <DollarSign className="h-4 w-4" />
      <span>Session: ${totalCost.toFixed(4)}</span>
    </div>
  );
}
