#!/usr/bin/env node
/**
 * Generate one OG image per modality / foundation / integration scenario.
 * Output: public/og/<kind>/<slug>.svg
 *
 * SVG works for Twitter, Facebook, Discord, Slack, OpenGraph cards in modern browsers.
 * For platforms that require PNG, use any SVG-to-PNG converter (sharp, resvg-js)
 * as a follow-up build step.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'src', 'content');
const OUT = path.join(ROOT, 'public', 'og');

const KINDS = ['foundations', 'modalities', 'integration'];

const ACCENT = {
  foundations: { c1: '#14B8A6', c2: '#5EEAD4', label: 'FOUNDATION' },
  modalities: { c1: '#0D9488', c2: '#F59E0B', label: 'MODALITY' },
  integration: { c1: '#8B5CF6', c2: '#FCD34D', label: 'INTEGRATION SCENARIO' },
};

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(s, maxChars) {
  const words = s.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

function svgFor(kind, title, description) {
  const a = ACCENT[kind];
  const titleLines = wrapText(escapeXml(title), 28);
  const descLines = wrapText(escapeXml(description ?? ''), 80);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#081224"/>
      <stop offset="100%" stop-color="#152238"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${a.c1}"/>
      <stop offset="100%" stop-color="${a.c2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="14" height="630" fill="url(#accent)"/>

  <g transform="translate(80, 80)">
    <rect width="44" height="44" rx="8" fill="${a.c1}"/>
    <text x="22" y="30" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700" fill="#081224" letter-spacing="2">MNM</text>
  </g>
  <text x="140" y="98" font-family="Segoe UI, sans-serif" font-size="13" font-weight="700" fill="${a.c2}" letter-spacing="3">${a.label}</text>
  <text x="140" y="120" font-family="Segoe UI, sans-serif" font-size="14" font-weight="600" fill="#94A3B8">MNM-Edu · Pediatric Multimodal Neuromonitoring</text>

  ${titleLines
    .map(
      (l, i) =>
        `<text x="80" y="${260 + i * 70}" font-family="Segoe UI, sans-serif" font-size="58" font-weight="700" fill="#FFFFFF" letter-spacing="-1">${l}</text>`,
    )
    .join('\n  ')}

  ${descLines
    .map(
      (l, i) =>
        `<text x="80" y="${480 + i * 26}" font-family="Segoe UI, sans-serif" font-size="20" font-weight="500" fill="#94A3B8">${l}</text>`,
    )
    .join('\n  ')}

  <text x="80" y="600" font-family="Consolas, monospace" font-size="13" fill="#475569">mnm-edu · interactive · evidence-anchored</text>
</svg>
`;
}

async function main() {
  let written = 0;
  for (const kind of KINDS) {
    const dir = path.join(CONTENT, kind);
    let files = [];
    try {
      files = (await fs.readdir(dir)).filter((f) => f.endsWith('.mdx'));
    } catch {
      continue;
    }
    const outDir = path.join(OUT, kind);
    await fs.mkdir(outDir, { recursive: true });
    for (const f of files) {
      const slug = f.replace(/\.mdx$/, '');
      const src = await fs.readFile(path.join(dir, f), 'utf8');
      const { data } = matter(src);
      const svg = svgFor(kind, data.title ?? slug, data.description ?? '');
      await fs.writeFile(path.join(outDir, `${slug}.svg`), svg);
      written++;
    }
  }
  console.log(`Wrote ${written} OG images to public/og/{foundations,modalities,integration}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
