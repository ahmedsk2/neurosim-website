/**
 * Maps modality / foundation / integration slugs (or labels) to
 * Thumbnail SVG variants + tones. Centralised here so cards across the
 * site stay visually consistent.
 */

import type { ThumbnailKind, ThumbnailTone } from '@/components/ui/Thumbnail';
import type { ModalityMeta, ModalityType } from '@/data/modalities';

export interface ThumbSpec {
  kind: ThumbnailKind;
  tone: ThumbnailTone;
}

// ── Modalities ────────────────────────────────────────────────────────────
const TYPE_TO_THUMB: Record<ModalityType, ThumbSpec> = {
  clinical:    { kind: 'pulse',    tone: 'neutral' },
  pressure:    { kind: 'wave',     tone: 'amber' },
  flow:        { kind: 'flow',     tone: 'teal' },
  oxygenation: { kind: 'optode',   tone: 'teal' },
  electrical:  { kind: 'spectrum', tone: 'purple' },
  metabolic:   { kind: 'molecule', tone: 'purple' },
  reactivity:  { kind: 'ucurve',   tone: 'amber' },
  adjunct:     { kind: 'adjunct',  tone: 'teal' },
};

// Slug-specific overrides for modalities where the default doesn't fit perfectly.
const MODALITY_OVERRIDES: Record<string, Partial<ThumbSpec>> = {
  'clinical-exam':              { kind: 'pulse', tone: 'neutral' },
  'pupillometry':               { kind: 'adjunct', tone: 'teal' },
  'evoked-potentials':          { kind: 'pulse', tone: 'purple' },
  'eeg':                        { kind: 'spectrum', tone: 'purple' },
  'aeeg':                       { kind: 'spectrum', tone: 'purple' },
  'qeeg':                       { kind: 'spectrum', tone: 'purple' },
  'bis':                        { kind: 'spectrum', tone: 'purple' },
  'ecog-sd':                    { kind: 'propagation', tone: 'purple' },
  'tcd':                        { kind: 'flow', tone: 'teal' },
  'mx':                         { kind: 'flow', tone: 'teal' },
  'direct-cbf':                 { kind: 'flow', tone: 'teal' },
  'nirs':                       { kind: 'optode', tone: 'teal' },
  'advanced-nirs':              { kind: 'optode', tone: 'teal' },
  'pbto2':                      { kind: 'molecule', tone: 'amber' },
  'sjvo2':                      { kind: 'molecule', tone: 'red' },
  'microdialysis':              { kind: 'molecule', tone: 'purple' },
  'icp':                        { kind: 'wave', tone: 'amber' },
  'rap':                        { kind: 'wave', tone: 'amber' },
  'cpp':                        { kind: 'wave', tone: 'amber' },
  'prx':                        { kind: 'ucurve', tone: 'amber' },
  'cppopt':                     { kind: 'ucurve', tone: 'amber' },
  'orx':                        { kind: 'ucurve', tone: 'teal' },
  'onsd':                       { kind: 'adjunct', tone: 'amber' },
  'non-invasive-icp':           { kind: 'wave', tone: 'green' },
  'fontanelle-us':              { kind: 'pedshead', tone: 'blue' },
  'brain-temp':                 { kind: 'energy', tone: 'red' },
  'pediatric-stroke-monitoring':{ kind: 'stroke', tone: 'amber' },
};

export function thumbForModality(m: Pick<ModalityMeta, 'slug' | 'labels'>): ThumbSpec {
  const fallback = m.labels ? TYPE_TO_THUMB[m.labels.type] : { kind: 'pulse' as const, tone: 'neutral' as const };
  const override = MODALITY_OVERRIDES[m.slug];
  return {
    kind: override?.kind ?? fallback.kind,
    tone: override?.tone ?? fallback.tone,
  };
}

// ── Foundations ───────────────────────────────────────────────────────────
const FOUNDATION_THUMBS: Record<string, ThumbSpec> = {
  'autoregulation':            { kind: 'plateau',     tone: 'teal' },
  'co2-o2-reactivity':         { kind: 'co2-curve',   tone: 'amber' },
  'cerebral-metabolism':       { kind: 'energy',      tone: 'purple' },
  'monro-kellie':              { kind: 'skull',       tone: 'amber' },
  'marmarou-pv-curve':         { kind: 'pvcurve',     tone: 'amber' },
  'astrup-cascade':            { kind: 'cascade',     tone: 'red' },
  'spreading-depolarizations': { kind: 'propagation', tone: 'purple' },
  'blood-brain-barrier':       { kind: 'barrier',     tone: 'blue' },
  'pediatric-physiology':      { kind: 'pedshead',    tone: 'blue' },
};

export function thumbForFoundation(slug: string): ThumbSpec {
  return FOUNDATION_THUMBS[slug] ?? { kind: 'pulse', tone: 'teal' };
}

// ── Integration scenarios ─────────────────────────────────────────────────
const INTEGRATION_THUMBS: Record<string, ThumbSpec> = {
  'prx-vs-orx-discordance':       { kind: 'discordance',  tone: 'amber' },
  'tcd-vs-icp-vasospasm':         { kind: 'flow',         tone: 'amber' },
  'eeg-tcd-non-convulsive':       { kind: 'seizure',      tone: 'purple' },
  'cppopt-targeting':             { kind: 'ucurve',       tone: 'amber' },
  'osmotherapy-icp-nirs':         { kind: 'osmotherapy',  tone: 'teal' },
  'mnm-on-ecmo':                  { kind: 'ecmo',         tone: 'teal' },
  'brain-death-mnm':              { kind: 'braindeath',   tone: 'neutral' },
  'discordance-triage':           { kind: 'discordance',  tone: 'amber' },
  'pbto2-cpp-titration':          { kind: 'molecule',     tone: 'amber' },
  'mnm-in-the-newborn':           { kind: 'newborn',      tone: 'blue' },
  'dka-cerebral-edema':           { kind: 'edema',        tone: 'amber' },
  'refractory-status-epilepticus':{ kind: 'seizure',      tone: 'purple' },
  'resource-limited-bedside':     { kind: 'pulse',        tone: 'green' },
  'pediatric-stroke-ais':         { kind: 'stroke',       tone: 'amber' },
  'meningitis-encephalitis':      { kind: 'meningitis',   tone: 'red' },
  'wlst-organ-donation':          { kind: 'family',       tone: 'neutral' },
  'family-communication-mnm':     { kind: 'family',       tone: 'teal' },
  'inborn-errors-encephalopathy': { kind: 'metabolicicu', tone: 'purple' },
};

export function thumbForIntegration(slug: string): ThumbSpec {
  return INTEGRATION_THUMBS[slug] ?? { kind: 'discordance', tone: 'amber' };
}
