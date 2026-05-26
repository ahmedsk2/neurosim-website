'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

// SessionProvider scoped to /review ONLY. The root layout is intentionally NOT wrapped,
// so public content pages stay SSG and byte-identical (Phase 3c constraint).
export function ReviewProviders({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
