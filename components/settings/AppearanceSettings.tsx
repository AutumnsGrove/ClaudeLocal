"use client";

import React from "react";
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
import { Input } from "@/components/ui/input";
import { Sun, Moon, Monitor, Type, Layout } from "lucide-react";

interface AppearanceSettingsProps {
  settings: any; // AppSettings from API
  onUpdate: (field: string, value: any) => void;
}

export function AppearanceSettings({
  settings,
  onUpdate,
}: AppearanceSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Theme Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Theme
          </CardTitle>
          <CardDescription>Choose your preferred color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={settings?.themePreference || "system"}
            onValueChange={(value) => onUpdate("themePreference", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span>System (Auto)</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            System preference will automatically match your device settings
          </p>
        </CardContent>
      </Card>

      {/* Font Size Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Type className="h-5 w-5" />
            Font Size
          </CardTitle>
          <CardDescription>
            Adjust the text size across the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={settings?.fontSize || "medium"}
            onValueChange={(value) => onUpdate("fontSize", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">
                <span className="text-sm">Small</span>
              </SelectItem>
              <SelectItem value="medium">
                <span className="text-base">Medium (Default)</span>
              </SelectItem>
              <SelectItem value="large">
                <span className="text-lg">Large</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Message Density Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Message Density
          </CardTitle>
          <CardDescription>
            Control spacing and padding in chat messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={settings?.messageDensity || "comfortable"}
            onValueChange={(value) => onUpdate("messageDensity", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select density" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">
                <div>
                  <div className="font-medium">Compact</div>
                  <div className="text-xs text-muted-foreground">
                    Minimal spacing, more messages visible
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="comfortable">
                <div>
                  <div className="font-medium">Comfortable (Default)</div>
                  <div className="text-xs text-muted-foreground">
                    Balanced spacing for readability
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="spacious">
                <div>
                  <div className="font-medium">Spacious</div>
                  <div className="text-xs text-muted-foreground">
                    Extra padding for relaxed reading
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Code Font Setting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Code Font</CardTitle>
          <CardDescription>
            Font family used for code blocks and syntax highlighting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            value={settings?.codeFontFamily || "monospace"}
            readOnly
            disabled
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Custom code fonts will be supported in a future update
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
