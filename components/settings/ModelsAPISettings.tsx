"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Key, Server, Zap } from "lucide-react";

interface ModelsAPISettingsProps {
  settings?: {
    apiTimeout?: number;
    enablePromptCaching?: boolean;
    cacheWriteEnabled?: boolean;
  };
  onUpdate?: (field: string, value: any) => void;
}

export function ModelsAPISettings({
  settings,
  onUpdate,
}: ModelsAPISettingsProps) {
  const [apiKeyStatus, setApiKeyStatus] = useState<string>("Loading...");
  const [apiTimeout, setApiTimeout] = useState(settings?.apiTimeout || 120000);
  const [enablePromptCaching, setEnablePromptCaching] = useState(
    settings?.enablePromptCaching ?? true,
  );
  const [cacheWriteEnabled, setCacheWriteEnabled] = useState(
    settings?.cacheWriteEnabled ?? true,
  );

  // Fetch API key status on mount (server-side check)
  useEffect(() => {
    async function checkApiKey() {
      try {
        const response = await fetch("/api/settings/api-key-status");
        const data = await response.json();
        setApiKeyStatus(data.masked || "Not configured");
      } catch (error) {
        console.error("Failed to check API key status:", error);
        setApiKeyStatus("Error checking status");
      }
    }
    checkApiKey();
  }, []);

  const handleTimeoutChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 30000 && numValue <= 600000) {
      setApiTimeout(numValue);
      onUpdate?.("apiTimeout", numValue);
    }
  };

  const handlePromptCachingChange = (checked: boolean) => {
    setEnablePromptCaching(checked);
    onUpdate?.("enablePromptCaching", checked);
  };

  const handleCacheWriteChange = (checked: boolean) => {
    setCacheWriteEnabled(checked);
    onUpdate?.("cacheWriteEnabled", checked);
  };

  return (
    <div className="space-y-6">
      {/* API Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Key className="h-4 w-4" />
            API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* API Provider */}
          <div className="space-y-2">
            <Label htmlFor="api-provider">API Provider</Label>
            <Input
              id="api-provider"
              value="Anthropic Claude API"
              disabled
              className="bg-muted"
            />
          </div>

          {/* API Key Status */}
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                value={apiKeyStatus}
                disabled
                className="bg-muted font-mono text-sm flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Placeholder for future API key update functionality
                  alert(
                    "API key update functionality coming soon. Please update secrets.json manually.",
                  );
                }}
              >
                Update
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              API key is stored securely in secrets.json
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Request Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Server className="h-4 w-4" />
            Request Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* API Timeout */}
          <div className="space-y-2">
            <Label htmlFor="api-timeout">API Timeout (ms)</Label>
            <Input
              id="api-timeout"
              type="number"
              min={30000}
              max={600000}
              step={1000}
              value={apiTimeout}
              onChange={(e) => handleTimeoutChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Timeout for API requests (30,000 - 600,000 ms). Default: 120,000
              ms (2 minutes)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Caching Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-4 w-4" />
            Prompt Caching
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enable Prompt Caching */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="enable-caching"
              checked={enablePromptCaching}
              onCheckedChange={handlePromptCachingChange}
            />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor="enable-caching"
                className="font-medium cursor-pointer"
              >
                Enable Prompt Caching
              </Label>
              <p className="text-xs text-muted-foreground">
                Cache prompts to reduce costs by up to 90% on repeated context
              </p>
            </div>
          </div>

          {/* Cache Write Enabled */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="cache-write"
              checked={cacheWriteEnabled}
              onCheckedChange={handleCacheWriteChange}
              disabled={!enablePromptCaching}
            />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor="cache-write"
                className={`font-medium ${enablePromptCaching ? "cursor-pointer" : "opacity-50"}`}
              >
                Cache Write Enabled
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow writing new cache entries (disable to only use existing
                cache)
              </p>
            </div>
          </div>

          {!enablePromptCaching && (
            <p className="text-xs text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded">
              Note: Cache write is disabled when prompt caching is off
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
