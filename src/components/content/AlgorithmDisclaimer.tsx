import { AlertTriangle } from 'lucide-react';

export function AlgorithmDisclaimer() {
  return (
    <div className="my-3 flex items-start gap-2 rounded-md border-l-[3px] border-l-status-danger bg-status-danger/10 px-3 py-2">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-dangerText" aria-hidden />
      <div className="text-[12px] leading-[1.55] text-ink">
        <strong className="text-status-dangerText">Educational algorithm, not a clinical protocol.</strong>{' '}
        This walkthrough is a teaching aid. Defer to your unit&apos;s pediatric protocols, current PBTF / Kochanek / local guidelines, and your senior clinical team. Doses, thresholds, and decision points are starting points, not prescriptions.
      </div>
    </div>
  );
}
