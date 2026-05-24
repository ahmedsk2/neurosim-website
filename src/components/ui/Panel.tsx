import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type PanelAccent = 'teal' | 'amber' | 'red' | 'purple' | 'green' | 'blue';

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  accent?: PanelAccent;
  title?: string;
  subtitle?: string;
};

const accentBorder: Record<PanelAccent, string> = {
  teal: 'border-l-brand-teal',
  amber: 'border-l-brand-amber',
  red: 'border-l-status-danger',
  purple: 'border-l-brand-purple',
  green: 'border-l-status-good',
  blue: 'border-l-brand-blue',
};

export function Panel({
  children,
  className,
  accent = 'teal',
  title,
  subtitle,
  ...props
}: PanelProps) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-lg border border-line bg-surface-card p-4 md:p-5',
        'border-l-4',
        accentBorder[accent],
        className,
      )}
    >
      {title && (
        <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-tealLight m-0 mb-1">
          {title}
        </h2>
      )}
      {subtitle && <div className="text-[11px] text-ink-muted mb-2.5">{subtitle}</div>}
      {children}
    </div>
  );
}
