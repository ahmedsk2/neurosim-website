'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout, Button } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';
import { PATTERNS, npiWithSedation, asymmetryFlag, type PupilPattern, type PupilSide } from './engine';

export default function PupilTrainer() {
  const [pattern, setPattern] = useState<PupilPattern>(PATTERNS[0]!);
  const [bis, setBis] = useState(80);
  const [shining, setShining] = useState(false);
  const tRef = useRef(0);
  const cv = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const adjustedLeftNpi = npiWithSedation(pattern.left.npi, bis);
  const adjustedRightNpi = npiWithSedation(pattern.right.npi, bis);
  const asym = asymmetryFlag(pattern.left, pattern.right);

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
          drawEye(ctx, w * 0.3, h * 0.5, pattern.left.size, shining, pattern.leftReactsToLight, tRef.current, 'L');
          drawEye(ctx, w * 0.7, h * 0.5, pattern.right.size, shining, pattern.rightReactsToLight, tRef.current, 'R');
          if (asym.significant) {
            ctx.strokeStyle = '#F59E0B';
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(w * 0.42, h * 0.5);
            ctx.lineTo(w * 0.58, h * 0.5);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#FCD34D';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`Δ ${asym.sizeAsymMm.toFixed(1)} mm`, w / 2, h * 0.5 - 6);
          }
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pattern, shining, asym.significant, asym.sizeAsymMm]);

  return (
    <WidgetShell
      eyebrow="Pupillometry · NPi"
      title="Pupil pattern trainer · bilateral measurements"
      footnote="Chen 2011, Olson 2016 (EU-NPi), Oddo 2018, Larson 1997."
    >
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 mb-3">
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPattern(p)}
            className={
              'rounded-md border px-2 py-1.5 text-[10.5px] font-semibold text-left ' +
              (pattern.id === p.id
                ? 'border-brand-teal bg-brand-teal/15 text-ink'
                : 'border-line bg-surface-deeper text-ink-muted hover:border-brand-teal hover:text-ink')
            }
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-2 mb-2.5">
        <SidePanel label="Left eye" side={pattern.left} adjustedNpi={adjustedLeftNpi} reactive={pattern.leftReactsToLight} />
        <SidePanel label="Right eye" side={pattern.right} adjustedNpi={adjustedRightNpi} reactive={pattern.rightReactsToLight} />
      </div>

      <div className={
        'mb-2.5 rounded-md border-l-[3px] px-3 py-2 text-[12px] leading-normal ' +
        (asym.significant
          ? 'border-l-status-danger bg-status-danger/10 text-status-dangerText'
          : 'border-l-status-good bg-surface-deeper text-ink/85')
      }>
        <strong>{asym.significant ? 'Anisocoria flagged' : 'Symmetric'}:</strong>{' '}
        size Δ {asym.sizeAsymMm.toFixed(1)} mm · NPi Δ {asym.npiAsym.toFixed(1)} ·{' '}
        {asym.significant
          ? 'unilateral lesion or fibre compression, investigate.'
          : 'within normal tolerance (< 1 mm size, < 0.7 NPi).'}
      </div>

      <WidgetGrid>
        <WidgetPanel title="Pupils, animate" subtitle="Click ‘Shine light’ to simulate the swinging-flashlight test.">
          <canvas ref={cv} className="block w-full" style={{ height: 220 }} />
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => setShining((v) => !v)}>
              {shining ? 'Stop light' : '▶ Shine light'}
            </Button>
          </div>
          <p className="mt-3 text-[12.5px] text-ink/85 leading-normal">
            <strong>Description:</strong> {pattern.description}
          </p>
          {pattern.action && (
            <p className="mt-2 text-[12.5px] text-brand-amber leading-normal">
              <strong>Action:</strong> {pattern.action}
            </p>
          )}
        </WidgetPanel>
        <WidgetPanel title="Sedation modifier (BIS-driven)">
          <p className="text-[12px] text-ink/85 leading-[1.55] mb-2">
            Deep sedation depresses NPi. When BIS &lt; 40, NPi reduced by{' '}
            <code className="font-mono text-brand-tealLight">((40 − BIS)/40) × 0.8</code>.
          </p>
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">BIS</label>
          <input
            type="range"
            min={0}
            max={100}
            value={bis}
            onChange={(e) => setBis(parseInt(e.target.value, 10))}
            className="w-full accent-brand-teal"
          />
          <div className="mt-2 grid grid-cols-2 gap-2 text-[12px]">
            <div className="rounded-md bg-surface-deeper px-2 py-1.5">
              <div className="text-[10px] text-ink-muted uppercase tracking-[0.12em]">Left NPi adj.</div>
              <div className="font-mono font-bold">
                {pattern.left.npi.toFixed(1)} → <span className="text-brand-tealLight">{adjustedLeftNpi.toFixed(1)}</span>
              </div>
            </div>
            <div className="rounded-md bg-surface-deeper px-2 py-1.5">
              <div className="text-[10px] text-ink-muted uppercase tracking-[0.12em]">Right NPi adj.</div>
              <div className="font-mono font-bold">
                {pattern.right.npi.toFixed(1)} → <span className="text-brand-tealLight">{adjustedRightNpi.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11.5px] text-ink-muted leading-normal">
            Sedation symmetrically depresses both NPis, but doesn&apos;t cause anisocoria. If you see a
            real L/R difference under sedation, suspect a structural lesion, not the drugs.
          </p>
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}

