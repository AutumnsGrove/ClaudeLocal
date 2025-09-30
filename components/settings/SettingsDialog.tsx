'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, DollarSign, Info, Palette } from 'lucide-react';
import { PricingPanel } from './PricingPanel';
import { Separator } from '@/components/ui/separator';

type TabType = 'pricing' | 'general' | 'appearance';

interface SettingsDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({ children, open, onOpenChange }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pricing');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure ClaudeLocal settings and view pricing information
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 space-y-1 flex-shrink-0">
            <Button
              variant={activeTab === 'pricing' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('pricing')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </Button>
            <Button
              variant={activeTab === 'general' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('general')}
            >
              <Info className="h-4 w-4 mr-2" />
              General
            </Button>
            <Button
              variant={activeTab === 'appearance' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('appearance')}
            >
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </Button>
          </div>

          <Separator orientation="vertical" className="h-auto" />

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto pr-2">
            {activeTab === 'pricing' && <PricingPanel />}

            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">General Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure general application settings
                  </p>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Version</h4>
                    <p className="text-sm text-muted-foreground">ClaudeLocal v0.1.0</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Database</h4>
                    <p className="text-sm text-muted-foreground">SQLite (local)</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">API Provider</h4>
                    <p className="text-sm text-muted-foreground">Anthropic Claude API</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Appearance</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize how ClaudeLocal looks
                  </p>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Theme</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Use the theme toggle in the sidebar to switch between light and dark modes
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Font</h4>
                    <p className="text-sm text-muted-foreground">
                      Default system font (Inter)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
