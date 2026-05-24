/**
 * Glossary of MNM terms, used by <Definition term="..." /> tooltips
 * and the /glossary index page.
 */

export interface GlossaryEntry {
  term: string;
  definition: string;
  related?: string[];
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: 'PRx',
    definition:
      'Pressure reactivity index. Moving Pearson correlation between 30 consecutive 10-second epoch averages of arterial blood pressure and intracranial pressure, computed over a 5-minute window. Negative or near-zero values indicate intact pressure autoregulation; values > 0.25 are pressure-passive and prognostically poor.',
    related: ['Mx', 'ORx', 'Autoregulation'],
  },
  {
    term: 'Mx',
    definition:
      'Mean velocity index. Pearson correlation between MAP and TCD mean flow velocity (MFV), same epoch architecture as PRx. Useful when no ICP probe is available.',
    related: ['PRx'],
  },
  {
    term: 'ORx',
    definition:
      'Oxygen reactivity index. Pearson correlation between MAP and NIRS regional oxygen saturation (rSO₂). Non-invasive surrogate for autoregulation. Noisier than PRx; complementary in NIRS-only setups.',
    related: ['PRx'],
  },
  {
    term: 'CPPopt',
    definition:
      'Optimal cerebral perfusion pressure. The CPP at which the moving (CPP, PRx) data over the past 4 hours has its minimum on a parabolic fit, the bottom of the U-shaped autoregulation curve.',
    related: ['PRx', 'CPP'],
  },
  {
    term: 'RAP',
    definition:
      'Compensatory reserve index. Moving Pearson correlation between ICP pulse amplitude (AMP) and mean ICP over a 4-minute window. RAP > 0.6 indicates low compensatory reserve; sudden drop toward zero at high ICP is a decompensation signature.',
    related: ['ICP', 'AMP'],
  },
  {
    term: 'AMP',
    definition: 'ICP pulse amplitude, peak-to-trough of the ICP pulsation, scales with intracranial compliance.',
  },
  {
    term: 'MAP',
    definition: 'Mean arterial pressure. The time-averaged systemic arterial pressure; the input to CPP.',
  },
  {
    term: 'ICP',
    definition: 'Intracranial pressure. Pressure inside the cranial vault, measured directly by intraparenchymal or intraventricular probe.',
  },
  {
    term: 'CPP',
    definition: 'Cerebral perfusion pressure. CPP = MAP − ICP. The driving pressure for cerebral blood flow.',
  },
  {
    term: 'NIRS',
    definition: 'Near-infrared spectroscopy. Optical regional cerebral oximetry using the modified Beer-Lambert law. Reports rSO₂.',
  },
  {
    term: 'rSO₂',
    definition: 'Regional cerebral oxygen saturation reported by NIRS. Approximately 70 % venous, 25 % arterial, 5 % capillary in adult cortex.',
  },
  {
    term: 'TCD',
    definition: 'Transcranial Doppler. Insonation of the basal cerebral arteries to record flow velocities (PSV, EDV, MFV) and the pulsatility index.',
  },
  {
    term: 'EEG',
    definition: 'Electroencephalography. Scalp recording of cortical electrical activity; the only bedside tool that can detect non-convulsive seizures.',
  },
  {
    term: 'aEEG',
    definition: 'Amplitude-integrated EEG. A bandpass-filtered, rectified, time-compressed display of EEG envelope used at the bedside in NICU and PICU.',
  },
  {
    term: 'qEEG',
    definition: 'Quantitative EEG. Spectrograms, alpha-delta ratio, suppression burst index, asymmetry, quantitative summaries of long EEG runs.',
  },
  {
    term: 'BIS',
    definition: 'Bispectral Index. Proprietary 0–100 processed-EEG sedation depth marker. SedLine PSI and Narcotrend are alternatives.',
  },
  {
    term: 'NPi',
    definition:
      'Neurological Pupil Index. An algorithmic 0–5 score combining pupil size, constriction velocity, latency, and dilation velocity. < 3 is abnormal.',
  },
  {
    term: 'PbtO₂',
    definition: 'Brain tissue oxygen tension. Direct probe measurement of the partial pressure of oxygen in cerebral white matter. Threshold for concern is 15–20 mmHg.',
  },
  {
    term: 'Microdialysis',
    definition: 'Sampling of cerebral interstitial fluid via a semipermeable catheter. Reports glucose, lactate, pyruvate, glycerol, glutamate.',
  },
  {
    term: 'L/P ratio',
    definition: 'Lactate-pyruvate ratio from microdialysis. > 25 with normal glucose suggests mitochondrial dysfunction; > 40 with low glucose suggests ischemia.',
  },
  {
    term: 'SjvO₂',
    definition: 'Jugular bulb oxygen saturation. Reverse-flow IJ catheter samples blood draining the brain. 50–75 % normal; < 50 % global ischemia, > 75 % hyperemia or low CMRO₂.',
  },
  {
    term: 'ONSD',
    definition: 'Optic nerve sheath diameter. Sonographic measurement 3 mm posterior to the globe. > 5 mm in children > 1 year suggests raised ICP.',
  },
  {
    term: 'Lindegaard ratio',
    definition: 'TCD-derived ratio of MCA mean flow velocity to extracranial ICA velocity. Distinguishes vasospasm (>3) from hyperemia (<3).',
  },
  {
    term: 'PVI',
    definition: 'Pressure-volume index. The volume change required to raise ICP by a factor of 10,Marmarou\'s logarithmic compliance descriptor. ~20 mL adult.',
  },
  {
    term: 'GCS',
    definition: 'Glasgow Coma Scale. Eye (1–4) + verbal (1–5) + motor (1–6) = 3–15. Pediatric verbal scale modified for pre-verbal children.',
  },
  {
    term: 'FOUR score',
    definition: 'Full Outline of UnResponsiveness. Eye, motor, brainstem, respiration, each 0–4 (total 0–16). Better in intubated patients (no verbal component).',
  },
  {
    term: 'Spreading depolarization',
    definition:
      'A slow (mm/min) wave of cellular depolarization across cortex with massive K⁺ release, transient ECoG suppression, and metabolic stress. Common in TBI, SAH, malignant stroke; emerging therapeutic target.',
  },
  {
    term: 'Autoregulation',
    definition:
      'The brain\'s ability to maintain approximately constant cerebral blood flow despite changes in MAP or CPP. Plateau spans roughly MAP 60–150 mmHg in healthy adults; narrower and lower in younger children. Mediated by myogenic, metabolic, and neurogenic mechanisms.',
  },
  {
    term: 'CMRO₂',
    definition: 'Cerebral metabolic rate of oxygen. Drives CBF in normal coupling; rises ~7 % per °C (Q10 = 1.07).',
  },
  {
    term: 'Cushing reflex',
    definition: 'Hypertension + bradycardia + irregular respiration produced by brainstem ischemia at very high ICP, a late, ominous sign.',
  },
];

export function getDefinition(term: string): GlossaryEntry | undefined {
  const norm = term.toLowerCase();
  return GLOSSARY.find((e) => e.term.toLowerCase() === norm);
}
