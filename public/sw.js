// MNM-Edu service worker — minimal cache strategy.
// - HTML pages: network-first (fresh on every load; falls back to cache offline).
// - Static assets (_next/static, images): cache-first.
// - search-index.json: network-first with fallback.

// Phase 3d: auth-hardened. /api/* and /review/* are NEVER cached (see the fetch
// handler early-return). HTML caching is scoped to public content only; because the
// reviewer overlay is client-only (renders null at SSR and for anonymous), the cached
// page HTML carries no authed/overlay variant and cannot leak to another session.
// Bumped to v4 so older (v1/v2/v3) caches are evicted on activate.
const CACHE = 'mnm-edu-v4';
const HTML_CACHE = 'mnm-edu-html-v4';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((c) =>
      c.addAll(['/', '/manifest.webmanifest']).catch(() => undefined),
    ),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE && k !== HTML_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Phase 3d auth-hardening: never cache the auth-sensitive API or the reviewer
  // dashboard. Return without respondWith so they go straight to the network and no
  // authed response is ever stored in (or replayed from) the SW cache.
  if (url.pathname.startsWith('/api/') || url.pathname === '/review' || url.pathname.startsWith('/review/')) {
    return;
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/og/')
  ) {
    // Cache-first for static assets
    event.respondWith(
      caches.open(CACHE).then(async (c) => {
        const hit = await c.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          if (res.ok) c.put(req, res.clone());
          return res;
        } catch {
          return hit || Response.error();
        }
      }),
    );
    return;
  }

  if (url.pathname.endsWith('/search-index.json')) {
    // Network-first with cache fallback
    event.respondWith(
      caches.open(CACHE).then(async (c) => {
        try {
          const res = await fetch(req);
          if (res.ok) c.put(req, res.clone());
          return res;
        } catch {
          return (await c.match(req)) || Response.error();
        }
      }),
    );
    return;
  }

  // HTML pages: NETWORK-FIRST. A new deploy shows on the first load (never a stale cached
  // page - important for a review tool where findings pin the page's contentHash). Falls
  // back to the cache only when the network is unavailable (offline).
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      caches.open(HTML_CACHE).then(async (c) => {
        try {
          const res = await fetch(req);
          if (res.ok) c.put(req, res.clone());
          return res;
        } catch {
          return (await c.match(req)) || Response.error();
        }
      }),
    );
  }
});
