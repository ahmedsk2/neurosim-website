'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout, ToggleRow } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

function fPaco2(p: number) {
  return Math.max(0.4, Math.min(1.45, 1 + (p - 40) * 0.03));
}

function tcdSample(t: number, hr: number, psv: number, edv: number) {
  const cycleSec = 60 / hr;
  const phase = (t % cycleSec) / cycleSec;
  const sys = Math.exp(-((phase - 0.05) ** 2) / 0.0025);
  const dia = Math.exp(-((phase - 0.18) ** 2) / 0.04);
  const decay = phase > 0.2 ? (1 - phase) / 0.8 : 1;
  const v = edv + (psv - edv) * (sys * 0.85 + dia * 0.4) * decay;
  return Math.max(edv * 0.95, v);
}

interface VesselValues {
  psv: number;
  edv: number;
  mfv: number;
  pi: number;
}

function computeVessel(opts: {
  icp: number;
  map: number;
  paco2: number;
  vasospasm: number;
  baseMfv: number;
}): VesselValues {
  const { icp, map, paco2, vasospasm, baseMfv } = opts;
  const cpp = map - icp;
  const kR = 1 + Math.max(0, icp - 10) / 30;
  const psv = Math.max(40, baseMfv * 1.6 * fPaco2(paco2) * vasospasm * Math.sqrt(cpp / 75));
  const edv = Math.max(8, (baseMfv * 0.4) * (cpp / 75) / kR);
  const mfv = (psv + 2 * edv) / 3;
  const pi = (psv - edv) / mfv;
  return { psv, edv, mfv, pi };
}

type Side = 'left' | 'right';

export default function TCDWaveformExplorer() {
  const [side, setSide] = useState<Side>('left');
  const [icp, setIcp] = useState(15);
  const [map, setMap] = useState(85);
  const [paco2, setPaco2] = useState(40);
  const [leftVasospasm, setLeftVasospasm] = useState(1.0);
  const [rightVasospasm, setRightVasospasm] = useState(1.0);
  const [hr, setHr] = useState(80);
  const cv = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const left = computeVessel({ icp, map, paco2, vasospasm: leftVasospasm, baseMfv: 60 });
  const right = computeVessel({ icp, map, paco2, vasospasm: rightVasospasm, baseMfv: 60 });
  const cur = side === 'left' ? left : right;
  // Lindegaard ratio uses MCA / extracranial ICA (~ 30 cm/s baseline)
  const leftLindegaard = left.mfv / 30;
  const rightLindegaard = right.mfv / 30;

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
          const padL = 38;
          const padR = 14;
          const padT = 12;
          const padB = 22;
          const yMin = -10;
          const yMax = Math.max(200, Math.max(left.psv, right.psv) * 1.2);
          const yS = (v: number) => h - padB - ((v - yMin) / (yMax - yMin)) * (h - padT - padB);
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 0.5;
          for (let v = 0; v <= yMax; v += 50) {
            ctx.beginPath();
            ctx.moveTo(padL, yS(v));
            ctx.lineTo(w - padR, yS(v));
            ctx.stroke();
            ctx.fillStyle = '#94A3B8';
            ctx.font = '9px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(String(v), padL - 4, yS(v) + 3);
          }
          // Both sides simultaneously, with the active side bolded
          const drawSide = (vals: VesselValues, color: string, lineWidth: number, alpha: number) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            const N = 720;
            const windowSec = 6;
            for (let i = 0; i < N; i++) {
              const t = tRef.current + (i / N) * windowSec;
              const v = tcdSample(t, hr, vals.psv, vals.edv);
              const x = padL + (i / N) * (w - padL - padR);
              const y = yS(v);
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
          };
          drawSide(left, '#5EEAD4', side === 'left' ? 1.8 : 1, side === 'left' ? 1 : 0.35);
          drawSide(right, '#F59E0B', side === 'right' ? 1.8 : 1, side === 'right' ? 1 : 0.35);
          ctx.strokeStyle = '#FCD34D';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(padL, yS(cur.mfv));
          ctx.lineTo(w - padR, yS(cur.mfv));
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#FCD34D';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(`${side.toUpperCase()} MFV ${cur.mfv.toFixed(0)}`, w - padR - 4, yS(cur.mfv) - 3);
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [left, right, side, hr, cur.mfv]);

  return (
    <WidgetShell
      eyebrow="TCD · waveform · bilateral"
      title="TCD waveform explorer, left + right MCA"
      controls={
        <ToggleRow<Side>
          label="Active side (overlaid)"
          value={side}
          onChange={setSide}
          options={[
            { value: 'left', label: 'Left MCA', accent: 'teal' },
            { value: 'right', label: 'Right MCA', accent: 'amber' },
          ]}
        />
      }
      footnote="Synthetic. Aaslid 1982; Bode 1988; Klingelhöfer 1996. Both sides shown simultaneously; active side bolded."
    >
      {/* Side panels */}
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-2 mb-2.5">
        <SidePanel label="Left MCA" v={left} lindegaard={leftLindegaard} active={side === 'left'} accent="teal" />
        <SidePanel label="Right MCA" v={right} lindegaard={rightLindegaard} active={side === 'right'} accent="amber" />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Bilateral overlay">
          <canvas ref={cv} className="block w-full" style={{ height: 220 }} />
        </WidgetPanel>
        <WidgetPanel title="Inputs">
          <Slider label="ICP (shared)" min={0} max={50} value={icp} onChange={setIcp} unit="mmHg" />
          <Slider label="MAP (shared)" min={50} max={130} value={map} onChange={setMap} unit="mmHg" />
          <Slider label="PaCO₂ (shared)" min={20} max={60} value={paco2} onChange={setPaco2} unit="mmHg" />
          <Slider label="HR (shared)" min={60} max={150} value={hr} onChange={setHr} unit="bpm" />
          <SliderFloat label="Left vasospasm" min={1} max={3.5} step={0.1} value={leftVasospasm} onChange={setLeftVasospasm} />
          <SliderFloat label="Right vasospasm" min={1} max={3.5} step={0.1} value={rightVasospasm} onChange={setRightVasospasm} />
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}

