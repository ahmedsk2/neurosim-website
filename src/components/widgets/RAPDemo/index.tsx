'use client';

import { useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

function rapClass(rap: number, icp: number) {
  if (icp >= 35 && rap < 0.3) return { label: 'Decompensation, paradox', status: 'danger' as const };
  if (rap < 0.3) return { label: 'Normal reserve', status: 'good' as const };
  if (rap < 0.6) return { label: 'Borderline', status: 'warn' as const };
  if (rap < 0.9) return { label: 'Low reserve', status: 'warn' as const };
  return { label: 'Exhausted reserve', status: 'danger' as const };
}

export default function RAPDemo() {
  const [icp, setIcp] = useState(20);
  const [pvi, setPvi] = useState(20);
  // Synthetic RAP from operating point on PV curve: low ICP → flat segment → low correlation; high ICP → steep → high RAP; very high → AMP collapse
  const dV = pvi * Math.log(Math.max(0.1, icp / 5));
  let rap = 0.2 + Math.min(0.7, dV / 25);
  if (icp >= 35) rap = Math.max(0, 0.4 - (icp - 35) * 0.05); // collapse
  const c = rapClass(rap, icp);
  return (
    <WidgetShell
      eyebrow="ICP · compliance"
      title="RAP, compensatory reserve index"
      footnote="Czosnyka 1996. Correlation between AMP and mean ICP over 4 minutes."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="Mean ICP" value={icp} unit="mmHg" status={icp <= 15 ? 'good' : icp <= 22 ? 'warn' : 'danger'} />
        <Readout label="RAP" value={rap.toFixed(2)} status={c.status} hint={c.label} />
        <Readout label="Position on PV curve" value={dV.toFixed(1)} unit="ΔV mL" />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Interpretation">
          <ul className="text-[12.5px] text-ink/85 leading-[1.55] space-y-2 list-none p-0">
            <li><strong>RAP &lt; 0.3:</strong> normal compensatory reserve.</li>
            <li><strong>0.3–0.6:</strong> borderline.</li>
            <li><strong>0.6–0.9:</strong> low reserve, operating on the steep PV-curve segment.</li>
            <li><strong>Sudden drop near 0 at high ICP:</strong> decompensation (AMP collapse, paradoxical pattern).</li>
          </ul>
        </WidgetPanel>
        <WidgetPanel title="Inputs">
          <Slider label="Mean ICP" min={5} max={45} value={icp} onChange={setIcp} unit="mmHg" />
          <Slider label="PVI" min={10} max={30} value={pvi} onChange={setPvi} unit="mL" />
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}

function Slider({ label, min, max, value, onChange, unit }: { label: string; min: number; max: number; value: number; onChange: (v: number) => void; unit: string }) {
  return (
    <label className="block mb-3 last:mb-0">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">{label}</span>
        <span className="font-mono text-[13px] font-bold text-brand-tealLight">{value} <span className="text-[10px] text-ink-dim font-normal">{unit}</span></span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(parseInt(e.target.value, 10))} className="w-full accent-brand-teal" />
    </label>
  );
}
