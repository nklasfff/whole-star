'use client';

import Link from 'next/link';
import type { ActiveTwinPair, Planet } from '@/core/types';
import { getTwinDefinition } from '@/core/twins';
import { planetToTwinId } from '@/lib/twinId';
import { getPairText } from '@/lib/pairText';

interface PairCardSmallProps {
  pair: ActiveTwinPair;
  currentPlanet: Planet;
}

export default function PairCardSmall({ pair, currentPlanet }: PairCardSmallProps) {
  const otherPlanet = pair.twin1 === currentPlanet ? pair.twin2 : pair.twin1;
  const otherDef = getTwinDefinition(otherPlanet);
  const otherId = planetToTwinId(otherPlanet);
  const pairText = getPairText(pair.twin1, pair.twin2);

  return (
    <Link
      href={`/twin/${otherId}`}
      className="flex items-center gap-3 rounded-xl p-3 bg-[var(--surface)] border border-[var(--border)] active:scale-[0.97] transition-transform duration-150"
    >
      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: otherDef?.color }}
      />
      <div className="min-w-0">
        <p className="text-xs font-serif font-light truncate" style={{ color: otherDef?.color }}>
          {otherDef?.name}
        </p>
        <p className="text-[11px] font-serif font-light text-white/30 truncate">
          {pairText?.name ?? pair.quality}
        </p>
      </div>
    </Link>
  );
}
