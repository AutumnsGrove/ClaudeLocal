/**
 * Cost calculation utilities for Claude models
 * Pricing data as of 2025-11-11
 */

/**
 * Model pricing information in dollars per million tokens
 * Input: base input token cost
 * Output: base output token cost
 * Cached: cost for cached tokens (90% discount applied)
 */
export const MODEL_PRICING = {
  "claude-sonnet-4-5-20250929": {
    input: 3.0,
    output: 15.0,
    cached: 0.3,
  },
  "claude-opus-4-1-20250514": {
    input: 15.0,
    output: 75.0,
    cached: 1.5,
  },
  "claude-opus-4-20250514": {
    input: 15.0,
    output: 75.0,
    cached: 1.5,
  },
  "claude-sonnet-4-20250514": {
    input: 3.0,
    output: 15.0,
    cached: 0.3,
  },
  "claude-haiku-4-5-20251001": {
    input: 1.0,
    output: 5.0,
    cached: 0.1,
  },
  "claude-3-5-haiku-20241022": {
    input: 1.0,
    output: 5.0,
    cached: 0.1,
  },
} as const;

/**
 * Type for model names
 */
export type ModelName = keyof typeof MODEL_PRICING;

/**
 * Parameters for cost calculation
 */
export interface CostCalculationParams {
  /** Model identifier */
  model: string;
  /** Number of input tokens */
  inputTokens: number;
  /** Number of output tokens */
  outputTokens: number;
  /** Number of cached tokens */
  cachedTokens: number;
}

/**
 * Calculates the cost of a message based on token usage
 *
 * @param params - Cost calculation parameters
 * @returns Calculated cost in dollars
 */
export function calculateMessageCost(params: CostCalculationParams): number {
  const { model, inputTokens, outputTokens, cachedTokens } = params;

  const pricing = MODEL_PRICING[model as ModelName];

  if (!pricing) {
    console.warn(
      `Unknown model: ${model}. Unable to calculate cost. Available models: ${Object.keys(
        MODEL_PRICING,
      ).join(", ")}`,
    );
    return 0;
  }

  // Cost per million tokens converted to cost per token (divide by 1,000,000)
  const inputCost = (inputTokens * pricing.input) / 1_000_000;
  const outputCost = (outputTokens * pricing.output) / 1_000_000;
  const cachedCost = (cachedTokens * pricing.cached) / 1_000_000;

  return inputCost + outputCost + cachedCost;
}

/**
 * Formats a cost value as a currency string
 *
 * @param cost - Cost in dollars
 * @returns Formatted currency string (e.g., "$0.0015")
 */
export function formatCost(cost: number): string {
  return `$${cost.toFixed(4)}`;
}
