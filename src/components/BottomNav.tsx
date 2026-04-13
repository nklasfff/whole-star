'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useChart } from './ChartContext';
import { getBrightestTwinId } from '@/lib/twinId';

export default function BottomNav() {
  const pathname = usePathname();
  const { chart } = useChart();

  // Hidden on welcome and onboarding screens
  if (pathname === '/' || pathname === '/onboarding') return null;

  const twinsHref = chart
    ? `/twin/${getBrightestTwinId(chart.twinStates)}`
    : '/sky';

  const tabs = [
    {
      label: 'Sky',
      href: '/sky',
      active: pathname === '/sky',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <circle cx="10" cy="6" r="1.5" />
          <circle cx="5" cy="12" r="1" />
          <circle cx="15" cy="11" r="1" />
          <circle cx="8" cy="16" r="0.8" />
          <circle cx="14" cy="15" r="0.8" />
          <line x1="10" y1="6" x2="5" y2="12" opacity="0.4" />
          <line x1="10" y1="6" x2="15" y2="11" opacity="0.4" />
          <line x1="15" y1="11" x2="14" y2="15" opacity="0.4" />
        </svg>
      ),
    },
    {
      label: 'Twins',
      href: twinsHref,
      active: pathname.startsWith('/twin'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <circle cx="8" cy="10" r="5" opacity="0.6" />
          <circle cx="12" cy="10" r="5" opacity="0.6" />
        </svg>
      ),
    },
    {
      label: 'Daily',
      href: '/daily',
      active: pathname === '/daily',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
          <circle cx="10" cy="10" r="6" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map(tab => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`flex flex-col items-center gap-1 transition-colors duration-300 ${
              tab.active ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
            }`}
          >
            {tab.icon}
            <span className="text-[9px] uppercase tracking-[0.15em] font-sans">
              {tab.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
