'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';
import { bandFor, deltaT } from './engine';

export default function ThermalCBFDemo() {
  const [cbf, setCbf] = useState(50);
  const cv = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const dT = deltaT(cbf);
  const band = bandFor(cbf);

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

          // Schematic: heater bead (left) + thermistor (right) + flowing particles
          const heaterX = w * 0.25;
          const sensorX = w * 0.75;
          const yMid = h / 2;

          // Vessel
          ctx.fillStyle = '#152238';
          ctx.fillRect(0, yMid - 36, w, 72);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(0, yMid - 36, w, 72);

          // Heat plume from heater scaling with 1/CBF
          const plume = 60 * Math.max(0.2, 1 / (1 + cbf / 20));
          ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
          ctx.beginPath();
          ctx.ellipse(heaterX, yMid, plume, 32, 0, 0, 2 * Math.PI);
          ctx.fill();

          // Heater bead
          ctx.fillStyle = '#EF4444';
          ctx.strokeStyle = '#0F1A2E';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(heaterX, yMid, 8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#94A3B8';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('heater', heaterX, yMid - 44);

          // Sensor
          ctx.fillStyle = '#5EEAD4';
          ctx.beginPath();
          ctx.arc(sensorX, yMid, 6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = '#94A3B8';
          ctx.fillText('sensor', sensorX, yMid - 44);
          ctx.fillStyle = '#FCD34D';
          ctx.font = 'bold 11px Consolas, monospace';
          ctx.fillText(`ΔT ${dT.toFixed(2)} °C`, sensorX, yMid + 56);

          // Flowing particles, speed proportional to CBF
          const speed = 0.5 + cbf * 0.04;
          for (let i = 0; i < 18; i++) {
            const phase = (tRef.current * speed + i * 0.6) % 1;
            const px = phase * w;
            const py = yMid + Math.sin(i * 0.7 + tRef.current) * 18;
            ctx.fillStyle = 'rgba(94, 234, 212, 0.7)';
            ctx.beginPath();
            ctx.arc(px, py, 3, 0, 2 * Math.PI);
            ctx.fill();
          }

          ctx.fillStyle = '#94A3B8';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('flow direction →', w / 2, h - 8);
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cbf, dT]);

  return (
    <WidgetShell
      eyebrow="Direct CBF"
      title="Thermal-diffusion CBF probe (Hemedex / Bowman)"
      footnote="Research-grade. Local sample (~1 cm³). Calibration-sensitive."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout label="Regional CBF" value={cbf} unit="mL/100g/min" status={band.status} hint={band.label} />
        <Readout label="Steady-state ΔT" value={dT.toFixed(2)} unit="°C" />
        <Readout label="Astrup band" value={cbf < 15 ? '< 15' : cbf < 25 ? '15–24' : cbf < 35 ? '25–34' : cbf < 50 ? '35–49' : '≥ 50'} status={band.status} />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Bead → vessel → sensor schematic">
          <canvas ref={cv} className="block w-full" style={{ height: 220 }} />
          <input
            type="range"
            min={0}
            max={100}
            value={cbf}
            onChange={(e) => setCbf(parseInt(e.target.value, 10))}
            className="w-full mt-3 accent-brand-teal"
            aria-label="CBF slider"
          />
        </WidgetPanel>
        <WidgetPanel title="Why thermal CBF matters">
          <ul className="text-[12.5px] text-ink/85 leading-[1.55] space-y-2 list-none p-0">
            <li>Direct quantitative regional CBF (mL/100g/min),not a flow surrogate.</li>
            <li>Local sample volume ~1 cm³; placement matters.</li>
            <li>Heat removal scales with flow → ΔT inversely tracks CBF.</li>
            <li>Calibration drift over days, re-calibrate per protocol.</li>
            <li>Pediatric data sparse; thresholds are adult-extrapolated.</li>
          </ul>
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}
