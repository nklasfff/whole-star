'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
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

export function ChartProvider({ children }: { children: ReactNode }) {
  const [chart, setChartState] = useState<ChartState | null>(null);
  const [birthData, setBirthDataState] = useState<BirthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const savedChart = loadChart();
    const savedBirth = loadBirthData();
    if (savedChart) setChartState(savedChart);
    if (savedBirth) setBirthDataState(savedBirth);
    setHydrated(true);
  }, []);

  // Persist chart to localStorage
  const setChart = useCallback((c: ChartState | null) => {
    setChartState(c);
    if (c) saveChart(c);
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
