'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { Button, Readout, ToggleRow } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';
import { useAnimationLoop } from '../shared/useCanvas';
import {
  classifyPRx,
  classifyPRxLabel,
  makeRng,
  reset as resetState,
  seed,
  step,
} from '../CPPoptUCurve/engine';
import { renderRawChart, renderPRxChart, renderWindowChart } from '../CPPoptUCurve/canvas';
import {
  DEFAULT_CONFIG,
  makeInitialState,
  type AutoregMode,
} from '../CPPoptUCurve/types';

export default function PRxCalculator() {
  const stateRef = useRef(makeInitialState());
  const rngRef = useRef(makeRng(11));
  const cfgRef = useRef(DEFAULT_CONFIG);
  const [, force] = useReducer((x: number) => x + 1, 0);
  const [speed, setSpeed] = useState(10);
  const [mode, setMode] = useState<AutoregMode>('realistic');

  const rawCv = useRef<HTMLCanvasElement>(null);
  const winCv = useRef<HTMLCanvasElement>(null);
  const prxCv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    seed(stateRef.current, cfgRef.current, rngRef.current, 8 * 60);
    drawAll();
    force();
  }, []);

  useEffect(() => {
    stateRef.current.mode = mode;
  }, [mode]);

  useAnimationLoop((_now, dtMs) => {
    if (dtMs <= 0) return;
    const dt = Math.min(0.1, dtMs / 1000);
    step(stateRef.current, dt, speed, cfgRef.current, rngRef.current);
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
    draw(rawCv.current, (ctx, w, h) => renderRawChart(ctx, w, h, stateRef.current));
    draw(winCv.current, (ctx, w, h) => renderWindowChart(ctx, w, h, stateRef.current));
    draw(prxCv.current, (ctx, w, h) => renderPRxChart(ctx, w, h, stateRef.current));
  }

  const s = stateRef.current;
  const last = s.meanPairs[s.meanPairs.length - 1];
  const totalMin = Math.floor(s.simT / 60);
  const h = Math.floor(totalMin / 60);
  const mm = totalMin % 60;
  const clock = `Sim time: ${h}h ${mm.toString().padStart(2, '0')}m`;

  return (
    <WidgetShell
      eyebrow="Derived index · PRx"
      title="PRx, pressure reactivity index"
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
              rngRef.current = makeRng(11);
              seed(stateRef.current, cfgRef.current, rngRef.current, 8 * 60);
              drawAll();
              force();
            }}
          >
            Reset
          </Button>
        </>
      }
      footnote="Czosnyka 1997,PRx is the moving Pearson r between 30 paired 10-second MAP and ICP averages."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-4 mb-2.5">
        <Readout label="MAP" value={last ? last.map.toFixed(0) : '-'} unit="mmHg" />
        <Readout label="ICP" value={last ? last.icp.toFixed(0) : '-'} unit="mmHg" />
        <Readout label="CPP" value={last ? last.cpp.toFixed(0) : '-'} unit="mmHg" />
        <Readout
          label="PRx"
          value={s.prxValue == null ? '-' : (s.prxValue >= 0 ? '+' : '') + s.prxValue.toFixed(2)}
          status={classifyPRx(s.prxValue)}
          hint={classifyPRxLabel(s.prxValue)}
        />
      </div>
      <WidgetGrid>
        <div className="space-y-2.5">
          <WidgetPanel
            title="① Raw signal & 10-second averages"
            subtitle="Decimating ABP and ICP to a single paired (MAP, ICP) point every 10 seconds."
          >
            <canvas ref={rawCv} className="block w-full" style={{ height: 140 }} />
          </WidgetPanel>
          <WidgetPanel
            title="② Moving 5-minute window"
            subtitle="The 30 paired points whose Pearson r becomes the live PRx."
          >
            <canvas ref={winCv} className="block w-full" style={{ height: 140 }} />
          </WidgetPanel>
        </div>
        <div className="space-y-2.5">
          <WidgetPanel
            title="③ Continuous PRx trace (last 60 sim-min)"
            subtitle="One value per sim-minute; color-coded by zone (green ≤ 0.05; amber 0.05–0.25; red ≥ 0.25)."
          >
            <canvas ref={prxCv} className="block w-full" style={{ height: 200 }} />
          </WidgetPanel>
          <div className="rounded-md border-l-[3px] border-l-brand-purple bg-surface-deeper p-3 text-[12px] text-ink/85 leading-[1.55]">
            <strong className="text-brand-purple">Try this:</strong> with autoregulation set to{' '}
            <strong>Realistic</strong>, watch the PRx hover near zero. Toggle{' '}
            <strong>Always impaired</strong>,PRx climbs above 0.25 within minutes (the moving
            window has to fill before the index stabilises).
          </div>
        </div>
      </WidgetGrid>
    </WidgetShell>
  );
}
