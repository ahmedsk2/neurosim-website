import { type ReactNode } from 'react';

/**
 * The Essentials/DeepDive split was removed, the site now shows all
 * content at all times. These wrappers are kept as pass-throughs so
 * existing MDX content using them still renders without modification.
 */

export function Essentials({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function DeepDive({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function Detail({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
