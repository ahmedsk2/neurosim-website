import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PrevNextItem {
  href: string;
  label: string;
  /** Short eyebrow above the label (e.g., "Foundation · Chapter 3"). */
  eyebrow?: string;
}

interface PrevNextNavProps {
  prev?: PrevNextItem | null;
  next?: PrevNextItem | null;
}

/**
 * Two-button row at the bottom of a content page. Clicking either side
 * navigates to the adjacent slug in its index sequence. Render at the end of
 * the page body (after the references list).
 */
export function PrevNextNav({ prev, next }: PrevNextNavProps) {
  if (!prev && !next) return null;
  return (
    <nav
      aria-label="Page navigation"
      className="mt-10 grid gap-3 border-t border-line pt-6 md:grid-cols-2"
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-3 rounded-md border border-line bg-surface-card p-4 transition-colors hover:border-brand-teal focus:outline-hidden focus:ring-2 focus:ring-brand-teal"
        >
          <ArrowLeft className="h-5 w-5 shrink-0 text-brand-tealLight transition-transform group-hover:-translate-x-0.5" />
          <div className="min-w-0">
            {prev.eyebrow && (
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-dim">
                Previous · {prev.eyebrow}
              </div>
            )}
            {!prev.eyebrow && (
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-dim">
                Previous
              </div>
            )}
            <div className="mt-0.5 truncate text-[13.5px] font-bold text-ink group-hover:text-brand-tealLight">
              {prev.label}
            </div>
          </div>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex items-center gap-3 rounded-md border border-line bg-surface-card p-4 text-right transition-colors hover:border-brand-teal focus:outline-hidden focus:ring-2 focus:ring-brand-teal md:justify-end"
        >
          <div className="min-w-0 flex-1">
            {next.eyebrow && (
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-dim">
                Next · {next.eyebrow}
              </div>
            )}
            {!next.eyebrow && (
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-dim">
                Next
              </div>
            )}
            <div className="mt-0.5 truncate text-[13.5px] font-bold text-ink group-hover:text-brand-tealLight">
              {next.label}
            </div>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-brand-tealLight transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <span className="hidden md:block" />
      )}
    </nav>
  );
}
