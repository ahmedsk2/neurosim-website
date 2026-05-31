'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Floating button in the bottom-right corner that appears once the user has
 * scrolled past ~60% of the viewport height. Smooth-scrolls to the top on
 * click. Hidden when the page is short enough not to need it.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const trigger = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max < 200) {
        setVisible(false);
        return;
      }
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    trigger();
    window.addEventListener('scroll', trigger, { passive: true });
    window.addEventListener('resize', trigger);
    return () => {
      window.removeEventListener('scroll', trigger);
      window.removeEventListener('resize', trigger);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed bottom-6 right-6 z-40 inline-flex h-[44px] w-[44px] items-center justify-center rounded-full border border-brand-teal bg-surface-darker/95 text-brand-tealLight shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)] backdrop-blur-xs transition-all duration-200 hover:bg-brand-teal hover:text-surface-darker focus:outline-hidden focus:ring-2 focus:ring-brand-tealLight',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0',
      )}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp className="h-5 w-5" aria-hidden />
    </button>
  );
}
