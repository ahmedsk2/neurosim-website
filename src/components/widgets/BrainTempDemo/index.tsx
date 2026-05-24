'use client';

import { useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';
import { brainTempFor, classifyTemp, cmro2Multiplier } from './engine';

export default function BrainTempDemo() {
  const [coreC, setCoreC] = useState(37.0);
  const [seizure, setSeizure] = useState(false);
  const [hyperemia, setHyperemia] = useState(false);
  const [highIcp, setHighIcp] = useState(false);

  const brainC = brainTempFor({ coreC, hasSeizure: seizure, hasHyperemia: hyperemia, highIcp });
  const gradient = brainC - coreC;
  const cmroMult = cmro2Multiplier(brainC);
  const cls = classifyTemp(brainC);

  return (
    <WidgetShell
      eyebrow="Brain temperature"
      title="Brain – core gradient and the metabolic cost of fever"
      footnote="Henker 1998; Soukup 2002; Childs 2014; Polderman 2009 (Q10)."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-4 mb-2.5">
        <Readout label="Core" value={coreC.toFixed(1)} unit="°C" />
        <Readout label="Brain" value={brainC.toFixed(1)} unit="°C" status={cls.status} hint={cls.label} />
        <Readout label="Gradient" value={`+${gradient.toFixed(1)}`} unit="°C" status={gradient > 1.5 ? 'warn' : 'good'} />
        <Readout label="CMRO₂ vs 37 °C" value={`${(cmroMult * 100).toFixed(0)}%`} status={cmroMult > 1.15 ? 'warn' : 'good'} hint="Q10 = 1.07" />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Schematic, head with two thermistors">
          <BrainSchematic core={coreC} brain={brainC} />
        </WidgetPanel>
        <WidgetPanel title="Drivers">
          <label className="block mb-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">Core temperature</span>
              <span className="font-mono text-[13px] font-bold text-brand-tealLight">{coreC.toFixed(1)} °C</span>
            </div>
            <input
              type="range"
              min={32}
              max={40}
              step={0.1}
              value={coreC}
              onChange={(e) => setCoreC(parseFloat(e.target.value))}
              className="w-full accent-brand-teal"
            />
          </label>
          <div className="grid grid-cols-1 gap-2">
            <Toggle label="Active focal seizure" on={seizure} onChange={setSeizure} />
            <Toggle label="Hyperemia" on={hyperemia} onChange={setHyperemia} />
            <Toggle label="High ICP / mass effect" on={highIcp} onChange={setHighIcp} />
          </div>
          <ul className="mt-3 text-[12px] text-ink/85 leading-[1.55] space-y-1.5 list-none p-0">
            <li>• Brain runs ~0.5 °C above core at baseline.</li>
            <li>• Gradient widens with seizure, hyperemia, raised ICP.</li>
            <li>• Each 1 °C above 37 raises CMRO₂ by ~7%.</li>
          </ul>
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}

function BrainSchematic({ core, brain }: { core: number; brain: number }) {
  // Color encoding
  const heatColor = (t: number) => {
    if (t < 36) return '#3B82F6';
    if (t < 37.5) return '#5EEAD4';
    if (t < 38.5) return '#FCD34D';
    if (t < 39.5) return '#F59E0B';
    return '#EF4444';
  };
  return (
    <svg viewBox="0 0 400 240" className="w-full h-auto" role="img" aria-label="Head with two thermistors">
      <defs>
        <radialGradient id="brainGradient" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={heatColor(brain)} stopOpacity="0.9" />
          <stop offset="100%" stopColor={heatColor(brain)} stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <ellipse cx={200} cy={120} rx={130} ry={90} fill="#152238" stroke="#475569" strokeWidth={2} />
      <ellipse cx={200} cy={110} rx={100} ry={70} fill="url(#brainGradient)" />
      {/* Core thermistor (rectum/bladder/oesophagus, abstract) */}
      <line x1={310} y1={200} x2={340} y2={220} stroke="#5EEAD4" strokeWidth={2} />
      <circle cx={340} cy={220} r={6} fill={heatColor(core)} stroke="#5EEAD4" strokeWidth={1.5} />
      <text x={345} y={225} fontSize={11} fontFamily="Consolas, monospace" fill="#94A3B8" textAnchor="start">
        core {core.toFixed(1)}°
      </text>
      {/* Brain thermistor (intraparenchymal) */}
      <line x1={200} y1={50} x2={200} y2={110} stroke="#F59E0B" strokeWidth={2} />
      <circle cx={200} cy={110} r={6} fill={heatColor(brain)} stroke="#F59E0B" strokeWidth={1.5} />
      <text x={210} y={70} fontSize={11} fontFamily="Consolas, monospace" fill="#FCD34D" textAnchor="start">
        brain {brain.toFixed(1)}°
      </text>
    </svg>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={
        'rounded-md border px-3 py-2 text-[12px] font-semibold text-left transition-colors ' +
        (on
          ? 'bg-status-danger/20 text-status-dangerText border-status-danger'
          : 'bg-surface-deeper border-line text-ink-muted hover:border-brand-teal hover:text-ink')
      }
    >
      {label} · {on ? 'ON' : 'off'}
    </button>
  );
}
