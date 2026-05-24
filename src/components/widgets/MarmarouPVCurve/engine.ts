/**
 * Marmarou pressure-volume curve, sigmoidal teaching form.
 *
 * The classic Marmarou exponential ICP = ICP₀·exp(ΔV/PVI) only describes the
 * rising portion of the curve. The full bedside teaching picture is a sigmoid
 * (4 phases): the curve stays flat in the compensation phase, rises through
 * decreasing and minimal compliance, then PLATEAUS at the top where the
 * cerebral microvasculature collapses (CPP exhausted; pressure can no longer
 * rise). This engine implements that 4-phase sigmoid so that the visualisation
 * reflects the canonical teaching diagram (matching the colour zones used in
 * the static illustration).
 *
 * Formula:
 *   ICP(V) = baseline + range · (σ(K·(V − Vc)) − σ₀) / (1 − σ₀)
 *   where σ(x) = 1 / (1 + e⁻ˣ),  σ₀ = σ(−K·Vc),
 *         K = 6 / PVI (smaller PVI → steeper sigmoid),
 *         Vc = PVI · 0.65 (inflection volume).
 *
 * Properties:
 *   - icpAt(0) = baseline    (anchored: V=0 maps exactly to resting ICP)
 *   - icpAt(V→∞) = ICP_MAX   (terminal plateau, microvascular collapse)
 *   - dICP/dV grows monotonically through the inflection then falls toward
 *     zero at the plateau (matches the bedside "+1 mL hurts more as you climb
 *     the curve, then can't rise further" teaching).
 *
 * Reference: Marmarou 1975, Avezaat 1979 (canonical exponential, rising
 * portion only); sigmoidal teaching form is the version reproduced in
 * neurosurgical textbooks (compensation → decreasing compliance → minimal
 * compliance → microvascular collapse).
 */

export interface PVCurveParams {
  icpBaseline: number; // mmHg
  pvi: number; // mL, pressure-volume index
}

/** Ceiling above which cerebral microvasculature is taken to collapse. */
const ICP_MAX = 80;

function shape(p: PVCurveParams) {
  const K = 6 / p.pvi;
  const Vc = p.pvi * 0.65;
  const sigma0 = 1 / (1 + Math.exp(K * Vc)); // σ(−K·Vc)
  const range = ICP_MAX - p.icpBaseline;
  return { K, Vc, sigma0, range };
}

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function icpAt(deltaV: number, p: PVCurveParams): number {
  const { K, Vc, sigma0, range } = shape(p);
  return p.icpBaseline + (range * (sigmoid(K * (deltaV - Vc)) - sigma0)) / (1 - sigma0);
}

/**
 * Solve for the ΔV that produces a given ICP, given baseline.
 * Returns 0 for icp ≤ baseline, Infinity for icp ≥ ICP_MAX.
 */
export function deltaVFor(icp: number, p: PVCurveParams): number {
  if (icp <= p.icpBaseline) return 0;
  if (icp >= ICP_MAX) return Infinity;
  const { K, Vc, sigma0, range } = shape(p);
  const pSig = sigma0 + ((1 - sigma0) * (icp - p.icpBaseline)) / range;
  return Vc + Math.log(pSig / (1 - pSig)) / K;
}

/** Local elastance dP/dV at the operating point (mmHg / mL). */
export function elastanceAt(deltaV: number, p: PVCurveParams): number {
  const { K, Vc, sigma0, range } = shape(p);
  const s = sigmoid(K * (deltaV - Vc));
  return (range * K * s * (1 - s)) / (1 - sigma0);
}

/** Predicted ICP after adding `volMl` of additional CSF / blood / brain volume. */
export function icpAfterVolume(currentIcp: number, volMl: number, p: PVCurveParams): number {
  const currentV = deltaVFor(currentIcp, p);
  if (!Number.isFinite(currentV)) return Math.min(ICP_MAX, currentIcp); // already at plateau
  return icpAt(currentV + volMl, p);
}
