/**
 * Pupillometry pattern catalog.
 * NPi (Neurological Pupil Index): algorithmic 0–5 score combining size,
 * constriction velocity, latency, and dilation velocity. < 3 abnormal.
 *
 * Each pattern carries fully bilateral data: every measurement (size, NPi,
 * constriction velocity, latency, dilation velocity) is recorded per eye so
 * unilateral lesions show a real L/R difference.
 *
 * Reference: Chen 2011, Olson 2016 (EU-NPi), Oddo 2018, Larson 1997.
 */

export interface PupilSide {
  size: number; // mm baseline
  npi: number; // 0–5
  constrictionPctPerSec: number; // % per second
  latencyMs: number; // pupil response latency
  dilationVelMmPerSec: number; // mm per second on light off
}

export interface PupilPattern {
  id: string;
  label: string;
  left: PupilSide;
  right: PupilSide;
  description: string;
  status: 'good' | 'warn' | 'danger';
  /** Whether each pupil reacts to light. Some patterns have one reactive + one fixed. */
  leftReactsToLight: boolean;
  rightReactsToLight: boolean;
  /** Suggested clinical pearl / what to do. */
  action?: string;
}

const sym = (s: PupilSide): { left: PupilSide; right: PupilSide } => ({ left: s, right: { ...s } });

