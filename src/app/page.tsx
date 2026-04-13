'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChart } from '@/components/ChartContext';

/**
 * Root route — redirects based on state:
 * - Has chart data in localStorage → /sky
 * - New user → /onboarding
 */
export default function RootPage() {
  const router = useRouter();
  const { chart, hydrated } = useChart();

  useEffect(() => {
    if (!hydrated) return;
    if (chart) {
      router.replace('/sky');
    } else {
      router.replace('/onboarding');
    }
  }, [hydrated, chart, router]);

  return <div className="fixed inset-0 bg-[var(--background)]" />;
}
