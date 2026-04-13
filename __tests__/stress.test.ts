import { computeStress } from '@/core/stress';
import { detectAspects } from '@/core/aspects';
import type { PlanetPosition } from '@/core/types';

function makePosition(
  planet: PlanetPosition['planet'],
  longitude: number,
  sign: PlanetPosition['sign'],
  house: PlanetPosition['house'],
  isRetrograde = false
): PlanetPosition {
  return { planet, longitude, sign, signDegree: longitude % 30, house, isRetrograde };
}

describe('computeStress', () => {
  it('returns 0 stress for Sun in Leo in angular house, no aspects, direct', () => {
    const pos = makePosition('Sun', 120, 'Leo', 1);
    const result = computeStress(pos, []);
    // domicile=0, no aspects, no retrograde, angular=-10 → clamp(0-10, 0, 100) = 0
    expect(result.stressIndex).toBe(0);
    expect(result.components.dignity).toBe(0);
    expect(result.components.house).toBe(-10);
  });

  it('returns high stress for Sun in Aquarius in cadent house, retrograde', () => {
    const pos = makePosition('Sun', 315, 'Aquarius', 12, true);
    const result = computeStress(pos, []);
    // exile=85, retrograde=15, cadent=10 → 85+15+10 = 110 → clamp = 100
    expect(result.stressIndex).toBe(100);
  });

  it('computes moderate stress for peregrine planet', () => {
    const pos = makePosition('Sun', 60, 'Gemini', 5);
    const result = computeStress(pos, []);
    // peregrine=40, succedent=0 → 40
    expect(result.stressIndex).toBe(40);
  });

  it('accounts for benefic conjunction reducing stress', () => {
    const sun = makePosition('Sun', 100, 'Cancer', 5);
    const venus = makePosition('Venus', 102, 'Cancer', 5);
    const aspects = detectAspects([sun, venus]);
    const result = computeStress(sun, aspects);
    // peregrine=40, conjunction w/ benefic=-5, succedent=0 → 35
    expect(result.stressIndex).toBe(35);
  });

  it('accounts for malefic conjunction increasing stress', () => {
    const sun = makePosition('Sun', 100, 'Cancer', 5);
    const mars = makePosition('Mars', 102, 'Cancer', 5);
    const aspects = detectAspects([sun, mars]);
    const result = computeStress(sun, aspects);
    // peregrine=40, conjunction w/ malefic=+10, succedent=0 → 50
    expect(result.stressIndex).toBe(50);
  });

  it('accounts for square aspect', () => {
    const sun = makePosition('Sun', 120, 'Leo', 5);
    const saturn = makePosition('Saturn', 30, 'Taurus', 2);
    const aspects = detectAspects([sun, saturn]);
    const result = computeStress(sun, aspects);
    // domicile=0, square=+15, succedent=0 → 15
    expect(result.stressIndex).toBe(15);
  });

  it('accounts for trine reducing stress', () => {
    const mars = makePosition('Mars', 0, 'Aries', 6);
    const jupiter = makePosition('Jupiter', 122, 'Leo', 10);
    const aspects = detectAspects([mars, jupiter]);
    const result = computeStress(mars, aspects);
    // domicile=0, trine=-8, cadent=+10 → 2
    expect(result.stressIndex).toBe(2);
  });

  it('clamps to 0 when stress would be negative', () => {
    const sun = makePosition('Sun', 120, 'Leo', 1);
    const venus = makePosition('Venus', 122, 'Leo', 1);
    const jupiter = makePosition('Jupiter', 240, 'Sagittarius', 9);
    const aspects = detectAspects([sun, venus, jupiter]);
    const result = computeStress(sun, aspects);
    // domicile=0, benefic conjunction=-5, trine=-8, angular=-10 → -23 → clamp = 0
    expect(result.stressIndex).toBe(0);
  });
});
