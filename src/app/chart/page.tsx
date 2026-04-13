'use client';

import dynamic from 'next/dynamic';
import { useChart } from '@/components/ChartContext';
import TwinCard from '@/components/TwinCard';
import PairDisplay from '@/components/PairDisplay';
import { getTwinDefinition } from '@/core/twins';
import type { TwinDefinition } from '@/core/types';
import twinsData from '@/data/twins.json';

const definitions = twinsData as TwinDefinition[];

// Dynamic import — Three.js must not be SSR'd
const TwinCanvas = dynamic(() => import('@/visual/TwinCanvas'), { ssr: false });

export default function ChartPage() {
  const { chart } = useChart();

  if (!chart) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <p className="text-[var(--muted)] text-sm">
          Enter your birth data to see your Twin field.
        </p>
      </main>
    );
  }

  // Sort twins by intensity (brightest first)
  const sortedTwins = [...chart.twinStates].sort(
    (a, b) => b.intensity - a.intensity
  );

  return (
    <main className="flex flex-1 flex-col px-6 py-8 max-w-3xl mx-auto w-full">
      {/* ─── Visualization ─────────────────────────────────────────── */}
      <section className="mb-8 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--background)]"
        style={{ height: '500px' }}
      >
        <TwinCanvas
          twinStates={chart.twinStates}
          positions={chart.positions}
        />
      </section>

      {/* ─── Brightest Twin ────────────────────────────────────────── */}
      <div className="mb-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-1">
          Brightest Twin
        </p>
        <h2
          className="text-2xl font-light tracking-wide"
          style={{ color: getTwinDefinition(chart.brightestTwin.planet)?.color }}
        >
          {chart.brightestTwin.twinName}
        </h2>
        <p className="text-sm text-[var(--muted)] mt-1">
          Intensity {Math.round(chart.brightestTwin.intensity)} &mdash; House {chart.brightestTwin.twinHouse}
        </p>
      </div>

      {/* ─── All Twins ─────────────────────────────────────────────── */}
      <section className="mb-10">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-4">
          All Twins
        </h3>
        <div className="grid gap-3">
          {sortedTwins.map(twin => {
            const stress = chart.stressResults.find(s => s.planet === twin.planet)!;
            const def = definitions.find(d => d.planet === twin.planet)!;
            return (
              <TwinCard
                key={twin.planet}
                twin={twin}
                stress={stress}
                definition={def}
              />
            );
          })}
        </div>
      </section>

      {/* ─── Active Pairs ──────────────────────────────────────────── */}
      {chart.activePairs.length > 0 && (
        <section className="mb-10">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-4">
            Active Twin Pairs
          </h3>
          <div className="grid gap-3">
            {chart.activePairs.map((pair) => (
              <PairDisplay key={`${pair.twin1}-${pair.twin2}`} pair={pair} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Debug ─────────────────────────────────────────────────── */}
      <details className="mb-10">
        <summary className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] cursor-pointer hover:text-[var(--foreground)] transition-colors">
          Planet positions (debug)
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs text-[var(--muted)]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 font-normal">Planet</th>
                <th className="text-left py-2 font-normal">Sign</th>
                <th className="text-right py-2 font-normal">Degree</th>
                <th className="text-right py-2 font-normal">House</th>
                <th className="text-right py-2 font-normal">Retro</th>
                <th className="text-right py-2 font-normal">Stress</th>
              </tr>
            </thead>
            <tbody>
              {chart.positions.map(pos => {
                const stress = chart.stressResults.find(s => s.planet === pos.planet)!;
                return (
                  <tr key={pos.planet} className="border-b border-[var(--border)]/30">
                    <td className="py-2">{pos.planet}</td>
                    <td className="py-2">{pos.sign}</td>
                    <td className="py-2 text-right tabular-nums">
                      {pos.signDegree.toFixed(1)}&deg;
                    </td>
                    <td className="py-2 text-right tabular-nums">{pos.house}</td>
                    <td className="py-2 text-right">{pos.isRetrograde ? 'R' : ''}</td>
                    <td className="py-2 text-right tabular-nums">{stress.stressIndex}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </main>
  );
}
