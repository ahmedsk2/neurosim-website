/**
 * MAPopt simulator engine, non-invasive companion to the PRx-driven CPPopt
 * widget. Drives a single MAP slow-wave simulation and computes BOTH ORx
 * (NIRS-based) and Mx (TCD-based) reactivity indices in parallel, then bins
 * each one against MAP and fits a parabola → MAPopt.
 *
 * The reactivity math is the moving Pearson r between MAP and the derived
 * signal over a 5-minute window of 30 paired 10-second averages, identical
 * to the CPPoptUCurve PRx pipeline, just with the second signal swapped.
 */

import type {
  IndexPipelineState,
  MAPoptConfig,
  MAPoptState,
  FitCoeff,
} from './types';
import { type AutoregMode } from '../_shared/correlationIndex';

export type Rng = () => number;

export function makeRng(seedVal?: number): Rng {
  if (seedVal == null) return Math.random;
  let s = seedVal >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Per-index physiology constants (kept inline to avoid circular dependencies
// with the standalone correlationIndex module).
const ORX = {
  baseline: 65,
  intactCoupling: 0,
  impairedCoupling: 0.55,
  intactIndependentAmp: 0.40,
  noiseAmp: 0.6,
};
const MX = {
  baseline: 60,
  intactCoupling: 0,
  impairedCoupling: 0.65,
  intactIndependentAmp: 0.55,
  noiseAmp: 1.2,
};

function couplingFor(map: number, mode: AutoregMode, intact: number, impaired: number, cfg: MAPoptConfig): number {
  if (mode === 'intact') return intact;
  if (mode === 'impaired') return impaired;
  const delta = map - cfg.trueMAPopt;
  const w = cfg.autoregBandWidth;
  const t = Math.min(1, (delta * delta) / (w * w));
  return intact + t * (impaired - intact);
}

function independenceFor(map: number, mode: AutoregMode, intactAmp: number, cfg: MAPoptConfig): number {
  if (mode === 'intact') return intactAmp;
  if (mode === 'impaired') return 0;
  const delta = map - cfg.trueMAPopt;
  const w = cfg.autoregBandWidth;
  const t = Math.min(1, (delta * delta) / (w * w));
  return (1 - t) * intactAmp;
}

// Independent slow-wave oscillators at integer cycles per 5-min window,
// orthogonal to the MAP slow-waves (15 and 9 cycles/window). The two sets
// (ORx vs Mx) use different cycle counts so the two indices don't move in
// lock-step in intact mode.
function indepOrxAt(t: number): number {
  return (
    4.5 * Math.sin(2 * Math.PI * (7 / 300) * t + 0.7) +
    3.0 * Math.sin(2 * Math.PI * (11 / 300) * t + 2.1) +
    2.2 * Math.sin(2 * Math.PI * (13 / 300) * t + 1.4)
  );
}
function indepMxAt(t: number): number {
  return (
    4.0 * Math.sin(2 * Math.PI * (8 / 300) * t + 1.9) +
    2.6 * Math.sin(2 * Math.PI * (12 / 300) * t + 0.4) +
    2.0 * Math.sin(2 * Math.PI * (14 / 300) * t + 2.7)
  );
}

export function pearson(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return 0;
  let mx = 0;
  let my = 0;
  for (let i = 0; i < n; i++) {
    mx += xs[i] ?? 0;
    my += ys[i] ?? 0;
  }
  mx /= n;
  my /= n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    const a = (xs[i] ?? 0) - mx;
    const b = (ys[i] ?? 0) - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  if (dx === 0 || dy === 0) return 0;
  return num / Math.sqrt(dx * dy);
}

function solve3x3(M: number[][], V: number[]): number[] | null {
  const A = M.map((row, i) => [...row, V[i] ?? 0]);
  for (let col = 0; col < 3; col++) {
    let pivot = col;
    for (let r = col + 1; r < 3; r++) {
      if (Math.abs((A[r] ?? [])[col] ?? 0) > Math.abs((A[pivot] ?? [])[col] ?? 0)) pivot = r;
    }
    if (Math.abs((A[pivot] ?? [])[col] ?? 0) < 1e-12) return null;
    [A[col], A[pivot]] = [A[pivot]!, A[col]!];
    const pivotRow = A[col]!;
    for (let r = col + 1; r < 3; r++) {
      const row = A[r]!;
      const f = (row[col] ?? 0) / (pivotRow[col] ?? 1);
      for (let c = col; c < 4; c++) {
        row[c] = (row[c] ?? 0) - f * (pivotRow[c] ?? 0);
      }
    }
  }
  const x = [0, 0, 0];
  for (let r = 2; r >= 0; r--) {
    const row = A[r]!;
    let s = row[3] ?? 0;
    for (let c = r + 1; c < 3; c++) s -= (row[c] ?? 0) * (x[c] ?? 0);
    x[r] = s / (row[r] ?? 1);
  }
  return x;
}

export function quadFit(xs: number[], ys: number[]): FitCoeff | null {
  const n = xs.length;
  if (n < 3) return null;
  const s0 = n;
  let s1 = 0;
  let s2 = 0;
  let s3 = 0;
  let s4 = 0;
  let t0 = 0;
  let t1 = 0;
  let t2 = 0;
  for (let i = 0; i < n; i++) {
    const x = xs[i] ?? 0;
    const y = ys[i] ?? 0;
    s1 += x;
    s2 += x * x;
    s3 += x * x * x;
    s4 += x * x * x * x;
    t0 += y;
    t1 += x * y;
    t2 += x * x * y;
  }
  const sol = solve3x3(
    [
      [s0, s1, s2],
      [s1, s2, s3],
      [s2, s3, s4],
    ],
    [t0, t1, t2],
  );
  if (!sol) return null;
  return { c: sol[0]!, b: sol[1]!, a: sol[2]! };
}

/**
 * Synthesise raw ABP, rSO₂, and MFV samples for `dtSec` of sim-time on the
 * shared MAP simulation.
 */
export function nextSamples(state: MAPoptState, dtSec: number, cfg: MAPoptConfig, rng: Rng): void {
  const samplesNeeded = Math.min(2000, Math.floor(dtSec * cfg.sampleRateHz));
  if (samplesNeeded === 0) return;
  const sampleStep = dtSec / samplesNeeded;

  for (let i = 0; i < samplesNeeded; i++) {
    const tSec = state.simT + i * sampleStep;

    // Same MAP slow-wave structure as PRx engine
    const ultraSlow1 = 14 * Math.sin((2 * Math.PI * tSec) / 3600);
    const ultraSlow2 = 9 * Math.sin((2 * Math.PI * tSec) / 1450 + 0.7);
    const ultraSlow3 = 5 * Math.sin((2 * Math.PI * tSec) / 700 + 1.9);
    const slow1 = 6 * Math.sin(2 * Math.PI * 0.05 * tSec);
    const slow2 = 3 * Math.sin(2 * Math.PI * 0.03 * tSec + 1.2);
    const noiseMap = (rng() - 0.5) * 2.5;

    const baseMap = 80;
    const map = baseMap + ultraSlow1 + ultraSlow2 + ultraSlow3 + slow1 + slow2 + noiseMap;
    const pulse = 12 * Math.sin(2 * Math.PI * 1.1 * tSec);
    const respMod = 3 * Math.sin(2 * Math.PI * 0.25 * tSec);
    const abp = map + pulse + respMod;

    const mapSlow = slow1 + slow2 + 0.4 * (ultraSlow1 + ultraSlow2);

    const orxC = couplingFor(map, state.mode, ORX.intactCoupling, ORX.impairedCoupling, cfg);
    const orxI = independenceFor(map, state.mode, ORX.intactIndependentAmp, cfg);
    const noiseRso2 = (rng() - 0.5) * ORX.noiseAmp * 2;
    const rso2 = ORX.baseline + orxC * mapSlow + orxI * indepOrxAt(tSec) + noiseRso2;

    const mxC = couplingFor(map, state.mode, MX.intactCoupling, MX.impairedCoupling, cfg);
    const mxI = independenceFor(map, state.mode, MX.intactIndependentAmp, cfg);
    const noiseMfv = (rng() - 0.5) * MX.noiseAmp * 2;
    const mfv = MX.baseline + mxC * mapSlow + mxI * indepMxAt(tSec) + noiseMfv;

    state.rawAbp.push({ t: tSec, v: abp, map });
    state.rawRso2.push({ t: tSec, v: rso2 });
    state.rawMfv.push({ t: tSec, v: mfv });
  }
  const cutoff = state.simT + dtSec - 60;
  while (state.rawAbp.length && (state.rawAbp[0]?.t ?? 0) < cutoff) state.rawAbp.shift();
  while (state.rawRso2.length && (state.rawRso2[0]?.t ?? 0) < cutoff) state.rawRso2.shift();
  while (state.rawMfv.length && (state.rawMfv[0]?.t ?? 0) < cutoff) state.rawMfv.shift();
}

export function maybeDecimate(state: MAPoptState, cfg: MAPoptConfig): void {
  while (
    state.simT - (state.meanPairs.length > 0 ? state.meanPairs[state.meanPairs.length - 1]!.t : 0) >=
    cfg.decimationSec
  ) {
    const lastT = state.meanPairs.length > 0 ? state.meanPairs[state.meanPairs.length - 1]!.t : 0;
    const startT = lastT;
    const endT = lastT + cfg.decimationSec;

    let sm = 0;
    let cm = 0;
    let so = 0;
    let co = 0;
    let smfv = 0;
    let cmfv = 0;
    for (const s of state.rawAbp) {
      if (s.t >= startT && s.t < endT) {
        sm += s.map ?? 0;
        cm++;
      }
    }
    for (const s of state.rawRso2) {
      if (s.t >= startT && s.t < endT) {
        so += s.v;
        co++;
      }
    }
    for (const s of state.rawMfv) {
      if (s.t >= startT && s.t < endT) {
        smfv += s.v;
        cmfv++;
      }
    }

    let m: number;
    let rso2: number;
    let mfv: number;
    if (cm > 0 && co > 0 && cmfv > 0) {
      m = sm / cm;
      rso2 = so / co;
      mfv = smfv / cmfv;
    } else {
      // Synthesise directly when raw budget capped
      const slow1 = 6 * Math.sin(2 * Math.PI * 0.05 * endT);
      const slow2 = 3 * Math.sin(2 * Math.PI * 0.03 * endT + 1.2);
      const u1 = 14 * Math.sin((2 * Math.PI * endT) / 3600);
      const u2 = 9 * Math.sin((2 * Math.PI * endT) / 1450 + 0.7);
      const u3 = 5 * Math.sin((2 * Math.PI * endT) / 700 + 1.9);
      m = 80 + u1 + u2 + u3 + slow1 + slow2;
      const mapSlow = slow1 + slow2 + 0.4 * (u1 + u2);
      const orxC = couplingFor(m, state.mode, ORX.intactCoupling, ORX.impairedCoupling, cfg);
      const orxI = independenceFor(m, state.mode, ORX.intactIndependentAmp, cfg);
      rso2 = ORX.baseline + orxC * mapSlow + orxI * indepOrxAt(endT);
      const mxC = couplingFor(m, state.mode, MX.intactCoupling, MX.impairedCoupling, cfg);
      const mxI = independenceFor(m, state.mode, MX.intactIndependentAmp, cfg);
      mfv = MX.baseline + mxC * mapSlow + mxI * indepMxAt(endT);
    }

    state.meanPairs.push({ t: endT, map: m, rso2, mfv });
    if (state.meanPairs.length > 600) state.meanPairs.shift();
  }
}

function recomputeMAPopt(pipe: IndexPipelineState, cfg: MAPoptConfig): void {
  const bins: Record<number, { sum: number; count: number }> = {};
  for (const p of pipe.buffer) {
    if (p.map < cfg.mapBinMin || p.map > cfg.mapBinMax) continue;
    const b = Math.floor((p.map - cfg.mapBinMin) / cfg.mapBinSize);
    const mid = cfg.mapBinMin + b * cfg.mapBinSize + cfg.mapBinSize / 2;
    if (!bins[mid]) bins[mid] = { sum: 0, count: 0 };
    bins[mid].sum += p.r;
    bins[mid].count++;
  }
  pipe.binData = {};
  for (const [k, v] of Object.entries(bins)) {
    if (v.count >= cfg.minSamplesPerBin) pipe.binData[Number(k)] = v.sum / v.count;
  }
  const xs = Object.keys(pipe.binData).map(Number);
  const ys = xs.map((x) => pipe.binData[x] ?? 0);
  if (xs.length < cfg.minBinsForFit) {
    pipe.fitCoeff = null;
    pipe.optValue = null;
    return;
  }
  const fit = quadFit(xs, ys);
  if (fit && fit.a > 0) {
    const opt = -fit.b / (2 * fit.a);
    if (opt >= Math.min(...xs) - 5 && opt <= Math.max(...xs) + 5) {
      pipe.fitCoeff = fit;
      pipe.optValue = opt;
      return;
    }
  }
  pipe.fitCoeff = null;
  pipe.optValue = null;
}

export function maybeUpdateIndices(state: MAPoptState, cfg: MAPoptConfig): boolean {
  const lastT = state.meanPairs.length > 0 ? state.meanPairs[state.meanPairs.length - 1]!.t : 0;
  const lastMin = Math.floor(lastT / 60);
  if (lastMin <= state.lastUpdateMin) return false;
  if (state.meanPairs.length < cfg.windowSize) return false;
  const win = state.meanPairs.slice(-cfg.windowSize);
  const xs = win.map((p) => p.map);
  const meanMap = win.reduce((a, p) => a + p.map, 0) / win.length;
  const t = win[win.length - 1]!.t;

  const orxR = pearson(
    xs,
    win.map((p) => p.rso2),
  );
  state.orx.rValue = orxR;
  state.orx.trace.push({ t, r: orxR });
  if (state.orx.trace.length > 90) state.orx.trace.shift();
  state.orx.buffer.push({ t, map: meanMap, r: orxR });
  const cutoffSec = t - cfg.bufferHours * 3600;
  while (state.orx.buffer.length && (state.orx.buffer[0]?.t ?? 0) < cutoffSec)
    state.orx.buffer.shift();
  recomputeMAPopt(state.orx, cfg);

  const mxR = pearson(
    xs,
    win.map((p) => p.mfv),
  );
  state.mx.rValue = mxR;
  state.mx.trace.push({ t, r: mxR });
  if (state.mx.trace.length > 90) state.mx.trace.shift();
  state.mx.buffer.push({ t, map: meanMap, r: mxR });
  while (state.mx.buffer.length && (state.mx.buffer[0]?.t ?? 0) < cutoffSec)
    state.mx.buffer.shift();
  recomputeMAPopt(state.mx, cfg);

  state.lastUpdateMin = lastMin;
  return true;
}

export function step(
  state: MAPoptState,
  realDtSec: number,
  speed: number,
  cfg: MAPoptConfig,
  rng: Rng,
): void {
  let remaining = Math.max(0, realDtSec) * speed;
  while (remaining > 0) {
    const slice = Math.min(5.0, remaining);
    nextSamples(state, slice, cfg, rng);
    state.simT += slice;
    maybeDecimate(state, cfg);
    maybeUpdateIndices(state, cfg);
    remaining -= slice;
  }
}

export function seed(state: MAPoptState, cfg: MAPoptConfig, rng: Rng, seconds = 8 * 60): void {
  const dt = 0.5;
  for (let t = 0; t < seconds; t += dt) {
    nextSamples(state, dt, cfg, rng);
    state.simT += dt;
    maybeDecimate(state, cfg);
    maybeUpdateIndices(state, cfg);
  }
  const cutoff = state.simT - 60;
  state.rawAbp = state.rawAbp.filter((s) => s.t >= cutoff);
  state.rawRso2 = state.rawRso2.filter((s) => s.t >= cutoff);
  state.rawMfv = state.rawMfv.filter((s) => s.t >= cutoff);
}

export function reset(state: MAPoptState): void {
  state.rawAbp = [];
  state.rawRso2 = [];
  state.rawMfv = [];
  state.meanPairs = [];
  state.orx = { trace: [], buffer: [], binData: {}, fitCoeff: null, optValue: null, rValue: null };
  state.mx = { trace: [], buffer: [], binData: {}, fitCoeff: null, optValue: null, rValue: null };
  state.simT = 0;
  state.lastUpdateMin = 0;
}

export function classifyR(r: number | null): 'good' | 'warn' | 'danger' | 'neutral' {
  if (r == null) return 'neutral';
  if (r >= 0.3) return 'danger';
  if (r >= 0.05) return 'warn';
  return 'good';
}

export function classifyRLabel(r: number | null): string {
  if (r == null) return 'awaiting data…';
  if (r >= 0.3) return 'Impaired (≥ 0.30)';
  if (r >= 0.05) return 'Borderline';
  return 'Intact reactivity';
}
