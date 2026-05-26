import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth/apiAuth';
import { EmailTemplateKey } from '@/lib/enums';
import { sendFindingEmail } from '@/lib/email/send';

export const runtime = 'nodejs'; // nodemailer needs the Node runtime, not edge
export const dynamic = 'force-dynamic';

// The admin sends the FINAL (already-edited) subject + body. The recipient is NOT in the body:
// it is derived server-side in sendFindingEmail from finding.author.email, so this route cannot
// be used to mail an arbitrary address. templateKey + edited are audit metadata only.
const Body = z.object({
  subject: z.string().min(1).max(300),
  body: z.string().min(1).max(20000),
  templateKey: EmailTemplateKey,
  edited: z.boolean(),
});

// POST /api/findings/[id]/email - admin-only reviewer notification. requireAdmin (403 for a
// non-admin reviewer). On success the email_sent audit row + lastNotifiedAt are written by the
// send service; on failure the error is surfaced and nothing else is touched.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const { id } = await params;
  const findingId = Number(id);
  if (!Number.isInteger(findingId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body', issues: parsed.error.issues }, { status: 400 });
  }

  const result = await sendFindingEmail({
    findingId,
    subject: parsed.data.subject,
    body: parsed.data.body,
    templateKey: parsed.data.templateKey,
    edited: parsed.data.edited,
    actorId: auth.user.id, // sender is the authenticated admin, never client-supplied
  });

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true });
}
