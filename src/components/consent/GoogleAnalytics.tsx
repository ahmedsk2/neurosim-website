'use client';

import Script from 'next/script';
import { useConsent } from './ConsentProvider';

/**
 * Phase 4a item 7 - GA4 loader, consent-gated.
 *
 * GA loads ONLY when BOTH:
 *   1. NEXT_PUBLIC_GA_ID is set in the build (the kill-switch).
 *   2. The visitor has affirmatively granted consent (ConsentProvider state === 'granted').
 *
 * Privacy-respecting config (matches the privacy policy in PR #50):
 *   - `anonymize_ip: true`: IPs are truncated before storage at Google.
 *   - `allow_google_signals: false`: no cross-device/device-graph / ad-cohort signal sharing.
 *   - `allow_ad_personalization_signals: false`: no ad personalization data sharing.
 *   - GA consent mode default-deny is set in this same init block, then `granted` is sent only for
 *     `analytics_storage` (ad-related consent slots remain `denied` permanently).
 *
 * CSP compatibility under the strict nonce policy (src/middleware.ts):
 *   - The loader <script src=googletagmanager> is rendered via Next's <Script> with `nonce={nonce}`,
 *     so the browser accepts it under `script-src 'self' 'nonce-...' 'strict-dynamic'`.
 *   - 'strict-dynamic' then trusts any further scripts that gtag.js loads dynamically.
 *   - connect-src and img-src are extended to *.google-analytics.com / *.googletagmanager.com only
 *     when NEXT_PUBLIC_GA_ID is set (middleware does this conditionally; see middleware.ts).
 */
export function GoogleAnalytics({ nonce }: { nonce?: string }) {
  const { consent } = useConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // Kill-switch + consent gate. With either absent, NO request is made to any Google host.
  if (!gaId) return null;
  if (consent !== 'granted') return null;

  // The inline init block configures consent-mode defaults to denied (belt-and-braces; the visitor
  // already granted to reach here, but we set defaults so a partial / out-of-order load is safe),
  // then updates `analytics_storage` to granted. Ad-related slots stay denied.
  const init = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
    gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', '${gaId}', {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  `;

  return (
    <>
      <Script
        id="ga-loader"
        strategy="afterInteractive"
        nonce={nonce}
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
      />
      <Script id="ga-init" strategy="afterInteractive" nonce={nonce}>
        {init}
      </Script>
    </>
  );
}
