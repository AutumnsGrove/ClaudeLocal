import { NextResponse } from 'next/server';
import { CLAUDE_MODELS } from '@/types';

export const dynamic = 'force-dynamic';

// GET all available Claude models
export async function GET() {
  return NextResponse.json(CLAUDE_MODELS);
}
