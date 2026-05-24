'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetPanel } from '../shared/WidgetShell';
import { icpAt, deltaVFor, elastanceAt, icpAfterVolume } from './engine';

export default function MarmarouPVCurve() {
  const [icp, setIcp] = useState(15);
  const [pvi, setPvi] = useState(20);
  const params = { icpBaseline: 5, pvi };
  const cv = useRef<HTMLCanvasElement>(null);
  const dV = deltaVFor(icp, params);
  const elastance = elastanceAt(dV, params);
  const icpPlus1 = icpAfterVolume(icp, 1, params);

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
    const padL = 50;
    const padR = 14;
    const padT = 16;
    const padB = 30;
    const xMin = -10;
    const xMax = 30;
    const yMin = 0;
    const yMax = 80;
    const xS = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * (w - padL - padR);
    const yS = (y: number) => h - padB - ((y - yMin) / (yMax - yMin)) * (h - padT - padB);
    // Colour zones by ICP value (match the canonical 4-phase teaching curve)
    const colorFor = (icpVal: number): string => {
      if (icpVal < 12) return '#2563EB';  // blue: compensation
      if (icpVal < 22) return '#F59E0B';  // yellow: decreasing compliance
      if (icpVal < 65) return '#DC2626';  // red: minimal compliance (ischaemia / herniation risk)
      return '#6B7280';                    // gray: microvascular collapse
    };
    // Background tints removed: bands were dominating the canvas visually and
    // the curve itself carries the 4-phase colour coding. The phase legend
    // in the surrounding UI explains the colour scheme.

    // Axes (no grid, simple frame to match the conceptual reference)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, h - padB);
    ctx.lineTo(w - padR, h - padB);
    ctx.stroke();
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    for (let x = -10; x <= 30; x += 10) ctx.fillText(String(x), xS(x), h - padB + 14);
    ctx.textAlign = 'right';
    for (let y = 0; y <= 80; y += 20) ctx.fillText(String(y), padL - 4, yS(y) + 3);

    // Curve, painted segment-by-segment in the 4 phase colours
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    let prevX = xS(xMin);
    let prevY = yS(Math.min(yMax, icpAt(xMin, params)));
    let prevColor = colorFor(icpAt(xMin, params));
    for (let x = xMin + 0.2; x <= xMax; x += 0.2) {
      const yVal = icpAt(x, params);
      const px = xS(x);
      const py = yS(Math.min(yMax, yVal));
      const c = colorFor(yVal);
      ctx.beginPath();
      ctx.strokeStyle = prevColor;
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(px, py);
      ctx.stroke();
      prevX = px;
      prevY = py;
      prevColor = c;
    }

    // Operating point
    ctx.fillStyle = '#F59E0B';
    ctx.strokeStyle = '#0F1A2E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xS(dV), yS(Math.min(yMax, icp)), 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    // +1 mL arrow
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(xS(dV), yS(Math.min(yMax, icp)));
    ctx.lineTo(xS(dV + 1), yS(Math.min(yMax, icpPlus1)));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`+1 mL → ICP ${icpPlus1.toFixed(0)}`, xS(dV) + 10, yS(Math.min(yMax, icp)) - 8);

    ctx.fillStyle = '#5EEAD4';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ΔV (mL)', (padL + w - padR) / 2, h - 8);
    ctx.save();
    ctx.translate(13, (padT + h - padB) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('ICP (mmHg)', 0, 0);
    ctx.restore();
  });

  const status: 'good' | 'warn' | 'danger' = elastance < 1 ? 'good' : elastance < 3 ? 'warn' : 'danger';
  return (
    <WidgetShell
      eyebrow="Foundation · pressure-volume"
      title="Marmarou pressure-volume curve"
      footnote="Marmarou 1975, Avezaat 1979. PVI ~20 mL adult."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-4 mb-2.5">
        <Readout label="ICP baseline" value={params.icpBaseline} unit="mmHg" />
        <Readout label="ICP now" value={icp} unit="mmHg" />
        <Readout
          label="Local elastance"
          value={elastance.toFixed(2)}
          unit="mmHg/mL"
          status={status}
          hint={status === 'good' ? 'Compliant' : status === 'warn' ? 'Compromised' : 'Steep, exhausted'}
        />
        <Readout
          label="+ 1 mL forecast"
          value={icpPlus1.toFixed(0)}
          unit="mmHg"
          status={icpPlus1 - icp < 5 ? 'good' : icpPlus1 - icp < 15 ? 'warn' : 'danger'}
          hint={`Δ ${(icpPlus1 - icp).toFixed(1)} mmHg`}
        />
      </div>
      <WidgetPanel
        title="Pressure-volume curve"
        subtitle="Drag the operating point: same +1 mL has very different effect at different starting ICP."
      >
        <canvas ref={cv} className="block w-full" style={{ height: 280 }} />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Slider label="ICP" min={5} max={50} value={icp} onChange={setIcp} unit="mmHg" />
          <Slider label="PVI" min={10} max={30} value={pvi} onChange={setPvi} unit="mL" />
        </div>
      </WidgetPanel>
    </WidgetShell>
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
    <label className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
          {label}
        </span>
        <span className="font-mono text-[13px] font-bold text-brand-tealLight">
          {value} <span className="text-[10px] text-ink-dim font-normal">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="accent-brand-teal"
      />
    </label>
  );
}
