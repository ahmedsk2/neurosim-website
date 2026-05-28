import { PageHeader } from '@/components/layout/PageScaffold';
import { Card, Callout } from '@/components/ui';
import { MODALITIES } from '@/data/modalities';

export const metadata = { title: 'About', alternates: { canonical: '/about/' } };

export default function AboutPage() {
  return (
    <div className="prose-mnm prose-wide">
      <PageHeader
        eyebrow="About"
        title="MNM-Edu"
        description="Author, scope, evidence framing, and how to use this resource."
      />

      <h2>What this is</h2>
      <p>
        An interactive, evidence-anchored educational resource for pediatric multimodal
        neuromonitoring (MNM). {MODALITIES.length} modalities are covered, from clinical exam, ICP, PRx,
        and CPPopt through TCD, NIRS, EEG, aEEG, BIS, pupillometry, PbtO₂, microdialysis, SjvO₂,
        ONSD, non-invasive ICP, brain temperature, evoked potentials, direct CBF, and ECoG /
        spreading depolarizations.
      </p>

      <h2>Author</h2>
      <p>
        This resource is created and maintained by <strong>Ahmed S. Alkhalifah, MD, MBBS</strong>,
        a pediatric intensivist with subspecialty training in neurocritical care.
      </p>

      <h2>An independent personal project</h2>
      <p>
        MNM-Edu is an <strong>independent personal educational project</strong>. It is not
        affiliated with, endorsed by, or representing any hospital, university, professional
        society, or employer. The choices of emphasis, the evidence framings, and the opinions on
        these pages are the author&apos;s alone; readers should not infer institutional endorsement
        from anything on this site.
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

      <h2>Medical disclaimer (please read)</h2>
      <Callout type="caveat" title="Medical disclaimer" className="my-3">
        <p className="m-0 mb-2">
          <strong>This site is an educational resource. It is NOT clinical advice and NOT a
          substitute for clinical judgement, formal training, or local protocols.</strong>
        </p>
        <p className="m-0 mb-2">
          Do not use any content here to drive a direct patient-care decision. Specific monitoring
          thresholds, drug doses, escalation pathways, and physiological interpretations always
          need to be cross-checked against the primary literature and your institution&apos;s
          protocols, and applied to the patient in front of you by the team responsible for that
          patient.
        </p>
        <p className="m-0">
          Nothing here replaces bedside judgement, attending oversight, or institutional clinical
          pathways.
        </p>
      </Callout>

      <h2>Contact</h2>
      <p>
        For corrections, factual disputes, or questions:{' '}
        <a href="mailto:info@towardpcc.com">info@towardpcc.com</a>. I read what arrives and aim to
        respond, but timeliness is not guaranteed; this is a personal project run alongside
        clinical work. Corrections that surface real errors are especially welcome.
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
