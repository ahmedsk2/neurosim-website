'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout, ToggleRow } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';
import {
  SSEP_PROFILES,
  BAER_PROFILES,
  ssepSample,
  baerSample,
  type SSEPPattern,
  type BAERPattern,
} from './engine';

type Modality = 'ssep' | 'baer';

export default function SSEPViewer() {
  const [modality, setModality] = useState<Modality>('ssep');
  const [ssepId, setSsepId] = useState<SSEPPattern>('normal');
  const [baerId, setBaerId] = useState<BAERPattern>('normal');
  const cv = useRef<HTMLCanvasElement>(null);

  const ssep = SSEP_PROFILES.find((p) => p.id === ssepId)!;
  const baer = BAER_PROFILES.find((p) => p.id === baerId)!;

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

    if (modality === 'ssep') {
      drawSSEP(ctx, w, h, ssep);
    } else {
      drawBAER(ctx, w, h, baer);
    }
  }, [modality, ssep, baer]);

  return (
    <WidgetShell
      eyebrow="Evoked potentials"
      title="SSEP / BAER waveform viewer"
      controls={
        <>
          <ToggleRow<Modality>
            label="Modality"
            value={modality}
            onChange={setModality}
            options={[
              { value: 'ssep', label: 'SSEP (median)' },
              { value: 'baer', label: 'BAER (click)' },
            ]}
          />
          {modality === 'ssep' ? (
            <ToggleRow<SSEPPattern>
              label="Pattern"
              value={ssepId}
              onChange={setSsepId}
              options={SSEP_PROFILES.map((p) => ({ value: p.id, label: p.label }))}
            />
          ) : (
            <ToggleRow<BAERPattern>
              label="Pattern"
              value={baerId}
              onChange={setBaerId}
              options={BAER_PROFILES.map((p) => ({ value: p.id, label: p.label }))}
            />
          )}
        </>
      }
      footnote="Robinson 2003; Carter 2006 (pediatric); Logi 2003; Wijdicks 2006."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        {modality === 'ssep' ? (
          <>
            <Readout
              label="Left N20 latency"
              value={ssep.leftN20Latency === 0 ? 'absent' : ssep.leftN20Latency.toFixed(1)}
              unit={ssep.leftN20Latency === 0 ? '' : 'ms'}
              status={
                ssep.leftN20Latency === 0
                  ? 'danger'
                  : ssep.leftN20Latency > 22
                    ? 'warn'
                    : 'good'
              }
            />
            <Readout
              label="Right N20 latency"
              value={ssep.rightN20Latency === 0 ? 'absent' : ssep.rightN20Latency.toFixed(1)}
              unit={ssep.rightN20Latency === 0 ? '' : 'ms'}
              status={
                ssep.rightN20Latency === 0
                  ? 'danger'
                  : ssep.rightN20Latency > 22
                    ? 'warn'
                    : 'good'
              }
            />
            <Readout label="Prognosis" value={ssep.prognosis} status={ssep.prognosis} hint={ssep.note} />
          </>
        ) : (
          <>
            <Readout
              label="Wave V latency"
              value={baer.waveLatencies.V === 0 ? 'absent' : baer.waveLatencies.V.toFixed(1)}
              unit={baer.waveLatencies.V === 0 ? '' : 'ms'}
              status={
                baer.waveLatencies.V === 0
                  ? 'danger'
                  : baer.waveLatencies.V > 6.0
                    ? 'warn'
                    : 'good'
              }
            />
            <Readout
              label="I–V interpeak"
              value={baer.interpeakIV === 0 ? 'n/a' : baer.interpeakIV.toFixed(1)}
              unit={baer.interpeakIV === 0 ? '' : 'ms'}
              status={baer.interpeakIV > 4.4 ? 'warn' : baer.interpeakIV === 0 ? 'danger' : 'good'}
            />
            <Readout label="Prognosis" value={baer.prognosis} status={baer.prognosis} hint={baer.note} />
          </>
        )}
      </div>
      <WidgetGrid>
        <WidgetPanel title={modality === 'ssep' ? 'SSEP, left + right cortical channels' : 'BAER, vertex-to-mastoid'}>
          <canvas ref={cv} className="block w-full" style={{ height: 280 }} />
        </WidgetPanel>
        <WidgetPanel title="Clinical context">
          <p className="text-[12.5px] text-ink/85 leading-[1.6] mb-3">{ssep && modality === 'ssep' ? ssep.note : baer.note}</p>
          <ul className="text-[12px] text-ink/85 leading-[1.55] space-y-2 list-none p-0">
            {modality === 'ssep' ? (
              <>
                <li><strong>Bilaterally absent N20</strong> at 24–72 h post-arrest (after warming, off NMB) → highly specific for poor outcome alongside other criteria.</li>
                <li><strong>Resistant to sedation and hypothermia</strong> at clinically relevant levels, that&apos;s why SSEP survives in post-arrest prognostication.</li>
                <li><strong>Pediatric maturation:</strong> latencies slightly longer in neonates / infants; use age-specific norms.</li>
              </>
            ) : (
              <>
                <li><strong>Wave I present, V absent</strong> → cochlear intact, brainstem dysfunction.</li>
                <li><strong>Prolonged I-V interpeak</strong> → pontine / midbrain conduction slowing.</li>
                <li>Less affected by sedation than EEG; useful adjunct in coma evaluation.</li>
              </>
            )}
          </ul>
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}

