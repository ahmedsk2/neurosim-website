'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { Button, Readout, ToggleRow } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';
import { useAnimationLoop } from '../shared/useCanvas';
import {
  classify,
  classifyLabel,
  makeRng,
  makeInitialState,
  reset as resetState,
  seed,
  step,
  type AutoregMode,
  type IndexConfig,
} from '../_shared/correlationIndex';
import {
  renderRawChart,
  renderTraceChart,
  renderWindowChart,
} from '../_shared/correlationCanvas';

const MX_CONFIG: IndexConfig = {
  name: 'Mx',
  signalLabel: 'MFV',
  signalUnit: 'cm/s',
  signalBaseline: 60,
  // Intact: MFV is buffered (vessel calibre changes absorb MAP swings),
  // coupling 0, with an independent slow-wave component so the signal looks
  // alive but is uncorrelated with MAP (Pearson r ≈ 0).
  // Impaired: MFV tracks MAP linearly, positive coupling, no independence.
  intactCoupling: 0,
  impairedCoupling: 0.65,
  intactIndependentAmp: 0.55,
  noiseAmp: 1.2,
  warnThreshold: 0.05,
  impairedThreshold: 0.3,
  sampleRateHz: 100,
  decimationSec: 10,
  windowSize: 30,
};

export default function MxCalculator() {
  const stateRef = useRef(makeInitialState());
  const rngRef = useRef(makeRng(31));
  const [, force] = useReducer((x: number) => x + 1, 0);
  const [speed, setSpeed] = useState(10);
  const [mode, setMode] = useState<AutoregMode>('realistic');

  const rawCv = useRef<HTMLCanvasElement>(null);
  const winCv = useRef<HTMLCanvasElement>(null);
  const traceCv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    seed(stateRef.current, MX_CONFIG, rngRef.current, 8 * 60);
    drawAll();
    force();
  }, []);

  useEffect(() => {
    stateRef.current.mode = mode;
  }, [mode]);

  useAnimationLoop((_now, dtMs) => {
    if (dtMs <= 0) return;
    const dt = Math.min(0.1, dtMs / 1000);
    step(stateRef.current, dt, speed, MX_CONFIG, rngRef.current);
    drawAll();
    force();
  }, true);

  function drawAll() {
    const draw = (
      cv: HTMLCanvasElement | null,
      fn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
    ) => {
      if (!cv) return;
      const ctx = cv.getContext('2d');
      if (!ctx) return;
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      if (cv.width !== w * dpr) cv.width = w * dpr;
      if (cv.height !== h * dpr) cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fn(ctx, w, h);
    };
    draw(rawCv.current, (ctx, w, h) => renderRawChart(ctx, w, h, stateRef.current, MX_CONFIG));
    draw(winCv.current, (ctx, w, h) => renderWindowChart(ctx, w, h, stateRef.current, MX_CONFIG));
    draw(traceCv.current, (ctx, w, h) => renderTraceChart(ctx, w, h, stateRef.current, MX_CONFIG));
  }

  const s = stateRef.current;
  const last = s.meanPairs[s.meanPairs.length - 1];
  const totalMin = Math.floor(s.simT / 60);
  const h = Math.floor(totalMin / 60);
  const mm = totalMin % 60;
  const clock = `Sim time: ${h}h ${mm.toString().padStart(2, '0')}m`;

  return (
    <WidgetShell
      eyebrow="Derived index · Mx"
      title="Mx, TCD-based reactivity"
      status={{ variant: 'running', label: 'Running' }}
      clock={clock}
      controls={
        <>
          <ToggleRow<AutoregMode>
            label="Patient autoregulation"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'realistic', label: 'Realistic', accent: 'purple' },
              { value: 'intact', label: 'Always intact', accent: 'green' },
              { value: 'impaired', label: 'Always impaired', accent: 'red' },
            ]}
          />
          <ToggleRow
            label="Speed"
            value={String(speed)}
            onChange={(v) => setSpeed(parseInt(v, 10))}
            options={[
              { value: '1', label: '1×' },
              { value: '4', label: '4×' },
              { value: '16', label: '16×' },
              { value: '60', label: '60×' },
            ]}
          />
          <div className="flex-1" />
          <Button
            variant="secondary"
            onClick={() => {
              resetState(stateRef.current);
              rngRef.current = makeRng(31);
              seed(stateRef.current, MX_CONFIG, rngRef.current, 8 * 60);
              drawAll();
              force();
            }}
          >
            Reset
          </Button>
        </>
      }
      footnote="Czosnyka 1996 (Mx) · Schmidt 2003,moving Pearson r between 30 paired 10-second MAP and TCD MFV averages."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-4 mb-2.5">
        <Readout label="MAP" value={last ? last.map.toFixed(0) : '-'} unit="mmHg" />
        <Readout label="MFV" value={last ? last.y.toFixed(0) : '-'} unit="cm/s" />
        <Readout
          label="window"
          value={`${s.meanPairs.length}/${MX_CONFIG.windowSize}`}
          hint="paired points"
        />
        <Readout
          label="Mx"
          value={s.value == null ? '-' : (s.value >= 0 ? '+' : '') + s.value.toFixed(2)}
          status={classify(s.value, MX_CONFIG)}
          hint={classifyLabel(s.value, MX_CONFIG)}
        />
      </div>
      <WidgetGrid>
        <div className="space-y-2.5">
          <WidgetPanel
            title="① Raw signal & 10-second averages"
            subtitle="ABP and TCD MFV being decimated to one paired (MAP, MFV) point every 10 seconds."
          >
            <canvas ref={rawCv} className="block w-full" style={{ height: 140 }} />
          </WidgetPanel>
          <WidgetPanel
            title="② Moving 5-minute window, MAP vs MFV scatter"
            subtitle="The 30 paired points whose Pearson r becomes the live Mx."
          >
            <canvas ref={winCv} className="block w-full" style={{ height: 140 }} />
          </WidgetPanel>
        </div>
        <div className="space-y-2.5">
          <WidgetPanel
            title="③ Continuous Mx trace (last 60 sim-min)"
            subtitle="One value per sim-minute; color-coded by zone (green ≤ 0.05; amber 0.05–0.30; red ≥ 0.30)."
          >
            <canvas ref={traceCv} className="block w-full" style={{ height: 200 }} />
          </WidgetPanel>
          <div className="rounded-md border-l-[3px] border-l-brand-purple bg-surface-deeper p-3 text-[12px] text-ink/85 leading-[1.55]">
            <strong className="text-brand-purple">Try this:</strong> with autoregulation set to{' '}
            <strong>Realistic</strong>, MFV stays close to its baseline as MAP drifts and Mx hovers
            near zero. Toggle <strong>Always impaired</strong> and the velocity slow-waves swell
            until MFV faithfully tracks MAP, Mx rises through 0.30. The arithmetic is identical to
            PRx; only the second signal differs.
          </div>
        </div>
      </WidgetGrid>
    </WidgetShell>
  );
}
