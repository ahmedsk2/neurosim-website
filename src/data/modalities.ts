/**
 * Modality registry, drives the /modalities listing, sidebar nav,
 * and "Combine with…" cross-links across the site.
 */

import type { EvidenceGrade } from './references';

export type ModalityDomain =
  | 'clinical'
  | 'invasive-pressure'
  | 'derived'
  | 'non-invasive'
  | 'invasive-metabolic'
  | 'non-invasive-icp'
  | 'adjunct'
  | 'non-invasive-electrical'
  | 'invasive-flow'
  | 'invasive-electrical';

export type ModalityUsage = 'bedside' | 'research' | 'both';
export type ModalityPopulation = 'pediatric' | 'adult' | 'both';
export type ModalityInvasiveness = 'non-invasive' | 'minimally-invasive' | 'invasive';
export type ModalityValidation =
  | 'validated'
  | 'validated-adult-only'
  | 'emerging'
  | 'investigational';
/**
 * What kind of signal/system this modality is. Independent of invasiveness,
 * lets you filter "all electrical monitors" across non-invasive (EEG, BAER)
 * and invasive (ECoG) variants.
 */
export type ModalityType =
  | 'clinical'
  | 'pressure'
  | 'flow'
  | 'oxygenation'
  | 'electrical'
  | 'metabolic'
  | 'reactivity'
  | 'adjunct';

export interface ModalityLabels {
  usage: ModalityUsage;
  population: ModalityPopulation;
  invasiveness: ModalityInvasiveness;
  validation: ModalityValidation;
  type: ModalityType;
}

export interface ModalityMeta {
  slug: string;
  title: string;
  short: string;
  summary: string;
  domain: ModalityDomain;
  primaryWidgets: string[];
  prereqs: string[];
  relatedFoundations: string[];
  labels?: ModalityLabels;
  evidenceGrade?: EvidenceGrade;
}

