/**
 * Swiss Ephemeris wrapper — birth data → planet positions, signs, houses, retrograde status.
 *
 * This module is the bridge between real astronomical data and the Whole-Star calculation core.
 * It uses swisseph-wasm (Swiss Ephemeris compiled to WebAssembly) for high-precision
 * planetary position calculations.
 */

import SwissEph from 'swisseph-wasm';
import type { Planet, PlanetPosition, BirthData, ZodiacSign, HouseNumber } from './types';
import { PLANETS, ZODIAC_SIGNS } from './types';

// ─── Planet ID mapping ─────────────────────────────────────────────────────────

const PLANET_IDS: Record<Planet, number> = {
  Sun: 0,      // SE_SUN
  Moon: 1,     // SE_MOON
  Mercury: 2,  // SE_MERCURY
  Venus: 3,    // SE_VENUS
  Mars: 4,     // SE_MARS
  Jupiter: 5,  // SE_JUPITER
  Saturn: 6,   // SE_SATURN
  Uranus: 7,   // SE_URANUS
  Neptune: 8,  // SE_NEPTUNE
  Pluto: 9,    // SE_PLUTO
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function longitudeToSign(longitude: number): ZodiacSign {
  const index = Math.floor(longitude / 30) % 12;
  return ZODIAC_SIGNS[index];
}

function longitudeToSignDegree(longitude: number): number {
  return longitude % 30;
}

function determinePlanetHouse(
  planetLongitude: number,
  cusps: Float64Array
): HouseNumber {
  // cusps[1] through cusps[12] are the house cusp longitudes
  // A planet is in house N if it falls between cusp N and cusp N+1
  for (let h = 1; h <= 12; h++) {
    const cuspStart = cusps[h];
    const cuspEnd = cusps[h === 12 ? 1 : h + 1];

    if (cuspStart < cuspEnd) {
      // Normal case: cusp doesn't cross 0° Aries
      if (planetLongitude >= cuspStart && planetLongitude < cuspEnd) {
        return h as HouseNumber;
      }
    } else {
      // Cusp crosses 0° Aries (e.g., cusp at 350° and next at 20°)
      if (planetLongitude >= cuspStart || planetLongitude < cuspEnd) {
        return h as HouseNumber;
      }
    }
  }

  // Fallback — should not happen with valid data
  return 1;
}

// ─── Main calculation ──────────────────────────────────────────────────────────

/**
 * Calculate all planet positions from birth data using Swiss Ephemeris.
 * Uses Placidus house system by default.
 *
 * @param birthData - Date, time, and location of birth
 * @param houseSystem - House system character (default: 'P' for Placidus)
 * @returns Array of planet positions with sign, house, and retrograde status
 */
export async function calculatePositions(
  birthData: BirthData,
  houseSystem: string = 'P'
): Promise<PlanetPosition[]> {
  const swe = new SwissEph();
  await swe.initSwissEph();

  try {
    // Parse birth data
    const [year, month, day] = birthData.date.split('-').map(Number);
    const [hours, minutes] = birthData.time.split(':').map(Number);
    const decimalHours = hours + minutes / 60;

    // Calculate Julian Day (Universal Time)
    const jd = swe.julday(year, month, day, decimalHours);

    // Calculate house cusps
    const houseData = swe.houses(jd, birthData.latitude, birthData.longitude, houseSystem) as unknown as {
      cusps: Float64Array;
      ascmc: Float64Array;
    };

    // Calculate flags: Swiss Ephemeris + speed (for retrograde detection)
    const flags = 2 | 256; // SEFLG_SWIEPH | SEFLG_SPEED

    // Calculate each planet's position
    const positions: PlanetPosition[] = [];

    for (const planet of PLANETS) {
      const planetId = PLANET_IDS[planet];
      const result = swe.calc_ut(jd, planetId, flags);

      const longitude = swe.degnorm(result[0]);
      const longitudeSpeed = result[3];
      const isRetrograde = planet !== 'Sun' && planet !== 'Moon' && longitudeSpeed < 0;

      const sign = longitudeToSign(longitude);
      const signDegree = longitudeToSignDegree(longitude);
      const house = determinePlanetHouse(longitude, houseData.cusps);

      positions.push({
        planet,
        longitude,
        sign,
        signDegree,
        house,
        isRetrograde,
      });
    }

    return positions;
  } finally {
    swe.close();
  }
}

/**
 * Get the Ascendant and Midheaven from birth data.
 * Useful for displaying the classical chart background.
 */
export async function calculateAngles(
  birthData: BirthData,
  houseSystem: string = 'P'
): Promise<{ ascendant: number; midheaven: number; cusps: number[] }> {
  const swe = new SwissEph();
  await swe.initSwissEph();

  try {
    const [year, month, day] = birthData.date.split('-').map(Number);
    const [hours, minutes] = birthData.time.split(':').map(Number);
    const decimalHours = hours + minutes / 60;

    const jd = swe.julday(year, month, day, decimalHours);
    const houseData = swe.houses(jd, birthData.latitude, birthData.longitude, houseSystem) as unknown as {
      cusps: Float64Array;
      ascmc: Float64Array;
    };

    return {
      ascendant: houseData.ascmc[0],
      midheaven: houseData.ascmc[1],
      cusps: Array.from(houseData.cusps),
    };
  } finally {
    swe.close();
  }
}
