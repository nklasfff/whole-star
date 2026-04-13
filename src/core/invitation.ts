/**
 * Daily invitation logic.
 *
 * Selects the brightest Twin, resolves where it stirs in everyday life,
 * and picks a single question — not what to do, but what to notice.
 * (SYSTEM.md §8)
 */

import type { Planet, TwinState, DailyInvitation, HouseNumber } from './types';
import { getHouseAxis } from './houses';
import invitationsData from '../data/invitations.json';
import housesData from '../data/houses.json';

interface QuestionEntry {
  planet: string;
  questions: string[];
}

const allQuestions = invitationsData.templates as QuestionEntry[];
const houseEntries = housesData as { house: number; opposite: number; theme: string; felt: string }[];

/**
 * Get a human-readable, felt description of where the Twin stirs.
 * e.g. "this stirs in your closest relationships"
 */
export function getHouseFelt(house: HouseNumber): string {
  const entry = houseEntries.find(h => h.house === house);
  return entry?.felt ?? 'this stirs somewhere you haven\'t looked';
}

/**
 * Select a question deterministically based on the current date.
 * Same Twin on the same day always yields the same question,
 * but different days rotate through the available questions.
 */
function selectQuestion(planet: Planet, date: Date): string {
  const entry = allQuestions.find(t => t.planet === planet);
  if (!entry || entry.questions.length === 0) {
    return 'What do you notice right now?';
  }

  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % entry.questions.length;
  return entry.questions[index];
}

/**
 * Generate a daily invitation from the brightest Twin.
 */
export function generateInvitation(
  brightestTwin: TwinState,
  date: Date = new Date()
): DailyInvitation {
  const axis = getHouseAxis(brightestTwin.twinHouse);
  const question = selectQuestion(brightestTwin.planet, date);

  return {
    twinName: brightestTwin.twinName,
    planet: brightestTwin.planet,
    intensity: brightestTwin.intensity,
    houseAxis: axis,
    invitationText: question,
  };
}
