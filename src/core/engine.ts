import type { PlanetPosition, ChartState, BirthData, TransitPosition, TransitAspect } from './types';
import { detectAspects } from './aspects';
import { computeStress } from './stress';
import { deriveTwinState } from './twins';
import { detectActivePairs } from './pairs';
import { detectTransitAspects, computeTransitStress } from './transits';

/**
 * Compute chart from pre-calculated positions.
 * Pure function — no ephemeris dependency, safe for client-side use.
 *
 * @param birthData Birth data
 * @param positions Natal planet positions
 * @param transitPositions Optional current planet positions for transit calculation
 * @param transitDate Optional ISO date string for the transit calculation
 */
export function computeChart(
  birthData: BirthData,
  positions: PlanetPosition[],
  transitPositions?: TransitPosition[],
  transitDate?: string
): ChartState {
  const allAspects = detectAspects(positions);

  // Compute transit aspects if transit positions are provided
  let transitAspects: TransitAspect[] = [];
  if (transitPositions && transitPositions.length > 0) {
    transitAspects = detectTransitAspects(transitPositions, positions);
  }

  // Compute stress for each planet, including transit component
  const stressResults = positions.map(pos => {
    const transit = transitPositions
      ? computeTransitStress(pos.planet, transitAspects)
      : 0;
    return computeStress(pos, allAspects, transit);
  });

  const twinStates = positions.map((pos, i) =>
    deriveTwinState(stressResults[i], pos.house)
  );

  const activePairs = detectActivePairs(twinStates);

  const brightestTwin = twinStates.reduce((brightest, current) =>
    current.intensity > brightest.intensity ? current : brightest
  );

  return {
    birthData,
    positions,
    stressResults,
    twinStates,
    activePairs,
    brightestTwin,
    transitDate,
    transitPositions,
    transitAspects: transitAspects.length > 0 ? transitAspects : undefined,
  };
}
