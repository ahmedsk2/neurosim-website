import { cn } from '@/lib/utils';

export type StatusVariant = 'running' | 'paused' | 'demo' | 'good' | 'warn' | 'danger' | 'neutral';

const variantClass: Record<StatusVariant, string> = {
  running: 'bg-status-good text-white',
  paused: 'bg-brand-amber text-white',
  demo: 'bg-brand-purple text-white',
  good: 'bg-status-good text-white',
  warn: 'bg-brand-amber text-white',
  danger: 'bg-status-danger text-white',
  neutral: 'bg-line text-ink-muted',
};

export type StatusPillProps = {
  variant: StatusVariant;
  children: React.ReactNode;
  className?: string;
};

export function StatusPill({ variant, children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]',
        variantClass[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
