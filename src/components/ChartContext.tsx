'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ChartState, BirthData } from '@/core/types';

interface ChartContextValue {
  chart: ChartState | null;
  setChart: (chart: ChartState | null) => void;
  birthData: BirthData | null;
  setBirthData: (data: BirthData | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export function ChartProvider({ children }: { children: ReactNode }) {
  const [chart, setChart] = useState<ChartState | null>(null);
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ChartContext.Provider
      value={{ chart, setChart, birthData, setBirthData, isLoading, setIsLoading }}
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
