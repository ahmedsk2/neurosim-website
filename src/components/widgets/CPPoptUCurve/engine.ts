/**
 * CPPopt physics + math engine.
 * Pure functions; no React, no DOM. Deterministic given a seeded RNG.
 *
 * References: Czosnyka 1997 (PRx), Steiner 2002, Aries 2012, Beqiri 2024 (COGiTATE).
 */

import {
  type AutoregMode,
  type CPPoptConfig,
  type CPPoptState,
  type FitCoeff,
  type PRxPoint,
  type PairedSample,
} from './types';

// Mulberry32 deterministic RNG; if not seeded, uses Math.random
export type Rng = () => number;
export function makeRng(seed?: number): Rng {
  if (seed == null) return Math.random;
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Coupling coefficient between MAP and ICP slow waves.
 *  - intact mode → strong negative coupling (≈ −0.45)
 *  - impaired mode → strong positive coupling (≈ +0.55)
 *  - realistic: U-shaped function of |CPP − trueCPPopt|; at the minimum,
 *    coupling is most negative (best autoregulation).
 */
export function couplingFor(approxCpp: number, mode: AutoregMode, cfg: CPPoptConfig): number {
  if (mode === 'intact') return -0.45;
  if (mode === 'impaired') return +0.55;
  const delta = approxCpp - cfg.trueCPPopt;
  const w = cfg.autoregBandWidth;
  let c = -0.5 + ((delta * delta) / (w * w)) * 0.5;
  if (c > 0.9) c = 0.9;
  if (c < -0.6) c = -0.6;
  return c;
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
 * Synthesize raw ABP and ICP samples for `dtSec` of sim time.
 * Mutates state in-place to push new samples and trim to last 60 sim-seconds.
 */
export function nextSamples(state: CPPoptState, dtSec: number, cfg: CPPoptConfig, rng: Rng): void {
  const samplesNeeded = Math.min(2000, Math.floor(dtSec * cfg.sampleRateHz));
  if (samplesNeeded === 0) return;
  const sampleStep = dtSec / samplesNeeded;

  for (let i = 0; i < samplesNeeded; i++) {
    const tSec = state.simT + i * sampleStep;

    const ultraSlow1 = 14 * Math.sin((2 * Math.PI * tSec) / 3600);
    const ultraSlow2 = 9 * Math.sin((2 * Math.PI * tSec) / 1450 + 0.7);
    const ultraSlow3 = 5 * Math.sin((2 * Math.PI * tSec) / 700 + 1.9);
    const slow1 = 6 * Math.sin(2 * Math.PI * 0.05 * tSec);
    const slow2 = 3 * Math.sin(2 * Math.PI * 0.03 * tSec + 1.2);
    const noiseMap = (rng() - 0.5) * 2.5;

    const baseMap = 75;
    const map = baseMap + ultraSlow1 + ultraSlow2 + ultraSlow3 + slow1 + slow2 + noiseMap;
    const pulse = 12 * Math.sin(2 * Math.PI * 1.1 * tSec);
    const respMod = 3 * Math.sin(2 * Math.PI * 0.25 * tSec);
    const abp = map + pulse + respMod;

    const baseIcp = 16;
    const approxCpp = map - baseIcp;
    const coupling = couplingFor(approxCpp, state.mode, cfg);

    const icpSlow = coupling * (slow1 + slow2 + 0.4 * (ultraSlow1 + ultraSlow2));
    const cardiacIcp = 1.5 * Math.sin(2 * Math.PI * 1.1 * tSec);
    const noiseIcp = (rng() - 0.5) * 0.8;
    const mapDriftIcp = Math.max(0, map - 95) * 0.3;
    const icp = baseIcp + icpSlow + cardiacIcp + noiseIcp + mapDriftIcp;

    state.rawAbp.push({ t: tSec, v: abp, map });
    state.rawIcp.push({ t: tSec, v: icp });
  }
  const cutoff = state.simT + dtSec - 60;
  while (state.rawAbp.length && (state.rawAbp[0]?.t ?? 0) < cutoff) state.rawAbp.shift();
  while (state.rawIcp.length && (state.rawIcp[0]?.t ?? 0) < cutoff) state.rawIcp.shift();
}

export function maybeDecimate(state: CPPoptState, cfg: CPPoptConfig): void {
  while (
    state.simT - (state.meanPairs.length > 0 ? state.meanPairs[state.meanPairs.length - 1]!.t : 0) >=
    cfg.decimationSec
  ) {
    const lastT = state.meanPairs.length > 0 ? state.meanPairs[state.meanPairs.length - 1]!.t : 0;
    const startT = lastT;
    const endT = lastT + cfg.decimationSec;
    let sm = 0;
    let cm = 0;
    let si = 0;
    let ci = 0;
    for (const s of state.rawAbp) {
      if (s.t >= startT && s.t < endT) {
        sm += s.map ?? 0;
        cm++;
      }
    }
    for (const s of state.rawIcp) {
      if (s.t >= startT && s.t < endT) {
        si += s.v;
        ci++;
      }
    }
    let m: number;
    let ic: number;
    if (cm > 0 && ci > 0) {
      m = sm / cm;
      ic = si / ci;
    } else {
      // Synthesize directly when raw budget was capped
      m =
        75 +
        14 * Math.sin((2 * Math.PI * endT) / 3600) +
        9 * Math.sin((2 * Math.PI * endT) / 1450 + 0.7) +
        5 * Math.sin((2 * Math.PI * endT) / 700 + 1.9) +
        6 * Math.sin(2 * Math.PI * 0.05 * endT) +
        3 * Math.sin(2 * Math.PI * 0.03 * endT + 1.2);
      const baseIcp = 16;
      const approxCpp = m - baseIcp;
      const coupling = couplingFor(approxCpp, state.mode, cfg);
      const slow1 = 6 * Math.sin(2 * Math.PI * 0.05 * endT);
      const slow2 = 3 * Math.sin(2 * Math.PI * 0.03 * endT + 1.2);
      const u1 = 14 * Math.sin((2 * Math.PI * endT) / 3600);
      const u2 = 9 * Math.sin((2 * Math.PI * endT) / 1450 + 0.7);
      ic =
        baseIcp +
        coupling * (slow1 + slow2 + 0.4 * (u1 + u2)) +
        Math.max(0, m - 95) * 0.3;
    }
    state.meanPairs.push({ t: endT, map: m, icp: ic, cpp: m - ic });
    if (state.meanPairs.length > 600) state.meanPairs.shift();
  }
}

export function maybeUpdatePRx(state: CPPoptState, cfg: CPPoptConfig): boolean {
  const lastT = state.meanPairs.length > 0 ? state.meanPairs[state.meanPairs.length - 1]!.t : 0;
  const lastMin = Math.floor(lastT / 60);
  if (lastMin <= state.prxLastUpdateMin) return false;
  if (state.meanPairs.length < cfg.windowSize) return false;
  const win = state.meanPairs.slice(-cfg.windowSize);
  const xs = win.map((p) => p.map);
  const ys = win.map((p) => p.icp);
  const r = pearson(xs, ys);
  const meanCPP = win.reduce((a, p) => a + p.cpp, 0) / win.length;
  state.prxValue = r;
  const t = win[win.length - 1]!.t;
  state.prxTrace.push({ t, prx: r, cpp: meanCPP });
  if (state.prxTrace.length > 90) state.prxTrace.shift();
  state.cppoptBuffer.push({ t, prx: r, cpp: meanCPP });
  const cutoff = t - cfg.bufferHours * 3600;
  while (state.cppoptBuffer.length && (state.cppoptBuffer[0]?.t ?? 0) < cutoff)
    state.cppoptBuffer.shift();
  recomputeCPPopt(state, cfg);
  state.prxLastUpdateMin = lastMin;
  return true;
}

export function recomputeCPPopt(state: CPPoptState, cfg: CPPoptConfig): void {
  const bins: Record<number, { sum: number; count: number }> = {};
  for (const p of state.cppoptBuffer) {
    if (p.cpp < cfg.cppBinMin || p.cpp > cfg.cppBinMax) continue;
    const b = Math.floor((p.cpp - cfg.cppBinMin) / cfg.cppBinSize);
    const mid = cfg.cppBinMin + b * cfg.cppBinSize + cfg.cppBinSize / 2;
    if (!bins[mid]) bins[mid] = { sum: 0, count: 0 };
    bins[mid].sum += p.prx;
    bins[mid].count++;
  }
  state.binData = {};
  for (const [k, v] of Object.entries(bins)) {
    if (v.count >= cfg.minSamplesPerBin) state.binData[Number(k)] = v.sum / v.count;
  }
  const xs = Object.keys(state.binData).map(Number);
  const ys = xs.map((x) => state.binData[x] ?? 0);
  if (xs.length < cfg.minBinsForFit) {
    state.fitCoeff = null;
    state.cppoptValue = null;
    return;
  }
  const fit = quadFit(xs, ys);
  if (fit && fit.a > 0) {
    const opt = -fit.b / (2 * fit.a);
    if (opt >= Math.min(...xs) - 5 && opt <= Math.max(...xs) + 5) {
      state.fitCoeff = fit;
      state.cppoptValue = opt;
      return;
    }
  }
  state.fitCoeff = null;
  state.cppoptValue = null;
}

/**
 * Step the simulation forward by `realDtSec` × `speed` simulated seconds.
 * Returns whether any meaningful state change occurred.
 */
export function step(
  state: CPPoptState,
  realDtSec: number,
  speed: number,
  cfg: CPPoptConfig,
  rng: Rng,
): void {
  let remaining = Math.max(0, realDtSec) * speed;
  while (remaining > 0) {
    const slice = Math.min(5.0, remaining);
    nextSamples(state, slice, cfg, rng);
    state.simT += slice;
    maybeDecimate(state, cfg);
    maybeUpdatePRx(state, cfg);
    remaining -= slice;
  }
}

/**
 * Pre-fill state with `seconds` of sim history so the user sees activity immediately.
 */
export function seed(state: CPPoptState, cfg: CPPoptConfig, rng: Rng, seconds = 8 * 60): void {
  const dt = 0.5;
  for (let t = 0; t < seconds; t += dt) {
    nextSamples(state, dt, cfg, rng);
    state.simT += dt;
    maybeDecimate(state, cfg);
    maybeUpdatePRx(state, cfg);
  }
  const cutoff = state.simT - 60;
  state.rawAbp = state.rawAbp.filter((s) => s.t >= cutoff);
  state.rawIcp = state.rawIcp.filter((s) => s.t >= cutoff);
}

export function reset(state: CPPoptState): void {
  state.rawAbp = [];
  state.rawIcp = [];
  state.meanPairs = [];
  state.prxTrace = [];
  state.cppoptBuffer = [];
  state.binData = {};
  state.fitCoeff = null;
  state.cppoptValue = null;
  state.prxValue = null;
  state.simT = 0;
  state.prxLastUpdateMin = 0;
}

export function classifyPRx(prx: number | null): 'good' | 'warn' | 'danger' | 'neutral' {
  if (prx == null) return 'neutral';
  if (prx >= 0.25) return 'danger';
  if (prx >= 0.05) return 'warn';
  return 'good';
}

export function classifyPRxLabel(prx: number | null): string {
  if (prx == null) return 'awaiting data…';
  if (prx >= 0.25) return 'Impaired (>0.25)';
  if (prx >= 0.05) return 'Borderline';
  return 'Intact reactivity';
}
