/**
 * Daily invitation logic.
 *
 * Selects the brightest Twin, resolves where it stirs in everyday life,
 * and picks a single invitation — not what to do, but what to notice.
 * (SYSTEM.md §8)
 */

import type { Planet, TwinState, DailyInvitation, HouseNumber } from './types';
import { getHouseAxis } from './houses';
import invitationsData from '../data/invitations.json';

// ─── Twin ID mapping ───────────────────────────────────────────────────────────

type TwinId =
  | 'witness' | 'vessel' | 'silence' | 'root' | 'pause'
  | 'depth' | 'membrane' | 'drift' | 'vesselOfForm' | 'weave';

const PLANET_TO_TWIN_ID: Record<Planet, TwinId> = {
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

// ─── Data access ───────────────────────────────────────────────────────────────

interface TwinInvitations {
  twinName: string;
  planet: string;
  invitations: string[];
}

const data = invitationsData as Record<string, TwinInvitations | Record<string, string>>;
const houseDescriptions = invitationsData.houseDescriptions as Record<string, string>;

function getTwinEntry(planet: Planet): TwinInvitations | undefined {
  const id = PLANET_TO_TWIN_ID[planet];
  const entry = data[id];
  if (!entry || !('invitations' in entry)) return undefined;
  return entry as TwinInvitations;
}

// ─── House axis in everyday language ───────────────────────────────────────────

/**
 * Normalize a house pair to the canonical axis key (lower-higher).
 * e.g. house 7 + opposite 1 → "1-7"
 */
function axisKey(house: HouseNumber): string {
  const opposite = house <= 6 ? house + 6 : house - 6;
  const low = Math.min(house, opposite);
  const high = Math.max(house, opposite);
  return `${low}-${high}`;
}

/**
 * Get a human-readable, felt description of where the Twin stirs.
 * Uses the houseDescriptions from invitations data.
 * e.g. "this stirs in how you meet the world and how you meet others"
 */
export function getHouseFelt(house: HouseNumber): string {
  const key = axisKey(house);
  return houseDescriptions[key] ?? 'this stirs somewhere you haven\'t looked';
}

// ─── Invitation selection ──────────────────────────────────────────────────────

/**
 * Select an invitation deterministically based on the current date.
 * Same Twin on the same day always yields the same invitation,
 * but different days rotate through the available invitations.
 */
function selectInvitation(planet: Planet, date: Date): string {
  const entry = getTwinEntry(planet);
  if (!entry || entry.invitations.length === 0) {
    return 'What do you notice right now?';
  }

  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % entry.invitations.length;
  return entry.invitations[index];
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Generate a daily invitation from the brightest Twin.
 */
export function generateInvitation(
  brightestTwin: TwinState,
  date: Date = new Date()
): DailyInvitation {
  const axis = getHouseAxis(brightestTwin.twinHouse);
  const invitation = selectInvitation(brightestTwin.planet, date);

  return {
    twinName: brightestTwin.twinName,
    planet: brightestTwin.planet,
    intensity: brightestTwin.intensity,
    houseAxis: axis,
    invitationText: invitation,
  };
}
