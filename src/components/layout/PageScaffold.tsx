import { type ReactNode } from 'react';
import { EvidenceLevel, ModalityLabels } from '@/components/ui';
import type { EvidenceGrade } from '@/data/references';
import type { ModalityLabels as ModalityLabelsType } from '@/data/modalities';
import { PrintButton } from './PrintButton';

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  grade?: EvidenceGrade;
  lastReviewed?: string;
  labels?: ModalityLabelsType;
  /** Optional reading-time label (e.g., "6-min read"). */
  readingTime?: string;
  rightSlot?: ReactNode;
  showPrint?: boolean;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  grade,
  lastReviewed,
  labels,
  readingTime,
  rightSlot,
  showPrint = true,
}: PageHeaderProps) {
  return (
    <header className="mb-6 md:mb-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
          <h1 className="m-0 mb-2 text-[26px] md:text-[32px] font-bold leading-tight tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="m-0 max-w-[70ch] text-[14px] md:text-[15px] text-ink/85 leading-[1.6]">
              {description}
            </p>
          )}
          {labels && <ModalityLabels labels={labels} size="md" className="mt-3" />}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-ink-dim">
            {grade && <EvidenceLevel grade={grade} />}
            {lastReviewed && <span>Last reviewed {lastReviewed}</span>}
            {readingTime && (
              <>
                {(grade || lastReviewed) && <span aria-hidden>·</span>}
                <span>{readingTime}</span>
              </>
            )}
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2" data-no-print>
          {showPrint && <PrintButton />}
          {rightSlot}
        </div>
      </div>
    </header>
  );
}
