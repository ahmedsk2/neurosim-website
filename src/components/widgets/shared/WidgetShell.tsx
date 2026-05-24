'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { StatusPill, type StatusVariant } from '@/components/ui';

export interface WidgetShellProps {
  eyebrow?: string;
  title: string;
  status?: { variant: StatusVariant; label: string };
  clock?: string;
  controls?: ReactNode;
  children: ReactNode;
  footnote?: ReactNode;
  className?: string;
}

export function WidgetShell({
  eyebrow,
  title,
  status,
  clock,
  controls,
  children,
  footnote,
  className,
}: WidgetShellProps) {
  return (
    <div
      className={cn(
        'widget-shell my-6 rounded-lg border border-line bg-surface-darker p-3 md:p-4',
        className,
      )}
      data-no-print
    >
      <div className="flex items-center justify-between gap-3 rounded-md border-l-4 border-l-brand-teal bg-surface-card px-4 py-2.5 mb-2.5">
        <div>
          {eyebrow && <div className="eyebrow mb-0.5">{eyebrow}</div>}
          <h3 className="m-0 text-[16px] md:text-[17px] font-bold tracking-tight">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          {clock && (
            <div className="font-mono text-[12px] font-bold text-brand-tealLight">{clock}</div>
          )}
          {status && <StatusPill variant={status.variant}>{status.label}</StatusPill>}
        </div>
      </div>

      {controls && (
        <div className="flex flex-wrap items-center gap-3 md:gap-5 rounded-md bg-surface-card px-3 py-2.5 mb-2.5">
          {controls}
        </div>
      )}

      {children}

      {footnote && (
        <div className="mt-3 text-center text-[10px] italic text-ink-dim">{footnote}</div>
      )}
    </div>
  );
}

export function WidgetGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'grid gap-2.5',
        'grid-cols-1 xl:grid-cols-[1.4fr_1fr]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function WidgetPanel({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-md border border-line bg-surface-card p-3 md:p-4', className)}>
      {title && (
        <div className="mb-1 text-[12px] font-bold uppercase tracking-[0.16em] text-brand-tealLight">
          {title}
        </div>
      )}
      {subtitle && <div className="text-[11px] text-ink-muted mb-2.5">{subtitle}</div>}
      {children}
    </div>
  );
}

export function WidgetTakeaway({ children }: { children: ReactNode }) {
  return (
    <div className="widget-takeaway hidden">
      <strong>Key takeaway:</strong> {children}
    </div>
  );
}
