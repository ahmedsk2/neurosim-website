import { NextResponse } from 'next/server';
import { z } from 'zod';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { prisma } from '@/lib/prisma';
import { requireReviewer } from '@/lib/auth/apiAuth';
import { isAdminRole } from '@/lib/auth/roles';

export const dynamic = 'force-dynamic';

// Accepts a PNG data URL (the original snapshot or the flattened annotated image),
// writes it to a Console-managed, gitignored uploads/ folder, and records a
// FindingAttachment row pointing at the relative path. Local app => server fs write.
const Body = z.object({
  variant: z.enum(['original', 'annotated']),
  dataUrl: z.string().min(1),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireReviewer();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const { id } = await params;
  const findingId = Number(id);
  if (!Number.isInteger(findingId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 });

  const finding = await prisma.finding.findUnique({ where: { id: findingId } });
  if (!finding) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  // Owner-or-admin: a reviewer can only attach to a finding they authored (the author uploads
  // right after filing); 404 to not reveal another reviewer's finding.
  if (!isAdminRole(auth.user.role) && finding.authorId !== auth.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const m = /^data:image\/png;base64,(.+)$/.exec(parsed.data.dataUrl);
  if (!m || !m[1]) return NextResponse.json({ error: 'Expected a PNG data URL' }, { status: 400 });
  const buf = Buffer.from(m[1], 'base64');

  const dir = path.join(process.cwd(), 'uploads', 'findings', String(findingId));
  await fs.mkdir(dir, { recursive: true });
  const abs = path.join(dir, `${parsed.data.variant}-${Date.now()}.png`);
  await fs.writeFile(abs, buf);
  const relPath = path.relative(process.cwd(), abs).split(path.sep).join('/');

  const attachment = await prisma.findingAttachment.create({
    data: { findingId, uploadedById: auth.user.id, filePath: relPath },
  });
  return NextResponse.json({ attachment }, { status: 201 });
}
