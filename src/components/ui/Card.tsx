import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padded?: boolean;
  /** Disable the lift-on-hover effect (e.g., for non-interactive content cards). */
  noLift?: boolean;
};

/**
 * Card surface used everywhere on the site. Includes a subtle lift + shadow
 * on hover that triggers when the card is inside any element with `.group`
 * (i.e., when used inside a `<Link className="group">` wrapper). The lift is
 * suppressed for users with `prefers-reduced-motion`.
 */
export function Card({ children, className, padded = true, noLift = false, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        'rounded-lg border bg-surface-card border-line',
        padded && 'p-4 md:p-5',
        !noLift && [
          'transition-[transform, box-shadow, border-color] duration-200 ease-out',
          'group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_20px_-10px_rgba(20,184,166,0.45)]',
          'motion-reduce:transform-none motion-reduce:group-hover:transform-none',
        ],
        className,
      )}
    >
      {children}
    </div>
  );
}
