/**
 * localStorage persistence for chart state and birth data.
 * All reads are wrapped in try/catch for SSR safety and quota errors.
 */

import type { ChartState, BirthData } from '@/core/types';

const CHART_KEY = 'whole-star-chart';
const BIRTH_KEY = 'whole-star-birth';

export function saveChart(chart: ChartState): void {
  try {
    localStorage.setItem(CHART_KEY, JSON.stringify(chart));
  } catch { /* quota exceeded or SSR */ }
}

export function loadChart(): ChartState | null {
  try {
    const raw = localStorage.getItem(CHART_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveBirthData(data: BirthData): void {
  try {
    localStorage.setItem(BIRTH_KEY, JSON.stringify(data));
  } catch { /* quota exceeded or SSR */ }
}

export function loadBirthData(): BirthData | null {
  try {
    const raw = localStorage.getItem(BIRTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearAll(): void {
  try {
    localStorage.removeItem(CHART_KEY);
    localStorage.removeItem(BIRTH_KEY);
  } catch { /* SSR */ }
}