export const MODALITIES: ModalityMeta[] = [
  {
    slug: 'clinical-exam',
    title: 'Clinical exam, GCS, FOUR score',
    short: 'Clinical exam',
    summary:
      'The neurological exam, Glasgow Coma Scale, FOUR score, and pediatric adaptations remain the foundation under every monitor.',
    domain: 'clinical',
    primaryWidgets: ['GCSChart'],
    prereqs: [],
    relatedFoundations: ['pediatric-physiology'],
    labels: { usage: 'bedside', population: 'both', invasiveness: 'non-invasive', validation: 'validated', type: 'clinical' },
    evidenceGrade: 'A',
  },
  {
    slug: 'icp',
    title: 'Intracranial pressure monitoring',
    short: 'ICP',
    summary:
      'Direct intraparenchymal or intraventricular pressure measurement, the bedrock of neurocritical care.',
    domain: 'invasive-pressure',
    primaryWidgets: ['ICPWaveformTrainer'],
    prereqs: [],
    relatedFoundations: ['monro-kellie', 'marmarou-pv-curve'],
    labels: { usage: 'bedside', population: 'both', invasiveness: 'invasive', validation: 'validated', type: 'pressure' },
    evidenceGrade: 'B',
  },
  {
    slug: 'rap',
    title: 'Compensatory reserve (RAP)',
    short: 'RAP',
    summary:
      'Correlation between ICP pulse amplitude and mean ICP, a window onto the compliance state of the cranium.',
    domain: 'derived',
    primaryWidgets: ['RAPDemo'],
    prereqs: ['icp'],
    relatedFoundations: ['marmarou-pv-curve'],
    labels: { usage: 'both', population: 'both', invasiveness: 'invasive', validation: 'emerging', type: 'pressure' },
    evidenceGrade: 'C',
  },
  {
    slug: 'cpp',
    title: 'Cerebral perfusion pressure',
    short: 'CPP',
    summary:
      'CPP = MAP − ICP. Same number reachable by very different paths; the path matters.',
    domain: 'derived',
    primaryWidgets: ['CPPTriangle'],
    prereqs: ['icp'],
    relatedFoundations: ['autoregulation'],
    labels: { usage: 'bedside', population: 'both', invasiveness: 'invasive', validation: 'validated', type: 'pressure' },
    evidenceGrade: 'B',
  },
  {
    slug: 'prx',
    title: 'Pressure reactivity index (PRx)',
    short: 'PRx',
    summary:
      'Moving Pearson correlation between mean arterial pressure and ICP, the most established autoregulation index at the bedside.',
    domain: 'derived',
    primaryWidgets: ['PRxCalculator'],
    prereqs: ['icp', 'cpp'],
    relatedFoundations: ['autoregulation'],
    labels: { usage: 'both', population: 'both', invasiveness: 'invasive', validation: 'emerging', type: 'reactivity' },
    evidenceGrade: 'C',
  },
  {
    slug: 'mx',
    title: 'Mean velocity index (Mx)',
    short: 'Mx',
    summary:
      'TCD-based reactivity: the same correlation idea as PRx, but using cerebral flow velocity instead of ICP. Useful when no ICP probe is in.',
    domain: 'derived',
    primaryWidgets: ['MxCalculator'],
    prereqs: ['tcd'],
    relatedFoundations: ['autoregulation'],
    labels: { usage: 'both', population: 'both', invasiveness: 'non-invasive', validation: 'emerging', type: 'reactivity' },
    evidenceGrade: 'C',
  },
  {
    slug: 'orx',
    title: 'Oxygen reactivity index (ORx)',
    short: 'ORx',
    summary:
      'NIRS-based reactivity: correlation between MAP and rSO₂. Non-invasive surrogate for autoregulation status.',
    domain: 'derived',
    primaryWidgets: ['ORxCalculator'],
    prereqs: ['nirs'],
    relatedFoundations: ['autoregulation'],
    labels: { usage: 'research', population: 'both', invasiveness: 'non-invasive', validation: 'investigational', type: 'reactivity' },
    evidenceGrade: 'C',
  },
  {
    slug: 'cppopt',
    title: 'Optimal CPP (CPPopt)',
    short: 'CPPopt',
    summary:
      'The CPP at which autoregulation works best, the bottom of the U-shaped PRx vs CPP curve over the past 4 hours.',
    domain: 'derived',
    primaryWidgets: ['CPPoptUCurve'],
    prereqs: ['prx', 'cpp'],
    relatedFoundations: ['autoregulation'],
    labels: { usage: 'both', population: 'both', invasiveness: 'invasive', validation: 'emerging', type: 'reactivity' },
    evidenceGrade: 'A',
  },
  {
    slug: 'tcd',
    title: 'Transcranial Doppler / TCCD',
    short: 'TCD',
    summary:
      'Insonation of the basal cerebral arteries to produce velocity waveforms, non-invasive flow surrogates and pulsatility.',
    domain: 'non-invasive',
    primaryWidgets: ['TCDWaveformExplorer', 'LindegaardCalculator'],
    prereqs: [],
    relatedFoundations: ['autoregulation', 'co2-o2-reactivity'],
    labels: { usage: 'bedside', population: 'both', invasiveness: 'non-invasive', validation: 'validated', type: 'flow' },
    evidenceGrade: 'A',
  },
  {
    slug: 'nirs',
    title: 'Near-infrared spectroscopy',
    short: 'NIRS',
    summary:
      'Cerebral oxygenation by light: the modified Beer-Lambert law gives regional oxygen saturation 2–3 cm below the optode pair.',
    domain: 'non-invasive',
    primaryWidgets: ['NIRSDisplay'],
    prereqs: [],
    relatedFoundations: ['cerebral-metabolism'],
    labels: { usage: 'bedside', population: 'both', invasiveness: 'non-invasive', validation: 'validated', type: 'oxygenation' },
    evidenceGrade: 'B',
  },
  {
    slug: 'eeg',
    title: 'Continuous EEG (cEEG)',
    short: 'cEEG',
    summary:
      'Real-time cortical electrical activity, the only bedside tool that detects non-convulsive seizures.',
    domain: 'non-invasive',
    primaryWidgets: ['EEGPatternLibrary'],
    prereqs: [],
    relatedFoundations: ['astrup-cascade'],
    labels: { usage: 'bedside', population: 'both', invasiveness: 'non-invasive', validation: 'validated', type: 'electrical' },
    evidenceGrade: 'A',
  },
  {
    slug: 'qeeg',
    title: 'Quantitative EEG (qEEG)',
    short: 'qEEG',
    summary:
      'Spectrogram, alpha-delta ratio, suppression index, asymmetry, quantitative summaries of long EEG runs that detect ischemia and DCI before clinicians can.',
    domain: 'non-invasive',
    primaryWidgets: ['qEEGSpectrogram'],
    prereqs: ['eeg'],
    relatedFoundations: ['astrup-cascade'],
    labels: { usage: 'both', population: 'both', invasiveness: 'non-invasive', validation: 'emerging', type: 'electrical' },
    evidenceGrade: 'B',
  },
  {
    slug: 'aeeg',
    title: 'Amplitude-integrated EEG',
    short: 'aEEG',
    summary:
      'A bedside-friendly time-compressed EEG envelope, the workhorse for NICU and PICU encephalopathy assessment.',
    domain: 'non-invasive',
    primaryWidgets: ['aEEGGenerator'],
    prereqs: ['eeg'],
    relatedFoundations: ['astrup-cascade'],
    labels: { usage: 'bedside', population: 'both', invasiveness: 'non-invasive', validation: 'validated', type: 'electrical' },
    evidenceGrade: 'A',
  },
  {
    slug: 'bis',
    title: 'Processed EEG (BIS / SedLine PSI)',
    short: 'BIS / PSI',
    summary:
      'Single-number processed-EEG indices that map to behavioral state under sedation. Useful trend, never a substitute for raw EEG.',
    domain: 'non-invasive',
    primaryWidgets: ['BISDemo'],
    prereqs: [],
    relatedFoundations: [],
    labels: { usage: 'bedside', population: 'both', invasiveness: 'non-invasive', validation: 'validated-adult-only', type: 'electrical' },
    evidenceGrade: 'C',
  },
  {
    slug: 'pupillometry',
    title: 'Quantitative pupillometry (NPi)',
    short: 'NPi',
    summary:
      'An algorithmic, observer-independent pupillary reflex score that detects early herniation hours before clinical signs.',
    domain: 'non-invasive',
    primaryWidgets: ['PupilTrainer'],
    prereqs: [],
    relatedFoundations: [],
    labels: { usage: 'both', population: 'both', invasiveness: 'non-invasive', validation: 'emerging', type: 'adjunct' },
    evidenceGrade: 'B',
  },
  {
    slug: 'pbto2',
    title: 'Brain tissue oxygen (PbtO₂)',
    short: 'PbtO₂',
    summary:
      'A polarographic or fluorescent probe in white matter reports tissue oxygen tension. < 15–20 mmHg = trouble; threshold-driven therapy reduced mortality in BOOST-II.',
    domain: 'invasive-metabolic',
    primaryWidgets: ['PbtO2Demo'],
    prereqs: [],
    relatedFoundations: ['cerebral-metabolism'],
    labels: { usage: 'both', population: 'both', invasiveness: 'invasive', validation: 'emerging', type: 'oxygenation' },
    evidenceGrade: 'C',
  },
  {
    slug: 'microdialysis',
    title: 'Cerebral microdialysis',
    short: 'MD',
    summary:
      'A semipermeable catheter samples interstitial fluid for glucose, lactate, pyruvate, glycerol, glutamate. The L/P ratio classifies metabolic crises.',
    domain: 'invasive-metabolic',
    primaryWidgets: ['MicrodialysisGrid'],
    prereqs: [],
    relatedFoundations: ['cerebral-metabolism'],
    labels: { usage: 'research', population: 'both', invasiveness: 'invasive', validation: 'emerging', type: 'metabolic' },
    evidenceGrade: 'sparse',
  },
  {
    slug: 'sjvo2',
    title: 'Jugular bulb oximetry (SjvO₂)',
    short: 'SjvO₂',
    summary:
      'A retrograde IJ catheter sampling jugular bulb oxygen saturation, global cerebral O₂ extraction by the Fick principle.',
    domain: 'invasive-metabolic',
    primaryWidgets: ['SjvO2Demo'],
    prereqs: [],
    relatedFoundations: ['cerebral-metabolism'],
    labels: { usage: 'research', population: 'adult', invasiveness: 'invasive', validation: 'investigational', type: 'oxygenation' },
    evidenceGrade: 'sparse',
  },
  {
    slug: 'onsd',
    title: 'Optic nerve sheath diameter',
    short: 'ONSD',
    summary:
      'Bedside ultrasound of the optic nerve sheath, a non-invasive window onto raised ICP, especially useful when invasive monitoring is unavailable.',
    domain: 'non-invasive-icp',
    primaryWidgets: ['ONSDDemo'],
    prereqs: [],
    relatedFoundations: ['monro-kellie'],
    labels: { usage: 'both', population: 'both', invasiveness: 'non-invasive', validation: 'emerging', type: 'pressure' },
    evidenceGrade: 'B',
  },
  {
    slug: 'non-invasive-icp',
    title: 'Non-invasive ICP estimators',
    short: 'NI-ICP',
    summary:
      'TCD-derived (Bellner formula, PI), Brain4Care extensometers, tympanic membrane displacement, methods that estimate ICP without a bolt.',
    domain: 'non-invasive-icp',
    primaryWidgets: ['NonInvasiveICPDemo'],
    prereqs: ['tcd'],
    relatedFoundations: ['monro-kellie'],
    labels: { usage: 'both', population: 'both', invasiveness: 'non-invasive', validation: 'emerging', type: 'pressure' },
    evidenceGrade: 'C',
  },
  {
    slug: 'brain-temp',
    title: 'Brain temperature monitoring',
    short: 'Brain T°',
    summary:
      'A thermistor co-located with the ICP bolt. Brain temperature usually exceeds core; the gradient widens with seizure, hyperemia, and mass lesions.',
    domain: 'adjunct',
    primaryWidgets: ['BrainTempDemo'],
    prereqs: [],
    relatedFoundations: ['cerebral-metabolism'],
    labels: { usage: 'both', population: 'both', invasiveness: 'invasive', validation: 'validated', type: 'adjunct' },
    evidenceGrade: 'B',
  },
  {
    slug: 'evoked-potentials',
    title: 'SSEPs and BAERs',
    short: 'SSEP / BAER',
    summary:
      'Median or tibial nerve stimulation generates the cortical N20; auditory clicks generate brainstem waves I–V. Both contribute to coma prognostication.',
    domain: 'non-invasive-electrical',
    primaryWidgets: ['SSEPViewer'],
    prereqs: [],
    relatedFoundations: [],
    labels: { usage: 'both', population: 'both', invasiveness: 'non-invasive', validation: 'validated', type: 'electrical' },
    evidenceGrade: 'C',
  },
  {
    slug: 'direct-cbf',
    title: 'Direct CBF monitoring',
    short: 'Direct CBF',
    summary:
      'Thermal diffusion (Hemedex/Bowman) and laser Doppler probes report real-time regional CBF, research-grade in most centers.',
    domain: 'invasive-flow',
    primaryWidgets: ['ThermalCBFDemo'],
    prereqs: [],
    relatedFoundations: ['autoregulation'],
    labels: { usage: 'research', population: 'adult', invasiveness: 'invasive', validation: 'investigational', type: 'flow' },
    evidenceGrade: 'sparse',
  },
  {
    slug: 'ecog-sd',
    title: 'ECoG and spreading depolarizations',
    short: 'ECoG / SD',
    summary:
      'Subdural strip ECoG detects spreading depolarizations, slow propagating waves of cellular collapse that drive secondary injury.',
    domain: 'invasive-electrical',
    primaryWidgets: ['SDPropagation'],
    prereqs: [],
    relatedFoundations: ['spreading-depolarizations'],
    labels: { usage: 'research', population: 'adult', invasiveness: 'invasive', validation: 'investigational', type: 'electrical' },
    evidenceGrade: 'sparse',
  },
  {
    slug: 'fontanelle-us',
    title: 'Fontanelle ultrasound',
    short: 'Fontanelle US',
    summary:
      'Bedside transfontanellar ultrasound, the most useful non-invasive imaging tool for infants with open fontanelles. Hydrocephalus, IVH, oedema, and indirect ICP estimates.',
    domain: 'non-invasive-icp',
    primaryWidgets: [],
    prereqs: [],
    relatedFoundations: ['monro-kellie', 'pediatric-physiology'],
    labels: { usage: 'bedside', population: 'pediatric', invasiveness: 'non-invasive', validation: 'validated', type: 'pressure' },
    evidenceGrade: 'B',
  },
  {
    slug: 'advanced-nirs',
    title: 'Advanced NIRS, DCS, TR-NIRS, FD-NIRS',
    short: 'Advanced NIRS',
    summary:
      'Diffuse correlation spectroscopy and time/frequency-domain NIRS, research-grade techniques that quantify absolute CBF and tissue oxygenation, increasingly deployed in pediatric NICU and CICU.',
    domain: 'non-invasive',
    primaryWidgets: [],
    prereqs: ['nirs'],
    relatedFoundations: ['cerebral-metabolism', 'autoregulation'],
    labels: { usage: 'research', population: 'both', invasiveness: 'non-invasive', validation: 'emerging', type: 'oxygenation' },
    evidenceGrade: 'C',
  },
  {
    slug: 'pediatric-stroke-monitoring',
    title: 'Pediatric arterial ischaemic stroke, monitoring',
    short: 'Pediatric AIS',
    summary:
      'Childhood AIS / sinovenous thrombosis, diagnosis, hyperacute monitoring, the role of MNM in detecting evolution, and post-thrombolysis surveillance.',
    domain: 'clinical',
    primaryWidgets: [],
    prereqs: ['clinical-exam'],
    relatedFoundations: ['autoregulation', 'astrup-cascade'],
    labels: { usage: 'bedside', population: 'pediatric', invasiveness: 'non-invasive', validation: 'validated', type: 'clinical' },
    evidenceGrade: 'B',
  },
];

