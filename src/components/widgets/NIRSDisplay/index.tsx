'use client';

import { useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

function rSO2For(p: { sao2: number; map: number; vasospasm: boolean; carotidStenosis: boolean }) {
  // SvO2 ≈ SaO2 - CMRO2/(CBF×Hgb×1.34); we vary CBF via MAP and stenosis
  const cbfFactor = Math.max(0.4, Math.min(1.4, p.map / 75));
  const stenosisDrop = p.carotidStenosis ? 0.7 : 1.0;
  const vasoDrop = p.vasospasm ? 0.7 : 1.0;
  const svO2 = Math.max(20, p.sao2 - 28 / (cbfFactor * stenosisDrop * vasoDrop));
  return 0.7 * svO2 + 0.3 * p.sao2;
}

export default function NIRSDisplay() {
  const [fio2, setFio2] = useState(40);
  const [sao2, setSao2] = useState(98);
  const [map, setMap] = useState(80);
  const [leftVasospasm, setLeftVasospasm] = useState(false);
  const [rightStenosis, setRightStenosis] = useState(false);
  const left = rSO2For({ sao2, map, vasospasm: leftVasospasm, carotidStenosis: false });
  const right = rSO2For({ sao2, map, vasospasm: false, carotidStenosis: rightStenosis });
  const asym = Math.abs(left - right);

  return (
    <WidgetShell
      eyebrow="NIRS · rSO₂"
      title="NIRS bedside display"
      footnote="Approximation: rSO₂ ≈ 0.7·SvO₂ + 0.3·SaO₂ (Madsen 2000)."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="Left rSO₂" value={left.toFixed(0)} unit="%" status={left >= 60 ? 'good' : left >= 50 ? 'warn' : 'danger'} />
        <Readout label="Right rSO₂" value={right.toFixed(0)} unit="%" status={right >= 60 ? 'good' : right >= 50 ? 'warn' : 'danger'} />
        <Readout
          label="Asymmetry"
          value={asym.toFixed(0)}
          unit="%"
          status={asym < 10 ? 'good' : asym < 15 ? 'warn' : 'danger'}
          hint={asym >= 10 ? 'Clinically significant' : 'Within tolerance'}
        />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Sensor display (left / right)">
          <div className="grid grid-cols-2 gap-3">
            <SensorBox side="L" value={left} />
            <SensorBox side="R" value={right} />
          </div>
        </WidgetPanel>
        <WidgetPanel title="Inputs">
          <Slider label="FiO₂" min={21} max={100} value={fio2} onChange={setFio2} unit="%" />
          <Slider label="SaO₂" min={70} max={100} value={sao2} onChange={setSao2} unit="%" />
          <Slider label="MAP" min={40} max={130} value={map} onChange={setMap} unit="mmHg" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Toggle label="Left vasospasm" on={leftVasospasm} onChange={setLeftVasospasm} />
            <Toggle label="Right ICA stenosis" on={rightStenosis} onChange={setRightStenosis} />
          </div>
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}

function SensorBox({ side, value }: { side: 'L' | 'R'; value: number }) {
  const status = value >= 60 ? 'good' : value >= 50 ? 'warn' : 'danger';
  const color =
    status === 'good' ? 'border-status-good text-status-good' : status === 'warn' ? 'border-brand-amber text-brand-amber' : 'border-status-danger text-status-dangerText';
  return (
    <div className={`rounded-md border-l-[3px] bg-surface-darker p-3 ${color}`}>
      <div className="text-[9px] font-bold uppercase tracking-eyebrow text-ink-muted">{side === 'L' ? 'Left frontal' : 'Right frontal'}</div>
      <div className={`mt-1 font-mono text-[34px] font-bold ${color.split(' ')[1]}`}>{value.toFixed(0)}</div>
      <div className="text-[10px] text-ink-dim">% rSO₂</div>
    </div>
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
    <label className="block mb-3 last:mb-0">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">{label}</span>
        <span className="font-mono text-[13px] font-bold text-brand-tealLight">
          {value} <span className="text-[10px] text-ink-dim font-normal">{unit}</span>
        </span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(parseInt(e.target.value, 10))} className="w-full accent-brand-teal" />
    </label>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={
        'rounded-md border px-2.5 py-1.5 text-[11px] font-semibold ' +
        (on ? 'bg-status-danger text-white border-status-danger' : 'bg-surface-deeper border-line text-ink-muted hover:border-brand-teal')
      }
    >
      {label} · {on ? 'ON' : 'off'}
    </button>
  );
}
