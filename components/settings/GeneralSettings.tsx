"use client";

import React from "react";
import { Info, Database, Cpu } from "lucide-react";
import { CLAUDE_MODELS } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeneralSettingsProps {
  settings: any; // AppSettings from API
  onUpdate: (field: string, value: any) => void;
}

export function GeneralSettings({ settings, onUpdate }: GeneralSettingsProps) {
  const startupOptions = [
    { value: "resume", label: "Resume last conversation" },
    { value: "new", label: "Start new chat" },
  ];

  return (
    <div className="space-y-6">
      {/* Default Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Default Model</CardTitle>
          <CardDescription>
            Model used for new conversations. You can change this per
            conversation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={settings?.defaultModel || "claude-sonnet-4-5-20250929"}
            onValueChange={(value) => onUpdate("defaultModel", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {CLAUDE_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {model.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Startup Behavior */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Startup Behavior</CardTitle>
          <CardDescription>
            Choose what happens when you open ClaudeLocal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={settings?.startupBehavior || "resume"}
            onValueChange={(value) => onUpdate("startupBehavior", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select startup behavior" />
            </SelectTrigger>
            <SelectContent>
              {startupOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            App Information
          </CardTitle>
          <CardDescription>System details and configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                Version
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                ClaudeLocal v0.1.0
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Database className="h-4 w-4 text-muted-foreground" />
                Database
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                SQLite (local)
              </p>
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Info className="h-4 w-4 text-muted-foreground" />
              API Provider
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              Anthropic Claude API
            </p>
            <p className="text-xs text-muted-foreground pl-6 pt-1">
              Using official Anthropic SDK with automatic prompt caching for 90%
              cost reduction on repeated content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
