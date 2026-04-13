import { computeChart } from '@/core/engine';
import type { BirthData, PlanetPosition } from '@/core/types';

const birthData: BirthData = {
  date: '1990-06-15',
  time: '14:30',
  latitude: 55.6761,
  longitude: 12.5683,
  timezone: 'Europe/Copenhagen',
};

// A synthetic test chart with known positions
const positions: PlanetPosition[] = [
  { planet: 'Sun', longitude: 84, sign: 'Gemini', signDegree: 24, house: 10, isRetrograde: false },
  { planet: 'Moon', longitude: 310, sign: 'Aquarius', signDegree: 10, house: 5, isRetrograde: false },
  { planet: 'Mercury', longitude: 70, sign: 'Gemini', signDegree: 10, house: 10, isRetrograde: false },
  { planet: 'Venus', longitude: 55, sign: 'Taurus', signDegree: 25, house: 9, isRetrograde: false },
  { planet: 'Mars', longitude: 10, sign: 'Aries', signDegree: 10, house: 7, isRetrograde: false },
  { planet: 'Jupiter', longitude: 95, sign: 'Cancer', signDegree: 5, house: 11, isRetrograde: false },
  { planet: 'Saturn', longitude: 290, sign: 'Capricorn', signDegree: 20, house: 4, isRetrograde: true },
  { planet: 'Uranus', longitude: 278, sign: 'Capricorn', signDegree: 8, house: 4, isRetrograde: false },
  { planet: 'Neptune', longitude: 283, sign: 'Capricorn', signDegree: 13, house: 4, isRetrograde: false },
  { planet: 'Pluto', longitude: 225, sign: 'Scorpio', signDegree: 15, house: 2, isRetrograde: false },
];

describe('computeChart', () => {
  const chart = computeChart(birthData, positions);

  it('returns stress results for all 10 planets', () => {
    expect(chart.stressResults).toHaveLength(10);
  });

  it('returns twin states for all 10 planets', () => {
    expect(chart.twinStates).toHaveLength(10);
  });

  it('twin states have opposite houses from planet positions', () => {
    for (const twin of chart.twinStates) {
      const pos = positions.find(p => p.planet === twin.planet)!;
      const expected = pos.house <= 6 ? pos.house + 6 : pos.house - 6;
      expect(twin.twinHouse).toBe(expected);
    }
  });

  it('identifies brightest twin as the one with highest intensity', () => {
    const maxIntensity = Math.max(...chart.twinStates.map(t => t.intensity));
    expect(chart.brightestTwin.intensity).toBe(maxIntensity);
  });

  it('active pairs only include twins above threshold', () => {
    for (const pair of chart.activePairs) {
      expect(pair.intensity1).toBeGreaterThan(50);
      expect(pair.intensity2).toBeGreaterThan(50);
    }
  });

  it('Saturn retrograde in Capricorn (domicile) gets retrograde stress', () => {
    const saturn = chart.stressResults.find(s => s.planet === 'Saturn')!;
    expect(saturn.components.retrograde).toBe(15);
    expect(saturn.components.dignity).toBe(0); // domicile
  });

  it('Mars in Aries (domicile) in angular house has low base stress', () => {
    const mars = chart.stressResults.find(s => s.planet === 'Mars')!;
    expect(mars.components.dignity).toBe(0);
    expect(mars.components.house).toBe(-10);
    // Aspects with other planets add stress, but base is very low
    expect(mars.stressIndex).toBeLessThan(50);
  });

  it('Sun in Gemini (peregrine) has base stress of 40', () => {
    const sun = chart.stressResults.find(s => s.planet === 'Sun')!;
    expect(sun.components.dignity).toBe(40);
  });
});
