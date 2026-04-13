import { getTwinName, deriveTwinState } from '@/core/twins';
import type { StressResult } from '@/core/types';

describe('getTwinName', () => {
  it('returns The Witness for Sun', () => {
    expect(getTwinName('Sun')).toBe('The Witness');
  });

  it('returns The Vessel for Moon', () => {
    expect(getTwinName('Moon')).toBe('The Vessel');
  });

  it('returns The Membrane for Saturn', () => {
    expect(getTwinName('Saturn')).toBe('The Membrane');
  });

  it('returns The Weave for Pluto', () => {
    expect(getTwinName('Pluto')).toBe('The Weave');
  });
});

describe('deriveTwinState', () => {
  it('sets intensity equal to stress index', () => {
    const stress: StressResult = {
      planet: 'Saturn',
      components: { dignity: 85, aspects: 0, retrograde: 0, house: -10 },
      stressIndex: 75,
    };
    const state = deriveTwinState(stress, 10);
    expect(state.intensity).toBe(75);
    expect(state.twinName).toBe('The Membrane');
  });

  it('places Twin in opposite house', () => {
    const stress: StressResult = {
      planet: 'Saturn',
      components: { dignity: 0, aspects: 0, retrograde: 0, house: 0 },
      stressIndex: 40,
    };
    const state = deriveTwinState(stress, 10);
    expect(state.planetHouse).toBe(10);
    expect(state.twinHouse).toBe(4);
  });

  it('places Twin in house 7 when planet is in house 1', () => {
    const stress: StressResult = {
      planet: 'Sun',
      components: { dignity: 0, aspects: 0, retrograde: 0, house: 0 },
      stressIndex: 20,
    };
    const state = deriveTwinState(stress, 1);
    expect(state.twinHouse).toBe(7);
  });
});
