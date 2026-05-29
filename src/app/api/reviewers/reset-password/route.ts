import { NextResponse } from 'next/server';
import { z } from 'zod';
import { setPasswordViaToken } from '@/lib/reviewerTokens';
import { rateLimit, clientIp } from '@/lib/rateLimit';

export const runtime = 'nodejs'; // prisma (mariadb driver) needs the Node runtime
export const dynamic = 'force-dynamic';

// POST /api/reviewers/reset-password - PUBLIC (no session): redeem a password-reset token and set
// a new password. Rate-limited per IP. Same generic, non-enumerating token error as accept-invite,
// and the same 12+ char minimum. Redeeming does NOT change isActive, so a reset link cannot be
// used to reactivate a deactivated account.
const Body = z.object({
  token: z.string().min(1).max(500),
  password: z.string().min(12).max(200),
});

const GENERIC_TOKEN_ERROR = 'This link is invalid or has expired. Ask an admin for a new one.';

export async function POST(req: Request) {
  const rl = rateLimit(`reset-password:${clientIp(req)}`, 10, 10 * 60 * 1000);
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

  const result = await setPasswordViaToken(parsed.data.token, 'password_reset', parsed.data.password);
  if (!result.ok) return NextResponse.json({ error: GENERIC_TOKEN_ERROR }, { status: 400 });
  return NextResponse.json({ ok: true });
}
