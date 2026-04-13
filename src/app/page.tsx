'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BirthDataForm from '@/components/BirthDataForm';
import { useChart } from '@/components/ChartContext';
import type { BirthData } from '@/core/types';

export default function WelcomePage() {
  const router = useRouter();
  const { chart, setChart, setBirthData, isLoading, setIsLoading, hydrated } = useChart();
  const [showForm, setShowForm] = useState(false);

  // If we have saved data, skip to /sky
  useEffect(() => {
    if (hydrated && chart) {
      router.replace('/sky');
    }
  }, [hydrated, chart, router]);

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
      const chartData = await res.json();
      setChart(chartData);
      router.push('/sky');
    } catch (err) {
      console.error('Chart calculation failed:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // Don't flash welcome if we're about to redirect
  if (!hydrated || chart) {
    return <div className="fixed inset-0 bg-[var(--background)]" />;
  }

  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center px-8 bg-[var(--background)]">
      {/* Title + subtitle — shifts up when form appears */}
      <div className={`flex flex-col items-center transition-all duration-700 ease-out ${
        showForm ? '-translate-y-8 opacity-90' : 'translate-y-0'
      }`}>
        <h1 className="text-5xl sm:text-6xl font-serif font-light tracking-[0.2em] uppercase text-[var(--foreground)] mb-4">
          Whole-Star
        </h1>
        <p className="text-sm font-sans font-light text-[var(--muted)] text-center max-w-xs">
          What is already stirring inside you?
        </p>
      </div>

      {/* Begin button — fades out when form appears */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mt-10 px-8 py-3 rounded-full border border-[var(--accent)]/40 text-sm font-sans text-[var(--accent)] tracking-wide hover:border-[var(--accent)] transition-all duration-500 animate-fadeIn"
        >
          Begin
        </button>
      )}

      {/* Form — slides in from below */}
      <div className={`w-full max-w-sm mt-10 transition-all duration-700 ease-out ${
        showForm
          ? 'translate-y-0 opacity-100'
          : 'translate-y-10 opacity-0 pointer-events-none'
      }`}>
        <BirthDataForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </main>
  );
}
