import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireReviewer } from '@/lib/auth/apiAuth';
import { isAdminRole } from '@/lib/auth/roles';

export const dynamic = 'force-dynamic';

const CommentBody = z.object({ body: z.string().min(1) });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireReviewer();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const { id } = await params;
  const findingId = Number(id);
  if (!Number.isInteger(findingId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const parsed = CommentBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const finding = await prisma.finding.findUnique({ where: { id: findingId } });
  if (!finding) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  // Owner-or-admin: a reviewer can only comment on a finding they authored (404, do not reveal).
  if (!isAdminRole(auth.user.role) && finding.authorId !== auth.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const comment = await prisma.$transaction(async (tx) => {
    const c = await tx.findingComment.create({
      data: { findingId, authorId: auth.user.id, body: parsed.data.body },
    });
    await tx.findingAudit.create({ data: { findingId, actorId: auth.user.id, action: 'commented' } });
    return c;
  });

  return NextResponse.json({ comment }, { status: 201 });
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireReviewer();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const { id } = await params;
  const findingId = Number(id);
  if (!Number.isInteger(findingId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const finding = await prisma.finding.findUnique({ where: { id: findingId } });
  if (!finding) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!isAdminRole(auth.user.role) && finding.authorId !== auth.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const comments = await prisma.findingComment.findMany({
    where: { findingId },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json({ comments });
}
