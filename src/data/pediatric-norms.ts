/**
 * Pediatric normative values, seed for the AgeBandNorms widget and the /pediatrics hub.
 *
 * Values are working clinical defaults derived from heterogeneous sources;
 * always individualize using autoregulation indices when available.
 *
 * Citation keys reference src/data/references.ts.
 */

import type { EvidenceGrade } from './references';

export type AgeBand =
  | 'newborn'
  | 'infant'
  | 'toddler'
  | 'preschool'
  | 'school-age'
  | 'adolescent';

export interface AgeBandMeta {
  id: AgeBand;
  label: string;
  rangeMonths: [number, number];
}

export const AGE_BANDS: AgeBandMeta[] = [
  { id: 'newborn', label: 'Newborn (0–1 mo)', rangeMonths: [0, 1] },
  { id: 'infant', label: 'Infant (1–12 mo)', rangeMonths: [1, 12] },
  { id: 'toddler', label: 'Toddler (1–3 yr)', rangeMonths: [12, 36] },
  { id: 'preschool', label: 'Preschool (3–6 yr)', rangeMonths: [36, 72] },
  { id: 'school-age', label: 'School-age (6–12 yr)', rangeMonths: [72, 144] },
  { id: 'adolescent', label: 'Adolescent (13–18 yr)', rangeMonths: [144, 216] },
];

export interface NormRow {
  id: string;
  label: string;
  unit: string;
  per: Record<AgeBand, { normal: string; concern?: string; source: string; grade?: EvidenceGrade }>;
  notes?: string;
}

