import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireReviewerPage } from '@/lib/auth/apiAuth';
import { isAdminRole } from '@/lib/auth/roles';
import { needsReverification } from '@/lib/findings';

export const dynamic = 'force-dynamic';

export default async function ReviewPageList() {
  const me = await requireReviewerPage();
  const admin = isAdminRole(me.role);

  // Per-page finding counts: admins see all findings; reviewers see only the ones they
  // authored (the included relation is filtered server-side).
  const pages = await prisma.page.findMany({
    orderBy: [{ kind: 'asc' }, { slug: 'asc' }],
    include: {
      findings: { where: { deletedAt: null, ...(admin ? {} : { authorId: me.id }) }, select: { status: true, reviewedContentHash: true } },
    },
  });

  const byKind: Record<string, number> = {};
  for (const p of pages) byKind[p.kind] = (byKind[p.kind] ?? 0) + 1;

  return (
    <div>
      <h1 className="mb-1 text-[15px] font-bold text-[#5eead4]">Pages ({pages.length})</h1>
      <p className="mb-4 text-[#94a3b8]">
        {Object.entries(byKind)
          .map(([k, n]) => `${k} ${n}`)
          .join('  ·  ')}
      </p>
      {!admin && <p className="mb-3 text-[#64748b]">Finding counts shown are your own tickets.</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#1e293b] text-left text-[#94a3b8]">
            <th className="py-1.5 pr-3">kind</th>
            <th className="py-1.5 pr-3">slug</th>
            <th className="py-1.5 pr-3">title</th>
            <th className="py-1.5 pr-3">findings</th>
            <th className="py-1.5 pr-3">stale</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((p) => {
            const stale = p.findings.filter((f) =>
              needsReverification(f.status, f.reviewedContentHash, p.contentHash),
            ).length;
            return (
              <tr key={p.id} className="border-b border-[#0f172a]">
                <td className="py-1.5 pr-3 text-[#94a3b8]">{p.kind}</td>
                <td className="py-1.5 pr-3">{p.slug}</td>
                <td className="py-1.5 pr-3 text-[#cbd5e1]">{p.title}</td>
                <td className="py-1.5 pr-3">
                  <Link href={`/review/findings?kind=${p.kind}&slug=${p.slug}`} className="text-[#5eead4] hover:underline">
                    {p.findings.length}
                  </Link>
                </td>
                <td className="py-1.5 pr-3">{stale > 0 ? <span className="text-[#fbbf24]">{stale}</span> : '0'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
