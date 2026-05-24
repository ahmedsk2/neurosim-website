'use client';

import { useEffect, useRef, useState } from 'react';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';
import { eegVal, type EEGPattern } from '../EEGPatternLibrary/engine';

const PATTERNS = [
  { id: 'normal' as EEGPattern, label: 'Continuous normal voltage' },
  { id: 'generalized_slowing' as EEGPattern, label: 'Discontinuous normal voltage' },
  { id: 'burst_suppression' as EEGPattern, label: 'Burst-suppression' },
  { id: 'low_voltage' as EEGPattern, label: 'Continuous low voltage' },
  { id: 'isoelectric' as EEGPattern, label: 'Flat trace' },
];

export default function AEEGGenerator() {
  const [pattern, setPattern] = useState<EEGPattern>('normal');
  const aeegCv = useRef<HTMLCanvasElement>(null);
  const pipelineCv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawAEEG();
    drawPipeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern]);

  function drawAEEG() {
    const c = aeegCv.current;
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
    const padL = 36;
    const padR = 14;
    const padT = 14;
    const padB = 24;
    // semi-log y: 0..10 linear, 10..100 log
    const yS = (v: number) => {
      const top = padT;
      const bot = h - padB;
      if (v <= 10) return bot - (v / 10) * ((bot - top) * 0.4);
      const logPart = Math.log10(v / 10) / 1; // 10..100 → 0..1
      return bot - ((bot - top) * 0.4) - logPart * ((bot - top) * 0.6);
    };
    // Baselines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    [5, 10, 25, 50, 100].forEach((v) => {
      ctx.beginPath();
      ctx.moveTo(padL, yS(v));
      ctx.lineTo(w - padR, yS(v));
      ctx.stroke();
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(String(v), padL - 4, yS(v) + 3);
    });
    // Synth: per-15s window draw upper/lower margins
    const minutes = 60;
    const xS = (m: number) => padL + (m / minutes) * (w - padL - padR);
    ctx.fillStyle = 'rgba(94,234,212,0.18)';
    ctx.beginPath();
    let firstPath = true;
    const upperPts: [number, number][] = [];
    const lowerPts: [number, number][] = [];
    for (let m = 0; m <= minutes; m += 0.5) {
      // 15-second windows of synthetic EEG
      let lo = Infinity;
      let hi = -Infinity;
      for (let s = 0; s < 100; s++) {
        const t = m * 60 + (s / 100) * 15;
        const v = Math.abs(eegVal(t, pattern, 0));
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
      // Map peaks/troughs into aEEG amplitude space
      const lower = Math.max(0.5, lo * 0.5);
      const upper = Math.max(lower + 1, hi * 0.6);
      upperPts.push([m, upper]);
      lowerPts.push([m, lower]);
    }
    // Filled region
    upperPts.forEach((p, i) => {
      const x = xS(p[0]);
      const y = yS(p[1]);
      if (firstPath) {
        ctx.moveTo(x, y);
        firstPath = false;
      } else ctx.lineTo(x, y);
    });
    for (let i = lowerPts.length - 1; i >= 0; i--) {
      const x = xS(lowerPts[i]![0]);
      const y = yS(lowerPts[i]![1]);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#14B8A6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    upperPts.forEach((p, i) => {
      const x = xS(p[0]);
      const y = yS(p[1]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.beginPath();
    lowerPts.forEach((p, i) => {
      const x = xS(p[0]);
      const y = yS(p[1]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    // Time axis
    ctx.fillStyle = '#94A3B8';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    [0, 15, 30, 45, 60].forEach((m) => ctx.fillText(`${m}m`, xS(m), h - padB + 14));
    ctx.fillStyle = '#5EEAD4';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('aEEG amplitude (µV),last 60 min', (padL + w - padR) / 2, h - 6);
  }

  function drawPipeline() {
    const c = pipelineCv.current;
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
    const labels = ['1. Bandpass 2–15 Hz', '2. Rectify', '3. Compress', '4. Semi-log envelope'];
    const N = 600;
    const padL = 70;
    const padR = 14;
    const stepH = h / 4;
    labels.forEach((l, idx) => {
      const yMid = idx * stepH + stepH / 2;
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(l, padL - 8, yMid + 4);
      ctx.strokeStyle = '#5EEAD4';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const t = (i / N) * 8;
        let v = eegVal(t, pattern, 0);
        if (idx >= 1) v = Math.abs(v);
        if (idx >= 2) {
          // moving average over 0.05 sec window (compress)
          let sum = 0;
          for (let j = 0; j < 5; j++) sum += Math.abs(eegVal(t + j * 0.01, pattern, 0));
          v = sum / 5;
        }
        if (idx === 3) v = Math.log10(1 + v);
        const x = padL + (i / N) * (w - padL - padR);
        const y = yMid - v * (idx === 3 ? 18 : 0.4);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  }

  return (
    <WidgetShell
      eyebrow="aEEG"
      title="Amplitude-integrated EEG"
      controls={
        <div className="flex flex-wrap gap-1.5">
          {PATTERNS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPattern(p.id)}
              className={
                'rounded-md border px-2.5 py-1.5 text-[11px] font-semibold ' +
                (pattern === p.id
                  ? 'border-brand-teal bg-brand-teal/15 text-ink'
                  : 'border-line bg-surface-deeper text-ink-muted hover:text-brand-tealLight hover:border-brand-teal')
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      }
      footnote="Hellström-Westas 2008; al Naqeeb 1999; Toet 2002."
    >
      <WidgetGrid>
        <WidgetPanel title="aEEG strip (semi-log)">
          <canvas ref={aeegCv} className="block w-full" style={{ height: 240 }} />
        </WidgetPanel>
        <WidgetPanel title="Pipeline, raw EEG → aEEG envelope">
          <canvas ref={pipelineCv} className="block w-full" style={{ height: 240 }} />
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}
