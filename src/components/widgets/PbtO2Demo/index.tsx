'use client';

import { useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

function pbto2(p: { fio2: number; cpp: number; hgb: number; paco2: number; cmro2: number }) {
  // Synthetic: rises with FiO2 (above 0.4 plateaus), with CPP above 60, with Hgb up to 12
  const fio2Term = Math.min(1.0, (p.fio2 - 21) / 30); // 0 at 21%, 1 at 51%
  const cppTerm = Math.max(0, Math.min(1, (p.cpp - 50) / 30));
  const hgbTerm = Math.max(0.4, Math.min(1, p.hgb / 12));
  const co2Term = Math.max(0.7, Math.min(1.3, 1 + (p.paco2 - 40) * 0.015));
  const base = 5;
  const max = 50;
  return Math.min(max, Math.max(0, base + (max - base) * fio2Term * cppTerm * hgbTerm * co2Term - p.cmro2 * 0.3));
}

export default function PbtO2Demo() {
  const [fio2, setFio2] = useState(40);
  const [cpp, setCpp] = useState(65);
  const [hgb, setHgb] = useState(10);
  const [paco2, setPaco2] = useState(38);
  const [cmro2, setCmro2] = useState(3.5);
  const v = pbto2({ fio2, cpp, hgb, paco2, cmro2 });
  const status: 'good' | 'warn' | 'danger' = v >= 20 ? 'good' : v >= 15 ? 'warn' : 'danger';

  return (
    <WidgetShell
      eyebrow="PbtO₂ · brain tissue oxygen"
      title="PbtO₂ at the bedside"
      footnote="Stiefel 2005, Okonkwo 2017 (BOOST-II), Rosenthal 2008."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="PbtO₂" value={v.toFixed(0)} unit="mmHg" status={status} hint={status === 'good' ? 'Above threshold' : status === 'warn' ? 'Borderline' : '< 15: ischemia / diffusion failure'} />
        <Readout label="CDO₂ proxy" value={(hgb * cpp / 60).toFixed(1)} unit="" hint="Hgb × CPP / 60" />
        <Readout label="CMRO₂" value={cmro2.toFixed(1)} unit="mL/100g/min" />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Inputs">
          <Slider label="FiO₂" min={21} max={100} value={fio2} onChange={setFio2} unit="%" />
          <Slider label="CPP" min={30} max={110} value={cpp} onChange={setCpp} unit="mmHg" />
          <Slider label="Hgb" min={6} max={14} value={hgb} onChange={setHgb} unit="g/dL" />
          <Slider label="PaCO₂" min={20} max={60} value={paco2} onChange={setPaco2} unit="mmHg" />
          <SliderFloat label="CMRO₂" min={2} max={5} step={0.1} value={cmro2} onChange={setCmro2} unit="mL/100g/min" />
        </WidgetPanel>
        <WidgetPanel title="Threshold + decision rules">
          <div className="grid grid-cols-3 text-center mb-3">
            <div className="rounded-md bg-status-danger/10 border-l-[3px] border-l-status-danger p-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-status-dangerText">&lt; 15</div>
              <div className="text-[12px] text-ink/85">Ischemia / diffusion failure</div>
            </div>
            <div className="rounded-md bg-brand-amber/10 border-l-[3px] border-l-brand-amber p-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-amber">15–19</div>
              <div className="text-[12px] text-ink/85">Borderline, escalate</div>
            </div>
            <div className="rounded-md bg-status-good/10 border-l-[3px] border-l-status-good p-2">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-status-good">≥ 20</div>
              <div className="text-[12px] text-ink/85">Adequate</div>
            </div>
          </div>
          <ul className="text-[12px] text-ink/85 leading-[1.55] space-y-1.5 list-none p-0">
            <li>• Raise CPP → most direct lever above LLA</li>
            <li>• Increase FiO₂,diminishing returns above 0.4</li>
            <li>• Transfuse Hgb → 9–10 g/dL when marginal</li>
            <li>• Reduce CMRO₂,sedation, temperature</li>
            <li>• Avoid hyperventilation that drops PaCO₂ below 35</li>
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
