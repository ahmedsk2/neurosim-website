'use client';

import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LOCALES, LOCALE_LABEL, getLocale, setLocale, type Locale } from '@/lib/i18n';

export function LocalePicker({ className }: { className?: string }) {
  const [locale, setL] = useState<Locale>('en');
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Intentional one-time SSR hydration: the no-flash bootstrap script already set
    // the lang/dir attributes before paint; here we sync the picker's local state
    // and mark hydrated so the displayed locale switches from the SSR default.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setL(getLocale());
    setHydrated(true);
  }, []);

  function choose(l: Locale) {
    setLocale(l);
    setL(l);
    setOpen(false);
  }

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Language"
        suppressHydrationWarning
        className="tap-target inline-flex items-center gap-1 rounded-md p-1.5 text-ink-muted hover:text-brand-tealLight hover:bg-surface-card"
      >
        <Globe className="h-4 w-4" />
        <span className="text-[11px] font-bold uppercase tracking-[0.08em]">
          {hydrated ? locale : 'en'}
        </span>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-40 min-w-[140px] rounded-md border border-line bg-surface-card shadow-lg p-1"
          role="listbox"
        >
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              role="option"
              aria-selected={locale === l}
              onClick={() => choose(l)}
              className={cn(
                'block w-full text-left rounded-sm px-3 py-1.5 text-[12.5px]',
                locale === l
                  ? 'bg-brand-teal text-surface-darker font-bold'
                  : 'text-ink hover:bg-surface-deeper',
              )}
            >
              {LOCALE_LABEL[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
