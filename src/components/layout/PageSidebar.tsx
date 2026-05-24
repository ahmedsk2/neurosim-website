import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface SidebarItemLink {
  href: string;
  label: string;
  short?: string;
}

export interface SidebarSection {
  title: string;
  items: SidebarItemLink[];
}

export function PageSidebar({
  currentHref,
  sections,
  className,
}: {
  currentHref?: string;
  sections: SidebarSection[];
  className?: string;
}) {
  return (
    <aside
      className={cn('hidden xl:block w-72 shrink-0', className)}
      aria-label="Related content"
    >
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 space-y-6">
        {sections.map((s) => (
          <section key={s.title}>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-tealLight mb-2 px-2">
              {s.title}
            </div>
            <ul className="space-y-0.5 list-none p-0">
              {s.items.map((it) => {
                const active = currentHref && it.href === currentHref;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={cn(
                        'block rounded-md px-2 py-1.5 text-[12.5px] leading-[1.4]',
                        active
                          ? 'bg-brand-teal text-surface-darker font-bold'
                          : 'text-ink-muted hover:text-brand-tealLight hover:bg-surface-card',
                      )}
                    >
                      {it.short ?? it.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}
