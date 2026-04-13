// Vertex shader for Twin luminous field rendering.
// Passes UV coordinates and world position to the fragment shader
// for radial gradient and pulsation calculations.

varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;

  // Transform vertex to world space for interference calculations
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
