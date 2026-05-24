'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { Button, Readout, ToggleRow } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel, WidgetTakeaway } from '../shared/WidgetShell';
import { useAnimationLoop } from '../shared/useCanvas';
import {
  classifyR,
  classifyRLabel,
  makeRng,
  reset as resetState,
  seed,
  step,
} from './engine';
import {
  renderMAPoptChart,
  renderRawChart,
  renderTraceChart,
  renderWindowChart,
} from './canvas';
import {
  DEFAULT_CONFIG,
  makeInitialState,
  type AutoregMode,
  type IndexChoice,
} from './types';

const SPEEDS = [
  { value: '1', label: '1×' },
  { value: '10', label: '10×' },
  { value: '60', label: '60×' },
  { value: '160', label: '160×' },
];

export default function MAPoptUCurve() {
  const stateRef = useRef(makeInitialState());
  const rngRef = useRef(makeRng(57));
  const cfgRef = useRef(DEFAULT_CONFIG);
  const [, force] = useReducer((x: number) => x + 1, 0);

  const [speed, setSpeed] = useState(10);
  const [mode, setMode] = useState<AutoregMode>('realistic');
  const [indexChoice, setIndexChoice] = useState<IndexChoice>('orx');
  const [demoActive, setDemoActive] = useState(false);
  const demoStartRef = useRef(0);

  const rawCv = useRef<HTMLCanvasElement>(null);
  const winCv = useRef<HTMLCanvasElement>(null);
  const traceCv = useRef<HTMLCanvasElement>(null);
  const optCv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    seed(stateRef.current, cfgRef.current, rngRef.current, 8 * 60);
    drawAll();
    force();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    stateRef.current.mode = mode;
  }, [mode]);

  useAnimationLoop((_now, dtMs) => {
    if (dtMs <= 0) return;
    const dt = Math.min(0.1, dtMs / 1000);
    step(stateRef.current, dt, speed, cfgRef.current, rngRef.current);

    if (demoActive) {
      const elapsed = stateRef.current.simT - demoStartRef.current;
      if (elapsed >= 4 * 3600) {
        setDemoActive(false);
        setSpeed(10);
      }
    }

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
    draw(rawCv.current, (ctx, w, h) => renderRawChart(ctx, w, h, stateRef.current, indexChoice));
    draw(winCv.current, (ctx, w, h) => renderWindowChart(ctx, w, h, stateRef.current, indexChoice));
    draw(traceCv.current, (ctx, w, h) => renderTraceChart(ctx, w, h, stateRef.current, indexChoice));
    draw(optCv.current, (ctx, w, h) =>
      renderMAPoptChart(ctx, w, h, stateRef.current, cfgRef.current, indexChoice),
    );
  }

  // Re-draw immediately when the user flips the index toggle, even between
  // animation ticks.
  useEffect(() => {
    drawAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexChoice]);

  function onReset() {
    resetState(stateRef.current);
    setMode('realistic');
    rngRef.current = makeRng(57);
    seed(stateRef.current, cfgRef.current, rngRef.current, 8 * 60);
    drawAll();
    force();
  }

  function onDemo() {
    resetState(stateRef.current);
    stateRef.current.mode = 'realistic';
    setMode('realistic');
    setSpeed(160);
    rngRef.current = makeRng(57);
    setDemoActive(true);
    demoStartRef.current = stateRef.current.simT;
  }

  const s = stateRef.current;
  const last = s.meanPairs[s.meanPairs.length - 1];
  const pipe = indexChoice === 'orx' ? s.orx : s.mx;
  const indexName = indexChoice === 'orx' ? 'ORx' : 'Mx';
  const derivedLabel = indexChoice === 'orx' ? 'rSO₂' : 'MFV';
  const derivedUnit = indexChoice === 'orx' ? '%' : 'cm/s';
  const derivedValue = last
    ? indexChoice === 'orx'
      ? last.rso2.toFixed(1)
      : last.mfv.toFixed(0)
    : '-';
  const minutes = pipe.buffer.length;
  const totalMin = Math.floor(s.simT / 60);
  const h = Math.floor(totalMin / 60);
  const mm = totalMin % 60;
  const clock = `Sim time: ${h}h ${mm.toString().padStart(2, '0')}m`;
  const status = demoActive
    ? { variant: 'demo' as const, label: 'Demo running' }
    : { variant: 'running' as const, label: 'Running' };

  const rStatus = classifyR(pipe.rValue);
  const nBins = Object.keys(pipe.binData).length;

  return (
    <WidgetShell
      eyebrow="Pediatric MNM · Interactive (non-invasive)"
      title="MAPopt, Bedside autoregulation widget (ORx / Mx)"
      status={status}
      clock={clock}
      controls={
        <>
          <ToggleRow<IndexChoice>
            label="Driving index"
            value={indexChoice}
            onChange={setIndexChoice}
            options={[
              { value: 'orx', label: 'ORx (NIRS)', accent: 'amber' },
              { value: 'mx', label: 'Mx (TCD)', accent: 'purple' },
            ]}
          />
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
            onChange={(v) => {
              setSpeed(parseInt(v, 10));
              if (demoActive) setDemoActive(false);
            }}
            options={SPEEDS}
          />
          <div className="flex-1" />
          <Button variant="demo" onClick={onDemo}>
            ▶ 4-hour demo (~90s)
          </Button>
          <Button variant="secondary" onClick={onReset}>
            Reset Buffer
          </Button>
        </>
      }
      footnote={
        <>
          Pedagogical simulation, not a clinical device. Methodology: Brady 2007 (ORx),
          Czosnyka 1996 (Mx), Aries 2012 / Beqiri 2024 (CPPopt framework). MAPopt is the
          non-invasive analog of CPPopt: same parabolic-fit math, with MAP on the X-axis
          since ICP is not assumed.
        </>
      }
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mb-2.5">
        <Readout label="MAP (10-s avg)" value={last ? last.map.toFixed(0) : '-'} unit="mmHg" />
        <Readout label={derivedLabel} value={derivedValue} unit={derivedUnit} />
        <Readout
          label={`${indexName} (5-min window)`}
          value={pipe.rValue == null ? '-' : (pipe.rValue >= 0 ? '+' : '') + pipe.rValue.toFixed(2)}
          status={rStatus}
          hint={classifyRLabel(pipe.rValue)}
        />
        <Readout
          label={`MAPopt (${indexName})`}
          value={pipe.optValue == null ? '-' : pipe.optValue.toFixed(0)}
          unit={pipe.optValue == null ? undefined : 'mmHg'}
          status={pipe.optValue == null ? 'neutral' : 'good'}
          hint={pipe.optValue == null ? 'awaiting fit…' : 'vertex of parabolic fit'}
        />
      </div>

      <WidgetGrid>
        <div className="space-y-2.5">
          <WidgetPanel
            title={`① Raw ABP & ${derivedLabel},10-second decimation`}
            subtitle={`High-frequency ABP and ${derivedLabel} being averaged into one paired (MAP, ${derivedLabel}) point every 10 seconds.`}
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-1.5 flex justify-between">
              <span>Last 60 sim-seconds</span>
              <span className="flex gap-3 normal-case tracking-normal text-[10px]">
                <Legend dot="#5EEAD4" label="ABP" />
                <Legend dot={indexChoice === 'orx' ? '#FCD34D' : '#A78BFA'} label={derivedLabel} />
                <Legend dot="#14B8A6" label="10-s mean" />
              </span>
            </div>
            <canvas ref={rawCv} className="block w-full" style={{ height: 140 }} />
          </WidgetPanel>

          <WidgetPanel
            title="② Moving 5-minute window, Pearson correlation"
            subtitle={`30 paired (MAP, ${derivedLabel}) 10-s averages. Pearson r updates every minute.`}
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-1.5 flex justify-between">
              <span>30 paired data points</span>
              <span className="flex gap-3 normal-case tracking-normal text-[10px]">
                <Legend dot="#14B8A6" label="MAP" />
                <Legend dot={indexChoice === 'orx' ? '#FCD34D' : '#A78BFA'} label={derivedLabel} />
              </span>
            </div>
            <canvas ref={winCv} className="block w-full" style={{ height: 140 }} />
          </WidgetPanel>

          <WidgetPanel
            title={`③ Continuous ${indexName} trace`}
            subtitle={`One ${indexName} value per sim-minute. Color-coded by zone (green ≤ 0.05, amber 0.05–0.30, red ≥ 0.30).`}
          >
            <canvas ref={traceCv} className="block w-full" style={{ height: 130 }} />
          </WidgetPanel>
        </div>

        <div className="space-y-2.5">
          <WidgetPanel
            title={`④ MAPopt curve, picking the optimum (${indexName})`}
            subtitle={`${indexName} (Y) vs binned MAP (X) over the last ${cfgRef.current.bufferHours} sim-hours. Parabolic fit. MAPopt = curve minimum.`}
          >
            <canvas ref={optCv} className="block w-full" style={{ height: 380 }} />
          </WidgetPanel>

          <div className="grid gap-2.5 grid-cols-2">
            <Readout
              label="Buffer fill"
              value={`${Math.min(100, Math.round((100 * minutes) / (cfgRef.current.bufferHours * 60)))}%`}
              hint={`${nBins} of ≥${cfgRef.current.minBinsForFit} bins ready`}
            />
            <Readout
              label="Both indices?"
              value={
                s.orx.optValue != null && s.mx.optValue != null
                  ? 'agree'
                  : s.orx.optValue != null || s.mx.optValue != null
                    ? 'partial'
                    : '-'
              }
              hint={
                s.orx.optValue != null && s.mx.optValue != null
                  ? `ORx ${s.orx.optValue.toFixed(0)} · Mx ${s.mx.optValue.toFixed(0)} mmHg`
                  : 'fits not yet converged'
              }
              status={
                s.orx.optValue != null && s.mx.optValue != null
                  ? Math.abs(s.orx.optValue - s.mx.optValue) <= 5
                    ? 'good'
                    : 'warn'
                  : 'neutral'
              }
            />
          </div>

          <div className="rounded-md border-l-[3px] border-l-brand-purple bg-surface-deeper p-3 text-[11.5px] text-ink/85 leading-[1.55]">
            <strong className="text-brand-purple">Try this:</strong> click the orange{' '}
            <strong>4-hour demo</strong>. The buffer fills with (MAP, {indexName}) pairs, the
            parabola appears, MAPopt emerges. Then flip the <strong>Driving index</strong> toggle to
            see whether the NIRS-based and TCD-based methods converge on the same target, they
            usually agree to within ±5 mmHg when both signals are clean.
          </div>
        </div>
      </WidgetGrid>

      <WidgetTakeaway>
        MAPopt is the MAP at which a fully non-invasive autoregulation index (ORx or Mx) is at its
        minimum, the bedside-derived perfusion target when ICP is not available. Same parabolic-fit
        framework as CPPopt; aim within ±5 mmHg of the vertex.
      </WidgetTakeaway>
    </WidgetShell>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="inline-block h-[3px] w-2.5 rounded-sm"
        style={{ background: dot }}
        aria-hidden
      />
      {label}
    </span>
  );
}
