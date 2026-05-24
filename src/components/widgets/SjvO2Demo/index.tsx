'use client';

import { useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

function sjvo2(p: { sao2: number; cmro2: number; cbf: number; hgb: number }) {
  // SjvO2 = SaO2 - CMRO2 / (CBF × Hgb × 1.34)
  const denom = Math.max(0.1, p.cbf * p.hgb * 1.34);
  return Math.max(0, p.sao2 - (p.cmro2 / denom) * 100);
}

export default function SjvO2Demo() {
  const [sao2, setSao2] = useState(98);
  const [cmro2, setCmro2] = useState(3.5);
  const [cbf, setCbf] = useState(50);
  const [hgb, setHgb] = useState(10);
  const v = sjvo2({ sao2, cmro2, cbf, hgb });
  const avdo2 = sao2 - v;
  const status: 'good' | 'warn' | 'danger' = v >= 50 && v <= 75 ? 'good' : v < 50 ? 'danger' : 'warn';

  return (
    <WidgetShell
      eyebrow="SjvO₂ · jugular bulb"
      title="Global cerebral O₂ extraction (Fick)"
      footnote="Robertson 1989, Macmillan 2000, Gopinath 1994."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="SjvO₂" value={`${v.toFixed(0)}%`} status={status} hint={v < 50 ? 'Increased extraction, ischemia / low CDO₂' : v > 75 ? 'Decreased extraction, hyperemia / low CMRO₂' : 'Normal'} />
        <Readout label="A-V O₂ difference" value={`${avdo2.toFixed(0)}%`} hint="SaO₂ − SjvO₂" />
        <Readout label="CDO₂ proxy" value={(cbf * hgb * 1.34).toFixed(0)} unit="" hint="CBF × Hgb × 1.34" />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Inputs">
          <Slider label="SaO₂" min={70} max={100} value={sao2} onChange={setSao2} unit="%" />
          <Slider label="CBF" min={15} max={90} value={cbf} onChange={setCbf} unit="mL/100g/min" />
          <Slider label="Hgb" min={6} max={14} value={hgb} onChange={setHgb} unit="g/dL" />
          <SliderFloat label="CMRO₂" min={1.5} max={6} step={0.1} value={cmro2} onChange={setCmro2} unit="mL/100g/min" />
        </WidgetPanel>
        <WidgetPanel title="Pattern recognition">
          <ul className="text-[12.5px] text-ink/85 leading-[1.55] space-y-2 list-none p-0">
            <li><strong className="text-status-dangerText">SjvO₂ &lt; 50:</strong> increased extraction, global ischemia, low CBF, anemia, hyperventilation.</li>
            <li><strong className="text-status-good">SjvO₂ 50–75:</strong> normal range; corroborate with PbtO₂ and clinical state.</li>
            <li><strong className="text-brand-amber">SjvO₂ &gt; 75:</strong> decreased extraction, hyperemia, decreased CMRO₂ (sedation, hypothermia), AVM/shunt, or catheter sampling artifact.</li>
            <li><strong>Limitations:</strong> side dominance, catheter migration, sampling errors. Interpret as a trend.</li>
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
function SliderFloat({ label, min, max, step, value, onChange, unit }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; unit: string }) {
  return (
    <label className="block mb-3 last:mb-0">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">{label}</span>
        <span className="font-mono text-[13px] font-bold text-brand-tealLight">{value.toFixed(1)} <span className="text-[10px] text-ink-dim font-normal">{unit}</span></span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-brand-teal" />
    </label>
  );
}
