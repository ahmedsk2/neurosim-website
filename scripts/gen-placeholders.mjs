#!/usr/bin/env node
/**
 * One-shot script to generate placeholder SVGs for the site expansion.
 * Each SVG follows the template documented in
 * claude-code-tasks/06-figures-to-create.md and visually mirrors
 * public/images/tcd/waveform-anatomy.svg.
 *
 *   node scripts/gen-placeholders.mjs
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMG_ROOT = join(ROOT, 'public', 'images');

/**
 * Each entry: [relativePath, title, captionBrief, motif?]
 * motif controls a per-figure schematic flourish under the title:
 *   "curve"     : single curve (default for waveform / time-series)
 *   "bars"      : grouped bar chart (thresholds, ratios)
 *   "panels"    : 2x4 grid of cells (pattern libraries)
 *   "diagram"   : labelled boxes + arrows (anatomy / flow)
 *   "ucurve"    : parabola (PRx, CPPopt)
 */
const FIGURES = [
  // ─── Foundations ─────────────────────────────────────────────────
  ['foundations/autoregulation/myogenic-metabolic-neurogenic.svg',
    'Autoregulation mechanisms by timescale',
    'Three rows: myogenic (5-15 s), metabolic (~30 s), neurogenic (minutes). Schematic vessels constricting / dilating per row.', 'diagram'],

  ['foundations/co2-o2-reactivity/co2-curve.svg',
    'Bedside CO2 reactivity curve',
    'CBF vs PaCO2 from 20-80 mmHg. Slope ~3-4% per mmHg in the linear range.', 'curve'],
  ['foundations/co2-o2-reactivity/o2-reactivity-low-pao2.svg',
    'O2 reactivity, hyperbolic at low PaO2',
    'Vasodilation kicks in below PaO2 50 mmHg.', 'curve'],

  ['foundations/cerebral-metabolism/cmro2-temperature.svg',
    'CMRO2 vs brain temperature',
    '6-7% reduction per degree. Therapeutic window highlighted at 33-34 C.', 'curve'],

  ['foundations/spreading-depolarizations/sd-propagation.svg',
    'ECoG spreading depolarisation',
    'Large negative DC shift, high-frequency suppression, 2-5 mm/min propagation.', 'curve'],

  ['foundations/pediatric-physiology/peds-mfv-and-icp-age.svg',
    'Pediatric MFV and ICP across age',
    'Two-panel: MFV vs age (peak 4-6 y); ICP thresholds across age bands.', 'bars'],

  // ─── Tier 1 modalities (Group A) ─────────────────────────────────
  ['icp/lundberg-waves.svg',
    'Lundberg A, B, C waves',
    'A-waves (plateau >20 mmHg, >5 min); B-waves (rhythmic 0.5-2/min); C-waves (4-8/min, low-amplitude).', 'curve'],
  ['icp/age-band-icp-thresholds.svg',
    'ICP treatment thresholds by age',
    'Neonate 10 mmHg, infant 15, child 20, adolescent / adult 22 mmHg.', 'bars'],

  ['prx/prx-time-series.svg',
    'PRx, MAP, ICP time series',
    'Three rows over 4 hours showing slow-wave correlation; PRx state colour-coded.', 'curve'],
  ['prx/prx-vs-cpp-ucurve.svg',
    'PRx vs CPP U-curve',
    'Classic U-curve with CPPopt at the bottom; LLA and ULA where PRx crosses 0.25.', 'ucurve'],
  ['prx/prx-vs-mx-vs-orx.svg',
    'PRx vs Mx vs ORx, same window',
    'Three panels of the same patient; discordance highlighted.', 'panels'],

  ['cppopt/cppopt-workflow.svg',
    'CPPopt five-step workflow',
    'Continuous ABP / ICP → 10-s means → 5-min PRx → CPP bins → parabola → vertex = CPPopt.', 'diagram'],
  ['cppopt/cppopt-dose-response.svg',
    'CPPopt dose-response (Aries 2012 style)',
    'Time below CPPopt vs neurological outcome.', 'curve'],

  ['nirs/rso2-trend-shock.svg',
    'rSO2 in septic shock',
    'Falling rSO2 with fluid bolus recovery; MAP overlay.', 'curve'],
  ['nirs/orx-vs-prx-discordance.svg',
    'ORx vs PRx discordance',
    'Side-by-side trends; mechanisms (sepsis, anaemia, microvascular shunting).', 'panels'],

  ['eeg/pattern-library.svg',
    'EEG pattern library (8 panels)',
    'Normal background, burst suppression, GPDs, LPDs, NCSE, isoelectric, alpha coma, theta coma.', 'panels'],
  ['eeg/aDR-trend.svg',
    'Alpha-delta ratio trend pre-DCI',
    'aDR falling 30% over 6 h before clinical DCI signs in SAH.', 'curve'],

  ['pbto2/pbto2-cpp-titration.svg',
    'PbtO2 bedside titration tree',
    'Low PbtO2 → check MAP, FiO2, Hb, CPP, temperature, sedation, sepsis.', 'diagram'],
  ['pbto2/pbto2-trend-events.svg',
    'PbtO2 12-hour trend with events',
    'Annotated events: suction, CPP drop, fever, recovery.', 'curve'],

  ['onsd/onsd-by-age.svg',
    'ONSD cutoffs by age',
    '<1 y ~4.0 mm; 1-15 y ~4.5 mm; adult 5.0-5.7 mm.', 'bars'],
  ['onsd/niicp-stack.svg',
    'Non-invasive ICP estimators',
    'TCD-PI, ONSD, B4C, tympanic. Sensitivity / specificity table.', 'panels'],

  // ─── Tier 2 modalities (Group B) ─────────────────────────────────
  ['clinical-exam/gcs-vs-four.svg',
    'GCS vs FOUR score',
    'GCS (E/V/M) and FOUR (eye, motor, brainstem, respiration); pediatric variants.', 'diagram'],
  ['cpp/triangle-equation.svg',
    'CPP triangle: MAP, ICP, CPP',
    'CPP = MAP − ICP visualised as a triangle; same CPP reachable from many MAP/ICP pairs.', 'diagram'],
  ['orx/orx-trend.svg',
    'ORx U-curve trend, septic neonate',
    'Impaired autoregulation; ORx > 0.3.', 'ucurve'],
  ['rap/rap-vs-icp.svg',
    'RAP plotted against mean ICP',
    'Good compliance (RAP ~0), poor compliance (~+1), exhausted (RAP falls toward 0 at very high ICP).', 'curve'],
  ['aeeg/aeeg-patterns.svg',
    'aEEG five canonical patterns',
    'Continuous normal, discontinuous normal, burst suppression, low voltage, flat.', 'panels'],
  ['qeeg/qeeg-spectrogram.svg',
    'qEEG spectrogram and aDR drop pre-DCI',
    'Spectrogram with alpha-delta ratio drop; suppression burst index.', 'curve'],
  ['bis/bis-vs-sedation.svg',
    'BIS values across sedation depth',
    'Awake 90-100; light 70-80; surgical 40-60; deep <40; isoelectric ~0.', 'bars'],
  ['pupillometry/npi-vs-clinical.svg',
    'NPI scale and distributions',
    'NPI 0-5; normal vs comatose distributions; pupillometer probe inset.', 'bars'],
  ['microdialysis/lpr-grid.svg',
    'Microdialysis L/P ratio grid',
    'L/P low / moderate / high zones; glucose, glutamate columns.', 'panels'],
  ['sjvo2/jugular-anatomy.svg',
    'Jugular bulb anatomy and SjvO2',
    'Retrograde IJ catheter; SjvO2 sampling; Fick principle.', 'diagram'],
  ['non-invasive-icp/methods-comparison.svg',
    'Non-invasive ICP methods comparison',
    'TCD-PI, ONSD, B4C, tympanic. Sensitivity / specificity, age limits, ease.', 'panels'],
  ['brain-temp/brain-core-gradient.svg',
    'Brain-core temperature gradient',
    '0.5-2 C higher in brain; gradient widens with injury.', 'curve'],
  ['direct-cbf/thermal-diffusion.svg',
    'Thermal-diffusion CBF probe',
    'Hemedex / Bowman schematic; measurement principle.', 'diagram'],
  ['evoked-potentials/ssep-baer-pathway.svg',
    'SSEP and BAER pathways',
    'Cortical and subcortical SSEP; BAER waves I-V; lesion localisation.', 'diagram'],
  ['ecog-sd/cosbid-electrode.svg',
    'COSBID subdural ECoG strip',
    'Strip placement during surgery; channels labelled; SD waves on trace.', 'diagram'],
  ['fontanelle-us/transfontanellar.svg',
    'Through-fontanelle ultrasound',
    'Coronal and sagittal sweeps; ventricle size, IVH, PVL landmarks.', 'diagram'],
  ['advanced-nirs/dcs-trnirs.svg',
    'DCS and TR-NIRS',
    'Diffuse correlation spectroscopy and time-resolved NIRS schematics; absolute CBF and oxygenation.', 'diagram'],
  ['pediatric-stroke-monitoring/aha-pathway.svg',
    'Pediatric AIS AHA pathway',
    'Door-to-imaging, IV-tPA / thrombectomy candidacy, post-recanalisation monitoring.', 'diagram'],

  // ─── Integration scenarios ───────────────────────────────────────
  ['integration/tcd-vs-icp-vasospasm/timeline.svg',
    'SAH days 0-14 timeline',
    'ICP, TCD MFV, Lindegaard ratio, neuro exam; spasm window marked.', 'curve'],
  ['integration/cppopt-targeting/dose-response.svg',
    'CPPopt dose-response curve',
    'Time outside CPPopt vs neurological outcome.', 'curve'],
  ['integration/osmotherapy-icp-nirs/triple-trend.svg',
    'Osmotherapy triple-trend',
    'ICP falling; rSO2 transiently rising then settling; serum Na rising after HTS bolus.', 'curve'],
  ['integration/mnm-on-ecmo/embolus-detection.svg',
    'TCD HITS during ECMO',
    'High-intensity transient signals; embolus count vs day; correlation with neurological events.', 'bars'],
  ['integration/brain-death-mnm/ancillary-tree.svg',
    'Brain-death ancillary testing tree',
    'When TCD vs CTA vs EEG vs SSEP are needed; jurisdictional differences.', 'diagram'],
  ['integration/dka-cerebral-edema/timeline.svg',
    'DKA cerebral oedema timeline',
    'Rehydration start, PI rise, pupillary asymmetry, herniation risk window.', 'curve'],
  ['integration/meningitis-encephalitis/icp-pathway.svg',
    'Meningitis raised-ICP pathway',
    'Bacterial meningitis with raised ICP / hydrocephalus / vasculitic vasospasm.', 'diagram'],
  ['integration/pbto2-cpp-titration/boost2-3.svg',
    'BOOST-II and BOOST-III summary',
    'PbtO2-guided vs ICP-only CPP management trial results.', 'bars'],
  ['integration/refractory-status-epilepticus/treatment-ladder.svg',
    'RSE treatment ladder',
    'Benzo → second-line → continuous infusion (midaz, pentobarb, ketamine); aEEG / cEEG endpoints.', 'diagram'],
  ['integration/inborn-errors-encephalopathy/leigh-mri.svg',
    'Leigh syndrome MRI schematic',
    'Bilateral basal ganglia and brainstem T2 hyperintensities.', 'diagram'],
  ['integration/resource-limited-bedside/three-modality-bundle.svg',
    'Resource-limited monitoring bundle',
    'Clinical exam + ONSD + fontanelle US + handheld TCD.', 'diagram'],
  ['integration/family-communication-mnm/conversation-templates.svg',
    'Family conversation templates',
    'Prognosis after HIE; brain-death disclosure; WLST. Say-this / avoid-this columns.', 'panels'],
  ['integration/wlst-organ-donation/dcd-pathway.svg',
    'DCD pathway operational diagram',
    'Pre-extubation, controlled WLST, asystole criteria, retrieval window.', 'diagram'],
  ['integration/prx-vs-orx-discordance/mechanism.svg',
    'PRx vs ORx discordance mechanism',
    'Macrovascular vs tissue-level autoregulation; sepsis, anaemia.', 'diagram'],
  ['integration/discordance-triage/flowchart.svg',
    'Multimodal discordance triage',
    'What to check when ICP, NIRS, TCD, EEG disagree.', 'diagram'],
  ['integration/pediatric-stroke-ais/maya-case.svg',
    'Maya, 8 y AIS case timeline',
    'Stroke onset, imaging, intervention decision, post-recanalisation monitoring.', 'curve'],
];

