import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/apiAuth';
import { getTransport } from '@/lib/email/transport';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Send a test email to the signed-in admin's own address using the currently SAVED SMTP config
// (so save before testing). requireAdmin. Writes no audit row (not tied to a finding); it only
// verifies the transport. The recipient is the admin's own email, derived server-side.
export async function POST() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const transport = await getTransport();
  if (!transport.configured) return NextResponse.json({ error: transport.reason }, { status: 503 });

  const to = auth.user.email?.trim();
  if (!to) return NextResponse.json({ error: 'Your account has no email address on file.' }, { status: 422 });

  try {
    await transport.transporter.sendMail({
      from: transport.from,
      to,
      subject: 'MNM-Edu Review: SMTP test',
      text: 'This is a test message from the MNM-Edu Review Console. If you received it, SMTP is configured correctly.',
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'SMTP send failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true, to });
}
