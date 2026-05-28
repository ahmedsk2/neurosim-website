import { NextResponse, type NextRequest } from 'next/server';

/**
 * Strict nonce-based Content-Security-Policy + the other security response headers.
 *
 * Phase 4a item 2 (Option B): the public + reviewer surfaces are served from one PaaS host
 * (`DECISIONS.md`), and we chose maximum CSP hardening over SSG-cache preservation. Per request:
 *
 *   1. Generate a fresh nonce (16 random bytes, base64).
 *   2. Build a strict CSP with `script-src 'self' 'nonce-{nonce}' 'strict-dynamic'`. 'strict-dynamic'
 *      is required so Next's chunk loader (which is itself a nonced inline script) can load the
 *      external `_next/static/chunks/*.js` it needs without each one requiring its own nonce.
 *   3. Forward the nonce on the inbound request as `x-nonce`. Next 16 reads that header at render
 *      time and automatically applies the nonce to every inline framework script it emits
 *      (the `self.__next_f.push(...)` / `__next_s` chunks, the chunk loader bootstrap, etc.).
 *      The application uses the same header to nonce its own inline `<Script>` (see
 *      `src/app/layout.tsx` for the theme-bootstrap script).
 *   4. Send the same CSP on the response so the browser enforces it, plus the other static security
 *      headers (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
 *      Single source of truth, in this middleware.
 *
 * Tradeoffs:
 *   - All matched routes are dynamic (middleware uses per-request crypto). The public site loses
 *     the SSG `Cache-Control: s-maxage=31536000`. Accepted launch decision; see `DECISIONS.md`.
 *   - `style-src 'unsafe-inline'` is kept because KaTeX, Mermaid, and React (Radix popover etc.)
 *     emit inline styles at scale, and they are not the meaningful attack surface.
 *   - No third-party allowance. Google Analytics will be added under consent gating in the cookie
 *     banner PR (not here); that PR will extend `script-src` / `connect-src` / `img-src`
 *     conditionally on consent.
 */

const PERMISSIONS_POLICY =
  // display-capture=(self) is allowed because the reviewer overlay's "Capture my current view"
  // path calls navigator.mediaDevices.getDisplayMedia (FindingComposer.tsx). Everything else is
  // explicitly denied; the site does not use those APIs.
  'camera=(), microphone=(), geolocation=(), payment=(), usb=(), display-capture=(self)';

// Phase 4a item 7: when NEXT_PUBLIC_GA_ID is set in the build, the CSP extends connect-src and
// img-src to allow Google Analytics endpoints. script-src is NOT broadened: 'strict-dynamic' plus
// the nonced GA loader (rendered by src/components/consent/GoogleAnalytics.tsx) lets gtag.js
// fetch dynamically without an explicit script-src host. The CSP allowance existing does not
// load GA: that is gated on visitor consent in GoogleAnalytics.tsx. With the env var unset, the
// CSP stays maximally strict and GA cannot load at all (the kill-switch).
const GA_ENABLED = Boolean(process.env.NEXT_PUBLIC_GA_ID);
const GA_HOSTS = 'https://*.google-analytics.com https://*.googletagmanager.com';

export function middleware(request: NextRequest) {
  // 16 random bytes -> base64. Edge runtime has Web Crypto + btoa (no Node Buffer).
  const random = new Uint8Array(16);
  crypto.getRandomValues(random);
  const nonce = btoa(String.fromCharCode(...random));

  const csp = [
    "default-src 'self'",
    // 'strict-dynamic' tells CSP3 browsers to ignore 'self' and trust only scripts loaded by an
    // already-trusted (nonced) script. Next's nonced chunk-loader then bootstraps everything else.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob:${GA_ENABLED ? ' ' + GA_HOSTS : ''}`,
    "font-src 'self' data:",
    `connect-src 'self'${GA_ENABLED ? ' ' + GA_HOSTS : ''}`,
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "worker-src 'self'",
    "manifest-src 'self'",
  ].join('; ');

  // Forward the nonce on the request so the app + Next framework can read it.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  // Next 16 also reads `content-security-policy` from the request to drive its nonce wiring.
  requestHeaders.set('content-security-policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Browser-enforced response headers. All six security headers live here (single source).
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', PERMISSIONS_POLICY);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT static / image-optimizer / favicon / sw.js / manifest. Those are
     * served directly without per-request work; the browser does not need a CSP nonce on them.
     *
     * Also skip Next router PREFETCHES (they are background data fetches that never render
     * inline scripts in a navigation context, so a nonce is unneeded and would waste a fresh
     * random per prefetch). This is the official Next 16 CSP-middleware matcher.
     */
    {
      source: '/((?!_next/static|_next/image|favicon\\.ico|sw\\.js|manifest\\.webmanifest).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
