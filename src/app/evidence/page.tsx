import { PageHeader } from '@/components/layout/PageScaffold';
import { REFERENCE_LIST, REFERENCES_VERSION } from '@/data/references';
import { EvidenceLibrary } from './EvidenceLibrary';

export const metadata = { title: 'Evidence library' };

export default function EvidencePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Evidence"
        title="The full reference library"
        description={`${REFERENCE_LIST.length} curated references across foundational physiology, consensus statements, pediatric-specific data, and recent literature. Every <Cite> chip across the site links back here.`}
      />
      <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-line bg-surface-card px-3 py-1.5 text-[11px] text-ink-muted">
        Bibliography version{' '}
        <span className="font-mono text-brand-tealLight">{REFERENCES_VERSION}</span>
      </div>
      <EvidenceLibrary />
    </div>
  );
}
