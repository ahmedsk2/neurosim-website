'use client';

import { useEffect, useState } from 'react';

/**
 * Fixed 2-px teal bar pinned to the top of the viewport that fills as the
 * user scrolls the page. Gives spatial orientation on long content pages.
 * Hidden when there's nothing to scroll.
 */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let rafId = 0;
    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) {
        setPct(0);
        return;
      }
      const ratio = Math.min(1, Math.max(0, window.scrollY / max));
      setPct(ratio * 100);
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        compute();
      });
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', compute);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-[2px] bg-transparent"
    >
      <div
        className="h-full bg-brand-teal transition-[width] duration-100 ease-linear"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
