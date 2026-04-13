'use client';

/**
 * Daily page — visualization + invitation.
 *
 * Shows the brightest Twin as a single pulsing field,
 * the daily invitation text, and any active pairs
 * involving the brightest Twin.
 */

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useChart } from '@/components/ChartContext';
import DailyInvitation from '@/components/DailyInvitation';
import PairDisplay from '@/components/PairDisplay';
import { generateInvitation } from '@/core/invitation';
import { getTwinDefinition } from '@/core/twins';

// Single-field visualization — dynamic import, no SSR
const TwinCanvas = dynamic(() => import('@/visual/TwinCanvas'), { ssr: false });

export default function DailyPage() {
  const { chart } = useChart();

  const invitation = useMemo(() => {
    if (!chart) return null;
    return generateInvitation(chart.brightestTwin);
  }, [chart]);

  // Pairs involving the brightest Twin
  const relevantPairs = useMemo(() => {
    if (!chart) return [];
    const planet = chart.brightestTwin.planet;
    return chart.activePairs.filter(
      p => p.twin1 === planet || p.twin2 === planet
    );
  }, [chart]);

  if (!chart || !invitation) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <p className="text-[var(--muted)] text-sm">
          Enter your birth data to receive a daily invitation.
        </p>
      </main>
    );
  }

  const brightestDef = getTwinDefinition(chart.brightestTwin.planet);
  const color = brightestDef?.color ?? '#C9A088';

  // Show only the brightest Twin and its close neighbours for a focused view
  const focusedTwins = useMemo(() => {
    const sorted = [...chart.twinStates].sort((a, b) => b.intensity - a.intensity);
    return sorted.slice(0, 3); // Top 3 for a calm, focused visualization
  }, [chart]);

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-8">
      {/* Mini visualization — focused on the brightest Twin */}
      <section
        className="w-full max-w-lg mb-6 rounded-2xl overflow-hidden"
        style={{
          height: '280px',
          border: `1px solid ${color}15`,
        }}
      >
        <TwinCanvas
          twinStates={focusedTwins}
          positions={chart.positions}
        />
      </section>

      {/* Date */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-6">
        {new Date().toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>

      {/* The invitation */}
      <DailyInvitation invitation={invitation} />

      {/* Active pairs involving the brightest Twin */}
      {relevantPairs.length > 0 && (
        <section className="w-full max-w-lg mt-10">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-4 text-center">
            What else stirs alongside
          </h3>
          <div className="grid gap-3">
            {relevantPairs.map(pair => (
              <PairDisplay key={`${pair.twin1}-${pair.twin2}`} pair={pair} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
