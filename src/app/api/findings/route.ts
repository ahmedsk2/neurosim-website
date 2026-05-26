import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireReviewer } from '@/lib/auth/apiAuth';
import { FindingSeverity, FindingCategory } from '@/lib/enums';
import { needsReverification } from '@/lib/findings';

export const dynamic = 'force-dynamic';

const CreateBody = z.object({
  kind: z.string(),
  slug: z.string(),
  sectionAnchor: z.string().nullish(),
  quotedText: z.string().nullish(),
  severity: FindingSeverity,
  category: FindingCategory,
  title: z.string().min(1),
  detail: z.string().min(1),
  suggestedFix: z.string().nullish(),
  suggestedCitation: z.string().nullish(),
});

// POST /api/findings - create a finding. The SERVER stamps the version pin from the
// current Page row; the client supplies classification + the anchor selection.
export async function POST(req: Request) {
  const auth = await requireReviewer();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const parsed = CreateBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body', issues: parsed.error.issues }, { status: 400 });
  }
  const b = parsed.data;

  const page = await prisma.page.findUnique({ where: { kind_slug: { kind: b.kind, slug: b.slug } } });
  if (!page) return NextResponse.json({ error: `Unknown page ${b.kind}/${b.slug}` }, { status: 404 });

  let sectionTextSnapshot: string | null = null;
  if (b.sectionAnchor) {
    const heading = await prisma.heading.findUnique({
      where: { pageId_anchorId: { pageId: page.id, anchorId: b.sectionAnchor } },
    });
    sectionTextSnapshot = heading?.text ?? null;
  }

  const finding = await prisma.$transaction(async (tx) => {
    const created = await tx.finding.create({
      data: {
        pageId: page.id,
        sectionAnchor: b.sectionAnchor ?? null,
        sectionTextSnapshot,
        quotedText: b.quotedText ?? null,
        severity: b.severity,
        category: b.category,
        title: b.title,
        detail: b.detail,
        suggestedFix: b.suggestedFix ?? null,
        suggestedCitation: b.suggestedCitation ?? null,
        filedGitSha: page.gitSha,
        filedContentHash: page.contentHash,
        authorId: auth.user.id,
      },
    });
    await tx.findingAudit.create({
      data: { findingId: created.id, actorId: auth.user.id, action: 'created', toStatus: 'open' },
    });
    return created;
  });

  return NextResponse.json({ finding }, { status: 201 });
}

// GET /api/findings - list/filter (kind, slug, status, severity, needsReverify).
export async function GET(req: Request) {
  const auth = await requireReviewer();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const sp = new URL(req.url).searchParams;
  const kind = sp.get('kind') ?? undefined;
  const slug = sp.get('slug') ?? undefined;
  const status = sp.get('status') ?? undefined;
  const severity = sp.get('severity') ?? undefined;
  const needsReverify = sp.get('needsReverify') === 'true';

  const findings = await prisma.finding.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(severity ? { severity } : {}),
      ...(kind || slug ? { page: { ...(kind ? { kind } : {}), ...(slug ? { slug } : {}) } } : {}),
    },
    include: { page: { select: { kind: true, slug: true, title: true, contentHash: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const withFlag = findings.map((f) => ({
    ...f,
    needsReverification: needsReverification(f.status, f.reviewedContentHash, f.page.contentHash),
  }));
  const result = needsReverify ? withFlag.filter((f) => f.needsReverification) : withFlag;
  return NextResponse.json({ findings: result });
}
