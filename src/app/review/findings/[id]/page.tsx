import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireReviewerPage } from '@/lib/auth/apiAuth';
import { isAdminRole } from '@/lib/auth/roles';
import { needsReverification, ALLOWED_TRANSITIONS } from '@/lib/findings';
import { REVIEWED_STATUSES } from '@/lib/enums';
import { TransitionControls } from '../../_components/TransitionControls';
import { CommentForm } from '../../_components/CommentForm';

export const dynamic = 'force-dynamic';

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
        {admin ? (
          <TransitionControls findingId={finding.id} current={finding.status} targets={targets} reattest={reattest} />
        ) : (
          <p className="text-[#64748b]">
            Status is <span className="text-[#e2e8f0]">{finding.status}</span>; status changes are handled by an admin.
          </p>
        )}
      </div>

      {finding.attachments.length > 0 && (
        <div>
          <div className="text-[#94a3b8]">attachments</div>
          <ul className="list-disc pl-5 text-[#cbd5e1]">
            {finding.attachments.map((a) => (
              <li key={a.id}>{a.filePath}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div className="mb-1 text-[#94a3b8]">audit trail (append-only)</div>
        <ul className="space-y-1">
          {finding.audit.map((a) => (
            <li key={a.id} className="text-[#94a3b8]">
              <span className="text-[#64748b]">{a.at.toISOString().slice(0, 19).replace('T', ' ')}</span>{' '}
              <span className="text-[#e2e8f0]">{a.action}</span>
              {a.fromStatus && a.toStatus && <> {a.fromStatus} &rarr; {a.toStatus}</>}
              {' · '}
              {a.actor?.name ?? 'system'}
            </li>
          ))}
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
