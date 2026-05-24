/**
 * EEG pattern generators, synthetic morphologies for the 8 canonical PICU patterns.
 *
 * References: Hirsch 2021 (ACNS terminology); Tasker 2018; Abend 2013 (cohort).
 */

export type EEGPattern =
  | 'normal'
  | 'focal_slowing'
  | 'generalized_slowing'
  | 'burst_suppression'
  | 'electrographic_focal'
  | 'electrographic_generalized'
  | 'ncse'
  | 'low_voltage'
  | 'isoelectric';

export const PATTERNS: { id: EEGPattern; label: string; subtitle: string }[] = [
  { id: 'normal', label: 'Normal awake', subtitle: 'Alpha posteriorly, beta anteriorly' },
  { id: 'focal_slowing', label: 'Focal slowing', subtitle: 'Delta/theta in one region' },
  { id: 'generalized_slowing', label: 'Generalised slowing', subtitle: 'Diffuse delta/theta' },
  { id: 'burst_suppression', label: 'Burst-suppression', subtitle: 'Bursts separated by suppression' },
  { id: 'electrographic_focal', label: 'Focal seizure', subtitle: 'Rhythmic high-amplitude focal' },
  { id: 'electrographic_generalized', label: 'Generalised seizure', subtitle: 'Bilateral synchronous rhythmic' },
  { id: 'ncse', label: 'NCSE', subtitle: 'Continuous rhythmic without convulsion' },
  { id: 'low_voltage', label: 'Suppressed / low voltage', subtitle: 'Flat-ish background' },
  { id: 'isoelectric', label: 'Isoelectric', subtitle: 'No activity > 2 µV' },
];

/**
 * EEG voltage at sim-time `t` (seconds), pattern, and channel index (0..3).
 * Used to draw the live strip.
 */
export function eegVal(t: number, pattern: EEGPattern, channel: number): number {
  // Per-channel phase offset
  const ph = channel * 0.7;
  switch (pattern) {
    case 'normal':
      return 25 * Math.sin(2 * Math.PI * 10 * t + ph) + 8 * Math.sin(2 * Math.PI * 22 * t);
    case 'focal_slowing':
      if (channel === 1) return 50 * Math.sin(2 * Math.PI * 2.5 * t + ph) + 5 * Math.sin(2 * Math.PI * 6 * t);
      return 22 * Math.sin(2 * Math.PI * 9 * t + ph) + 8 * Math.sin(2 * Math.PI * 21 * t);
    case 'generalized_slowing':
      return 45 * Math.sin(2 * Math.PI * 2 * t + ph) + 10 * Math.sin(2 * Math.PI * 5 * t + ph);
    case 'burst_suppression': {
      const cycle = (t % 8) / 8;
      const inBurst = cycle < 0.18;
      if (inBurst) return 90 * Math.sin(2 * Math.PI * 14 * t + ph) + 30 * Math.sin(2 * Math.PI * 4 * t);
      return 1.5 * Math.sin(2 * Math.PI * 0.5 * t);
    }
    case 'electrographic_focal':
      if (channel === 0)
        return 80 * Math.sin(2 * Math.PI * 3.5 * t) * Math.exp(-((((t * 0.4) % 1) - 0.5) ** 2) * 4);
      return 22 * Math.sin(2 * Math.PI * 9 * t + ph);
    case 'electrographic_generalized':
      return 90 * Math.sin(2 * Math.PI * 3 * t) + 25 * Math.sin(2 * Math.PI * 6 * t);
    case 'ncse':
      return 70 * Math.sin(2 * Math.PI * 2.7 * t + ph) + 20 * Math.sin(2 * Math.PI * 5.5 * t + ph);
    case 'low_voltage':
      return 5 * Math.sin(2 * Math.PI * 4 * t + ph) + 1.5 * Math.sin(2 * Math.PI * 1 * t);
    case 'isoelectric':
      return 0.8 * Math.sin(2 * Math.PI * 0.4 * t);
  }
}
