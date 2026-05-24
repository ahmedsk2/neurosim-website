'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

export const Tabs = TabsPrimitive.Root;

export const TabsList = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List
    className={cn(
      'inline-flex h-10 items-center gap-1 rounded-md border border-line bg-surface-deeper p-1',
      className,
    )}
    {...props}
  />
);

export const TabsTrigger = ({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    className={cn(
      'inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-[12px] font-semibold text-ink-muted transition-colors',
      'hover:text-brand-tealLight',
      'data-[state=active]:bg-brand-teal data-[state=active]:text-surface-darker',
      className,
    )}
    {...props}
  />
);

export const TabsContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content> & { children: ReactNode }) => (
  <TabsPrimitive.Content className={cn('mt-3', className)} {...props}>
    {children}
  </TabsPrimitive.Content>
);
