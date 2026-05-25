'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { Search, Stethoscope } from 'lucide-react';
import { SYMPTOM_MAP } from '@/data/modalities';
import { MODALITIES } from '@/data/modalities';
import { INTEGRATION_CASES } from '@/data/integration-cases';

interface SearchDoc {
  id: string;
  kind: string;
  href: string;
  title: string;
  description?: string;
  body: string;
  tags?: string[];
}

export default function SearchClient() {
  const [docs, setDocs] = useState<SearchDoc[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetch('/search-index.json')
      .then((r) => (r.ok ? r.json() : []))
      .then((d: SearchDoc[]) => setDocs(d))
      .catch(() => setDocs([]));
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(docs, {
        keys: [
          { name: 'title', weight: 0.5 },
          { name: 'description', weight: 0.3 },
          { name: 'tags', weight: 0.1 },
          { name: 'body', weight: 0.1 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        includeMatches: false,
      }),
    [docs],
  );

  const results = q.trim() === '' ? [] : fuse.search(q.trim()).slice(0, 30);

  const [activeSymptom, setActiveSymptom] = useState<string | null>(null);
  const symptomMatch = activeSymptom
    ? SYMPTOM_MAP.find((s) => s.symptom === activeSymptom) ?? null
    : null;

  return (
    <div>
      <label className="flex items-center gap-2 rounded-md border border-line bg-surface-card px-3 py-2.5">
        <Search className="h-4 w-4 text-ink-muted" />
        <input
          type="search"
          autoFocus
          placeholder="Search modalities, foundations, scenarios…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-ink-dim outline-hidden"
        />
      </label>

      {!q && (
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-tealLight">
            <Stethoscope className="h-3.5 w-3.5" />
            Or search by symptom / scenario
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SYMPTOM_MAP.map((s) => (
              <button
                key={s.symptom}
                type="button"
                onClick={() => setActiveSymptom(activeSymptom === s.symptom ? null : s.symptom)}
                className={
                  'rounded-full border px-2.5 py-1 text-[11.5px] font-semibold transition-colors ' +
                  (activeSymptom === s.symptom
                    ? 'border-brand-teal bg-brand-teal text-surface-darker'
                    : 'border-line bg-surface-card text-ink-muted hover:border-brand-teal hover:text-brand-tealLight')
                }
              >
                {s.symptom}
              </button>
            ))}
          </div>

          {symptomMatch && (
            <div className="mt-4 rounded-md border border-line bg-surface-deeper p-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-tealLight mb-2">
                Pages relevant to: {symptomMatch.symptom}
              </div>

              {symptomMatch.modalities.length > 0 && (
                <div className="mb-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Modalities</div>
                  <div className="flex flex-wrap gap-1.5">
                    {symptomMatch.modalities.map((slug) => {
                      const m = MODALITIES.find((mm) => mm.slug === slug);
                      if (!m) return null;
                      return (
                        <Link
                          key={slug}
                          href={`/modalities/${slug}/`}
                          className="inline-flex items-center rounded-sm border border-line bg-surface-card px-2 py-0.5 text-[11.5px] font-semibold text-brand-tealLight hover:bg-surface-darker"
                        >
                          {m.short}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {symptomMatch.scenarios.length > 0 && (
                <div className="mb-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Scenarios</div>
                  <div className="flex flex-col gap-1">
                    {symptomMatch.scenarios.map((slug) => {
                      const c = INTEGRATION_CASES.find((cc) => cc.slug === slug);
                      if (!c) return null;
                      return (
                        <Link
                          key={slug}
                          href={`/integration/${slug}/`}
                          className="rounded-sm border border-line bg-surface-card px-2 py-1 text-[12px] font-semibold text-ink hover:border-brand-teal"
                        >
                          {c.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {q && results.length === 0 && (
          <div className="text-[13px] text-ink-muted py-4">No results.</div>
        )}
        {results.map(({ item }) => (
          <Link
            key={item.id}
            href={item.href}
            className="block rounded-md border border-line bg-surface-card p-3 hover:border-brand-teal"
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-tealLight">
              {item.kind}
            </div>
            <div className="text-[14px] font-bold text-ink">{item.title}</div>
            {item.description && (
              <div className="text-[12.5px] text-ink/80 mt-0.5 line-clamp-2">{item.description}</div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
