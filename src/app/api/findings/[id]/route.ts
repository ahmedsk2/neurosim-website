import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin, requireReviewer } from '@/lib/auth/apiAuth';
import { isAdminRole } from '@/lib/auth/roles';
import { FindingStatus } from '@/lib/enums';
import { canTransition, isReattest, stampsReviewedHash } from '@/lib/findings';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // prisma (mariadb driver) needs the Node runtime

const PatchBody = z.object({
  toStatus: FindingStatus,
  resolutionNote: z.string().nullish(),
  duplicateOfId: z.number().int().nullish(),
});

// PATCH /api/findings/[id] - lifecycle transition. Enforces the allowed-transition map,
// stamps reviewedContentHash on entry to resolved/verified/closed, and writes an
// append-only FindingAudit row (status_change or reverified).
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Status transitions are ADMIN-ONLY: a non-admin reviewer gets 403 here, so "reviewers
  // cannot change status" holds even against a hand-crafted PATCH (not just a hidden button).
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const { id } = await params;
  const findingId = Number(id);
  if (!Number.isInteger(findingId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const parsed = PatchBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body', issues: parsed.error.issues }, { status: 400 });
  }
  const { toStatus, resolutionNote, duplicateOfId } = parsed.data;

  const finding = await prisma.finding.findUnique({
    where: { id: findingId },
    include: { page: { select: { contentHash: true } } },
  });
  if (!finding) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (finding.deletedAt) return NextResponse.json({ error: 'Finding is deleted' }, { status: 409 });

  const from = finding.status;
  const reattest = isReattest(from, toStatus);
  if (!reattest && !canTransition(from, toStatus)) {
    return NextResponse.json({ error: `Illegal transition ${from} -> ${toStatus}` }, { status: 409 });
  }
  if (toStatus === 'duplicate' && (duplicateOfId === null || duplicateOfId === undefined)) {
    return NextResponse.json({ error: 'duplicate requires duplicateOfId' }, { status: 400 });
  }

  const now = new Date();
  const data: Prisma.FindingUncheckedUpdateInput = { status: toStatus };
  if (stampsReviewedHash(toStatus)) data.reviewedContentHash = finding.page.contentHash;
  if (resolutionNote != null) data.resolutionNote = resolutionNote;
  if (toStatus === 'resolved') {
    data.resolvedById = auth.user.id;
    data.resolvedAt = now;
  }
  if (toStatus === 'verified') {
    data.verifiedById = auth.user.id;
    data.verifiedAt = now;
  }
  if (toStatus === 'duplicate' && duplicateOfId != null) data.duplicateOfId = duplicateOfId;

  const updated = await prisma.$transaction(async (tx) => {
    const u = await tx.finding.update({ where: { id: findingId }, data });
    await tx.findingAudit.create({
      data: {
        findingId,
        actorId: auth.user.id,
        action: reattest ? 'reverified' : 'status_change',
        fromStatus: from,
        toStatus,
      },
    });
    return u;
  });

  return NextResponse.json({ finding: updated });
}

// DELETE /api/findings/[id] - SOFT delete. An admin may delete ANY finding; a reviewer may
// delete only one they authored (404 otherwise, so another reviewer's finding is not revealed).
// Nothing is removed: the finding, its append-only FindingAudit, comments, attachments, and
// on-disk files are PRESERVED. It is marked with deletedAt/deletedById (hiding it from every
// normal view via the deletedAt filter) and a 'deleted' audit row is appended.
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireReviewer();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const { id } = await params;
  const findingId = Number(id);
  if (!Number.isInteger(findingId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const finding = await prisma.finding.findUnique({
    where: { id: findingId },
    select: { id: true, authorId: true, deletedAt: true },
  });
  if (!finding) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!isAdminRole(auth.user.role) && finding.authorId !== auth.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (finding.deletedAt) return NextResponse.json({ ok: true }); // already deleted (idempotent)

  await prisma.$transaction(async (tx) => {
    await tx.finding.update({
      where: { id: findingId },
      data: { deletedAt: new Date(), deletedById: auth.user.id },
    });
    await tx.findingAudit.create({
      data: {
        findingId,
        actorId: auth.user.id,
        action: 'deleted',
        detail: JSON.stringify({ deletedBy: auth.user.id }),
      },
    });
  });

  return NextResponse.json({ ok: true });
}
