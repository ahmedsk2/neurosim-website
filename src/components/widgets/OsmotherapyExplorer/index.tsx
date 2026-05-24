'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout, ToggleRow } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

type Drug = 'hts3_5mlkg' | 'hts23_05mlkg' | 'mannitol_05gkg' | 'mannitol_1gkg';
type BBB = 'intact' | 'moderate' | 'severe';

const DRUG_LABEL: Record<Drug, string> = {
  hts3_5mlkg: '3% NaCl 5 mL/kg',
  hts23_05mlkg: '23.4% NaCl 0.5 mL/kg',
  mannitol_05gkg: 'Mannitol 0.5 g/kg',
  mannitol_1gkg: 'Mannitol 1 g/kg',
};

interface Profile {
  onsetMin: number;
  durationH: number;
  peakDropMmHg: number;
  reflectionCoef: number;
  isMannitol: boolean;
  naDelta: number; // mEq/L peak rise (HTS only)
  uoMlPerKg: number; // mannitol diuresis effect
}

const PROFILES: Record<Drug, Profile> = {
  hts3_5mlkg: { onsetMin: 12, durationH: 4, peakDropMmHg: 7, reflectionCoef: 1.0, isMannitol: false, naDelta: 5, uoMlPerKg: 0 },
  hts23_05mlkg: { onsetMin: 8, durationH: 5, peakDropMmHg: 10, reflectionCoef: 1.0, isMannitol: false, naDelta: 8, uoMlPerKg: 0 },
  mannitol_05gkg: { onsetMin: 20, durationH: 3, peakDropMmHg: 5, reflectionCoef: 0.9, isMannitol: true, naDelta: 0, uoMlPerKg: 6 },
  mannitol_1gkg: { onsetMin: 18, durationH: 3, peakDropMmHg: 9, reflectionCoef: 0.9, isMannitol: true, naDelta: 0, uoMlPerKg: 14 },
};

function bbbScalar(bbb: BBB, p: Profile): number {
  // HTS reflection 1.0,least affected; mannitol reflection 0.9,more rebound on disrupted BBB
  if (bbb === 'intact') return 1.0;
  const base = p.reflectionCoef;
  if (bbb === 'moderate') return base * 0.7;
  return base * 0.4;
}

function curve(p: Profile, bbbScale: number, hours: number[]): number[] {
  const onsetH = p.onsetMin / 60;
  const decayH = p.durationH;
  return hours.map((h) => {
    if (h < onsetH) return 0;
    // Rise to peak then exp decay
    const t = h - onsetH;
    if (t < 0.2) return -p.peakDropMmHg * (t / 0.2) * bbbScale;
    return -p.peakDropMmHg * Math.exp(-(t - 0.2) / (decayH / 2)) * bbbScale;
  });
}

