import { type ReactNode } from 'react';
import { BookOpen } from 'lucide-react';

/**
 * 5-minute TL;DR summary card, pinned at the top of long pages so a fellow
 * reading on the commute can absorb the essentials in <5 minutes.
 * Print-optimized via the existing data-no-print toggle for non-essential UI.
 */
export function TldrCard({ children }: { children: ReactNode }) {
  return (
    <aside
      className="my-4 rounded-md border-l-[3px] border-l-brand-tealLight bg-surface-deeper p-4"
      aria-label="5-minute summary"
    >
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="h-4 w-4 text-brand-tealLight" aria-hidden />
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-tealLight">
          5-minute summary
        </span>
      </div>
      <div className="text-[13px] leading-[1.6] text-ink">{children}</div>
    </aside>
  );
}
