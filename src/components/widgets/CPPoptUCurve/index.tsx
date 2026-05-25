'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { Button, Readout, ToggleRow } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel, WidgetTakeaway } from '../shared/WidgetShell';
import { useAnimationLoop } from '../shared/useCanvas';
import {
  classifyPRx,
  classifyPRxLabel,
  makeRng,
  reset as resetState,
  seed,
  step,
} from './engine';
import {
  renderCPPoptChart,
  renderPRxChart,
  renderRawChart,
  renderWindowChart,
} from './canvas';
import { DEFAULT_CONFIG, makeInitialState, type AutoregMode } from './types';

const SPEEDS = [
  { value: '1', label: '1×' },
  { value: '10', label: '10×' },
  { value: '60', label: '60×' },
  { value: '160', label: '160×' },
];

export default function CPPoptUCurve() {
  const stateRef = useRef(makeInitialState());
  const rngRef = useRef(makeRng(42));
  const cfgRef = useRef(DEFAULT_CONFIG);
  const [, force] = useReducer((x: number) => x + 1, 0);

  const [speed, setSpeed] = useState(10);
  const [mode, setMode] = useState<AutoregMode>('realistic');
  const [demoActive, setDemoActive] = useState(false);
  const demoStartRef = useRef(0);

  // Canvases
  const rawCv = useRef<HTMLCanvasElement>(null);
  const winCv = useRef<HTMLCanvasElement>(null);
  const prxCv = useRef<HTMLCanvasElement>(null);
  const optCv = useRef<HTMLCanvasElement>(null);

  // Seed initial buffer
  useEffect(() => {
    seed(stateRef.current, cfgRef.current, rngRef.current, 8 * 60);
    force();
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
    draw(rawCv.current, (ctx, w, h) => renderRawChart(ctx, w, h, stateRef.current));
    draw(winCv.current, (ctx, w, h) => renderWindowChart(ctx, w, h, stateRef.current));
    draw(prxCv.current, (ctx, w, h) => renderPRxChart(ctx, w, h, stateRef.current));
    draw(optCv.current, (ctx, w, h) =>
      renderCPPoptChart(ctx, w, h, stateRef.current, cfgRef.current),
    );
  }

  // Re-draw on first render after seed
  useEffect(() => {
    drawAll();
  }, []);

  function onReset() {
    resetState(stateRef.current);
    setMode('realistic');
    rngRef.current = makeRng(42);
    seed(stateRef.current, cfgRef.current, rngRef.current, 8 * 60);
    drawAll();
    force();
  }

  function onDemo() {
    resetState(stateRef.current);
    stateRef.current.mode = 'realistic';
    setMode('realistic');
    setSpeed(160);
    rngRef.current = makeRng(42);
    setDemoActive(true);
    demoStartRef.current = stateRef.current.simT;
  }

  const s = stateRef.current;
  const last = s.meanPairs[s.meanPairs.length - 1];
  const minutes = s.cppoptBuffer.length;
  const totalMin = Math.floor(s.simT / 60);
  const h = Math.floor(totalMin / 60);
  const mm = totalMin % 60;
  const clock = `Sim time: ${h}h ${mm.toString().padStart(2, '0')}m`;
  const status = demoActive
    ? { variant: 'demo' as const, label: 'Demo running' }
    : { variant: 'running' as const, label: 'Running' };

  const prxStatus = classifyPRx(s.prxValue);
  const nBins = Object.keys(s.binData).length;

  return (
    <WidgetShell
      eyebrow="Pediatric MNM · Interactive"
      title="CPPopt, Bedside autoregulation widget"
      status={status}
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
          Pedagogical simulation, not a clinical device. Methodology: Czosnyka 1997 (PRx), Aries 2012 / Beqiri 2024 (CPPopt), COGiTATE band.
        </>
      }
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mb-2.5">
        <Readout label="MAP (10-s avg)" value={last ? last.map.toFixed(0) : '-'} unit="mmHg" />
        <Readout label="ICP (10-s avg)" value={last ? last.icp.toFixed(0) : '-'} unit="mmHg" />
        <Readout label="CPP" value={last ? last.cpp.toFixed(0) : '-'} unit="mmHg" />
        <Readout
          label="PRx (5-min window)"
          value={s.prxValue == null ? '-' : (s.prxValue >= 0 ? '+' : '') + s.prxValue.toFixed(2)}
          status={prxStatus}
          hint={classifyPRxLabel(s.prxValue)}
        />
      </div>

      <WidgetGrid>
        <div className="space-y-2.5">
          <WidgetPanel
            title="① Raw signal & 10-second averages"
            subtitle="High-frequency ABP and ICP being decimated to one paired (MAP, ICP) point every 10 seconds."
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-1.5 flex justify-between">
              <span>Last 60 sim-seconds</span>
              <span className="flex gap-3 normal-case tracking-normal text-[10px]">
                <Legend dot="#5EEAD4" label="ABP" />
                <Legend dot="#F59E0B" label="ICP" />
                <Legend dot="#14B8A6" label="10-s mean" />
              </span>
            </div>
            <canvas ref={rawCv} className="block w-full" style={{ height: 140 }} />
          </WidgetPanel>

          <WidgetPanel
            title="② Moving 5-minute window, Pearson correlation"
            subtitle="30 paired (MAP, ICP) 10-s averages. Correlation updates every minute."
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-1.5 flex justify-between">
              <span>30 paired data points</span>
              <span className="flex gap-3 normal-case tracking-normal text-[10px]">
                <Legend dot="#14B8A6" label="MAP" />
                <Legend dot="#EF4444" label="ICP" />
              </span>
            </div>
            <canvas ref={winCv} className="block w-full" style={{ height: 140 }} />
          </WidgetPanel>

          <WidgetPanel
            title="③ Continuous PRx trace"
            subtitle="One PRx value per sim-minute. Color-coded by zone."
          >
            <canvas ref={prxCv} className="block w-full" style={{ height: 130 }} />
          </WidgetPanel>
        </div>

        <div className="space-y-2.5">
          <WidgetPanel
            title="④ CPPopt curve, picking the optimum"
            subtitle="PRx (Y) vs binned CPP (X) over the last 4 sim-hours. Parabolic fit. CPPopt = curve minimum."
          >
            <canvas ref={optCv} className="block w-full" style={{ height: 380 }} />
          </WidgetPanel>

          <div className="grid gap-2.5 grid-cols-2">
            <Readout
              label="CPPopt"
              value={s.cppoptValue == null ? '-' : s.cppoptValue.toFixed(0)}
              status={s.cppoptValue == null ? 'neutral' : 'good'}
              hint="mmHg (vertex of fit)"
            />
            <Readout
              label="Buffer fill"
              value={`${Math.min(100, Math.round((100 * minutes) / (DEFAULT_CONFIG.bufferHours * 60)))}%`}
              hint={`${nBins} of ≥${DEFAULT_CONFIG.minBinsForFit} bins ready`}
            />
          </div>

          <Steps minutes={minutes} nBins={nBins} fitPresent={!!s.fitCoeff} cppopt={s.cppoptValue} />

          <div className="rounded-md border-l-[3px] border-l-brand-purple bg-surface-deeper p-3 text-[11.5px] text-ink/85 leading-[1.55]">
            <strong className="text-brand-purple">Try this:</strong> click the orange{' '}
            <strong>4-hour demo</strong> button, the buffer resets and the patient runs through 4
            sim-hours of physiology in ~90 seconds. Watch the dots populate, the bins fill, the
            parabola form, and the vertex emerge. Then toggle <strong>Always impaired</strong> mid-run
            to see the curve flatten.
          </div>
        </div>
      </WidgetGrid>

      <WidgetTakeaway>
        CPPopt is the CPP at which the moving (CPP, PRx) data fits a parabola whose minimum is most
        negative, the bedside-derived optimal perfusion pressure. Aim within ±5 mmHg of CPPopt.
      </WidgetTakeaway>
    </WidgetShell>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="inline-block h-[3px] w-2.5 rounded-xs"
        style={{ background: dot }}
        aria-hidden
      />
      {label}
    </span>
  );
}