function drawSSEP(ctx: CanvasRenderingContext2D, w: number, h: number, p: SSEPProfileLike) {
  const padL = 50;
  const padR = 14;
  const padT = 16;
  const padB = 26;
  const tMin = 0;
  const tMax = 50; // ms
  const yScaleUv = 4; // ±4 µV
  const xS = (t: number) => padL + ((t - tMin) / (tMax - tMin)) * (w - padL - padR);
  const yMid = padT + (h - padT - padB) / 2;
  const yS = (v: number) => yMid - (v / yScaleUv) * ((h - padT - padB) / 2);

  // Grid
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 0.5;
  for (let t = 0; t <= 50; t += 10) {
    ctx.beginPath();
    ctx.moveTo(xS(t), padT);
    ctx.lineTo(xS(t), h - padB);
    ctx.stroke();
    ctx.fillStyle = '#94A3B8';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${t}ms`, xS(t), h - padB + 14);
  }
  ctx.beginPath();
  ctx.moveTo(padL, yMid);
  ctx.lineTo(w - padR, yMid);
  ctx.stroke();

  // Two channels: left (top half) + right (bottom half) labels offset
  const drawTrace = (latency: number, amp: number, color: string, yOffset: number, label: string) => {
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(label, padL - 6, yOffset + 4);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    const N = 500;
    for (let i = 0; i < N; i++) {
      const t = tMin + (i / N) * (tMax - tMin);
      const v = ssepSample(t, latency, amp);
      const x = xS(t);
      const y = yOffset - (v / yScaleUv) * 60;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    if (latency > 0) {
      ctx.strokeStyle = '#FCD34D';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(xS(latency), yOffset - 60);
      ctx.lineTo(xS(latency), yOffset + 60);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#FCD34D';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('N20', xS(latency), yOffset - 64);
    }
  };
  drawTrace(p.leftN20Latency, p.leftN20Amplitude, '#5EEAD4', padT + (h - padT - padB) / 4, 'Left CP3');
  drawTrace(p.rightN20Latency, p.rightN20Amplitude, '#F59E0B', padT + (3 * (h - padT - padB)) / 4, 'Right CP4');

  // Suppress unused params warning
  yS(0);
}

interface SSEPProfileLike {
  leftN20Latency: number;
  rightN20Latency: number;
  leftN20Amplitude: number;
  rightN20Amplitude: number;
}

function drawBAER(ctx: CanvasRenderingContext2D, w: number, h: number, b: { waveLatencies: { I: number; III: number; V: number } }) {
  const padL = 50;
  const padR = 14;
  const padT = 16;
  const padB = 26;
  const tMin = 0;
  const tMax = 10; // ms
  const xS = (t: number) => padL + ((t - tMin) / (tMax - tMin)) * (w - padL - padR);
  const yMid = (padT + h - padB) / 2;
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 0.5;
  for (let t = 0; t <= 10; t += 1) {
    ctx.beginPath();
    ctx.moveTo(xS(t), padT);
    ctx.lineTo(xS(t), h - padB);
    ctx.stroke();
    ctx.fillStyle = '#94A3B8';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${t}`, xS(t), h - padB + 14);
  }
  ctx.fillStyle = '#5EEAD4';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('time (ms)', (padL + w - padR) / 2, h - 6);

  ctx.beginPath();
  ctx.moveTo(padL, yMid);
  ctx.lineTo(w - padR, yMid);
  ctx.stroke();

  ctx.strokeStyle = '#5EEAD4';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  const N = 500;
  for (let i = 0; i < N; i++) {
    const t = tMin + (i / N) * (tMax - tMin);
    const v = baerSample(t, b.waveLatencies);
    const x = xS(t);
    const y = yMid - v * 80;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Wave labels
  (['I', 'III', 'V'] as const).forEach((wave) => {
    const lat = b.waveLatencies[wave];
    if (lat === 0) return;
    ctx.strokeStyle = '#FCD34D';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(xS(lat), padT);
    ctx.lineTo(xS(lat), h - padB);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#FCD34D';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(wave, xS(lat), padT + 12);
  });
}