const STYLE = `<style>
    .bg { fill: #081224; }
    .grid { stroke: #1f2a44; stroke-width: 0.5; }
    .axis { stroke: #475569; stroke-width: 1; }
    .title { fill: #f1f5f9; font: 600 14px sans-serif; }
    .sub { fill: #94a3b8; font: 11px sans-serif; }
    .label { fill: #e2e8f0; font: 12px sans-serif; }
    .small { fill: #94a3b8; font: 10px sans-serif; }
    .placeholder { fill: #64748b; font: italic 10px sans-serif; }
    .curve { stroke: #5eead4; stroke-width: 2; fill: none; }
    .curveFill { fill: rgba(94, 234, 212, 0.15); stroke: #5eead4; stroke-width: 1.5; }
    .accent { fill: #fbbf24; stroke: #fbbf24; }
    .danger { fill: #f87171; stroke: #f87171; }
    .ok { fill: #22c55e; stroke: #22c55e; }
    .purple { fill: #c084fc; stroke: #c084fc; }
    .box { fill: #0f1c34; stroke: #334155; stroke-width: 1; }
    .arrow { stroke: #94a3b8; stroke-width: 1; fill: none; marker-end: url(#arrow); }
    .dash { stroke-dasharray: 4 3; }
  </style>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 Z" fill="#94a3b8"/>
    </marker>
  </defs>`;

