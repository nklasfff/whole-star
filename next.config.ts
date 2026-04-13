import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // swisseph-wasm uses WASM + data files that must be resolved at runtime.
  // Externalizing ensures Node.js resolves it from node_modules directly,
  // rather than bundling (which loses the .wasm and .data files).
  serverExternalPackages: ["swisseph-wasm"],

  // Ensure Vercel's output file tracing includes the WASM binary and data
  outputFileTracingIncludes: {
    "/api/chart": [
      "./node_modules/swisseph-wasm/wasm/**/*",
      "./node_modules/swisseph-wasm/src/**/*",
    ],
  },
};

export default nextConfig;
