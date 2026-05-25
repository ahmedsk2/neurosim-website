'use client';

import { type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Lightbulb,
  AlertTriangle,
  Sparkles,
  Baby,
  Activity,
  Coffee,
  GraduationCap,
  BookOpen,
  ChevronDown,
} from 'lucide-react';

export type CalloutType =
  | 'tutorial'
  | 'caveat'
  | 'clinical-pearl'
  | 'pediatric-note'
  | 'controversy'
  | 'real-world'
  | 'teaching'
  | 'reference';

const cfg: Record<
  CalloutType,
  { border: string; icon: typeof Lightbulb; label: string; iconColor: string }
> = {
  tutorial: {
    border: 'border-l-brand-purple',
    icon: Lightbulb,
    label: 'Tutorial',
    iconColor: 'text-brand-purple',
  },
  caveat: {
    border: 'border-l-brand-amber',
    icon: AlertTriangle,
    label: 'Caveat',
    iconColor: 'text-brand-amber',
  },
  'clinical-pearl': {
    border: 'border-l-status-good',
    icon: Sparkles,
    label: 'Clinical pearl',
    iconColor: 'text-status-good',
  },
  'pediatric-note': {
    border: 'border-l-brand-blue',
    icon: Baby,
    label: 'In children',
    iconColor: 'text-brand-blue',
  },
  controversy: {
    border: 'border-l-status-danger',
    icon: Activity,
    label: 'Controversy',
    iconColor: 'text-status-dangerText',
  },
  'real-world': {
    border: 'border-l-brand-amber',
    icon: Coffee,
    label: 'Real world',
    iconColor: 'text-brand-amber',
  },
  teaching: {
    border: 'border-l-brand-purple',
    icon: GraduationCap,
    label: 'Speaker note',
    iconColor: 'text-brand-purple',
  },
  reference: {
    border: 'border-l-brand-teal',
    icon: BookOpen,
    label: 'Acronyms & reference',
    iconColor: 'text-brand-teal',
  },
};

export type CalloutProps = {
  type: CalloutType;
  children: ReactNode;
  title?: string;
  className?: string;
  /**
   * Force collapsed/expanded behaviour. By default, `type="reference"` callouts
   * (which are used site-wide for the heavy "Acronyms on this page" block)
   * collapse with a click-to-expand affordance. Other types render expanded.
   */
  collapsible?: boolean;
  defaultOpen?: boolean;
};

export function Callout({
  type,
  children,
  title,
  className,
  collapsible,
  defaultOpen,
}: CalloutProps) {
  const c = cfg[type];
  const Icon = c.icon;
  // Reference callouts default to collapsible (acronym table). Authors can
  // override with collapsible={false} or force-open with defaultOpen.
  const isCollapsible = collapsible ?? type === 'reference';
  const [open, setOpen] = useState(defaultOpen ?? !isCollapsible);

  if (!isCollapsible) {
    return (
      <div
        className={cn(
          'my-3 rounded-md border-l-[3px] bg-surface-deeper p-3 md:p-4',
          c.border,
          className,
        )}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Icon className={cn('h-4 w-4', c.iconColor)} aria-hidden />
          <span
            className={cn(
              'text-[10px] font-bold uppercase tracking-[0.16em]',
              c.iconColor,
            )}
          >
            {title ?? c.label}
          </span>
        </div>
        <div className="text-[13px] text-ink leading-[1.55]">{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'my-3 rounded-md border-l-[3px] bg-surface-deeper',
        c.border,
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2.5 md:px-4 text-left hover:bg-surface-card/40 focus:outline-hidden focus:ring-2 focus:ring-brand-teal rounded-md"
      >
        <Icon className={cn('h-4 w-4 shrink-0', c.iconColor)} aria-hidden />
        <span
          className={cn(
            'text-[10px] font-bold uppercase tracking-[0.16em]',
            c.iconColor,
          )}
        >
          {title ?? c.label}
        </span>
        <span className="ml-auto text-[10px] text-ink-dim">
          {open ? 'Hide' : 'Show'}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-ink-dim transition-transform duration-200',
            open ? 'rotate-180' : '',
          )}
          aria-hidden
        />
      </button>
      {open && (
        <div className="px-3 pb-3 md:px-4 md:pb-4 text-[13px] text-ink leading-[1.55]">
          {children}
        </div>
      )}
    </div>
  );
}
