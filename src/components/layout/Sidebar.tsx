import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface SidebarItem {
  href: string;
  label: string;
  short?: string;
  group?: string;
}

export function Sidebar({
  items,
  currentHref,
  title,
}: {
  items: SidebarItem[];
  currentHref?: string;
  title?: string;
}) {
  const groups = items.reduce<Record<string, SidebarItem[]>>((acc, it) => {
    const k = it.group ?? '_';
    (acc[k] ||= []).push(it);
    return acc;
  }, {});
  const groupKeys = Object.keys(groups);

  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
        {title && (
          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-tealLight mb-3 px-2">
            {title}
          </div>
        )}
        {groupKeys.map((g) => (
          <div key={g} className="mb-4">
            {g !== '_' && (
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-dim mb-1 px-2">
                {g}
              </div>
            )}
            <ul className="space-y-0.5">
              {(groups[g] ?? []).map((it) => {
                const active = currentHref && it.href === currentHref;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={cn(
                        'block rounded-md px-2 py-1 text-[12.5px]',
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
          </div>
        ))}
      </div>
    </aside>
  );
}
