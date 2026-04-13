import type { Planet, AspectType, DetectedAspect, PlanetPosition, AspectDefinition } from './types';
import aspectDefs from '../data/aspects.json';

const definitions = aspectDefs as AspectDefinition[];

function normalizeAngle(angle: number): number {
  const a = angle % 360;
  return a < 0 ? a + 360 : a;
}

function angularDistance(lon1: number, lon2: number): number {
  const diff = Math.abs(normalizeAngle(lon1) - normalizeAngle(lon2));
  return diff > 180 ? 360 - diff : diff;
}

export function detectAspects(positions: PlanetPosition[]): DetectedAspect[] {
  const aspects: DetectedAspect[] = [];

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i];
      const p2 = positions[j];
      const distance = angularDistance(p1.longitude, p2.longitude);

      for (const def of definitions) {
        const orb = Math.abs(distance - def.angle);
        if (orb <= def.orb) {
          aspects.push({
            planet1: p1.planet,
            planet2: p2.planet,
            type: def.type,
            angle: def.angle,
            orb,
            exactAngle: distance,
          });
          break;
        }
      }
    }
  }

  return aspects;
}

export function getAspectsForPlanet(
  planet: Planet,
  allAspects: DetectedAspect[]
): DetectedAspect[] {
  return allAspects.filter(a => a.planet1 === planet || a.planet2 === planet);
}
