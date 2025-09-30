import { readFileSync } from 'fs';
import { join } from 'path';

interface Secrets {
  anthropic_api_key?: string;
}

let secrets: Secrets = {};

try {
  const secretsPath = join(process.cwd(), 'secrets.json');
  const secretsData = readFileSync(secretsPath, 'utf-8');
  secrets = JSON.parse(secretsData);
  console.log('✓ Loaded API keys from secrets.json');
} catch (error) {
  console.warn('⚠ secrets.json not found. Using environment variables as fallback.');
}

export function getAnthropicApiKey(): string {
  const apiKey = secrets.anthropic_api_key || process.env.ANTHROPIC_API_KEY || '';

  if (!apiKey) {
    throw new Error(
      'Anthropic API key not found. Please add it to secrets.json or set ANTHROPIC_API_KEY environment variable.'
    );
  }

  return apiKey;
}
