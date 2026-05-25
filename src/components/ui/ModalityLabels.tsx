import { cn } from '@/lib/utils';
import type { ModalityLabels as ModalityLabelsType } from '@/data/modalities';

export type ModalityLabelsProps = {
  labels: ModalityLabelsType;
  size?: 'sm' | 'md';
  className?: string;
};

type ChipKind = 'type' | 'usage' | 'population' | 'invasiveness' | 'validation';

export const LABEL_AXIS_TITLE: Record<ChipKind, string> = {
  type: 'Modality type',
  usage: 'Usage',
  population: 'Population',
  invasiveness: 'Invasiveness',
  validation: 'Validation',
};

export const labelText: Record<ChipKind, Record<string, string>> = {
  type: {
    clinical: 'Clinical',
    pressure: 'Pressure',
    flow: 'Flow',
    oxygenation: 'Oxygenation',
    electrical: 'Electrical',
    metabolic: 'Metabolic',
    reactivity: 'Reactivity',
    adjunct: 'Adjunct',
  },
  usage: {
    bedside: 'Bedside',
    research: 'Research',
    both: 'Bedside + research',
  },
  population: {
    pediatric: 'Pediatric',
    adult: 'Adult',
    both: 'Peds + adult',
  },
  invasiveness: {
    'non-invasive': 'Non-invasive',
    'minimally-invasive': 'Minimally invasive',
    invasive: 'Invasive',
  },
  validation: {
    validated: 'Validated',
    'validated-adult-only': 'Validated (adult)',
    emerging: 'Emerging',
    investigational: 'Investigational',
  },
};

export const chipClasses: Record<ChipKind, Record<string, string>> = {
  type: {
    clinical: 'border-line bg-surface-deeper text-ink',
    pressure: 'border-brand-blue/40 bg-brand-blue/10 text-brand-blue',
    flow: 'border-brand-teal/40 bg-brand-teal/10 text-brand-tealLight',
    oxygenation: 'border-brand-amber/40 bg-brand-amber/10 text-brand-amber',
    electrical: 'border-brand-purple/40 bg-brand-purple/10 text-brand-purple',
    metabolic: 'border-status-good/40 bg-status-good/10 text-status-good',
    reactivity: 'border-brand-amber/40 bg-brand-amber/10 text-brand-amber',
    adjunct: 'border-line bg-surface-deeper text-ink-dim',
  },
  usage: {
    bedside: 'border-brand-teal/40 bg-brand-teal/10 text-brand-tealLight',
    research: 'border-brand-purple/40 bg-brand-purple/10 text-brand-purple',
    both: 'border-brand-teal/40 bg-brand-teal/10 text-brand-tealLight',
  },
  population: {
    pediatric: 'border-brand-blue/40 bg-brand-blue/10 text-brand-blue',
    adult: 'border-line bg-surface-deeper text-ink-dim',
    both: 'border-brand-blue/40 bg-brand-blue/10 text-brand-blue',
  },
  invasiveness: {
    'non-invasive': 'border-status-good/40 bg-status-good/10 text-status-good',
    'minimally-invasive': 'border-brand-amber/40 bg-brand-amber/10 text-brand-amber',
    invasive: 'border-status-danger/40 bg-status-danger/10 text-status-dangerText',
  },
  validation: {
    validated: 'border-status-good/40 bg-status-good/10 text-status-good',
    'validated-adult-only': 'border-brand-amber/40 bg-brand-amber/10 text-brand-amber',
    emerging: 'border-brand-amber/40 bg-brand-amber/10 text-brand-amber',
    investigational: 'border-status-danger/40 bg-status-danger/10 text-status-dangerText',
  },
};

export const LABEL_AXES: ChipKind[] = ['type', 'usage', 'population', 'invasiveness', 'validation'];
export type LabelAxis = ChipKind;

export function chipClass(kind: ChipKind, value: string): string {
  return chipClasses[kind][value] ?? 'border-line bg-surface-deeper text-ink-dim';
}

export function chipText(kind: ChipKind, value: string): string {
  return labelText[kind][value] ?? value;
}

export function ModalityLabels({ labels, size = 'sm', className }: ModalityLabelsProps) {
  const sizeClass =
    size === 'sm'
      ? 'text-[9px] px-1.5 py-px tracking-[0.08em]'
      : 'text-[10px] px-2 py-0.5 tracking-widest';
  const chip = (kind: ChipKind, value: string) => (
    <span
      key={kind}
      className={cn(
        'inline-flex items-center rounded-full border font-semibold uppercase',
        sizeClass,
        chipClass(kind, value),
      )}
    >
      {chipText(kind, value)}
    </span>
  );
  return (
    <div
      className={cn('flex flex-wrap items-center gap-1', className)}
      aria-label="Modality labels"
    >
      {chip('type', labels.type)}
      {chip('usage', labels.usage)}
      {chip('population', labels.population)}
      {chip('invasiveness', labels.invasiveness)}
      {chip('validation', labels.validation)}
    </div>
  );
}
