import { detectAspects, getAspectsForPlanet } from '@/core/aspects';
import type { PlanetPosition } from '@/core/types';

function makePosition(
  planet: PlanetPosition['planet'],
  longitude: number
): PlanetPosition {
  const signIndex = Math.floor(longitude / 30);
  const signs: PlanetPosition['sign'][] = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
  ];
  return {
    planet,
    longitude,
    sign: signs[signIndex],
    signDegree: longitude % 30,
    house: 1,
    isRetrograde: false,
  };
}

describe('detectAspects', () => {
  it('detects a conjunction within orb', () => {
    const positions = [
      makePosition('Sun', 100),
      makePosition('Moon', 105),
    ];
    const aspects = detectAspects(positions);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('conjunction');
    expect(aspects[0].planet1).toBe('Sun');
    expect(aspects[0].planet2).toBe('Moon');
  });

  it('detects an opposition', () => {
    const positions = [
      makePosition('Sun', 10),
      makePosition('Saturn', 192),
    ];
    const aspects = detectAspects(positions);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('opposition');
  });

  it('detects a trine', () => {
    const positions = [
      makePosition('Venus', 30),
      makePosition('Jupiter', 153),
    ];
    const aspects = detectAspects(positions);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('trine');
  });

  it('detects a square', () => {
    const positions = [
      makePosition('Mars', 0),
      makePosition('Saturn', 93),
    ];
    const aspects = detectAspects(positions);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('square');
  });

  it('detects a sextile', () => {
    const positions = [
      makePosition('Moon', 120),
      makePosition('Venus', 180),
    ];
    const aspects = detectAspects(positions);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('sextile');
  });

  it('returns no aspects when planets are too far apart', () => {
    const positions = [
      makePosition('Sun', 0),
      makePosition('Moon', 45),
    ];
    const aspects = detectAspects(positions);
    expect(aspects).toHaveLength(0);
  });

  it('handles wrap-around at 360°', () => {
    const positions = [
      makePosition('Sun', 355),
      makePosition('Moon', 3),
    ];
    const aspects = detectAspects(positions);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('conjunction');
  });
});

describe('getAspectsForPlanet', () => {
  it('filters aspects for a specific planet', () => {
    const positions = [
      makePosition('Sun', 0),
      makePosition('Moon', 90),
      makePosition('Mars', 180),
    ];
    const allAspects = detectAspects(positions);
    const sunAspects = getAspectsForPlanet('Sun', allAspects);
    expect(sunAspects.every(a => a.planet1 === 'Sun' || a.planet2 === 'Sun')).toBe(true);
  });
});
