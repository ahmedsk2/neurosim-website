import { cn } from '@/lib/utils';

export type EvidenceGrade = 'A' | 'B' | 'C' | 'expert' | 'sparse';

const cfg: Record<EvidenceGrade, { color: string; label: string; tooltip: string }> = {
  A: {
    color: 'bg-status-good text-white',
    label: 'A',
    tooltip: 'Multiple RCTs or high-quality systematic reviews in pediatrics',
  },
  B: {
    color: 'bg-brand-teal text-surface-darker',
    label: 'B',
    tooltip:
      'Single RCT, large prospective cohorts, or strong adult evidence with pediatric replication',
  },
  C: {
    color: 'bg-brand-amber text-surface-darker',
    label: 'C',
    tooltip: 'Observational studies, case series',
  },
  expert: {
    color: 'bg-brand-purple text-white',
    label: 'Expert',
    tooltip: 'Consensus statement / expert opinion with limited primary data',
  },
  sparse: {
    color: 'bg-status-danger text-white',
    label: 'Sparse',
    tooltip: 'Pediatric data essentially absent, extrapolated from adult literature',
  },
};

export type EvidenceLevelProps = {
  grade: EvidenceGrade;
  className?: string;
};

export function EvidenceLevel({ grade, className }: EvidenceLevelProps) {
  const c = cfg[grade];
  return (
    <span
      title={c.tooltip}
      aria-label={`Evidence grade ${c.label}: ${c.tooltip}`}
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]',
        c.color,
        className,
      )}
    >
      {c.label}
    </span>
  );
}
