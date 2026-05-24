import { cn } from '@/lib/utils';

export type ReadoutStatus = 'good' | 'warn' | 'danger' | 'neutral';

export type ReadoutProps = {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
  status?: ReadoutStatus;
  className?: string;
  hint?: string;
};

const borderColor: Record<ReadoutStatus, string> = {
  good: 'border-l-status-good',
  warn: 'border-l-brand-amber',
  danger: 'border-l-status-danger',
  neutral: 'border-l-brand-teal',
};

const valueColor: Record<ReadoutStatus, string> = {
  good: 'text-status-good',
  warn: 'text-brand-amber',
  danger: 'text-status-dangerText',
  neutral: 'text-ink',
};

export function Readout({
  label,
  value,
  unit,
  status = 'neutral',
  className,
  hint,
}: ReadoutProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-surface-darker p-2.5 md:p-3 border-l-[3px]',
        borderColor[status],
        className,
      )}
    >
      <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted">{label}</div>
      <div className={cn('mt-1 font-mono font-bold text-2xl', valueColor[status])}>
        {value ?? '-'}
      </div>
      {(unit || hint) && (
        <div className="mt-0.5 text-[10px] text-ink-dim">{hint ?? unit}</div>
      )}
    </div>
  );
}
