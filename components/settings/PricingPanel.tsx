'use client';

import React from 'react';
import { Info, DollarSign, Zap } from 'lucide-react';
import { CLAUDE_MODELS } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ModelPricing {
  id: string;
  name: string;
  inputPrice: number; // per million tokens
  outputPrice: number; // per million tokens
  cachedInputPrice: number; // per million tokens (90% off)
  generation: 'Claude 4' | 'Claude 3.5' | 'Claude 3';
}

const MODEL_PRICING: ModelPricing[] = [
  // Claude 4 Family
  {
    id: 'claude-sonnet-4-5-20250929',
    name: 'Claude Sonnet 4.5',
    inputPrice: 3.0,
    outputPrice: 15.0,
    cachedInputPrice: 0.3,
    generation: 'Claude 4',
  },
  {
    id: 'claude-opus-4-1-20250514',
    name: 'Claude Opus 4.1',
    inputPrice: 15.0,
    outputPrice: 75.0,
    cachedInputPrice: 1.5,
    generation: 'Claude 4',
  },
  {
    id: 'claude-opus-4-20250514',
    name: 'Claude Opus 4',
    inputPrice: 15.0,
    outputPrice: 75.0,
    cachedInputPrice: 1.5,
    generation: 'Claude 4',
  },
  {
    id: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    inputPrice: 3.0,
    outputPrice: 15.0,
    cachedInputPrice: 0.3,
    generation: 'Claude 4',
  },
  // Claude 3.5 Family
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    inputPrice: 3.0,
    outputPrice: 15.0,
    cachedInputPrice: 0.3,
    generation: 'Claude 3.5',
  },
  {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    inputPrice: 1.0,
    outputPrice: 5.0,
    cachedInputPrice: 0.1,
    generation: 'Claude 3.5',
  },
  // Claude 3 Family
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    inputPrice: 15.0,
    outputPrice: 75.0,
    cachedInputPrice: 1.5,
    generation: 'Claude 3',
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    inputPrice: 3.0,
    outputPrice: 15.0,
    cachedInputPrice: 0.3,
    generation: 'Claude 3',
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    inputPrice: 0.25,
    outputPrice: 1.25,
    cachedInputPrice: 0.025,
    generation: 'Claude 3',
  },
];

function PricingRow({ pricing }: { pricing: ModelPricing }) {
  const model = CLAUDE_MODELS.find((m) => m.id === pricing.id);
  const savings = ((1 - pricing.cachedInputPrice / pricing.inputPrice) * 100).toFixed(0);

  return (
    <div className="grid grid-cols-12 gap-4 py-3 px-4 hover:bg-muted/50 rounded-lg transition-colors">
      <div className="col-span-4 flex flex-col">
        <span className="font-medium text-sm">{pricing.name}</span>
        <span className="text-xs text-muted-foreground">{model?.description}</span>
      </div>
      <div className="col-span-2 flex flex-col justify-center">
        <span className="text-sm font-mono">${pricing.inputPrice.toFixed(2)}</span>
        <span className="text-xs text-muted-foreground">per MTok</span>
      </div>
      <div className="col-span-2 flex flex-col justify-center">
        <span className="text-sm font-mono">${pricing.outputPrice.toFixed(2)}</span>
        <span className="text-xs text-muted-foreground">per MTok</span>
      </div>
      <div className="col-span-2 flex flex-col justify-center">
        <span className="text-sm font-mono text-green-600 dark:text-green-400">
          ${pricing.cachedInputPrice.toFixed(2)}
        </span>
        <span className="text-xs text-muted-foreground">per MTok</span>
      </div>
      <div className="col-span-2 flex items-center justify-center">
        <Badge variant="secondary" className="text-xs">
          {savings}% off
        </Badge>
      </div>
    </div>
  );
}

export function PricingPanel() {
  const groupedPricing = MODEL_PRICING.reduce((acc, pricing) => {
    if (!acc[pricing.generation]) {
      acc[pricing.generation] = [];
    }
    acc[pricing.generation].push(pricing);
    return acc;
  }, {} as Record<string, ModelPricing[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
            Automatic Prompt Caching Active
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            ClaudeLocal automatically caches conversation history and project instructions,
            reducing your API costs by up to 90%. Cached prices are shown below.
          </p>
        </div>
      </div>

      {/* Pricing Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 pb-2 border-b text-xs font-medium text-muted-foreground">
        <div className="col-span-4">Model</div>
        <div className="col-span-2">Input</div>
        <div className="col-span-2">Output</div>
        <div className="col-span-2">Cached Input</div>
        <div className="col-span-2 text-center">Savings</div>
      </div>

      {/* Model Groups */}
      {Object.entries(groupedPricing).map(([generation, models]) => (
        <Card key={generation}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {generation === 'Claude 4' && (
                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500">
                  Latest
                </Badge>
              )}
              {generation}
            </CardTitle>
            <CardDescription>
              {generation === 'Claude 4'
                ? 'Latest generation models with advanced reasoning'
                : generation === 'Claude 3.5'
                ? 'Previous generation with excellent performance'
                : 'Legacy models with proven reliability'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {models.map((pricing) => (
              <PricingRow key={pricing.id} pricing={pricing} />
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Cost Example */}
      <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Cost Example: 10-Message Conversation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Without Caching:</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">$0.15</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">With Caching:</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">$0.03</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 font-medium">
            <Zap className="h-4 w-4" />
            <span>80% savings automatically applied!</span>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className="text-xs text-muted-foreground space-y-1 p-4 bg-muted/50 rounded-lg">
        <p>
          <strong>Note:</strong> Prices are per million tokens (MTok). Actual costs depend on
          your usage patterns.
        </p>
        <p>
          <strong>Cache Duration:</strong> 5 minutes. Repeated requests within this window use
          cached pricing.
        </p>
        <p>
          <strong>Minimum Cache Size:</strong> 1024 tokens. Smaller contexts aren't cached.
        </p>
        <p className="mt-2">
          See{' '}
          <a
            href="https://www.anthropic.com/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            anthropic.com/pricing
          </a>{' '}
          for official pricing details.
        </p>
      </div>
    </div>
  );
}
