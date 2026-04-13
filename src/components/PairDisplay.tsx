'use client';

import type { ActiveTwinPair } from '@/core/types';
import { getTwinDefinition } from '@/core/twins';

interface PairDisplayProps {
  pair: ActiveTwinPair;
}

export default function PairDisplay({ pair }: PairDisplayProps) {
  const def1 = getTwinDefinition(pair.twin1);
  const def2 = getTwinDefinition(pair.twin2);

  return (
    <div
      className="rounded-xl p-4 border border-[var(--border)]"
      style={{
        background: `linear-gradient(135deg, ${def1?.color}10 0%, ${def2?.color}10 100%)`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-light" style={{ color: def1?.color }}>
          {def1?.name}
        </span>
        <span className="text-[var(--muted)] text-[10px]">&amp;</span>
        <span className="text-xs font-light" style={{ color: def2?.color }}>
          {def2?.name}
        </span>
        <span className="ml-auto text-xs tabular-nums text-[var(--muted)]">
          {Math.round(pair.combinedIntensity)}
        </span>
      </div>

      <p className="text-sm font-light text-[var(--foreground)] mb-1">
        {pair.quality}
      </p>
      <p className="text-xs text-[var(--muted)] leading-relaxed">
        {pair.description}
      </p>
    </div>
  );
}
