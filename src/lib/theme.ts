'use client';

import { useSyncExternalStore } from 'react';

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

function subscribeTheme(onStoreChange: () => void): () => void {
  window.addEventListener(EVENT_NAME, onStoreChange);
  return () => window.removeEventListener(EVENT_NAME, onStoreChange);
}

// The theme lives in the DOM (the data-theme attribute, set by the no-flash
// bootstrap script and by setTheme), i.e. an external store, so it is read with
// useSyncExternalStore. getTheme is SSR-safe (returns 'dark' when there is no
// document), so it serves as both the client snapshot and the server snapshot,
// which keeps SSR consistent with the dark default and avoids a hydration mismatch.
export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, getTheme, getTheme);
}

export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
