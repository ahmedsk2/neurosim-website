#!/usr/bin/env node
/**
 * Build-time content-integrity validator for MNM-Edu.
 *
 * Scans src/content/(foundations|modalities|integration) for *.mdx and exits 1
 * on any of:
 *   a) <Cite id="..."> whose id is not a key in src/data/references.ts
 *   b) <Figure src="..."> whose file does not exist under public/
 *   c) <WidgetEmbed name="..."> whose name is not in the WidgetEmbed REGISTRY
 *   d) an internal link ("/...") whose target route does not exist
 *   e) any em-dash (U+2014) anywhere in any .mdx file
 *
 * Read-only: it reads files and reports. It never edits content. It prints the
 * file, line, and offending value per violation, then a per-category summary.
 * Exits 0 only when there are zero violations.
 */
import { promises as fs, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src', 'content');
const PUBLIC_DIR = path.join(ROOT, 'public');
const APP_DIR = path.join(ROOT, 'src', 'app');
const REFERENCES_FILE = path.join(ROOT, 'src', 'data', 'references.ts');
const WIDGET_FILE = path.join(ROOT, 'src', 'components', 'content', 'WidgetEmbed.tsx');

const KINDS = ['foundations', 'modalities', 'integration'];
const EM_DASH = '\\u2014';

async function walkFiles(dir, predicate, acc = []) {
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walkFiles(full, predicate, acc);
    else if (predicate(full)) acc.push(full);
  }
  return acc;
}

/** Citation keys: the `key:` field of each entry in references.ts. */
async function loadReferenceKeys() {
  const src = await fs.readFile(REFERENCES_FILE, 'utf8');
  const keys = new Set();
  const re = /\bkey:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(src)) !== null) keys.add(m[1]);
  return keys;
}

/** Widget names registered in the WidgetEmbed REGISTRY. */
async function loadWidgetNames() {
  const src = await fs.readFile(WIDGET_FILE, 'utf8');
  const names = new Set();
  const re = /(\w+):\s*\(\)\s*=>\s*import\(/g;
  let m;
  while ((m = re.exec(src)) !== null) names.add(m[1]);
  return names;
}

/** Static routes: each src/app dir that has a page file and no dynamic segment. */
async function loadStaticRoutes() {
  const routes = new Set();
  async function walk(dir, segs) {
    let entries = [];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    const hasPage = entries.some(
      (e) => e.isFile() && /^page\.(tsx|ts|jsx|js|mdx)$/.test(e.name),
    );
    if (hasPage) {
      const parts = segs.filter((s) => !(s.startsWith('(') && s.endsWith(')')));
      if (!parts.some((p) => p.includes('['))) {
        routes.add(parts.length ? '/' + parts.join('/') : '/');
      }
    }
    for (const e of entries) {
      if (e.isDirectory()) await walk(path.join(dir, e.name), [...segs, e.name]);
    }
  }
  await walk(APP_DIR, []);
  return routes;
}

/** Reduce a link target to a comparable route, or null if it is not a page route. */
function normalizeRoute(target) {
  let t = String(target).trim();
  if (!t.startsWith('/')) return null; // external, in-page anchor, relative, mailto, etc.
  t = t.split('#')[0].split('?')[0];
  if (t === '') return null;
  if (t.length > 1) t = t.replace(/\/+$/, '');
  if (t === '') t = '/';
  if (/\.[a-z0-9]+$/i.test(t)) return null; // a file (asset), not a page route
  return t;
}

async function main() {
  const [refKeys, widgetNames, staticRoutes] = await Promise.all([
    loadReferenceKeys(),
    loadWidgetNames(),
    loadStaticRoutes(),
  ]);

  const routes = new Set(staticRoutes);
  for (const kind of KINDS) {
    const files = await walkFiles(path.join(CONTENT_DIR, kind), (f) => f.endsWith('.mdx'));
    for (const f of files) routes.add(`/${kind}/${path.basename(f, '.mdx')}`);
  }

  const mdxFiles = (await walkFiles(CONTENT_DIR, (f) => f.endsWith('.mdx'))).sort();
  const violations = [];
  const add = (type, file, line, value, detail) =>
    violations.push({
      type,
      file: path.relative(ROOT, file).replace(/\\/g, '/'),
      line,
      value,
      detail,
    });

  for (const file of mdxFiles) {
    const text = await fs.readFile(file, 'utf8');
    const lines = text.split(/\r?\n/);
    let inFigure = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNo = i + 1;
      let m;

      // (e) em-dash
      if (line.includes(EM_DASH)) {
        add('em-dash', file, lineNo, 'U+2014 col ' + (line.indexOf(EM_DASH) + 1), line.trim().slice(0, 90));
      }

      // (a) Cite id (one or more per line)
      const citeRe = /<Cite\b[^>]*?\bid=["']([^"']+)["']/g;
      while ((m = citeRe.exec(line)) !== null) {
        if (!refKeys.has(m[1])) add('cite', file, lineNo, m[1], 'no such reference key');
      }

      // (c) WidgetEmbed name
      const widgetRe = /<WidgetEmbed\b[^>]*?\bname=["']([^"']+)["']/g;
      while ((m = widgetRe.exec(line)) !== null) {
        if (!widgetNames.has(m[1])) add('widget', file, lineNo, m[1], 'not in WidgetEmbed REGISTRY');
      }

      // (b) Figure src (the opening tag spans multiple lines)
      if (!inFigure && /<Figure\b/.test(line)) inFigure = true;
      if (inFigure) {
        const sm = line.match(/\bsrc=["']([^"']+)["']/);
        if (sm && sm[1].startsWith('/')) {
          if (!existsSync(path.join(PUBLIC_DIR, sm[1]))) {
            add('figure', file, lineNo, sm[1], 'file missing under public/');
          }
        }
        if (line.includes('/>') || line.trim() === '>') inFigure = false;
      }

      // (d) internal links: markdown ](/...) and href="/..."
      const targets = [];
      const mdRe = /\]\(([^)\s]+)/g;
      while ((m = mdRe.exec(line)) !== null) targets.push(m[1]);
      const hrefRe = /\bhref=["']([^"']+)["']/g;
      while ((m = hrefRe.exec(line)) !== null) targets.push(m[1]);
      for (const t of targets) {
        const norm = normalizeRoute(t);
        if (norm && !routes.has(norm)) add('link', file, lineNo, t, 'route not found: ' + norm);
      }
    }
  }

  const types = ['cite', 'figure', 'widget', 'link', 'em-dash'];
  const counts = Object.fromEntries(types.map((t) => [t, 0]));
  for (const v of violations) counts[v.type]++;

  if (violations.length === 0) {
    console.log(
      `content-integrity OK: 0 violations across ${mdxFiles.length} MDX files ` +
        `(${refKeys.size} reference keys, ${widgetNames.size} widgets, ${routes.size} routes).`,
    );
    process.exit(0);
  }

  violations.sort(
    (a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.type.localeCompare(b.type),
  );
  for (const v of violations) {
    console.log(`  [${v.type}] ${v.file}:${v.line}  ${v.value}  (${v.detail})`);
  }
  console.log('');
  console.log(
    `content-integrity FAILED: ${violations.length} violation(s) across ${mdxFiles.length} MDX files`,
  );
  for (const t of types) console.log(`  ${t}: ${counts[t]}`);
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
