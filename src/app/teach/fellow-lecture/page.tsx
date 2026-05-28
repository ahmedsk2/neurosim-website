import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageScaffold';
import { Card, Callout } from '@/components/ui';
import { LectureTimer } from '@/components/teach/LectureTimer';
import { LectureSection } from '@/components/teach/LectureSection';

export const metadata = {
  title: '45-minute fellow lecture',
  description:
    'Presenter-mode walkthrough, pediatric multimodal neuromonitoring at the bedside, designed to replace slides for a 45-minute teaching session.',
  alternates: { canonical: '/teach/fellow-lecture/' },
};

export default function FellowLecturePage() {
  return (
    <div className="prose-mnm prose-wide">
      <PageHeader
        eyebrow="Teach"
        title="Pediatric MNM in 45 minutes"
        description="A presenter-mode walkthrough designed to replace slides for a 45-minute fellow teaching session. Built around two real cases, four widget demos, and three discussion prompts."
        showPrint={false}
      />

      <Card className="mb-6">
        <h3 className="m-0 text-[14px] font-bold text-brand-tealLight">How to use this page</h3>
        <ul className="m-0 mt-2 text-[12.5px] leading-[1.6]">
          <li>Open this page on the projector. Each section is a timed segment with speaker notes.</li>
          <li>The <strong>green play button</strong> at the right starts a 45-minute countdown, the live timer also flags which segment you should be in.</li>
          <li>The <strong>"Live demo"</strong> links below each section open the relevant widget, fellows can interact during Q&A.</li>
          <li>The <strong>speaker notes</strong> are collapsed by default. Toggle them when you need a memory aid.</li>
        </ul>
      </Card>

      <LectureTimer />

      <LectureSection
        index={1}
        startMin={0}
        endMin={3}
        title="Hook, a real case in 60 seconds"
        prompt="A 12-year-old, day 6 post severe TBI. ICP 24, CPP 58, MAP 82, NIRS 62%/64%, PRx +0.30. Fellow asks: 'Are we treating the right number?'"
        speakerNotes={`Open with the Maya case. State the problem: in 2026 a single bedside has 6+ continuous monitors. The fellow's job is not to track six numbers, it's to know what each one samples and what the convergence pattern means.\n\nThe lecture will: (1) show the conceptual scaffolding, (2) walk two integration cases, (3) give a discordance framework, (4) hand them a quick-card.`}
        nextLink={{ href: '/integration/tcd-vs-icp-vasospasm/', label: 'Maya, full case' }}
      />

      <LectureSection
        index={2}
        startMin={3}
        endMin={9}
        title="Foundation, the 6-minute physiology cram"
        prompt="Three ideas, each in 2 minutes."
        speakerNotes={`Three concepts. Don't go deeper.\n\n1. Monro-Kellie, fixed cranium, three compartments. Compensation mechanisms run out.\n2. Lassen autoregulation, plateau, LLA, ULA. Pediatric plateau is narrower in neonates.\n3. Astrup cascade, flow → function → cell death. EEG slows before cells die.\n\nAvoid maths. Show the figure for each. Tell the fellows: every monitor we discuss next maps onto one of these three ideas.`}
        liveDemos={[
          { href: '/foundations/monro-kellie/', label: 'Monro-Kellie' },
          { href: '/foundations/autoregulation/', label: 'Autoregulation' },
          { href: '/foundations/astrup-cascade/', label: 'Astrup cascade' },
        ]}
      />

      <LectureSection
        index={3}
        startMin={9}
        endMin={20}
        title="The toolkit, what each monitor actually samples"
        prompt="Walk through ICP/PRx → NIRS → TCD → EEG/aEEG → pupillometry. Two minutes each. End with: 'No single number, convergence.'"
        speakerNotes={`The teaching frame: every monitor samples a different anatomical/physiological compartment. Discordance is usually anatomical disagreement, not error.\n\nFor each:\n- ICP: global pressure, requires pulse waveform.\n- PRx: slow-wave correlation, requires intact pulsatility.\n- NIRS: regional, mostly venous, ~1 cm³ under each pad.\n- TCD: arterial flow velocity in single vessel.\n- EEG/aEEG: cortical electrical activity.\n- Pupillometry: brainstem.\n\nLive demo: open the CPPopt widget for 60 s, show the U-curve forming. Don't try to teach the algorithm, just the shape.`}
        liveDemos={[
          { href: '/modalities/icp/', label: 'ICP waveform' },
          { href: '/modalities/prx/', label: 'PRx' },
          { href: '/modalities/nirs/', label: 'NIRS' },
          { href: '/modalities/tcd/', label: 'TCD' },
          { href: '/modalities/cppopt/', label: 'CPPopt, live demo' },
        ]}
      />

      <LectureSection
        index={4}
        startMin={20}
        endMin={30}
        title="Case 1, Maya, 12y, SAH day 6 vasospasm"
        prompt="Walk the multimodal trajectory: TCD MFV up, qEEG ADR down, NIRS asymmetric. Discuss: which monitor would have caught this first if you only had one?"
        speakerNotes={`Goal: show convergence. The team had four signals; each told a different part of the story.\n\nDiscussion prompt: 'If you had to pick one monitor for this case, which one and why?' Most fellows say TCD. Push back: in a sedated post-arrest, qEEG ADR is more sensitive earlier. The right answer is 'I'd want at least two, and they'd have to agree before I escalate.'\n\nClose this segment with the 'no single signal' principle.`}
        liveDemos={[
          { href: '/integration/tcd-vs-icp-vasospasm/', label: 'Maya, full walkthrough' },
        ]}
      />

      <LectureSection
        index={5}
        startMin={30}
        endMin={37}
        title="Case 2, Yusuf, 9y, HTS bolus and a regional NIRS drop"
        prompt="HTS works. ICP falls. Then 2 hours later L NIRS drops. CT shows a contusion. Discussion: what's the lesson about regional vs. global?"
        speakerNotes={`Goal: regional vs. global. NIRS asymmetry was the only signal that flagged the contusion under the L pad. Global metrics (ICP, PRx, CPP) were stable.\n\nTeach the workflow: confirm signal → think about what's sampled → image when in doubt.\n\nIf time-pressed, skip directly from this case to Section 7 (discordance framework) and return to messy reality during Q&A.`}
        liveDemos={[
          { href: '/integration/osmotherapy-icp-nirs/', label: 'Yusuf, full walkthrough' },
        ]}
      />

      <LectureSection
        index={6}
        startMin={37}
        endMin={42}
        title="Pediatric specifics + when the kit isn't there"
        prompt="Age bands matter. Open fontanelles change everything. Many monitors are research-grade in most centres. What do you do at 0300 with one nurse and a TCD probe?"
        speakerNotes={`Three ideas:\n1. Pediatric values are not adult values. Show the quick-card.\n2. Open fontanelles (term to ~18 mo) make ICP measurement and Monro-Kellie assumptions different. Fontanelle US is a real bedside tool.\n3. In most PICUs globally, you have ICP + NIRS + clinical exam + intermittent TCD. Microdialysis, ECoG, Hemedex are research-grade. Teach what you have, not what the textbook shows.\n\nLink to the Resource-limited scenario for fellows to read later.`}
        liveDemos={[
          { href: '/quick-card/', label: 'Bedside quick-card' },
          { href: '/integration/resource-limited-bedside/', label: 'Resource-limited PICU' },
          { href: '/modalities/fontanelle-us/', label: 'Fontanelle US' },
        ]}
      />

      <LectureSection
        index={7}
        startMin={42}
        endMin={45}
        title="Take-homes + Q&A"
        prompt="Three sentences. Then questions."
        speakerNotes={`The three things they should remember:\n\n1. No single monitor is universally trusted. Convergence of two or three independent signals is the floor for action.\n2. Most discordances are anatomical. Knowing what each monitor samples lets you predict what should diverge.\n3. When physiology and bedside picture diverge, image. CT/MR anchors physiology to anatomy.\n\nPoint them at the discordance-triage scenario, the resource-limited scenario, and the quick-card. Tell them: 'Read one scenario per week for ten weeks and you'll have a working multimodal mental model.'`}
        liveDemos={[
          { href: '/integration/discordance-triage/', label: 'Discordance triage' },
          { href: '/integration/', label: 'All 13 scenarios' },
        ]}
      />

      <Callout type="real-world" title="What slides can't do">
        <p className="m-0">
          The reason this lecture is delivered as a website rather than slides: the fellows can interact live with the CPPopt widget, the discordance scenarios, and the dose calculator during Q&A. After the lecture, they have the full reference material in one URL, searchable, citation-anchored, and updated. Slides give a one-shot performance; this gives them a teaching surface they can return to.
        </p>
      </Callout>

      <h2 className="mt-8">Pre-flight checklist (5 minutes before)</h2>
      <ul className="text-[13px]">
        <li>Set the theme to <strong>dark</strong> for projector contrast (toggle in header).</li>
        <li>Open three tabs in advance: <Link href="/integration/tcd-vs-icp-vasospasm/">Maya</Link>, <Link href="/integration/osmotherapy-icp-nirs/">Yusuf</Link>, <Link href="/quick-card/">Quick-card</Link>.</li>
        <li>Test the CPPopt widget, make sure it animates on the projector.</li>
        <li>Confirm internet, most figures are inline SVGs but search uses fetch.</li>
      </ul>

      <h2 className="mt-8">If you have 30 minutes instead of 45</h2>
      <p className="text-[13px]">Drop sections 5 and 6. Run sections 1 (3 min) → 2 (5 min) → 3 (8 min) → 4 (10 min) → 7 (4 min). Hand out the quick-card at the door so fellows can read the omitted material.</p>

      <h2 className="mt-8">If you have 60 minutes</h2>
      <p className="text-[13px]">Add a third case from the integration library. Best choices for fellows: <Link href="/integration/cppopt-targeting/">Liam, CPPopt</Link> (algorithmic), <Link href="/integration/dka-cerebral-edema/">Asher, DKA cerebral oedema</Link> (high-frequency PICU), or <Link href="/integration/refractory-status-epilepticus/">Noah, refractory status</Link> (every PICU sees this).</p>
    </div>
  );
}