export const NORMS: NormRow[] = [
  // Hemodynamics, PALS 2020
  {
    id: 'hr-awake',
    label: 'Heart rate (awake)',
    unit: 'bpm',
    per: {
      newborn: { normal: '100–205', source: 'pals2020', grade: 'expert' },
      infant: { normal: '90–180', source: 'pals2020', grade: 'expert' },
      toddler: { normal: '80–140', source: 'pals2020', grade: 'expert' },
      preschool: { normal: '65–120', source: 'pals2020', grade: 'expert' },
      'school-age': { normal: '60–110', source: 'pals2020', grade: 'expert' },
      adolescent: { normal: '50–100', source: 'pals2020', grade: 'expert' },
    },
  },
  {
    id: 'sbp',
    label: 'Systolic BP',
    unit: 'mmHg',
    per: {
      newborn: { normal: '60–80', source: 'pals2020', grade: 'expert' },
      infant: { normal: '70–100', source: 'pals2020', grade: 'expert' },
      toddler: { normal: '80–110', source: 'pals2020', grade: 'expert' },
      preschool: { normal: '90–115', source: 'pals2020', grade: 'expert' },
      'school-age': { normal: '95–120', source: 'pals2020', grade: 'expert' },
      adolescent: { normal: '100–130', source: 'pals2020', grade: 'expert' },
    },
  },
  {
    id: 'map-target',
    label: 'MAP minimum target',
    unit: 'mmHg',
    per: {
      newborn: { normal: '≥ 35–40', source: 'pals2020', grade: 'expert' },
      infant: { normal: '≥ 40–50', source: 'pals2020', grade: 'expert' },
      toddler: { normal: '≥ 50–55', source: 'pals2020', grade: 'expert' },
      preschool: { normal: '≥ 55–60', source: 'pals2020', grade: 'expert' },
      'school-age': { normal: '≥ 60–65', source: 'pals2020', grade: 'expert' },
      adolescent: { normal: '≥ 65–70', source: 'pals2020', grade: 'expert' },
    },
  },

  // ICP / CPP, Kochanek 2019 + Tasker 2023
  {
    id: 'icp-normal',
    label: 'ICP, normal',
    unit: 'mmHg',
    per: {
      newborn: { normal: '< 6', source: 'tasker2023', grade: 'sparse' },
      infant: { normal: '< 8', source: 'tasker2023', grade: 'sparse' },
      toddler: { normal: '< 10', source: 'kochanek2019', grade: 'C' },
      preschool: { normal: '< 10', source: 'kochanek2019', grade: 'C' },
      'school-age': { normal: '< 15', source: 'kochanek2019', grade: 'C' },
      adolescent: { normal: '< 15', source: 'kochanek2019', grade: 'B' },
    },
  },
  {
    id: 'icp-treat',
    label: 'ICP, treatment threshold',
    unit: 'mmHg',
    per: {
      newborn: { normal: '> 10', source: 'tasker2023', grade: 'sparse' },
      infant: { normal: '> 15', source: 'tasker2023', grade: 'sparse' },
      toddler: { normal: '> 20', source: 'kochanek2019', grade: 'C' },
      preschool: { normal: '> 20', source: 'kochanek2019', grade: 'C' },
      'school-age': { normal: '> 20', source: 'kochanek2019', grade: 'C' },
      adolescent: { normal: '> 20', source: 'kochanek2019', grade: 'B' },
    },
  },
  {
    id: 'cpp-min',
    label: 'CPP minimum target',
    unit: 'mmHg',
    per: {
      newborn: { normal: '30–40', source: 'kochanek2019', grade: 'sparse' },
      infant: { normal: '40–50', source: 'kochanek2019', grade: 'sparse' },
      toddler: { normal: '40–50', source: 'kochanek2019', grade: 'C' },
      preschool: { normal: '50–55', source: 'kochanek2019', grade: 'C' },
      'school-age': { normal: '50–60', source: 'kochanek2019', grade: 'C' },
      adolescent: { normal: '60–70', source: 'kochanek2019', grade: 'B' },
    },
  },

  // TCD, O'Brien 2015
  {
    id: 'tcd-mca-mfv',
    label: 'TCD MCA mean flow velocity',
    unit: 'cm/s',
    per: {
      newborn: { normal: '~24', source: 'obrien2015', grade: 'C' },
      infant: { normal: '40–80', source: 'obrien2015', grade: 'C' },
      toddler: { normal: '80–100', source: 'obrien2015', grade: 'C' },
      preschool: { normal: '90–110', source: 'obrien2015', grade: 'C' },
      'school-age': { normal: '85–95', source: 'obrien2015', grade: 'C' },
      adolescent: { normal: '60–80', source: 'obrien2015', grade: 'C' },
    },
  },

  // NIRS rSO₂
  {
    id: 'nirs',
    label: 'NIRS rSO₂',
    unit: '%',
    per: {
      newborn: { normal: '65–85', concern: '< 55', source: 'hyttel2015', grade: 'A' },
      infant: { normal: '60–80', concern: '< 50', source: 'kurth2009', grade: 'C' },
      toddler: { normal: '60–80', concern: '< 50', source: 'kurth2009', grade: 'C' },
      preschool: { normal: '60–80', concern: '< 50', source: 'kurth2009', grade: 'C' },
      'school-age': { normal: '60–80', concern: '< 50', source: 'kurth2009', grade: 'C' },
      adolescent: { normal: '60–75', concern: '< 50', source: 'kurth2009', grade: 'C' },
    },
    notes: 'Asymmetry > 10–15 % is clinically significant in any age group.',
  },

  // ONSD, Padayachy / Robba
  {
    id: 'onsd',
    label: 'ONSD upper bound',
    unit: 'mm',
    per: {
      newborn: { normal: '< 4.0', concern: '> 4.5', source: 'padayachy2012', grade: 'C' },
      infant: { normal: '< 4.0', concern: '> 4.5', source: 'padayachy2012', grade: 'C' },
      toddler: { normal: '< 4.5', concern: '> 5.0', source: 'padayachy2012', grade: 'C' },
      preschool: { normal: '< 4.5', concern: '> 5.0', source: 'padayachy2012', grade: 'C' },
      'school-age': { normal: '< 4.5', concern: '> 5.0', source: 'padayachy2012', grade: 'C' },
      adolescent: { normal: '< 5.7', concern: '> 6.0', source: 'robba2018', grade: 'B' },
    },
  },

  // NPi
  {
    id: 'npi',
    label: 'NPi',
    unit: '0–5',
    per: {
      newborn: { normal: '3.0–5.0', concern: '< 3', source: 'olson2016', grade: 'expert' },
      infant: { normal: '3.0–5.0', concern: '< 3', source: 'olson2016', grade: 'expert' },
      toddler: { normal: '3.0–5.0', concern: '< 3', source: 'olson2016', grade: 'expert' },
      preschool: { normal: '3.0–5.0', concern: '< 3', source: 'olson2016', grade: 'expert' },
      'school-age': { normal: '3.0–5.0', concern: '< 3', source: 'olson2016', grade: 'expert' },
      adolescent: { normal: '3.0–5.0', concern: '< 3', source: 'olson2016', grade: 'expert' },
    },
    notes: 'Sedation depresses NPi; estimate ~((40 − BIS)/40) × 0.8 reduction when BIS < 40.',
  },

  // PaCO₂ targets
  {
    id: 'paco2',
    label: 'PaCO₂,normocapnia',
    unit: 'mmHg',
    per: {
      newborn: { normal: '35–45', source: 'kochanek2019', grade: 'expert' },
      infant: { normal: '35–40', source: 'kochanek2019', grade: 'expert' },
      toddler: { normal: '35–40', source: 'kochanek2019', grade: 'expert' },
      preschool: { normal: '35–40', source: 'kochanek2019', grade: 'expert' },
      'school-age': { normal: '35–40', source: 'kochanek2019', grade: 'expert' },
      adolescent: { normal: '35–40', source: 'kochanek2019', grade: 'expert' },
    },
    notes: 'Avoid prophylactic hyperventilation (PaCO₂ > 30). Brief PaCO₂ 30–35 acceptable for impending herniation.',
  },
];

export function findBand(months: number): AgeBand {
  for (const b of AGE_BANDS) if (months < b.rangeMonths[1]) return b.id;
  return 'adolescent';
}

export function normFor(rowId: string, band: AgeBand) {
  const row = NORMS.find((r) => r.id === rowId);
  return row?.per[band];
}
