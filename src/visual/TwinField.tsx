'use client';

/**
 * TwinField — a single Twin rendered as a pulsing luminous field.
 *
 * Each Twin appears as a soft, semi-transparent, breathing volume
 * whose size and opacity scale with intensity.
 * The pulsation rate corresponds to the planet's orbital period.
 * (SYSTEM.md §7.1, §7.4)
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Planet } from '@/core/types';
import { getTwinColor, getPulseSpeed, getFieldSeed } from './colors';

// Inline shaders to avoid file-loading issues with Next.js bundling

const vertexShader = `
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

uniform vec3 uColor;
uniform float uIntensity;
uniform float uTime;
uniform float uPulseSpeed;
uniform float uSeed;

varying vec2 vUv;

void main() {
  vec2 center = vUv - 0.5;
  float dist = length(center);

  // Soft radial falloff — gaussian-like, luminous cloud
  float falloff = exp(-dist * dist * 6.0);

  // Layered breathing pulsation for organic feel
  float pulse1 = sin(uTime * uPulseSpeed + uSeed) * 0.5 + 0.5;
  float pulse2 = sin(uTime * uPulseSpeed * 0.37 + uSeed * 2.3) * 0.5 + 0.5;
  float pulse3 = sin(uTime * uPulseSpeed * 0.13 + uSeed * 5.1) * 0.5 + 0.5;
  float pulse = pulse1 * 0.6 + pulse2 * 0.25 + pulse3 * 0.15;

  // Subtle spatial distortion — organic, living quality
  float angle = atan(center.y, center.x);
  float distortion = sin(angle * 3.0 + uTime * uPulseSpeed * 0.2) * 0.08;
  float distortedFalloff = exp(-(dist + distortion) * (dist + distortion) * 6.0);

  // Final alpha: falloff × intensity × pulsation
  float alpha = distortedFalloff * uIntensity * (0.3 + pulse * 0.7);

  // Color brightens at pulse peaks
  vec3 color = uColor * (0.8 + pulse * 0.4);

  // Soft inner glow at center
  float innerGlow = exp(-dist * dist * 20.0) * 0.3 * pulse;
  color += vec3(innerGlow);

  gl_FragColor = vec4(color, alpha * 0.85);
}
`;

interface TwinFieldProps {
  planet: Planet;
  intensity: number; // 0–100
  position: [number, number, number];
}

export default function TwinField({ planet, intensity, position }: TwinFieldProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const color = useMemo(() => getTwinColor(planet), [planet]);
  const pulseSpeed = useMemo(() => getPulseSpeed(planet), [planet]);
  const seed = useMemo(() => getFieldSeed(planet), [planet]);

  // Intensity mapped to 0–1 range
  const normalizedIntensity = intensity / 100;

  // Size scales with intensity: minimum 0.5, maximum 2.5
  const size = 0.5 + normalizedIntensity * 2.0;

  const uniforms = useMemo(
    () => ({
      uColor: { value: color },
      uIntensity: { value: normalizedIntensity },
      uTime: { value: 0 },
      uPulseSpeed: { value: pulseSpeed },
      uSeed: { value: seed },
    }),
    [color, normalizedIntensity, pulseSpeed, seed]
  );

  // Animate time uniform each frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[size, size, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
