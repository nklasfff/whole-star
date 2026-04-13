import { NextRequest, NextResponse } from 'next/server';
import { calculatePositions, calculateTransitPositions } from '@/core/ephemeris';
import { computeChart } from '@/core/engine';
import type { BirthData } from '@/core/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const birthData: BirthData = body;
    const transitDate: string | undefined = body.transitDate;

    // Validate
    if (!birthData.date || !birthData.time) {
      return NextResponse.json({ error: 'Missing date or time' }, { status: 400 });
    }

    // Calculate natal positions
    const positions = await calculatePositions(birthData);

    // Calculate transit positions for today (or specified date)
    const today = transitDate ?? new Date().toISOString().split('T')[0];
    const transitPositions = await calculateTransitPositions(today);

    // Compute chart with transit data
    const chart = computeChart(birthData, positions, transitPositions, today);

    return NextResponse.json(chart);
  } catch (error) {
    console.error('Chart calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate chart' },
      { status: 500 }
    );
  }
}
