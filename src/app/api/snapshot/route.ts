import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireReviewer } from '@/lib/auth/apiAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Server-side full-page screenshot using the Chromium that Playwright already installed
// for e2e (imported from the @playwright/test devDep; no second browser dependency). Unlike
// the old html2canvas path, headless Chromium renders canvas / WebGL widgets (the 3D brain,
// the waveform and U-curve canvases), so widget-heavy pages capture completely instead of
// failing or coming back blank. It navigates ANONYMOUSLY to the public content page (the
// headless browser carries no session cookie), so the reviewer overlay self-nulls and the
// shot is clean. Local Console only: launching a real browser per request is acceptable here.
const Body = z.object({
  kind: z.string().min(1).max(64),
  slug: z.string().min(1).max(128),
});

// The screenshot target's scheme+host+port come from the configured LOCAL base (NEXTAUTH_URL),
// NOT from req.url. Behind the Cloudflare tunnel req.url is https://localhost:3041 (the proxy
// sets x-forwarded-proto: https) but the server only speaks http on 3041, so navigating to the
// request's own origin throws net::ERR_SSL_PROTOCOL_ERROR. Using NEXTAUTH_URL makes the server
// screenshot itself over local http and bypass the tunnel.
function localBase(req: Request): string {
  const env = process.env.NEXTAUTH_URL?.trim();
  if (env) return env.replace(/\/+$/, '');
  // Fallback (NEXTAUTH_URL unset): same host:port as the request but forced to http, so the
  // scheme is never inherited from req.url's (possibly https) value.
  const port = new URL(req.url).port || process.env.PORT || '3000';
  return `http://localhost:${port}`;
}

export async function POST(req: Request) {
  // Feature gate: this host has no Chromium (e.g. Infomaniak Managed Cloud Server), so launching
  // headless Chromium would crash. Set NEXT_PUBLIC_ENABLE_SERVER_SNAPSHOT=1 to re-enable on a
  // Chromium-capable host. The same flag is read by FindingComposer at build time to hide the
  // "Capture page" button, so this 503 is defense-in-depth (the UI normally never hits this path
  // when the flag is unset).
  if (
    process.env.NEXT_PUBLIC_ENABLE_SERVER_SNAPSHOT !== '1' &&
    process.env.NEXT_PUBLIC_ENABLE_SERVER_SNAPSHOT !== 'true'
  ) {
    return NextResponse.json(
      { error: 'Server-side full-page snapshot is disabled on this host. Use "Capture my current view" instead.' },
      { status: 503 },
    );
  }

  const auth = await requireReviewer();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const { kind, slug } = parsed.data;

  const target = `${localBase(req)}/${encodeURIComponent(kind)}/${encodeURIComponent(slug)}/`;
  console.log('[api/snapshot] navigating to %s', target);

  let browser: import('@playwright/test').Browser | null = null;
  try {
    const { chromium } = await import('@playwright/test');
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(target, { waitUntil: 'load', timeout: 30_000 });
    // Best-effort idle, then a settle delay so dynamic widget chunks, WebGL, and entrance
    // animations have painted before the shot. Idle is best-effort because looping canvas
    // animations can keep the network/CPU busy and never report fully idle.
    await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => {});
    await page.waitForTimeout(1_800);
    const buf = await page.screenshot({ fullPage: true, type: 'png' });
    return NextResponse.json({ dataUrl: `data:image/png;base64,${buf.toString('base64')}` });
  } catch (err) {
    // Log the real cause server-side (a bare catch previously hid the ERR_SSL_PROTOCOL_ERROR);
    // the client still gets a graceful 500.
    console.error('[api/snapshot] capture failed for %s\n', target, err instanceof Error ? (err.stack ?? err.message) : err);
    return NextResponse.json({ error: 'Capture failed' }, { status: 500 });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
