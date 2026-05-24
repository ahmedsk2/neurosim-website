'use client';

import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'mnm-theme';
const EVENT_NAME = 'mnm-theme-change';

export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'light' ? 'light' : 'dark';
}

export function setTheme(next: Theme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
}

export function toggleTheme(): Theme {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

export function useTheme(): Theme {
  const [t, setT] = useState<Theme>(() => getTheme());
  useEffect(() => {
    setT(getTheme());
    const handler = (e: Event) => {
      const ce = e as CustomEvent<Theme>;
      setT(ce.detail ?? getTheme());
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);
  return t;
}

export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
