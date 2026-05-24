'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetPanel } from '../shared/WidgetShell';

export default function LassenCurve() {
  const [map, setMap] = useState(80);
  const [lla, setLla] = useState(60);
  const [ula, setUla] = useState(150);
  const cv = useRef<HTMLCanvasElement>(null);

  let cbf;
  if (map < lla) cbf = (map / lla) * 50;
  else if (map < ula) cbf = 50;
  else cbf = 50 + ((map - ula) / (200 - ula)) * 40;
  const status: 'good' | 'warn' | 'danger' = map >= lla && map <= ula ? 'good' : map < lla ? 'danger' : 'warn';

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
    const padT = 16;
    const padB = 28;
    const xMin = 0;
    const xMax = 200;
    const yMin = 0;
    const yMax = 100;
    const xS = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * (w - padL - padR);
    const yS = (y: number) => h - padB - ((y - yMin) / (yMax - yMin)) * (h - padT - padB);

    ctx.fillStyle = 'rgba(16, 185, 129, 0.10)';
    ctx.fillRect(xS(lla), padT, xS(ula) - xS(lla), h - padT - padB);

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
    for (let x = 0; x <= 200; x += 50) ctx.fillText(String(x), xS(x), h - padB + 14);
    ctx.textAlign = 'right';
    for (let y = 0; y <= 100; y += 25) ctx.fillText(String(y), padL - 4, yS(y) + 3);

    ctx.strokeStyle = '#14B8A6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = xMin; x <= xMax; x += 2) {
      let y;
      if (x < lla) y = (x / lla) * 50;
      else if (x < ula) y = 50;
      else y = 50 + ((x - ula) / (xMax - ula)) * 40;
      const px = xS(x);
      const py = yS(y);
      if (x === xMin) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.strokeStyle = '#0F1A2E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xS(map), yS(cbf), 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#EF4444';
    ctx.setLineDash([3, 3]);
    [['LLA', lla], ['ULA', ula]].forEach(([lbl, v]) => {
      ctx.beginPath();
      ctx.moveTo(xS(v as number), padT);
      ctx.lineTo(xS(v as number), h - padB);
      ctx.stroke();
      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${lbl} ${v}`, xS(v as number), padT - 4);
    });
    ctx.setLineDash([]);
    ctx.fillStyle = '#5EEAD4';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MAP (mmHg)', (padL + w - padR) / 2, h - 6);
    ctx.save();
    ctx.translate(13, (padT + h - padB) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('CBF (mL/100g/min)', 0, 0);
    ctx.restore();
  }, [map, cbf, lla, ula]);

  return (
    <WidgetShell
      eyebrow="Foundation · autoregulation"
      title="Lassen curve"
      footnote="Lassen 1959. Plateau in healthy adults ~60–150 mmHg; narrower and lower in young children."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="MAP" value={map} unit="mmHg" />
        <Readout label="CBF" value={cbf.toFixed(0)} unit="mL/100g/min" status={status} />
        <Readout label="State" value={status === 'good' ? 'on plateau' : status === 'danger' ? 'below LLA' : 'above ULA'} status={status} />
      </div>
      <WidgetPanel title="Pressure–flow curve">
        <canvas ref={cv} className="block w-full" style={{ height: 260 }} />
        <div className="grid grid-cols-3 gap-3 mt-3">
          <Slider label="MAP" min={20} max={200} value={map} onChange={setMap} unit="mmHg" />
          <Slider label="LLA" min={30} max={90} value={lla} onChange={setLla} unit="mmHg" />
          <Slider label="ULA" min={120} max={180} value={ula} onChange={setUla} unit="mmHg" />
        </div>
      </WidgetPanel>
    </WidgetShell>
  );
}

function Slider({ label, min, max, value, onChange, unit }: { label: string; min: number; max: number; value: number; onChange: (v: number) => void; unit: string }) {
  return (
    <label className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">{label}</span>
        <span className="font-mono text-[13px] font-bold text-brand-tealLight">{value} <span className="text-[10px] text-ink-dim font-normal">{unit}</span></span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(parseInt(e.target.value, 10))} className="accent-brand-teal" />
    </label>
  );
}
