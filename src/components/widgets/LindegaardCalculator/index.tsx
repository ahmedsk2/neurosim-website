'use client';

import { useState } from 'react';
import { Readout, Button } from '@/components/ui';
import { WidgetShell, WidgetPanel } from '../shared/WidgetShell';

interface Preset {
  label: string;
  mca: number;
  ica: number;
  desc: string;
}

const PRESETS: Preset[] = [
  { label: 'Hyperemic post-cardiac', mca: 130, ica: 60, desc: 'High velocity, low ratio, flow not vasospasm' },
  { label: 'Mild SAH vasospasm', mca: 150, ica: 40, desc: 'Ratio 3.75,mild' },
  { label: 'Severe SAH vasospasm', mca: 220, ica: 22, desc: 'Ratio 10,severe' },
];

function classify(ratio: number): { label: string; status: 'good' | 'warn' | 'danger' } {
  if (ratio < 3) return { label: 'Hyperemia / normal', status: 'good' };
  if (ratio < 6) return { label: 'Mild vasospasm', status: 'warn' };
  if (ratio < 9) return { label: 'Moderate vasospasm', status: 'warn' };
  return { label: 'Severe vasospasm', status: 'danger' };
}

export default function LindegaardCalculator() {
  const [mca, setMca] = useState(130);
  const [ica, setIca] = useState(60);
  const ratio = ica > 0 ? mca / ica : 0;
  const c = classify(ratio);

  return (
    <WidgetShell
      eyebrow="TCD · Lindegaard ratio"
      title="MCA MFV ÷ extracranial ICA MFV"
      footnote="Lindegaard 1989; Sloan 2004 (AAN)."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="MCA MFV" value={mca} unit="cm/s" />
        <Readout label="extra-cranial ICA MFV" value={ica} unit="cm/s" />
        <Readout label="Lindegaard ratio" value={ratio.toFixed(2)} status={c.status} hint={c.label} />
      </div>
      <WidgetPanel title="Inputs">
        <div className="grid gap-3 md:grid-cols-2">
          <Slider label="MCA MFV" min={40} max={300} value={mca} onChange={setMca} unit="cm/s" />
          <Slider label="ICA MFV" min={10} max={120} value={ica} onChange={setIca} unit="cm/s" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <Button
              key={p.label}
              variant="secondary"
              onClick={() => {
                setMca(p.mca);
                setIca(p.ica);
              }}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </WidgetPanel>
      <WidgetPanel title="Threshold reference" className="mt-2.5">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left py-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-tealLight">Ratio</th>
              <th className="text-left py-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-tealLight">Interpretation</th>
            </tr>
          </thead>
          <tbody>
            <tr className={ratio < 3 ? 'bg-brand-teal/10' : ''}>
              <td className="py-1.5 px-2 font-mono">&lt; 3</td>
              <td className="py-1.5 px-2">Hyperemia or normal</td>
            </tr>
            <tr className={ratio >= 3 && ratio < 6 ? 'bg-brand-teal/10' : ''}>
              <td className="py-1.5 px-2 font-mono">3 – 6</td>
              <td className="py-1.5 px-2">Mild vasospasm</td>
            </tr>
            <tr className={ratio >= 6 && ratio < 9 ? 'bg-brand-teal/10' : ''}>
              <td className="py-1.5 px-2 font-mono">6 – 9</td>
              <td className="py-1.5 px-2">Moderate vasospasm</td>
            </tr>
            <tr className={ratio >= 9 ? 'bg-brand-teal/10' : ''}>
              <td className="py-1.5 px-2 font-mono">&gt; 9</td>
              <td className="py-1.5 px-2">Severe vasospasm</td>
            </tr>
          </tbody>
        </table>
      </WidgetPanel>
    </WidgetShell>
  );
}

function Slider({
  label,
  min,
  max,
  value,
  onChange,
  unit,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  unit: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">{label}</span>
        <span className="font-mono text-[13px] font-bold text-brand-tealLight">
          {value} <span className="text-[10px] text-ink-dim font-normal">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="accent-brand-teal"
      />
    </label>
  );
}
