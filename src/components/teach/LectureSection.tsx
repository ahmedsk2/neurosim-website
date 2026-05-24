'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DemoLink {
  href: string;
  label: string;
}

export interface LectureSectionProps {
  index: number;
  startMin: number;
  endMin: number;
  title: string;
  prompt: ReactNode;
  speakerNotes: string;
  liveDemos?: DemoLink[];
  nextLink?: DemoLink;
}

export function LectureSection({
  index,
  startMin,
  endMin,
  title,
  prompt,
  speakerNotes,
  liveDemos,
  nextLink,
}: LectureSectionProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const duration = endMin - startMin;

  return (
    <section className="my-5 rounded-md border border-line bg-surface-deeper p-4 md:p-5">
      <div className="flex flex-wrap items-baseline gap-3 mb-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-brand-tealLight">
          Section {index} · {startMin.toString().padStart(2, '0')}:00 – {endMin.toString().padStart(2, '0')}:00 · {duration} min
        </span>
      </div>
      <h2 className="m-0 mb-2 text-[20px] md:text-[22px] font-bold leading-tight text-ink">
        {title}
      </h2>
      <p className="m-0 mb-3 text-[13.5px] text-ink-muted leading-[1.6]">{prompt}</p>

      <button
        type="button"
        onClick={() => setNotesOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-bold uppercase tracking-wider',
          'text-brand-purple hover:bg-surface-card',
        )}
        data-no-print
      >
        {notesOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        Speaker notes
      </button>

      {notesOpen && (
        <div className="mt-2 rounded border-l-[3px] border-l-brand-purple bg-surface-card p-3 text-[12.5px] leading-[1.65] text-ink whitespace-pre-line">
          {speakerNotes}
        </div>
      )}

      {(liveDemos || nextLink) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-dim">
            Live demo:
          </span>
          {liveDemos?.map((d) => (
            <Link
              key={d.href}
              href={d.href}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 rounded-md border border-line bg-surface-card px-2.5 py-1 text-[12px] font-semibold text-brand-tealLight hover:bg-surface-darker"
            >
              {d.label}
              <ExternalLink className="h-3 w-3" />
            </Link>
          ))}
          {nextLink && (
            <Link
              href={nextLink.href}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1 rounded-md bg-brand-teal px-2.5 py-1 text-[12px] font-bold text-surface-darker hover:bg-brand-tealLight"
            >
              {nextLink.label}
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
