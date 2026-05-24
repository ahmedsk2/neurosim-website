import { type ReactNode } from 'react';
import { Callout } from '@/components/ui';

export const Pearl = ({ children }: { children: ReactNode }) => (
  <Callout type="clinical-pearl">{children}</Callout>
);

export const Pitfall = ({ children }: { children: ReactNode }) => (
  <Callout type="caveat">{children}</Callout>
);

export const Pediatric = ({ children }: { children: ReactNode }) => (
  <Callout type="pediatric-note">{children}</Callout>
);

export const Tutorial = ({ children }: { children: ReactNode }) => (
  <Callout type="tutorial">{children}</Callout>
);

export const Controversy = ({ children }: { children: ReactNode }) => (
  <Callout type="controversy">{children}</Callout>
);

export const RealWorld = ({ children }: { children: ReactNode }) => (
  <Callout type="real-world">{children}</Callout>
);

export const SpeakerNote = ({ children }: { children: ReactNode }) => (
  <Callout type="teaching">{children}</Callout>
);
