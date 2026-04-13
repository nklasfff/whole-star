'use client';

/**
 * TwinSymbol — open-form SVG symbol for each Twin.
 *
 * Classical planet symbols are sharp, iconic, closed forms.
 * Twin symbols are open forms: half-arcs, spirals that do not close,
 * circles with openings. They communicate process, incompleteness, becoming.
 * Each contains a fragment of its planet's classical symbol.
 * (SYSTEM.md §7.5)
 */

import type { Planet } from '@/core/types';
import { getTwinColorHex } from './colors';

interface TwinSymbolProps {
  planet: Planet;
  size?: number;
  className?: string;
}

export default function TwinSymbol({ planet, size = 40, className }: TwinSymbolProps) {
  const color = getTwinColorHex(planet);
  const half = size / 2;
  const r = size * 0.35;

  // Each symbol is an open, incomplete form referencing the classical symbol
  const paths: Record<Planet, string> = {
    // Sun: open circle — the classical circle with a gap at the top
    Sun: `M ${half + r} ${half}
          A ${r} ${r} 0 1 0 ${half - r * 0.2} ${half - r * 0.97}`,

    // Moon: open crescent — incomplete arc
    Moon: `M ${half + r * 0.6} ${half - r}
           A ${r} ${r} 0 0 0 ${half + r * 0.6} ${half + r}
           A ${r * 0.6} ${r * 0.7} 0 0 1 ${half + r * 0.3} ${half - r * 0.5}`,

    // Mercury: broken caduceus — partial upward spiral
    Mercury: `M ${half} ${half + r}
              C ${half + r} ${half + r * 0.5} ${half + r} ${half - r * 0.5} ${half} ${half - r}
              M ${half - r * 0.5} ${half - r * 0.3}
              L ${half + r * 0.5} ${half - r * 0.3}`,

    // Venus: open mirror — arc without closure, handle trails off
    Venus: `M ${half + r * 0.8} ${half - r * 0.2}
            A ${r * 0.8} ${r * 0.8} 0 1 0 ${half - r * 0.3} ${half - r * 0.9}
            M ${half} ${half + r * 0.1}
            L ${half} ${half + r}`,

    // Mars: incomplete arrow — thrust without the sharp point
    Mars: `M ${half - r * 0.7} ${half + r * 0.7}
           L ${half + r * 0.3} ${half - r * 0.3}
           M ${half + r * 0.3} ${half - r * 0.3}
           L ${half + r * 0.3} ${half + r * 0.15}`,

    // Jupiter: open curve — expansive arc that doesn't complete
    Jupiter: `M ${half - r * 0.5} ${half - r * 0.6}
              C ${half + r * 0.8} ${half - r * 0.6} ${half + r * 0.2} ${half + r * 0.8} ${half - r * 0.5} ${half + r * 0.5}
              M ${half - r * 0.8} ${half}
              L ${half + r * 0.2} ${half}`,

    // Saturn: open sickle — the curve without its crossing
    Saturn: `M ${half + r * 0.3} ${half - r}
             C ${half + r} ${half - r * 0.5} ${half + r * 0.5} ${half + r * 0.5} ${half - r * 0.3} ${half + r * 0.3}
             M ${half - r * 0.1} ${half - r * 0.5}
             L ${half + r * 0.5} ${half - r * 0.5}`,

    // Uranus: broken axis — the vertical with opening
    Uranus: `M ${half} ${half + r}
             L ${half} ${half - r * 0.3}
             M ${half - r * 0.6} ${half - r * 0.3}
             A ${r * 0.3} ${r * 0.3} 0 0 1 ${half} ${half - r * 0.6}`,

    // Neptune: dissolving trident — prongs fading
    Neptune: `M ${half} ${half + r}
              L ${half} ${half - r * 0.5}
              M ${half - r * 0.5} ${half - r * 0.3}
              C ${half - r * 0.3} ${half - r * 0.8} ${half + r * 0.3} ${half - r * 0.8} ${half + r * 0.5} ${half - r * 0.3}`,

    // Pluto: open weave — interlocking arcs that don't close
    Pluto: `M ${half - r * 0.5} ${half + r * 0.5}
            A ${r * 0.5} ${r * 0.5} 0 0 1 ${half} ${half}
            A ${r * 0.5} ${r * 0.5} 0 0 0 ${half + r * 0.5} ${half - r * 0.5}`,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label={`${planet} Twin symbol`}
    >
      <path
        d={paths[planet]}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.8}
      />
    </svg>
  );
}
