#!/usr/bin/env node
/**
 * Render-based content sync (Phase 3b). Replaces the parked out/-scraping emitter
 * (scripts/emit-content-versions.mjs, removed as a postbuild hook in Phase 3a).
 *
 * The source of truth for each page's metadata is the ARTICLE BODY that the app's own
 * next-mdx-remote pipeline rendered at build time, captured in the prerendered HTML at
 * .next/server/app/<kind>/<slug>.html (content routes are SSG since Phase 3a). This
 * keeps the contentHash basis identical to the old emitter and to Step A's proven
 * parity basis: sha256 of the <article class="prose-mnm"> innerHTML, sliced to 12 hex.
 * Heading text uses the N1 fix (strip the rehype-autolink-headings anchor before
 * reading text, so no trailing "#").
 *
 * It UPSERTS Page + Heading into Prisma (pruning headings no longer present) and NEVER
 * touches Finding / FindingComment / FindingAudit / FindingAttachment / Reviewer (the
 * one-way sync boundary). Requires a prior `next build` (the .next/ prerender).
 *
 * Run: npm run sync-content   (after `npm run build`)
 */
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import jsdomPkg from 'jsdom';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const { JSDOM } = jsdomPkg;
const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src', 'content');
const PRERENDER_DIR = path.join(ROOT, '.next', 'server', 'app');
const KINDS = ['foundations', 'modalities', 'integration'];

const dbPath = path.join(ROOT, 'prisma', 'dev.db');
// Same adapter + dev.db the app client (src/lib/prisma.ts) and prisma.config.ts use;
// this is a build-time node script (like generate-og.mjs), so it owns its own instance.
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: `file:${dbPath}` }) });

function gitShortSha() {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim();
  } catch {
    return 'unknown';
  }
}

function cleanText(node) {
  return node ? (node.textContent || '').replace(/\s+/g, ' ').trim() : '';
}

// N1 fix: rehype-autolink-headings (behavior 'append') adds an <a class="heading-anchor">
// with a "#" as the heading's last child. Strip it on a clone before reading text.
function headingText(node) {
  if (!node) return '';
  const clone = node.cloneNode(true);
  for (const a of clone.querySelectorAll('a.heading-anchor')) a.remove();
  return (clone.textContent || '').replace(/\s+/g, ' ').trim();
}

async function slugsFor(kind) {
  try {
    const files = await fs.readdir(path.join(CONTENT_DIR, kind));
    return files
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''))
      .sort();
  } catch {
    return [];
  }
}

function extract(html) {
  const doc = new JSDOM(html).window.document;
  const article =
    doc.querySelector('article.prose-mnm') || doc.querySelector('article') || doc.querySelector('main');
  if (!article) return null;
  const headings = [];
  for (const h of article.querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]')) {
    headings.push({ id: h.getAttribute('id'), text: headingText(h), level: Number(h.tagName.slice(1)) });
  }
  return {
    title: cleanText(article.querySelector('h1')),
    contentHash: createHash('sha256').update(article.innerHTML).digest('hex').slice(0, 12),
    headings,
  };
}

async function main() {
  const gitSha = gitShortSha();
  let pagesSynced = 0;
  let headingsUpserted = 0;
  let headingsPruned = 0;
  let missing = 0;

  for (const kind of KINDS) {
    for (const slug of await slugsFor(kind)) {
      const file = path.join(PRERENDER_DIR, kind, `${slug}.html`);
      let html;
      try {
        html = await fs.readFile(file, 'utf8');
      } catch {
        console.error(`sync-content: missing prerendered HTML for ${kind}/${slug} (run \`npm run build\` first)`);
        missing++;
        continue;
      }
      const data = extract(html);
      if (!data) {
        console.error(`sync-content: no <article> for ${kind}/${slug}`);
        missing++;
        continue;
      }

      const page = await prisma.page.upsert({
        where: { kind_slug: { kind, slug } },
        create: { kind, slug, title: data.title, gitSha, contentHash: data.contentHash },
        update: { title: data.title, gitSha, contentHash: data.contentHash, lastSyncedAt: new Date() },
      });
      pagesSynced++;

      const seen = [];
      for (let i = 0; i < data.headings.length; i++) {
        const h = data.headings[i];
        seen.push(h.id);
        await prisma.heading.upsert({
          where: { pageId_anchorId: { pageId: page.id, anchorId: h.id } },
          create: { pageId: page.id, anchorId: h.id, text: h.text, level: h.level, order: i },
          update: { text: h.text, level: h.level, order: i },
        });
        headingsUpserted++;
      }

      const pruned = await prisma.heading.deleteMany({
        where: { pageId: page.id, anchorId: { notIn: seen } },
      });
      headingsPruned += pruned.count;
    }
  }

  // ---- Phase B: drift reconciliation (console-owned FindingAudit ONLY; never touches
  // Page/Heading or any Finding field). For reviewed findings (resolved/verified/closed)
  // whose page contentHash changed since review, append an idempotent drift_detected
  // audit row (PHASE3_SCHEMA_PROPOSAL.md D.5). No findings yet => no-op.
  const REVIEWED = ['resolved', 'verified', 'closed'];
  let driftEventsWritten = 0;
  const reviewed = await prisma.finding.findMany({
    where: { status: { in: REVIEWED }, reviewedContentHash: { not: null } },
    include: { page: { select: { contentHash: true } } },
  });
  for (const f of reviewed) {
    if (f.reviewedContentHash && f.page.contentHash !== f.reviewedContentHash) {
      const existing = await prisma.findingAudit.findFirst({
        where: { findingId: f.id, action: 'drift_detected', detail: { contains: f.page.contentHash } },
      });
      if (!existing) {
        await prisma.findingAudit.create({
          data: {
            findingId: f.id,
            actorId: null,
            action: 'drift_detected',
            fromStatus: f.status,
            toStatus: f.status,
            detail: JSON.stringify({ reviewedContentHash: f.reviewedContentHash, pageContentHash: f.page.contentHash }),
          },
        });
        driftEventsWritten++;
      }
    }
  }

  const [pages, headings, findings, comments, audits, attachments, reviewers] = await Promise.all([
    prisma.page.count(),
    prisma.heading.count(),
    prisma.finding.count(),
    prisma.findingComment.count(),
    prisma.findingAudit.count(),
    prisma.findingAttachment.count(),
    prisma.reviewer.count(),
  ]);

  console.log(
    JSON.stringify(
      {
        gitSha,
        mirror: { pagesSynced, headingsUpserted, headingsPruned, missing },
        reconciliation: { driftEventsWritten },
        totals: { pages, headings, findings, comments, audits, attachments, reviewers },
      },
      null,
      2,
    ),
  );

  await prisma.$disconnect();
  if (missing > 0) process.exit(1);
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
