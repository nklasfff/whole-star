'use client';

/**
 * ClassicalChart — muted background birth chart.
 *
 * Renders the traditional astrological circle as a recognizable
 * but subdued backdrop. Low opacity, thin lines — the manifest
 * layer as quiet foundation. (SYSTEM.md §7.2)
 */

import { useMemo } from 'react';
import * as THREE from 'three';
import type { PlanetPosition } from '@/core/types';

interface ClassicalChartProps {
  positions: PlanetPosition[];
  ascendant?: number;
}

/** Create a circle of line segments */
function createCirclePoints(radius: number, segments: number = 64): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
  }
  return points;
}

/** Create a line from center to edge at an angle */
function createRadialLine(angle: number, innerRadius: number, outerRadius: number): THREE.Vector3[] {
  const rad = (angle * Math.PI) / 180;
  return [
    new THREE.Vector3(Math.cos(rad) * innerRadius, Math.sin(rad) * innerRadius, 0),
    new THREE.Vector3(Math.cos(rad) * outerRadius, Math.sin(rad) * outerRadius, 0),
  ];
}

export default function ClassicalChart({ positions, ascendant = 0 }: ClassicalChartProps) {
  const chartColor = new THREE.Color('#ffffff');

  // The 12 house/sign divisions
  const divisionLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    for (let i = 0; i < 12; i++) {
      const angle = ascendant + i * 30;
      lines.push(createRadialLine(angle, 2.0, 3.5));
    }
    return lines;
  }, [ascendant]);

  // Planet position markers on the wheel
  const planetMarkers = useMemo(() => {
    return positions.map((pos) => {
      const angle = ((pos.longitude + ascendant) * Math.PI) / 180;
      const radius = 2.75;
      return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    });
  }, [positions, ascendant]);

  return (
    <group position={[0, 0, -0.5]}>
      {/* Outer circle */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(createCirclePoints(3.5).flatMap(p => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={chartColor} transparent opacity={0.06} />
      </line>

      {/* Inner circle */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(createCirclePoints(2.0).flatMap(p => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={chartColor} transparent opacity={0.04} />
      </line>

      {/* 12 division lines */}
      {divisionLines.map((points, i) => (
        <line key={`div-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={chartColor} transparent opacity={0.05} />
        </line>
      ))}

      {/* Planet position dots */}
      {planetMarkers.map((pos, i) => (
        <mesh key={`planet-${i}`} position={pos}>
          <circleGeometry args={[0.03, 8]} />
          <meshBasicMaterial color={chartColor} transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
}
