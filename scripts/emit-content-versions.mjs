#!/usr/bin/env node
/**
 * Postbuild: emit a per-content-page version stamp for the future Review Console.
 *
 * Reads the exported static HTML in out/<kind>/<slug>/index.html and writes
 * out/content-versions.json keyed by "<kind>/<slug>". Build-time only; no runtime
 * server. The Console (Phase 3) will consume this to pin a finding to a content
 * version, and to re-locate it by heading text if section renumbering shifts a slug.
 *
 * Per page: the build git short SHA, a sha256 of the rendered article body, the
 * page title, and the section headings (id + clean visible text + level).
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import jsdomPkg from 'jsdom';

const { JSDOM } = jsdomPkg;
const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src', 'content');
const OUT_DIR = path.join(ROOT, 'out');
const KINDS = ['foundations', 'modalities', 'integration'];

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
  // Content lives in the prose article; scope to it so the table-of-contents
  // aside and the site header/footer are excluded.
  const article =
    doc.querySelector('article.prose-mnm') || doc.querySelector('article') || doc.querySelector('main');
  if (!article) return null;
  // Section headings carry stable ids from rehype-slug. textContent is the clean
  // visible text (the autolink wrap adds no visible "#"), section number included.
  const headings = [];
  for (const h of article.querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]')) {
    headings.push({ id: h.getAttribute('id'), text: cleanText(h), level: Number(h.tagName.slice(1)) });
  }
  return {
    title: cleanText(article.querySelector('h1')),
    contentHash: createHash('sha256').update(article.innerHTML).digest('hex').slice(0, 12),
    headings,
  };
}

async function main() {
  const gitSha = gitShortSha();
  const out = {};
  let ok = 0;
  let missing = 0;
  for (const kind of KINDS) {
    for (const slug of await slugsFor(kind)) {
      const file = path.join(OUT_DIR, kind, slug, 'index.html');
      let html;
      try {
        html = await fs.readFile(file, 'utf8');
      } catch {
        console.error(`content-versions: missing exported HTML for ${kind}/${slug}`);
        missing++;
        continue;
      }
      const data = extract(html);
      if (!data) {
        console.error(`content-versions: no <article> found for ${kind}/${slug}`);
        missing++;
        continue;
      }
      out[`${kind}/${slug}`] = {
        kind,
        slug,
        title: data.title,
        gitSha,
        contentHash: data.contentHash,
        headings: data.headings,
      };
      ok++;
    }
  }
  await fs.writeFile(path.join(OUT_DIR, 'content-versions.json'), JSON.stringify(out, null, 2) + '\n');
  console.log(`content-versions: wrote ${ok} page versions to out/content-versions.json (gitSha ${gitSha})`);
  if (missing > 0) {
    console.error(`content-versions: ${missing} page(s) lacked exported HTML; run after "next build".`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
