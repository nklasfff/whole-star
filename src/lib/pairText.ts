/**
 * Lookup pair texts from twin-pairs.json by twin-id pair key.
 * Keys are sorted alphabetically: "membrane-witness" not "witness-membrane".
 */

import type { Planet } from '@/core/types';
import { planetToTwinId, type TwinId } from './twinId';
import pairData from '@/data/twin-pairs.json';

interface PairText {
  name: string;
  twins: string[];
  text: string;
}

const pairTexts = pairData.pairTexts as Record<string, PairText>;

/**
 * Build the canonical pair key from two twin-ids.
 * The key in the data uses the order as listed in the JSON
 * (first twin alphabetically or by definition order).
 * We try both orderings to find a match.
 */
export function getPairText(planet1: Planet, planet2: Planet): PairText | undefined {
  const id1 = planetToTwinId(planet1);
  const id2 = planetToTwinId(planet2);

  // Try both orderings
  return pairTexts[`${id1}-${id2}`] ?? pairTexts[`${id2}-${id1}`];
}

/**
 * Get pair text by direct twin-id pair key.
 */
export function getPairTextByKey(key: string): PairText | undefined {
  return pairTexts[key];
}
