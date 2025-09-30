import { NextResponse } from 'next/server';
import { getAllModelPricing, getModelsByGeneration } from '@/lib/pricing';
import { getOpenRouterApiKey } from '@/lib/secrets';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour

/**
 * GET /api/pricing
 * Returns pricing data for all Claude models
 *
 * Query params:
 * - grouped: 'true' to get models grouped by generation
 * - live: 'true' to fetch from OpenRouter API
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const grouped = searchParams.get('grouped') === 'true';
    const useLive = searchParams.get('live') === 'true';

    // Fetch from OpenRouter if requested
    if (useLive) {
      try {
        const openRouterData = await fetchOpenRouterPricing();
        if (openRouterData) {
          return NextResponse.json({
            success: true,
            data: openRouterData,
            metadata: {
              lastUpdated: new Date().toISOString(),
              source: 'OpenRouter API (Live)',
              currency: 'USD',
              unit: 'per million tokens',
            },
          });
        }
      } catch (error) {
        console.warn('OpenRouter fetch failed, falling back to local pricing:', error);
      }
    }

    // Use local pricing data (fallback or default)
    if (grouped) {
      const pricingByGeneration = getModelsByGeneration();
      return NextResponse.json({
        success: true,
        data: pricingByGeneration,
        metadata: {
          lastUpdated: '2025-01-30',
          source: 'Local Pricing Database',
          currency: 'USD',
          unit: 'per million tokens',
        },
      });
    }

    const allPricing = getAllModelPricing();
    return NextResponse.json({
      success: true,
      data: allPricing,
      metadata: {
        lastUpdated: '2025-01-30',
        source: 'Local Pricing Database',
        currency: 'USD',
        unit: 'per million tokens',
      },
    });
  } catch (error: any) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch pricing',
      },
      { status: 500 }
    );
  }
}

/**
 * Fetch live pricing from OpenRouter API
 * OpenRouter provides real-time pricing for all major LLM providers
 */
async function fetchOpenRouterPricing() {
  const apiKey = getOpenRouterApiKey();

  // If no API key, return null to use local pricing
  if (!apiKey) {
    console.log('No OpenRouter API key found, using local pricing');
    return null;
  }

  const response = await fetch('https://openrouter.ai/api/v1/models', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://localhost:3000',
      'X-Title': 'ClaudeLocal',
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();

  // Filter and map Claude models
  const claudeModels = data.data
    .filter((model: any) => model.id.includes('anthropic/claude'))
    .map((model: any) => {
      // Extract generation from model ID
      let generation: 'Claude 4' | 'Claude 3.5' | 'Claude 3' = 'Claude 3';
      if (model.id.includes('claude-4') || model.id.includes('claude-sonnet-4') || model.id.includes('claude-opus-4')) {
        generation = 'Claude 4';
      } else if (model.id.includes('3.5') || model.id.includes('3-5')) {
        generation = 'Claude 3.5';
      }

      // OpenRouter prices are per token, convert to per million
      const inputPrice = parseFloat(model.pricing.prompt) * 1_000_000;
      const outputPrice = parseFloat(model.pricing.completion) * 1_000_000;
      const cachedInputPrice = inputPrice * 0.1; // 90% off

      return {
        id: model.id.replace('anthropic/', ''),
        name: model.name,
        inputPrice,
        outputPrice,
        cachedInputPrice,
        generation,
        contextWindow: model.context_length || 200000,
        maxTokens: model.top_provider?.max_completion_tokens || 8192,
      };
    });

  // Group by generation
  const grouped: Record<string, any[]> = {
    'Claude 4': [],
    'Claude 3.5': [],
    'Claude 3': [],
  };

  claudeModels.forEach((model: any) => {
    grouped[model.generation].push(model);
  });

  return grouped;
}
