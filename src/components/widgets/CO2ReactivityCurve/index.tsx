'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout, ToggleRow } from '@/components/ui';
import { WidgetShell, WidgetPanel } from '../shared/WidgetShell';

type Reactivity = 'intact' | 'partial' | 'lost';

const SCALAR: Record<Reactivity, number> = { intact: 1, partial: 0.4, lost: 0 };

function fPaco2(paco2: number, react: Reactivity): number {
  const s = SCALAR[react];
  return Math.max(0.4, Math.min(1.45, 1 + (paco2 - 40) * 0.03 * s));
}

export default function CO2ReactivityCurve() {
  const [paco2, setPaco2] = useState(40);
  const [react, setReact] = useState<Reactivity>('intact');
  const cv = useRef<HTMLCanvasElement>(null);
  const f = fPaco2(paco2, react);

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
    const xMin = 20;
    const xMax = 60;
    const yMin = 30;
    const yMax = 160;
    const xS = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * (w - padL - padR);
    const yS = (y: number) => h - padB - ((y - yMin) / (yMax - yMin)) * (h - padT - padB);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let x = xMin; x <= xMax; x += 5) {
      ctx.beginPath();
      ctx.moveTo(xS(x), padT);
      ctx.lineTo(xS(x), h - padB);
      ctx.stroke();
    }
    for (let y = yMin; y <= yMax; y += 20) {
      ctx.beginPath();
      ctx.moveTo(padL, yS(y));
      ctx.lineTo(w - padR, yS(y));
      ctx.stroke();
    }
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
    for (let x = xMin; x <= xMax; x += 10) ctx.fillText(String(x), xS(x), h - padB + 14);
    ctx.textAlign = 'right';
    for (let y = yMin; y <= yMax; y += 30) ctx.fillText(String(y), padL - 4, yS(y) + 3);
    // Curve
    ctx.strokeStyle = '#14B8A6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = xMin; x <= xMax; x += 0.5) {
      const cbf = fPaco2(x, react) * 100;
      const px = xS(x);
      const py = yS(Math.min(yMax, Math.max(yMin, cbf)));
      if (x === xMin) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    // Operating point
    ctx.fillStyle = '#F59E0B';
    ctx.strokeStyle = '#0F1A2E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xS(paco2), yS(f * 100), 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    // Axis labels
    ctx.fillStyle = '#5EEAD4';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PaCO₂ (mmHg)', (padL + w - padR) / 2, h - 8);
    ctx.save();
    ctx.translate(13, (padT + h - padB) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('CBF (% baseline)', 0, 0);
    ctx.restore();
  });

  return (
    <WidgetShell
      eyebrow="Foundation · CO₂ reactivity"
      title="CBF vs PaCO₂"
      controls={
        <ToggleRow<Reactivity>
          label="Reactivity"
          value={react}
          onChange={setReact}
          options={[
            { value: 'intact', label: 'Intact' },
            { value: 'partial', label: 'Partial' },
            { value: 'lost', label: 'Lost' },
          ]}
        />
      }
      footnote="3% CBF per mmHg PaCO₂ around normocapnia. Reivich 1964; Brian 1998."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="PaCO₂" value={paco2} unit="mmHg" />
        <Readout label="CBF" value={(f * 100).toFixed(0)} unit="% baseline" status={f > 0.85 && f < 1.15 ? 'good' : f > 0.6 && f < 1.3 ? 'warn' : 'danger'} />
        <Readout label="ICP delta" value={`${((f - 1) * 8).toFixed(1)}`} unit="mmHg approx" hint="Caveat: depends on compliance state" />
      </div>
      <WidgetPanel title="CO₂ reactivity curve">
        <canvas ref={cv} className="block w-full" style={{ height: 280 }} />
        <div className="mt-3">
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">PaCO₂</label>
          <input
            type="range"
            min={20}
            max={60}
            value={paco2}
            onChange={(e) => setPaco2(parseInt(e.target.value, 10))}
            className="w-full accent-brand-teal"
          />
        </div>
      </WidgetPanel>
    </WidgetShell>
  );
}
