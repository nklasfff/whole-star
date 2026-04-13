import { calculatePositions, calculateAngles } from '@/core/ephemeris';
import { computeChart } from '@/core/engine';
import type { BirthData, ChartState } from '@/core/types';

/** Full pipeline helper for tests: birth data → ephemeris → chart */
async function computeChartFromBirthData(birthData: BirthData): Promise<ChartState> {
  const positions = await calculatePositions(birthData);
  return computeChart(birthData, positions);
}

// ─── Known birth chart: 15 June 1990, 14:30, Copenhagen ────────────────────────
// This is a synthetic reference — we verify structural correctness and
// approximate positions against astronomical reality.

const copenhagen: BirthData = {
  date: '1990-06-15',
  time: '14:30',
  latitude: 55.6761,
  longitude: 12.5683,
  timezone: 'Europe/Copenhagen',
};

// ─── Known birth chart: 1 Jan 2000, 12:00, London (J2000 epoch) ────────────────
// Sun should be in Capricorn around 280° ecliptic longitude.

const j2000: BirthData = {
  date: '2000-01-01',
  time: '12:00',
  latitude: 51.5074,
  longitude: -0.1278,
  timezone: 'Europe/London',
};

describe('calculatePositions', () => {
  it('returns positions for all 10 planets', async () => {
    const positions = await calculatePositions(copenhagen);
    expect(positions).toHaveLength(10);

    const planets = positions.map(p => p.planet);
    expect(planets).toContain('Sun');
    expect(planets).toContain('Moon');
    expect(planets).toContain('Mercury');
    expect(planets).toContain('Venus');
    expect(planets).toContain('Mars');
    expect(planets).toContain('Jupiter');
    expect(planets).toContain('Saturn');
    expect(planets).toContain('Uranus');
    expect(planets).toContain('Neptune');
    expect(planets).toContain('Pluto');
  });

  it('longitude values are within 0–360', async () => {
    const positions = await calculatePositions(copenhagen);
    for (const pos of positions) {
      expect(pos.longitude).toBeGreaterThanOrEqual(0);
      expect(pos.longitude).toBeLessThan(360);
    }
  });

  it('signDegree values are within 0–30', async () => {
    const positions = await calculatePositions(copenhagen);
    for (const pos of positions) {
      expect(pos.signDegree).toBeGreaterThanOrEqual(0);
      expect(pos.signDegree).toBeLessThan(30);
    }
  });

  it('house values are valid (1–12)', async () => {
    const positions = await calculatePositions(copenhagen);
    for (const pos of positions) {
      expect(pos.house).toBeGreaterThanOrEqual(1);
      expect(pos.house).toBeLessThanOrEqual(12);
    }
  });

  it('Sun is never retrograde', async () => {
    const positions = await calculatePositions(copenhagen);
    const sun = positions.find(p => p.planet === 'Sun')!;
    expect(sun.isRetrograde).toBe(false);
  });

  it('Moon is never retrograde', async () => {
    const positions = await calculatePositions(copenhagen);
    const moon = positions.find(p => p.planet === 'Moon')!;
    expect(moon.isRetrograde).toBe(false);
  });

  it('places Sun in Gemini for June 15, 1990', async () => {
    const positions = await calculatePositions(copenhagen);
    const sun = positions.find(p => p.planet === 'Sun')!;
    // Sun at ~24° Gemini on June 15 → longitude ~84°
    expect(sun.sign).toBe('Gemini');
    expect(sun.longitude).toBeGreaterThan(75);
    expect(sun.longitude).toBeLessThan(95);
  });

  it('places Sun in Capricorn for Jan 1, 2000', async () => {
    const positions = await calculatePositions(j2000);
    const sun = positions.find(p => p.planet === 'Sun')!;
    // Sun at ~10° Capricorn → longitude ~280°
    expect(sun.sign).toBe('Capricorn');
    expect(sun.longitude).toBeGreaterThan(275);
    expect(sun.longitude).toBeLessThan(285);
  });

  it('sign corresponds to longitude correctly', async () => {
    const positions = await calculatePositions(copenhagen);
    for (const pos of positions) {
      const signIndex = Math.floor(pos.longitude / 30);
      const signs = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
      ];
      expect(pos.sign).toBe(signs[signIndex]);
    }
  });
});

describe('calculateAngles', () => {
  it('returns ascendant, midheaven, and 13 cusps', async () => {
    const angles = await calculateAngles(copenhagen);
    expect(typeof angles.ascendant).toBe('number');
    expect(typeof angles.midheaven).toBe('number');
    expect(angles.cusps).toHaveLength(13);
  });

  it('ascendant is within 0–360', async () => {
    const angles = await calculateAngles(copenhagen);
    expect(angles.ascendant).toBeGreaterThanOrEqual(0);
    expect(angles.ascendant).toBeLessThan(360);
  });
});

describe('computeChartFromBirthData (full pipeline)', () => {
  it('produces a complete chart state from birth data alone', async () => {
    const chart = await computeChartFromBirthData(copenhagen);

    expect(chart.positions).toHaveLength(10);
    expect(chart.stressResults).toHaveLength(10);
    expect(chart.twinStates).toHaveLength(10);
    expect(chart.brightestTwin).toBeDefined();
    expect(chart.brightestTwin.intensity).toBeGreaterThanOrEqual(0);
    expect(chart.brightestTwin.intensity).toBeLessThanOrEqual(100);
  });

  it('all stress indices are within 0–100', async () => {
    const chart = await computeChartFromBirthData(copenhagen);
    for (const stress of chart.stressResults) {
      expect(stress.stressIndex).toBeGreaterThanOrEqual(0);
      expect(stress.stressIndex).toBeLessThanOrEqual(100);
    }
  });

  it('all twin states have valid opposite houses', async () => {
    const chart = await computeChartFromBirthData(copenhagen);
    for (const twin of chart.twinStates) {
      const expectedOpposite = twin.planetHouse <= 6
        ? twin.planetHouse + 6
        : twin.planetHouse - 6;
      expect(twin.twinHouse).toBe(expectedOpposite);
    }
  });

  it('active pairs have both intensities above threshold', async () => {
    const chart = await computeChartFromBirthData(copenhagen);
    for (const pair of chart.activePairs) {
      expect(pair.intensity1).toBeGreaterThan(50);
      expect(pair.intensity2).toBeGreaterThan(50);
    }
  });

  it('brightest twin matches highest intensity in twin states', async () => {
    const chart = await computeChartFromBirthData(copenhagen);
    const maxIntensity = Math.max(...chart.twinStates.map(t => t.intensity));
    expect(chart.brightestTwin.intensity).toBe(maxIntensity);
  });
});
