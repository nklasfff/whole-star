/**
 * Transit aspect detection and stress calculation.
 *
 * Detects aspects between current (transit) planet positions
 * and natal planet positions, then computes a transit stress
 * adjustment for each natal planet.
 *
 * Hard transit aspects (square, opposition, malefic conjunction) increase stress.
 * Soft transit aspects (trine, sextile) reduce stress.
 */

import type {
  Planet,
  PlanetPosition,
  TransitPosition,
  TransitAspect,
  AspectType,
} from './types';
import { PLANET_NATURE } from './types';
import aspectDefs from '../data/aspects.json';

interface AspectDef {
  type: AspectType;
  angle: number;
  orb: number;
}

const definitions = aspectDefs as AspectDef[];

// Tighter orbs for transits than natal aspects
const TRANSIT_ORB_FACTOR = 0.7;

function angularDistance(lon1: number, lon2: number): number {
  const diff = Math.abs(((lon1 % 360) + 360) % 360 - ((lon2 % 360) + 360) % 360);
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Detect all aspects between transit planets and natal planets.
 * Uses tighter orbs than natal aspects (70% of standard).
 */
export function detectTransitAspects(
  transitPositions: TransitPosition[],
  natalPositions: PlanetPosition[]
): TransitAspect[] {
  const aspects: TransitAspect[] = [];

  for (const transit of transitPositions) {
    for (const natal of natalPositions) {
      const distance = angularDistance(transit.longitude, natal.longitude);

      for (const def of definitions) {
        const maxOrb = def.orb * TRANSIT_ORB_FACTOR;
        const orb = Math.abs(distance - def.angle);

        if (orb <= maxOrb) {
          aspects.push({
            transitPlanet: transit.planet,
            natalPlanet: natal.planet,
            type: def.type,
            orb,
          });
          break; // One aspect per transit-natal pair
        }
      }
    }
  }

  return aspects;
}

/**
 * Transit stress adjustments per aspect type.
 *
 * Hard aspects: square (+15), opposition (+12), malefic conjunction (+10)
 * Soft aspects: trine (-8), sextile (-5), benefic conjunction (-5)
 * Neutral conjunction: +0
 *
 * Outer planet transits (Jupiter–Pluto) carry more weight
 * because they move slowly and represent longer activations.
 */
const TRANSIT_STRESS: Record<AspectType, number> = {
  trine: -8,
  sextile: -5,
  conjunction: 0, // Varies by nature — handled below
  square: 15,
  opposition: 12,
};

/** Weight multiplier based on transit planet speed */
function transitWeight(planet: Planet): number {
  // Outer planets (slow-moving) have stronger transit effects
  switch (planet) {
    case 'Pluto': return 1.3;
    case 'Neptune': return 1.2;
    case 'Uranus': return 1.1;
    case 'Saturn': return 1.0;
    case 'Jupiter': return 0.9;
    case 'Mars': return 0.7;
    case 'Sun': return 0.5;
    case 'Venus': return 0.4;
    case 'Mercury': return 0.3;
    case 'Moon': return 0.2;
    default: return 0.5;
  }
}

/**
 * Compute the transit stress adjustment for a specific natal planet.
 * Sums the weighted stress of all transit aspects hitting this natal planet.
 */
export function computeTransitStress(
  natalPlanet: Planet,
  transitAspects: TransitAspect[]
): number {
  const relevant = transitAspects.filter(a => a.natalPlanet === natalPlanet);

  let total = 0;

  for (const aspect of relevant) {
    let stress: number;

    if (aspect.type === 'conjunction') {
      const nature = PLANET_NATURE[aspect.transitPlanet];
      stress = nature === 'benefic' ? -5 : nature === 'malefic' ? 10 : 0;
    } else {
      stress = TRANSIT_STRESS[aspect.type];
    }

    // Apply weight based on transit planet's speed
    total += stress * transitWeight(aspect.transitPlanet);
  }

  return Math.round(total);
}
