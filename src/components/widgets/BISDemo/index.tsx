'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';
import { eegVal, type EEGPattern } from '../EEGPatternLibrary/engine';

function bisToPattern(bis: number): EEGPattern {
  if (bis >= 80) return 'normal';
  if (bis >= 60) return 'normal';
  if (bis >= 40) return 'generalized_slowing';
  if (bis >= 20) return 'burst_suppression';
  return 'isoelectric';
}

function bisToPSI(bis: number) {
  // PSI tracks BIS roughly but with offset; both reach 0 at isoelectric
  return Math.max(0, Math.round(bis * 0.95 - 5));
}

function bisLabel(bis: number) {
  if (bis >= 80) return 'Awake';
  if (bis >= 60) return 'Light sedation';
  if (bis >= 40) return 'Surgical anaesthesia';
  if (bis >= 20) return 'Deep sedation / BS';
  return 'Isoelectric';
}

export default function BISDemo() {
  const [bis, setBis] = useState(60);
  const cv = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const draw = () => {
      tRef.current += 0.022;
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
          ctx.strokeStyle = '#5EEAD4';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          const N = 800;
          const pat = bisToPattern(bis);
          for (let i = 0; i < N; i++) {
            const t = tRef.current + (i / N) * 5;
            const v = eegVal(t, pat, 0);
            const x = (i / N) * w;
            const y = h / 2 - v * 0.55;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [bis]);

  const status: 'good' | 'warn' | 'danger' = bis >= 40 && bis < 60 ? 'good' : bis < 20 ? 'danger' : 'warn';

  return (
    <WidgetShell
      eyebrow="Processed EEG · BIS / PSI"
      title="Sedation depth indices"
      footnote="Rampil 1998 (BIS), Drover 2002 (PSI). Always corroborate with raw EEG."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-4 mb-2.5">
        <Readout label="BIS" value={bis} status={status} hint={bisLabel(bis)} />
        <Readout label="SedLine PSI" value={bisToPSI(bis)} hint="Approx mapping, algorithms differ" />
        <Readout label="Burst suppression?" value={bis < 40 ? 'yes' : 'no'} status={bis < 40 ? 'warn' : 'good'} />
        <Readout label="Isoelectric?" value={bis < 10 ? 'yes' : 'no'} status={bis < 10 ? 'danger' : 'good'} />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Frontal EEG morph">
          <canvas ref={cv} className="block w-full" style={{ height: 200 }} />
        </WidgetPanel>
        <WidgetPanel title="Sedation depth slider">
          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">BIS</label>
          <input
            type="range"
            min={0}
            max={100}
            value={bis}
            onChange={(e) => setBis(parseInt(e.target.value, 10))}
            className="w-full accent-brand-teal"
          />
          <div className="grid grid-cols-5 gap-1 text-center text-[10px] text-ink-muted mt-2">
            {[0, 20, 40, 60, 80].map((m) => (
              <div key={m} className="border-t border-line pt-1 font-mono">
                {m}
              </div>
            ))}
          </div>
          <ul className="mt-3 text-[12px] text-ink/85 space-y-1.5 list-none p-0">
            <li>• 90: awake</li>
            <li>• 60–80: light sedation</li>
            <li>• 40–60: surgical anaesthesia</li>
            <li>• &lt; 40: deep / burst-suppression</li>
            <li>• 0: isoelectric</li>
          </ul>
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}
