'use client';

import type { TwinState, StressResult, TwinDefinition } from '@/core/types';

interface TwinCardProps {
  twin: TwinState;
  stress: StressResult;
  definition: TwinDefinition;
}

export default function TwinCard({ twin, stress, definition }: TwinCardProps) {
  const intensityPercent = Math.round(twin.intensity);
  const isActive = twin.intensity > 50;

  return (
    <div
      className="rounded-xl p-5 transition-all duration-500"
      style={{
        background: `linear-gradient(135deg, var(--surface) 0%, ${definition.color}15 100%)`,
        borderLeft: `3px solid ${definition.color}`,
        opacity: 0.4 + (twin.intensity / 100) * 0.6,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3
            className="text-lg font-light tracking-wide"
            style={{ color: definition.color }}
          >
            {twin.twinName}
          </h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {definition.planet}&rsquo;s Twin
          </p>
        </div>
        <div className="text-right">
          <span
            className="text-2xl font-light tabular-nums"
            style={{ color: isActive ? definition.color : 'var(--muted)' }}
          >
            {intensityPercent}
          </span>
          <p className="text-[10px] text-[var(--muted)] uppercase tracking-widest">
            intensity
          </p>
        </div>
      </div>

      {/* Intensity bar */}
      <div className="h-1 rounded-full bg-[var(--border)] mb-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${intensityPercent}%`,
            background: definition.color,
            opacity: 0.5 + (twin.intensity / 100) * 0.5,
          }}
        />
      </div>

      {/* Twin quality */}
      <p className="text-xs text-[var(--muted)] leading-relaxed mb-2">
        {definition.twinQuality}
      </p>

      {/* House axis */}
      <div className="flex items-center gap-2 text-[10px] text-[var(--muted)] uppercase tracking-widest">
        <span>House {twin.planetHouse}</span>
        <span className="opacity-40">&rarr;</span>
        <span style={{ color: definition.color }}>House {twin.twinHouse}</span>
      </div>

      {/* Stress breakdown (collapsed) */}
      <details className="mt-3">
        <summary className="text-[10px] text-[var(--muted)] uppercase tracking-widest cursor-pointer hover:text-[var(--foreground)] transition-colors">
          Stress components
        </summary>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-[var(--muted)]">
          <span>Dignity</span>
          <span className="text-right tabular-nums">{stress.components.dignity}</span>
          <span>Aspects</span>
          <span className="text-right tabular-nums">{stress.components.aspects}</span>
          <span>Retrograde</span>
          <span className="text-right tabular-nums">{stress.components.retrograde}</span>
          <span>House</span>
          <span className="text-right tabular-nums">{stress.components.house}</span>
        </div>
      </details>
    </div>
  );
}
