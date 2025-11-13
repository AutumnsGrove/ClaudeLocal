import { NextResponse } from "next/server";
import { getAnthropicApiKey } from "@/lib/secrets";

/**
 * GET /api/settings/api-key-status
 *
 * Returns masked API key status for display in settings.
 * This endpoint runs server-side to avoid exposing the full API key to the client.
 */
export async function GET() {
  try {
    const apiKey = getAnthropicApiKey();

    // Mask the API key for display
    // Format: sk-ant-***************xyz
    const masked = apiKey
      ? `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 3)}`
      : "Not configured";

    return NextResponse.json({
      configured: !!apiKey,
      masked,
      provider: "Anthropic Claude API",
    });
  } catch (error) {
    // If API key is not found, return not configured status
    return NextResponse.json({
      configured: false,
      masked: "Not configured",
      provider: "Anthropic Claude API",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
