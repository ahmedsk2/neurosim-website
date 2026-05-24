/**
 * Brain temperature engine.
 *
 * Brain temp typically exceeds core by ~0.5 °C; gradient widens with seizure,
 * hyperemia, very high ICP. CMRO₂ Q10 = 1.07 → ~7% rise per °C above 37.
 *
 * References: Henker 1998; Soukup 2002; Childs 2014; Polderman 2009 (Q10).
 */

export interface BrainTempState {
  coreC: number;
  hasSeizure: boolean;
  hasHyperemia: boolean;
  highIcp: boolean;
}

export function brainTempFor(s: BrainTempState): number {
  let delta = 0.4 + (s.coreC - 37) * 0.05; // baseline gradient
  if (s.hasSeizure) delta += 1.4;
  if (s.hasHyperemia) delta += 0.6;
  if (s.highIcp) delta += 0.5;
  return s.coreC + delta;
}

export function cmro2Multiplier(brainTempC: number): number {
  return Math.pow(1.07, (brainTempC - 37) / 1);
}

export function classifyTemp(t: number): { label: string; status: 'good' | 'warn' | 'danger' } {
  if (t < 36.5) return { label: 'Below normothermia', status: 'warn' };
  if (t <= 37.5) return { label: 'Normothermia', status: 'good' };
  if (t <= 38.5) return { label: 'Mild fever, control', status: 'warn' };
  if (t <= 39.5) return { label: 'Aggressive control needed', status: 'danger' };
  return { label: 'Emergency, refractory hyperthermia', status: 'danger' };
}
