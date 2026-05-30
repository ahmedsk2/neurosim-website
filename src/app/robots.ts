import type { MetadataRoute } from 'next';

// Indexing is welcomed (see docs/DECISIONS.md "Public site indexed by search engines").
// Reviewer routes and all API routes are disallowed: they are not public, sit behind
// Cloudflare Access (reviewer) or require auth (API), and must not appear in search results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/review/', '/api/'],
      },
    ],
    sitemap: 'https://mnm.towardpcc.com/sitemap.xml',
    host: 'https://mnm.towardpcc.com',
  };
}
