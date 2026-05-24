'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetPanel } from '../shared/WidgetShell';

export function fPaO2(pao2: number): number {
  if (pao2 >= 50) return 1;
  if (pao2 >= 30) return 1 + (50 - pao2) * 0.04;
  return 1 + 20 * 0.04 + (30 - pao2) * 0.05;
}

export default function O2ReactivityCurve() {
  const [pao2, setPao2] = useState(90);
  const cv = useRef<HTMLCanvasElement>(null);
  const f = fPaO2(pao2);

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
    const xMin = 0;
    const xMax = 150;
    const yMin = 90;
    const yMax = 250;
    const xS = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * (w - padL - padR);
    const yS = (y: number) => h - padB - ((y - yMin) / (yMax - yMin)) * (h - padT - padB);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= 150; x += 25) {
      ctx.beginPath();
      ctx.moveTo(xS(x), padT);
      ctx.lineTo(xS(x), h - padB);
      ctx.stroke();
    }
    for (let y = 100; y <= 240; y += 30) {
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
    for (let x = 0; x <= 150; x += 30) ctx.fillText(String(x), xS(x), h - padB + 14);
    ctx.textAlign = 'right';
    for (let y = 100; y <= 240; y += 30) ctx.fillText(String(y), padL - 4, yS(y) + 3);

    ctx.strokeStyle = '#14B8A6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = xMin; x <= xMax; x += 1) {
      const cbf = fPaO2(x) * 100;
      const px = xS(x);
      const py = yS(Math.min(yMax, Math.max(yMin, cbf)));
      if (x === xMin) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.strokeStyle = '#0F1A2E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xS(pao2), yS(f * 100), 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#EF4444';
    ctx.setLineDash([3, 3]);
    [['Threshold 50', 50], ['Acceleration 30', 30]].forEach(([lbl, v]) => {
      ctx.beginPath();
      ctx.moveTo(xS(v as number), padT);
      ctx.lineTo(xS(v as number), h - padB);
      ctx.stroke();
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(lbl as string, xS(v as number), padT + 12);
    });
    ctx.setLineDash([]);
    ctx.fillStyle = '#5EEAD4';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PaO₂ (mmHg)', (padL + w - padR) / 2, h - 6);
    ctx.save();
    ctx.translate(13, (padT + h - padB) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('CBF (% baseline)', 0, 0);
    ctx.restore();
  }, [pao2, f]);

  const status: 'good' | 'warn' | 'danger' = pao2 >= 50 ? 'good' : pao2 >= 30 ? 'warn' : 'danger';

  return (
    <WidgetShell
      eyebrow="Foundation · O₂ reactivity"
      title="Threshold-stepped CBF response to PaO₂"
      footnote="Brown 1985; Gleason 1989 (pediatric)."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="PaO₂" value={pao2} unit="mmHg" status={status} />
        <Readout label="CBF" value={(f * 100).toFixed(0)} unit="% baseline" status={f > 1.5 ? 'danger' : f > 1.2 ? 'warn' : 'good'} />
        <Readout label="Regime" value={pao2 >= 50 ? 'silent' : pao2 >= 30 ? 'modest' : 'aggressive'} status={status} hint={pao2 >= 50 ? 'no CBF effect' : pao2 >= 30 ? '~4%/mmHg below 50' : 'further +5%/mmHg below 30'} />
      </div>
      <WidgetPanel title="O₂ reactivity curve">
        <canvas ref={cv} className="block w-full" style={{ height: 260 }} />
        <input
          type="range"
          min={20}
          max={150}
          value={pao2}
          onChange={(e) => setPao2(parseInt(e.target.value, 10))}
          className="w-full mt-3 accent-brand-teal"
          aria-label="PaO₂ slider"
        />
      </WidgetPanel>
    </WidgetShell>
  );
}
