import { type ReactNode } from 'react';

/**
 * Show children only when the active locale matches `locale`.
 * Uses CSS attribute selectors on `<html lang="...">` to hide otherwise.
 *
 * Use this to add translated prose blocks alongside the canonical English in
 * the same MDX file. Default English content stays outside any <Lang>.
 */
export function Lang({ locale, children }: { locale: 'en' | 'fr' | 'ar'; children: ReactNode }) {
  return <div data-lang-block={locale}>{children}</div>;
}
