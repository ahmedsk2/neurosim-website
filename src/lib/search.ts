import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { listContent, type ContentKind } from './content';

export interface SearchDoc {
  id: string;
  kind: ContentKind | 'glossary' | 'reference';
  href: string;
  title: string;
  description?: string;
  body: string;
  tags?: string[];
}

export function buildSearchCorpus(): SearchDoc[] {
  const docs: SearchDoc[] = [];
  const kinds: ContentKind[] = ['foundations', 'modalities', 'integration', 'pediatrics'];
  for (const k of kinds) {
    for (const d of listContent(k)) {
      docs.push({
        id: `${k}/${d.slug}`,
        kind: k,
        href: `/${k}/${d.slug}/`,
        title: d.frontmatter.title ?? d.slug,
        description: d.frontmatter.description,
        body: stripMdx(d.body),
        tags: (d.frontmatter.tags as string[] | undefined) ?? [],
      });
    }
  }
  return docs;
}

function stripMdx(s: string): string {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$[^$]+\$/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function writeSearchIndexJSON(): string {
  const docs = buildSearchCorpus();
  const out = path.join(process.cwd(), 'public', 'search-index.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(docs));
  return out;
}