function gridAndAxes() {
  return `<g class="grid">
    <line x1="60" y1="90" x2="780" y2="90"/>
    <line x1="60" y1="160" x2="780" y2="160"/>
    <line x1="60" y1="230" x2="780" y2="230"/>
    <line x1="60" y1="300" x2="780" y2="300"/>
  </g>
  <line class="axis" x1="60" y1="60" x2="60" y2="310"/>
  <line class="axis" x1="60" y1="310" x2="780" y2="310"/>`;
}

function curveMotif() {
  return `${gridAndAxes()}
  <path class="curveFill" d="M60 280 Q120 210 200 180 Q280 160 360 140 Q440 130 520 145 Q600 170 680 220 Q740 260 780 280 L780 310 L60 310 Z"/>
  <path class="curve" d="M60 280 Q120 210 200 180 Q280 160 360 140 Q440 130 520 145 Q600 170 680 220 Q740 260 780 280"/>
  <circle class="accent" cx="360" cy="140" r="4"/>
  <text class="small" x="370" y="135">peak / inflection</text>`;
}

function ucurveMotif() {
  return `${gridAndAxes()}
  <path class="curve" d="M80 110 Q220 320 420 320 Q620 320 760 110"/>
  <circle class="accent" cx="420" cy="320" r="5"/>
  <text class="small" x="430" y="316">vertex (optimum)</text>
  <line class="axis dash" x1="280" y1="60" x2="280" y2="310"/>
  <line class="axis dash" x1="560" y1="60" x2="560" y2="310"/>
  <text class="small" x="240" y="80">LLA</text>
  <text class="small" x="540" y="80">ULA</text>`;
}