function SidePanel({
  label,
  v,
  lindegaard,
  active,
  accent,
}: {
  label: string;
  v: VesselValues;
  lindegaard: number;
  active: boolean;
  accent: 'teal' | 'amber';
}) {
  const accentBorder = accent === 'teal' ? 'border-l-brand-teal' : 'border-l-brand-amber';
  return (
    <div className={
      'rounded-md border bg-surface-card p-3 border-l-[3px] ' +
      accentBorder + ' ' +
      (active ? 'border-brand-teal' : 'border-line')
    }>
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-tealLight mb-2">
        {label}
        {active && <span className="ml-2 inline-block rounded-full bg-brand-teal/30 px-1.5 py-0.5 text-[9px] text-brand-tealLight">ACTIVE</span>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Readout label="PSV" value={v.psv.toFixed(0)} unit="cm/s" />
        <Readout label="EDV" value={v.edv.toFixed(0)} unit="cm/s" status={v.edv < 20 ? 'danger' : 'good'} />
        <Readout label="MFV" value={v.mfv.toFixed(0)} unit="cm/s" status={v.mfv > 130 ? 'warn' : 'good'} />
        <Readout label="PI" value={v.pi.toFixed(2)} status={v.pi > 1.4 ? 'danger' : v.pi > 1.2 ? 'warn' : 'good'} />
        <Readout
          label="Lindegaard"
          value={lindegaard.toFixed(2)}
          status={lindegaard < 3 ? 'good' : lindegaard < 6 ? 'warn' : 'danger'}
          hint={lindegaard < 3 ? 'no spasm / hyperemia' : lindegaard < 6 ? 'mild' : lindegaard < 9 ? 'moderate' : 'severe'}
        />
      </div>
    </div>
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
function SliderFloat({ label, min, max, step, value, onChange }: { label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block mb-3 last:mb-0">
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">{label}</span>
        <span className="font-mono text-[13px] font-bold text-brand-tealLight">{value.toFixed(1)}×</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-brand-teal" />
    </label>
  );
}
