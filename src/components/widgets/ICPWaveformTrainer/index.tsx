'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout, ToggleRow } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';
import { type Compliance, icpAt, morphologyLabel, pulseAmplitude } from './engine';

export default function ICPWaveformTrainer() {
  const [meanIcp, setMeanIcp] = useState(15);
  const [compliance, setCompliance] = useState<Compliance>('normal');
  const [showCompare, setShowCompare] = useState(true);
  const cv = useRef<HTMLCanvasElement>(null);
  const cmpCv = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const draw = () => {
      tRef.current += 0.020;
      // Live waveform
      drawCanvas(cv.current, (ctx, w, h) => drawTrace(ctx, w, h, meanIcp, compliance, tRef.current, true));
      // Comparison row
      if (showCompare && cmpCv.current) {
        const c = cmpCv.current;
        const ctx = c.getContext('2d');
        if (ctx) {
          const w = c.clientWidth;
          const h = c.clientHeight;
          const dpr = window.devicePixelRatio || 1;
          if (c.width !== w * dpr) c.width = w * dpr;
          if (c.height !== h * dpr) c.height = h * dpr;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.fillStyle = '#0F1A2E';
          ctx.fillRect(0, 0, w, h);
          const states: Compliance[] = ['normal', 'low', 'exhausted'];
          const cellW = w / 3;
          states.forEach((s, i) => {
            ctx.save();
            ctx.translate(i * cellW, 0);
            // Vertical separators
            if (i > 0) {
              ctx.strokeStyle = '#1e293b';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(0, 8);
              ctx.lineTo(0, h - 8);
              ctx.stroke();
            }
            ctx.fillStyle = '#94A3B8';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(morphologyLabel(s), cellW / 2, 14);
            drawTrace(ctx, cellW, h, meanIcp, s, tRef.current, false, 22);
            ctx.restore();
          });
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [meanIcp, compliance, showCompare]);

  return (
    <WidgetShell
      eyebrow="ICP · waveform"
      title="ICP waveform trainer"
      controls={
        <>
          <ToggleRow<Compliance>
            label="Compliance state"
            value={compliance}
            onChange={setCompliance}
            options={[
              { value: 'normal', label: 'Normal', accent: 'green' },
              { value: 'low', label: 'Low', accent: 'amber' },
              { value: 'exhausted', label: 'Exhausted', accent: 'red' },
            ]}
          />
          <ToggleRow
            label="Comparison"
            value={showCompare ? 'on' : 'off'}
            onChange={(v) => setShowCompare(v === 'on')}
            options={[
              { value: 'on', label: 'Side-by-side' },
              { value: 'off', label: 'Single trace' },
            ]}
          />
        </>
      }
      footnote="Cardoso 1983, Czosnyka 2004, Eide 2006, Kazimierska 2021."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout
          label="Mean ICP"
          value={meanIcp}
          unit="mmHg"
          status={meanIcp <= 15 ? 'good' : meanIcp <= 22 ? 'warn' : 'danger'}
        />
        <Readout
          label="Pulse amplitude (AMP)"
          value={pulseAmplitude(compliance).toFixed(1)}
          unit="mmHg"
          hint="scales with compliance"
        />
        <Readout
          label="Morphology"
          value={compliance}
          status={compliance === 'normal' ? 'good' : compliance === 'low' ? 'warn' : 'danger'}
          hint={morphologyLabel(compliance)}
        />
      </div>
      <WidgetGrid>
        <WidgetPanel
          title="Live trace"
          subtitle="A single ICP cycle = sum of three Gaussians at fixed phases. P2 grows as compliance falls."
        >
          <canvas ref={cv} className="block w-full" style={{ height: 220 }} />
          <div className="mt-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">Mean ICP</label>
            <input
              type="range"
              min={5}
              max={50}
              value={meanIcp}
              onChange={(e) => setMeanIcp(parseInt(e.target.value, 10))}
              className="w-full accent-brand-teal"
            />
          </div>
        </WidgetPanel>
        <WidgetPanel
          title={showCompare ? 'Three compliance states, same scale' : 'P1 P2 P3 anatomy'}
          subtitle={showCompare ? 'Normal · Low · Exhausted, the rounded P2-dominant wave is the danger pattern.' : 'Toggle comparison to see all three side by side.'}
        >
          {showCompare ? (
            <canvas ref={cmpCv} className="block w-full" style={{ height: 220 }} />
          ) : (
            <PeakAnatomy compliance={compliance} />
          )}
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}

function drawCanvas(
  c: HTMLCanvasElement | null,
  fn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
) {
  if (!c) return;
  const ctx = c.getContext('2d');
  if (!ctx) return;
  const w = c.clientWidth;
  const h = c.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  if (c.width !== w * dpr) c.width = w * dpr;
  if (c.height !== h * dpr) c.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#0F1A2E';
  ctx.fillRect(0, 0, w, h);
  fn(ctx, w, h);
}

function drawTrace(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  meanIcp: number,
  c: Compliance,
  tNow: number,
  withGrid: boolean,
  topPad = 8,
) {
  const padL = 36;
  const padR = 14;
  const padT = topPad;
  const padB = 22;
  const yMin = Math.max(0, meanIcp - 20);
  const yMax = meanIcp + 20;
  const yS = (v: number) => h - padB - ((v - yMin) / (yMax - yMin)) * (h - padT - padB);
  if (withGrid) {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let v = Math.ceil(yMin / 5) * 5; v <= yMax; v += 5) {
      ctx.beginPath();
      ctx.moveTo(padL, yS(v));
      ctx.lineTo(w - padR, yS(v));
      ctx.stroke();
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(String(v), padL - 4, yS(v) + 3);
    }
    ctx.fillStyle = '#5EEAD4';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('time (s) →', (padL + w - padR) / 2, h - 6);
  }
  ctx.strokeStyle = '#5EEAD4';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const N = 600;
  const window = 4; // seconds visible
  for (let i = 0; i < N; i++) {
    const t = tNow + (i / N) * window;
    const v = icpAt(t, meanIcp, c);
    const x = padL + (i / N) * (w - padL - padR);
    const y = yS(v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function PeakAnatomy({ compliance }: { compliance: Compliance }) {
  return (
    <div className="text-[12.5px] text-ink/85 leading-[1.6]">
      <ul className="list-none p-0 space-y-2">
        <li className="rounded-md border-l-[3px] border-l-brand-tealLight bg-surface-deeper px-3 py-2">
          <strong>P1, percussion wave.</strong> Pulse from the intracranial arterial system. Roughly constant across ICP.
        </li>
        <li className="rounded-md border-l-[3px] border-l-brand-amber bg-surface-deeper px-3 py-2">
          <strong>P2, tidal wave.</strong> Reflects intracranial compliance. Grows as compliance falls. Currently:{' '}
          <span className="font-bold text-brand-amber">{compliance}</span>.
        </li>
        <li className="rounded-md border-l-[3px] border-l-brand-purple bg-surface-deeper px-3 py-2">
          <strong>P3, dicrotic wave.</strong> Venous component. Smaller and relatively stable.
        </li>
      </ul>
      <p className="mt-3 text-[11.5px] text-ink-muted">
        Pathological progression: P1 &gt; P2 &gt; P3 (normal) → P2 ≈ P1 (low compliance) → P2 &gt; P1 (exhausted, rounded waveform).
      </p>
    </div>
  );
}
