import { prisma } from '@/lib/prisma';
import { getTransport } from '@/lib/email/transport';
import { resolveVars } from '@/lib/email/templates';

export type SendSystemEmailResult = { ok: true } | { ok: false; status: number; error: string };

/**
 * Send a SYSTEM (auto-sent, not admin-in-the-loop) transactional email from a seeded
 * EmailTemplate: load the template by key, resolve {{vars}}, and send via the configured,
 * encrypted SMTP transport. Used for invite + password-reset links. These are auth emails, so
 * there is no admin compose/edit step and no FindingAudit row (not finding-related).
 */
export async function sendSystemEmail(opts: {
  to: string;
  templateKey: string;
  vars: Record<string, string>;
}): Promise<SendSystemEmailResult> {
  const transport = await getTransport();
  if (!transport.configured) return { ok: false, status: 503, error: transport.reason };

  const tpl = await prisma.emailTemplate.findUnique({ where: { key: opts.templateKey } });
  if (!tpl || !tpl.isActive) {
    return { ok: false, status: 500, error: `Email template "${opts.templateKey}" is missing or inactive.` };
  }

  try {
    await transport.transporter.sendMail({
      from: transport.from,
      to: opts.to,
      subject: resolveVars(tpl.subject, opts.vars),
      text: resolveVars(tpl.body, opts.vars),
    });
  } catch (err) {
    console.error('[email/system] send failed:', err instanceof Error ? (err.stack ?? err.message) : err);
    return { ok: false, status: 502, error: err instanceof Error ? err.message : 'SMTP send failed' };
  }
  return { ok: true };
}
