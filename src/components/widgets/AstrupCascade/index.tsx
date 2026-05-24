'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetPanel } from '../shared/WidgetShell';
import { THRESHOLDS, bandFor, eegSample } from './engine';

export default function AstrupCascade() {
  const [cbf, setCbf] = useState(50);
  const cv = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const draw = (now: number) => {
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
          tRef.current += 0.016;
          ctx.strokeStyle = '#5EEAD4';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          const samplesAcross = 800;
          const dt = 4 / samplesAcross; // 4 second window
          for (let i = 0; i < samplesAcross; i++) {
            const t = tRef.current + i * dt;
            const v = eegSample(t, cbf);
            const x = (i / samplesAcross) * w;
            const y = h / 2 - v * 0.5;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          // baseline
          ctx.strokeStyle = '#475569';
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(0, h / 2);
          ctx.lineTo(w, h / 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cbf]);

  const cur = bandFor(cbf);

  return (
    <WidgetShell
      eyebrow="Foundation · Astrup cascade"
      title="EEG morphology vs cerebral blood flow"
      footnote="Astrup et al. 1981, Hossmann 1994."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="CBF" value={cbf} unit="mL/100g/min" status={cur.status} />
        <Readout label="EEG state" value={cur.band.replace(/_/g, ' ')} hint={cur.label} status={cur.status} />
        <Readout label="Reversibility" value={cbf >= 25 ? 'reversible' : cbf >= 15 ? 'tight' : 'irreversible'} status={cbf >= 25 ? 'good' : cbf >= 15 ? 'warn' : 'danger'} />
      </div>
      <WidgetPanel title="EEG strip, morphs with CBF">
        <canvas ref={cv} className="block w-full" style={{ height: 140 }} />
        <div className="mt-3">
          <input
            type="range"
            min={0}
            max={60}
            value={cbf}
            onChange={(e) => setCbf(parseInt(e.target.value, 10))}
            className="w-full accent-brand-teal"
            aria-label="Cerebral blood flow slider"
          />
          <div className="mt-2 grid grid-cols-5 gap-1 text-[10px] text-ink-muted text-center">
            {[0, 15, 25, 35, 50].map((m) => (
              <div key={m} className="border-t border-line pt-1">
                <div className="font-mono">{m}</div>
              </div>
            ))}
          </div>
        </div>
      </WidgetPanel>
      <WidgetPanel title="Threshold table" className="mt-2.5">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left py-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-tealLight">CBF (mL/100g/min)</th>
              <th className="text-left py-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-tealLight">EEG / function</th>
            </tr>
          </thead>
          <tbody>
            {THRESHOLDS.map((t, idx) => {
              const upper = idx === 0 ? Infinity : THRESHOLDS[idx - 1]!.cbf;
              const range = idx === 0 ? `≥ ${t.cbf}` : `${t.cbf}–${upper - 1}`;
              const active = cur.band === t.band;
              return (
                <tr key={t.band} className={active ? 'bg-brand-teal/10' : ''}>
                  <td className="py-1.5 px-2 font-mono text-ink">{range}</td>
                  <td className="py-1.5 px-2 text-ink/85">{t.label}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </WidgetPanel>
    </WidgetShell>
  );
}
