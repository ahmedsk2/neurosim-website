'use client';

import { createContext, useContext, type ReactNode } from 'react';

export interface CitationRegistry {
  order: string[];
  numberFor(key: string): number;
}

const CitationContext = createContext<CitationRegistry | null>(null);

export function CitationProvider({
  order,
  children,
}: {
  order: string[];
  children: ReactNode;
}) {
  const registry: CitationRegistry = {
    order,
    numberFor(key: string) {
      const idx = order.indexOf(key);
      return idx >= 0 ? idx + 1 : 0;
    },
  };
  return <CitationContext.Provider value={registry}>{children}</CitationContext.Provider>;
}

export function useCitations(): CitationRegistry {
  const ctx = useContext(CitationContext);
  return ctx ?? { order: [], numberFor: () => 0 };
}
