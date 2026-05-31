'use client';

import { useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetPanel } from '../shared/WidgetShell';

const Q10 = 1.07;

export function cmro2Multiplier(brainTempC: number): number {
  return Math.pow(Q10, brainTempC - 37);
}

export default function CMRO2TempSlider() {
  const [brainC, setBrainC] = useState(37);
  const mult = cmro2Multiplier(brainC);

  return (
    <WidgetShell
      eyebrow="Foundation · cerebral metabolism"
      title="Q10, CMRO₂ vs brain temperature"
      footnote="Polderman 2009. Q10 = 1.07 → ~7% per °C."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="Brain temp" value={brainC.toFixed(1)} unit="°C" />
        <Readout
          label="CMRO₂ vs 37 °C"
          value={`${(mult * 100).toFixed(0)}%`}
          status={mult < 0.85 ? 'good' : mult > 1.2 ? 'danger' : mult > 1.07 ? 'warn' : 'good'}
        />
        <Readout
          label="Implication"
          value={brainC < 35 ? 'protective' : brainC <= 37.5 ? 'normal' : brainC <= 38.5 ? 'mild fever' : brainC <= 39.5 ? 'aggressive' : 'emergency'}
          status={brainC <= 37.5 ? 'good' : brainC <= 38.5 ? 'warn' : 'danger'}
        />
      </div>
      <WidgetPanel title="Drag brain temperature">
        <input
          type="range"
          min={32}
          max={41}
          step={0.1}
          value={brainC}
          onChange={(e) => setBrainC(parseFloat(e.target.value))}
          className="w-full accent-brand-teal"
          aria-label="Brain temperature"
        />
        <div className="grid grid-cols-5 mt-2 text-center text-[10px] text-ink-muted">
          {[32, 34, 37, 39, 41].map((m) => (
            <div key={m} className="border-t border-line pt-1 font-mono">{m} °C</div>
          ))}
        </div>
        <div className="mt-3 text-[12.5px] text-ink/85 leading-[1.55]">
          <p className="m-0">CMRO₂ scales as <code className="font-mono text-brand-tealLight">Q10^(T − 37)</code> with Q10 ≈ 1.07. Each 1 °C above 37 raises metabolic demand by ~7%; cooling to 33 °C drops CMRO₂ ~30%,the basis for therapeutic hypothermia.</p>
        </div>
      </WidgetPanel>
    </WidgetShell>
  );
}
