import { PageHeader } from '@/components/layout/PageScaffold';
import { Card, Callout } from '@/components/ui';
import { PediatricDoseCalculator } from '@/components/widgets/PediatricDoseCalculator';
import { RaisedICPLadder, NCSEPathway, PostArrestProgPathway } from '@/components/content/illustrations';
import { AlgorithmDisclaimer } from '@/components/content';

export const metadata = {
  title: 'Pediatric MNM bedside quick-card',
  description:
    'Single-page pediatric multimodal neuromonitoring reference, age-band CPP, NIRS, NPi, TCD, ICP norms; HTS / mannitol / sedation doses; raised-ICP escalation; PbtO₂ algorithm.',
  alternates: { canonical: '/quick-card/' },
};

export default function QuickCardPage() {
  return (
    <div className="prose-mnm prose-wide">
      <PageHeader
        eyebrow="Quick-card"
        title="Pediatric MNM bedside reference"
        description="Designed for printing or rapid bedside lookup. Pediatric values are evidence-graded; adult-extrapolated values are flagged."
      />

      <AlgorithmDisclaimer />

      <Callout type="real-world" title="Use case">
        <p className="m-0">
          Print this page double-sided on A4 / letter and laminate. The printed version omits the navigation, theme toggle, and tooltips, see the <strong>Print</strong> button at the top right. The doses below are starting points; always cross-check against your unit&apos;s pediatric formulary.
        </p>
      </Callout>

      <h2>1 · Age-band normative values</h2>

      <Card className="my-3">
        <table className="m-0 w-full text-[12.5px] border-collapse">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left py-2 pr-3 font-bold text-brand-tealLight">Age</th>
              <th className="text-left py-2 pr-3 font-bold text-brand-tealLight">CPP floor</th>
              <th className="text-left py-2 pr-3 font-bold text-brand-tealLight">ICP threshold</th>
              <th className="text-left py-2 pr-3 font-bold text-brand-tealLight">NIRS rSO₂</th>
              <th className="text-left py-2 pr-3 font-bold text-brand-tealLight">TCD MFV</th>
              <th className="text-left py-2 font-bold text-brand-tealLight">NPi</th>
            </tr>
          </thead>
          <tbody className="font-mono text-[12px]">
            <tr className="border-b border-line/50">
              <td className="py-1.5 pr-3">Term newborn</td>
              <td className="py-1.5 pr-3">30–40</td>
              <td className="py-1.5 pr-3">&gt; 10</td>
              <td className="py-1.5 pr-3">65–85%</td>
              <td className="py-1.5 pr-3">~24</td>
              <td className="py-1.5">&gt; 3</td>
            </tr>
            <tr className="border-b border-line/50">
              <td className="py-1.5 pr-3">Infant (1–12 mo)</td>
              <td className="py-1.5 pr-3">40–50</td>
              <td className="py-1.5 pr-3">&gt; 15</td>
              <td className="py-1.5 pr-3">60–80%</td>
              <td className="py-1.5 pr-3">~50–80</td>
              <td className="py-1.5">&gt; 3</td>
            </tr>
            <tr className="border-b border-line/50">
              <td className="py-1.5 pr-3">Toddler (1–3 yr)</td>
              <td className="py-1.5 pr-3">40–50</td>
              <td className="py-1.5 pr-3">&gt; 20</td>
              <td className="py-1.5 pr-3">60–80%</td>
              <td className="py-1.5 pr-3">~80–95</td>
              <td className="py-1.5">&gt; 3</td>
            </tr>
            <tr className="border-b border-line/50">
              <td className="py-1.5 pr-3">School-age (4–11 yr)</td>
              <td className="py-1.5 pr-3">50–60</td>
              <td className="py-1.5 pr-3">&gt; 20</td>
              <td className="py-1.5 pr-3">60–80%</td>
              <td className="py-1.5 pr-3">~85–110</td>
              <td className="py-1.5">&gt; 3</td>
            </tr>
            <tr>
              <td className="py-1.5 pr-3">Adolescent</td>
              <td className="py-1.5 pr-3">60–70</td>
              <td className="py-1.5 pr-3">&gt; 20</td>
              <td className="py-1.5 pr-3">60–80%</td>
              <td className="py-1.5 pr-3">~70</td>
              <td className="py-1.5">&gt; 3</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 mb-0 text-[10px] text-ink-dim">
          Sources: PBTF / Kochanek 2019 · O&apos;Brien 2015 · SafeBoosC 2015 · expert consensus. <strong>Treat as floors, not goals;</strong> individualize with PRx/CPPopt where available.
        </p>
      </Card>

      <h2>2 · Hyperosmolar dosing, interactive</h2>

      <PediatricDoseCalculator />

      <h2 className="mt-6">3 · Raised ICP, escalation ladder</h2>

      <div className="my-3 max-w-none">
        <Card className="p-2">
          <RaisedICPLadder />
        </Card>
      </div>

      <div className="my-3 max-w-none">
        <Card>
          <ol className="m-0 pl-5 text-[13px] leading-[1.7] max-w-none!">
            <li><strong>Tier 0, confirm signal.</strong> Transducer level (foramen of Monro), no damping, clean cardiac waveform. Re-zero. Verify ICP &gt; threshold sustained &gt; 5 min before escalating.</li>
            <li><strong>Tier 1, first-line.</strong> Head-up 30° (neck neutral, no jugular compression), adequate analgesia + sedation, normocapnia (PaCO₂ 35–40 mmHg), normoxia (SpO₂ 94–98%), normothermia (core 36–37 °C, treat fever aggressively), Na⁺ 145–150 mmol/L, glucose 5–10 mmol/L. Drain CSF if EVD in situ.</li>
            <li><strong>Tier 2, hyperosmolar.</strong> <strong>3% NaCl 3–5 mL/kg over 10–20 min</strong> (preferred first-line in most pediatric TBI guidelines) <em>or</em> <strong>mannitol 0.25–1 g/kg over 20–30 min</strong>. Re-dose for ICP &gt; threshold. Ceilings: Na⁺ 155–160 mmol/L (HTS), serum osmolality 320 mOsm/kg or osmolar gap &lt; 20 (mannitol).</li>
            <li><strong>Tier 3, deeper sedation / neuromuscular blockade.</strong> Increase midazolam / fentanyl. Add neuromuscular blockade (rocuronium or vecuronium) if shivering, coughing, or asynchrony are driving ICP, confirm sedation depth first. Avoid prolonged propofol infusion in patients &lt; 16 yr (PRIS risk).</li>
            <li><strong>Tier 4, bridge therapies.</strong> <strong>Targeted mild hypothermia (35–36 °C)</strong> or <strong>brief, targeted hyperventilation (PaCO₂ 30–35 mmHg) only as a bridge to definitive therapy</strong>. Avoid prophylactic deep hyperventilation (PaCO₂ &lt; 30), risk of ischaemia. Avoid sustained hypothermia &lt; 32 °C; current evidence does not support prophylactic deep hypothermia for outcome.</li>
            <li><strong>Tier 5, last-line.</strong> <strong>Barbiturate coma</strong> (pentobarbital or thiopental, titrated to cEEG burst-suppression, full haemodynamic and infection surveillance) <em>or</em> <strong>decompressive craniectomy</strong> (early surgical decompression in selected patients with refractory ICP). Both require neurosurgical and PICU consensus.</li>
          </ol>
          <p className="mt-3 mb-0 text-[10px] text-ink-dim">
            Adapted from PBTF / Kochanek 2019 pediatric severe-TBI guidelines (3rd edition) and current pediatric NCS / ESPNIC consensus. Defer to your unit&apos;s pathway. Each tier is a 30–60 minute trial: re-evaluate ICP, pupils, NIRS, and clinical exam before escalating.
          </p>
        </Card>
      </div>

      <h2>4 · PbtO₂-targeted CPP escalation (BOOST-style)</h2>

      <Card className="my-3">
        <ol className="m-0 pl-5 text-[13px] leading-[1.7]">
          <li><strong>Confirm signal.</strong> Probe equilibrated &gt; 1 h, not in contusion (CT-confirmed), no CSF wicking on probe.</li>
          <li><strong>Check the easy levers.</strong> PaO₂ &gt; 80, PaCO₂ 35–40, Hgb &gt; 9, normothermia.</li>
          <li><strong>Raise CPP</strong> toward upper end of age-band; titrate noradrenaline. Re-check PbtO₂ in 30 min.</li>
          <li><strong>Raise FiO₂</strong> to 60% if PbtO₂ still &lt; 20 mmHg.</li>
          <li><strong>Transfuse</strong> to Hgb 9–10 g/dL.</li>
          <li><strong>Reduce CMRO₂</strong>, deepen sedation, target normothermia 36 °C, exclude seizures (cEEG).</li>
          <li><strong>Microdialysis if available</strong>, distinguishes ischaemia (low PbtO₂ + low glucose + high L/P) from mitochondrial dysfunction (normal PbtO₂ + high L/P).</li>
        </ol>
      </Card>

      <h2>5 · Pupillometry, what the NPi means</h2>

      <Card className="my-3">
        <table className="m-0 w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left py-2 pr-3 font-bold text-brand-tealLight">NPi</th>
              <th className="text-left py-2 font-bold text-brand-tealLight">Interpretation</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line/50">
              <td className="py-1.5 pr-3 font-mono">&gt; 3</td>
              <td className="py-1.5">Brisk reactive, normal range.</td>
            </tr>
            <tr className="border-b border-line/50">
              <td className="py-1.5 pr-3 font-mono">2.5–3</td>
              <td className="py-1.5">Sluggish, sedation, mild encephalopathy, or early herniation. Trend hourly.</td>
            </tr>
            <tr className="border-b border-line/50">
              <td className="py-1.5 pr-3 font-mono">&lt; 2</td>
              <td className="py-1.5">Severely abnormal. Image. Re-examine.</td>
            </tr>
            <tr className="border-b border-line/50">
              <td className="py-1.5 pr-3 font-mono">0</td>
              <td className="py-1.5">Non-reactive. Catastrophic in absence of mydriatic / sedation effect.</td>
            </tr>
            <tr>
              <td className="py-1.5 pr-3 font-mono">L≠R ≥ 0.7</td>
              <td className="py-1.5">Asymmetry. Uncal herniation differential, emergency.</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 mb-0 text-[10px] text-ink-dim">
          BIS &lt; 40 reduces NPi by ~0.8 × ((40 − BIS) / 40). Cooling to 33 °C reduces NPi by ~0.5–0.8.
        </p>
      </Card>

      <h2>6 · Status epilepticus &amp; NCSE, pediatric pathway</h2>

      <p className="text-[12.5px] text-ink-muted mb-2">
        <strong>SE</strong> = status epilepticus (continuous seizure ≥ 5 min, or recurrent seizures without recovery between).{' '}
        <strong>NCSE</strong> = non-convulsive status epilepticus, electrographic seizure without overt convulsive activity.
      </p>

      <div className="my-3 max-w-none">
        <Card className="p-2">
          <NCSEPathway />
        </Card>
      </div>

      <div className="my-3 max-w-none">
        <Card>
          <p className="m-0 text-[13px] mb-2 max-w-none!"><strong>Suspect NCSE if any of:</strong></p>
          <ul className="m-0 pl-5 text-[13px] max-w-none!">
            <li>Unexplained altered consciousness lasting &gt; 30 min.</li>
            <li>Subtle motor signs: face / hand twitching, gaze deviation, nystagmus, automatisms.</li>
            <li>aEEG bandwidth narrowing without explanation.</li>
            <li>Post-convulsive failure to wake within 10–20 min.</li>
            <li>Acute ischaemic / haemorrhagic injury with new neurology.</li>
            <li>Post-arrest, encephalitis / autoimmune encephalopathy, severe TBI.</li>
          </ul>
          <p className="m-0 mt-4 text-[13px] mb-2 max-w-none!"><strong>Pediatric SE pathway (timed from seizure onset):</strong></p>
          <ol className="m-0 pl-5 text-[13px] max-w-none!">
            <li><strong>0–5 min · stabilisation.</strong> Airway, breathing, circulation. IV access. Glucose, electrolytes, ABG. Pulse oximetry, end-tidal CO₂. Time the seizure.</li>
            <li><strong>5–20 min · first-line benzodiazepine.</strong> <strong>Midazolam</strong> 0.2 mg/kg IM (max 10 mg) or 0.1 mg/kg IV (max 4 mg per dose). Alternatives: lorazepam 0.1 mg/kg IV (max 4 mg) or diazepam 0.2–0.5 mg/kg IV/PR. May repeat ×1 if seizure persists at 5 min.</li>
            <li><strong>20–40 min · second-line (established SE).</strong> Choose one and load: <strong>levetiracetam 60 mg/kg IV</strong> (max 4500 mg) over 5–15 min, <strong>fosphenytoin 20 mg PE/kg IV</strong> (max 1500 mg PE) at ≤ 150 mg PE/min with cardiac monitoring, or <strong>valproate 40 mg/kg IV</strong> (max 3000 mg) over 10 min. <em>Avoid valproate in known/suspected mitochondrial disease (POLG).</em> ESETT showed all three roughly equivalent at first second-line attempt.</li>
            <li><strong>&gt; 40 min · refractory SE → continuous infusion.</strong> Intubate. Start <strong>continuous EEG</strong>. <strong>Midazolam infusion</strong> 0.2 mg/kg load then 0.05–0.4 mg/kg/h (preferred first-line continuous in children). Alternatives: <strong>ketamine</strong> 1–2 mg/kg load then 1–10 mg/kg/h (NMDA antagonist; useful when GABAergic resistance), <strong>pentobarbital</strong> 5 mg/kg load then 1–5 mg/kg/h, or <strong>thiopental</strong>. Titrate to <strong>seizure suppression or burst-suppression</strong> on cEEG.</li>
            <li><strong>&gt; 24 h refractory or recurrent on weaning · super-refractory SE.</strong> Repeat workup for cause: encephalitis (HSV PCR, autoimmune panel, NMDAR, LGI1, GAD), CNS infection, metabolic, structural (MRI). Add adjuncts: <strong>pyridoxine</strong> trial in young children, <strong>methylprednisolone + IVIG</strong> if autoimmune suspected, <strong>ketogenic diet</strong> (1/3 response in super-refractory pediatric SE), <strong>plasma exchange</strong>, <strong>therapeutic hypothermia 33–34 °C</strong> (research-grade), <strong>inhalational anaesthetic</strong> (last-line, requires ICU-OR setup).</li>
            <li><strong>Wean criteria.</strong> 24 h of seizure freedom on cEEG before reducing infusion. Wean adjuncts first (ketamine), then primary infusion (midazolam) over 12–24 h with cEEG vigilance for breakthrough.</li>
          </ol>
          <p className="m-0 mt-4 text-[13px] mb-2 max-w-none!"><strong>Critical points:</strong></p>
          <ul className="m-0 pl-5 text-[12.5px] max-w-none!">
            <li><strong>aEEG cannot diagnose NCSE</strong>, it can flag (envelope narrowing) but full-montage cEEG is the only diagnostic.</li>
            <li><strong>Time-to-cEEG &lt; 60 min</strong> is the pediatric refractoriness target.</li>
            <li><strong>Avoid prolonged propofol infusion in patients &lt; 16 yr</strong>, PRIS risk; midazolam, ketamine, or pentobarbital preferred.</li>
            <li><strong>Continue cEEG 24–48 h after seizure cessation</strong> to detect re-emergence on weaning.</li>
            <li><strong>Up to 50% of children with controlled motor activity</strong> after benzodiazepines have ongoing electrographic seizures, clinical exam alone misses NCSE.</li>
          </ul>
          <p className="mt-3 mb-0 text-[10px] text-ink-dim">
            Adapted from ESETT 2019 (pediatric subgroup), ACNS 2021 critical-care EEG terminology, NCS / Brophy 2012 management consensus, AES 2016 guideline, and current pediatric NCS expert recommendations. Pediatric electrographic seizure prevalence in critically ill / unexplained altered consciousness: 10–46% across cohorts (higher in HIE, post-arrest, and acute encephalitis).
          </p>
        </Card>
      </div>

      <h2>7 · Discordance triage, three-step framework</h2>

      <Card className="my-3">
        <ol className="m-0 pl-5 text-[13px] leading-[1.7]">
          <li><strong>Confirm both signals.</strong> Transducer level / damping / impedance / probe contact. A clean signal disagreeing with a dirty one isn&apos;t a discordance, it&apos;s artifact.</li>
          <li><strong>Think about what each samples.</strong> Most discordances are anatomical: global vs. regional, arterial vs. venous, electrical vs. flow. Knowing what each monitor samples lets you predict what should diverge.</li>
          <li><strong>When physiology and bedside diverge, image.</strong> CT or MR anchors physiology to anatomy.</li>
        </ol>
        <p className="mt-2 mb-0 text-[10px] text-ink-dim">
          See <code>/integration/discordance-triage/</code> for worked examples.
        </p>
      </Card>

      <h2>8 · Post-arrest prognostication, multimodal timeline</h2>

      <Card className="my-3 p-2">
        <PostArrestProgPathway />
      </Card>

      <p className="text-[12px] text-ink-muted">
        Multimodal anchors over time: aEEG / NIRS / pupillometry early, SSEP / BAER at 72 h after sedation washout, MRI at day 4–7. Convergent abnormality across two or more modalities at 72 h is the strongest pediatric prognostic signal.
      </p>

      <h2>9 · "When the kit isn&apos;t there"</h2>

      <Card className="my-3">
        <p className="m-0 text-[13px] mb-2"><strong>Available in most PICUs globally:</strong></p>
        <ul className="m-0 pl-5 text-[13px]">
          <li>Clinical exam, GCS / FOUR / pediatric scales.</li>
          <li>Bedside pupillometer (or a torch and a ruler, note manual pupil size + reactivity).</li>
          <li>Intermittent or fixed TCD; ONSD with a linear probe.</li>
          <li>Bilateral NIRS (most modern PICU monitors integrate).</li>
          <li>Bedside aEEG / reduced-montage EEG.</li>
          <li>Fontanelle US in infants.</li>
        </ul>
        <p className="m-0 mt-3 text-[13px] mb-2"><strong>Often only at tertiary centres:</strong></p>
        <ul className="m-0 pl-5 text-[13px]">
          <li>Continuous full-montage cEEG with neurophysiology cover.</li>
          <li>Invasive ICP / PRx / CPPopt with ICM+.</li>
          <li>PbtO₂ probes, microdialysis, brain thermistor.</li>
          <li>DC-coupled ECoG strips, two-depth TCD, Hemedex CBF.</li>
        </ul>
        <p className="mt-2 mb-0 text-[10px] text-ink-dim">
          The mental model holds at every level. Use what you have; reason about what each tool samples; do not skip the convergence step.
        </p>
      </Card>
    </div>
  );
}
