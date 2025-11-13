"use client";

import React, { useState } from "react";
import { Sliders, Brain, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdvancedSettingsProps {
  settings: {
    defaultTemperature?: number;
    defaultMaxTokens?: number;
    extendedThinkingEnabled?: boolean;
  };
  onUpdate: (field: string, value: any) => void;
}

export function AdvancedSettings({
  settings,
  onUpdate,
}: AdvancedSettingsProps) {
  const [temperature, setTemperature] = useState(
    settings.defaultTemperature || 1.0,
  );
  const [maxTokens, setMaxTokens] = useState(
    settings.defaultMaxTokens?.toString() || "4096",
  );
  const [extendedThinking, setExtendedThinking] = useState(
    settings.extendedThinkingEnabled || false,
  );

  const handleTemperatureChange = (value: number[]) => {
    const newTemp = value[0];
    setTemperature(newTemp);
    onUpdate("defaultTemperature", newTemp);
  };

  const handleMaxTokensChange = (value: string) => {
    setMaxTokens(value);
    onUpdate("defaultMaxTokens", parseInt(value));
  };

  const handleExtendedThinkingChange = (checked: boolean) => {
    setExtendedThinking(checked);
    onUpdate("extendedThinkingEnabled", checked);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sliders className="h-4 w-4" />
        <h3 className="text-lg font-medium">Advanced Settings</h3>
        <Badge variant="outline">Expert</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Model Parameters</CardTitle>
          <CardDescription>
            Default values for new conversations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Temperature Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="text-sm text-muted-foreground font-mono">
                {temperature.toFixed(1)}
              </span>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.1}
              value={[temperature]}
              onValueChange={handleTemperatureChange}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Controls randomness: 0 = focused and deterministic, 1 = creative
              and varied
            </p>
          </div>

          {/* Max Tokens Select */}
          <div>
            <Label htmlFor="max-tokens" className="mb-2 block">
              Max Tokens
            </Label>
            <Select value={maxTokens} onValueChange={handleMaxTokensChange}>
              <SelectTrigger id="max-tokens">
                <SelectValue placeholder="Select max tokens" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1024">1,024</SelectItem>
                <SelectItem value="2048">2,048</SelectItem>
                <SelectItem value="4096">4,096 (Default)</SelectItem>
                <SelectItem value="8192">8,192</SelectItem>
                <SelectItem value="16384">16,384</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Maximum number of tokens in the response
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Extended Thinking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Extended Thinking
          </CardTitle>
          <CardDescription>
            Enable deeper reasoning for complex tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="extended-thinking"
              checked={extendedThinking}
              onCheckedChange={handleExtendedThinkingChange}
            />
            <Label
              htmlFor="extended-thinking"
              className="text-sm font-normal cursor-pointer"
            >
              Enable extended thinking by default for new conversations
            </Label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Extended thinking allows the model to reason through problems more
            thoroughly, improving accuracy for complex tasks at the cost of
            additional tokens.
          </p>
        </CardContent>
      </Card>

      {/* Experimental Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Experimental Features
          </CardTitle>
          <CardDescription>
            Try out upcoming features before they're officially released
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox id="beta-features" disabled />
            <Label
              htmlFor="beta-features"
              className="text-sm font-normal text-muted-foreground"
            >
              Beta features (Coming soon)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="multi-modal" disabled />
            <Label
              htmlFor="multi-modal"
              className="text-sm font-normal text-muted-foreground"
            >
              Enhanced multimodal capabilities (Coming soon)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="advanced-caching" disabled />
            <Label
              htmlFor="advanced-caching"
              className="text-sm font-normal text-muted-foreground"
            >
              Advanced prompt caching (Coming soon)
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
