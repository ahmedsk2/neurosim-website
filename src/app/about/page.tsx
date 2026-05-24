import { PageHeader } from '@/components/layout/PageScaffold';
import { Card } from '@/components/ui';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="prose-mnm prose-wide">
      <PageHeader
        eyebrow="About"
        title="MNM-Edu"
        description="Background, scope, and acknowledgements for this site."
      />

      <h2>What this is</h2>
      <p>
        An interactive, evidence-anchored educational resource for pediatric multimodal
        neuromonitoring (MNM). Twenty-four modalities are covered, from clinical exam, ICP, PRx,
        and CPPopt through TCD, NIRS, EEG, aEEG, BIS, pupillometry, PbtO₂, microdialysis, SjvO₂,
        ONSD, non-invasive ICP, brain temperature, evoked potentials, direct CBF, and ECoG /
        spreading depolarizations.
      </p>

      <h2>Who it&apos;s for</h2>
      <ul>
        <li>Pediatric ICU fellows and senior trainees during their PICU/NCC rotations.</li>
        <li>Pediatric intensivists refreshing or extending their bedside MNM literacy.</li>
        <li>Pediatric neurology / neurosurgery trainees rotating through the NICU.</li>
        <li>Allied bedside clinicians (PICU nurses, advanced practitioners).</li>
        <li>Adult NCC trainees wanting to understand pediatric-specific physiology.</li>
        <li>Researchers and educators designing MNM curricula.</li>
        <li>Medical students with an interest in neurocritical care.</li>
      </ul>

      <h2>How to read</h2>
      <p>
        Every page is presented in full, bedside view, signal physiology, hands-on widget,
        setup / technique, pitfalls, pediatric specifics, evidence summary, recent literature,
        and references. Use the table of contents on the right to jump between sections.
      </p>

      <h2>Honesty about evidence</h2>
      <p>
        Pediatric MNM evidence is mostly grade C or expert opinion. The{' '}
        <code>EvidenceLevel</code> chip you&apos;ll see throughout makes that visible rather than
        burying it. Where pediatric data are essentially absent, you&apos;ll see a{' '}
        <code>sparse</code> chip and a sentence explaining what we&apos;re extrapolating from.
      </p>

      <h2>Not a clinical device</h2>
      <p>
        This site is a pedagogical resource, not a clinical decision tool. Use it to learn; use
        your bedside judgement and your local protocols to act. Always individualize.
      </p>

      <h2>License</h2>
      <Card className="my-3">
        <p className="m-0 text-[12.5px]">
          Educational content under <strong>CC BY-SA 4.0</strong> unless otherwise noted. Code
          under <strong>MIT</strong>. Image attributions appear inline next to each figure.
        </p>
      </Card>
    </div>
  );
}
