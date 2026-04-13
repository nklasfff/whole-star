'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChart } from '@/components/ChartContext';
import { generateInvitation, getHouseFelt } from '@/core/invitation';
import { getTwinDefinition } from '@/core/twins';
import PairDisplay from '@/components/PairDisplay';

const TwinCanvas = dynamic(() => import('@/visual/TwinCanvas'), { ssr: false });

export default function DailyPage() {
  const router = useRouter();
  const { chart, hydrated } = useChart();
  const [showPairs, setShowPairs] = useState(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    if (hydrated && !chart) router.replace('/');
  }, [hydrated, chart, router]);

  const invitation = useMemo(() => {
    if (!chart) return null;
    return generateInvitation(chart.brightestTwin);
  }, [chart]);

  // Swipe up to show pairs
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (dy > 80) setShowPairs(true);
    if (dy < -80) setShowPairs(false);
    touchStartY.current = null;
  }, []);

  if (!chart || !invitation) {
    return <div className="fixed inset-0 bg-[var(--background)]" />;
  }

  const def = getTwinDefinition(chart.brightestTwin.planet);
  const color = def?.color ?? '#C9A088';
  const felt = getHouseFelt(chart.brightestTwin.twinHouse);
  const singleTwin = [chart.brightestTwin];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-[var(--background)]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fullscreen visualization */}
      <div className="absolute inset-0">
        <TwinCanvas
          twinStates={singleTwin}
          positions={chart.positions}
          fieldScale={3}
          hideChart
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--background)] to-transparent opacity-50 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--background)] to-transparent opacity-80 pointer-events-none" />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full px-8 pb-24">

        {/* Date — top */}
        <div className="pt-6 text-center">
          <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-white/25">
            {today}
          </p>
        </div>

        {/* Center — twin name + felt */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-12">
          <h1
            className="text-5xl sm:text-6xl font-serif font-light tracking-wide text-center leading-tight"
            style={{ color }}
          >
            {invitation.twinName}
          </h1>
          <p className="mt-4 text-xs font-sans text-white/25 text-center max-w-xs">
            {felt}
          </p>
        </div>

        {/* Bottom — invitation question */}
        <div className="pb-4">
          <p className="text-base sm:text-lg font-serif font-light leading-relaxed text-white/60 text-center max-w-md mx-auto">
            {invitation.invitationText}
          </p>

          {/* Swipe hint */}
          {chart.activePairs.length > 0 && !showPairs && (
            <div className="flex justify-center mt-6">
              <div className="w-8 h-1 rounded-full bg-white/10" />
            </div>
          )}
        </div>
      </div>

      {/* Swipe-up pairs panel */}
      {chart.activePairs.length > 0 && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ${
              showPairs ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setShowPairs(false)}
          />

          {/* Panel */}
          <div
            className={`fixed inset-x-0 bottom-0 z-40 bg-[var(--background)] rounded-t-2xl border-t border-[var(--border)] transition-transform duration-500 ease-out ${
              showPairs ? 'translate-y-0' : 'translate-y-full'
            }`}
            style={{ maxHeight: '60vh' }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-white/10" />
            </div>
            <div className="px-6 pb-8 overflow-y-auto" style={{ maxHeight: 'calc(60vh - 40px)' }}>
              <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-[var(--muted)] mb-4">
                Active pairs
              </p>
              <div className="grid gap-3">
                {chart.activePairs.map(pair => (
                  <PairDisplay key={`${pair.twin1}-${pair.twin2}`} pair={pair} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
