import nodemailer, { type Transporter } from 'nodemailer';

/**
 * Lazy, env-configured SMTP transport. This is the only piece of the Console that reaches
 * outside the PC (to a mail server), so the account lives entirely in env and is never
 * committed. If SMTP_HOST or SMTP_FROM is missing the transport reports
 * { configured: false } and the send service surfaces that gracefully (it never throws at
 * import time), so the rest of the Console keeps working when email is not set up.
 */
export type TransportResult =
  | { configured: true; transporter: Transporter; from: string }
  | { configured: false; reason: string };

let cached: TransportResult | null = null;

function build(): TransportResult {
  const host = process.env.SMTP_HOST?.trim();
  const from = process.env.SMTP_FROM?.trim();
  if (!host || !from) {
    return {
      configured: false,
      reason:
        'SMTP is not configured. Set SMTP_HOST and SMTP_FROM (and SMTP_USER/SMTP_PASS if the server requires auth) in .env to enable reviewer emails.',
    };
  }
  const portRaw = Number(process.env.SMTP_PORT ?? '587');
  const port = Number.isFinite(portRaw) ? portRaw : 587;
  const secure = process.env.SMTP_SECURE === 'true'; // true => implicit TLS (465); false => STARTTLS (587)
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    ...(user ? { auth: { user, pass } } : {}),
  });
  return { configured: true, transporter, from };
}

/** Returns the cached transport result, building it from env on first use. */
export function getTransport(): TransportResult {
  if (cached === null) cached = build();
  return cached;
}

/**
 * Test seam: override the cached transport (e.g. inject a nodemailer jsonTransport so unit
 * tests send no real mail) or pass null to clear it and force a rebuild from env. Not used in
 * application code.
 */
export function __setTransportForTests(result: TransportResult | null): void {
  cached = result;
}
