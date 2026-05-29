import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/apiAuth';

export const runtime = 'nodejs'; // prisma (mariadb driver) needs the Node runtime
export const dynamic = 'force-dynamic';

// POST /api/findings/[id]/restore - admin-only un-delete of a soft-deleted finding. Clears
// deletedAt/deletedById and appends a 'restored' FindingAudit row. Deletion was orthogonal to
// the workflow status, so restoration is too: the finding returns to whatever status it had.
// Explicit, not a silent no-op: restoring a finding that is not deleted -> 409; missing -> 404.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const { id } = await params;
  const findingId = Number(id);
  if (!Number.isInteger(findingId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const finding = await prisma.finding.findUnique({ where: { id: findingId }, select: { id: true, deletedAt: true } });
  if (!finding) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!finding.deletedAt) return NextResponse.json({ error: 'Finding is not deleted' }, { status: 409 });

  await prisma.$transaction(async (tx) => {
    await tx.finding.update({ where: { id: findingId }, data: { deletedAt: null, deletedById: null } });
    await tx.findingAudit.create({
      data: { findingId, actorId: auth.user.id, action: 'restored', detail: JSON.stringify({ restoredBy: auth.user.id }) },
    });
  });

  return NextResponse.json({ ok: true });
}
