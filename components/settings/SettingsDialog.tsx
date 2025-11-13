"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Settings,
  DollarSign,
  Info,
  Palette,
  Key,
  Sliders,
  Loader2,
} from "lucide-react";
import { PricingPanel } from "./PricingPanel";
import { GeneralSettings } from "./GeneralSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { ModelsAPISettings } from "./ModelsAPISettings";
import { AdvancedSettings } from "./AdvancedSettings";
import { Separator } from "@/components/ui/separator";

type TabType = "general" | "appearance" | "models" | "advanced" | "pricing";

interface SettingsDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({
  children,
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings when dialog opens
  useEffect(() => {
    if (open) {
      fetchSettings();
    }
  }, [open]);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (field: string, value: any) => {
    const updatedSettings = { ...settings, [field]: value };
    setSettings(updatedSettings);

    // Auto-save on change
    try {
      setIsSaving(true);
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        console.error("Failed to save settings");
        // Revert on error
        fetchSettings();
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      // Revert on error
      fetchSettings();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
            {isSaving && (
              <span className="text-sm text-muted-foreground ml-2">
                Saving...
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            Configure ClaudeLocal settings and view pricing information
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 space-y-1 flex-shrink-0">
            <Button
              variant={activeTab === "general" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("general")}
            >
              <Info className="h-4 w-4 mr-2" />
              General
            </Button>
            <Button
              variant={activeTab === "appearance" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("appearance")}
            >
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </Button>
            <Button
              variant={activeTab === "models" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("models")}
            >
              <Key className="h-4 w-4 mr-2" />
              Models & API
            </Button>
            <Button
              variant={activeTab === "advanced" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("advanced")}
            >
              <Sliders className="h-4 w-4 mr-2" />
              Advanced
            </Button>
            <Button
              variant={activeTab === "pricing" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("pricing")}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </Button>
          </div>

          <Separator orientation="vertical" className="h-auto" />

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {activeTab === "general" && (
                  <GeneralSettings
                    settings={settings}
                    onUpdate={handleUpdate}
                  />
                )}

                {activeTab === "appearance" && (
                  <AppearanceSettings
                    settings={settings}
                    onUpdate={handleUpdate}
                  />
                )}

                {activeTab === "models" && (
                  <ModelsAPISettings
                    settings={settings}
                    onUpdate={handleUpdate}
                  />
                )}

                {activeTab === "advanced" && (
                  <AdvancedSettings
                    settings={settings}
                    onUpdate={handleUpdate}
                  />
                )}

                {activeTab === "pricing" && <PricingPanel />}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
