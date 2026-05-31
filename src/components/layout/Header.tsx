'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/foundations/', label: 'Foundations' },
  { href: '/modalities/', label: 'Modalities' },
  { href: '/integration/', label: 'Integration' },
  { href: '/pediatrics/', label: 'Pediatrics' },
  { href: '/teach/fellow-lecture/', label: 'Teach' },
  { href: '/quick-card/', label: 'Quick-card' },
  { href: '/evidence/', label: 'Evidence' },
  { href: '/glossary/', label: 'Glossary' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'site-header sticky top-0 z-30 border-b transition-colors duration-200',
        scrolled
          ? 'border-line-strong bg-surface-darker shadow-[0_4px_20px_-8px_rgba(0,0,0,0.55)]'
          : 'border-line bg-surface-darker/80 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex max-w-page items-center gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2 group" aria-label="MNM-Edu home">
          <div className="h-7 w-7 rounded-md bg-brand-teal text-surface-darker font-mono font-bold text-[12px] flex items-center justify-center">
            MNM
          </div>
          <div className="hidden md:block leading-tight">
            <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-tealLight">
              Pediatric MNM
            </div>
            <div className="text-[13px] font-bold text-ink group-hover:text-brand-tealLight">
              Multimodal Neuromonitoring
            </div>
          </div>
        </Link>

        <nav className="ml-auto hidden lg:flex items-center gap-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 text-[12.5px] font-semibold text-ink-muted hover:text-brand-tealLight hover:bg-surface-card"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto lg:ml-2 flex items-center gap-2">
          <Link
            href="/search/"
            aria-label="Search"
            className="tap-target inline-flex items-center justify-center rounded-md p-1.5 text-ink-muted hover:text-brand-tealLight hover:bg-surface-card"
          >
            <Search className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="tap-target inline-flex items-center justify-center lg:hidden rounded-md p-1.5 text-ink-muted hover:text-brand-tealLight hover:bg-surface-card"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line bg-surface-darker">
          <nav className="mx-auto flex max-w-page flex-col px-4 py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex min-h-[44px] items-center rounded-md px-3 py-2 text-[14px] font-semibold text-ink-muted',
                  'hover:text-brand-tealLight hover:bg-surface-card',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
