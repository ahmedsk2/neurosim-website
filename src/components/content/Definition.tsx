'use client';

import * as Popover from '@radix-ui/react-popover';
import { type ReactNode } from 'react';
import { getDefinition } from '@/data/glossary';

export function Definition({
  term,
  children,
}: {
  term: string;
  children?: ReactNode;
}) {
  const entry = getDefinition(term);
  const display = children ?? term;
  if (!entry) return <span>{display}</span>;
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="cursor-help underline decoration-dotted decoration-brand-tealLight underline-offset-2 hover:decoration-brand-teal"
          aria-label={`Definition: ${term}`}
        >
          {display}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          sideOffset={6}
          className="z-50 max-w-sm rounded-md border border-line bg-surface-card p-3 text-[12.5px] text-ink shadow-lg"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-tealLight mb-1">
            {entry.term}
          </div>
          <div className="leading-[1.5]">{entry.definition}</div>
          <Popover.Arrow className="fill-surface-card" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
