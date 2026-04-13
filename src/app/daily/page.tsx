'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useChart } from '@/components/ChartContext';
import { generateInvitation, getHouseFelt } from '@/core/invitation';
import { getTwinDefinition } from '@/core/twins';

const TwinCanvas = dynamic(() => import('@/visual/TwinCanvas'), { ssr: false });

export default function DailyPage() {
  const { chart } = useChart();

  const invitation = useMemo(() => {
    if (!chart) return null;
    return generateInvitation(chart.brightestTwin);
  }, [chart]);

  if (!chart || !invitation) {
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--muted)] text-sm font-light">
          Enter your birth data to begin.
        </p>
      </main>
    );
  }

  const def = getTwinDefinition(chart.brightestTwin.planet);
  const color = def?.color ?? '#C9A088';
  const felt = getHouseFelt(chart.brightestTwin.twinHouse);

  // Only the brightest twin — nothing else
  const singleTwin = useMemo(
    () => [chart.brightestTwin],
    [chart.brightestTwin]
  );

  return (
    <div className="fixed inset-0 overflow-hidden bg-[var(--background)]">
      {/* Fullscreen visualization — breathes beneath everything */}
      <div className="absolute inset-0">
        <TwinCanvas
          twinStates={singleTwin}
          positions={chart.positions}
          fieldScale={3}
          hideChart
        />
      </div>

      {/* Gradient overlays for text legibility */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[var(--background)] to-transparent opacity-60 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[var(--background)] to-transparent opacity-80 pointer-events-none" />

      {/* Content layer — name at top, question at bottom */}
      <div className="relative z-10 flex flex-col h-full px-8">

        {/* Top: Twin name + where it stirs */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-16">
          <h1
            className="text-5xl sm:text-6xl font-extralight tracking-wide text-center leading-tight"
            style={{ color }}
          >
            {invitation.twinName}
          </h1>
          <p className="mt-4 text-sm font-light text-white/40 text-center max-w-xs">
            {felt}
          </p>
        </div>

        {/* Bottom: the single question */}
        <div className="pb-14 sm:pb-20">
          <p className="text-base sm:text-lg font-light leading-relaxed text-white/70 text-center max-w-md mx-auto">
            {invitation.invitationText}
          </p>
        </div>
      </div>
    </div>
  );
}
