import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" data-no-print className="text-[11px] text-ink-muted mb-4 flex flex-wrap items-center gap-1">
      {items.map((c, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {c.href ? (
            <Link href={c.href} className="hover:text-brand-tealLight underline-offset-2 hover:underline">
              {c.label}
            </Link>
          ) : (
            <span className="text-ink/80">{c.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="h-3 w-3 text-ink-dim" />}
        </span>
      ))}
    </nav>
  );
}
