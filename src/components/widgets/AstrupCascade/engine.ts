/**
 * Astrup ischemic cascade thresholds and EEG morphology lookup.
 * Reference: Astrup, Siesjö, Symon 1981; Hossmann 1994.
 */

export type AstrupBand =
  | 'normal'
  | 'drowsy'
  | 'slow_delta'
  | 'suppressed_low_voltage'
  | 'isoelectric';

export interface AstrupThresholds {
  cbf: number; // upper bound (mL/100g/min)
  band: AstrupBand;
  label: string;
  status: 'good' | 'warn' | 'danger';
}

/**
 * Each entry's `cbf` is the inclusive lower bound for that band:
 *  - normal: cbf ≥ 50
 *  - drowsy: 35 ≤ cbf < 50
 *  - slow_delta: 25 ≤ cbf < 35
 *  - suppressed_low_voltage: 15 ≤ cbf < 25
 *  - isoelectric: cbf < 15
 */
export const THRESHOLDS: AstrupThresholds[] = [
  { cbf: 50, band: 'normal', label: 'Normal EEG · synaptic function intact', status: 'good' },
  { cbf: 35, band: 'drowsy', label: 'Drowsy / mild slowing', status: 'good' },
  { cbf: 25, band: 'slow_delta', label: 'Slow delta dominance', status: 'warn' },
  { cbf: 15, band: 'suppressed_low_voltage', label: 'Suppressed / low voltage · Na/K pump failure imminent', status: 'danger' },
  { cbf: 0, band: 'isoelectric', label: 'Isoelectric · cell death within minutes', status: 'danger' },
];

export function bandFor(cbf: number): AstrupThresholds {
  for (const t of THRESHOLDS) {
    if (cbf >= t.cbf) return t;
  }
  return THRESHOLDS[THRESHOLDS.length - 1]!;
}

/**
 * Returns a sample EEG voltage at time `t` (seconds) for the given CBF level.
 * Used to morph the displayed strip live as the slider moves.
 */
export function eegSample(t: number, cbf: number): number {
  if (cbf >= 50) {
    // Mixed alpha (10 Hz) + beta (20 Hz)
    return 25 * Math.sin(2 * Math.PI * 10 * t) + 8 * Math.sin(2 * Math.PI * 20 * t + 1);
  }
  if (cbf >= 35) {
    // Theta dominant
    return 30 * Math.sin(2 * Math.PI * 6 * t) + 5 * Math.sin(2 * Math.PI * 14 * t);
  }
  if (cbf >= 25) {
    // Delta dominant, larger amplitude
    return 50 * Math.sin(2 * Math.PI * 2.5 * t) + 5 * Math.sin(2 * Math.PI * 8 * t);
  }
  if (cbf >= 15) {
    // Suppressed, low voltage
    return 6 * Math.sin(2 * Math.PI * 1.5 * t) + 3 * Math.sin(2 * Math.PI * 7 * t);
  }
  // Isoelectric
  return 1.5 * Math.sin(2 * Math.PI * 0.7 * t);
}
