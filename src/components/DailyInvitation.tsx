'use client';

/**
 * DailyInvitation — the daily message component.
 *
 * Tone: Not "the stars say..." but "what if you noticed..."
 * Not prescriptive but invitational. Not passive-receiving but active-sensing.
 * (SYSTEM.md §8)
 */

import type { DailyInvitation as DailyInvitationType } from '@/core/types';
import { getTwinDefinition } from '@/core/twins';
import TwinSymbol from '@/visual/TwinSymbol';

interface DailyInvitationProps {
  invitation: DailyInvitationType;
}

export default function DailyInvitation({ invitation }: DailyInvitationProps) {
  const def = getTwinDefinition(invitation.planet);
  const color = def?.color ?? '#C9A088';

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Twin symbol + name */}
      <div className="flex flex-col items-center mb-8">
        <TwinSymbol planet={invitation.planet} size={56} className="mb-4 opacity-70" />
        <h2
          className="text-2xl font-light tracking-wide mb-1"
          style={{ color }}
        >
          {invitation.twinName}
        </h2>
        <p className="text-xs text-[var(--muted)] tabular-nums">
          Intensity {Math.round(invitation.intensity)}
        </p>
      </div>

      {/* House axis context */}
      <div className="text-center mb-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] mb-2">
          House axis
        </p>
        <p
          className="text-sm font-light"
          style={{ color }}
        >
          {invitation.houseAxis.theme}
        </p>
        <div className="flex items-center justify-center gap-3 mt-2 text-xs text-[var(--muted)]">
          <span>House {invitation.houseAxis.opposite}</span>
          <span
            className="w-12 h-px"
            style={{ background: `${color}40` }}
          />
          <span style={{ color }}>House {invitation.houseAxis.house}</span>
        </div>
      </div>

      {/* The invitation itself */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: `linear-gradient(180deg, ${color}06 0%, ${color}10 100%)`,
          border: `1px solid ${color}18`,
        }}
      >
        <p className="text-sm leading-[1.8] font-light text-[var(--foreground)]">
          {invitation.invitationText}
        </p>
      </div>

      {/* Twin quality — the deeper context */}
      {def && (
        <p className="text-center text-xs text-[var(--muted)] mt-6 leading-relaxed max-w-sm mx-auto italic">
          {def.twinQuality}
        </p>
      )}
    </div>
  );
}
