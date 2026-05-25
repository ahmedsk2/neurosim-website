'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface TocItem {
  id: string;
  label: string;
  level: 2 | 3;
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  if (items.length === 0) return null;
  return (
    <nav
      aria-label="On this page"
      className="hidden xl:block sticky top-20 self-start w-52 shrink-0 max-h-[calc(100vh-6rem)] overflow-y-auto"
    >
      <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-tealLight mb-2">
        On this page
      </div>
      <ul className="space-y-0.5 text-[12px]">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={cn(
                'block rounded-sm px-2 py-0.5',
                it.level === 3 && 'pl-4',
                active === it.id
                  ? 'text-brand-tealLight font-semibold'
                  : 'text-ink-muted hover:text-ink',
              )}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