function barsMotif() {
  const labels = ['neonate', 'infant', 'child', 'adolescent', 'adult'];
  const heights = [60, 110, 160, 200, 220];
  let g = `${gridAndAxes()}`;
  labels.forEach((l, i) => {
    const x = 110 + i * 130;
    const h = heights[i];
    g += `<rect class="curveFill" x="${x}" y="${310 - h}" width="80" height="${h}"/>`;
    g += `<text class="small" x="${x + 40}" y="${325}" text-anchor="middle">${l}</text>`;
    g += `<text class="label" x="${x + 40}" y="${310 - h - 6}" text-anchor="middle">${h / 10 + 5}</text>`;
  });
  return g;
}

function panelsMotif() {
  let g = '';
  const cols = 4;
  const rows = 2;
  const cellW = 175;
  const cellH = 115;
  const x0 = 60;
  const y0 = 60;
  let i = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = x0 + c * cellW;
      const y = y0 + r * cellH;
      g += `<rect class="box" x="${x + 4}" y="${y + 4}" width="${cellW - 8}" height="${cellH - 8}"/>`;
      g += `<text class="small" x="${x + 14}" y="${y + 22}">Panel ${i}</text>`;
      // sample curve inside each panel
      const baseY = y + cellH / 2 + 10;
      const phase = i * 0.6;
      const d = [`M${x + 14} ${baseY}`];
      for (let t = 0; t < 140; t += 6) {
        const yy = baseY - Math.sin(t / 14 + phase) * 18;
        d.push(`L${x + 14 + t} ${yy}`);
      }
      g += `<path class="curve" d="${d.join(' ')}"/>`;
      i++;
    }
  }
  return g;
}

