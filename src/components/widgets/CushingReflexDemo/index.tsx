'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

const THRESHOLD = 30; // mmHg ICP at which Cushing reflex begins

export function hrFor(icp: number, baselineHr = 100): number {
  if (icp < THRESHOLD) return baselineHr;
  return Math.max(38, baselineHr - (icp - THRESHOLD) * 1.6);
}
export function sbpFor(icp: number, baselineSbp = 110): number {
  if (icp < THRESHOLD) return baselineSbp;
  return Math.min(220, baselineSbp + (icp - THRESHOLD) * 2.4);
}
export function respPattern(icp: number): 'normal' | 'cheyne_stokes' | 'biot' | 'apnoea' {
  if (icp < THRESHOLD) return 'normal';
  if (icp < 40) return 'cheyne_stokes';
  if (icp < 50) return 'biot';
  return 'apnoea';
}

const RESP_LABEL: Record<ReturnType<typeof respPattern>, string> = {
  normal: 'Normal regular',
  cheyne_stokes: 'Cheyne-Stokes',
  biot: "Biot's irregular",
  apnoea: 'Apneustic / apnoea',
};

export default function CushingReflexDemo() {
  const [icp, setIcp] = useState(20);
  const cv = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const hr = hrFor(icp);
  const sbp = sbpFor(icp);
  const resp = respPattern(icp);
  const triadActive = icp >= THRESHOLD;

  useEffect(() => {
    const draw = () => {
      tRef.current += 0.020;
      const c = cv.current;
      if (c) {
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
          // Three rows: ECG, BP, Resp
          const rowH = h / 3;
          drawTrace(ctx, w, rowH, 0, '#5EEAD4', 'ECG (HR ' + hr.toFixed(0) + ')', (t) => {
            const cycle = (t * (hr / 60)) % 1;
            if (cycle < 0.05) return 30;
            if (cycle < 0.07) return -10;
            if (cycle < 0.4) return 5 * Math.sin(2 * Math.PI * (cycle - 0.07) * 3);
            return 0;
          });
          drawTrace(ctx, w, rowH, rowH, '#EF4444', 'ABP (SBP ' + sbp.toFixed(0) + ')', (t) => {
            const cycle = (t * (hr / 60)) % 1;
            return 30 * Math.exp(-((cycle - 0.05) ** 2) / 0.005) - 10 + 4 * Math.sin(2 * Math.PI * 0.25 * t);
          });
          drawTrace(ctx, w, rowH, 2 * rowH, '#FCD34D', 'Resp · ' + RESP_LABEL[resp], (t) => respWave(t, resp));
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [icp, hr, sbp, resp]);

  return (
    <WidgetShell
      eyebrow="Cushing reflex"
      title="ICP × brainstem ischemia → BP up, HR down, irregular respiration"
      footnote="Cushing 1901; Fodstad 2006."
      status={triadActive ? { variant: 'danger', label: 'Cushing triad active' } : { variant: 'good', label: 'No triad' }}
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-4 mb-2.5">
        <Readout label="ICP" value={icp} unit="mmHg" status={icp < 20 ? 'good' : icp < 30 ? 'warn' : 'danger'} />
        <Readout label="HR" value={hr.toFixed(0)} unit="bpm" status={hr < 60 ? 'danger' : 'good'} hint={triadActive ? 'Vagal-mediated bradycardia' : 'baseline'} />
        <Readout label="SBP" value={sbp.toFixed(0)} unit="mmHg" status={sbp > 160 ? 'danger' : 'good'} hint={triadActive ? 'Sympathetic surge' : 'baseline'} />
        <Readout label="Respiration" value={resp.replace('_', ' ')} status={resp === 'normal' ? 'good' : 'danger'} hint={RESP_LABEL[resp]} />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Live three-row monitor">
          <canvas ref={cv} className="block w-full" style={{ height: 270 }} />
        </WidgetPanel>
        <WidgetPanel title="Drag ICP across the threshold">
          <input
            type="range"
            min={5}
            max={60}
            value={icp}
            onChange={(e) => setIcp(parseInt(e.target.value, 10))}
            className="w-full accent-brand-teal"
            aria-label="ICP slider"
          />
          <div className="grid grid-cols-4 gap-1 text-center text-[10px] text-ink-muted mt-2">
            {[10, 20, 30, 50].map((m) => (
              <div key={m} className="border-t border-line pt-1 font-mono">{m}</div>
            ))}
          </div>
          <p className="mt-3 text-[12.5px] text-ink/85 leading-[1.55]">
            The Cushing triad, hypertension, bradycardia, irregular respiration, emerges when brainstem
            perfusion is critically low (typically ICP {'>'} 30 mmHg with marginal CPP). It is a <strong>late, ominous</strong>{' '}
            sign, herniation may already be in progress. Don't wait for it.
          </p>
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}

function respWave(t: number, p: ReturnType<typeof respPattern>): number {
  if (p === 'normal') return 18 * Math.sin(2 * Math.PI * 0.28 * t);
  if (p === 'cheyne_stokes') {
    const env = 0.5 + 0.5 * Math.sin(2 * Math.PI * t / 30);
    return 22 * env * Math.sin(2 * Math.PI * 0.32 * t);
  }
  if (p === 'biot') {
    const phase = (t % 12) / 12;
    if (phase < 0.6) return 22 * Math.sin(2 * Math.PI * 0.5 * t);
    return 0;
  }
  // apnoea / apneustic
  const phase = (t % 18) / 18;
  if (phase < 0.15) return 30;
  if (phase < 0.7) return 20;
  return 0;
}

function drawTrace(
  ctx: CanvasRenderingContext2D,
  w: number,
  rowH: number,
  yOffset: number,
  color: string,
  label: string,
  fn: (t: number) => number,
) {
  const padL = 70;
  const padR = 14;
  const yMid = yOffset + rowH / 2;
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(label, padL - 8, yMid + 4);
  ctx.strokeStyle = '#1e293b';
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  ctx.moveTo(padL, yMid);
  ctx.lineTo(w - padR, yMid);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  const N = 600;
  const window = 6;
  for (let i = 0; i < N; i++) {
    const t = (i / N) * window + performance.now() / 1000;
    const v = fn(t);
    const x = padL + (i / N) * (w - padL - padR);
    const y = yMid - v * 0.6;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}
