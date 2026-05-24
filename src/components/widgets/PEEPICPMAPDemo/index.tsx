'use client';

import { useState } from 'react';
import { Readout, ToggleRow } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

type Volume = 'hypo' | 'normo' | 'hyper';

function transmission(lungCompliance: number) {
  return Math.max(0.15, Math.min(0.55, lungCompliance / 60));
}

function deltaIcp(peep: number, lungComp: number) {
  const tx = transmission(lungComp);
  return (peep - 5) * 0.6 * (tx / 0.5);
}
function deltaMap(peep: number, lungComp: number, vol: Volume) {
  const tx = transmission(lungComp);
  const v = vol === 'hypo' ? 1.5 : vol === 'normo' ? 1.0 : 0.7;
  return -((peep - 5) * 0.4 * (tx / 0.5) * v);
}

export default function PEEPICPMAPDemo() {
  const [peep, setPeep] = useState(10);
  const [lungComp, setLungComp] = useState(40);
  const [vol, setVol] = useState<Volume>('normo');
  const dIcp = deltaIcp(peep, lungComp);
  const dMap = deltaMap(peep, lungComp, vol);
  const dCpp = dMap - dIcp;

  return (
    <WidgetShell
      eyebrow="PEEP × cardiopulmonary × cerebral"
      title="What does PEEP do to ICP and MAP?"
      controls={
        <ToggleRow<Volume>
          label="Volume status"
          value={vol}
          onChange={setVol}
          options={[
            { value: 'hypo', label: 'Hypovolemic', accent: 'red' },
            { value: 'normo', label: 'Normovolemic', accent: 'green' },
            { value: 'hyper', label: 'Hypervolemic', accent: 'amber' },
          ]}
        />
      }
      footnote="Caricato 2005, Pinsky 2002, Magder 2014."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="ΔICP" value={dIcp.toFixed(1)} unit="mmHg" status={dIcp < 2 ? 'good' : dIcp < 5 ? 'warn' : 'danger'} />
        <Readout label="ΔMAP" value={dMap.toFixed(1)} unit="mmHg" status={dMap > -2 ? 'good' : dMap > -6 ? 'warn' : 'danger'} />
        <Readout label="ΔCPP (net)" value={dCpp.toFixed(1)} unit="mmHg" status={dCpp > -3 ? 'good' : dCpp > -8 ? 'warn' : 'danger'} />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Inputs">
          <Slider label="PEEP" min={0} max={20} value={peep} onChange={setPeep} unit="cmH₂O" />
          <Slider label="Lung compliance" min={10} max={80} value={lungComp} onChange={setLungComp} unit="mL/cmH₂O" />
          <p className="mt-2 text-[11.5px] text-ink-muted">
            Transmission ratio: <code className="font-mono text-brand-tealLight">{transmission(lungComp).toFixed(2)}</code>
          </p>
        </WidgetPanel>
        <WidgetPanel title="What this means at the bedside">
          <ul className="text-[12.5px] text-ink/85 leading-[1.55] space-y-2 list-none p-0">
            <li><strong>Stiff lungs (ARDS):</strong> low transmission. PEEP hits ICP less than you might fear.</li>
            <li><strong>Compliant lungs:</strong> PEEP transmits readily to pleural space, then to CVP, then to cerebral venous outflow.</li>
            <li><strong>Hypovolemia:</strong> PEEP drops MAP harder via reduced venous return.</li>
            <li><strong>Net CPP effect:</strong> raise PEEP only when oxygenation cost matters and CPP is comfortably above LLA.</li>
          </ul>
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
