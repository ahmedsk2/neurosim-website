// MNM-Edu service worker — minimal cache strategy.
// - HTML pages: stale-while-revalidate (works offline once visited).
// - Static assets (_next/static, images): cache-first.
// - search-index.json: network-first with fallback.

const CACHE = 'mnm-edu-v1';
const HTML_CACHE = 'mnm-edu-html-v1';

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

  // HTML pages: stale-while-revalidate
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      caches.open(HTML_CACHE).then(async (c) => {
        const cached = await c.match(req);
        const networkPromise = fetch(req)
          .then((res) => {
            if (res.ok) c.put(req, res.clone());
            return res;
          })
          .catch(() => undefined);
        return cached || (await networkPromise) || Response.error();
      }),
    );
  }
});
