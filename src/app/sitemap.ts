import type { MetadataRoute } from 'next';
import { listContent } from '@/lib/content';

// All public URLs use https://web.towardpcc.com (matching `metadataBase` in src/app/layout.tsx)
// and the trailing-slash form (matching `trailingSlash: true` in next.config.mjs and the
// self-referential canonical tags emitted on each page). Reviewer (/review/*) and API (/api/*)
// routes are deliberately excluded; robots.ts also disallows them.
const ORIGIN = 'https://web.towardpcc.com';

// Public utility / static-content pages. Kept in code (not derived from filesystem) so adding a
// new top-level public page is a one-line, intentional addition rather than an accidental include.
const STATIC_PATHS: string[] = [
  '/',
  '/foundations/',
  '/modalities/',
  '/integration/',
  '/pediatrics/',
  '/glossary/',
  '/evidence/',
  '/search/',
  '/about/',
  '/figure-credits/',
  '/quick-card/',
  '/roadmap/',
  '/teach/fellow-lecture/',
];

function entry(path: string, lastReviewed?: string): MetadataRoute.Sitemap[number] {
  return {
    url: `${ORIGIN}${path}`,
    lastModified: lastReviewed ? new Date(lastReviewed) : new Date(),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Generated from the same content source the rest of the site reads, so the sitemap stays in
  // sync with what is actually rendered. lastReviewed (when present in frontmatter) drives lastmod.
  const dynamic = (['foundations', 'modalities', 'integration'] as const).flatMap((kind) =>
    listContent(kind).map((doc) =>
      entry(`/${kind}/${doc.slug}/`, doc.frontmatter.lastReviewed),
    ),
  );
  const statics = STATIC_PATHS.map((p) => entry(p));
  return [...statics, ...dynamic];
}
