import type { Planet, TwinState, TwinPair, ActiveTwinPair } from './types';
import { TWIN_PAIR_THRESHOLD } from './types';
import pairsData from '../data/pairs.json';

const allPairs = pairsData as TwinPair[];

export function findPairDefinition(p1: Planet, p2: Planet): TwinPair | undefined {
  return allPairs.find(
    pair =>
      (pair.twin1 === p1 && pair.twin2 === p2) ||
      (pair.twin1 === p2 && pair.twin2 === p1)
  );
}

export function detectActivePairs(
  twinStates: TwinState[],
  threshold: number = TWIN_PAIR_THRESHOLD
): ActiveTwinPair[] {
  const active = twinStates.filter(t => t.intensity > threshold);
  const result: ActiveTwinPair[] = [];

  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const t1 = active[i];
      const t2 = active[j];
      const pairDef = findPairDefinition(t1.planet, t2.planet);
      if (pairDef) {
        result.push({
          ...pairDef,
          intensity1: t1.intensity,
          intensity2: t2.intensity,
          combinedIntensity: (t1.intensity + t2.intensity) / 2,
        });
      }
    }
  }

  return result.sort((a, b) => b.combinedIntensity - a.combinedIntensity);
}
