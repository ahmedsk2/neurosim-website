'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout, Button } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

type Phase = 'idle' | 'priming' | 'active' | 'recovery';

interface SDState {
  phase: Phase;
  startSec: number;
  position: number; // mm from origin (cortical sheet)
}

const PRIMING_S = 60;
const ACTIVE_S = 240;
const RECOVERY_S = 300;
const SPEED_MM_PER_MIN = 3;

export default function SpreadingDepolarizationAnimator() {
  const [state, setState] = useState<SDState>({ phase: 'idle', startSec: 0, position: 0 });
  const cv = useRef<HTMLCanvasElement>(null);
  const ecogCv = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      tRef.current += 0.016;
      setState((prev) => {
        if (prev.phase === 'idle') return prev;
        const elapsed = tRef.current - prev.startSec;
        if (prev.phase === 'priming' && elapsed >= PRIMING_S) {
          return { phase: 'active', startSec: tRef.current, position: 0 };
        }
        if (prev.phase === 'active') {
          const pos = (elapsed / 60) * SPEED_MM_PER_MIN;
          if (elapsed >= ACTIVE_S) return { phase: 'recovery', startSec: tRef.current, position: pos };
          return { ...prev, position: pos };
        }
        if (prev.phase === 'recovery' && elapsed >= RECOVERY_S) {
          return { phase: 'idle', startSec: tRef.current, position: 0 };
        }
        return prev;
      });
      drawCortical();
      drawEcog();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function trigger() {
    setState({ phase: 'priming', startSec: tRef.current, position: 0 });
  }

  function drawCortical() {
    const c = cv.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const w = c.clientWidth;
    const h = c.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== w * dpr) c.width = w * dpr;
    if (c.height !== h * dpr) c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0F1A2E';
    ctx.fillRect(0, 0, w, h);
    // Cortical sheet, gradient based on SD wave
    const cellSize = 8;
    const cols = Math.floor(w / cellSize);
    const rows = Math.floor(h / cellSize);
    const radius = state.position * 6; // pixels per mm
    const cx = w / 2;
    const cy = h / 2;
    for (let r = 0; r < rows; r++) {
      for (let col = 0; col < cols; col++) {
        const x = col * cellSize;
        const y = r * cellSize;
        const dx = x + cellSize / 2 - cx;
        const dy = y + cellSize / 2 - cy;
        const d = Math.sqrt(dx * dx + dy * dy);
        let intensity = 0;
        if (state.phase === 'active' || state.phase === 'recovery') {
          // Wave at radius; ±15px envelope
          const dist = Math.abs(d - radius);
          intensity = Math.max(0, 1 - dist / 30);
        } else if (state.phase === 'priming' && d < 15) {
          intensity = 0.4;
        }
        const r8 = Math.floor(15 + intensity * 230);
        const g8 = Math.floor(26 + intensity * 80);
        const b8 = Math.floor(46 + intensity * 200);
        ctx.fillStyle = `rgb(${r8},${g8},${b8})`;
        ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
      }
    }
    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Cortical sheet (top-down)', w / 2, 14);
    if (state.phase !== 'idle') {
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`phase: ${state.phase} · pos ${state.position.toFixed(1)} mm`, 8, h - 6);
    }
  }

  function drawEcog() {
    const c = ecogCv.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const w = c.clientWidth;
    const h = c.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== w * dpr) c.width = w * dpr;
    if (c.height !== h * dpr) c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0F1A2E';
    ctx.fillRect(0, 0, w, h);
    const padL = 70;
    const padR = 14;
    const rowH = h / 4;
    const labels = ['ICP', 'NIRS rSO₂', 'TCD systolic', 'ECoG (DC)'];
    labels.forEach((label, idx) => {
      const yMid = idx * rowH + rowH / 2;
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(label, padL - 8, yMid + 4);
      ctx.strokeStyle = '#1e293b';
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(padL, yMid);
      ctx.lineTo(w - padR, yMid);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = '#5EEAD4';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      const N = 600;
      const win = 60;
      for (let i = 0; i < N; i++) {
        const t = (i / N) * win + tRef.current - win;
        const v = signalFor(idx, t, state);
        const x = padL + (i / N) * (w - padL - padR);
        const y = yMid - v * 0.5;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  }

  return (
    <WidgetShell
      eyebrow="Spreading depolarization"
      title="Cortical wave + multi-modality footprint"
      controls={
        <Button variant="demo" onClick={trigger} disabled={state.phase !== 'idle'}>
          ▶ Trigger SD
        </Button>
      }
      status={state.phase === 'idle' ? { variant: 'good', label: 'Quiet' } : { variant: 'demo', label: 'Phase: ' + state.phase }}
      footnote="Hartings 2017, Dreier 2017. Wave: priming 60s → active 240s → recovery 300s."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="Phase" value={state.phase} status={state.phase === 'idle' ? 'good' : 'warn'} />
        <Readout label="Wave position" value={state.position.toFixed(1)} unit="mm from origin" />
        <Readout label="Speed" value={`${SPEED_MM_PER_MIN} mm/min`} hint="2–5 mm/min biological range" />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Cortical sheet, wave propagation">
          <canvas ref={cv} className="block w-full" style={{ height: 280 }} />
        </WidgetPanel>
        <WidgetPanel title="Modality footprint">
          <canvas ref={ecogCv} className="block w-full" style={{ height: 280 }} />
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}

function signalFor(idx: number, t: number, state: SDState): number {
  // Active state offsets: ICP +6, NIRS −8, TCD systolic ×0.95 (drop), ECoG DC shift −20
  let active = 0;
  if (state.phase === 'active') {
    const elapsed = t - state.startSec;
    if (elapsed >= 0 && elapsed <= ACTIVE_S) {
      const env = Math.sin((elapsed / ACTIVE_S) * Math.PI);
      active = env;
    }
  }
  switch (idx) {
    case 0: return 4 * Math.sin(2 * Math.PI * 0.05 * t) + 12 * active; // ICP rises
    case 1: return 6 * Math.sin(2 * Math.PI * 0.04 * t) - 14 * active; // NIRS falls
    case 2: return 18 * Math.sin(2 * Math.PI * 1 * t) - 8 * active; // TCD systolic dampens
    case 3: return 6 * Math.sin(2 * Math.PI * 8 * t) - 35 * active; // ECoG DC shift
    default: return 0;
  }
}
