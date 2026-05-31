/**
 * ICP waveform morphology engine.
 *
 * Each cardiac cycle is modelled as a sum of three Gaussians at fixed phases:
 *   P1 (percussion)  at  ϕ = 0.10
 *   P2 (tidal)       at  ϕ = 0.35
 *   P3 (dicrotic)    at  ϕ = 0.65
 *
 * Their relative amplitudes shift as compliance falls. The pulse amplitude
 * scales with the compliance state (low compliance ⇒ larger pulse).
 *
 * Reference: Cardoso 1983; Czosnyka 2004; Eide 2006.
 */

export type Compliance = 'normal' | 'low' | 'exhausted';

export interface PeakWeights {
  p1: number;
  p2: number;
  p3: number;
}

export const WEIGHTS: Record<Compliance, PeakWeights> = {
  normal: { p1: 1.0, p2: 0.6, p3: 0.4 },
  low: { p1: 0.7, p2: 0.9, p3: 0.4 },
  exhausted: { p1: 0.5, p2: 1.0, p3: 0.4 },
};

export const PULSE_SCALE: Record<Compliance, number> = {
  normal: 1.0,
  low: 1.5,
  exhausted: 2.2,
};

export const PHASES: PeakWeights = { p1: 0.10, p2: 0.35, p3: 0.65 };

/**
 * Sampled ICP value at sim-time `t` (seconds), with given mean ICP and compliance.
 * Heart rate fixed at 75 bpm by default.
 */
export function icpAt(t: number, meanIcp: number, c: Compliance, hrBpm = 75): number {
  const cycleSec = 60 / hrBpm;
  const phase = (t % cycleSec) / cycleSec;
  const w = WEIGHTS[c];
  const sigma = 0.06;
  const peakAmp = 8 * PULSE_SCALE[c];
  const v =
    w.p1 * Math.exp(-((phase - PHASES.p1) ** 2) / (2 * sigma * sigma)) +
    w.p2 * Math.exp(-((phase - PHASES.p2) ** 2) / (2 * sigma * sigma)) +
    w.p3 * Math.exp(-((phase - PHASES.p3) ** 2) / (2 * sigma * sigma));
  return meanIcp + (v - 0.4) * peakAmp;
}

export function pulseAmplitude(c: Compliance): number {
  return 8 * PULSE_SCALE[c];
}

export function morphologyLabel(c: Compliance): string {
  if (c === 'normal') return 'P1 > P2 > P3, normal';
  if (c === 'low') return 'P2 ≈ P1, low compliance';
  return 'P2 > P1, exhausted reserve';
}
