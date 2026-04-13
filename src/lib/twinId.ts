/**
 * Twin-id ↔ Planet mapping for URL routing.
 * Twin IDs match the keys in invitations.json.
 */

import type { Planet, TwinState } from '@/core/types';

export type TwinId =
  | 'witness' | 'vessel' | 'silence' | 'root' | 'pause'
  | 'depth' | 'membrane' | 'drift' | 'vesselOfForm' | 'weave';

export const ALL_TWIN_IDS: TwinId[] = [
  'witness', 'vessel', 'silence', 'root', 'pause',
  'depth', 'membrane', 'drift', 'vesselOfForm', 'weave',
];

const PLANET_TO_ID: Record<Planet, TwinId> = {
  Sun: 'witness',
  Moon: 'vessel',
  Mercury: 'silence',
  Venus: 'root',
  Mars: 'pause',
  Jupiter: 'depth',
  Saturn: 'membrane',
  Uranus: 'drift',
  Neptune: 'vesselOfForm',
  Pluto: 'weave',
};

const ID_TO_PLANET: Record<TwinId, Planet> = Object.fromEntries(
  Object.entries(PLANET_TO_ID).map(([planet, id]) => [id, planet])
) as Record<TwinId, Planet>;

export function planetToTwinId(planet: Planet): TwinId {
  return PLANET_TO_ID[planet];
}

export function twinIdToPlanet(id: string): Planet | undefined {
  return ID_TO_PLANET[id as TwinId];
}

export function findTwinByTwinId(id: string, twinStates: TwinState[]): TwinState | undefined {
  const planet = twinIdToPlanet(id);
  if (!planet) return undefined;
  return twinStates.find(t => t.planet === planet);
}

export function getBrightestTwinId(twinStates: TwinState[]): TwinId {
  const brightest = twinStates.reduce((a, b) => a.intensity > b.intensity ? a : b);
  return planetToTwinId(brightest.planet);
}
