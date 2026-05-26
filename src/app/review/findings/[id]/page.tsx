import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { requireReviewerPage } from '@/lib/auth/apiAuth';
import { isAdminRole } from '@/lib/auth/roles';
import { needsReverification, ALLOWED_TRANSITIONS } from '@/lib/findings';
import { REVIEWED_STATUSES } from '@/lib/enums';
import { reviewerTicketLink } from '@/lib/email/templates';
import { AdminLifecycle } from '../../_components/AdminLifecycle';
import { CommentForm } from '../../_components/CommentForm';

export const dynamic = 'force-dynamic';

// Compact one-line summary of an email_sent audit row for the trail (the email body is never stored).
function emailSummary(detail: string | null): string | null {
  if (!detail) return null;
  try {
    const d = JSON.parse(detail) as { to?: unknown; subject?: unknown; edited?: unknown };
    if (typeof d.subject === 'string') {
      const to = typeof d.to === 'string' ? d.to : 'reviewer';
      return `to ${to}: "${d.subject}"${d.edited ? ' (edited)' : ''}`;
    }
  } catch {
    // ignore malformed detail
  }
  return null;
}

export default async function FindingDetail({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireReviewerPage();
  const admin = isAdminRole(me.role);
  const { id } = await params;
  const findingId = Number(id);
  if (!Number.isInteger(findingId)) notFound();

  const finding = await prisma.finding.findUnique({
    where: { id: findingId },
    include: {
      page: true,
      author: { select: { name: true, email: true } },
      audit: { orderBy: { at: 'asc' }, include: { actor: { select: { name: true } } } },
      comments: { orderBy: { createdAt: 'asc' }, include: { author: { select: { name: true } } } },
      attachments: true,
    },
  });
  if (!finding) notFound();
  // A reviewer may only open a finding they authored; a deep link to another reviewer's id
  // returns 404 (scoped at the data layer, not just hidden nav). Admins may open any.
  if (!admin && finding.authorId !== me.id) notFound();

  const stale = needsReverification(finding.status, finding.reviewedContentHash, finding.page.contentHash);
  const targets = [...(ALLOWED_TRANSITIONS[finding.status] ?? [])];
  const reattest = (REVIEWED_STATUSES as readonly string[]).includes(finding.status);

  // Admin-only: active email templates + the placeholder context, built server-side. The
  // {{link}} base is NEXTAUTH_URL (same source as the snapshot route) and points at the
  // reviewer's own scoped ticket. Reviewers never receive any of this.
  const emailTemplates = admin
    ? await prisma.emailTemplate.findMany({
        where: { isActive: true },
        orderBy: { key: 'asc' },
        select: { key: true, label: true, subject: true, body: true },
      })
    : [];
  // Build the {{link}} base from the CURRENT request host (x-forwarded-* behind the tunnel) so
  // the reviewer link matches the domain the admin opened (e.g. web.towardpcc.com), not a fixed
  // NEXTAUTH_URL. Falls back to the Host header, then NEXTAUTH_URL.
  const hdrs = await headers();
  const proto = hdrs.get('x-forwarded-proto') ?? 'http';
  const hostHeader = hdrs.get('x-forwarded-host') ?? hdrs.get('host') ?? '';
  const linkBase = hostHeader ? `${proto}://${hostHeader}` : (process.env.NEXTAUTH_URL ?? '').trim();
  const emailCtx = {
    reviewerName: finding.author.name ?? 'reviewer',
    ticketTitle: finding.title,
    page: `${finding.page.kind}/${finding.page.slug}`,
    status: finding.status,
    link: reviewerTicketLink(finding.id, linkBase),
  };
  const recipientLabel = `${finding.author.name ?? 'reviewer'} <${finding.author.email}>`;

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <Link href="/review/findings" className="text-[#5eead4] hover:underline">&larr; findings</Link>
        <h1 className="mt-2 text-[15px] font-bold text-[#cbd5e1]">
          #{finding.id} · {finding.title}
        </h1>
        <p className="text-[#94a3b8]">
          {finding.severity} · {finding.category} · status <span className="text-[#e2e8f0]">{finding.status}</span>
          {stale && <span className="ml-2 text-[#fbbf24]">NEEDS RE-VERIFICATION (page changed since review)</span>}
        </p>
      </div>

      <div className="rounded border border-[#1e293b] bg-[#0b1220] p-3">
        <div className="text-[#94a3b8]">
          page <span className="text-[#e2e8f0]">{finding.page.kind}/{finding.page.slug}</span>
          {finding.sectionAnchor && <> · section <span className="text-[#e2e8f0]">{finding.sectionTextSnapshot ?? finding.sectionAnchor}</span></>}
        </div>
        <div className="mt-1 text-[#64748b]">
          filed @ {finding.filedContentHash} (git {finding.filedGitSha}) · current page hash {finding.page.contentHash}
          {finding.reviewedContentHash && <> · reviewed @ {finding.reviewedContentHash}</>}
        </div>
        <div className="mt-2">
          <a href={`/${finding.page.kind}/${finding.page.slug}/`} target="_blank" rel="noreferrer" className="text-[#5eead4] hover:underline">
            open live page &nearr;
          </a>
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-[#94a3b8]">detail</div>
        <p className="whitespace-pre-wrap text-[#e2e8f0]">{finding.detail}</p>
        {finding.quotedText && <p className="mt-2 border-l-2 border-[#334155] pl-3 text-[#94a3b8]">&ldquo;{finding.quotedText}&rdquo;</p>}
        {finding.suggestedFix && <p className="mt-2 text-[#cbd5e1]">fix: {finding.suggestedFix}</p>}
        {finding.suggestedCitation && <p className="text-[#cbd5e1]">cite: {finding.suggestedCitation}</p>}
      </div>

      <div className="space-y-2">
        <div className="text-[#94a3b8]">lifecycle</div>
        {finding.lastNotifiedAt && (
          <div className="text-[#64748b]">
            reviewer last notified {finding.lastNotifiedAt.toISOString().slice(0, 16).replace('T', ' ')}
          </div>
        )}
        {admin ? (
          <AdminLifecycle
            findingId={finding.id}
            current={finding.status}
            targets={targets}
            reattest={reattest}
            templates={emailTemplates}
            ctx={emailCtx}
            recipientLabel={recipientLabel}
          />
        ) : (
          <p className="text-[#64748b]">
            Status is <span className="text-[#e2e8f0]">{finding.status}</span>; status changes are handled by an admin.
          </p>
        )}
      </div>

      {finding.attachments.length > 0 && (
        <div>
          <div className="mb-1 text-[#94a3b8]">attachments ({finding.attachments.length})</div>
          <div className="flex flex-wrap gap-2">
            {finding.attachments.map((a) => {
              const src = `/api/findings/${finding.id}/attachments/${a.id}/`;
              return (
                <a key={a.id} href={src} target="_blank" rel="noreferrer" title={a.filePath.split('/').pop() ?? 'attachment'}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- auth-gated image; the next/image optimizer would refetch without the session cookie */}
                  <img src={src} alt="finding attachment" className="h-28 w-auto rounded border border-[#1e293b] hover:border-[#5eead4]" />
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div className="mb-1 text-[#94a3b8]">audit trail (append-only)</div>
        <ul className="space-y-1">
          {finding.audit.map((a) => {
            const email = a.action === 'email_sent' ? emailSummary(a.detail) : null;
            return (
              <li key={a.id} className="text-[#94a3b8]">
                <span className="text-[#64748b]">{a.at.toISOString().slice(0, 19).replace('T', ' ')}</span>{' '}
                <span className="text-[#e2e8f0]">{a.action}</span>
                {a.fromStatus && a.toStatus && <> {a.fromStatus} &rarr; {a.toStatus}</>}
                {email && <span> {email}</span>}
                {' · '}
                {a.actor?.name ?? 'system'}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <div className="mb-1 text-[#94a3b8]">comments</div>
        <ul className="mb-3 space-y-2">
          {finding.comments.map((c) => (
            <li key={c.id} className="rounded border border-[#1e293b] bg-[#0b1220] p-2">
              <div className="text-[#64748b]">{c.author.name} · {c.createdAt.toISOString().slice(0, 10)}</div>
              <div className="whitespace-pre-wrap text-[#e2e8f0]">{c.body}</div>
            </li>
          ))}
        </ul>
        <CommentForm findingId={finding.id} />
      </div>
    </div>
  );
}
