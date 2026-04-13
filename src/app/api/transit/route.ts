import { NextRequest, NextResponse } from 'next/server';
import { calculateTransitPositions } from '@/core/ephemeris';
import { computeChart } from '@/core/engine';
import type { ChartState } from '@/core/types';

/**
 * POST /api/transit
 *
 * Recalculates the chart with current transit positions.
 * Accepts a stored ChartState (with natal positions) and returns
 * an updated ChartState with fresh transit data for today.
 *
 * This avoids re-running the ephemeris for natal positions,
 * which haven't changed.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const storedChart: ChartState = body.chart;

    if (!storedChart?.positions || !storedChart?.birthData) {
      return NextResponse.json({ error: 'Missing chart data' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Skip if already calculated for today
    if (storedChart.transitDate === today) {
      return NextResponse.json(storedChart);
    }

    // Calculate fresh transit positions
    const transitPositions = await calculateTransitPositions(today);

    // Recompute chart with new transits (natal positions unchanged)
    const updatedChart = computeChart(
      storedChart.birthData,
      storedChart.positions,
      transitPositions,
      today
    );

    return NextResponse.json(updatedChart);
  } catch (error) {
    console.error('Transit calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate transits' },
      { status: 500 }
    );
  }
}
