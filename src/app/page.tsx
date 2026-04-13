'use client';

import { useRouter } from 'next/navigation';
import BirthDataForm from '@/components/BirthDataForm';
import { useChart } from '@/components/ChartContext';
import type { BirthData } from '@/core/types';

export default function Home() {
  const router = useRouter();
  const { setChart, setBirthData, isLoading, setIsLoading } = useChart();

  async function handleSubmit(data: BirthData) {
    setIsLoading(true);
    setBirthData(data);
    try {
      const res = await fetch('/api/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Chart calculation failed');
      const chart = await res.json();
      setChart(chart);
      router.push('/chart');
    } catch (err) {
      console.error('Chart calculation failed:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-light tracking-tight mb-2">Whole-Star</h1>
        <p className="text-sm text-[var(--muted)] max-w-xs">
          What is already stirring inside you
        </p>
      </div>
      <BirthDataForm onSubmit={handleSubmit} isLoading={isLoading} />
    </main>
  );
}
