'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogContent = ({
  children,
  title,
  className,
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      className={cn(
        'fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-line bg-surface-card p-5 shadow-xl',
        className,
      )}
    >
      {title && (
        <DialogPrimitive.Title className="text-[14px] font-bold text-brand-tealLight tracking-[0.04em] uppercase mb-2">
          {title}
        </DialogPrimitive.Title>
      )}
      <DialogPrimitive.Close
        aria-label="Close"
        className="absolute top-3 right-3 rounded-full p-1.5 text-ink-muted hover:bg-surface-deeper hover:text-ink"
      >
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);
