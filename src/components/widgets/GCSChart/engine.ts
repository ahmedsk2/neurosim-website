export interface GCSScores {
  eye: number; // 1-4
  verbal: number; // 1-5
  motor: number; // 1-6
}

export interface FOURScores {
  eye: number; // 0-4
  motor: number; // 0-4
  brainstem: number; // 0-4
  respiration: number; // 0-4
}

export type AgeBracket = 'preverbal' | 'child' | 'adult';

export const EYE_OPTIONS = [
  { score: 4, label: 'Spontaneous' },
  { score: 3, label: 'To voice' },
  { score: 2, label: 'To pain' },
  { score: 1, label: 'None' },
];

export const VERBAL_OPTIONS_ADULT = [
  { score: 5, label: 'Oriented' },
  { score: 4, label: 'Confused' },
  { score: 3, label: 'Inappropriate words' },
  { score: 2, label: 'Incomprehensible sounds' },
  { score: 1, label: 'None' },
];

export const VERBAL_OPTIONS_CHILD = [
  { score: 5, label: 'Oriented (age-appropriate)' },
  { score: 4, label: 'Confused / disoriented' },
  { score: 3, label: 'Crying inconsolably / inappropriate' },
  { score: 2, label: 'Moans / grunts to pain' },
  { score: 1, label: 'None' },
];

export const VERBAL_OPTIONS_PREVERBAL = [
  { score: 5, label: 'Coos, babbles, smiles, follows objects' },
  { score: 4, label: 'Cries but consolable' },
  { score: 3, label: 'Inconsolable cry' },
  { score: 2, label: 'Moans / grunts to pain' },
  { score: 1, label: 'None' },
];

export const MOTOR_OPTIONS = [
  { score: 6, label: 'Obeys commands' },
  { score: 5, label: 'Localises pain' },
  { score: 4, label: 'Withdraws from pain' },
  { score: 3, label: 'Abnormal flexion (decorticate)' },
  { score: 2, label: 'Extension (decerebrate)' },
  { score: 1, label: 'None' },
];

export const FOUR_EYE = [
  { score: 4, label: 'Eyelids open, tracking, blinks on command' },
  { score: 3, label: 'Eyelids open, no tracking' },
  { score: 2, label: 'Eyelids closed, opens to voice' },
  { score: 1, label: 'Eyelids closed, opens to pain' },
  { score: 0, label: 'Eyelids remain closed' },
];

export const FOUR_MOTOR = [
  { score: 4, label: 'Thumbs up / fist / peace sign' },
  { score: 3, label: 'Localising to pain' },
  { score: 2, label: 'Flexion to pain' },
  { score: 1, label: 'Extension to pain' },
  { score: 0, label: 'No response or generalised myoclonus' },
];

export const FOUR_BRAINSTEM = [
  { score: 4, label: 'Pupil + corneal reflexes present' },
  { score: 3, label: 'One pupil wide and fixed' },
  { score: 2, label: 'Pupil OR corneal absent' },
  { score: 1, label: 'Pupil AND corneal absent' },
  { score: 0, label: 'Absent pupil, corneal, cough' },
];

export const FOUR_RESP = [
  { score: 4, label: 'Not intubated, regular pattern' },
  { score: 3, label: 'Not intubated, Cheyne-Stokes' },
  { score: 2, label: 'Not intubated, irregular' },
  { score: 1, label: 'Breathes above ventilator rate' },
  { score: 0, label: 'Breathes at ventilator rate or apnoea' },
];

export function totalGCS(s: GCSScores): number {
  return s.eye + s.verbal + s.motor;
}

export function gcsSeverity(total: number): { label: string; status: 'good' | 'warn' | 'danger' } {
  if (total >= 13) return { label: 'Mild (13–15)', status: 'good' };
  if (total >= 9) return { label: 'Moderate (9–12)', status: 'warn' };
  return { label: 'Severe (≤ 8),secure airway', status: 'danger' };
}

export function totalFOUR(s: FOURScores): number {
  return s.eye + s.motor + s.brainstem + s.respiration;
}
