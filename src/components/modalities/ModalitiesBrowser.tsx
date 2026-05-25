'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Card, EvidenceLevel, ModalityLabels, Thumbnail } from '@/components/ui';
import {
  LABEL_AXES,
  LABEL_AXIS_TITLE,
  labelText,
  chipClass,
  chipText,
  type LabelAxis,
} from '@/components/ui/ModalityLabels';
import type { ModalityMeta } from '@/data/modalities';
import { thumbForModality } from '@/lib/thumbnails';
import { cn } from '@/lib/utils';

type InvasivenessGroup = 'clinical' | 'non-invasive' | 'invasive';

// Order in which values appear inside each axis filter chip row.
const AXIS_VALUE_ORDER: Record<LabelAxis, string[]> = {
  type: ['clinical', 'pressure', 'flow', 'oxygenation', 'electrical', 'metabolic', 'reactivity', 'adjunct'],
  usage: ['bedside', 'research', 'both'],
  population: ['pediatric', 'adult', 'both'],
  invasiveness: ['non-invasive', 'minimally-invasive', 'invasive'],
  validation: ['validated', 'validated-adult-only', 'emerging', 'investigational'],
};

const GROUP_ORDER: InvasivenessGroup[] = ['clinical', 'non-invasive', 'invasive'];
const GROUP_LABEL: Record<InvasivenessGroup, string> = {
  clinical: 'Clinical exam',
  'non-invasive': 'Non-invasive monitors',
  invasive: 'Invasive monitors',
};
const GROUP_DESC: Record<InvasivenessGroup, string> = {
  clinical: 'Bedside neurologic assessment, the foundation under every electronic monitor.',
  'non-invasive':
    'Optical, acoustic, electrical, and ultrasound monitors that do not breach the dura or skin.',
  invasive:
    'Bolt-, catheter-, or strip-based monitors that breach the dura, the highest-resolution signals.',
};

function groupOf(m: ModalityMeta): InvasivenessGroup {
  if (m.labels?.type === 'clinical') return 'clinical';
  if (m.labels?.invasiveness === 'invasive' || m.labels?.invasiveness === 'minimally-invasive') {
    return 'invasive';
  }
  return 'non-invasive';
}

type Filters = Record<LabelAxis, Set<string>>;

function emptyFilters(): Filters {
  return {
    type: new Set(),
    usage: new Set(),
    population: new Set(),
    invasiveness: new Set(),
    validation: new Set(),
  };
}

function matches(m: ModalityMeta, filters: Filters): boolean {
  if (!m.labels) return false;
  for (const axis of LABEL_AXES) {
    const sel = filters[axis];
    if (sel.size === 0) continue;
    const value = m.labels[axis];
    // "both" is treated as superset: a modality tagged `both` matches any
    // single-side filter (pediatric, adult, bedside, research),except when
    // the user explicitly picks ONLY "both", in which case strict matching
    // applies.
    if (value === 'both') {
      const onlyBothSelected = sel.size === 1 && sel.has('both');
      if (onlyBothSelected) {
        // strict
        if (!sel.has(value)) return false;
      } else {
        // permissive,`both` covers any side
        continue;
      }
    } else if (!sel.has(value)) {
      return false;
    }
  }
  return true;
}

