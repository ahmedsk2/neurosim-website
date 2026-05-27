import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/apiAuth';
import { ReviewerRole } from '@/lib/enums';
import { createInviteToken, inviteLink, requestBaseUrl } from '@/lib/reviewerTokens';
import { sendSystemEmail } from '@/lib/email/system';

export const runtime = 'nodejs'; // prisma (better-sqlite3) needs the Node runtime
export const dynamic = 'force-dynamic';

// POST /api/reviewers - admin-only: create a reviewer with NO password (passwordHash=null) and
// email them a one-time invite link to set their own password. The plaintext token is never
// returned to the client (only its sha256 is stored); the admin cannot see or copy it. Creating
// an ADMIN requires an explicit confirmAdmin flag (a deliberate second step in the UI).
const CreateBody = z.object({
  email: z.string().trim().email().max(320),
  name: z.string().trim().min(1).max(200),
  role: ReviewerRole,
  confirmAdmin: z.boolean().optional(),
});

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const parsed = CreateBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body', issues: parsed.error.issues }, { status: 400 });
  }
  const { name, role, confirmAdmin } = parsed.data;
  const email = parsed.data.email.toLowerCase(); // case-insensitive identity (login is lowercased too)

  // Promoting someone to admin grants full triage power, so the UI must send confirmAdmin:true.
  if (role === 'admin' && !confirmAdmin) {
    return NextResponse.json({ error: 'Creating an admin needs confirmation.', needsAdminConfirm: true }, { status: 409 });
  }

  const existing = await prisma.reviewer.findUnique({ where: { email }, select: { id: true } });
  if (existing) return NextResponse.json({ error: 'A reviewer with that email already exists.' }, { status: 409 });

  // Created ACTIVE but with no password: login is rejected until they redeem the invite link.
  const reviewer = await prisma.reviewer.create({
    data: { email, name, role, passwordHash: null, isActive: true },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });

  const { id: inviteId, token, expiresAt } = await createInviteToken(reviewer.id, 'invite');
  const sent = await sendSystemEmail({
    to: reviewer.email,
    templateKey: 'invite',
    vars: {
      reviewerName: reviewer.name,
      inviterName: auth.user.name ?? 'an administrator',
      link: inviteLink(requestBaseUrl(req), 'invite', token),
      expiresAt: expiresAt.toUTCString(),
    },
  });

  return NextResponse.json({
    ok: true,
    reviewerId: reviewer.id,
    inviteId,
    emailSent: sent.ok,
    ...(sent.ok ? {} : { emailError: sent.error }),
  });
}
