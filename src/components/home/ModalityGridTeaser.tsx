'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { MODALITIES } from '@/data/modalities';
import type { ModalityMeta } from '@/data/modalities';
import { Thumbnail } from '@/components/ui';
import { thumbForModality } from '@/lib/thumbnails';

type DomainKey = 'Pressure' | 'Flow' | 'Oxygen' | 'Metabolism' | 'Electrical' | 'Bedside';

const DOMAIN_COLOR: Record<DomainKey, string> = {
  Pressure: '#F59E0B',
  Flow: '#FBBF24',
  Oxygen: '#14B8A6',
  Metabolism: '#A78BFA',
  Electrical: '#8B5CF6',
  Bedside: '#94A3B8',
};

const DOMAIN_LABEL: Record<DomainKey, string> = {
  Pressure: 'Pressure',
  Flow: 'Flow',
  Oxygen: 'Oxygen',
  Metabolism: 'Metabolism',
  Electrical: 'Electrical',
  Bedside: 'Bedside',
};

// Map the modality `type` label to a domain bucket for the grid filter.
function domainOf(m: ModalityMeta): DomainKey {
  const t = m.labels?.type;
  switch (t) {
    case 'pressure':
      return 'Pressure';
    case 'flow':
      return 'Flow';
    case 'oxygenation':
      return 'Oxygen';
    case 'metabolic':
      return 'Metabolism';
    case 'electrical':
      return 'Electrical';
    case 'reactivity':
      return 'Pressure';
    case 'adjunct':
      return 'Bedside';
    case 'clinical':
      return 'Bedside';
    default:
      return 'Bedside';
  }
}

const INVASIVENESS_OPTIONS: ('non-invasive' | 'invasive')[] = ['non-invasive', 'invasive'];
const EVIDENCE_OPTIONS = ['A', 'B', 'C', 'expert', 'sparse'] as const;

const EVIDENCE_COLOR: Record<string, string> = {
  A: '#10B981',
  B: '#14B8A6',
  C: '#F59E0B',
  expert: '#8B5CF6',
  sparse: '#64748B',
};

type Filter = {
  domain: DomainKey | null;
  invasiveness: 'non-invasive' | 'invasive' | null;
  evidence: string | null;
};

export function ModalityGridTeaser() {
  const [filter, setFilter] = useState<Filter>({
    domain: null,
    invasiveness: null,
    evidence: null,
  });

  const filtered = useMemo(
    () =>
      MODALITIES.filter((m) => {
        if (!m.labels) return false;
        if (filter.domain && domainOf(m) !== filter.domain) return false;
        const inv = m.labels.invasiveness === 'invasive' ? 'invasive' : 'non-invasive';
        if (filter.invasiveness && inv !== filter.invasiveness) return false;
        if (filter.evidence && m.evidenceGrade !== filter.evidence) return false;
        return true;
      }),
    [filter],
  );

  const toggle = <K extends keyof Filter>(k: K, v: Filter[K]) =>
    setFilter((f) => ({ ...f, [k]: f[k] === v ? null : v }) as Filter);

  return (
    <section aria-labelledby="modality-grid-title" className="py-12 md:py-16">
      <div className="mb-8 max-w-2xl">
        <p className="eyebrow mb-2 text-brand-tealLight">The catalog</p>
        <h2
          id="modality-grid-title"
          className="m-0 mb-4 text-[26px] md:text-[34px] font-bold leading-tight"
        >
          24 modalities, each with a widget.
        </h2>
        <p className="m-0 text-[15px] md:text-[16px] text-ink/85 leading-[1.6]">
          Every modality page follows the same template: bedside view, anatomy, the numbers
          explained, interactive widget, pattern library, decision flowchart, age-banded pediatric
          norms, and an evidence summary.
        </p>
      </div>

      <FilterRow
        label="Domain"
        options={Object.keys(DOMAIN_LABEL) as DomainKey[]}
        renderLabel={(o) => DOMAIN_LABEL[o]}
        active={filter.domain}
        onToggle={(v) => toggle('domain', v)}
      />
      <FilterRow
        label="Invasiveness"
        options={INVASIVENESS_OPTIONS}
        renderLabel={(o) => o}
        active={filter.invasiveness}
        onToggle={(v) => toggle('invasiveness', v)}
      />
      <FilterRow
        label="Evidence"
        options={EVIDENCE_OPTIONS as readonly string[]}
        renderLabel={(o) => `Grade ${o}`}
        active={filter.evidence}
        onToggle={(v) => toggle('evidence', v)}
      />

      <p className="mb-4 mt-2 text-[11px] text-ink-dim">
        {filtered.length} of {MODALITIES.length} modalities
      </p>

      <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((m) => {
          const thumb = thumbForModality(m);
          const domain = domainOf(m);
          const inv = m.labels?.invasiveness === 'invasive' ? 'invasive' : 'non-invasive';
          return (
            <li key={m.slug}>
              <Link
                href={`/modalities/${m.slug}/`}
                className="group flex h-full flex-col rounded-lg border border-line bg-surface-card p-4 transition-colors hover:border-brand-teal focus:outline-hidden focus:ring-2 focus:ring-brand-teal"
              >
                <div className="flex items-start gap-3">
                  <Thumbnail
                    kind={thumb.kind}
                    tone={thumb.tone}
                    aspect="1/1"
                    className="h-12 w-12 shrink-0"
                  />
                  <h3 className="m-0 text-[14.5px] font-bold text-ink group-hover:text-brand-tealLight">
                    {m.short}
                  </h3>
                </div>
                <p className="m-0 mt-2 grow text-[12.5px] leading-[1.55] text-ink/80">
                  {m.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-1 text-[10px]">
                  <Chip color={DOMAIN_COLOR[domain]}>{domain}</Chip>
                  <Chip color="#94A3B8">{inv}</Chip>
                  {m.evidenceGrade && (
                    <Chip color={EVIDENCE_COLOR[m.evidenceGrade] ?? '#94A3B8'}>
                      Grade {m.evidenceGrade}
                    </Chip>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  renderLabel,
  active,
  onToggle,
}: {
  label: string;
  options: readonly T[];
  renderLabel: (o: T) => string;
  active: T | null;
  onToggle: (v: T) => void;
}) {
  return (
    <div className="mb-2 flex flex-wrap items-center gap-2">
      <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-dim">
        {label}
      </span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onToggle(o)}
          aria-pressed={active === o}
          className={
            'rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors ' +
            (active === o
              ? 'border-brand-teal bg-brand-teal/15 text-brand-tealLight'
              : 'border-line text-ink-dim hover:border-line-strong hover:text-ink')
          }
        >
          {renderLabel(o)}
        </button>
      ))}
    </div>
  );
}

function Chip({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="rounded-full border px-1.5 py-px font-semibold tracking-wide"
      style={{ borderColor: color, color }}
    >
      {children}
    </span>
  );
}
