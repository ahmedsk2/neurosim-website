import { REFERENCES, type Reference } from '@/data/references';

/**
 * Per-page citation registry: each `<Cite id="..."/>` registers itself here
 * via the React component, building a numbered list for the bottom of the page.
 *
 * Server-side rendering means a fresh registry per render, that is fine.
 */

const registries = new WeakMap<object, Map<string, number>>();
const registryOrders = new WeakMap<object, string[]>();

export type PageRegistry = object;

export function newPageRegistry(): PageRegistry {
  return {};
}

export function citeNumber(registry: PageRegistry, key: string): number {
  let m = registries.get(registry);
  let order = registryOrders.get(registry);
  if (!m) {
    m = new Map();
    registries.set(registry, m);
  }
  if (!order) {
    order = [];
    registryOrders.set(registry, order);
  }
  const existing = m.get(key);
  if (existing) return existing;
  const n = m.size + 1;
  m.set(key, n);
  order.push(key);
  return n;
}

export function listCitations(registry: PageRegistry): Reference[] {
  const order = registryOrders.get(registry) ?? [];
  return order.map((k) => REFERENCES[k]).filter((r): r is Reference => Boolean(r));
}

export function formatReferenceShort(r: Reference): string {
  const lead = r.authors[0] ?? 'Anon';
  const lastName = lead.split(/\s+/)[0];
  return `${lastName} et al., ${r.year}`;
}

export function formatReferenceFull(r: Reference): string {
  const authors =
    r.authors.length > 6
      ? `${r.authors.slice(0, 3).join(', ')}, et al.`
      : r.authors.join(', ');
  const vol = r.volume ? `;${r.volume}` : '';
  const pages = r.pages ? `:${r.pages}` : '';
  return `${authors}. ${r.title}. ${r.journal} ${r.year}${vol}${pages}.${r.doi ? ` doi:${r.doi}` : ''}`;
}
