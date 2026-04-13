'use client';

import dynamic from 'next/dynamic';
import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useChart } from '@/components/ChartContext';
import { getTwinDefinition } from '@/core/twins';
import TwinCardSmall from '@/components/TwinCardSmall';
import type { TwinDefinition } from '@/core/types';
import twinsData from '@/data/twins.json';

const definitions = twinsData as TwinDefinition[];
const TwinCanvas = dynamic(() => import('@/visual/TwinCanvas'), { ssr: false });

export default function SkyPage() {
  const router = useRouter();
  const { chart, hydrated } = useChart();

  useEffect(() => {
    if (hydrated && !chart) router.replace('/');
  }, [hydrated, chart, router]);

  const sortedTwins = useMemo(() => {
    if (!chart) return [];
    return [...chart.twinStates].sort((a, b) => b.intensity - a.intensity);
  }, [chart]);

  if (!chart) {
    return <div className="fixed inset-0 bg-[var(--background)]" />;
  }

  const brightest = chart.brightestTwin;
  const brightestDef = getTwinDefinition(brightest.planet);
  const otherTwins = sortedTwins.slice(1);

  return (
    <main className="min-h-screen bg-[var(--background)] pb-24 animate-fadeIn">
      {/* Hero visualization — all twins pulsing together */}
      <section className="h-[45vh] w-full relative">
        <TwinCanvas
          twinStates={chart.twinStates}
          positions={chart.positions}
          hideChart
        />
        {/* Bottom gradient blend */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" />
      </section>

      {/* Brightest twin highlight */}
      <section className="px-6 -mt-4 relative z-10">
        <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-[var(--muted)] mb-2">
          Brightest today
        </p>
        <h2
          className="text-3xl font-serif font-light tracking-wide mb-2"
          style={{ color: brightestDef?.color }}
        >
          {brightest.twinName}
        </h2>
        <p className="text-sm font-serif font-light text-white/40 leading-relaxed mb-4 max-w-sm">
          {brightestDef?.twinQuality}
        </p>
        <Link
          href="/daily"
          className="inline-block px-6 py-2.5 rounded-full border border-[var(--accent)]/30 text-xs font-sans text-[var(--accent)] tracking-wide hover:border-[var(--accent)] transition-all duration-300"
        >
          Explore today
        </Link>
      </section>

      {/* Horizontal scroll of remaining twins */}
      <section className="mt-8">
        <p className="px-6 text-[10px] font-sans uppercase tracking-[0.2em] text-[var(--muted)] mb-3">
          Your twins
        </p>
        <div className="flex gap-3 px-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {otherTwins.map(twin => {
            const def = definitions.find(d => d.planet === twin.planet)!;
            return (
              <TwinCardSmall key={twin.planet} twin={twin} definition={def} />
            );
          })}
        </div>
      </section>
    </main>
  );
}