export default function OsmotherapyExplorer() {
  const [drug, setDrug] = useState<Drug>('hts3_5mlkg');
  const [bbb, setBbb] = useState<BBB>('intact');
  const cv = useRef<HTMLCanvasElement>(null);
  const profile = PROFILES[drug];
  const bbbScale = bbbScalar(bbb, profile);

  const hours = Array.from({ length: 240 }, (_, i) => (i / 240) * 4);
  const icpDelta = curve(profile, bbbScale, hours);
  const peakICPDrop = Math.min(...icpDelta);
  const naCurve = hours.map((h) => {
    if (profile.naDelta === 0) return 0;
    if (h < profile.onsetMin / 60) return 0;
    const t = h - profile.onsetMin / 60;
    return profile.naDelta * Math.exp(-t / 8);
  });
  const uoCurve = hours.map((h) => {
    if (!profile.isMannitol) return 0;
    if (h < 0.3) return 0;
    const t = h - 0.3;
    return profile.uoMlPerKg * Math.exp(-t / 1.2);
  });

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
    const xMax = 4;
    const yMin = -15;
    const yMax = 5;
    const xS = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * (w - padL - padR);
    const yS = (y: number) => h - padB - ((y - yMin) / (yMax - yMin)) * (h - padT - padB);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let v = yMin; v <= yMax; v += 5) {
      ctx.beginPath();
      ctx.moveTo(padL, yS(v));
      ctx.lineTo(w - padR, yS(v));
      ctx.stroke();
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(String(v), padL - 4, yS(v) + 3);
    }
    for (let x = 0; x <= 4; x += 1) {
      ctx.beginPath();
      ctx.moveTo(xS(x), padT);
      ctx.lineTo(xS(x), h - padB);
      ctx.stroke();
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${x}h`, xS(x), h - padB + 14);
    }
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(padL, yS(0));
    ctx.lineTo(w - padR, yS(0));
    ctx.stroke();
    ctx.setLineDash([]);
    // Curve
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    icpDelta.forEach((v, i) => {
      const x = xS(hours[i] ?? 0);
      const y = yS(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.fillStyle = '#5EEAD4';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ΔICP (mmHg),4-hour profile', (padL + w - padR) / 2, h - 6);
  }, [icpDelta, hours]);

  return (
    <WidgetShell
      eyebrow="Osmotherapy"
      title="HTS vs mannitol, onset, duration, BBB modulation"
      controls={
        <>
          <ToggleRow<Drug>
            label="Drug"
            value={drug}
            onChange={setDrug}
            options={(Object.keys(DRUG_LABEL) as Drug[]).map((d) => ({ value: d, label: DRUG_LABEL[d] }))}
          />
          <ToggleRow<BBB>
            label="BBB integrity"
            value={bbb}
            onChange={setBbb}
            options={[
              { value: 'intact', label: 'Intact', accent: 'green' },
              { value: 'moderate', label: 'Moderate disruption', accent: 'amber' },
              { value: 'severe', label: 'Severe disruption', accent: 'red' },
            ]}
          />
        </>
      }
      footnote="Cottenceau 2011, Mortazavi 2012, Fisher 1992 (pediatric). Synthetic curves; not pharmacokinetic models."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-4 mb-2.5">
        <Readout label="Peak ICP drop" value={peakICPDrop.toFixed(1)} unit="mmHg" status={Math.abs(peakICPDrop) >= 5 ? 'good' : 'warn'} />
        <Readout label="Peak ΔNa" value={Math.max(...naCurve).toFixed(1)} unit="mEq/L" hint={profile.naDelta === 0 ? 'mannitol, no Na rise' : 'monitor every 4h'} />
        <Readout label="Mannitol UO peak" value={profile.isMannitol ? Math.max(...uoCurve).toFixed(1) : '-'} unit="mL/kg" hint={profile.isMannitol ? 'replace volume' : 'no diuresis'} />
        <Readout label="BBB scalar" value={bbbScale.toFixed(2)} status={bbbScale > 0.7 ? 'good' : bbbScale > 0.4 ? 'warn' : 'danger'} hint={bbb === 'intact' ? 'full effect' : 'reduced effect, more rebound'} />
      </div>
      <WidgetGrid>
        <WidgetPanel title="ΔICP curve over 4 hours">
          <canvas ref={cv} className="block w-full" style={{ height: 280 }} />
        </WidgetPanel>
        <WidgetPanel title="What this teaches">
          <ul className="text-[12.5px] text-ink/85 leading-[1.55] space-y-2 list-none p-0">
            <li><strong>HTS</strong>: faster onset, longer duration, higher reflection coefficient → less rebound on disrupted BBB.</li>
            <li><strong>Mannitol</strong>: osmotic diuresis means volume replacement. Reflection ~0.9 → more rebound through a leaky BBB.</li>
            <li><strong>Severe BBB disruption</strong> blunts every osmotherapy. Don't keep escalating, fix the underlying problem.</li>
            <li><strong>Sodium ceiling</strong>: typically 160 mEq/L. Acute change &gt; 0.5 mEq/L per hour can rebound ICP.</li>
          </ul>
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}