export const PATTERNS: PupilPattern[] = [
  {
    id: 'normal',
    label: 'Normal reactive',
    ...sym({ size: 3.5, npi: 4.5, constrictionPctPerSec: 22, latencyMs: 250, dilationVelMmPerSec: 1.5 }),
    description: 'Equal, mid-size, briskly reactive. Brisk constriction velocity and short latency.',
    status: 'good',
    leftReactsToLight: true,
    rightReactsToLight: true,
    action: 'Document baseline; trend NPi q4h.',
  },
  {
    id: 'sluggish',
    label: 'Reactive, sluggish (bilateral)',
    ...sym({ size: 4.5, npi: 3.0, constrictionPctPerSec: 9, latencyMs: 400, dilationVelMmPerSec: 0.7 }),
    description: 'Slow constriction, long latency. Early herniation, drug effect, or mild encephalopathy.',
    status: 'warn',
    leftReactsToLight: true,
    rightReactsToLight: true,
    action: 'Trend hourly; review sedation; consider imaging.',
  },
  {
    id: 'pinpoint',
    label: 'Bilateral pinpoint',
    ...sym({ size: 1.5, npi: 2.5, constrictionPctPerSec: 6, latencyMs: 320, dilationVelMmPerSec: 0.4 }),
    description: 'Pontine lesion or opioid effect. Reactive but tiny, magnifier helps assessment.',
    status: 'warn',
    leftReactsToLight: true,
    rightReactsToLight: true,
    action: 'Check opioid dose, reverse if appropriate; image if no opioid history.',
  },
  {
    id: 'mid_fixed',
    label: 'Mid-position fixed (bilateral)',
    ...sym({ size: 5.0, npi: 0.0, constrictionPctPerSec: 0, latencyMs: 0, dilationVelMmPerSec: 0 }),
    description: 'Midbrain lesion / brain death. No light reflex; consensual reflex absent.',
    status: 'danger',
    leftReactsToLight: false,
    rightReactsToLight: false,
    action: 'Confirm with second examiner; clinical brain-death pathway as appropriate.',
  },
  {
    id: 'left_blown',
    label: 'L unilateral dilated fixed',
    left: { size: 7.5, npi: 0.0, constrictionPctPerSec: 0, latencyMs: 0, dilationVelMmPerSec: 0 },
    right: { size: 3.5, npi: 4.4, constrictionPctPerSec: 21, latencyMs: 260, dilationVelMmPerSec: 1.4 },
    description:
      'Left uncal herniation. Compression of CN III at the tentorial edge: parasympathetic fibres on the dorsal aspect fail first → dilated fixed pupil ipsilateral to the lesion.',
    status: 'danger',
    leftReactsToLight: false,
    rightReactsToLight: true,
    action: 'Emergency: hyperosmolar therapy, head-up 30°, neurosurgical consult, secure airway.',
  },
  {
    id: 'right_blown',
    label: 'R unilateral dilated fixed',
    left: { size: 3.5, npi: 4.4, constrictionPctPerSec: 21, latencyMs: 260, dilationVelMmPerSec: 1.4 },
    right: { size: 7.5, npi: 0.0, constrictionPctPerSec: 0, latencyMs: 0, dilationVelMmPerSec: 0 },
    description: 'Right uncal herniation, mirror of the left-side pattern.',
    status: 'danger',
    leftReactsToLight: true,
    rightReactsToLight: false,
    action: 'Emergency: hyperosmolar therapy, head-up 30°, neurosurgical consult, secure airway.',
  },
  {
    id: 'bilateral_blown',
    label: 'Bilateral dilated fixed',
    ...sym({ size: 8.0, npi: 0.0, constrictionPctPerSec: 0, latencyMs: 0, dilationVelMmPerSec: 0 }),
    description: 'Severe diffuse injury / bilateral late herniation / atropine.',
    status: 'danger',
    leftReactsToLight: false,
    rightReactsToLight: false,
    action: 'Exclude topical mydriatic / atropine first; if confirmed neurogenic, emergency.',
  },
  {
    id: 'mydriatic',
    label: 'Topical mydriatic (atropine / tropicamide)',
    ...sym({ size: 8.0, npi: 0.0, constrictionPctPerSec: 0, latencyMs: 0, dilationVelMmPerSec: 0 }),
    description: 'Looks like bilateral dilated fixed, known exposure makes this benign.',
    status: 'warn',
    leftReactsToLight: false,
    rightReactsToLight: false,
    action: 'Document exposure; reassess after pharmacological washout (4–8 h for tropicamide).',
  },
  {
    id: 'horner_l',
    label: "Left Horner's syndrome",
    left: { size: 2.5, npi: 4.5, constrictionPctPerSec: 18, latencyMs: 280, dilationVelMmPerSec: 0.6 },
    right: { size: 3.5, npi: 4.5, constrictionPctPerSec: 22, latencyMs: 250, dilationVelMmPerSec: 1.5 },
    description:
      'Sympathetic chain lesion on the left: miosis, ptosis, anhidrosis. Light reflex preserved. Slow dilation in dim light is the hallmark.',
    status: 'warn',
    leftReactsToLight: true,
    rightReactsToLight: true,
    action: 'Look for cause: ICA dissection (urgent), brainstem stroke, lung apex lesion (Pancoast).',
  },
  {
    id: 'horner_r',
    label: "Right Horner's syndrome",
    left: { size: 3.5, npi: 4.5, constrictionPctPerSec: 22, latencyMs: 250, dilationVelMmPerSec: 1.5 },
    right: { size: 2.5, npi: 4.5, constrictionPctPerSec: 18, latencyMs: 280, dilationVelMmPerSec: 0.6 },
    description: "Mirror of left Horner's.",
    status: 'warn',
    leftReactsToLight: true,
    rightReactsToLight: true,
    action: 'Same investigations as left Horner.',
  },
  {
    id: 'hippus',
    label: 'Hippus (autonomic instability)',
    ...sym({ size: 4.0, npi: 3.0, constrictionPctPerSec: 12, latencyMs: 300, dilationVelMmPerSec: 1.2 }),
    description: 'Rhythmic dilation/constriction at rest. Autonomic dysregulation.',
    status: 'warn',
    leftReactsToLight: true,
    rightReactsToLight: true,
    action: 'Assess autonomic function broadly; trend NPi.',
  },
  {
    id: 'brisk',
    label: 'Reactive, brisk',
    ...sym({ size: 3.0, npi: 4.8, constrictionPctPerSec: 28, latencyMs: 200, dilationVelMmPerSec: 1.8 }),
    description: 'Fast, symmetric, best NPi. Reassuring.',
    status: 'good',
    leftReactsToLight: true,
    rightReactsToLight: true,
    action: 'Trend; expected in alert, opioid-light patient.',
  },
];

/**
 * Effect of deep sedation on NPi.
 * When BIS < 40, NPi reduced by ((40 − BIS)/40) × 0.8.
 */
export function npiWithSedation(npi: number, bis: number): number {
  if (bis >= 40) return npi;
  const reduction = ((40 - bis) / 40) * 0.8;
  return Math.max(0, npi - reduction);
}

export function asymmetryFlag(left: PupilSide, right: PupilSide): {
  sizeAsymMm: number;
  npiAsym: number;
  significant: boolean;
} {
  const sizeAsymMm = Math.abs(left.size - right.size);
  const npiAsym = Math.abs(left.npi - right.npi);
  return {
    sizeAsymMm,
    npiAsym,
    significant: sizeAsymMm >= 1.0 || npiAsym >= 0.7,
  };
}
