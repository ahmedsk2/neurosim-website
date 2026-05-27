import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireReviewerPage } from '@/lib/auth/apiAuth';
import { isAdminRole } from '@/lib/auth/roles';

export const dynamic = 'force-dynamic';

// Admin-only view of soft-deleted findings. This is the ONLY page query that filters
// deletedAt != null (the inverse of every other query, which excludes soft-deleted findings);
// the rest of the system continues to hide them. A non-admin reviewer who deep-links here gets
// 404 at the data layer, not just a hidden nav item (the role-split enforcement discipline).
export default async function DeletedItems() {
  const me = await requireReviewerPage();
  if (!isAdminRole(me.role)) notFound();

  const deleted = await prisma.finding.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' },
    include: { page: { select: { kind: true, slug: true } }, author: { select: { name: true } } },
  });

  // deletedById is a plain column (not a relation); resolve the names in one lookup.
  const deleterIds = [...new Set(deleted.map((f) => f.deletedById).filter((x): x is string => !!x))];
  const deleters = deleterIds.length
    ? await prisma.reviewer.findMany({ where: { id: { in: deleterIds } }, select: { id: true, name: true } })
    : [];
  const deleterName = new Map(deleters.map((r) => [r.id, r.name]));

  return (
    <div>
      <h1 className="mb-1 text-[15px] font-bold text-[#5eead4]">Deleted items ({deleted.length})</h1>
      <p className="mb-3 text-[#94a3b8]">
        Soft-deleted findings. The record and its full audit history are preserved; open one to review the
        history and restore it. Reviewers do not see these.
      </p>
      {deleted.length === 0 ? (
        <p className="text-[#94a3b8]">No deleted findings.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#1e293b] text-left text-[#94a3b8]">
              <th className="py-1.5 pr-3">id</th>
              <th className="py-1.5 pr-3">title</th>
              <th className="py-1.5 pr-3">page</th>
              <th className="py-1.5 pr-3">author</th>
              <th className="py-1.5 pr-3">deleted by</th>
              <th className="py-1.5 pr-3">deleted at</th>
              <th className="py-1.5 pr-3">status</th>
            </tr>
          </thead>
          <tbody>
            {deleted.map((f) => (
              <tr key={f.id} className="border-b border-[#0f172a]">
                <td className="py-1.5 pr-3">
                  <Link href={`/review/findings/${f.id}`} className="text-[#5eead4] hover:underline">
                    #{f.id}
                  </Link>
                </td>
                <td className="py-1.5 pr-3 text-[#cbd5e1]">{f.title}</td>
                <td className="py-1.5 pr-3 text-[#94a3b8]">{f.page.kind}/{f.page.slug}</td>
                <td className="py-1.5 pr-3 text-[#94a3b8]">{f.author.name}</td>
                <td className="py-1.5 pr-3 text-[#94a3b8]">
                  {f.deletedById ? (deleterName.get(f.deletedById) ?? f.deletedById) : 'unknown'}
                </td>
                <td className="py-1.5 pr-3 text-[#64748b]">
                  {f.deletedAt ? f.deletedAt.toISOString().slice(0, 16).replace('T', ' ') : ''}
                </td>
                <td className="py-1.5 pr-3 text-[#94a3b8]">{f.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
