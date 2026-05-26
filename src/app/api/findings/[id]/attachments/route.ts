import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireReviewer } from '@/lib/auth/apiAuth';

export const dynamic = 'force-dynamic';

// Stub for Step C: accept a filePath reference (the real snapshot capture + draw canvas
// is Step D/E). Stores a FindingAttachment row pointing at a local path.
const AttachmentBody = z.object({ filePath: z.string().min(1) });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireReviewer();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const { id } = await params;
  const findingId = Number(id);
  if (!Number.isInteger(findingId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const parsed = AttachmentBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const finding = await prisma.finding.findUnique({ where: { id: findingId } });
  if (!finding) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const attachment = await prisma.findingAttachment.create({
    data: { findingId, uploadedById: auth.user.id, filePath: parsed.data.filePath },
  });
  return NextResponse.json({ attachment }, { status: 201 });
}
