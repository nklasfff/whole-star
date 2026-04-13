import type {
  Planet,
  PlanetPosition,
  DetectedAspect,
  StressComponents,
  StressResult,
  AspectType,
} from './types';
import { DIGNITY_STRESS, HOUSE_STRESS, HOUSE_TYPE, RETROGRADE_STRESS, PLANET_NATURE } from './types';
import { getDignity } from './dignity';
import { getAspectsForPlanet } from './aspects';

const ASPECT_STRESS: Record<AspectType, number> = {
  trine: -8,
  sextile: -5,
  conjunction: 0,
  square: 15,
  opposition: 12,
};

function conjunctionStress(otherPlanet: Planet): number {
  const nature = PLANET_NATURE[otherPlanet];
  if (nature === 'benefic') return -5;
  if (nature === 'malefic') return 10;
  return 0;
}

function computeAspectStress(planet: Planet, aspects: DetectedAspect[]): number {
  let total = 0;
  for (const aspect of aspects) {
    if (aspect.type === 'conjunction') {
      const other = aspect.planet1 === planet ? aspect.planet2 : aspect.planet1;
      total += conjunctionStress(other);
    } else {
      total += ASPECT_STRESS[aspect.type];
    }
  }
  return total;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function computeStress(
  position: PlanetPosition,
  allAspects: DetectedAspect[]
): StressResult {
  const dignity = DIGNITY_STRESS[getDignity(position.planet, position.sign)];
  const planetAspects = getAspectsForPlanet(position.planet, allAspects);
  const aspects = computeAspectStress(position.planet, planetAspects);
  const retrograde = position.isRetrograde ? RETROGRADE_STRESS : 0;
  const house = HOUSE_STRESS[HOUSE_TYPE[position.house]];

  const components: StressComponents = { dignity, aspects, retrograde, house };
  const stressIndex = clamp(dignity + aspects + retrograde + house, 0, 100);

  return {
    planet: position.planet,
    components,
    stressIndex,
  };
}
