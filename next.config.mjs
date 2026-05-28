// MDX content is compiled at the page level by next-mdx-remote/rsc (see the
// dynamic [slug] / [scenario] route pages, which pass their own remark/rehype
// plugins). @next/mdx is intentionally not wired here: nothing imports .mdx as a
// module and there are no .mdx route files, so it compiled nothing.

// Content Security Policy. Applied to every response (public + reviewer).
//
// script-src - PRAGMATIC COMPROMISE. Next 16 App Router emits dozens of unique
// inline RSC scripts per page (the self.__next_f.push(...) stream + the
// __next_s wrapper that carries the theme-bootstrap), and their contents vary
// per page, so a static hash list cannot cover them. The only Next-supported
// strict alternative is middleware-based per-request nonces, which would make
// every route dynamic and lose the SSG Cache-Control: s-maxage=31536000 caching
// that the public site depends on. That trade-off is a launch-affecting
// decision recorded for the LAUNCH_PLAN review.
//
// style-src 'unsafe-inline' - KaTeX, Mermaid, and React (Radix popover
// positioning, etc.) all set inline styles pervasively. Hashing them is
// impractical and not the meaningful attack surface; inline-script defense is.
//
// No allowance is included for any third-party host. Google Analytics is NOT
// loaded yet; when the cookie-banner PR adds it under consent, that PR will
// extend the script-src / connect-src / img-src directives conditionally.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "worker-src 'self'",
  "manifest-src 'self'",
].join('; ');

// Permissions-Policy: deny powerful APIs the site does not use; explicitly allow
// display-capture=(self) because the reviewer overlay's "Capture my current view"
// path uses navigator.mediaDevices.getDisplayMedia (FindingComposer.tsx:111).
const PERMISSIONS_POLICY =
  'camera=(), microphone=(), geolocation=(), payment=(), usb=(), display-capture=(self)';

const SECURITY_HEADERS = [
  // HSTS - browsers ignore this on insecure origins (so it is harmless on
  // http://localhost during dev) and start enforcing it once served over HTTPS
  // in production. includeSubDomains + preload prepares the host for inclusion
  // in the HSTS preload list.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  // Stop the browser from MIME-sniffing responses to a different type.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Belt-and-braces with frame-ancestors 'none' in CSP. The site does not need
  // to be embeddable anywhere.
  { key: 'X-Frame-Options', value: 'DENY' },
  // Cross-origin referrer is path-stripped to just the origin; same-origin still
  // sees the full URL.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: PERMISSIONS_POLICY },
  { key: 'Content-Security-Policy', value: CSP },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server app (Phase 3a): no `output: 'export'`, so `next build` emits a server
  // build in .next/ and `next start` serves it. The content routes carry no
  // per-request data, so Next still prerenders them (SSG / Static), keeping public
  // pages static-fast; only the serving process changes.
  trailingSlash: true,
  // Kept from the export era and still valid in server mode: the site is SVG and
  // canvas heavy, so the Next image optimizer is not needed and unoptimized avoids
  // its runtime cost. No image behavior change here; flip later if real <Image>
  // optimization is ever wanted.
  images: { unoptimized: true },
  pageExtensions: ['ts', 'tsx'],
  reactStrictMode: true,
  // Keep Playwright (used by the reviewer-only /api/snapshot screenshot route) out of the
  // server bundle; it is required from node_modules at runtime, not webpack-bundled.
  serverExternalPackages: ['@playwright/test', 'playwright', 'playwright-core'],
  // Phase 4a item 2: security response headers. Static, applied to every route;
  // does not force any route to render dynamically (SSG caching is preserved).
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
