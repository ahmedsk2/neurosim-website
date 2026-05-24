'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { GLOSSARY, type GlossaryEntry } from '@/data/glossary';
import { cn } from '@/lib/utils';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function firstLetter(term: string): string {
  const ch = term[0]?.toUpperCase() ?? '';
  return /[A-Z]/.test(ch) ? ch : '#';
}

export function GlossaryIndex() {
  const [query, setQuery] = useState('');

  // Sort + index by first letter
  const sorted = useMemo(() => {
    return [...GLOSSARY].sort((a, b) =>
      a.term.toLowerCase().localeCompare(b.term.toLowerCase()),
    );
  }, []);

  // Which letters actually have at least one matching entry
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (g) =>
        g.term.toLowerCase().includes(q) ||
        g.definition.toLowerCase().includes(q) ||
        (g.related ?? []).some((r) => r.toLowerCase().includes(q)),
    );
  }, [sorted, query]);

  const letterIndex = useMemo(() => {
    const map = new Map<string, GlossaryEntry[]>();
    for (const g of filtered) {
      const l = firstLetter(g.term);
      const arr = map.get(l) ?? [];
      arr.push(g);
      map.set(l, arr);
    }
    return map;
  }, [filtered]);

  const activeLetters = useMemo(() => {
    const set = new Set(letterIndex.keys());
    return set;
  }, [letterIndex]);

  const jumpTo = (letter: string) => {
    const el = document.getElementById(`gloss-letter-${letter}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Search input */}
      <label className="relative mb-4 flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-ink-dim" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms, definitions, related…"
          aria-label="Search the glossary"
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

      {/* A-Z jump bar, sticky under the SectionNav/Header stack so the
          reader can leap to any letter without scrolling. Disabled letters
          (no matching entries) are dimmed and non-interactive. */}
      <nav
        aria-label="Jump to letter"
        className="sticky top-[64px] z-10 -mx-4 mb-4 border-b border-line bg-surface-darker/85 px-4 py-2 backdrop-blur-md md:-mx-6 md:px-6"
      >
        <ul className="mx-auto flex max-w-page list-none flex-wrap gap-1 p-0">
          {ALPHABET.map((l) => {
            const active = activeLetters.has(l);
            return (
              <li key={l}>
                <button
                  type="button"
                  onClick={() => active && jumpTo(l)}
                  disabled={!active}
                  className={cn(
                    'h-7 w-7 rounded-md text-[11px] font-bold transition-colors',
                    active
                      ? 'bg-surface-card text-ink hover:bg-brand-teal hover:text-surface-darker focus:outline-none focus:ring-2 focus:ring-brand-teal'
                      : 'cursor-not-allowed text-ink-dim/40',
                  )}
                  aria-label={`Jump to ${l}${active ? '' : ', no entries'}`}
                >
                  {l}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <p
        className="mb-4 text-[11px] uppercase tracking-[0.14em] text-ink-muted"
        aria-live="polite"
      >
        Showing {filtered.length} of {GLOSSARY.length} terms
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-md border border-line bg-surface-card p-6 text-center text-[13px] text-ink-muted">
          No terms match{' '}
          <span className="font-mono text-ink">"{query}"</span>.{' '}
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-brand-tealLight underline"
          >
            Clear search
          </button>
          .
        </div>
      ) : (
        <div className="space-y-8">
          {ALPHABET.concat(['#']).map((letter) => {
            const entries = letterIndex.get(letter);
            if (!entries || entries.length === 0) return null;
            return (
              <section key={letter} id={`gloss-letter-${letter}`} className="scroll-mt-24">
                <h2 className="mb-3 text-[14px] font-bold uppercase tracking-[0.16em] text-brand-tealLight">
                  {letter}
                </h2>
                <dl className="grid gap-4 md:grid-cols-2">
                  {entries.map((g) => (
                    <div
                      key={g.term}
                      id={`def-${g.term}`}
                      className="rounded-md border border-line bg-surface-card p-3"
                    >
                      <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-tealLight mb-1">
                        {g.term}
                      </dt>
                      <dd className="m-0 text-[13px] text-ink/90 leading-[1.55]">
                        {g.definition}
                      </dd>
                      {g.related && g.related.length > 0 && (
                        <div className="mt-2 text-[11px] text-ink-dim">
                          See also: {g.related.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
