'use client';

import { useConsent } from './ConsentProvider';

/**
 * Footer link to reopen the cookie consent banner. Lets the visitor change or withdraw their
 * choice at any time (GDPR/Quebec Law 25 require an easy withdrawal path). Self-hides when
 * NEXT_PUBLIC_GA_ID is not set: there is nothing to consent to in that build.
 */
export function CookieSettingsLink() {
  const { consent, openSettings } = useConsent();
  if (!process.env.NEXT_PUBLIC_GA_ID) return null;
  const state = consent === 'granted' ? 'accepted' : consent === 'denied' ? 'declined' : 'not set';
  return (
    <button
      type="button"
      onClick={openSettings}
      className="text-left text-ink/80 hover:text-brand-tealLight"
      title="Reopen the cookie consent banner to change your choice."
    >
      Cookie settings ({state})
    </button>
  );
}
