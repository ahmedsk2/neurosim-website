import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireReviewerPage } from '@/lib/auth/apiAuth';
import { isAdminRole } from '@/lib/auth/roles';
import { needsReverification } from '@/lib/findings';

export const dynamic = 'force-dynamic';

export default async function FindingsList({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const me = await requireReviewerPage();
  const admin = isAdminRole(me.role);
  const sp = await searchParams;
  const get = (k: string): string | undefined => (typeof sp[k] === 'string' ? sp[k] : undefined);
  const status = get('status');
  const severity = get('severity');
  const kind = get('kind');
  const slug = get('slug');
  const needsReverify = get('needsReverify') === 'true';

  const findings = await prisma.finding.findMany({
    where: {
      ...(admin ? {} : { authorId: me.id }),
      ...(status ? { status } : {}),
      ...(severity ? { severity } : {}),
      ...(kind || slug ? { page: { ...(kind ? { kind } : {}), ...(slug ? { slug } : {}) } } : {}),
    },
    include: { page: { select: { kind: true, slug: true, contentHash: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const rows = findings
    .map((f) => ({ f, stale: needsReverification(f.status, f.reviewedContentHash, f.page.contentHash) }))
    .filter((r) => (needsReverify ? r.stale : true));

  const filters = [status && `status=${status}`, severity && `severity=${severity}`, kind && `${kind}/${slug ?? '*'}`, needsReverify && 'needs-reverify']
    .filter(Boolean)
    .join('  ·  ');

  return (
    <div>
      <h1 className="mb-1 text-[15px] font-bold text-[#5eead4]">{admin ? 'Findings' : 'My tickets'} ({rows.length})</h1>
      <p className="mb-3 text-[#94a3b8]">
        {filters || 'all'} {filters && <Link href="/review/findings" className="ml-2 text-[#5eead4] hover:underline">clear</Link>}
      </p>
      {rows.length === 0 ? (
        <p className="text-[#94a3b8]">
          {admin
            ? 'No findings yet. Reviewers file findings from the in-context + overlay on content pages; this is the full triage of all reviewers.'
            : 'You have not filed any findings yet. Use the + overlay on a content page to file one.'}
        </p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#1e293b] text-left text-[#94a3b8]">
              <th className="py-1.5 pr-3">id</th>
              <th className="py-1.5 pr-3">severity</th>
              <th className="py-1.5 pr-3">status</th>
              <th className="py-1.5 pr-3">category</th>
              <th className="py-1.5 pr-3">page</th>
              <th className="py-1.5 pr-3">title</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ f, stale }) => (
              <tr key={f.id} className="border-b border-[#0f172a]">
                <td className="py-1.5 pr-3">
                  <Link href={`/review/findings/${f.id}`} className="text-[#5eead4] hover:underline">#{f.id}</Link>
                </td>
                <td className="py-1.5 pr-3">{f.severity}</td>
                <td className="py-1.5 pr-3">
                  {f.status}
                  {stale && <span className="ml-1 text-[#fbbf24]">(stale)</span>}
                </td>
                <td className="py-1.5 pr-3 text-[#94a3b8]">{f.category}</td>
                <td className="py-1.5 pr-3 text-[#94a3b8]">{f.page.kind}/{f.page.slug}</td>
                <td className="py-1.5 pr-3 text-[#cbd5e1]">{f.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
