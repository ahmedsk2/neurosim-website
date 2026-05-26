'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { isReviewerRole } from '@/lib/auth/roles';

// Lazy-load the heavy composer (form + html2canvas + draw canvas) only when a reviewer
// opens it, so it is never in the public content-page bundle's critical path.
const FindingComposer = dynamic(() => import('./FindingComposer').then((m) => m.FindingComposer), {
  ssr: false,
});

const CONTENT_KINDS = ['foundations', 'modalities', 'integration'];

function parseContentRoute(pathname: string | null): { kind: string; slug: string } | null {
  if (!pathname) return null;
  const segs = pathname.split('/').filter(Boolean);
  if (segs.length !== 2) return null;
  const kind = segs[0];
  const slug = segs[1];
  if (!kind || !slug || !CONTENT_KINDS.includes(kind)) return null;
  return { kind, slug };
}

/**
 * Auth-gated in-context overlay. Mounted in the ROOT layout, but it renders NULL on the
 * server and for anonymous visitors / non-reviewers, so the public (anonymous) static
 * HTML is byte-identical. Session is read client-side via getSession() and re-checked on
 * navigation (NO SessionProvider wrapping content). The sticky icon appears only for an
 * authenticated reviewer on a content page; the real security boundary is the
 * requireReviewer-gated API.
 */
export function ReviewOverlay() {
  const pathname = usePathname();
  const [isReviewer, setIsReviewer] = useState(false);
  const [open, setOpen] = useState(false);

  // Detect the reviewer session client-side (getSession, no SessionProvider needed). The
  // overlay lives in the persistent root layout, so we re-check when the route changes:
  // a session established AFTER mount (e.g. an SPA login, then navigating to a content
  // page) is picked up without a full reload. Once a reviewer is confirmed we stop
  // re-fetching on later navigations; an anonymous visitor just gets a cheap null and
  // renders nothing. A window-focus re-check also picks up a login made in another tab.
  useEffect(() => {
    if (isReviewer) return; // already confirmed: no need to re-fetch on later navigations
    let alive = true;
    const check = () => {
      getSession()
        .then((s) => {
          if (alive) setIsReviewer(isReviewerRole(s?.user?.role));
        })
        .catch(() => {
          /* not signed in => stay null */
        });
    };
    check();
    window.addEventListener('focus', check);
    return () => {
      alive = false;
      window.removeEventListener('focus', check);
    };
  }, [pathname, isReviewer]);

  const route = parseContentRoute(pathname);
  if (!isReviewer || !route) return null;

  return (
    <>
      <button
        type="button"
        data-review-overlay=""
        onClick={() => setOpen(true)}
        aria-label="File a review finding"
        title="File a review finding"
        className="fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-[#0d9488] text-2xl font-bold text-white shadow-2xl hover:bg-[#14b8a6]"
      >
        <span aria-hidden>+</span>
      </button>
      {open && <FindingComposer kind={route.kind} slug={route.slug} onClose={() => setOpen(false)} />}
    </>
  );
}
