'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const TooltipProvider = TooltipPrimitive.Provider;

export type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
};

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={150}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            className={cn(
              'z-50 max-w-xs rounded-md border border-line bg-surface-card px-3 py-2 text-[12px] text-ink shadow-lg',
              className,
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-surface-card" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
