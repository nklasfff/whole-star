/**
 * Twin color definitions and complement logic.
 *
 * Each Twin's color is the complement of its planet's classical color —
 * not in simple color-theory terms, but expressing what the planet lacks
 * to be whole. (SYSTEM.md §7.3)
 */

import type { Planet, TwinDefinition } from '@/core/types';
import twinsData from '@/data/twins.json';
import * as THREE from 'three';

const definitions = twinsData as TwinDefinition[];

/** Get the THREE.Color for a Twin by planet name */
export function getTwinColor(planet: Planet): THREE.Color {
  const def = definitions.find(d => d.planet === planet);
  return new THREE.Color(def?.color ?? '#ffffff');
}

/** Get the hex color string for a Twin */
export function getTwinColorHex(planet: Planet): string {
  const def = definitions.find(d => d.planet === planet);
  return def?.color ?? '#ffffff';
}

/**
 * Map orbital period to a pulsation speed.
 *
 * Moon's Twin pulses fast (seconds), Pluto's Twin barely breathes.
 * We map the log of orbital period to a speed range.
 * (SYSTEM.md §7.4)
 */
export function getPulseSpeed(planet: Planet): number {
  const def = definitions.find(d => d.planet === planet);
  if (!def) return 1.0;

  // Log-scale mapping: Moon (~27 days) → fast, Pluto (~90560 days) → very slow
  // Range: ~3.0 (Moon) down to ~0.05 (Pluto)
  const logMin = Math.log(27);    // Moon
  const logMax = Math.log(90560); // Pluto
  const logPeriod = Math.log(def.orbitalPeriodDays);

  // Invert and scale: short period → high speed
  const t = (logPeriod - logMin) / (logMax - logMin);
  return 3.0 * Math.pow(1.0 - t, 1.5) + 0.05;
}

/**
 * Generate a deterministic seed for a planet's field.
 * Ensures each field has unique pulsation phase.
 */
export function getFieldSeed(planet: Planet): number {
  const index = definitions.findIndex(d => d.planet === planet);
  return (index + 1) * 1.618033988749; // Golden ratio spacing
}
