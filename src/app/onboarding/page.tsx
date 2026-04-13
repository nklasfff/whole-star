'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useChart } from '@/components/ChartContext';
import { getAllCities, type GeoLocation } from '@/lib/geocoding';
import type { BirthData, TwinState } from '@/core/types';
import { getTwinDefinition } from '@/core/twins';

const TwinCanvas = dynamic(() => import('@/visual/TwinCanvas'), { ssr: false });

const TOTAL_SCREENS = 7;

export default function OnboardingPage() {
  const router = useRouter();
  const { chart, setChart, setBirthData, hydrated } = useChart();
  const [screen, setScreen] = useState(0);
  const [fade, setFade] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [revealPhase, setRevealPhase] = useState(0); // 0=dark, 1=fields emerging, 2=name appears

  // Form state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [selectedCity, setSelectedCity] = useState<GeoLocation | null>(null);
  const cities = getAllCities();

  // Skip if already has data
  useEffect(() => {
    if (hydrated && chart) router.replace('/sky');
  }, [hydrated, chart, router]);

  // Fade transition
  const goTo = useCallback((next: number) => {
    setFade(false);
    setTimeout(() => {
      setScreen(next);
      setTimeout(() => setFade(true), 50);
    }, 600);
  }, []);

  const next = useCallback(() => {
    if (screen < TOTAL_SCREENS - 1) goTo(screen + 1);
  }, [screen, goTo]);

  const prev = useCallback(() => {
    if (screen > 0) goTo(screen - 1);
  }, [screen, goTo]);

  // Touch handling
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50) next();
    if (dx > 50) prev();
    touchStartX.current = null;
  }, [next, prev]);

  // Form submission
  async function handleReveal() {
    if (!date || !selectedCity) return;
    const birthData: BirthData = {
      date,
      time: timeUnknown ? '12:00' : time,
      latitude: selectedCity.latitude,
      longitude: selectedCity.longitude,
      timezone: selectedCity.timezone,
    };

    setIsCalculating(true);
    setBirthData(birthData);

    try {
      const res = await fetch('/api/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birthData),
      });
      if (!res.ok) throw new Error('Failed');
      const chartData = await res.json();
      setChart(chartData);

      // Transition to reveal screen
      goTo(6);
    } catch (err) {
      console.error('Chart calculation failed:', err);
      setIsCalculating(false);
    }
  }

  // Reveal animation sequence
  useEffect(() => {
    if (screen !== 6 || !chart) return;
    setRevealPhase(0);
    const t1 = setTimeout(() => setRevealPhase(1), 800);
    const t2 = setTimeout(() => setRevealPhase(2), 5000);
    const t3 = setTimeout(() => router.push('/sky'), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [screen, chart, router]);

  // Sorted twins for reveal
  const sortedTwins = useMemo(() => {
    if (!chart) return [];
    return [...chart.twinStates].sort((a, b) => b.intensity - a.intensity);
  }, [chart]);

  const formValid = date && (time || timeUnknown) && selectedCity;

  if (!hydrated) return <div className="fixed inset-0 bg-[var(--background)]" />;

  return (
    <div
      className="fixed inset-0 bg-[var(--background)] overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background visualization — evolves per screen */}
      <div className="absolute inset-0">
        <OnboardingVisual screen={screen} chart={chart} revealPhase={revealPhase} />
      </div>

      {/* Content layer */}
      <div
        className={`relative z-10 flex flex-col h-full px-8 transition-opacity duration-700 ease-out ${
          fade ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Screen 1: Hook */}
        {screen === 0 && (
          <ScreenContainer>
            <p className="text-lg sm:text-xl font-serif font-light leading-relaxed text-white/70 text-center max-w-sm">
              You know your sign. You know your planets. But there is something your chart has never shown you.
            </p>
          </ScreenContainer>
        )}

        {/* Screen 2: Setup */}
        {screen === 1 && (
          <ScreenContainer>
            <p className="text-lg sm:text-xl font-serif font-light leading-relaxed text-white/70 text-center max-w-sm">
              Every planet in your chart expresses a force. Action. Structure. Expansion. Feeling. But every force rests on something it cannot name.
            </p>
          </ScreenContainer>
        )}

        {/* Screen 3: Examples */}
        {screen === 2 && (
          <ScreenContainer>
            <div className="space-y-6 text-center max-w-sm">
              <p className="text-base font-serif font-light text-white/60 leading-relaxed">
                Mars acts — but what knows when to be still?
              </p>
              <p className="text-base font-serif font-light text-white/60 leading-relaxed">
                Saturn builds walls — but what makes a wall breathe?
              </p>
              <p className="text-base font-serif font-light text-white/60 leading-relaxed">
                Jupiter reaches outward — but what says: go deeper, not wider?
              </p>
            </div>
          </ScreenContainer>
        )}

        {/* Screen 4: Name the concept */}
        {screen === 3 && (
          <ScreenContainer>
            <p className="text-lg sm:text-xl font-serif font-light leading-relaxed text-white/70 text-center max-w-sm">
              These unnamed qualities are already in you. They have always been there — working quietly beneath everything. We call them your Twins.
            </p>
          </ScreenContainer>
        )}

        {/* Screen 5: Promise */}
        {screen === 4 && (
          <ScreenContainer>
            <p className="text-lg sm:text-xl font-serif font-light leading-relaxed text-white/70 text-center max-w-sm">
              Your chart shows who you are. Your Twins show what is stirring inside you — what you are already becoming.
            </p>
          </ScreenContainer>
        )}

        {/* Screen 6: Input */}
        {screen === 5 && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-serif font-light text-[var(--accent)] mb-10 text-center">
              Let us find them.
            </h2>

            <div className="w-full max-w-sm space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-serif font-light text-white/40">
                  When were you born?
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-serif font-light text-white/40">
                  Do you know the time?
                </label>
                {!timeUnknown ? (
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => setTimeUnknown(true)}
                      className="px-4 py-3 rounded-lg text-xs text-white/30 border border-[var(--border)] hover:text-white/50 transition-colors"
                      type="button"
                    >
                      Not sure
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <p className="text-sm text-white/40 flex-1">Using noon as estimate</p>
                    <button
                      onClick={() => setTimeUnknown(false)}
                      className="text-xs text-[var(--accent)]/60 hover:text-[var(--accent)] transition-colors"
                      type="button"
                    >
                      I know it
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-serif font-light text-white/40">
                  Where?
                </label>
                <select
                  value={selectedCity?.name ?? ''}
                  onChange={e => setSelectedCity(cities.find(c => c.name === e.target.value) ?? null)}
                  className="w-full px-4 py-3 rounded-lg text-sm appearance-none"
                >
                  <option value="">Select a city...</option>
                  {cities.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleReveal}
                disabled={!formValid || isCalculating}
                className="w-full py-3.5 rounded-full text-sm font-sans tracking-wide transition-all duration-500
                  disabled:opacity-20 disabled:cursor-not-allowed
                  bg-[var(--accent)] text-[var(--background)] hover:opacity-90"
              >
                {isCalculating ? 'Finding your twins...' : 'Reveal'}
              </button>
            </div>
          </div>
        )}

        {/* Screen 7: Reveal */}
        {screen === 6 && chart && (
          <div className="flex-1 flex flex-col items-center justify-center">
            {revealPhase >= 2 && (
              <div className="text-center animate-fadeIn">
                <h1
                  className="text-4xl sm:text-5xl font-serif font-light tracking-wide mb-3"
                  style={{ color: getTwinDefinition(chart.brightestTwin.planet)?.color }}
                >
                  {chart.brightestTwin.twinName}
                </h1>
                <p className="text-sm font-serif font-light text-white/40">
                  is calling
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation hint — tap/continue (not on input or reveal screens) */}
      {screen < 5 && (
        <div className="absolute bottom-10 inset-x-0 z-20 flex justify-center">
          <button
            onClick={next}
            className={`text-[10px] font-sans uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-all duration-700 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Continue
          </button>
        </div>
      )}

      {/* Progress dots (not on reveal) */}
      {screen < 6 && (
        <div className={`absolute bottom-4 inset-x-0 z-20 flex justify-center gap-1.5 transition-opacity duration-700 ${
          fade ? 'opacity-100' : 'opacity-0'
        }`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === screen ? 16 : 4,
                height: 4,
                background: i === screen ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Helper components ─────────────────────────────────────────────────────────

function ScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {children}
    </div>
  );
}

// ─── Background visualization per screen ────────────────────────────────────────

function OnboardingVisual({
  screen,
  chart,
  revealPhase,
}: {
  screen: number;
  chart: import('@/core/types').ChartState | null;
  revealPhase: number;
}) {
  // Build synthetic twin states for the narrative screens
  const narrativeTwins = useMemo((): TwinState[] => {
    if (screen === 0) return []; // Dark — nothing visible
    if (screen === 1) {
      // Faint warm field beginning to breathe
      return [{ planet: 'Saturn', twinName: 'The Membrane', intensity: 15, twinHouse: 4, planetHouse: 10 }];
    }
    if (screen === 2) {
      // Two fields — one clear, one diffuse
      return [
        { planet: 'Mars', twinName: 'The Pause', intensity: 35, twinHouse: 7, planetHouse: 1 },
        { planet: 'Saturn', twinName: 'The Membrane', intensity: 20, twinHouse: 4, planetHouse: 10 },
      ];
    }
    if (screen === 3) {
      // Both pulse side by side — clearer
      return [
        { planet: 'Mars', twinName: 'The Pause', intensity: 50, twinHouse: 7, planetHouse: 1 },
        { planet: 'Saturn', twinName: 'The Membrane', intensity: 45, twinHouse: 4, planetHouse: 10 },
      ];
    }
    if (screen === 4) {
      // Merged into one warm field
      return [{ planet: 'Neptune', twinName: 'The Vessel of Form', intensity: 65, twinHouse: 9, planetHouse: 3 }];
    }
    return []; // Screen 5 (input) — subtle pull-back
  }, [screen]);

  // Reveal screen — show actual chart twins emerging
  const revealTwins = useMemo((): TwinState[] => {
    if (screen !== 6 || !chart || revealPhase < 1) return [];
    const sorted = [...chart.twinStates].sort((a, b) => b.intensity - a.intensity);
    // Gradually reveal — show more as phase progresses
    return sorted;
  }, [screen, chart, revealPhase]);

  const twins = screen === 6 ? revealTwins : narrativeTwins;
  const fieldScale = screen === 4 ? 2.5 : screen === 6 ? 1.8 : 1.5;

  if (twins.length === 0 && screen !== 5) return null;

  // Input screen — very subtle background
  if (screen === 5) {
    return (
      <div className="w-full h-full opacity-30">
        <TwinCanvas
          twinStates={[{ planet: 'Saturn', twinName: 'The Membrane', intensity: 10, twinHouse: 4, planetHouse: 10 }]}
          positions={[]}
          fieldScale={1}
          hideChart
        />
      </div>
    );
  }

  return (
    <div className={`w-full h-full transition-opacity duration-[2000ms] ${
      screen === 6 && revealPhase === 0 ? 'opacity-0' : 'opacity-100'
    }`}>
      <TwinCanvas
        twinStates={twins}
        positions={chart?.positions ?? []}
        fieldScale={fieldScale}
        hideChart
      />
    </div>
  );
}
