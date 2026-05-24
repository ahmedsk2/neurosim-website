'use client';

import { cn } from '@/lib/utils';

export type ToggleOption<T extends string> = {
  value: T;
  label: string;
  accent?: 'teal' | 'green' | 'red' | 'purple' | 'amber';
};

export type ToggleRowProps<T extends string> = {
  options: ToggleOption<T>[];
  value: T;
  onChange: (next: T) => void;
  label?: string;
  className?: string;
};

const activeAccent: Record<NonNullable<ToggleOption<string>['accent']>, string> = {
  teal: 'bg-brand-teal text-surface-darker border-brand-teal',
  green: 'bg-status-good text-white border-status-good',
  red: 'bg-status-danger text-white border-status-danger',
  purple: 'bg-brand-purple text-white border-brand-purple',
  amber: 'bg-brand-amber text-white border-brand-amber',
};

export function ToggleRow<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: ToggleRowProps<T>) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted">
          {label}
        </span>
      )}
      <div role="radiogroup" aria-label={label} className="flex gap-1.5 flex-wrap">
        {options.map((opt) => {
          const isActive = opt.value === value;
          const accent = opt.accent ?? 'teal';
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(opt.value)}
              className={cn(
                'rounded-[5px] border px-3.5 py-1.5 text-[12px] font-semibold transition-colors',
                isActive
                  ? activeAccent[accent]
                  : 'border-line bg-transparent text-ink-muted hover:text-brand-tealLight hover:border-brand-teal',
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
