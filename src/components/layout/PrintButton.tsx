'use client';

import { Printer } from 'lucide-react';

/**
 * Trigger the browser's print flow. The site shows all content at all times,
 * so the print dialog captures the full page directly.
 */
export function PrintButton() {
  function onClick() {
    if (typeof window === 'undefined') return;
    window.print();
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Print or save as PDF"
      title="Print / Save as PDF"
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-card px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-ink-muted hover:text-brand-tealLight hover:border-brand-teal"
    >
      <Printer className="h-3.5 w-3.5" />
      Print / PDF
    </button>
  );
}
