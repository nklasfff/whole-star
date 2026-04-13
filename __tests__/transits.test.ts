import { detectTransitAspects, computeTransitStress } from '@/core/transits';
import { computeStress } from '@/core/stress';
import type { PlanetPosition, TransitPosition } from '@/core/types';

function makeNatalPosition(
  planet: PlanetPosition['planet'],
  longitude: number,
  sign: PlanetPosition['sign'],
  house: PlanetPosition['house']
): PlanetPosition {
  return { planet, longitude, sign, signDegree: longitude % 30, house, isRetrograde: false };
}

function makeTransit(planet: TransitPosition['planet'], longitude: number): TransitPosition {
  return { planet, longitude, isRetrograde: false };
}

describe('detectTransitAspects', () => {
  it('detects a conjunction between transit and natal planet', () => {
    const transits = [makeTransit('Saturn', 100)];
    const natal = [makeNatalPosition('Sun', 103, 'Cancer', 5)];
    const aspects = detectTransitAspects(transits, natal);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('conjunction');
    expect(aspects[0].transitPlanet).toBe('Saturn');
    expect(aspects[0].natalPlanet).toBe('Sun');
  });

  it('detects a square between transit and natal', () => {
    const transits = [makeTransit('Pluto', 180)];
    const natal = [makeNatalPosition('Moon', 92, 'Cancer', 4)];
    const aspects = detectTransitAspects(transits, natal);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('square');
  });

  it('detects a trine', () => {
    const transits = [makeTransit('Jupiter', 240)];
    const natal = [makeNatalPosition('Venus', 120, 'Leo', 5)];
    const aspects = detectTransitAspects(transits, natal);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('trine');
  });

  it('uses tighter orbs than natal aspects', () => {
    // Standard square orb is 7°, transit orb should be ~4.9° (7 * 0.7)
    const transits = [makeTransit('Mars', 96)];
    const natal = [makeNatalPosition('Sun', 0, 'Aries', 1)];
    const aspects = detectTransitAspects(transits, natal);
    // 96° is 6° from exact square (90°) — exceeds transit orb of 4.9°
    expect(aspects).toHaveLength(0);
  });

  it('returns empty array when no aspects within orb', () => {
    const transits = [makeTransit('Moon', 45)];
    const natal = [makeNatalPosition('Sun', 0, 'Aries', 1)];
    const aspects = detectTransitAspects(transits, natal);
    expect(aspects).toHaveLength(0);
  });
});

describe('computeTransitStress', () => {
  it('returns positive stress for hard transit aspects', () => {
    const transits = [makeTransit('Saturn', 90)];
    const natal = [makeNatalPosition('Sun', 0, 'Aries', 1)];
    const aspects = detectTransitAspects(transits, natal);
    const stress = computeTransitStress('Sun', aspects);
    expect(stress).toBeGreaterThan(0);
  });

  it('returns negative stress for soft transit aspects', () => {
    const transits = [makeTransit('Jupiter', 120)];
    const natal = [makeNatalPosition('Sun', 0, 'Aries', 1)];
    const aspects = detectTransitAspects(transits, natal);
    const stress = computeTransitStress('Sun', aspects);
    expect(stress).toBeLessThan(0);
  });

  it('malefic conjunction increases stress', () => {
    const transits = [makeTransit('Mars', 2)];
    const natal = [makeNatalPosition('Moon', 0, 'Aries', 1)];
    const aspects = detectTransitAspects(transits, natal);
    const stress = computeTransitStress('Moon', aspects);
    expect(stress).toBeGreaterThan(0);
  });

  it('benefic conjunction reduces stress', () => {
    const transits = [makeTransit('Venus', 2)];
    const natal = [makeNatalPosition('Moon', 0, 'Aries', 1)];
    const aspects = detectTransitAspects(transits, natal);
    const stress = computeTransitStress('Moon', aspects);
    expect(stress).toBeLessThan(0);
  });

  it('outer planet transits have higher weight', () => {
    // Pluto square vs Mars square — same base stress, different weight
    const natalPos = [makeNatalPosition('Sun', 0, 'Aries', 1)];

    const plutoAspects = detectTransitAspects([makeTransit('Pluto', 90)], natalPos);
    const marsAspects = detectTransitAspects([makeTransit('Mars', 90)], natalPos);

    const plutoStress = computeTransitStress('Sun', plutoAspects);
    const marsStress = computeTransitStress('Sun', marsAspects);

    expect(plutoStress).toBeGreaterThan(marsStress);
  });
});

describe('stress with transit component', () => {
  it('transit stress is included in the total stress index', () => {
    const pos = makeNatalPosition('Sun', 120, 'Leo', 1);
    // Without transit: domicile(0) + angular(-10) = 0 (clamped)
    const base = computeStress(pos, []);
    expect(base.stressIndex).toBe(0);

    // With positive transit stress
    const withTransit = computeStress(pos, [], 20);
    expect(withTransit.stressIndex).toBe(10); // 0 - 10 + 20 = 10
    expect(withTransit.components.transit).toBe(20);
  });

  it('transit component appears in stress breakdown', () => {
    const pos = makeNatalPosition('Mercury', 60, 'Gemini', 5);
    const result = computeStress(pos, [], -8);
    expect(result.components.transit).toBe(-8);
  });
});