export function ModalitiesBrowser({ modalities }: { modalities: ModalityMeta[] }) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const toggle = (axis: LabelAxis, value: string) => {
    setFilters((prev) => {
      const next: Filters = {
        type: new Set(prev.type),
        usage: new Set(prev.usage),
        population: new Set(prev.population),
        invasiveness: new Set(prev.invasiveness),
        validation: new Set(prev.validation),
      };
      if (next[axis].has(value)) next[axis].delete(value);
      else next[axis].add(value);
      return next;
    });
  };

  const clearAll = () => setFilters(emptyFilters());
  const activeCount =
    filters.type.size +
    filters.usage.size +
    filters.population.size +
    filters.invasiveness.size +
    filters.validation.size;

  const visible = useMemo(
    () => modalities.filter((m) => matches(m, filters)),
    [modalities, filters],
  );

  const grouped = useMemo(() => {
    const g: Record<InvasivenessGroup, ModalityMeta[]> = {
      clinical: [],
      'non-invasive': [],
      invasive: [],
    };
    for (const m of visible) g[groupOf(m)].push(m);
    for (const k of GROUP_ORDER) g[k].sort((a, b) => a.short.localeCompare(b.short));
    return g;
  }, [visible]);

  return (
    <div>
      {/* Filter panel */}
      <div className="mb-6 rounded-md border border-line bg-surface-card p-3 md:p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-tealLight">
            Filter modalities
          </div>
          <div className="flex items-center gap-2 text-[11px] text-ink-dim">
            <span>
              Showing <strong className="text-ink">{visible.length}</strong> of {modalities.length}
            </span>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="rounded-md border border-line bg-surface-deeper px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-ink hover:border-brand-teal hover:text-brand-tealLight"
              >
                Clear all ({activeCount})
              </button>
            )}
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {LABEL_AXES.map((axis) => (
            <div key={axis}>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-dim">
                {LABEL_AXIS_TITLE[axis]}
              </div>
              <div className="flex flex-wrap gap-1">
                {AXIS_VALUE_ORDER[axis].map((value) => {
                  const isSelected = filters[axis].has(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggle(axis, value)}
                      className={cn(
                        'inline-flex items-center rounded-full border px-2 py-[2px] text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors',
                        isSelected
                          ? chipClass(axis, value)
                          : 'border-line bg-transparent text-ink-dim hover:border-brand-teal/40 hover:text-ink',
                      )}
                      aria-pressed={isSelected}
                    >
                      {chipText(axis, value) ?? labelText[axis][value] ?? value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results, grouped by invasiveness */}
      {visible.length === 0 ? (
        <div className="rounded-md border border-line bg-surface-card p-6 text-center text-[13px] text-ink-dim">
          No modalities match the current filters.{' '}
          <button
            type="button"
            onClick={clearAll}
            className="font-bold text-brand-tealLight underline"
          >
            Clear filters
          </button>{' '}
          to see all of them.
        </div>
      ) : (
        <div className="space-y-8">
          {GROUP_ORDER.filter((g) => grouped[g].length > 0).map((g) => (
            <section key={g}>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-tealLight">
                {GROUP_LABEL[g]}
                <span className="ml-2 text-ink-dim normal-case tracking-normal">
                  {grouped[g].length} modalit{grouped[g].length === 1 ? 'y' : 'ies'}
                </span>
              </div>
              <p className="m-0 mb-3 text-[12px] text-ink-dim leading-normal">{GROUP_DESC[g]}</p>
              <ul className="grid gap-3 list-none p-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {grouped[g].map((m) => {
                  const thumb = thumbForModality(m);
                  return (
                    <li key={m.slug}>
                      <Link href={`/modalities/${m.slug}/`} className="block group">
                        <Card className="h-full transition-colors group-hover:border-brand-teal">
                          <div className="flex items-start gap-3">
                            <Thumbnail
                              kind={thumb.kind}
                              tone={thumb.tone}
                              aspect="1/1"
                              className="h-14 w-14 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="text-[11px] font-mono text-ink-dim">{m.short}</div>
                                {m.evidenceGrade && <EvidenceLevel grade={m.evidenceGrade} />}
                              </div>
                              <h2 className="m-0 mt-1 text-[15.5px] font-bold text-ink group-hover:text-brand-tealLight">
                                {m.title}
                              </h2>
                            </div>
                          </div>
                          <p className="m-0 mt-2 text-[12.5px] text-ink/80 leading-[1.55]">{m.summary}</p>
                          {m.labels && <ModalityLabels labels={m.labels} className="mt-2" />}
                        </Card>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
