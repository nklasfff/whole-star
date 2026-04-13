'use client';

import Link from 'next/link';
import { useChart } from '@/components/ChartContext';
import PairDisplay from '@/components/PairDisplay';

export default function PairsPage() {
  const { chart } = useChart();

  if (!chart) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-6">
        <p className="text-[var(--muted)] text-sm font-light">
          Enter your birth data first.
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-10 max-w-lg mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-light tracking-wide text-[var(--foreground)]">
          Active pairs
        </h2>
        <Link
          href="/chart"
          className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Back to field
        </Link>
      </div>

      {chart.activePairs.length === 0 ? (
        <p className="text-sm text-[var(--muted)] font-light text-center py-12">
          No Twin pairs are active right now.
        </p>
      ) : (
        <div className="grid gap-4">
          {chart.activePairs.map(pair => (
            <PairDisplay key={`${pair.twin1}-${pair.twin2}`} pair={pair} />
          ))}
        </div>
      )}
    </main>
  );
}
