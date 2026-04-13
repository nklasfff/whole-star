import { generateInvitation, getHouseFelt } from '@/core/invitation';
import type { TwinState } from '@/core/types';

const brightestTwin: TwinState = {
  planet: 'Saturn',
  twinName: 'The Membrane',
  intensity: 78,
  twinHouse: 4,
  planetHouse: 10,
};

describe('generateInvitation', () => {
  it('returns an invitation for the brightest twin', () => {
    const inv = generateInvitation(brightestTwin);
    expect(inv.twinName).toBe('The Membrane');
    expect(inv.planet).toBe('Saturn');
  });

  it('generates a single question as invitation text', () => {
    const inv = generateInvitation(brightestTwin);
    expect(inv.invitationText.length).toBeGreaterThan(10);
    expect(inv.invitationText).toContain('?');
  });

  it('selects same question for same date deterministically', () => {
    const date = new Date('2025-06-15');
    const inv1 = generateInvitation(brightestTwin, date);
    const inv2 = generateInvitation(brightestTwin, date);
    expect(inv1.invitationText).toBe(inv2.invitationText);
  });

  it('rotates questions across different dates', () => {
    const inv1 = generateInvitation(brightestTwin, new Date('2025-01-01'));
    const inv2 = generateInvitation(brightestTwin, new Date('2025-01-02'));
    expect(inv1.invitationText).not.toBe(inv2.invitationText);
  });

  it('works for all planets', () => {
    const planets = [
      'Sun', 'Moon', 'Mercury', 'Venus', 'Mars',
      'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
    ] as const;

    for (const planet of planets) {
      const twin: TwinState = {
        planet,
        twinName: `Twin of ${planet}`,
        intensity: 60,
        twinHouse: 7,
        planetHouse: 1,
      };
      const inv = generateInvitation(twin);
      expect(inv.invitationText.length).toBeGreaterThan(10);
      expect(inv.invitationText).toContain('?');
    }
  });
});

describe('getHouseFelt', () => {
  it('returns a human-readable felt description', () => {
    const felt = getHouseFelt(7);
    expect(felt).toBe('this stirs in your closest relationships');
  });

  it('returns felt description for house 6', () => {
    const felt = getHouseFelt(6);
    expect(felt).toBe('this moves through your daily routines and rituals');
  });

  it('returns felt descriptions for all 12 houses', () => {
    for (let h = 1; h <= 12; h++) {
      const felt = getHouseFelt(h as 1|2|3|4|5|6|7|8|9|10|11|12);
      expect(felt.length).toBeGreaterThan(10);
      expect(felt).not.toContain('House');
      expect(felt).not.toContain('\u2194');
    }
  });
});
