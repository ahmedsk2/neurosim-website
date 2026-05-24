'use client';

import { useState, useRef, useEffect } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

function classify(lp: number, gluc: number) {
  if (lp < 25 && gluc >= 0.8 && gluc <= 4) return { label: 'Normal', status: 'good' as const, action: 'Maintain' };
  if (lp >= 25 && gluc >= 0.8) return { label: 'Mitochondrial dysfunction', status: 'warn' as const, action: 'Optimize CDO₂; consider ↑ glucose support' };
  if (lp >= 25 && gluc < 0.8) return { label: 'Ischemia', status: 'danger' as const, action: 'Treat, raise CPP, optimise PbtO₂, exclude vasospasm' };
  if (gluc > 4 && lp < 25) return { label: 'Hyperglycolysis', status: 'warn' as const, action: 'Re-evaluate sedation, exclude seizure' };
  return { label: 'Mixed / borderline', status: 'warn' as const, action: 'Trend, do not act on single sample' };
}

export default function MicrodialysisGrid() {
  const [lp, setLp] = useState(20);
  const [gluc, setGluc] = useState(1.5);
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
    const padL = 50;
    const padR = 14;
    const padT = 16;
    const padB = 30;
    const xMin = 0;
    const xMax = 6;
    const yMin = 0;
    const yMax = 60;
    const xS = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * (w - padL - padR);
    const yS = (y: number) => h - padB - ((y - yMin) / (yMax - yMin)) * (h - padT - padB);
    // Quadrants
    const quad = (x0: number, y0: number, x1: number, y1: number, fill: string) => {
      ctx.fillStyle = fill;
      ctx.fillRect(xS(x0), yS(y1), xS(x1) - xS(x0), yS(y0) - yS(y1));
    };
    quad(0, 0, 0.8, 25, 'rgba(239,68,68,0.10)'); // ischemia
    quad(0.8, 25, 4, 60, 'rgba(245,158,11,0.10)'); // mito
    quad(0.8, 0, 4, 25, 'rgba(16,185,129,0.10)'); // normal
    quad(4, 0, 6, 60, 'rgba(139,92,246,0.10)'); // hyperglycolysis

    // Lines
    ctx.strokeStyle = '#475569';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(xS(0.8), padT);
    ctx.lineTo(xS(0.8), h - padB);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xS(4), padT);
    ctx.lineTo(xS(4), h - padB);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padL, yS(25));
    ctx.lineTo(w - padR, yS(25));
    ctx.stroke();
    ctx.setLineDash([]);

    // Axis labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    [0, 1, 2, 3, 4, 5, 6].forEach((x) => ctx.fillText(String(x), xS(x), h - padB + 14));
    ctx.textAlign = 'right';
    [0, 20, 40, 60].forEach((y) => ctx.fillText(String(y), padL - 4, yS(y) + 3));
    ctx.fillStyle = '#5EEAD4';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Glucose (mmol/L)', (padL + w - padR) / 2, h - 8);
    ctx.save();
    ctx.translate(13, (padT + h - padB) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('L/P ratio', 0, 0);
    ctx.restore();

    // Quadrant labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Ischemia', xS(0.4), yS(50));
    ctx.fillText('Mitochondrial', xS(2.4), yS(50));
    ctx.fillText('Normal', xS(2.4), yS(12));
    ctx.fillText('Hyperglycolysis', xS(5), yS(40));

    // Operating point
    ctx.fillStyle = '#F59E0B';
    ctx.strokeStyle = '#0F1A2E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xS(gluc), yS(lp), 7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }, [lp, gluc]);

  const c = classify(lp, gluc);
  return (
    <WidgetShell
      eyebrow="Microdialysis · L/P × glucose"
      title="Quadrant interpretation grid"
      footnote="Hutchinson 2015 (consensus); Engström 2005."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="L/P ratio" value={lp.toFixed(0)} status={lp < 25 ? 'good' : 'warn'} />
        <Readout label="Glucose" value={gluc.toFixed(2)} unit="mmol/L" status={gluc < 0.8 ? 'danger' : gluc > 4 ? 'warn' : 'good'} />
        <Readout label="Pattern" value={c.label} status={c.status} hint={c.action} />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Quadrant grid">
          <canvas ref={cv} className="block w-full" style={{ height: 320 }} />
        </WidgetPanel>
        <WidgetPanel title="Drag the cursor">
          <Slider label="L/P ratio" min={5} max={60} value={lp} onChange={setLp} unit="" />
          <SliderFloat label="Glucose" min={0.1} max={6} step={0.1} value={gluc} onChange={setGluc} unit="mmol/L" />
          <ul className="mt-3 text-[12px] text-ink/85 leading-[1.55] space-y-1.5 list-none p-0">
            <li>• Glucose &lt; 0.8 → suspect ischemia.</li>
            <li>• L/P ≥ 25 + glucose normal → mitochondrial dysfunction.</li>
            <li>• Glucose &gt; 4 + low L/P → hyperglycolysis (seizure, stress).</li>
            <li>• Trend over hours; do not act on a single sample.</li>
          </ul>
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}

function Slider({ label, min, max, value, onChange, unit }: { label: string; min: number; max: number; value: number; onChange: (v: number) => void; unit: string }) {
  return (
    <label className="block mb-3 last:mb-0">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">{label}</span>
        <span className="font-mono text-[13px] font-bold text-brand-tealLight">{value} <span className="text-[10px] text-ink-dim font-normal">{unit}</span></span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(parseInt(e.target.value, 10))} className="w-full accent-brand-teal" />
    </label>
  );
}
function SliderFloat({ label, min, max, step, value, onChange, unit }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; unit: string }) {
  return (
    <label className="block mb-3 last:mb-0">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">{label}</span>
        <span className="font-mono text-[13px] font-bold text-brand-tealLight">{value.toFixed(2)} <span className="text-[10px] text-ink-dim font-normal">{unit}</span></span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-brand-teal" />
    </label>
  );
}
