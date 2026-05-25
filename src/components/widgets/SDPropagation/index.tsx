'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Readout } from '@/components/ui';
import { WidgetShell, WidgetPanel } from '../shared/WidgetShell';

const STRIP_LENGTH_MM = 60; // 6 cm subdural strip
const PROPAGATION_MM_PER_MIN = 3; // 2–5 typical

export default function SDPropagation() {
  const [running, setRunning] = useState(false);
  const [position, setPosition] = useState(0); // wave front in mm from origin
  const [trace, setTrace] = useState<{ t: number; x: number; ecogSuppression: number }[]>([]);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  function drawStrip() {
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

    const padL = 30;
    const padR = 30;
    const padT = 16;
    const stripH = 60;
    const traceH = h - stripH - padT - 60;

    // 1D cortical strip: 6 channels along its length
    const stripY = padT;
    const channels = 6;
    const channelW = (w - padL - padR) / channels;
    for (let i = 0; i < channels; i++) {
      const x = padL + i * channelW;
      const channelMidMm = (i + 0.5) * (STRIP_LENGTH_MM / channels);
      const dist = Math.abs(channelMidMm - position);
      const intensity = Math.max(0, 1 - dist / 8);
      const col = `rgb(${15 + Math.floor(230 * intensity)}, ${26 + Math.floor(60 * intensity)}, ${46 + Math.floor(180 * (1 - intensity))})`;
      ctx.fillStyle = col;
      ctx.fillRect(x, stripY, channelW - 2, stripH);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, stripY, channelW - 2, stripH);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${(channelMidMm).toFixed(0)} mm`, x + channelW / 2, stripY + stripH + 14);
    }
    ctx.fillStyle = '#5EEAD4';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('subdural ECoG strip · 6 contacts · 6 cm', padL, stripY - 4);

    // Wave-front marker
    const wavePxX = padL + (position / STRIP_LENGTH_MM) * (w - padL - padR);
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wavePxX, stripY - 4);
    ctx.lineTo(wavePxX, stripY + stripH + 4);
    ctx.stroke();
    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 10px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${position.toFixed(1)} mm`, wavePxX, stripY + stripH + 28);

    // Bottom: ECoG envelope per channel, DC-coupled trace showing wave passing
    const traceY = stripY + stripH + 50;
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('DC-coupled ECoG (negative shift = SD)', padL, traceY - 4);
    for (let i = 0; i < channels; i++) {
      const yBase = traceY + (i / (channels - 1)) * (traceH - 20);
      const channelMidMm = (i + 0.5) * (STRIP_LENGTH_MM / channels);
      const dist = Math.abs(channelMidMm - position);
      const passing = position > channelMidMm - 3 && position < channelMidMm + 8;
      const dcShift = passing ? -25 * Math.exp(-((dist - 0) ** 2) / 30) : 0;
      const phase = tRef.current * 8;
      const hf = passing ? 0 : 6 * Math.sin(phase + i);
      ctx.strokeStyle = passing ? '#FCD34D' : '#5EEAD4';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      const N = 200;
      for (let k = 0; k < N; k++) {
        const x = padL + (k / N) * (w - padL - padR);
        const v = dcShift + hf + 4 * Math.sin(k * 0.5 + i);
        const y = yBase + v;
        if (k === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.fillStyle = passing ? '#FCD34D' : '#94A3B8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`Ch ${i + 1}`, padL - 4, yBase + 3);
    }
  }

  useEffect(() => {
    const tick = () => {
      if (running) {
        tRef.current += 0.016 * 30; // 30× sim speed → 1s real ≈ 30s sim
        setPosition((p) => {
          const next = p + (PROPAGATION_MM_PER_MIN / 60) * (0.016 * 30);
          if (next >= STRIP_LENGTH_MM) {
            setRunning(false);
            return 0;
          }
          return next;
        });
        setTrace((tr) => {
          const supp = Math.max(0, 1 - Math.exp(-((position - 30) ** 2) / 100));
          const next = [...tr, { t: tRef.current, x: position, ecogSuppression: supp }];
          return next.slice(-200);
        });
      }
      drawStrip();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, position]);

  return (
    <WidgetShell
      eyebrow="Spreading depolarization"
      title="1-D propagation across a subdural ECoG strip"
      controls={
        <>
          <Button
            variant="demo"
            onClick={() => {
              setRunning(true);
              setPosition(0);
              setTrace([]);
            }}
          >
            ▶ Trigger SD
          </Button>
          <Button variant="secondary" onClick={() => { setRunning(false); setPosition(0); setTrace([]); }}>
            Reset
          </Button>
        </>
      }
      status={running ? { variant: 'demo', label: 'SD propagating' } : { variant: 'good', label: 'Quiet' }}
      footnote="Hartings 2017; Dreier 2017. Speed ~3 mm/min; passing wave shows DC negative shift + HF suppression."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="Wave position" value={position.toFixed(1)} unit="mm from origin" />
        <Readout label="Speed" value={`${PROPAGATION_MM_PER_MIN} mm/min`} hint="2–5 mm/min biological range" />
        <Readout label="Strip length" value={`${STRIP_LENGTH_MM} mm`} hint="6-contact subdural strip" />
      </div>
      <WidgetPanel title="Strip and DC-coupled traces">
        <canvas ref={cv} className="block w-full" style={{ height: 380 }} />
      </WidgetPanel>
    </WidgetShell>
  );
}
