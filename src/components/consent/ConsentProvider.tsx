'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

/**
 * Phase 4a item 7 - cookie consent. Default-deny: until the visitor makes an affirmative choice,
 * consent is 'unset' and no analytics is loaded. The choice persists in localStorage (which is
 * itself NOT a tracking cookie - it is a single flag on this origin).
 *
 * Consent state machine:
 *   'unset'   -> no choice yet; banner is visible; GA does not load.
 *   'granted' -> visitor accepted; GA loads (only if NEXT_PUBLIC_GA_ID is set; see GoogleAnalytics).
 *   'denied'  -> visitor rejected; GA never loads; GA cookies cleared on transition.
 *
 * The stored choice is read via `useSyncExternalStore` so it is an external-store snapshot rather
 * than a setState in an effect (matches the project's convention from theme.ts / i18n.ts). The
 * banner-shown state is then derived from consent plus a small piece of UI-only state that is
 * only updated in user event handlers.
 *
 * Visitors can reopen the banner via the CookieSettingsLink (rendered in the footer); choosing
 * 'denied' from a previously-granted state clears `_ga*` cookies on the way out.
 */

const STORAGE_KEY = 'mnm-cookie-consent';
const EVENT_NAME = 'mnm-consent-change';
export type Consent = 'granted' | 'denied' | 'unset';

interface ConsentContextValue {
  consent: Consent;
  showBanner: boolean;
  /** Visitor pressed Accept. Persists the choice. */
  accept: () => void;
  /** Visitor pressed Decline (or Withdraw from a previously-granted state). Clears GA cookies. */
  decline: () => void;
  /** Reopen the banner (called from the footer "Cookie settings" link). */
  openSettings: () => void;
  /** Close the banner without changing the choice (only allowed after a choice was already made). */
  dismissBanner: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

function getSnapshot(): Consent {
  if (typeof window === 'undefined') return 'unset';
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'granted' || v === 'denied' ? v : 'unset';
  } catch {
    return 'unset';
  }
}

// Server snapshot is always 'unset' (no localStorage on the server). Returning a stable value here
// keeps useSyncExternalStore happy during SSR.
function getServerSnapshot(): Consent {
  return 'unset';
}

function subscribe(onChange: () => void): () => void {
  // 'storage' events cover cross-tab updates; the in-tab custom event covers writes from this tab.
  window.addEventListener('storage', onChange);
  window.addEventListener(EVENT_NAME, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(EVENT_NAME, onChange);
  };
}

function writeStored(v: 'granted' | 'denied'): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, v);
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch {
    /* ignore */
  }
}

function clearGaCookies(): void {
  // Best-effort clear of any first-party GA cookies set on this origin. GA4 uses _ga and _ga_<ID>.
  if (typeof document === 'undefined') return;
  const host = window.location.hostname;
  const domainCandidates = [host, '.' + host];
  for (const c of document.cookie.split(';')) {
    const eq = c.indexOf('=');
    const name = (eq > -1 ? c.substring(0, eq) : c).trim();
    if (!name.startsWith('_ga')) continue;
    for (const d of domainCandidates) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
    }
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  // External-store read: localStorage is the source of truth for consent across tabs and reloads.
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // UI-only state: true when the visitor has explicitly reopened the banner from settings.
  // The banner is also automatically visible whenever consent === 'unset'.
  const [manualShow, setManualShow] = useState(false);
  const showBanner = consent === 'unset' || manualShow;

  const accept = useCallback(() => {
    writeStored('granted');
    setManualShow(false);
  }, []);

  const decline = useCallback(() => {
    const wasGranted = getSnapshot() === 'granted';
    writeStored('denied');
    setManualShow(false);
    if (wasGranted) clearGaCookies();
  }, []);

  const openSettings = useCallback(() => {
    setManualShow(true);
  }, []);

  const dismissBanner = useCallback(() => {
    // Only allowed after a choice was already made. If the visitor is in 'unset', they must choose;
    // since showBanner is derived from consent==='unset', clearing manualShow has no effect in that
    // state, which naturally enforces the no-dismiss rule.
    setManualShow(false);
  }, []);

  return (
    <ConsentContext.Provider value={{ consent, showBanner, accept, decline, openSettings, dismissBanner }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used inside <ConsentProvider>');
  return ctx;
}
