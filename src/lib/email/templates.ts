/**
 * Email template placeholder resolution. Pure functions (no DB, no env, no nodemailer) so they
 * behave identically server-side (prefill) and client-side (the compose panel) and are trivially
 * unit-testable. Placeholders are resolved at compose time; the admin then edits the resolved
 * text and the server sends exactly that (see src/lib/email/send.ts), so what the admin sees is
 * what is sent.
 */

/** The values every placeholder is filled from. Keys match the {{placeholder}} token names. */
export interface TemplateContext {
  reviewerName: string;
  ticketTitle: string;
  page: string; // "kind/slug"
  status: string; // the finding status this email is about
  link: string; // absolute URL to the reviewer's own scoped ticket view
}

const PLACEHOLDER = /\{\{\s*(\w+)\s*\}\}/g;

/** Replace {{key}} tokens from ctx. Unknown tokens are left intact so a typo stays visible. */
export function resolvePlaceholders(text: string, ctx: TemplateContext): string {
  return text.replace(PLACEHOLDER, (whole, key: string) =>
    Object.prototype.hasOwnProperty.call(ctx, key) ? String(ctx[key as keyof TemplateContext]) : whole,
  );
}

export function renderTemplate(
  tpl: { subject: string; body: string },
  ctx: TemplateContext,
): { subject: string; body: string } {
  return {
    subject: resolvePlaceholders(tpl.subject, ctx),
    body: resolvePlaceholders(tpl.body, ctx),
  };
}

/**
 * The reviewer's own scoped ticket URL, used for the {{link}} placeholder. Built from the
 * configured base (NEXTAUTH_URL, the same source the snapshot route uses) so the link is
 * absolute and points at the role-split "my tickets" detail the author is authorized to see;
 * an unauthenticated click routes through /review/login first. The trailing slash matches
 * next.config trailingSlash and avoids a 308 hop.
 */
export function reviewerTicketLink(findingId: number, baseUrl: string): string {
  const base = baseUrl.replace(/\/+$/, '');
  return `${base}/review/findings/${findingId}/`;
}
