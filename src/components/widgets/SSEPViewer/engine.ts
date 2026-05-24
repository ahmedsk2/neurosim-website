/**
 * SSEP / BAER waveform engine.
 *
 * SSEP after median nerve stimulation: cortical N20 (~20 ms in adults; ~14-17 ms in pre-adolescents, Carter 2006), N20-P25 complex.
 * NOTE: latency values in this widget are adult; pediatric N20 latencies are shorter and scale with arm length and age.
 * Bilaterally absent N20 24–72 h post-arrest is highly specific for poor outcome.
 *
 * BAER after click: waves I (cochlear) → V (lateral lemniscus / inferior colliculus).
 * Wave V latency / I-V interpeak delay flags brainstem dysfunction.
 *
 * References: Robinson 2003; Carter 2006 (pediatric); Logi 2003; Wijdicks 2006.
 */

export type SSEPPattern =
  | 'normal'
  | 'prolonged_n20'
  | 'absent_n20_unilateral'
  | 'absent_n20_bilateral';

export type BAERPattern = 'normal' | 'prolonged_v' | 'absent_iii_v' | 'absent_all';

export interface SSEPProfile {
  id: SSEPPattern;
  label: string;
  leftN20Latency: number; // ms
  rightN20Latency: number; // ms
  leftN20Amplitude: number; // µV
  rightN20Amplitude: number; // µV
  prognosis: 'good' | 'warn' | 'danger';
  note: string;
}

export interface BAERProfile {
  id: BAERPattern;
  label: string;
  waveLatencies: { I: number; III: number; V: number }; // ms
  interpeakIV: number; // I-V
  prognosis: 'good' | 'warn' | 'danger';
  note: string;
}

export const SSEP_PROFILES: SSEPProfile[] = [
  {
    id: 'normal',
    label: 'Normal',
    leftN20Latency: 19.5,
    rightN20Latency: 19.7,
    leftN20Amplitude: 2.4,
    rightN20Amplitude: 2.3,
    prognosis: 'good',
    note: 'Symmetric N20 with normal latency and amplitude.',
  },
  {
    id: 'prolonged_n20',
    label: 'Prolonged N20',
    leftN20Latency: 23.5,
    rightN20Latency: 24.0,
    leftN20Amplitude: 1.4,
    rightN20Amplitude: 1.3,
    prognosis: 'warn',
    note: 'Delayed cortical response, central conduction slowing.',
  },
  {
    id: 'absent_n20_unilateral',
    label: 'Absent N20 (left)',
    leftN20Latency: 0,
    rightN20Latency: 19.7,
    leftN20Amplitude: 0,
    rightN20Amplitude: 2.3,
    prognosis: 'warn',
    note: 'Unilateral cortical loss, focal lesion likely.',
  },
  {
    id: 'absent_n20_bilateral',
    label: 'Absent N20 bilaterally',
    leftN20Latency: 0,
    rightN20Latency: 0,
    leftN20Amplitude: 0,
    rightN20Amplitude: 0,
    prognosis: 'danger',
    note:
      '24–72 h post-cardiac-arrest: highly specific for poor outcome (with other criteria; Wijdicks 2006).',
  },
];

export const BAER_PROFILES: BAERProfile[] = [
  {
    id: 'normal',
    label: 'Normal',
    waveLatencies: { I: 1.6, III: 3.7, V: 5.6 },
    interpeakIV: 4.0,
    prognosis: 'good',
    note: 'All five waves present; normal interpeak intervals.',
  },
  {
    id: 'prolonged_v',
    label: 'Prolonged wave V',
    waveLatencies: { I: 1.6, III: 3.9, V: 6.3 },
    interpeakIV: 4.7,
    prognosis: 'warn',
    note: 'Prolonged I-V interpeak, pontine conduction slowing.',
  },
  {
    id: 'absent_iii_v',
    label: 'Absent waves III + V',
    waveLatencies: { I: 1.6, III: 0, V: 0 },
    interpeakIV: 0,
    prognosis: 'danger',
    note: 'Cochlear (wave I) intact; brainstem responses lost.',
  },
  {
    id: 'absent_all',
    label: 'All waves absent',
    waveLatencies: { I: 0, III: 0, V: 0 },
    interpeakIV: 0,
    prognosis: 'danger',
    note: 'Either profound brainstem injury or peripheral / technical failure, re-test.',
  },
];

/**
 * Synthesize an SSEP voltage trace at sample time t (ms).
 * Cortical channel only, sum of Gaussian pulses centred at N20 / P25.
 */
export function ssepSample(tMs: number, latency: number, amplitudeUv: number): number {
  if (amplitudeUv === 0) return 0.05 * Math.sin(2 * Math.PI * 0.3 * tMs); // baseline noise
  // N20: negative deflection at latency, sigma ~ 1.2ms
  const sigmaN = 1.2;
  const n20 = -amplitudeUv * Math.exp(-((tMs - latency) ** 2) / (2 * sigmaN * sigmaN));
  // P25: positive deflection at latency + 5ms, sigma ~ 1.5ms
  const sigmaP = 1.5;
  const p25 = (amplitudeUv * 0.6) * Math.exp(-((tMs - latency - 5) ** 2) / (2 * sigmaP * sigmaP));
  return n20 + p25;
}

/**
 * Synthesize a BAER voltage trace at sample time t (ms).
 * Sum of small Gaussians centred at each wave latency.
 */
export function baerSample(tMs: number, latencies: { I: number; III: number; V: number }): number {
  const sigma = 0.25;
  let v = 0;
  if (latencies.I > 0) v += 0.4 * Math.exp(-((tMs - latencies.I) ** 2) / (2 * sigma * sigma));
  if (latencies.III > 0) v += 0.3 * Math.exp(-((tMs - latencies.III) ** 2) / (2 * sigma * sigma));
  if (latencies.V > 0) v += 0.5 * Math.exp(-((tMs - latencies.V) ** 2) / (2 * sigma * sigma));
  return v;
}
