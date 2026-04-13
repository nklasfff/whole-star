import type { Planet, StressResult, TwinState, HouseNumber, TwinDefinition } from './types';
import { OPPOSITE_HOUSE } from './types';
import twinsData from '../data/twins.json';

const definitions = twinsData as TwinDefinition[];

export function getTwinName(planet: Planet): string {
  const def = definitions.find(d => d.planet === planet);
  return def?.name ?? `Twin of ${planet}`;
}

export function getTwinDefinition(planet: Planet): TwinDefinition | undefined {
  return definitions.find(d => d.planet === planet);
}

export function deriveTwinState(
  stress: StressResult,
  planetHouse: HouseNumber
): TwinState {
  return {
    planet: stress.planet,
    twinName: getTwinName(stress.planet),
    intensity: stress.stressIndex,
    twinHouse: OPPOSITE_HOUSE[planetHouse],
    planetHouse,
  };
}
