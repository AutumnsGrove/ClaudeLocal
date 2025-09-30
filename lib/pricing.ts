/**
 * Pricing utilities for Claude models
 *
 * This module provides accurate, up-to-date pricing information for all Claude models.
 * Prices are maintained based on Anthropic's official pricing page.
 *
 * Future enhancement: Could integrate with OpenRouter API for live pricing updates
 * OpenRouter endpoint: https://openrouter.ai/api/v1/models
 *
 * For now, we use the official Anthropic SDK directly for API calls
 * and maintain pricing data here (updated manually when Anthropic updates pricing).
 */

export interface ModelPricing {
  id: string;
  name: string;
  inputPrice: number; // USD per million tokens
  outputPrice: number; // USD per million tokens
  cachedInputPrice: number; // USD per million tokens (90% off)
  generation: 'Claude 4' | 'Claude 3.5' | 'Claude 3';
  contextWindow: number;
  maxTokens: number;
}

/**
 * Model pricing data - Updated from Anthropic's official pricing
 * Last updated: 2025-01-30
 * Source: https://www.anthropic.com/pricing
 */
export const MODEL_PRICING: Record<string, ModelPricing> = {
  // Claude 4 Family
  'claude-sonnet-4-5-20250929': {
    id: 'claude-sonnet-4-5-20250929',
    name: 'Claude Sonnet 4.5',
    inputPrice: 3.0,
    outputPrice: 15.0,
    cachedInputPrice: 0.3,
    generation: 'Claude 4',
    contextWindow: 200000,
    maxTokens: 8192,
  },
  'claude-opus-4-1-20250514': {
    id: 'claude-opus-4-1-20250514',
    name: 'Claude Opus 4.1',
    inputPrice: 15.0,
    outputPrice: 75.0,
    cachedInputPrice: 1.5,
    generation: 'Claude 4',
    contextWindow: 200000,
    maxTokens: 8192,
  },
  'claude-opus-4-20250514': {
    id: 'claude-opus-4-20250514',
    name: 'Claude Opus 4',
    inputPrice: 15.0,
    outputPrice: 75.0,
    cachedInputPrice: 1.5,
    generation: 'Claude 4',
    contextWindow: 200000,
    maxTokens: 8192,
  },
  'claude-sonnet-4-20250514': {
    id: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    inputPrice: 3.0,
    outputPrice: 15.0,
    cachedInputPrice: 0.3,
    generation: 'Claude 4',
    contextWindow: 200000,
    maxTokens: 8192,
  },

  // Claude 3.5 Family
  'claude-3-5-sonnet-20241022': {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    inputPrice: 3.0,
    outputPrice: 15.0,
    cachedInputPrice: 0.3,
    generation: 'Claude 3.5',
    contextWindow: 200000,
    maxTokens: 8192,
  },
  'claude-3-5-haiku-20241022': {
    id: 'claude-3-5-haiku-20241022',
    name: 'Claude 3.5 Haiku',
    inputPrice: 1.0,
    outputPrice: 5.0,
    cachedInputPrice: 0.1,
    generation: 'Claude 3.5',
    contextWindow: 200000,
    maxTokens: 8192,
  },

  // Claude 3 Family (Legacy)
  'claude-3-opus-20240229': {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    inputPrice: 15.0,
    outputPrice: 75.0,
    cachedInputPrice: 1.5,
    generation: 'Claude 3',
    contextWindow: 200000,
    maxTokens: 4096,
  },
  'claude-3-sonnet-20240229': {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    inputPrice: 3.0,
    outputPrice: 15.0,
    cachedInputPrice: 0.3,
    generation: 'Claude 3',
    contextWindow: 200000,
    maxTokens: 4096,
  },
  'claude-3-haiku-20240307': {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    inputPrice: 0.25,
    outputPrice: 1.25,
    cachedInputPrice: 0.025,
    generation: 'Claude 3',
    contextWindow: 200000,
    maxTokens: 4096,
  },
};

/**
 * Calculate cost for a given usage
 */
export interface UsageMetrics {
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens?: number;
}

export function calculateCost(modelId: string, usage: UsageMetrics): number {
  const pricing = MODEL_PRICING[modelId];
  if (!pricing) {
    console.warn(`Pricing not found for model: ${modelId}`);
    return 0;
  }

  const inputCost = (usage.inputTokens / 1_000_000) * pricing.inputPrice;
  const outputCost = (usage.outputTokens / 1_000_000) * pricing.outputPrice;
  const cachedCost = ((usage.cachedInputTokens || 0) / 1_000_000) * pricing.cachedInputPrice;

  return inputCost + outputCost + cachedCost;
}

/**
 * Get pricing for a specific model
 */
export function getModelPricing(modelId: string): ModelPricing | null {
  return MODEL_PRICING[modelId] || null;
}

/**
 * Get all model pricing sorted by generation
 */
export function getAllModelPricing(): ModelPricing[] {
  return Object.values(MODEL_PRICING);
}

/**
 * Group models by generation
 */
export function getModelsByGeneration(): Record<string, ModelPricing[]> {
  const grouped: Record<string, ModelPricing[]> = {
    'Claude 4': [],
    'Claude 3.5': [],
    'Claude 3': [],
  };

  Object.values(MODEL_PRICING).forEach((pricing) => {
    grouped[pricing.generation].push(pricing);
  });

  return grouped;
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Calculate savings percentage
 */
export function calculateSavingsPercentage(
  regularPrice: number,
  cachedPrice: number
): number {
  return Math.round(((regularPrice - cachedPrice) / regularPrice) * 100);
}

/**
 * Get the cheapest/fastest model for title generation
 * Prioritizes cost efficiency for short, simple tasks
 */
export function getCheapestModel(): string {
  // Claude 3 Haiku is the cheapest at $0.25/$1.25 per million tokens
  return 'claude-3-haiku-20240307';
}
