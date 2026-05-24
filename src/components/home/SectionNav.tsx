'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SectionLink {
  id: string;
  label: string;
}

const SECTIONS: SectionLink[] = [
  { id: 'stats', label: 'Field at a glance' },
  { id: 'domains', label: 'Five domains' },
  { id: 'why', label: 'Why it matters' },
  { id: 'catalog', label: 'Catalog' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'about', label: 'About' },
];

/**
 * Sticky section navigator for the homepage. Renders pill links below the
 * Hero; the active pill is driven by IntersectionObserver so it tracks
 * whichever section the reader is currently on.
 */
export function SectionNav() {
  const [active, setActive] = useState<string>(SECTIONS[0]!.id);
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Detect when the sticky nav has pinned to the top of the viewport. The
  // 0-px sentinel above the nav goes off-screen the moment it sticks, which
  // is more reliable than a window-scrollY threshold (works regardless of
  // hero height or zoom level).
  useEffect(() => {
    if (typeof window === 'undefined' || !sentinelRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry?.isIntersecting),
      { rootMargin: '-65px 0px 0px 0px', threshold: 0 },
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!targets.length) return;

    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        }
        // Highest visibility wins.
        let bestId = active;
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestRatio > 0 && bestId !== active) setActive(bestId);
      },
      {
        // Top offset accounts for the sticky header (~56 px) + this nav bar (~44 px).
        rootMargin: '-120px 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const headerOffset = 96;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
    setActive(id);
  };

  return (
    <>
      {/* Invisible sentinel, used by IntersectionObserver to detect sticky-pin */}
      <div ref={sentinelRef} aria-hidden className="h-0 w-full" />
      <nav
        aria-label="Homepage sections"
        className={cn(
          'sticky top-[64px] z-20 -mx-4 border-b px-4 transition-colors duration-200 md:-mx-6 md:px-6',
          stuck
            ? 'border-line-strong bg-surface-darker shadow-[0_4px_14px_-8px_rgba(0,0,0,0.55)]'
            : 'border-line bg-surface-darker/80 backdrop-blur-md',
        )}
      >
        <ul className="mx-auto flex max-w-page list-none gap-1 overflow-x-auto p-0 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id} className="flex-shrink-0">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => handleClick(e, s.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'inline-flex items-center rounded-full border px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.08em] transition-colors',
                    isActive
                      ? 'border-brand-teal bg-brand-teal/15 text-brand-tealLight'
                      : 'border-line bg-transparent text-ink-dim hover:border-brand-teal/50 hover:text-ink',
                  )}
                >
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
