import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/apiAuth';
import { FindingStatus } from '@/lib/enums';
import { canTransition, isReattest, stampsReviewedHash } from '@/lib/findings';

export const dynamic = 'force-dynamic';

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
