import { generateInvitation } from '@/core/invitation';
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
    expect(inv.intensity).toBe(78);
  });

  it('resolves the correct house axis', () => {
    const inv = generateInvitation(brightestTwin);
    expect(inv.houseAxis.house).toBe(4);
    expect(inv.houseAxis.opposite).toBe(10);
    expect(inv.houseAxis.theme).toContain('Private');
  });

  it('generates non-empty invitation text', () => {
    const inv = generateInvitation(brightestTwin);
    expect(inv.invitationText.length).toBeGreaterThan(20);
  });

  it('fills template placeholders with house names', () => {
    const inv = generateInvitation(brightestTwin);
    // Should not contain raw placeholders
    expect(inv.invitationText).not.toContain('{twinHouse}');
    expect(inv.invitationText).not.toContain('{planetHouse}');
    expect(inv.invitationText).not.toContain('{twinName}');
  });

  it('selects same template for same date deterministically', () => {
    const date = new Date('2025-06-15');
    const inv1 = generateInvitation(brightestTwin, date);
    const inv2 = generateInvitation(brightestTwin, date);
    expect(inv1.invitationText).toBe(inv2.invitationText);
  });

  it('may select different template for different dates', () => {
    const inv1 = generateInvitation(brightestTwin, new Date('2025-01-01'));
    const inv2 = generateInvitation(brightestTwin, new Date('2025-01-02'));
    // With 2 templates, consecutive days should differ
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
      expect(inv.planet).toBe(planet);
    }
  });
});
