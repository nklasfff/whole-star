import type { PlanetPosition, ChartState, BirthData } from './types';
import { detectAspects } from './aspects';
import { computeStress } from './stress';
import { deriveTwinState } from './twins';
import { detectActivePairs } from './pairs';

/**
 * Compute chart from pre-calculated positions.
 * Pure function — no ephemeris dependency, safe for client-side use.
 *
 * For the full pipeline (birth data → ephemeris → chart),
 * use the /api/chart route which calls ephemeris server-side.
 */
export function computeChart(
  birthData: BirthData,
  positions: PlanetPosition[]
): ChartState {
  const allAspects = detectAspects(positions);

  const stressResults = positions.map(pos => computeStress(pos, allAspects));

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
  };
}
