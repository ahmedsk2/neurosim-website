import { prisma } from '@/lib/prisma';
import { getTransport } from '@/lib/email/transport';

export interface SendFindingEmailInput {
  findingId: number;
  subject: string; // final, possibly admin-edited
  body: string; // final, possibly admin-edited
  templateKey: string; // which template seeded the draft (audit metadata only)
  edited: boolean; // did the admin change the prefilled text (audit metadata only)
  actorId: string; // the admin sending; derived from the session server-side, never the client
}

export type SendFindingEmailResult = { ok: true } | { ok: false; status: number; error: string };

/**
 * Send an admin->reviewer notification for a finding.
 *
 * The recipient is ALWAYS derived server-side from the finding's author (finding.author.email)
 * and is never supplied by the client, so this cannot be turned into an open mailer to an
 * arbitrary address. On a confirmed send it writes an append-only email_sent FindingAudit row
 * (metadata only: to, subject, statusAtSend, templateKey, edited; the body is never stored) and
 * stamps Finding.lastNotifiedAt. On failure (not configured, no recipient, or SMTP error) it
 * surfaces the reason to the caller, writes NO audit row, and never touches the finding status.
 */
export async function sendFindingEmail(input: SendFindingEmailInput): Promise<SendFindingEmailResult> {
  const transport = await getTransport();
  if (!transport.configured) return { ok: false, status: 503, error: transport.reason };

  const finding = await prisma.finding.findUnique({
    where: { id: input.findingId },
    include: { author: { select: { email: true } } },
  });
  if (!finding) return { ok: false, status: 404, error: 'Finding not found' };

  const to = finding.author.email?.trim();
  if (!to) return { ok: false, status: 422, error: 'The reviewer who filed this finding has no email on file.' };

  try {
    await transport.transporter.sendMail({
      from: transport.from,
      to,
      subject: input.subject,
      text: input.body,
    });
  } catch (err) {
    // Surface the real SMTP error to the caller; write no audit row, leave status untouched.
    return { ok: false, status: 502, error: err instanceof Error ? err.message : 'SMTP send failed' };
  }

  // Success: record the notification (metadata only, no body) and stamp lastNotifiedAt.
  await prisma.$transaction(async (tx) => {
    await tx.findingAudit.create({
      data: {
        findingId: finding.id,
        actorId: input.actorId,
        action: 'email_sent',
        detail: JSON.stringify({
          to,
          subject: input.subject,
          statusAtSend: finding.status,
          templateKey: input.templateKey,
          edited: input.edited,
        }),
      },
    });
    await tx.finding.update({ where: { id: finding.id }, data: { lastNotifiedAt: new Date() } });
  });

  return { ok: true };
}
