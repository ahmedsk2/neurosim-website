'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import {
  REFERENCE_LIST,
  type ReferenceCategory,
  type EvidenceGrade,
} from '@/data/references';
import { EvidenceLevel } from '@/components/ui';
import { cn } from '@/lib/utils';

const CATEGORY_LABEL: Record<ReferenceCategory, string> = {
  foundational: 'Foundational',
  consensus: 'Consensus statements',
  pediatric: 'Pediatric-specific',
  recent: 'Recent (last 36 months)',
  trial: 'Trials',
  review: 'Reviews',
};

const CATEGORY_ORDER: ReferenceCategory[] = [
  'foundational',
  'consensus',
  'pediatric',
  'recent',
  'trial',
  'review',
];

const GRADE_ORDER: EvidenceGrade[] = ['A', 'B', 'C', 'expert', 'sparse'];

export function EvidenceLibrary() {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<Set<ReferenceCategory>>(new Set());
  const [grades, setGrades] = useState<Set<EvidenceGrade>>(new Set());

  const toggleCategory = (cat: ReferenceCategory) => {
    setCategories((s) => {
      const next = new Set(s);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };
  const toggleGrade = (g: EvidenceGrade) => {
    setGrades((s) => {
      const next = new Set(s);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  };
  const clearFilters = () => {
    setQuery('');
    setCategories(new Set());
    setGrades(new Set());
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return REFERENCE_LIST.filter((r) => {
      if (categories.size > 0 && !categories.has(r.category)) return false;
      if (grades.size > 0 && (!r.evidence_grade || !grades.has(r.evidence_grade)))
        return false;
      if (q) {
        const hay =
          r.key +
          ' ' +
          r.title +
          ' ' +
          r.journal +
          ' ' +
          r.authors.join(' ') +
          ' ' +
          String(r.year);
        if (!hay.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [query, categories, grades]);

  const grouped = useMemo(() => {
    const g: Record<ReferenceCategory, typeof REFERENCE_LIST> = {
      foundational: [],
      consensus: [],
      pediatric: [],
      recent: [],
      trial: [],
      review: [],
    };
    for (const r of filtered) g[r.category].push(r);
    for (const cat of CATEGORY_ORDER) {
      g[cat].sort((a, b) => b.year - a.year);
    }
    return g;
  }, [filtered]);

  const hasFilters = query !== '' || categories.size > 0 || grades.size > 0;
  const totalShown = filtered.length;
  const totalAll = REFERENCE_LIST.length;

  // Per-category counts (against the *unfiltered* dataset) so the chip labels
  // tell the reader how many references each category contains.
  const categoryCounts = useMemo(() => {
    const c: Record<ReferenceCategory, number> = {
      foundational: 0,
      consensus: 0,
      pediatric: 0,
      recent: 0,
      trial: 0,
      review: 0,
    };
    for (const r of REFERENCE_LIST) c[r.category] += 1;
    return c;
  }, []);

  return (
    <div>
      {/* Legend: explains evidence grade chips. Collapsible-feeling row that
          always renders so first-time readers immediately understand chips. */}
      <div className="mb-4 rounded-md border border-line bg-surface-card p-3 md:p-4">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-tealLight">
          Evidence-grade legend
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-ink/85">
          <span className="inline-flex items-center gap-1.5">
            <EvidenceLevel grade="A" />
            <span>Multiple RCTs / strong pediatric systematic reviews</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <EvidenceLevel grade="B" />
            <span>Single RCT or strong adult + pediatric replication</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <EvidenceLevel grade="C" />
            <span>Observational / case series</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <EvidenceLevel grade="expert" />
            <span>Consensus / expert opinion</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <EvidenceLevel grade="sparse" />
            <span>Pediatric data essentially absent</span>
          </span>
        </div>
      </div>

      {/* Search input */}
      <label className="relative mb-3 flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-ink-dim" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, author, key, journal, year…"
          aria-label="Search the reference library"
          className="w-full rounded-md border border-line bg-surface-card px-9 py-2.5 text-[14px] text-ink placeholder:text-ink-dim focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            className="absolute right-3 rounded-full p-1 text-ink-dim hover:bg-surface-deeper hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </label>

      {/* Category filter row */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
          Category
        </span>
        {CATEGORY_ORDER.map((cat) => {
          const active = categories.has(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              aria-pressed={active}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors',
                active
                  ? 'border-brand-teal bg-brand-teal/15 text-brand-tealLight'
                  : 'border-line bg-surface-card text-ink-muted hover:border-brand-teal/60 hover:text-ink',
              )}
            >
              {CATEGORY_LABEL[cat]}
              <span className="text-[10px] text-ink-dim">{categoryCounts[cat]}</span>
            </button>
          );
        })}
      </div>

      {/* Evidence grade filter row */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
          Grade
        </span>
        {GRADE_ORDER.map((g) => {
          const active = grades.has(g);
          return (
            <button
              key={g}
              type="button"
              onClick={() => toggleGrade(g)}
              aria-pressed={active}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors',
                active
                  ? 'border-brand-teal bg-brand-teal/15 text-brand-tealLight'
                  : 'border-line bg-surface-card text-ink-muted hover:border-brand-teal/60 hover:text-ink',
              )}
            >
              <EvidenceLevel grade={g} />
              <span className="ml-0.5">
                {g === 'A'
                  ? 'A'
                  : g === 'B'
                  ? 'B'
                  : g === 'C'
                  ? 'C'
                  : g === 'expert'
                  ? 'Expert'
                  : 'Sparse'}
              </span>
            </button>
          );
        })}
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto inline-flex items-center gap-1 rounded-md border border-line bg-surface-card px-2.5 py-0.5 text-[11px] text-ink-muted hover:border-brand-teal hover:text-brand-tealLight"
          >
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Result count */}
      <p
        className="mb-4 text-[11px] uppercase tracking-[0.14em] text-ink-muted"
        aria-live="polite"
      >
        Showing {totalShown} of {totalAll} references
      </p>

      {/* Results */}
      {totalShown === 0 ? (
        <div className="rounded-md border border-line bg-surface-card p-6 text-center text-[13px] text-ink-muted">
          No references match these filters.{' '}
          <button
            type="button"
            onClick={clearFilters}
            className="text-brand-tealLight underline"
          >
            Clear filters
          </button>
          .
        </div>
      ) : (
        <div className="space-y-10">
          {CATEGORY_ORDER.map((cat) => {
            const list = grouped[cat];
            if (list.length === 0) return null;
            return (
              <section key={cat}>
                <h2
                  className="text-[14px] font-bold uppercase tracking-[0.16em] text-brand-tealLight mb-3"
                  id={`cat-${cat}`}
                >
                  {CATEGORY_LABEL[cat]} ({list.length})
                </h2>
                <ol className="list-decimal list-inside space-y-1.5">
                  {list.map((r) => (
                    <li
                      key={r.key}
                      id={`ref-${r.key}`}
                      className="text-[12.5px] leading-[1.55] text-ink/90 scroll-mt-24"
                    >
                      <span className="font-mono text-[11px] text-ink-dim mr-1">
                        [{r.key}]
                      </span>
                      {r.evidence_grade && (
                        <span className="mr-1.5">
                          <EvidenceLevel grade={r.evidence_grade} />
                        </span>
                      )}
                      {r.authors[0]}
                      {r.authors.length > 1 ? ' et al.' : ''} ({r.year}).{' '}
                      <em>{r.title}</em>. {r.journal}
                      {r.volume ? `;${r.volume}` : ''}
                      {r.pages ? `:${r.pages}` : ''}.{' '}
                      {r.doi && (
                        <a
                          href={`https://doi.org/${r.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-tealLight underline"
                        >
                          doi:{r.doi}
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
