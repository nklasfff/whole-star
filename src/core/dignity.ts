import type { Planet, ZodiacSign, DignityLevel } from './types';
import dignityTable from '../data/dignity-table.json';

const table = dignityTable as Record<string, Record<string, string[]>>;

export function getDignity(planet: Planet, sign: ZodiacSign): DignityLevel {
  const entry = table[planet];
  if (!entry) return 'peregrine';

  if (entry.domicile?.includes(sign)) return 'domicile';
  if (entry.exaltation?.includes(sign)) return 'exaltation';
  if (entry.exile?.includes(sign)) return 'exile';
  if (entry.fall?.includes(sign)) return 'fall';

  return 'peregrine';
}
