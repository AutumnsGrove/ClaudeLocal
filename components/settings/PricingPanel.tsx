'use client';

import React, { useEffect, useState } from 'react';
import { Info, DollarSign, Zap, Loader2 } from 'lucide-react';
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
  contextWindow: number;
  maxTokens: number;
}

function PricingRow({ pricing, isRecommended }: { pricing: ModelPricing; isRecommended?: boolean }) {
  const model = CLAUDE_MODELS.find((m) => m.id === pricing.id);

  return (
    <div className={`grid grid-cols-12 gap-4 py-3 px-4 rounded-lg transition-colors ${
      isRecommended
        ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
        : 'hover:bg-muted/50'
    }`}>
      <div className="col-span-5 flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{pricing.name}</span>
          {isRecommended && (
            <Badge className="text-xs bg-green-600 dark:bg-green-700">Best Value</Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{model?.description}</span>
      </div>
      <div className="col-span-3 flex flex-col justify-center">
        <span className="text-sm font-mono">${pricing.inputPrice.toFixed(2)} / ${pricing.outputPrice.toFixed(2)}</span>
        <span className="text-xs text-muted-foreground">Input / Output</span>
      </div>
      <div className="col-span-4 flex flex-col justify-center">
        <span className="text-sm font-mono text-green-600 dark:text-green-400 font-semibold">
          ${pricing.cachedInputPrice.toFixed(2)} / ${pricing.outputPrice.toFixed(2)}
        </span>
        <span className="text-xs text-muted-foreground">Cached (90% off input)</span>
      </div>
    </div>
  );
}

export function PricingPanel() {
  const [pricingData, setPricingData] = useState<Record<string, ModelPricing[]>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pricing?grouped=true');
      const result = await response.json();

      if (result.success) {
        setPricingData(result.data);
        setLastUpdated(result.metadata.lastUpdated);
      }
    } catch (error) {
      console.error('Failed to fetch pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const groupedPricing = pricingData;

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

      {/* Why Prompt Caching Section */}
      <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            Why Prompt Caching?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Prompt caching</strong> stores your conversation history and system instructions,
            dramatically reducing costs for multi-turn conversations.
          </p>
          <ul className="space-y-1 ml-4 list-disc text-muted-foreground">
            <li>
              <strong>90% savings on input tokens</strong> - Cached content is reused across requests
            </li>
            <li>
              <strong>Automatic caching</strong> - ClaudeLocal handles this for you transparently
            </li>
            <li>
              <strong>5-minute cache duration</strong> - Perfect for active conversations
            </li>
            <li>
              <strong>1024 token minimum</strong> - Ensures caching only applies when beneficial
            </li>
          </ul>
          <p className="text-xs text-muted-foreground pt-2">
            All prices below show cached input pricing, which is what you'll actually pay for ongoing conversations.
          </p>
        </CardContent>
      </Card>

      {/* Pricing Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 pb-2 border-b text-xs font-medium text-muted-foreground">
        <div className="col-span-5">Model</div>
        <div className="col-span-3">Regular Pricing</div>
        <div className="col-span-4">With Caching (90% off input)</div>
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
                ? 'Excellent performance with great cost efficiency'
                : 'Legacy models with proven reliability'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {models.map((pricing) => (
              <PricingRow
                key={pricing.id}
                pricing={pricing}
                isRecommended={pricing.id === 'claude-3-5-haiku-20241022'}
              />
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
        {lastUpdated && (
          <p>
            <strong>Pricing Last Updated:</strong> {lastUpdated}
          </p>
        )}
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
