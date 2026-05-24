'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout, ToggleRow } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

type AgeGroup = 'infant' | 'child' | 'adult';

const THRESHOLDS: Record<AgeGroup, { normal: number; concern: number }> = {
  infant: { normal: 4.0, concern: 4.5 },
  child: { normal: 4.5, concern: 5.0 },
  adult: { normal: 5.7, concern: 6.0 },
};

// Linear ICP estimator: ONSD ~ 4.5 + 0.05 × (ICP - 10) approximately
function onsdFromIcp(icp: number, base: number) {
  return base + Math.max(0, (icp - 10)) * 0.06;
}

function icpFromOnsd(onsd: number, base: number) {
  return 10 + Math.max(0, (onsd - base) / 0.06);
}

export default function ONSDDemo() {
  const [age, setAge] = useState<AgeGroup>('child');
  const [icp, setIcp] = useState(15);
  const cv = useRef<HTMLCanvasElement>(null);
  const t = THRESHOLDS[age];
  const onsd = onsdFromIcp(icp, t.normal - 0.3);
  const status: 'good' | 'warn' | 'danger' = onsd < t.normal ? 'good' : onsd < t.concern ? 'warn' : 'danger';

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
    // Cartoon globe + nerve sheath
    const cx = w / 2;
    const cy = h / 2;
    // Globe
    ctx.fillStyle = '#152238';
    ctx.beginPath();
    ctx.ellipse(cx, cy - 5, 80, 70, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Optic nerve
    const sheathPx = 4 + onsd * 8; // visual width scale
    ctx.fillStyle = '#3B82F6';
    ctx.fillRect(cx - sheathPx / 2, cy + 60, sheathPx, 80);
    // Nerve core
    ctx.fillStyle = '#FCD34D';
    ctx.fillRect(cx - 4, cy + 60, 8, 80);
    // Caliper
    ctx.strokeStyle = '#5EEAD4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - sheathPx / 2 - 6, cy + 100);
    ctx.lineTo(cx + sheathPx / 2 + 6, cy + 100);
    ctx.stroke();
    ctx.fillStyle = '#5EEAD4';
    ctx.font = 'bold 12px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${onsd.toFixed(1)} mm`, cx, cy + 116);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px sans-serif';
    ctx.fillText('3 mm posterior to globe', cx, h - 6);
  }, [onsd]);

  return (
    <WidgetShell
      eyebrow="ONSD · ultrasound"
      title="Optic nerve sheath diameter"
      controls={
        <ToggleRow<AgeGroup>
          label="Age band"
          value={age}
          onChange={setAge}
          options={[
            { value: 'infant', label: '< 1 yr' },
            { value: 'child', label: '1–15 yr' },
            { value: 'adult', label: 'Adult' },
          ]}
        />
      }
      footnote="Hansen 1997; Helmke 1996; Geeraerts 2008; Robba 2018; Padayachy 2012."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="Invasive ICP" value={icp} unit="mmHg" />
        <Readout label="Predicted ONSD" value={onsd.toFixed(1)} unit="mm" status={status} hint={`Normal < ${t.normal} · Concern > ${t.concern}`} />
        <Readout
          label="ICP back-estimate (from ONSD)"
          value={icpFromOnsd(onsd, t.normal - 0.3).toFixed(0)}
          unit="mmHg"
        />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Cartoon transorbital ultrasound">
          <canvas ref={cv} className="block w-full" style={{ height: 260 }} />
        </WidgetPanel>
        <WidgetPanel title="Drag invasive ICP, see ONSD">
          <input
            type="range"
            min={5}
            max={50}
            value={icp}
            onChange={(e) => setIcp(parseInt(e.target.value, 10))}
            className="w-full accent-brand-teal"
            aria-label="Invasive ICP"
          />
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <Threshold age="infant" current={age === 'infant'} />
            <Threshold age="child" current={age === 'child'} />
            <Threshold age="adult" current={age === 'adult'} />
          </div>
          <p className="mt-3 text-[12px] text-ink/85 leading-[1.55]">
            ONSD is bedside, rapid, no radiation, but operator-dependent. Use as a discriminator
            for raised ICP, not an absolute number.
          </p>
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}

function Threshold({ age, current }: { age: AgeGroup; current: boolean }) {
  const t = THRESHOLDS[age];
  return (
    <div className={'rounded-md border-l-[3px] p-2 ' + (current ? 'border-l-brand-teal bg-brand-teal/15' : 'border-l-line bg-surface-deeper')}>
      <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted">{age}</div>
      <div className="font-mono text-[12px]">{`< ${t.normal}`}</div>
      <div className="font-mono text-[11px] text-status-dangerText">{`> ${t.concern}`}</div>
    </div>
  );
}
