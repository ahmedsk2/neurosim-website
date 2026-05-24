'use client';

import { useEffect, useRef, useState } from 'react';
import { WidgetShell, WidgetPanel } from '../shared/WidgetShell';
import { eegVal, PATTERNS, type EEGPattern } from './engine';

const CHANNEL_LABELS = ['Fp1-F7', 'F7-T3', 'C3-P3', 'O1-O2'];

export default function EEGPatternLibrary() {
  const [pattern, setPattern] = useState<EEGPattern>('normal');
  const [paused, setPaused] = useState(false);
  const cv = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const draw = () => {
      if (!paused) tRef.current += 0.040;
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
          const padL = 70;
          const padR = 14;
          const channelH = (h - 16) / 4;
          for (let ch = 0; ch < 4; ch++) {
            const yMid = 8 + ch * channelH + channelH / 2;
            ctx.fillStyle = '#94A3B8';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(CHANNEL_LABELS[ch] ?? '', padL - 8, yMid + 4);
            // Baseline
            ctx.strokeStyle = '#1e293b';
            ctx.setLineDash([2, 3]);
            ctx.beginPath();
            ctx.moveTo(padL, yMid);
            ctx.lineTo(w - padR, yMid);
            ctx.stroke();
            ctx.setLineDash([]);
            // Trace
            ctx.strokeStyle = '#5EEAD4';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            const N = 800;
            const window = 5;
            for (let i = 0; i < N; i++) {
              const t = tRef.current + (i / N) * window;
              const v = eegVal(t, pattern, ch);
              const x = padL + (i / N) * (w - padL - padR);
              const y = yMid - v * 0.45;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
          // Time scale
          ctx.fillStyle = '#94A3B8';
          ctx.font = '9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('5 sec ←', padL + 30, h - 2);
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [pattern, paused]);

  return (
    <WidgetShell
      eyebrow="cEEG · pattern library"
      title="EEG patterns at the bedside"
      controls={
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="rounded-md border border-line bg-surface-deeper px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-ink-muted hover:text-brand-tealLight hover:border-brand-teal"
        >
          {paused ? 'Resume' : 'Pause'} strip
        </button>
      }
      footnote="Hirsch 2021 (ACNS); Tasker 2018; Abend 2013."
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 mb-3">
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPattern(p.id)}
            className={
              'rounded-md border px-3 py-2 text-left transition-colors ' +
              (pattern === p.id
                ? 'border-brand-teal bg-brand-teal/15'
                : 'border-line bg-surface-card hover:border-brand-teal')
            }
          >
            <div className="text-[12.5px] font-bold text-ink">{p.label}</div>
            <div className="text-[11px] text-ink-muted leading-[1.4]">{p.subtitle}</div>
          </button>
        ))}
      </div>
      <WidgetPanel title="Live EEG strip,4 channels">
        <canvas ref={cv} className="block w-full" style={{ height: 280 }} />
      </WidgetPanel>
    </WidgetShell>
  );
}
