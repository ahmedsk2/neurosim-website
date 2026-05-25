'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTheme, toggleTheme, type Theme } from '@/lib/theme';

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setT] = useState<Theme>('dark');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Intentional one-time SSR hydration: the no-flash bootstrap script already set
    // data-theme before paint; here we sync the toggle's local state and mark
    // hydrated so the icon and aria-label switch from their SSR default.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setT(getTheme());
    setHydrated(true);
  }, []);

  return (
    <button
      type="button"
      aria-label={hydrated ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme` : 'Theme toggle'}
      onClick={() => setT(toggleTheme())}
      suppressHydrationWarning
      className={cn(
        'rounded-md p-1.5 text-ink-muted hover:text-brand-tealLight hover:bg-surface-card',
        className,
      )}
    >
      {hydrated && theme === 'light' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
