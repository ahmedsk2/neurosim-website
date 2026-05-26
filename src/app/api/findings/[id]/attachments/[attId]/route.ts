import { NextResponse } from 'next/server';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { prisma } from '@/lib/prisma';
import { requireReviewer } from '@/lib/auth/apiAuth';
import { isAdminRole } from '@/lib/auth/roles';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Streams an attachment's PNG bytes (the snapshots live in the gitignored uploads/, outside
// public/, so they are not statically served). Owner-or-admin gated like the rest of a finding:
// a reviewer can only view attachments on a finding they authored; everyone else gets 404.
export async function GET(req: Request, { params }: { params: Promise<{ id: string; attId: string }> }) {
  const auth = await requireReviewer();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const { id, attId } = await params;
  const findingId = Number(id);
  const attachmentId = Number(attId);
  if (!Number.isInteger(findingId) || !Number.isInteger(attachmentId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const attachment = await prisma.findingAttachment.findUnique({
    where: { id: attachmentId },
    include: { finding: { select: { authorId: true } } },
  });
  if (!attachment || attachment.findingId !== findingId) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (!isAdminRole(auth.user.role) && attachment.finding.authorId !== auth.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Defense in depth: the stored path is server-generated, but never serve outside uploads/.
  const uploadsRoot = path.join(process.cwd(), 'uploads');
  const abs = path.resolve(process.cwd(), attachment.filePath);
  if (abs !== uploadsRoot && !abs.startsWith(uploadsRoot + path.sep)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const buf = await fs.readFile(abs);
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: { 'content-type': 'image/png', 'cache-control': 'private, max-age=300' },
    });
  } catch {
    return NextResponse.json({ error: 'File missing' }, { status: 404 });
  }
}