function Steps({
  minutes,
  nBins,
  fitPresent,
  cppopt,
}: {
  minutes: number;
  nBins: number;
  fitPresent: boolean;
  cppopt: number | null;
}) {
  const items = [
    {
      n: 1,
      title: `Collect (CPP, PRx) pairs`,
      tag: `${minutes} pair${minutes === 1 ? '' : 's'}`,
      desc:
        'Each sim-minute, you get one PRx value (5-min window) and one mean CPP. Plotted as a faint dot.',
      done: minutes > 0,
      active: minutes > 0 && nBins < DEFAULT_CONFIG.minBinsForFit,
    },
    {
      n: 2,
      title: 'Group into 5-mmHg CPP bins',
      tag: `${nBins} / ${DEFAULT_CONFIG.minBinsForFit} bins`,
      desc:
        'Bins of 40–45, 45–50, … 105–110. Mean PRx per bin (≥12 minutes per bin). Filled circles.',
      done: nBins >= DEFAULT_CONFIG.minBinsForFit,
      active: nBins > 0 && nBins < DEFAULT_CONFIG.minBinsForFit,
    },
    {
      n: 3,
      title: 'Fit a quadratic to the bin means',
      desc: 'Least-squares y = ax² + bx + c. Accept only if a > 0 and the minimum is in range.',
      done: fitPresent,
      active: nBins >= DEFAULT_CONFIG.minBinsForFit && !fitPresent,
    },
    {
      n: 4,
      title: 'Read off the vertex',
      desc: 'Bottom of the parabola, autoregulation works best there. CPPopt = −b ⁄ (2a).',
      done: cppopt != null,
      active: fitPresent && cppopt != null,
    },
    {
      n: 5,
      title: 'Aim within ±5 mmHg of CPPopt',
      tag: cppopt != null ? `target: ${(cppopt - 5).toFixed(0)}–${(cppopt + 5).toFixed(0)} mmHg` : 'target: -',
      desc:
        'Orange band on the chart. Time below → mortality risk. Time above → severe disability risk (Aries 2012, COGiTATE).',
      done: false,
      active: cppopt != null,
    },
  ];

  return (
    <div className="rounded-md border-l-[3px] border-l-brand-amber bg-surface-deeper p-3.5">
      <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-amber">
        How to pick CPPopt, step by step
      </div>
      <ol className="space-y-2 list-none p-0">
        {items.map((it) => (
          <li
            key={it.n}
            className="flex gap-2.5 items-start py-1.5 border-b border-line last:border-b-0"
          >
            <div
              className={
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-colors ' +
                (it.done
                  ? 'bg-status-good text-white border-status-good'
                  : it.active
                    ? 'bg-brand-amber text-surface-darker border-brand-amber shadow-[0_0_0_3px_rgba(245,158,11,0.2)]'
                    : 'bg-surface-card text-ink-muted border-line')
              }
            >
              {it.n}
            </div>
            <div className="flex-1">
              <div
                className={
                  'text-[12px] font-bold ' +
                  (it.done
                    ? 'text-status-good'
                    : it.active
                      ? 'text-brand-amber'
                      : 'text-ink')
                }
              >
                {it.title}{' '}
                {it.tag && (
                  <span className="ml-1.5 font-mono text-[10px] text-brand-tealLight">{it.tag}</span>
                )}
              </div>
              <div className="text-[11px] text-ink-muted leading-normal mt-0.5">{it.desc}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
