'use client';

/**
 * TwinCanvas — the full Three.js scene composing all active Twin fields.
 *
 * Foreground: Twin fields as luminous, pulsing zones with additive blending.
 * Where fields overlap, interference patterns emerge from the shader math.
 * Background: Classical birth chart as muted, near-transparent circle.
 * (SYSTEM.md §7.2)
 */

import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import type { TwinState, PlanetPosition } from '@/core/types';
import TwinField from './TwinField';
import ClassicalChart from './ClassicalChart';

interface TwinCanvasProps {
  twinStates: TwinState[];
  positions: PlanetPosition[];
  ascendant?: number;
  fieldScale?: number;      // multiplier for field sizes (default 1)
  hideChart?: boolean;       // hide classical chart background
}

/**
 * Distribute Twin fields in a circular layout.
 * Fields with higher intensity are placed closer to center.
 * The layout creates natural overlaps for interference.
 */
function layoutFields(
  twinStates: TwinState[]
): { planet: TwinState['planet']; intensity: number; pos: [number, number, number] }[] {
  // Sort by intensity descending — brightest twins closer to center
  const sorted = [...twinStates].sort((a, b) => b.intensity - a.intensity);

  return sorted.map((twin, index) => {
    // Arrange in a spiral-like pattern
    // High-intensity twins cluster near center, low ones at the edges
    const normalizedIntensity = twin.intensity / 100;

    // Angle: golden-angle spacing for organic distribution
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const angle = index * goldenAngle;

    // Radius: high intensity → close to center, low → further out
    const radius = 0.3 + (1 - normalizedIntensity) * 2.2;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return {
      planet: twin.planet,
      intensity: twin.intensity,
      pos: [x, y, 0] as [number, number, number],
    };
  });
}

function Scene({ twinStates, positions, ascendant, fieldScale = 1, hideChart }: TwinCanvasProps) {
  const fields = useMemo(() => layoutFields(twinStates), [twinStates]);

  return (
    <>
      <ambientLight intensity={0.1} />

      {/* Classical chart in the background — hidden in meditation/daily mode */}
      {!hideChart && <ClassicalChart positions={positions} ascendant={ascendant} />}

      {/* Twin fields — each a pulsing luminous plane with custom shader */}
      {fields.map((field) => (
        <TwinField
          key={field.planet}
          planet={field.planet}
          intensity={field.intensity}
          position={field.pos}
          scale={fieldScale}
        />
      ))}
    </>
  );
}

export default function TwinCanvas({ twinStates, positions, ascendant, fieldScale, hideChart }: TwinCanvasProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: 0, // NoToneMapping — we handle color in shaders
        }}
        style={{ background: 'transparent' }}
      >
        <Scene
          twinStates={twinStates}
          positions={positions}
          ascendant={ascendant}
          fieldScale={fieldScale}
          hideChart={hideChart}
        />
      </Canvas>
    </div>
  );
}
