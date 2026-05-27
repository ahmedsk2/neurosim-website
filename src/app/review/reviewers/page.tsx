import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireReviewerPage } from '@/lib/auth/apiAuth';
import { isAdminRole } from '@/lib/auth/roles';
import { ReviewerManager } from '../_components/ReviewerManager';

export const dynamic = 'force-dynamic';

// Admin-only reviewer management. Non-admin reviewers who deep-link here get 404 at the data
// layer (the role-split discipline: a hidden nav item is not the security boundary). There is no
// public signup; every reviewer is created here and activates via an emailed one-time link.
export default async function ReviewersPage() {
  const me = await requireReviewerPage();
  if (!isAdminRole(me.role)) notFound();

  const reviewers = await prisma.reviewer.findMany({
    orderBy: [{ isActive: 'desc' }, { createdAt: 'asc' }],
    // passwordHash is read only to derive the boolean `hasPassword`; the hash never leaves the server.
    select: { id: true, email: true, name: true, role: true, isActive: true, passwordHash: true, createdAt: true },
  });

  const rows = reviewers.map((r) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    role: r.role,
    isActive: r.isActive,
    hasPassword: !!r.passwordHash, // false => an outstanding invite they have not accepted yet
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-5xl space-y-5">
      <div>
        <h1 className="mb-1 text-[15px] font-bold text-[#5eead4]">Reviewers ({reviewers.length})</h1>
        <p className="text-[#94a3b8]">
          Create reviewer accounts (each sets their own password via an emailed one-time link), change
          roles, deactivate or reactivate, and re-send invite or password-reset links. There is no public
          signup. Accounts marked <span className="text-[#fbbf24]">invite pending</span> have not activated yet.
        </p>
      </div>
      <ReviewerManager initial={rows} meId={me.id} />
    </div>
  );
}
