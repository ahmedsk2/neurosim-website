// MDX content is compiled at the page level by next-mdx-remote/rsc (see the
// dynamic [slug] / [scenario] route pages, which pass their own remark/rehype
// plugins). @next/mdx is intentionally not wired here: nothing imports .mdx as a
// module and there are no .mdx route files, so it compiled nothing.
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
};

export default nextConfig;
