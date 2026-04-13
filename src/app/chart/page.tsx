'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useChart } from '@/components/ChartContext';
import { getTwinDefinition } from '@/core/twins';
import { getHouseFelt } from '@/core/invitation';
import type { TwinState, TwinDefinition } from '@/core/types';

const TwinCanvas = dynamic(() => import('@/visual/TwinCanvas'), { ssr: false });

export default function ChartPage() {
  const { chart } = useChart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Sort twins by intensity, brightest first
  const sortedTwins = useMemo(() => {
    if (!chart) return [];
    return [...chart.twinStates].sort((a, b) => b.intensity - a.intensity);
  }, [chart]);

  const current = sortedTwins[currentIndex];
  const def = current ? getTwinDefinition(current.planet) : null;
  const color = def?.color ?? '#C9A088';
  const felt = current ? getHouseFelt(current.twinHouse) : '';

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, sortedTwins.length - 1)));
  }, [sortedTwins.length]);

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Touch/swipe handling
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  }, [next, prev]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
  }, [next, prev]);

  if (!chart || !current || !def) {
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--muted)] text-sm font-light">
          Enter your birth data to see your Twin field.
        </p>
      </main>
    );
  }

  // Show only the current twin in the visualization
  const singleTwin = useMemo(() => [current], [current]);

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-[var(--background)] select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Twin carousel"
    >
      {/* Fullscreen visualization */}
      <div className="absolute inset-0 transition-opacity duration-1000" key={current.planet}>
        <TwinCanvas
          twinStates={singleTwin}
          positions={chart.positions}
          fieldScale={2.5}
          hideChart
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--background)] to-transparent opacity-50 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[var(--background)] to-transparent opacity-70 pointer-events-none" />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full px-8">

        {/* Center: name + quality + felt */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-8">
          <h1
            className="text-5xl sm:text-6xl font-extralight tracking-wide text-center leading-tight transition-colors duration-700"
            style={{ color }}
          >
            {current.twinName}
          </h1>

          <p className="mt-5 text-sm font-light text-white/50 text-center max-w-sm leading-relaxed">
            {def.twinQuality}
          </p>

          <p className="mt-3 text-xs font-light text-white/30 text-center">
            {felt}
          </p>
        </div>

        {/* Bottom: intensity bar + dots + pairs link */}
        <div className="pb-10 sm:pb-14 flex flex-col items-center gap-6">

          {/* Subtle intensity bar */}
          <div className="w-48 h-[2px] rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${current.intensity}%`,
                background: color,
                opacity: 0.5,
              }}
            />
          </div>

          {/* Carousel dots */}
          <div className="flex gap-2 items-center">
            {sortedTwins.map((twin, i) => {
              const dotDef = getTwinDefinition(twin.planet);
              const isActive = i === currentIndex;
              return (
                <button
                  key={twin.planet}
                  onClick={() => goTo(i)}
                  className="transition-all duration-500 rounded-full"
                  style={{
                    width: isActive ? 20 : 6,
                    height: 6,
                    background: isActive ? dotDef?.color : 'rgba(255,255,255,0.15)',
                    opacity: isActive ? 0.8 : 0.4,
                  }}
                  aria-label={`Go to ${twin.twinName}`}
                />
              );
            })}
          </div>

          {/* Pairs link */}
          {chart.activePairs.length > 0 && (
            <Link
              href="/chart/pairs"
              className="text-[10px] uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-colors"
            >
              {chart.activePairs.length} active pair{chart.activePairs.length !== 1 ? 's' : ''}
            </Link>
          )}
        </div>
      </div>

      {/* Invisible click zones for navigation */}
      <button
        onClick={prev}
        className="absolute left-0 top-0 bottom-0 w-1/4 z-20 cursor-w-resize opacity-0"
        aria-label="Previous twin"
        disabled={currentIndex === 0}
      />
      <button
        onClick={next}
        className="absolute right-0 top-0 bottom-0 w-1/4 z-20 cursor-e-resize opacity-0"
        aria-label="Next twin"
        disabled={currentIndex === sortedTwins.length - 1}
      />
    </div>
  );
}
