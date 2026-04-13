/**
 * Daily invitation logic.
 *
 * Selects the brightest Twin, resolves its house axis,
 * and generates an invitation text from templates.
 *
 * The invitation is a question, not a statement.
 * "What if you noticed..." — not "the stars say..."
 * (SYSTEM.md §8)
 */

import type { Planet, TwinState, HouseNumber, DailyInvitation, HouseAxis } from './types';
import { getHouseAxis } from './houses';
import { getTwinDefinition } from './twins';
import invitationsData from '../data/invitations.json';

interface InvitationTemplate {
  twinName: string;
  planet: string;
  templates: string[];
}

const allTemplates = invitationsData.templates as InvitationTemplate[];

/**
 * Select a template deterministically based on the current date.
 * Same Twin on the same day always yields the same invitation,
 * but different days rotate through the available templates.
 */
function selectTemplate(planet: Planet, date: Date): string {
  const entry = allTemplates.find(t => t.planet === planet);
  if (!entry || entry.templates.length === 0) {
    return '{twinName} stirs today. What do you notice?';
  }

  // Day-of-year as rotation index
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % entry.templates.length;
  return entry.templates[index];
}

/** House number names for natural-sounding text */
const HOUSE_NAMES: Record<HouseNumber, string> = {
  1: 'first', 2: 'second', 3: 'third', 4: 'fourth',
  5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth',
  9: 'ninth', 10: 'tenth', 11: 'eleventh', 12: 'twelfth',
};

/**
 * Fill template placeholders with actual chart data.
 */
function fillTemplate(
  template: string,
  twinName: string,
  twinHouse: HouseNumber,
  planetHouse: HouseNumber,
  axis: HouseAxis
): string {
  return template
    .replace(/\{twinName\}/g, twinName)
    .replace(/\{twinHouse\}/g, HOUSE_NAMES[twinHouse])
    .replace(/\{planetHouse\}/g, HOUSE_NAMES[planetHouse])
    .replace(/\{twinHouseTheme\}/g, axis.theme.toLowerCase());
}

/**
 * Generate a daily invitation from the brightest Twin.
 *
 * Structure (SYSTEM.md §8):
 * 1. Which Twin field is brightest today
 * 2. Which house axis it activates
 * 3. An invitation question — not what to do, but what to notice
 */
export function generateInvitation(
  brightestTwin: TwinState,
  date: Date = new Date()
): DailyInvitation {
  const def = getTwinDefinition(brightestTwin.planet);
  const axis = getHouseAxis(brightestTwin.twinHouse);
  const template = selectTemplate(brightestTwin.planet, date);

  const invitationText = fillTemplate(
    template,
    brightestTwin.twinName,
    brightestTwin.twinHouse,
    brightestTwin.planetHouse,
    axis
  );

  return {
    twinName: brightestTwin.twinName,
    planet: brightestTwin.planet,
    intensity: brightestTwin.intensity,
    houseAxis: axis,
    invitationText,
  };
}