function SidePanel({
  label,
  side,
  adjustedNpi,
  reactive,
}: {
  label: string;
  side: PupilSide;
  adjustedNpi: number;
  reactive: boolean;
}) {
  const npiStatus: 'good' | 'warn' | 'danger' = adjustedNpi >= 4 ? 'good' : adjustedNpi >= 3 ? 'warn' : 'danger';
  return (
    <div className="rounded-md border border-line bg-surface-card p-3">
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-tealLight mb-2 flex items-center gap-2">
        {label}
        {!reactive && <span className="rounded-full bg-status-danger px-1.5 py-0.5 text-[9px] text-white">FIXED</span>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Readout label="Size" value={side.size.toFixed(1)} unit="mm" />
        <Readout label="NPi (adj.)" value={adjustedNpi.toFixed(1)} status={npiStatus} hint={`raw ${side.npi.toFixed(1)}`} />
        <Readout
          label="Constriction"
          value={side.constrictionPctPerSec.toFixed(0)}
          unit="%/s"
          status={side.constrictionPctPerSec >= 16 ? 'good' : side.constrictionPctPerSec >= 8 ? 'warn' : 'danger'}
        />
        <Readout
          label="Latency"
          value={side.latencyMs === 0 ? 'absent' : side.latencyMs.toFixed(0)}
          unit={side.latencyMs === 0 ? '' : 'ms'}
          status={side.latencyMs === 0 ? 'danger' : side.latencyMs > 350 ? 'warn' : 'good'}
        />
        <Readout
          label="Dilation velocity"
          value={side.dilationVelMmPerSec.toFixed(1)}
          unit="mm/s"
          hint="post-light off"
        />
      </div>
    </div>
  );
}

function drawEye(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  sizeMm: number,
  shining: boolean,
  reacts: boolean,
  t: number,
  label: string,
) {
  ctx.fillStyle = '#E2E8F0';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 60, 32, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#94A3B8';
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
  ctx.fill();
  let size = sizeMm;
  if (shining && reacts) size = sizeMm * (0.55 + 0.10 * Math.sin(t * 2));
  const pxRadius = (size / 8) * 16;
  ctx.fillStyle = '#0F1A2E';
  ctx.beginPath();
  ctx.arc(cx, cy, pxRadius, 0, 2 * Math.PI);
  ctx.fill();
  if (shining) {
    ctx.fillStyle = '#FCD34D';
    ctx.beginPath();
    ctx.arc(cx - 7, cy - 7, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.fillStyle = '#5EEAD4';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, cx, cy + 60);
  if (!reacts) {
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('FIXED', cx, cy + 76);
  }
}
