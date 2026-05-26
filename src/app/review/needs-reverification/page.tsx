import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireReviewerPage } from '@/lib/auth/apiAuth';
import { REVIEWED_STATUSES } from '@/lib/enums';

export const dynamic = 'force-dynamic';

export default async function NeedsReverify() {
  await requireReviewerPage();

  const candidates = await prisma.finding.findMany({
    where: { status: { in: [...REVIEWED_STATUSES] }, reviewedContentHash: { not: null } },
    include: { page: { select: { kind: true, slug: true, contentHash: true } } },
    orderBy: { updatedAt: 'desc' },
  });
  const stale = candidates.filter((f) => f.reviewedContentHash !== f.page.contentHash);

  return (
    <div>
      <h1 className="mb-1 text-[15px] font-bold text-[#5eead4]">Needs re-verification ({stale.length})</h1>
      <p className="mb-3 text-[#94a3b8]">
        Resolved/verified/closed findings whose page contentHash changed since the review. Re-read the section, then
        re-verify (re-attest) or re-open.
      </p>
      {stale.length === 0 ? (
        <p className="text-[#94a3b8]">Nothing stale. Every reviewed finding is pinned to the current page version.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#1e293b] text-left text-[#94a3b8]">
              <th className="py-1.5 pr-3">id</th>
              <th className="py-1.5 pr-3">status</th>
              <th className="py-1.5 pr-3">page</th>
              <th className="py-1.5 pr-3">reviewed @</th>
              <th className="py-1.5 pr-3">current @</th>
            </tr>
          </thead>
          <tbody>
            {stale.map((f) => (
              <tr key={f.id} className="border-b border-[#0f172a]">
                <td className="py-1.5 pr-3">
                  <Link href={`/review/findings/${f.id}`} className="text-[#5eead4] hover:underline">#{f.id}</Link>
                </td>
                <td className="py-1.5 pr-3 text-[#fbbf24]">{f.status}</td>
                <td className="py-1.5 pr-3 text-[#94a3b8]">{f.page.kind}/{f.page.slug}</td>
                <td className="py-1.5 pr-3 text-[#64748b]">{f.reviewedContentHash}</td>
                <td className="py-1.5 pr-3 text-[#64748b]">{f.page.contentHash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
