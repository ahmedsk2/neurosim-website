'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout, Button } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

type WaveState = 'idle' | 'rising' | 'plateau' | 'falling';

interface SimState {
  state: WaveState;
  phaseStart: number;
  baselineIcp: number;
}

export function probability(compliance: number, vasomotor: number, marginalCpp: number): number {
  // Probability per minute: increases with low compliance, high vasomotor activity, marginal CPP
  // compliance: 0 (exhausted) to 1 (normal); vasomotor: 0 to 1; marginalCpp: 1 means very marginal
  const p = (1 - compliance) * vasomotor * (0.5 + 0.5 * marginalCpp) * 0.06;
  return Math.max(0, Math.min(1, p));
}

export default function PlateauWaveSimulator() {
  const [compliance, setCompliance] = useState(0.4); // 1 normal, 0 exhausted
  const [vasomotor, setVasomotor] = useState(0.7);
  const [cpp, setCpp] = useState(60);
  const [history, setHistory] = useState<{ t: number; icp: number }[]>([]);
  const [sim, setSim] = useState<SimState>({ state: 'idle', phaseStart: 0, baselineIcp: 14 });
  const cv = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // marginal CPP: 1 if CPP is very low (40), 0 if comfortably above plateau
  const marginalCpp = Math.max(0, Math.min(1, (75 - cpp) / 35));
  const probPerMin = probability(compliance, vasomotor, marginalCpp);

  useEffect(() => {
    const draw = () => {
      // Speed: 60×,1s real ≈ 60s sim
      const speed = 60;
      tRef.current += 0.016 * speed;

      setSim((prev) => {
        const next = { ...prev };
        const elapsed = tRef.current - prev.phaseStart;
        if (prev.state === 'idle') {
          // Probability check each sim-minute
          if (Math.random() < probPerMin / 60) {
            next.state = 'rising';
            next.phaseStart = tRef.current;
          }
        } else if (prev.state === 'rising' && elapsed >= 60) {
          next.state = 'plateau';
          next.phaseStart = tRef.current;
        } else if (prev.state === 'plateau' && elapsed >= 8 * 60) {
          next.state = 'falling';
          next.phaseStart = tRef.current;
        } else if (prev.state === 'falling' && elapsed >= 60) {
          next.state = 'idle';
          next.phaseStart = tRef.current;
        }
        return next;
      });

      // ICP trace
      const phaseElapsed = tRef.current - sim.phaseStart;
      let icp = sim.baselineIcp;
      const peak = 50 + (1 - compliance) * 20;
      if (sim.state === 'rising') {
        icp = sim.baselineIcp + (peak - sim.baselineIcp) * (phaseElapsed / 60);
      } else if (sim.state === 'plateau') {
        icp = peak + 2 * Math.sin(0.05 * tRef.current);
      } else if (sim.state === 'falling') {
        icp = peak - (peak - sim.baselineIcp) * (phaseElapsed / 60);
      } else {
        icp = sim.baselineIcp + 1.5 * Math.sin(0.07 * tRef.current);
      }

      setHistory((h) => {
        const next = [...h, { t: tRef.current, icp }];
        const cutoff = tRef.current - 30 * 60; // 30 sim-min visible
        return next.filter((p) => p.t >= cutoff);
      });

      // Draw
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
          const padL = 36;
          const padR = 14;
          const padT = 12;
          const padB = 22;
          const yMin = 0;
          const yMax = 80;
          const yS = (v: number) => h - padB - ((v - yMin) / (yMax - yMin)) * (h - padT - padB);
          const xS = (t: number) => padL + ((t - (tRef.current - 30 * 60)) / (30 * 60)) * (w - padL - padR);
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 0.5;
          for (let v = 0; v <= yMax; v += 20) {
            ctx.beginPath();
            ctx.moveTo(padL, yS(v));
            ctx.lineTo(w - padR, yS(v));
            ctx.stroke();
            ctx.fillStyle = '#94A3B8';
            ctx.font = '9px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(String(v), padL - 4, yS(v) + 3);
          }
          ctx.strokeStyle = '#5EEAD4';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          history.forEach((p, i) => {
            const x = xS(p.t);
            const y = yS(p.icp);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
          ctx.fillStyle = '#94A3B8';
          ctx.font = '9px sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText('30 sim-min →', w - padR, h - 6);
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [sim, history, probPerMin, compliance]);

  function trigger() {
    setSim({ state: 'rising', phaseStart: tRef.current, baselineIcp: 14 });
  }
  function reset() {
    setSim({ state: 'idle', phaseStart: tRef.current, baselineIcp: 14 });
    setHistory([]);
  }

  return (
    <WidgetShell
      eyebrow="ICP · plateau waves"
      title="Lundberg A, when low compliance + active vasomotor + marginal CPP align"
      controls={
        <>
          <Button variant="demo" onClick={trigger}>▶ Trigger plateau wave</Button>
          <Button variant="secondary" onClick={reset}>Reset</Button>
        </>
      }
      status={sim.state === 'idle' ? { variant: 'good', label: 'Quiet' } : { variant: 'danger', label: 'Plateau wave: ' + sim.state }}
      footnote="Lundberg 1960; Czosnyka 1999. Trapezoid: 60s rise, 5–20 min plateau, 60s fall."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout
          label="P(plateau wave) /min"
          value={probPerMin.toFixed(3)}
          status={probPerMin > 0.05 ? 'danger' : probPerMin > 0.02 ? 'warn' : 'good'}
        />
        <Readout label="Phase" value={sim.state} status={sim.state === 'idle' ? 'good' : 'danger'} />
        <Readout label="History points" value={history.length} hint="last 30 sim-min" />
      </div>
      <WidgetGrid>
        <WidgetPanel title="ICP, last 30 sim-min @ 60×">
          <canvas ref={cv} className="block w-full" style={{ height: 280 }} />
        </WidgetPanel>
        <WidgetPanel title="Inputs">
          <SliderFloat label="Compliance" min={0} max={1} step={0.05} value={compliance} onChange={setCompliance} hint={compliance > 0.7 ? 'Normal' : compliance > 0.3 ? 'Low' : 'Exhausted'} />
          <SliderFloat label="Vasomotor activity" min={0} max={1} step={0.05} value={vasomotor} onChange={setVasomotor} />
          <Slider label="CPP" min={40} max={100} value={cpp} onChange={setCpp} unit="mmHg" />
          <p className="mt-3 text-[12px] text-ink-muted">
            Lower compliance + higher vasomotor + lower CPP → higher per-minute probability of a spontaneous plateau. <strong>Trigger</strong> forces one immediately.
          </p>
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
function SliderFloat({ label, min, max, step, value, onChange, hint }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <label className="block mb-3 last:mb-0">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">{label}</span>
        <span className="font-mono text-[13px] font-bold text-brand-tealLight">{value.toFixed(2)} {hint && <span className="text-[10px] text-ink-dim font-normal">· {hint}</span>}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-brand-teal" />
    </label>
  );
}
