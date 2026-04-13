'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Birth data' },
  { href: '/chart', label: 'Twin field' },
  { href: '/daily', label: 'Daily' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
      <Link href="/" className="text-sm font-light tracking-widest uppercase text-[var(--accent)]">
        Whole-Star
      </Link>
      <div className="flex gap-6">
        {links.map(link => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs tracking-wide transition-colors duration-300 ${
                isActive
                  ? 'text-[var(--foreground)]'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
