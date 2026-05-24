'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;
    const handle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1000));
    handle(() => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* registration failure is non-fatal */
      });
    });
  }, []);
  return null;
}
