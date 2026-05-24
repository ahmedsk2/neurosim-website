type Catch = { label: string; colorHex: string };
type Row = { injury: string; catches: Catch[] };

const PRESSURE = '#F59E0B';
const OXYGEN = '#14B8A6';
const METABOLISM = '#A78BFA';
const ELECTRICAL = '#8B5CF6';

const rows: Row[] = [
  {
    injury: 'Cerebral ischemia',
    catches: [
      { label: 'ICP / CPP / PRx', colorHex: PRESSURE },
      { label: 'NIRS / PbtO₂', colorHex: OXYGEN },
    ],
  },
  {
    injury: 'Cytotoxic edema',
    catches: [
      { label: 'ICP / RAP', colorHex: PRESSURE },
      { label: 'Pupillometry', colorHex: OXYGEN },
    ],
  },
  {
    injury: 'Non-convulsive seizures',
    catches: [{ label: 'cEEG / qEEG / aEEG', colorHex: ELECTRICAL }],
  },
  {
    injury: 'Autoregulation failure',
    catches: [
      { label: 'PRx / Mx / CPPopt', colorHex: PRESSURE },
      { label: 'ORx', colorHex: OXYGEN },
    ],
  },
  {
    injury: 'Excitotoxicity / metabolic crisis',
    catches: [
      { label: 'Microdialysis', colorHex: METABOLISM },
      { label: 'PbtO₂', colorHex: OXYGEN },
    ],
  },
  {
    injury: 'Spreading depolarizations',
    catches: [{ label: 'ECoG (research)', colorHex: ELECTRICAL }],
  },
];

export function SecondaryInjuryTimeline() {
  return (
    <section
      aria-labelledby="secondary-injury-title"
      className="rounded-lg border border-line bg-surface-card p-6 md:p-10"
    >
      <div className="mb-8 max-w-2xl">
        <p className="eyebrow mb-2 text-brand-amber">Why it matters</p>
        <h2
          id="secondary-injury-title"
          className="m-0 mb-4 text-[26px] md:text-[34px] font-bold leading-tight"
        >
          Secondary injury is the part we can change.
        </h2>
        <p className="m-0 text-[15px] md:text-[16px] text-ink/85 leading-[1.6]">
          Primary injury is over before the patient reaches the PICU. The second wave unfolds across
          the next 24–72 hours: ischemia, edema, seizures, excitotoxicity, spreading depolarization.
          This is the window monitoring opens.
        </p>
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-dim md:grid-cols-[1fr_2fr_1.4fr] md:gap-5">
        <div>t = 0 · Primary injury</div>
        <div>Hours to days · Secondary cascade</div>
        <div>Outcome · Modulated</div>
      </div>

      <div className="grid grid-cols-1 gap-5 rounded-md border border-line bg-surface-deeper p-4 md:grid-cols-[1fr_2fr_1.4fr] md:p-6">
        {/* Column 1,primary insult */}
        <div className="space-y-2 text-[13px]">
          <div className="font-bold text-ink">The initial insult</div>
          <ul className="m-0 list-none space-y-1.5 p-0 text-ink/80">
            <li>· Trauma / contusion</li>
            <li>· Hemorrhage</li>
            <li>· Anoxia / cardiac arrest</li>
            <li>· Ischemic stroke</li>
            <li>· Status epilepticus</li>
            <li>· HIE</li>
          </ul>
        </div>

        {/* Column 2,six rows of injuries + catches */}
        <div className="space-y-2">
          {rows.map((r, i) => (
            <div
              key={i}
              className="flex flex-col gap-1.5 rounded-md border border-line bg-surface-card px-3 py-2 md:flex-row md:items-center md:justify-between md:gap-3"
            >
              <span className="text-[13px] font-bold text-brand-amber">{r.injury}</span>
              <span className="flex flex-wrap gap-1.5">
                {r.catches.map((c, j) => (
                  <span
                    key={j}
                    className="rounded-full border px-2 py-[2px] text-[10px] font-semibold tracking-wide"
                    style={{ borderColor: c.colorHex, color: c.colorHex }}
                  >
                    {c.label}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>

        {/* Column 3,outcomes */}
        <div className="space-y-2 text-[13px]">
          <div className="font-bold text-ink">What changes outcome</div>
          <ul className="m-0 list-none space-y-1.5 p-0 text-ink/80">
            <li>· Time-to-detection</li>
            <li>· Time-to-treatment</li>
            <li>· Individualised targets (CPPopt)</li>
            <li>· Seizure burden reduction</li>
            <li>· Avoiding secondary hits</li>
          </ul>
          <p className="m-0 pt-2 text-[11.5px] italic leading-relaxed text-ink-dim">
            <strong className="font-bold not-italic text-brand-tealLight">KidsBrainIT 2025</strong>{' '}
            shows a dose-response between cumulative ICP &gt; 20 mmHg burden, sub-target CPP, and
            6-month GOS, the field&apos;s clearest evidence that what we monitor and how we
            respond changes outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}
