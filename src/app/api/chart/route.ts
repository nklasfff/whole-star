import { NextRequest, NextResponse } from 'next/server';
import { calculatePositions } from '@/core/ephemeris';
import { computeChart } from '@/core/engine';
import type { BirthData } from '@/core/types';

export async function POST(request: NextRequest) {
  try {
    const birthData: BirthData = await request.json();

    // Validate
    if (!birthData.date || !birthData.time) {
      return NextResponse.json({ error: 'Missing date or time' }, { status: 400 });
    }

    // Calculate positions server-side (swisseph-wasm needs Node.js)
    const positions = await calculatePositions(birthData);
    const chart = computeChart(birthData, positions);

    return NextResponse.json(chart);
  } catch (error) {
    console.error('Chart calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate chart' },
      { status: 500 }
    );
  }
}