/**
 * Symptom-driven entry, maps a clinical presentation to relevant pages.
 * Used by /search and the symptom-search component.
 */
export interface SymptomMap {
  symptom: string;
  modalities: string[];
  scenarios: string[];
  foundations: string[];
}

export const SYMPTOM_MAP: SymptomMap[] = [
  {
    symptom: 'Fixed dilated pupil',
    modalities: ['pupillometry', 'icp', 'clinical-exam', 'onsd'],
    scenarios: ['discordance-triage', 'resource-limited-bedside'],
    foundations: ['monro-kellie'],
  },
  {
    symptom: 'Asymmetric pupils (anisocoria)',
    modalities: ['pupillometry', 'clinical-exam'],
    scenarios: ['resource-limited-bedside'],
    foundations: [],
  },
  {
    symptom: 'Falling GCS',
    modalities: ['clinical-exam', 'pupillometry', 'icp', 'onsd', 'fontanelle-us'],
    scenarios: ['dka-cerebral-edema', 'resource-limited-bedside', 'osmotherapy-icp-nirs'],
    foundations: ['monro-kellie', 'astrup-cascade'],
  },
  {
    symptom: 'Raised ICP (suspected or confirmed)',
    modalities: ['icp', 'cpp', 'prx', 'onsd', 'fontanelle-us', 'non-invasive-icp'],
    scenarios: ['osmotherapy-icp-nirs', 'pbto2-cpp-titration', 'dka-cerebral-edema', 'resource-limited-bedside', 'meningitis-encephalitis'],
    foundations: ['monro-kellie', 'marmarou-pv-curve'],
  },
  {
    symptom: 'New unexplained altered consciousness',
    modalities: ['eeg', 'aeeg', 'clinical-exam', 'pupillometry'],
    scenarios: ['eeg-tcd-non-convulsive', 'refractory-status-epilepticus', 'meningitis-encephalitis'],
    foundations: ['astrup-cascade'],
  },
  {
    symptom: 'Convulsive / non-convulsive status',
    modalities: ['eeg', 'aeeg', 'qeeg'],
    scenarios: ['refractory-status-epilepticus', 'eeg-tcd-non-convulsive'],
    foundations: ['astrup-cascade'],
  },
  {
    symptom: 'New focal neurological deficit',
    modalities: ['clinical-exam', 'tcd', 'nirs'],
    scenarios: ['pediatric-stroke-ais', 'tcd-vs-icp-vasospasm'],
    foundations: ['autoregulation'],
  },
  {
    symptom: 'Suspected vasospasm / DCI',
    modalities: ['tcd', 'qeeg', 'nirs'],
    scenarios: ['tcd-vs-icp-vasospasm'],
    foundations: ['autoregulation'],
  },
  {
    symptom: 'Post-cardiac arrest',
    modalities: ['aeeg', 'eeg', 'pupillometry', 'evoked-potentials', 'nirs'],
    scenarios: ['mnm-on-ecmo', 'mnm-in-the-newborn'],
    foundations: ['cerebral-metabolism', 'astrup-cascade'],
  },
  {
    symptom: 'Severe TBI workup',
    modalities: ['icp', 'prx', 'cpp', 'cppopt', 'nirs', 'pbto2'],
    scenarios: ['cppopt-targeting', 'pbto2-cpp-titration', 'osmotherapy-icp-nirs', 'resource-limited-bedside'],
    foundations: ['monro-kellie', 'autoregulation', 'astrup-cascade'],
  },
  {
    symptom: 'Suspected brain death',
    modalities: ['clinical-exam', 'pupillometry', 'tcd', 'evoked-potentials', 'eeg'],
    scenarios: ['brain-death-mnm', 'wlst-organ-donation'],
    foundations: [],
  },
  {
    symptom: 'NICU / HIE / neonate',
    modalities: ['aeeg', 'nirs', 'pupillometry', 'fontanelle-us'],
    scenarios: ['mnm-in-the-newborn'],
    foundations: ['pediatric-physiology'],
  },
  {
    symptom: 'Discordance between two monitors',
    modalities: ['icp', 'prx', 'tcd', 'nirs', 'eeg'],
    scenarios: ['discordance-triage', 'prx-vs-orx-discordance'],
    foundations: [],
  },
  {
    symptom: 'Encephalitis / meningitis',
    modalities: ['eeg', 'clinical-exam', 'icp', 'onsd'],
    scenarios: ['meningitis-encephalitis'],
    foundations: ['blood-brain-barrier'],
  },
  {
    symptom: 'Inborn error / metabolic encephalopathy',
    modalities: ['microdialysis', 'eeg', 'clinical-exam'],
    scenarios: ['inborn-errors-encephalopathy'],
    foundations: ['cerebral-metabolism'],
  },
];

export function getModality(slug: string): ModalityMeta | undefined {
  return MODALITIES.find((m) => m.slug === slug);
}

export function listModalitiesByDomain(): Record<ModalityDomain, ModalityMeta[]> {
  const out: Record<string, ModalityMeta[]> = {};
  for (const m of MODALITIES) (out[m.domain] ||= []).push(m);
  return out as Record<ModalityDomain, ModalityMeta[]>;
}
