import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'demo' | 'ghost';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const base =
  'inline-flex items-center justify-center rounded-[5px] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.04em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-brand-teal text-surface-darker hover:bg-brand-tealLight',
  secondary:
    'bg-transparent text-brand-tealLight border border-brand-tealDark hover:bg-surface-card hover:border-brand-teal',
  demo: 'bg-brand-amber text-surface-darker hover:bg-brand-amberLight animate-demo-pulse hover:animate-none',
  ghost: 'bg-transparent text-ink-muted hover:text-brand-tealLight',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, ...props }, ref) => (
    <button ref={ref} {...props} className={cn(base, variantClass[variant], className)} />
  ),
);
Button.displayName = 'Button';
