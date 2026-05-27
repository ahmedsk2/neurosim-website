import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/apiAuth';
import { createInviteToken, inviteLink, requestBaseUrl } from '@/lib/reviewerTokens';
import { sendSystemEmail } from '@/lib/email/system';

export const runtime = 'nodejs'; // prisma (better-sqlite3) needs the Node runtime
export const dynamic = 'force-dynamic';

// POST /api/reviewers/[id]/reset-password - admin-only: email the reviewer a fresh one-time
// set-password link. It is purpose-aware so a single admin action does the right thing:
//   - a reviewer who has NOT set a password yet (pending invitee) gets a re-sent INVITE,
//   - a reviewer who already has a password gets a PASSWORD RESET.
// The token is stored only as a sha256 hash and is never returned. A deactivated reviewer must be
// reactivated first (a link cannot be used to sign in while inactive, so sending one would mislead).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const { id } = await params;
  const reviewer = await prisma.reviewer.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, isActive: true, passwordHash: true },
  });
  if (!reviewer) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!reviewer.isActive) {
    return NextResponse.json({ error: 'Reactivate the reviewer before sending a sign-in link.' }, { status: 409 });
  }

  const purpose = reviewer.passwordHash ? 'password_reset' : 'invite';
  const { id: inviteId, token, expiresAt } = await createInviteToken(reviewer.id, purpose);
  const base = requestBaseUrl(req);
  const vars: Record<string, string> =
    purpose === 'invite'
      ? {
          reviewerName: reviewer.name,
          inviterName: auth.user.name ?? 'an administrator',
          link: inviteLink(base, 'invite', token),
          expiresAt: expiresAt.toUTCString(),
        }
      : {
          reviewerName: reviewer.name,
          link: inviteLink(base, 'password_reset', token),
          expiresAt: expiresAt.toUTCString(),
        };

  const sent = await sendSystemEmail({ to: reviewer.email, templateKey: purpose, vars });

  return NextResponse.json({
    ok: true,
    inviteId,
    purpose,
    emailSent: sent.ok,
    ...(sent.ok ? {} : { emailError: sent.error }),
  });
}
