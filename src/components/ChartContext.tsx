'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import type { ChartState, BirthData } from '@/core/types';
import { saveChart, loadChart, saveBirthData, loadBirthData, clearAll } from '@/lib/storage';

interface ChartContextValue {
  chart: ChartState | null;
  setChart: (chart: ChartState | null) => void;
  birthData: BirthData | null;
  setBirthData: (data: BirthData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  hydrated: boolean;
  clearChart: () => void;
}

const ChartContext = createContext<ChartContextValue | null>(null);

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function ChartProvider({ children }: { children: ReactNode }) {
  const [chart, setChartState] = useState<ChartState | null>(null);
  const [birthData, setBirthDataState] = useState<BirthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const transitRefreshed = useRef(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const savedChart = loadChart();
    const savedBirth = loadBirthData();
    if (savedChart) setChartState(savedChart);
    if (savedBirth) setBirthDataState(savedBirth);
    setHydrated(true);
  }, []);

  // Refresh transits if the stored chart is from a different day
  useEffect(() => {
    if (!hydrated || !chart || transitRefreshed.current) return;
    if (chart.transitDate === todayISO()) return;

    transitRefreshed.current = true;

    fetch('/api/transit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chart }),
    })
      .then(res => res.ok ? res.json() : null)
      .then(updated => {
        if (updated) {
          setChartState(updated);
          saveChart(updated);
        }
      })
      .catch(() => { /* Silently fail — use stale transits */ });
  }, [hydrated, chart]);

  // Persist chart to localStorage
  const setChart = useCallback((c: ChartState | null) => {
    setChartState(c);
    if (c) saveChart(c);
    transitRefreshed.current = false; // Allow re-check on next hydration
  }, []);

  // Persist birth data to localStorage
  const setBirthData = useCallback((d: BirthData | null) => {
    setBirthDataState(d);
    if (d) saveBirthData(d);
  }, []);

  // Clear all persisted data
  const clearChartFn = useCallback(() => {
    setChartState(null);
    setBirthDataState(null);
    clearAll();
    transitRefreshed.current = false;
  }, []);

  return (
    <ChartContext.Provider
      value={{
        chart, setChart,
        birthData, setBirthData,
        isLoading, setIsLoading,
        hydrated,
        clearChart: clearChartFn,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
}

export function useChart() {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error('useChart must be used within ChartProvider');
  return ctx;
}
