#!/usr/bin/env node
/* Bundle all modality MDX files into a single review document.
 * Run: node scripts/bundle-modalities.mjs
 * Writes: modalities-for-review.md at the repo root.
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MOD_DIR = 'src/content/modalities';
const OUT = 'modalities-for-review.md';

const files = readdirSync(MOD_DIR).filter((f) => f.endsWith('.mdx')).sort();

function parseFrontmatter(rawIn) {
  // Strip UTF-8 BOM if present, normalise line endings.
  const raw = rawIn.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { fm: {}, body: raw };
  const fmText = m[1];
  const body = raw.slice(m[0].length);
  const fm = {};
  for (const line of fmText.split('\n')) {
    const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '').trim();
  }
  return { fm, body };
}

const lines = [];
lines.push('# Pediatric MNM-Edu — Modality Pages: Full Content for Review');
lines.push('');
lines.push(
  '> Bundled content of every modality page for external review. Each section ' +
    'starts with the file path, frontmatter, and full MDX body. Custom ' +
    'components (`<WidgetEmbed/>`, `<Pearl/>`, `<DeepDive/>`, `<Cite/>`, etc.) ' +
    'are pedagogical wrappers — feel free to keep, remove, or relocate them. ' +
    'When returning suggestions, mark them per-section so updates can be ' +
    'reapplied cleanly.'
);
lines.push('');
lines.push('## Table of contents');
lines.push('');
for (const f of files) {
  const raw = readFileSync(join(MOD_DIR, f), 'utf8');
  const { fm } = parseFrontmatter(raw);
  const slug = f.replace(/\.mdx$/, '');
  const title = fm.title || slug;
  lines.push(`- [${title}](#${slug})`);
}
lines.push('');
lines.push('---');
lines.push('');

for (const f of files) {
  const raw = readFileSync(join(MOD_DIR, f), 'utf8');
  const { fm, body } = parseFrontmatter(raw);
  const slug = f.replace(/\.mdx$/, '');
  const title = fm.title || slug;
  lines.push(`## ${title}`);
  lines.push('');
  lines.push(`<a id="${slug}"></a>`);
  lines.push('');
  lines.push(`**File:** \`src/content/modalities/${f}\`  `);
  lines.push(`**Slug:** \`${slug}\`  `);
  if (fm.eyebrow) lines.push(`**Eyebrow:** ${fm.eyebrow}  `);
  if (fm.short) lines.push(`**Short name:** ${fm.short}  `);
  if (fm.domain) lines.push(`**Domain:** ${fm.domain}  `);
  if (fm.evidenceGrade) lines.push(`**Evidence grade:** ${fm.evidenceGrade}  `);
  if (fm.lastReviewed) lines.push(`**Last reviewed:** ${fm.lastReviewed}  `);
  if (fm.description) {
    lines.push('');
    lines.push(`**Description:** ${fm.description}`);
  }
  lines.push('');
  lines.push('### Body');
  lines.push('');
  lines.push(body.trim());
  lines.push('');
  lines.push('---');
  lines.push('');
}

writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`Wrote ${OUT} with ${files.length} modality sections.`);
