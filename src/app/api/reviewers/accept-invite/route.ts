import { NextResponse } from 'next/server';
import { z } from 'zod';
import { setPasswordViaToken } from '@/lib/reviewerTokens';
import { rateLimit, clientIp } from '@/lib/rateLimit';

export const runtime = 'nodejs'; // prisma (better-sqlite3) needs the Node runtime
export const dynamic = 'force-dynamic';

// POST /api/reviewers/accept-invite - PUBLIC (no session): redeem an invite token and set the
// reviewer's password. Rate-limited per IP. The token is validated by hash; every failure mode
// (not found / expired / already used) returns the SAME generic message so the endpoint cannot be
// used to enumerate valid tokens. Password is server-enforced to 12+ chars.
const Body = z.object({
  token: z.string().min(1).max(500),
  password: z.string().min(12).max(200),
});

const GENERIC_TOKEN_ERROR = 'This link is invalid or has expired. Ask an admin for a new one.';

export async function POST(req: Request) {
  const rl = rateLimit(`accept-invite:${clientIp(req)}`, 10, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const pwIssue = parsed.error.issues.find((i) => i.path[0] === 'password');
    return NextResponse.json(
      { error: pwIssue ? 'Password must be at least 12 characters.' : 'Invalid request.' },
      { status: 400 },
    );
  }

  const result = await setPasswordViaToken(parsed.data.token, 'invite', parsed.data.password);
  if (!result.ok) return NextResponse.json({ error: GENERIC_TOKEN_ERROR }, { status: 400 });
  return NextResponse.json({ ok: true });
}
