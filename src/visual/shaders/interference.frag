// Fragment shader for Twin field interference patterns.
// Applied as a screen-space post-processing pass.
// Where two Twin fields overlap, a third emergent pattern arises —
// unpredictable, organic, belonging to neither field alone.
// This is the visual representation of the emergent layer (SYSTEM.md §7.6).

precision mediump float;

uniform sampler2D tDiffuse;  // The rendered scene texture
uniform float uTime;         // Elapsed time
uniform vec2 uResolution;    // Screen resolution

varying vec2 vUv;

// Simplex-like noise for organic interference patterns
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f); // smoothstep

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal Brownian Motion — layered noise for richness
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.1;
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  vec4 color = texture2D(tDiffuse, vUv);

  // Only apply interference where there's already visible content
  // (i.e., where Twin fields overlap and alpha accumulates)
  float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));

  if (brightness > 0.05) {
    // Generate organic interference pattern
    vec2 st = vUv * 8.0;
    float n = fbm(st + uTime * 0.05);
    float n2 = fbm(st * 1.5 - uTime * 0.03 + 100.0);

    // Interference is stronger where more fields overlap (brighter regions)
    float interferenceStrength = smoothstep(0.1, 0.4, brightness) * 0.15;

    // Create subtle color shift in overlap regions
    // The emergent pattern should feel like it belongs to neither field
    vec3 interference = vec3(
      n * 0.8 + n2 * 0.2,
      n * 0.5 + n2 * 0.5,
      n * 0.2 + n2 * 0.8
    );

    // Blend interference into the existing color
    color.rgb += (interference - 0.5) * interferenceStrength;

    // Very subtle luminance variation — fields seem to breathe together
    float sharedPulse = sin(uTime * 0.3 + n * 3.14) * 0.05;
    color.rgb += color.rgb * sharedPulse;
  }

  gl_FragColor = color;
}
