import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type ContentKind = 'foundations' | 'modalities' | 'integration' | 'pediatrics';

export interface ContentFrontmatter {
  title: string;
  description: string;
  eyebrow?: string;
  prereqs?: string[];
  relatedModalities?: string[];
  relatedFoundations?: string[];
  evidenceGrade?: string;
  lastReviewed?: string;
  domain?: string;
  widget?: string;
  short?: string;
  [key: string]: unknown;
}

export interface ContentDoc {
  slug: string;
  kind: ContentKind;
  frontmatter: ContentFrontmatter;
  body: string;
  citationOrder: string[];
}

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');

function dirFor(kind: ContentKind) {
  return path.join(CONTENT_ROOT, kind);
}

export function listContent(kind: ContentKind): ContentDoc[] {
  const dir = dirFor(kind);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
  return files
    .map((f) => loadContent(kind, f.replace(/\.mdx$/, '')))
    .filter((d): d is ContentDoc => Boolean(d));
}

export function listSlugs(kind: ContentKind): string[] {
  const dir = dirFor(kind);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

function normalizeFrontmatter(data: Record<string, unknown>): ContentFrontmatter {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v instanceof Date) {
      out[k] = v.toISOString().slice(0, 10);
    } else if (Array.isArray(v)) {
      out[k] = v.map((x) => (x instanceof Date ? x.toISOString().slice(0, 10) : x));
    } else {
      out[k] = v;
    }
  }
  return out as ContentFrontmatter;
}

export function loadContent(kind: ContentKind, slug: string): ContentDoc | undefined {
  const file = path.join(dirFor(kind), `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  const citationOrder = extractCitationOrder(content);
  return {
    slug,
    kind,
    frontmatter: normalizeFrontmatter(data),
    body: content,
    citationOrder,
  };
}

const CITE_RE = /<Cite\s+id\s*=\s*["']([a-z0-9_\-]+)["']\s*\/?>/gi;

export function extractCitationOrder(body: string): string[] {
  const seen = new Set<string>();
  const order: string[] = [];
  for (const m of body.matchAll(CITE_RE)) {
    const key = m[1];
    if (!key || seen.has(key)) continue;
    seen.add(key);
    order.push(key);
  }
  return order;
}
