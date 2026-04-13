'use client';

import dynamic from 'next/dynamic';
import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useChart } from '@/components/ChartContext';
import { getTwinDefinition } from '@/core/twins';
import { getHouseFelt, generateInvitation } from '@/core/invitation';
import { findTwinByTwinId, planetToTwinId } from '@/lib/twinId';
import PairCardSmall from '@/components/PairCardSmall';
import type { TwinDefinition } from '@/core/types';

const TwinCanvas = dynamic(() => import('@/visual/TwinCanvas'), { ssr: false });

export default function TwinDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { chart, hydrated } = useChart();
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (hydrated && !chart) router.replace('/');
  }, [hydrated, chart, router]);

  // All twins sorted by intensity
  const sortedTwins = useMemo(() => {
    if (!chart) return [];
    return [...chart.twinStates].sort((a, b) => b.intensity - a.intensity);
  }, [chart]);

  const currentTwin = chart ? findTwinByTwinId(id, chart.twinStates) : undefined;
  const currentIndex = sortedTwins.findIndex(t => t.planet === currentTwin?.planet);
  const def = currentTwin ? getTwinDefinition(currentTwin.planet) : undefined;
  const color = def?.color ?? '#C9A088';
  const felt = currentTwin ? getHouseFelt(currentTwin.twinHouse) : '';
  const invitation = currentTwin ? generateInvitation(currentTwin) : undefined;

  // Active pairs involving this twin
  const relevantPairs = useMemo(() => {
    if (!chart || !currentTwin) return [];
    return chart.activePairs.filter(
      p => p.twin1 === currentTwin.planet || p.twin2 === currentTwin.planet
    );
  }, [chart, currentTwin]);

  // Swipe navigation
  const goToIndex = useCallback((i: number) => {
    const target = sortedTwins[i];
    if (target) router.push(`/twin/${planetToTwinId(target.planet)}`);
  }, [sortedTwins, router]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0 && currentIndex < sortedTwins.length - 1) goToIndex(currentIndex + 1);
      if (dx > 0 && currentIndex > 0) goToIndex(currentIndex - 1);
    }
    touchStartX.current = null;
  }, [currentIndex, sortedTwins.length, goToIndex]);

  if (!chart || !currentTwin || !def) {
    return <div className="fixed inset-0 bg-[var(--background)]" />;
  }

  const singleTwin = [currentTwin];

  return (
    <div
      className="min-h-screen bg-[var(--background)] pb-24 animate-fadeIn"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Back button */}
      <Link
        href="/sky"
        className="fixed top-4 left-4 z-30 text-white/30 hover:text-white/60 transition-colors text-sm font-sans px-3 py-2"
      >
        &larr; Sky
      </Link>

      {/* Visualization */}
      <section className="h-[40vh] w-full relative">
        <TwinCanvas
          twinStates={singleTwin}
          positions={chart.positions}
          fieldScale={2.5}
          hideChart
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" />
      </section>

      {/* Twin info */}
      <section className="px-6 -mt-4 relative z-10">
        <h1
          className="text-4xl font-serif font-light tracking-wide mb-3"
          style={{ color }}
        >
          {currentTwin.twinName}
        </h1>

        <p className="text-sm font-serif font-light italic text-white/40 leading-relaxed mb-2 max-w-md">
          {def.twinQuality}
        </p>

        <p className="text-xs font-sans text-white/25 mb-6">
          {felt}
        </p>

        {/* Today's invitation for this twin */}
        {invitation && (
          <div
            className="rounded-2xl p-6 mb-6"
            style={{
              background: `${color}08`,
              border: `1px solid ${color}15`,
            }}
          >
            <p className="text-sm font-serif font-light leading-[1.8] text-white/60">
              {invitation.invitationText}
            </p>
          </div>
        )}

        {/* Active pairs involving this twin */}
        {relevantPairs.length > 0 && (
          <div>
            <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-[var(--muted)] mb-3">
              Resonates with
            </p>
            <div className="grid gap-2">
              {relevantPairs.map(pair => (
                <PairCardSmall
                  key={`${pair.twin1}-${pair.twin2}`}
                  pair={pair}
                  currentPlanet={currentTwin.planet}
                />
              ))}
            </div>
          </div>
        )}

        {/* Position indicator */}
        <div className="flex gap-1.5 justify-center mt-8">
          {sortedTwins.map((t, i) => {
            const dotDef = getTwinDefinition(t.planet);
            const isActive = i === currentIndex;
            return (
              <div
                key={t.planet}
                className="rounded-full transition-all duration-500"
                style={{
                  width: isActive ? 16 : 5,
                  height: 5,
                  background: isActive ? dotDef?.color : 'rgba(255,255,255,0.1)',
                }}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
