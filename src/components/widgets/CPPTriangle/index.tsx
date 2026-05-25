'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

export default function CPPTriangle() {
  const [map, setMap] = useState(80);
  const [icp, setIcp] = useState(15);
  const [lla, setLla] = useState(50);
  const [ula, setUla] = useState(140);
  const cpp = map - icp;

  const cppCv = useRef<HTMLCanvasElement>(null);
  const lassenCv = useRef<HTMLCanvasElement>(null);

  function drawCPPDiagram() {
    const cv = cppCv.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    cv.width = w * dpr;
    cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0F1A2E';
    ctx.fillRect(0, 0, w, h);

    // Bars: MAP (top) − ICP (red) = CPP (teal)
    const barH = 26;
    const padL = 60;
    const padR = 16;
    const usable = w - padL - padR;
    const scale = usable / 160;

    const yMap = 24;
    const yIcp = yMap + barH + 18;
    const yCpp = yIcp + barH + 18;

    const drawBar = (label: string, val: number, y: number, color: string) => {
      const wPx = val * scale;
      ctx.fillStyle = '#152238';
      ctx.fillRect(padL, y, usable, barH);
      ctx.fillStyle = color;
      ctx.fillRect(padL, y, wPx, barH);
      ctx.strokeStyle = '#2a3a55';
      ctx.lineWidth = 1;
      ctx.strokeRect(padL, y, usable, barH);
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(label, padL - 8, y + barH / 2 + 4);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 13px Consolas, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(val.toFixed(0), padL + wPx + 4, y + barH / 2 + 4);
    };

    drawBar('MAP', map, yMap, '#5EEAD4');
    drawBar('ICP', icp, yIcp, '#EF4444');
    drawBar('CPP', cpp, yCpp, '#14B8A6');

    // Equation
    ctx.fillStyle = '#FCD34D';
    ctx.font = 'italic bold 12px Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('CPP = MAP − ICP', padL, h - 8);
  }

  function drawLassen() {
    const cv = lassenCv.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    cv.width = w * dpr;
    cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0F1A2E';
    ctx.fillRect(0, 0, w, h);

    const padL = 38;
    const padR = 14;
    const padT = 16;
    const padB = 30;
    const xMin = 0;
    const xMax = 200;
    const yMin = 0;
    const yMax = 100;
    const xS = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * (w - padL - padR);
    const yS = (y: number) => h - padB - ((y - yMin) / (yMax - yMin)) * (h - padT - padB);

    // Plateau zone
    ctx.fillStyle = 'rgba(16, 185, 129, 0.10)';
    ctx.fillRect(xS(lla), padT, xS(ula) - xS(lla), h - padT - padB);

    // Axes
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

    // Lassen curve: rise 0→LLA (linear), plateau LLA→ULA (~50 ml/100g/min), rise ULA→200 (forced)
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

    // Operating point
    let yOp;
    if (cpp < lla) yOp = (cpp / lla) * 50;
    else if (cpp < ula) yOp = 50;
    else yOp = 50 + ((cpp - ula) / (xMax - ula)) * 40;
    ctx.fillStyle = '#F59E0B';
    ctx.strokeStyle = '#0F1A2E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xS(cpp), yS(yOp), 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`CPP ${cpp.toFixed(0)}`, xS(cpp), yS(yOp) - 12);

    // LLA / ULA labels
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    [
      ['LLA', lla],
      ['ULA', ula],
    ].forEach(([lbl, v]) => {
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

    // Axis titles
    ctx.fillStyle = '#5EEAD4';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CPP (mmHg)', (padL + w - padR) / 2, h - 8);
    ctx.save();
    ctx.translate(13, (padT + h - padB) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('CBF (mL/100g/min)', 0, 0);
    ctx.restore();
  }

  useEffect(() => {
    drawCPPDiagram();
    drawLassen();
  });

  const status: 'good' | 'warn' | 'danger' = cpp >= lla && cpp <= ula ? 'good' : cpp < lla ? 'danger' : 'warn';

  return (
    <WidgetShell
      eyebrow="Derived index · CPP"
      title="CPP triangle on the Lassen curve"
      footnote="CPP = MAP − ICP. Same number, two paths, the path matters."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="MAP" value={map} unit="mmHg" />
        <Readout label="ICP" value={icp} unit="mmHg" />
        <Readout
          label="CPP"
          value={cpp}
          unit="mmHg"
          status={status}
          hint={status === 'good' ? 'On plateau' : status === 'danger' ? 'Below LLA, pressure-passive risk' : 'Above ULA, forced hyperperfusion'}
        />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Operating point on Lassen curve">
          <canvas ref={lassenCv} className="block w-full" style={{ height: 260 }} />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Slider label="LLA" min={30} max={80} value={lla} onChange={setLla} unit="mmHg" />
            <Slider label="ULA" min={100} max={170} value={ula} onChange={setUla} unit="mmHg" />
          </div>
        </WidgetPanel>
        <WidgetPanel title="Inputs (MAP, ICP)">
          <canvas ref={cppCv} className="block w-full" style={{ height: 180 }} />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Slider label="MAP" min={30} max={150} value={map} onChange={setMap} unit="mmHg" />
            <Slider label="ICP" min={0} max={50} value={icp} onChange={setIcp} unit="mmHg" />
          </div>
        </WidgetPanel>
      </WidgetGrid>
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
