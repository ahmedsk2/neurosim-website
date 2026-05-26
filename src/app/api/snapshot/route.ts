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

export async function POST(req: Request) {
  const auth = await requireReviewer();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  const { kind, slug } = parsed.data;

  // Hit the same running server via this request's own origin (localhost in local use).
  const origin = new URL(req.url).origin;
  const target = `${origin}/${encodeURIComponent(kind)}/${encodeURIComponent(slug)}/`;

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
  } catch {
    return NextResponse.json({ error: 'Capture failed' }, { status: 500 });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
