'use client';

import Link from 'next/link';
import type { TwinState, TwinDefinition } from '@/core/types';
import { planetToTwinId } from '@/lib/twinId';

interface TwinCardSmallProps {
  twin: TwinState;
  definition: TwinDefinition;
}

export default function TwinCardSmall({ twin, definition }: TwinCardSmallProps) {
  const id = planetToTwinId(twin.planet);

  return (
    <Link
      href={`/twin/${id}`}
      className="min-w-[140px] rounded-xl p-4 bg-[var(--surface)] border border-[var(--border)] snap-start active:scale-[0.97] transition-transform duration-150 block"
    >
      <p
        className="text-sm font-serif font-light mb-3 truncate"
        style={{ color: definition.color }}
      >
        {twin.twinName}
      </p>
      <div className="h-1 rounded-full bg-[var(--border)] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${twin.intensity}%`,
            background: definition.color,
            opacity: 0.6,
          }}
        />
      </div>
    </Link>
  );
}
