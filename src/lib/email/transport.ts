import nodemailer, { type Transporter } from 'nodemailer';
import { prisma } from '@/lib/prisma';

/**
 * SMTP transport, resolved per send from the admin-editable SmtpSetting row (id="default")
 * merged over the SMTP_ env vars: a non-empty DB field overrides env, a blank field falls back
 * to env. There is intentionally NO cache, so saving settings in the Review Console takes
 * effect on the next send with no server restart. This is the only piece of the Console that
 * reaches outside the PC; when neither source supplies a host + from it reports
 * { configured: false } and the send service surfaces that gracefully (never throws).
 */
export type TransportResult =
  | { configured: true; transporter: Transporter; from: string }
  | { configured: false; reason: string };

export interface ResolvedSmtpConfig {
  host?: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from?: string;
}

let testOverride: TransportResult | null = null;

/**
 * Test seam: override what getTransport() returns (e.g. inject a nodemailer jsonTransport so
 * unit tests send no real mail, or a not-configured result). Pass null to clear. Not used in
 * application code.
 */
export function __setTransportForTests(result: TransportResult | null): void {
  testOverride = result;
}

/** DB row (id="default") merged over env, per field. DB wins when non-empty, else env. */
export async function loadSmtpConfig(): Promise<ResolvedSmtpConfig> {
  const row = await prisma.smtpSetting.findUnique({ where: { id: 'default' } }).catch(() => null);
  const envPort = Number(process.env.SMTP_PORT ?? '');
  return {
    host: row?.host?.trim() || process.env.SMTP_HOST?.trim() || undefined,
    port: row?.port ?? (Number.isFinite(envPort) && envPort > 0 ? envPort : 587),
    secure: row?.secure ?? process.env.SMTP_SECURE === 'true',
    user: row?.user?.trim() || process.env.SMTP_USER?.trim() || undefined,
    pass: row?.pass || process.env.SMTP_PASS || undefined,
    from: row?.from?.trim() || process.env.SMTP_FROM?.trim() || undefined,
  };
}

/** Build the transport from the resolved config, or report not-configured. */
export async function getTransport(): Promise<TransportResult> {
  if (testOverride) return testOverride;
  const cfg = await loadSmtpConfig();
  if (!cfg.host || !cfg.from) {
    return {
      configured: false,
      reason:
        'SMTP is not configured. Set the host and from address in Review Console settings (/review/settings) or via SMTP_HOST/SMTP_FROM in .env to enable reviewer emails.',
    };
  }
  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    // Fail fast instead of hanging: an unreachable host or a blocked port would otherwise
    // stall the request until the Cloudflare tunnel times out (502). With these the send
    // rejects in ~12s and the real reason (auth rejected, connection timeout, ...) is surfaced.
    connectionTimeout: 12_000,
    greetingTimeout: 12_000,
    socketTimeout: 20_000,
    ...(cfg.user ? { auth: { user: cfg.user, pass: cfg.pass } } : {}),
  });
  return { configured: true, transporter, from: cfg.from };
}
