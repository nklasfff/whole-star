'use client';

import type { ActiveTwinPair } from '@/core/types';
import { getTwinDefinition } from '@/core/twins';
import { getPairText } from '@/lib/pairText';

interface PairDisplayProps {
  pair: ActiveTwinPair;
}

export default function PairDisplay({ pair }: PairDisplayProps) {
  const def1 = getTwinDefinition(pair.twin1);
  const def2 = getTwinDefinition(pair.twin2);
  const pairText = getPairText(pair.twin1, pair.twin2);

  const name = pairText?.name ?? pair.quality;
  const text = pairText?.text ?? pair.description;

  return (
    <div
      className="rounded-xl p-5 border border-[var(--border)]"
      style={{
        background: `linear-gradient(135deg, ${def1?.color}08 0%, ${def2?.color}08 100%)`,
      }}
    >
      {/* Twin names */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: def1?.color }} />
        <span className="text-[11px] font-sans text-white/30" style={{ color: def1?.color }}>
          {def1?.name}
        </span>
        <span className="text-white/15 text-[10px]">&</span>
        <span className="text-[11px] font-sans text-white/30" style={{ color: def2?.color }}>
          {def2?.name}
        </span>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: def2?.color }} />
      </div>

      {/* Pair name */}
      <h4 className="text-base font-serif font-light text-[var(--foreground)] mb-2 leading-snug">
        {name}
      </h4>

      {/* Pair text */}
      <p className="text-sm font-serif font-light text-white/45 leading-[1.8]">
        {text}
      </p>
    </div>
  );
}
