/**
 * Generic moving-Pearson-r correlation index engine, shared by ORx and Mx widgets.
 *
 * The mathematical framework is identical to PRx (5-min moving correlation of
 * 30 paired 10-second averages) but the second signal is generic, rSO₂ for
 * ORx, TCD MFV for Mx.
 *
 * Pure functions, no React, no DOM. Deterministic given a seeded RNG.
 */

export type AutoregMode = 'realistic' | 'intact' | 'impaired';

export type Rng = () => number;

export function makeRng(seed?: number): Rng {
  if (seed == null) return Math.random;
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface PairedSample {
  t: number;
  map: number;
  /** Derived signal value (rSO₂ for ORx, MFV for Mx, etc.) */
  y: number;
}

export interface IndexPoint {
  t: number;
  r: number;
}

export interface RawSample {
  t: number;
  v: number;
  map?: number;
}

/**
 * Configuration for one specific correlation index. The signal-physics fields
 * encode: baseline, slow-wave amplitude when intact and impaired, noise level,
 * and the coupling sign. ORx and Mx differ only in these constants.
 *
 * The model splits the derived signal into two parts:
 *  - a MAP-coupled slow component (its weight is `coupling`, a function of mode)
 *  - an INDEPENDENT slow component at unrelated frequencies/phases (its weight
 *    is `independence`, also a function of mode)
 * When autoregulation is intact, coupling ≈ 0 and independence is high, the
 * derived signal still has slow-wave content but is uncorrelated with MAP, so
 * Pearson r ≈ 0. When impaired, coupling is high and independence is 0,the
 * derived signal tracks MAP, so Pearson r ≈ +1.
 */
export interface IndexConfig {
  /** e.g. "ORx", "Mx" */
  name: string;
  /** e.g. "rSO₂", "MFV" */
  signalLabel: string;
  /** e.g. "%", "cm/s" */
  signalUnit: string;
  /** Baseline value when MAP is at typical mean. */
  signalBaseline: number;
  /**
   * Coupling for `intact` autoregulation. Should be 0 (or near-0) so the
   * derived signal does not track MAP slow-waves when autoregulation is
   * working. (PRx is the special case where it goes negative.)
   */
  intactCoupling: number;
  /** Coupling for `impaired` mode, derived signal tracks MAP positively. */
  impairedCoupling: number;
  /**
   * Amplitude of the independent slow-wave component when intact. This is what
   * keeps the derived signal alive on the trace even when autoregulation is
   * fully buffering MAP, but at frequencies/phases unrelated to MAP, so Pearson
   * r stays near zero.
   */
  intactIndependentAmp: number;
  /** Per-sample white-noise amplitude on the derived signal. */
  noiseAmp: number;
  /** Threshold for "warn" classification (typically 0.05). */
  warnThreshold: number;
  /** Threshold for "impaired" classification (0.25 for PRx, 0.30 for ORx/Mx). */
  impairedThreshold: number;
  /** Sampling rate for raw signals (Hz). */
  sampleRateHz: number;
  /** Seconds per decimated paired sample. */
  decimationSec: number;
  /** Number of paired samples in the moving window. */
  windowSize: number;
}

export interface IndexState {
  mode: AutoregMode;
  rawAbp: RawSample[];
  rawY: RawSample[];
  meanPairs: PairedSample[];
  trace: IndexPoint[];
  value: number | null;
  simT: number;
  lastUpdateMin: number;
}

export function makeInitialState(): IndexState {
  return {
    mode: 'realistic',
    rawAbp: [],
    rawY: [],
    meanPairs: [],
    trace: [],
    value: null,
    simT: 0,
    lastUpdateMin: 0,
  };
}

/**
 * Coupling for the derived signal slow-waves vs MAP slow-waves.
 *  - intact → cfg.intactCoupling (≈ 0 for ORx/Mx, negative for PRx-like)
 *  - impaired → cfg.impairedCoupling (strong positive)
 *  - realistic → between, scaled by distance from MAP optimum (~85 mmHg).
 *
 * Realistic-mode band width is intentionally generous (35 mmHg) so that an
 * unstressed patient with MAP wandering around 80 mmHg stays mostly intact
 *,only when slow-wave excursions push MAP outside ~50–120 mmHg does
 * realistic mode start to mix in impaired coupling.
 */
export function couplingFor(map: number, mode: AutoregMode, cfg: IndexConfig): number {
  if (mode === 'intact') return cfg.intactCoupling;
  if (mode === 'impaired') return cfg.impairedCoupling;
  const optimum = 85;
  const w = 35;
  const delta = map - optimum;
  const t = Math.min(1, (delta * delta) / (w * w));
  return cfg.intactCoupling + t * (cfg.impairedCoupling - cfg.intactCoupling);
}

/**
 * Amplitude of the independent slow-wave component as a function of mode.
 * Intact → full independent component (signal is alive but uncorrelated with MAP).
 * Impaired → 0 (signal is fully MAP-driven).
 * Realistic → scales inversely with distance from MAP optimum.
 */
export function independenceFor(map: number, mode: AutoregMode, cfg: IndexConfig): number {
  if (mode === 'intact') return cfg.intactIndependentAmp;
  if (mode === 'impaired') return 0;
  const optimum = 85;
  const w = 35;
  const delta = map - optimum;
  const t = Math.min(1, (delta * delta) / (w * w));
  return (1 - t) * cfg.intactIndependentAmp;
}

/**
 * Independent slow-wave oscillators at frequencies that, evaluated over the
 * 30-sample (5-minute) Pearson window, are orthogonal to the MAP slow-waves
 * (which sit at 15 and 9 integer cycles per window). The independent waves
 * use cycle counts 7, 11, 13,distinct integers that give zero cross-
 * correlation with the MAP slow-waves on average, so Pearson r → 0 in
 * intact mode.
 */
function independentSlowAt(tSec: number): number {
  const a = 4.5 * Math.sin(2 * Math.PI * (7 / 300) * tSec + 0.7);
  const b = 3.0 * Math.sin(2 * Math.PI * (11 / 300) * tSec + 2.1);
  const c = 2.2 * Math.sin(2 * Math.PI * (13 / 300) * tSec + 1.4);
  return a + b + c;
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

/**
 * Synthesise raw ABP and derived-signal samples for `dtSec` seconds.
 * Mutates state in-place; trims raw buffers to last 60 sim-seconds.
 */
export function nextSamples(state: IndexState, dtSec: number, cfg: IndexConfig, rng: Rng): void {
  const samplesNeeded = Math.min(2000, Math.floor(dtSec * cfg.sampleRateHz));
  if (samplesNeeded === 0) return;
  const sampleStep = dtSec / samplesNeeded;

  for (let i = 0; i < samplesNeeded; i++) {
    const tSec = state.simT + i * sampleStep;

    // Same MAP slow-wave structure as the PRx engine, keeps the visualisations comparable
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

    const coupling = couplingFor(map, state.mode, cfg);
    const independence = independenceFor(map, state.mode, cfg);

    // Derived signal: baseline + coupling × MAP slow-wave content
    //                          + independence × independent slow-wave content
    //                          + noise
    // The independent slow-waves keep the signal alive when intact while staying
    // uncorrelated with MAP, so the moving Pearson r truly drops to ~0.
    const mapSlow = slow1 + slow2 + 0.4 * (ultraSlow1 + ultraSlow2);
    const indepSlow = independentSlowAt(tSec);
    const noiseY = (rng() - 0.5) * cfg.noiseAmp * 2;
    const y = cfg.signalBaseline + coupling * mapSlow + independence * indepSlow + noiseY;

    state.rawAbp.push({ t: tSec, v: abp, map });
    state.rawY.push({ t: tSec, v: y });
  }
  const cutoff = state.simT + dtSec - 60;
  while (state.rawAbp.length && (state.rawAbp[0]?.t ?? 0) < cutoff) state.rawAbp.shift();
  while (state.rawY.length && (state.rawY[0]?.t ?? 0) < cutoff) state.rawY.shift();
}

export function maybeDecimate(state: IndexState, cfg: IndexConfig): void {
  while (
    state.simT - (state.meanPairs.length > 0 ? state.meanPairs[state.meanPairs.length - 1]!.t : 0) >=
    cfg.decimationSec
  ) {
    const lastT = state.meanPairs.length > 0 ? state.meanPairs[state.meanPairs.length - 1]!.t : 0;
    const startT = lastT;
    const endT = lastT + cfg.decimationSec;

    let sm = 0;
    let cm = 0;
    let sy = 0;
    let cy = 0;
    for (const s of state.rawAbp) {
      if (s.t >= startT && s.t < endT) {
        sm += s.map ?? 0;
        cm++;
      }
    }
    for (const s of state.rawY) {
      if (s.t >= startT && s.t < endT) {
        sy += s.v;
        cy++;
      }
    }

    let m: number;
    let y: number;
    if (cm > 0 && cy > 0) {
      m = sm / cm;
      y = sy / cy;
    } else {
      // Synthesise directly when raw budget was capped
      const slow1 = 6 * Math.sin(2 * Math.PI * 0.05 * endT);
      const slow2 = 3 * Math.sin(2 * Math.PI * 0.03 * endT + 1.2);
      const u1 = 14 * Math.sin((2 * Math.PI * endT) / 3600);
      const u2 = 9 * Math.sin((2 * Math.PI * endT) / 1450 + 0.7);
      const u3 = 5 * Math.sin((2 * Math.PI * endT) / 700 + 1.9);
      m = 80 + u1 + u2 + u3 + slow1 + slow2;
      const coupling = couplingFor(m, state.mode, cfg);
      const independence = independenceFor(m, state.mode, cfg);
      y =
        cfg.signalBaseline +
        coupling * (slow1 + slow2 + 0.4 * (u1 + u2)) +
        independence * independentSlowAt(endT);
    }

    state.meanPairs.push({ t: endT, map: m, y });
    if (state.meanPairs.length > 600) state.meanPairs.shift();
  }
}

export function maybeUpdateIndex(state: IndexState, cfg: IndexConfig): boolean {
  const lastT = state.meanPairs.length > 0 ? state.meanPairs[state.meanPairs.length - 1]!.t : 0;
  const lastMin = Math.floor(lastT / 60);
  if (lastMin <= state.lastUpdateMin) return false;
  if (state.meanPairs.length < cfg.windowSize) return false;
  const win = state.meanPairs.slice(-cfg.windowSize);
  const xs = win.map((p) => p.map);
  const ys = win.map((p) => p.y);
  const r = pearson(xs, ys);
  state.value = r;
  const t = win[win.length - 1]!.t;
  state.trace.push({ t, r });
  if (state.trace.length > 90) state.trace.shift();
  state.lastUpdateMin = lastMin;
  return true;
}

export function step(
  state: IndexState,
  realDtSec: number,
  speed: number,
  cfg: IndexConfig,
  rng: Rng,
): void {
  let remaining = Math.max(0, realDtSec) * speed;
  while (remaining > 0) {
    const slice = Math.min(5.0, remaining);
    nextSamples(state, slice, cfg, rng);
    state.simT += slice;
    maybeDecimate(state, cfg);
    maybeUpdateIndex(state, cfg);
    remaining -= slice;
  }
}

export function seed(state: IndexState, cfg: IndexConfig, rng: Rng, seconds = 8 * 60): void {
  const dt = 0.5;
  for (let t = 0; t < seconds; t += dt) {
    nextSamples(state, dt, cfg, rng);
    state.simT += dt;
    maybeDecimate(state, cfg);
    maybeUpdateIndex(state, cfg);
  }
  const cutoff = state.simT - 60;
  state.rawAbp = state.rawAbp.filter((s) => s.t >= cutoff);
  state.rawY = state.rawY.filter((s) => s.t >= cutoff);
}

export function reset(state: IndexState): void {
  state.rawAbp = [];
  state.rawY = [];
  state.meanPairs = [];
  state.trace = [];
  state.value = null;
  state.simT = 0;
  state.lastUpdateMin = 0;
}

export function classify(
  v: number | null,
  cfg: IndexConfig,
): 'good' | 'warn' | 'danger' | 'neutral' {
  if (v == null) return 'neutral';
  if (v >= cfg.impairedThreshold) return 'danger';
  if (v >= cfg.warnThreshold) return 'warn';
  return 'good';
}

export function classifyLabel(v: number | null, cfg: IndexConfig): string {
  if (v == null) return 'awaiting data…';
  if (v >= cfg.impairedThreshold) return `Impaired (≥ ${cfg.impairedThreshold.toFixed(2)})`;
  if (v >= cfg.warnThreshold) return 'Borderline';
  return 'Intact reactivity';
}
