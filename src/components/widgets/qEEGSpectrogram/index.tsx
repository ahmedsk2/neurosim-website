'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout, ToggleRow } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';
import { eegVal, type EEGPattern } from '../EEGPatternLibrary/engine';

type Scenario = 'normal' | 'ncse' | 'dci' | 'sedation' | 'bs';

const SCENARIO_PATTERN: Record<Scenario, EEGPattern> = {
  normal: 'normal',
  ncse: 'ncse',
  dci: 'generalized_slowing',
  sedation: 'low_voltage',
  bs: 'burst_suppression',
};

function bandPowers(pattern: EEGPattern, t: number) {
  const N = 256;
  const fs = 128; // Hz
  const samples: number[] = [];
  for (let i = 0; i < N; i++) samples.push(eegVal(t + i / fs, pattern, 0));
  // Naive FFT-free band power: rectify and bandpass-approximate via windowed sums of sin products
  const bandPower = (lo: number, hi: number) => {
    let p = 0;
    for (let f = lo; f <= hi; f += 1) {
      let re = 0;
      let im = 0;
      for (let n = 0; n < N; n++) {
        const ang = (2 * Math.PI * f * n) / fs;
        re += (samples[n] ?? 0) * Math.cos(ang);
        im += (samples[n] ?? 0) * Math.sin(ang);
      }
      p += (re * re + im * im) / (N * N);
    }
    return p / Math.max(1, hi - lo + 1);
  };
  return {
    delta: bandPower(1, 4),
    theta: bandPower(4, 8),
    alpha: bandPower(8, 13),
    beta: bandPower(13, 30),
  };
}

export default function QEEGSpectrogram() {
  const [scenario, setScenario] = useState<Scenario>('normal');
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = cv.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const w = c.clientWidth;
    const h = c.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    c.width = w * dpr;
    c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0F1A2E';
    ctx.fillRect(0, 0, w, h);
    const padL = 40;
    const padR = 14;
    const padT = 12;
    const padB = 22;
    const minutes = 60;
    const cols = 120;
    const colW = (w - padL - padR) / cols;
    const rows = 40;
    const rowH = (h - padT - padB) / rows;
    const pat = SCENARIO_PATTERN[scenario];
    for (let cIdx = 0; cIdx < cols; cIdx++) {
      const tMin = cIdx; // simplified: 1 col = 1 min
      // Generate "spectral content" per row (frequency)
      for (let r = 0; r < rows; r++) {
        const f = (r / rows) * 30;
        // Synth: simple weighting per band based on pattern
        let weight = 0;
        if (pat === 'normal') {
          if (f >= 8 && f <= 13) weight = 1;
          else if (f >= 13 && f <= 25) weight = 0.4;
        } else if (pat === 'generalized_slowing') {
          if (f >= 1 && f <= 4) weight = 1;
          else if (f >= 4 && f <= 8) weight = 0.6;
        } else if (pat === 'ncse') {
          if (f >= 2 && f <= 6) weight = 1;
          if (f >= 6 && f <= 12) weight = 0.7;
        } else if (pat === 'low_voltage') {
          weight = 0.1;
        } else if (pat === 'burst_suppression') {
          const inBurst = ((tMin + 0.5) % 4) < 1.5;
          weight = inBurst ? (f < 12 ? 0.9 : 0.3) : 0.05;
        }
        weight *= 0.6 + 0.4 * Math.sin(2 * Math.PI * tMin * 0.05 + f * 0.2);
        const intensity = Math.max(0, Math.min(1, weight));
        const r8 = Math.floor(20 + intensity * 235);
        const g8 = Math.floor(40 + intensity * 100 * (1 - intensity));
        const b8 = Math.floor(120 - intensity * 100);
        ctx.fillStyle = `rgb(${r8},${g8},${b8})`;
        const x = padL + cIdx * colW;
        const y = h - padB - (r + 1) * rowH;
        ctx.fillRect(x, y, colW + 1, rowH + 1);
      }
    }
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.strokeRect(padL, padT, w - padL - padR, h - padT - padB);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    [0, 10, 20, 30].forEach((f) => {
      const y = h - padB - (f / 30) * (h - padT - padB);
      ctx.fillText(`${f} Hz`, padL - 4, y + 3);
    });
    ctx.textAlign = 'center';
    [0, 15, 30, 45, 60].forEach((m) => {
      const x = padL + (m / minutes) * (w - padL - padR);
      ctx.fillText(`${m}m`, x, h - padB + 14);
    });
  }, [scenario]);

  const bp = bandPowers(SCENARIO_PATTERN[scenario], 0);
  const adr = bp.alpha / Math.max(1e-6, bp.delta);
  return (
    <WidgetShell
      eyebrow="qEEG"
      title="Spectrogram + ADR + suppression"
      controls={
        <ToggleRow<Scenario>
          label="Scenario"
          value={scenario}
          onChange={setScenario}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'ncse', label: 'NCSE' },
            { value: 'dci', label: 'DCI / slowing' },
            { value: 'sedation', label: 'Deep sedation' },
            { value: 'bs', label: 'Burst-suppression' },
          ]}
        />
      }
      footnote="Foreman 2012, Claassen 2004, Vespa 2003."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="α-δ ratio (ADR)" value={adr.toFixed(2)} status={adr > 0.8 ? 'good' : adr > 0.4 ? 'warn' : 'danger'} />
        <Readout
          label="Burst-suppression"
          value={scenario === 'bs' ? 'present' : 'no'}
          status={scenario === 'bs' ? 'warn' : 'good'}
        />
        <Readout
          label="Likely interpretation"
          value={scenario}
          hint={
            scenario === 'normal'
              ? 'Awake / drowsy normal'
              : scenario === 'ncse'
                ? 'Continuous rhythmic, treat'
                : scenario === 'dci'
                  ? 'Slowing, DCI risk in SAH'
                  : scenario === 'sedation'
                    ? 'Deep sedation, re-titrate'
                    : 'Burst-suppression, anti-seizure / metabolic'
          }
        />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Compressed spectral array (last 60 min)">
          <canvas ref={cv} className="block w-full" style={{ height: 320 }} />
        </WidgetPanel>
        <WidgetPanel title="Why qEEG matters">
          <ul className="text-[12.5px] text-ink/85 leading-[1.55] space-y-2">
            <li><strong>ADR</strong> (alpha/delta) falls before clinical decline in DCI after SAH.</li>
            <li><strong>Suppression burst index</strong> rises with sedation and ischemia.</li>
            <li><strong>Spectral edge (SEF95)</strong> tracks anaesthesia depth.</li>
            <li><strong>Asymmetry index</strong> flags hemispheric dysfunction.</li>
            <li>Always corroborate qEEG quantitative trends with raw EEG before acting.</li>
          </ul>
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}