function diagramMotif() {
  return `<g>
    <rect class="box" x="80" y="100" width="180" height="60" rx="8"/>
    <text class="label" x="170" y="135" text-anchor="middle">Input / measurement</text>
    <rect class="box" x="320" y="100" width="160" height="60" rx="8"/>
    <text class="label" x="400" y="135" text-anchor="middle">Mechanism</text>
    <rect class="box" x="540" y="100" width="200" height="60" rx="8"/>
    <text class="label" x="640" y="135" text-anchor="middle">Bedside output</text>
    <path class="arrow" d="M260 130 L320 130"/>
    <path class="arrow" d="M480 130 L540 130"/>
    <rect class="box" x="80" y="210" width="180" height="60" rx="8"/>
    <text class="label" x="170" y="245" text-anchor="middle">Pediatric variant</text>
    <rect class="box" x="320" y="210" width="160" height="60" rx="8"/>
    <text class="label" x="400" y="245" text-anchor="middle">Pitfall</text>
    <rect class="box" x="540" y="210" width="200" height="60" rx="8"/>
    <text class="label" x="640" y="245" text-anchor="middle">Action / threshold</text>
    <path class="arrow" d="M170 160 L170 210"/>
    <path class="arrow" d="M400 160 L400 210"/>
    <path class="arrow" d="M640 160 L640 210"/>
  </g>`;
}

function motifContent(motif) {
  switch (motif) {
    case 'ucurve': return ucurveMotif();
    case 'bars': return barsMotif();
    case 'panels': return panelsMotif();
    case 'diagram': return diagramMotif();
    case 'curve':
    default: return curveMotif();
  }
}

function svgFor(title, caption, motif, relpath) {
  const placeholder = `PLACEHOLDER, TODO: polish (${relpath.replace(/\\/g, '/')}).`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" role="img" aria-label="${title.replace(/"/g, '&quot;')}">
  ${STYLE}
  <rect class="bg" width="800" height="380"/>
  <text class="title" x="20" y="28">${title}, placeholder schematic</text>
  <text class="sub" x="20" y="48">${caption.replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, 130)}</text>
  ${motifContent(motif)}
  <text class="placeholder" x="20" y="370">${placeholder}</text>
</svg>
`;
}

let created = 0;
let skipped = 0;
for (const [rel, title, caption, motif] of FIGURES) {
  const full = join(IMG_ROOT, rel);
  mkdirSync(dirname(full), { recursive: true });
  if (existsSync(full)) {
    skipped++;
    continue;
  }
  writeFileSync(full, svgFor(title, caption, motif || 'curve', rel), 'utf8');
  created++;
}

console.log(`Placeholder generation complete: ${created} created, ${skipped} already existed (${FIGURES.length} total in manifest).`);
