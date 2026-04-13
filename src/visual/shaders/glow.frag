// Fragment shader for Twin luminous field pulsation.
// Creates a soft, radial glow that breathes at a rate
// determined by the planet's orbital period.

precision mediump float;

uniform vec3 uColor;        // Twin color from data
uniform float uIntensity;   // 0–1, mapped from stress index
uniform float uTime;        // Elapsed time in seconds
uniform float uPulseSpeed;  // Pulse rate derived from orbital period
uniform float uSeed;        // Per-field random seed for variation

varying vec2 vUv;

void main() {
  // Distance from center of the quad (0 at center, ~0.7 at edges)
  vec2 center = vUv - 0.5;
  float dist = length(center);

  // Soft radial falloff — gaussian-like, not sharp
  // Creates the luminous, cloud-like appearance
  float falloff = exp(-dist * dist * 6.0);

  // Breathing pulsation — layered sine waves for organic feel
  // Primary pulse follows the planet's orbital period mapping
  float pulse1 = sin(uTime * uPulseSpeed + uSeed) * 0.5 + 0.5;
  // Secondary slower pulse adds organic irregularity
  float pulse2 = sin(uTime * uPulseSpeed * 0.37 + uSeed * 2.3) * 0.5 + 0.5;
  // Tertiary very slow drift
  float pulse3 = sin(uTime * uPulseSpeed * 0.13 + uSeed * 5.1) * 0.5 + 0.5;

  // Combine pulses: primary dominant, secondary adds variation
  float pulse = pulse1 * 0.6 + pulse2 * 0.25 + pulse3 * 0.15;

  // Subtle spatial distortion — the field isn't perfectly circular
  // Adds organic, living quality
  float angle = atan(center.y, center.x);
  float distortion = sin(angle * 3.0 + uTime * uPulseSpeed * 0.2) * 0.08;
  float distortedFalloff = exp(-(dist + distortion) * (dist + distortion) * 6.0);

  // Final alpha combines falloff, intensity, and pulsation
  // The field is more visible when intensity is high
  float alpha = distortedFalloff * uIntensity * (0.3 + pulse * 0.7);

  // Color brightens slightly at pulse peaks
  vec3 color = uColor * (0.8 + pulse * 0.4);

  // Soft inner glow — slightly brighter at the very center
  float innerGlow = exp(-dist * dist * 20.0) * 0.3 * pulse;
  color += vec3(innerGlow);

  gl_FragColor = vec4(color, alpha * 0.85);
}
