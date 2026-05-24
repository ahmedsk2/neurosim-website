export interface IntegrationCase {
  slug: string;
  title: string;
  premise: string;
  modalities: string[];
}

export const INTEGRATION_CASES: IntegrationCase[] = [
  {
    slug: 'prx-vs-orx-discordance',
    title: 'PRx vs ORx discordance in TBI',
    premise: 'TBI patient: PRx says intact, ORx says impaired. Why?',
    modalities: ['prx', 'orx', 'nirs'],
  },
  {
    slug: 'tcd-vs-icp-vasospasm',
    title: 'TCD vs ICP, pediatric SAH day 6',
    premise: 'SAH child day 6: ICP normal, TCD velocity climbing. What now?',
    modalities: ['tcd', 'icp'],
  },
  {
    slug: 'eeg-tcd-non-convulsive',
    title: 'aEEG narrowing + TCD systolic peaks',
    premise: 'Sedated TBI: aEEG narrowing + TCD systolic peaks, what is happening?',
    modalities: ['eeg', 'aeeg', 'tcd'],
  },
  {
    slug: 'cppopt-targeting',
    title: 'A 4-hour CPPopt loop, COGiTATE-style',
    premise: 'Walk through the 4-hour CPPopt computation and how to act on the orange band.',
    modalities: ['cppopt', 'prx', 'cpp'],
  },
  {
    slug: 'osmotherapy-icp-nirs',
    title: 'HTS bolus, ICP falls, watch the NIRS',
    premise: 'Hypertonic saline bolus: ICP falls, but does the NIRS over- or under-shoot?',
    modalities: ['icp', 'nirs', 'cpp'],
  },
  {
    slug: 'mnm-on-ecmo',
    title: 'MNM on VA-ECMO',
    premise: 'VA-ECMO patient: PRx unreliable; what do you trust?',
    modalities: ['nirs', 'eeg', 'pupillometry', 'tcd'],
  },
  {
    slug: 'brain-death-mnm',
    title: 'MNM contributions to brain-death evaluation',
    premise: 'Use of TCD, evoked potentials, and pupillometry alongside the clinical exam.',
    modalities: ['tcd', 'evoked-potentials', 'pupillometry', 'clinical-exam'],
  },
  {
    slug: 'discordance-triage',
    title: 'When monitor X disagrees with monitor Y',
    premise: 'A bedside flowchart for the most common discordances and what to check first.',
    modalities: ['icp', 'prx', 'tcd', 'nirs', 'eeg'],
  },
  {
    slug: 'pbto2-cpp-titration',
    title: 'BOOST-style PbtO₂-targeted CPP and FiO₂',
    premise: 'PbtO₂ < 18 mmHg, walk the CPP/FiO₂ titration tree.',
    modalities: ['pbto2', 'cpp', 'icp'],
  },
  {
    slug: 'mnm-in-the-newborn',
    title: 'HIE in a 2-day-old: aEEG, NIRS, pupillometry',
    premise: 'Cooling protocol day 2: integrate aEEG continuity, NIRS rSO₂, and pupillometry.',
    modalities: ['aeeg', 'nirs', 'pupillometry'],
  },
  {
    slug: 'dka-cerebral-edema',
    title: 'DKA cerebral oedema, Asher, 9y',
    premise: 'New DKA, severe acidosis. Hour 4 of fluids: GCS drops, irritable, headache. What is your monitoring plan?',
    modalities: ['clinical-exam', 'pupillometry', 'onsd', 'nirs'],
  },
  {
    slug: 'refractory-status-epilepticus',
    title: 'Refractory status epilepticus, Noah, 5y',
    premise: 'Convulsive SE → refractory → super-refractory. The cEEG-guided sedation pathway, with multimodal sentinels.',
    modalities: ['eeg', 'aeeg', 'pupillometry', 'nirs'],
  },
  {
    slug: 'resource-limited-bedside',
    title: "When the kit isn't there, Amani, 3y",
    premise: 'PICU at a regional hospital: ICP probe not available, no continuous EEG. What you can still do, and how.',
    modalities: ['clinical-exam', 'pupillometry', 'onsd', 'nirs', 'tcd'],
  },
  {
    slug: 'pediatric-stroke-ais',
    title: 'Pediatric AIS, Maya, 8y',
    premise: 'Sudden hemiparesis at school. Door-to-needle in the pediatric ED, hyperacute monitoring, and the role of NIRS / TCD / cEEG.',
    modalities: ['clinical-exam', 'tcd', 'nirs', 'eeg', 'pupillometry'],
  },
  {
    slug: 'meningitis-encephalitis',
    title: 'Bacterial meningitis with raised ICP, Idris, 4y',
    premise: 'Pediatric pneumococcal meningitis, day 2: GCS falling, irritability, suspected raised ICP. The neuromonitoring response.',
    modalities: ['clinical-exam', 'pupillometry', 'onsd', 'icp', 'nirs', 'eeg'],
  },
  {
    slug: 'wlst-organ-donation',
    title: 'WLST and DCD pathway, Aliyah, 13y',
    premise: 'After brain-death determination cannot be completed (residual cranial-nerve reflex), the family considers DCD. The role of MNM in supporting the conversation and the protocol.',
    modalities: ['clinical-exam', 'pupillometry', 'tcd', 'evoked-potentials'],
  },
  {
    slug: 'family-communication-mnm',
    title: 'Translating MNM for families, three conversations',
    premise: 'Three real conversations: explaining a "PRx +0.32 trend" to a parent, communicating prognostic uncertainty in HIE, and the post-arrest "what does this number mean for my child" question.',
    modalities: ['clinical-exam'],
  },
  {
    slug: 'inborn-errors-encephalopathy',
    title: 'Mitochondrial encephalopathy, Rafa, 18mo',
    premise: 'Acute encephalopathy in a child with known POLG mutation. Why microdialysis L/P thresholds, MRI patterns, and clinical exam diverge from the textbook TBI playbook.',
    modalities: ['microdialysis', 'eeg', 'clinical-exam', 'nirs'],
  },
];

export function getCase(slug: string) {
  return INTEGRATION_CASES.find((c) => c.slug === slug);
}
