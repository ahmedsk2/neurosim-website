'use client';

import Link from 'next/link';
import { useConsent } from './ConsentProvider';

/**
 * Cookie consent banner. Default-deny: rendered only when consent state is 'unset' (first visit, or
 * visitor reopened via the footer "Cookie settings" link). Accept and Decline are equally styled
 * and equally accessible - this is a legal requirement, not a nicety (GDPR Article 4(11),
 * Quebec Law 25, UK ICO guidance). The banner self-hides when NEXT_PUBLIC_GA_ID is not set (the
 * site has nothing to consent to in that build).
 */
export function CookieBanner() {
  const { consent, showBanner, accept, decline, dismissBanner } = useConsent();

  // Kill-switch: if no GA_ID is configured for this build, the public site is fully cookie-free
  // and there is nothing to ask consent for. Banner does not render at all.
  if (!process.env.NEXT_PUBLIC_GA_ID) return null;
  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-surface-card px-4 py-4 shadow-2xl md:px-6"
    >
      <div className="mx-auto flex max-w-page flex-col gap-3 text-[13px] text-ink md:flex-row md:items-center md:justify-between">
        <p className="m-0 flex-1 leading-[1.55]">
          MNM-Edu uses Google Analytics for visitor statistics. Analytics will only load if you
          accept. See the{' '}
          <Link href="/privacy/" className="underline hover:text-brand-tealLight">
            privacy policy
          </Link>{' '}
          for what it collects and how to withdraw consent later.
        </p>
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={decline}
            className="tap-target inline-flex items-center justify-center rounded border border-brand-tealDark bg-transparent px-4 py-2 text-[13px] font-bold text-brand-tealLight hover:border-brand-teal hover:bg-surface-deeper"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="tap-target inline-flex items-center justify-center rounded border border-brand-tealDark bg-transparent px-4 py-2 text-[13px] font-bold text-brand-tealLight hover:border-brand-teal hover:bg-surface-deeper"
          >
            Accept
          </button>
          {/* Dismiss is only available when reopening the banner from settings AFTER a previous
              choice. For first-visit 'unset', the visitor MUST choose (no dark-patterned dismiss). */}
          {consent !== 'unset' && (
            <button
              type="button"
              onClick={dismissBanner}
              aria-label="Close cookie settings"
              className="tap-target inline-flex items-center justify-center rounded border border-transparent px-2 py-2 text-ink-muted hover:text-ink"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
