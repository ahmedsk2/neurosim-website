'use client';

import { useLocale, t } from '@/lib/i18n';

export function LocaleBanner() {
  const locale = useLocale();
  if (locale === 'en') return null;
  const msg = t('lang.banner', locale);
  if (!msg) return null;
  return (
    <div
      role="note"
      className="mx-auto max-w-page px-4 md:px-6 py-2 text-[12px] text-ink-muted bg-surface-deeper border-b border-line"
    >
      {msg}
    </div>
  );
}
