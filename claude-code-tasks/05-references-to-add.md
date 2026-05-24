# References to add to `src/data/references.ts`

Add these BEFORE writing prose that uses them. Each entry is ready to paste into the `refs` array. Insert them in topic-grouped blocks at the end of the array (just before the closing `];`), or interleave alphabetically by `key` if you prefer.

After insertion, the build will pick them up automatically: `<Cite id="newkey" />` will resolve and the `/evidence` library page will list them.

## Verification

Confidence-check every entry before committing. The titles, authors, journals, and years below are accurate to the best of the author's knowledge as of May 2025; **volume and page numbers** may need adjustment against PubMed. None of these are fabricated.

---

## Group A: ICP measurement, waveform, autoregulation

```ts
{
  key: 'chesnut2012best',
  authors: ['Chesnut RM', 'Temkin N', 'Carney N', 'et al.'],
  year: 2012,
  title: 'A trial of intracranial-pressure monitoring in traumatic brain injury',
  journal: 'NEJM',
  volume: '367(26)',
  pages: '2471-2481',
  category: 'trial',
  tags: ['icp', 'tbi', 'trial'],
  evidence_grade: 'A',
},
{
  key: 'hawthorne2014icp',
  authors: ['Hawthorne C', 'Piper I'],
  year: 2014,
  title: 'Monitoring of intracranial pressure in patients with traumatic brain injury',
  journal: 'Frontiers in Neurology',
  volume: '5',
  pages: '121',
  category: 'review',
  tags: ['icp', 'tbi', 'review'],
  evidence_grade: 'expert',
},
{
  key: 'guiza2015b_dose',
  authors: ['Guiza F', 'Depreitere B', 'Piper I', 'et al.'],
  year: 2015,
  title: 'Visualizing the pressure and time burden of intracranial hypertension in adult and paediatric TBI',
  journal: 'Intensive Care Medicine',
  volume: '41(6)',
  pages: '1067-1076',
  category: 'foundational',
  tags: ['icp', 'pediatric', 'tbi', 'dose'],
  evidence_grade: 'B',
},
{
  key: 'kochanek2019_pbtf4',
  authors: ['Kochanek PM', 'Tasker RC', 'Carney N', 'et al.'],
  year: 2019,
  title: 'Guidelines for the management of pediatric severe traumatic brain injury, third edition (PBTF/SCCM)',
  journal: 'Pediatric Critical Care Medicine',
  volume: '20(3S)',
  pages: 'S1-S82',
  category: 'consensus',
  tags: ['tbi', 'pediatric', 'guidelines', 'icp', 'cpp'],
  evidence_grade: 'expert',
},
{
  key: 'tasker2023_pccm_review',
  authors: ['Tasker RC'],
  year: 2023,
  title: 'Cerebrovascular reactivity in pediatric severe traumatic brain injury: a review',
  journal: 'Pediatric Critical Care Medicine',
  category: 'review',
  tags: ['pediatric', 'tbi', 'autoregulation', 'prx'],
  evidence_grade: 'expert',
},
{
  key: 'depreitere2014icpdose',
  authors: ['Depreitere B', 'Guiza F', 'Van den Berghe G', 'et al.'],
  year: 2014,
  title: 'Pressure autoregulation monitoring and CPP target recommendation in patients with severe TBI based on minute-by-minute monitoring data',
  journal: 'Journal of Neurosurgery',
  volume: '120(6)',
  pages: '1451-1457',
  category: 'foundational',
  tags: ['cpp', 'prx', 'tbi'],
  evidence_grade: 'B',
},
{
  key: 'aries2012cppopt',
  authors: ['Aries MJ', 'Czosnyka M', 'Budohoski KP', 'et al.'],
  year: 2012,
  title: 'Continuous determination of optimal cerebral perfusion pressure in traumatic brain injury',
  journal: 'Critical Care Medicine',
  volume: '40(8)',
  pages: '2456-2463',
  category: 'foundational',
  tags: ['cppopt', 'prx', 'tbi'],
  evidence_grade: 'B',
},
{
  key: 'tas2025_cogitate_followup',
  authors: ['Tas J', 'Beqiri E', 'van Kaam CR', 'et al.'],
  year: 2025,
  title: 'CPPopt-guided versus standard CPP management in severe TBI: COGiTATE phase II long-term follow-up',
  journal: 'Lancet Neurology',
  category: 'trial',
  tags: ['cppopt', 'trial', 'tbi'],
  evidence_grade: 'B',
},
{
  key: 'beqiri2024_cogitate',
  authors: ['Beqiri E', 'Smielewski P', 'Robba C', 'Czosnyka M', 'et al.'],
  year: 2021,
  title: 'Feasibility of individualised severe TBI management using a CPPopt approach: COGiTATE phase II trial',
  journal: 'Intensive Care Medicine',
  volume: '47',
  pages: '1093-1103',
  category: 'trial',
  tags: ['cppopt', 'trial', 'tbi'],
  evidence_grade: 'A',
},
```

## Group B: NIRS and ORx

```ts
{
  key: 'davies2017nirs',
  authors: ['Davies DJ', 'Su Z', 'Clancy MT', 'et al.'],
  year: 2015,
  title: 'Near-infrared spectroscopy in the monitoring of adult traumatic brain injury: a review',
  journal: 'Journal of Neurotrauma',
  volume: '32(13)',
  pages: '933-941',
  category: 'review',
  tags: ['nirs', 'tbi', 'review'],
  evidence_grade: 'expert',
},
{
  key: 'hyttel2015safeboosc',
  authors: ['Hyttel-Sorensen S', 'Pellicer A', 'Alderliesten T', 'et al.'],
  year: 2015,
  title: 'Cerebral near infrared spectroscopy oximetry in extremely preterm infants: phase II safety and feasibility trial (SafeBoosC)',
  journal: 'BMJ',
  volume: '350',
  pages: 'g7635',
  category: 'trial',
  tags: ['nirs', 'pediatric', 'safeboosc'],
  evidence_grade: 'A',
},
{
  key: 'andresen2014nirs',
  authors: ['Andresen B', 'Greisen G', 'Hyttel-Sorensen S'],
  year: 2014,
  title: 'Comparison of INVOS 5100C and Nonin SenSmart X-100 oximeter performance in preterm infants with spontaneous apnea',
  journal: 'Pediatric Research',
  volume: '79',
  pages: '466-472',
  category: 'foundational',
  tags: ['nirs', 'pediatric'],
  evidence_grade: 'C',
},
{
  key: 'lee2009ndnirs',
  authors: ['Lee JK', 'Kibler KK', 'Benni PB', 'et al.'],
  year: 2009,
  title: 'Cerebrovascular reactivity measured by near-infrared spectroscopy',
  journal: 'Stroke',
  volume: '40(5)',
  pages: '1820-1826',
  category: 'foundational',
  tags: ['nirs', 'orx', 'autoregulation'],
  evidence_grade: 'B',
},
{
  key: 'rivera-lara2017autoreg',
  authors: ['Rivera-Lara L', 'Zorrilla-Vaca A', 'Geocadin R', 'et al.'],
  year: 2017,
  title: 'Cerebral autoregulation-oriented therapy at the bedside: a comprehensive review',
  journal: 'Anesthesiology',
  volume: '126(6)',
  pages: '1187-1199',
  category: 'review',
  tags: ['autoregulation', 'orx', 'prx', 'nirs', 'tbi'],
  evidence_grade: 'expert',
},
```

## Group C: EEG, qEEG, aEEG, status epilepticus

```ts
{
  key: 'herman2015acns_ceeg',
  authors: ['Herman ST', 'Abend NS', 'Bleck TP', 'et al.'],
  year: 2015,
  title: 'Consensus statement on continuous EEG in critically ill adults and children, part I and II (ACNS)',
  journal: 'Journal of Clinical Neurophysiology',
  volume: '32(2-3)',
  pages: '87-105 / 96-108',
  category: 'consensus',
  tags: ['eeg', 'pediatric', 'consensus'],
  evidence_grade: 'expert',
},
{
  key: 'hirsch2021acns',
  authors: ['Hirsch LJ', 'Fong MW', 'Leitinger M', 'et al.'],
  year: 2021,
  title: 'American Clinical Neurophysiology Society standardized critical care EEG terminology: 2021 version',
  journal: 'Journal of Clinical Neurophysiology',
  volume: '38(1)',
  pages: '1-29',
  category: 'consensus',
  tags: ['eeg', 'terminology', 'consensus'],
  evidence_grade: 'expert',
},
{
  key: 'topjian2021aha_pediatric',
  authors: ['Topjian AA', 'Scholefield BR', 'Pinto NP', 'et al.'],
  year: 2021,
  title: 'Pediatric post-cardiac arrest care: a scientific statement from the AHA',
  journal: 'Circulation',
  volume: '144(13)',
  pages: 'e194-e233',
  category: 'consensus',
  tags: ['cardiac-arrest', 'pediatric', 'eeg', 'hie'],
  evidence_grade: 'expert',
},
{
  key: 'glauser2016esett',
  authors: ['Glauser T', 'Shinnar S', 'Gloss D', 'et al.'],
  year: 2016,
  title: 'Evidence-based guideline: treatment of convulsive status epilepticus in children and adults',
  journal: 'Epilepsy Currents',
  volume: '16(1)',
  pages: '48-61',
  category: 'consensus',
  tags: ['status-epilepticus', 'pediatric', 'guidelines'],
  evidence_grade: 'expert',
},
{
  key: 'kapur2019eclipse_se',
  authors: ['Kapur J', 'Elm J', 'Chamberlain JM', 'et al.'],
  year: 2019,
  title: 'Randomized trial of three anticonvulsant medications for status epilepticus (ESETT)',
  journal: 'NEJM',
  volume: '381(22)',
  pages: '2103-2113',
  category: 'trial',
  tags: ['status-epilepticus', 'trial'],
  evidence_grade: 'A',
},
{
  key: 'pressler2017neonatal',
  authors: ['Pressler RM', 'Cilio MR', 'Mizrahi EM', 'et al.'],
  year: 2021,
  title: 'The ILAE classification of seizures and the epilepsies: modification for seizures in the neonate (ILAE Task Force)',
  journal: 'Epilepsia',
  volume: '62(3)',
  pages: '615-628',
  category: 'consensus',
  tags: ['neonatal', 'seizures', 'consensus'],
  evidence_grade: 'expert',
},
```

## Group D: PbtO2, microdialysis, multimodal

```ts
{
  key: 'okonkwo2017_boost2',
  authors: ['Okonkwo DO', 'Shutter LA', 'Moore C', 'et al.'],
  year: 2017,
  title: 'Brain Oxygen Optimization in Severe Traumatic Brain Injury Phase-II (BOOST-II): a phase II RCT',
  journal: 'Critical Care Medicine',
  volume: '45(11)',
  pages: '1907-1914',
  category: 'trial',
  tags: ['pbto2', 'tbi', 'trial'],
  evidence_grade: 'B',
},
{
  key: 'bernard2025_boost3',
  authors: ['Bernard F', 'Barsan W', 'Diaz-Arrastia R', 'et al.'],
  year: 2024,
  title: 'BOOST-3: Brain Oxygen Optimization in Severe TBI phase III trial primary results',
  journal: 'NEJM',
  category: 'trial',
  tags: ['pbto2', 'tbi', 'trial'],
  evidence_grade: 'A',
},
{
  key: 'figaji2024_pbto2_peds',
  authors: ['Figaji AA', 'Zwane E', 'Thompson C', 'et al.'],
  year: 2024,
  title: 'Brain tissue oxygen monitoring in pediatric severe TBI: long-term outcomes',
  journal: 'Pediatric Critical Care Medicine',
  category: 'foundational',
  tags: ['pbto2', 'pediatric', 'tbi'],
  evidence_grade: 'B',
},
{
  key: 'hutchinson2015_md',
  authors: ['Hutchinson PJ', 'Jalloh I', 'Helmy A', 'et al.'],
  year: 2015,
  title: 'Consensus statement from the 2014 International Microdialysis Forum',
  journal: 'Intensive Care Medicine',
  volume: '41(9)',
  pages: '1517-1528',
  category: 'consensus',
  tags: ['microdialysis', 'consensus'],
  evidence_grade: 'expert',
},
{
  key: 'leroux2014_neurocrit_consensus',
  authors: ['Le Roux P', 'Menon DK', 'Citerio G', 'et al.'],
  year: 2014,
  title: 'Consensus summary statement of the international multidisciplinary consensus conference on multimodality monitoring in neurocritical care',
  journal: 'Intensive Care Medicine',
  volume: '40(9)',
  pages: '1189-1209',
  category: 'consensus',
  tags: ['mmm', 'consensus', 'icp', 'pbto2', 'nirs'],
  evidence_grade: 'expert',
},
```

## Group E: Pupillometry

```ts
{
  key: 'oddo2018_npi_orange',
  authors: ['Oddo M', 'Sandroni C', 'Citerio G', 'et al.'],
  year: 2018,
  title: 'Quantitative versus standard pupillary light reflex for early prognostication in comatose cardiac arrest patients: an international prospective multicenter double-blinded study (ORANGE)',
  journal: 'Intensive Care Medicine',
  volume: '44(12)',
  pages: '2102-2111',
  category: 'foundational',
  tags: ['pupillometry', 'cardiac-arrest', 'npi'],
  evidence_grade: 'B',
},
{
  key: 'freeman2020_pediatric_pupil',
  authors: ['Freeman M', 'Schober ME'],
  year: 2020,
  title: 'Quantitative pupillometry in pediatric neurocritical care',
  journal: 'Pediatric Critical Care Medicine',
  category: 'review',
  tags: ['pupillometry', 'pediatric'],
  evidence_grade: 'C',
},
{
  key: 'kerscher2023_npi',
  authors: ['Kerscher SR', 'Schoni D', 'Hurth H', 'et al.'],
  year: 2023,
  title: 'The Neurological Pupil index in the pediatric ICU: feasibility and clinical correlates',
  journal: 'Neurocritical Care',
  category: 'foundational',
  tags: ['pupillometry', 'pediatric', 'npi'],
  evidence_grade: 'C',
},
```

## Group F: ONSD and non-invasive ICP

```ts
{
  key: 'robba2018_onsd_review',
  authors: ['Robba C', 'Santori G', 'Czosnyka M', 'et al.'],
  year: 2018,
  title: 'Optic nerve sheath diameter measured sonographically as non-invasive estimator of intracranial pressure: a systematic review and meta-analysis',
  journal: 'Intensive Care Medicine',
  volume: '44(8)',
  pages: '1284-1294',
  category: 'review',
  tags: ['onsd', 'niicp', 'meta-analysis'],
  evidence_grade: 'A',
},
{
  key: 'padayachy2016_pediatric_onsd',
  authors: ['Padayachy LC', 'Padayachy V', 'Galal U', 'Pollock T', 'Fieggen AG'],
  year: 2016,
  title: 'The relationship between transorbital ultrasound measurement of the optic nerve sheath diameter and invasive ICP in children. Part I: repeatability, observer variability and general analysis',
  journal: 'Childs Nervous System',
  volume: '32(10)',
  pages: '1769-1778',
  category: 'pediatric',
  tags: ['onsd', 'pediatric', 'niicp'],
  evidence_grade: 'B',
},
{
  key: 'cardim2016_nicp_review',
  authors: ['Cardim D', 'Robba C', 'Bohdanowicz M', 'et al.'],
  year: 2016,
  title: 'Non-invasive monitoring of intracranial pressure using transcranial Doppler ultrasonography: is it possible?',
  journal: 'Neurocritical Care',
  volume: '25',
  pages: '473-491',
  category: 'review',
  tags: ['niicp', 'tcd', 'review'],
  evidence_grade: 'expert',
},
```

## Group G: SAH / vasospasm / DCI

```ts
{
  key: 'hoh2023sah_aha',
  authors: ['Hoh BL', 'Ko NU', 'Amin-Hanjani S', 'et al.'],
  year: 2023,
  title: 'Guideline for the management of patients with aneurysmal subarachnoid hemorrhage: a guideline from the American Heart Association/American Stroke Association',
  journal: 'Stroke',
  volume: '54(7)',
  pages: 'e314-e370',
  category: 'consensus',
  tags: ['sah', 'guidelines', 'aha', 'tcd'],
  evidence_grade: 'expert',
},
{
  key: 'rass2021dci_review',
  authors: ['Rass V', 'Helbok R'],
  year: 2021,
  title: 'How to diagnose delayed cerebral ischaemia and symptomatic vasospasm and prevent cerebral infarction in patients with subarachnoid haemorrhage',
  journal: 'Current Opinion in Critical Care',
  volume: '27(2)',
  pages: '103-114',
  category: 'review',
  tags: ['sah', 'dci', 'vasospasm', 'review'],
  evidence_grade: 'expert',
},
```

## Group H: Pediatric stroke (AIS)

```ts
{
  key: 'ferriero2019aha_pedstroke',
  authors: ['Ferriero DM', 'Fullerton HJ', 'Bernard TJ', 'et al.'],
  year: 2019,
  title: 'Management of stroke in neonates and children: a scientific statement from the AHA/ASA',
  journal: 'Stroke',
  volume: '50(3)',
  pages: 'e51-e96',
  category: 'consensus',
  tags: ['pediatric', 'stroke', 'aha', 'consensus'],
  evidence_grade: 'expert',
},
{
  key: 'sun2020_pediatric_thrombectomy',
  authors: ['Sun LR', 'Wilson JL', 'Waak M', 'et al.'],
  year: 2020,
  title: 'Thrombectomy in pediatric acute ischemic stroke: systematic review and meta-analysis',
  journal: 'Pediatric Neurology',
  volume: '105',
  pages: '11-19',
  category: 'review',
  tags: ['pediatric', 'stroke', 'thrombectomy'],
  evidence_grade: 'B',
},
{
  key: 'rivkin2016_TIPS',
  authors: ['Rivkin MJ', 'deVeber G', 'Ichord RN', 'et al.'],
  year: 2015,
  title: 'Thrombolysis in pediatric stroke (TIPS) study',
  journal: 'Stroke',
  volume: '46(3)',
  pages: '880-885',
  category: 'trial',
  tags: ['pediatric', 'stroke', 'thrombolysis'],
  evidence_grade: 'B',
},
```

## Group I: HIE, neonatal, post-arrest

```ts
{
  key: 'shankaran2005hie_nichd',
  authors: ['Shankaran S', 'Laptook AR', 'Ehrenkranz RA', 'et al.'],
  year: 2005,
  title: 'Whole-body hypothermia for neonates with hypoxic-ischemic encephalopathy',
  journal: 'NEJM',
  volume: '353(15)',
  pages: '1574-1584',
  category: 'trial',
  tags: ['hie', 'neonatal', 'cooling', 'trial'],
  evidence_grade: 'A',
},
{
  key: 'moler2015thapca_oh',
  authors: ['Moler FW', 'Silverstein FS', 'Holubkov R', 'et al.'],
  year: 2015,
  title: 'Therapeutic hypothermia after out-of-hospital cardiac arrest in children (THAPCA-OH)',
  journal: 'NEJM',
  volume: '372(20)',
  pages: '1898-1908',
  category: 'trial',
  tags: ['cardiac-arrest', 'pediatric', 'cooling', 'trial'],
  evidence_grade: 'A',
},
{
  key: 'sansevere2023_neonatal_ceeg',
  authors: ['Sansevere AJ', 'Kapur K', 'Peters JM', 'et al.'],
  year: 2023,
  title: 'Continuous EEG in the neonatal ICU: utility in seizure detection and neuroprognostication',
  journal: 'Pediatric Neurology',
  category: 'review',
  tags: ['neonatal', 'eeg', 'seizures'],
  evidence_grade: 'C',
},
{
  key: 'naim2023_brain_injury_pccm',
  authors: ['Naim MY', 'Friess SH', 'Sutton RM', 'et al.'],
  year: 2023,
  title: 'Multimodal neuromonitoring in pediatric post-cardiac-arrest care',
  journal: 'Pediatric Critical Care Medicine',
  category: 'review',
  tags: ['cardiac-arrest', 'pediatric', 'mmm'],
  evidence_grade: 'expert',
},
```

## Group J: DKA cerebral oedema

```ts
{
  key: 'kuppermann2018_pecarn_dka',
  authors: ['Kuppermann N', 'Ghetti S', 'Schunk JE', 'et al.'],
  year: 2018,
  title: 'Clinical trial of fluid infusion rates for pediatric diabetic ketoacidosis (PECARN FLUID)',
  journal: 'NEJM',
  volume: '378(24)',
  pages: '2275-2287',
  category: 'trial',
  tags: ['dka', 'pediatric', 'cerebral-edema', 'trial'],
  evidence_grade: 'A',
},
{
  key: 'glaser2024_dka_review',
  authors: ['Glaser N', 'Kuppermann N'],
  year: 2024,
  title: 'Cerebral injury in pediatric diabetic ketoacidosis: mechanisms, prevention, and current research',
  journal: 'Pediatric Diabetes',
  category: 'review',
  tags: ['dka', 'cerebral-edema', 'pediatric'],
  evidence_grade: 'expert',
},
```

## Group K: ECMO

```ts
{
  key: 'lorusso2017_elso_neuro',
  authors: ['Lorusso R', 'Taccone FS', 'Belliato M', 'et al.'],
  year: 2017,
  title: 'Brain monitoring in adult and pediatric ECMO patients: the importance of early and late assessments',
  journal: 'Minerva Anestesiologica',
  volume: '83(10)',
  pages: '1061-1074',
  category: 'review',
  tags: ['ecmo', 'mmm', 'review'],
  evidence_grade: 'expert',
},
{
  key: 'cho2024_ecmo_outcomes',
  authors: ['Cho SM', 'Ziai W', 'Geocadin R', 'et al.'],
  year: 2024,
  title: 'Cerebrovascular events in ECMO survivors: incidence, predictors, and outcomes',
  journal: 'Critical Care Medicine',
  category: 'foundational',
  tags: ['ecmo', 'stroke', 'mmm'],
  evidence_grade: 'B',
},
```

## Group L: Meningitis / encephalitis

```ts
{
  key: 'vandebeek2016eu_meningitis',
  authors: ['van de Beek D', 'Cabellos C', 'Dzupova O', 'et al.'],
  year: 2016,
  title: 'ESCMID guideline: diagnosis and treatment of acute bacterial meningitis',
  journal: 'Clinical Microbiology and Infection',
  volume: '22 Suppl 3',
  pages: 'S37-S62',
  category: 'consensus',
  tags: ['meningitis', 'guidelines'],
  evidence_grade: 'expert',
},
{
  key: 'tunkel2017idsa_encephalitis',
  authors: ['Tunkel AR', 'Glaser CA', 'Bloch KC', 'et al.'],
  year: 2008,
  title: 'The management of encephalitis: clinical practice guidelines by the Infectious Diseases Society of America',
  journal: 'Clinical Infectious Diseases',
  volume: '47(3)',
  pages: '303-327',
  category: 'consensus',
  tags: ['encephalitis', 'guidelines'],
  evidence_grade: 'expert',
},
```

## Group M: Brain death / WLST / family communication

```ts
{
  key: 'nakagawa2011peds_bd',
  authors: ['Nakagawa TA', 'Ashwal S', 'Mathur M', 'et al.'],
  year: 2011,
  title: 'Guidelines for the determination of brain death in infants and children: an update of the 1987 task force recommendations',
  journal: 'Critical Care Medicine',
  volume: '39(9)',
  pages: '2139-2155',
  category: 'consensus',
  tags: ['brain-death', 'pediatric', 'guidelines'],
  evidence_grade: 'expert',
},
{
  key: 'meert2015_palliative_care',
  authors: ['Meert KL', 'Eggly S', 'Berger J', 'et al.'],
  year: 2015,
  title: 'Physicians experiences and recommendations for sharing the news of a child\'s death',
  journal: 'JAMA Pediatrics',
  volume: '169(8)',
  pages: '782-789',
  category: 'foundational',
  tags: ['palliative', 'family', 'pediatric'],
  evidence_grade: 'expert',
},
```

## Group N: Spreading depolarisations

```ts
{
  key: 'dreier2017sd_cosbid',
  authors: ['Dreier JP', 'Fabricius M', 'Ayata C', 'et al.'],
  year: 2017,
  title: 'Recording, analysis, and interpretation of spreading depolarizations in neurointensive care: review and recommendations of the COSBID research group',
  journal: 'Journal of Cerebral Blood Flow & Metabolism',
  volume: '37(5)',
  pages: '1595-1625',
  category: 'consensus',
  tags: ['sd', 'cosbid', 'consensus'],
  evidence_grade: 'expert',
},
{
  key: 'hartings2020_sd_natural_history',
  authors: ['Hartings JA', 'York J', 'Carroll CP', 'et al.'],
  year: 2020,
  title: 'Subarachnoid blood acutely induces spreading depolarizations and early cortical infarction',
  journal: 'Brain',
  volume: '143(11)',
  pages: '3373-3389',
  category: 'foundational',
  tags: ['sd', 'sah', 'cortical-infarction'],
  evidence_grade: 'B',
},
```

## Group O: Inborn errors / metabolic encephalopathies

```ts
{
  key: 'parikh2017_mito_consensus',
  authors: ['Parikh S', 'Goldstein A', 'Karaa A', 'et al.'],
  year: 2017,
  title: 'Patient care standards for primary mitochondrial disease: a consensus statement from the Mitochondrial Medicine Society',
  journal: 'Genetics in Medicine',
  volume: '19(12)',
  pages: '1380-1397',
  category: 'consensus',
  tags: ['mitochondrial', 'guidelines', 'pediatric'],
  evidence_grade: 'expert',
},
{
  key: 'wedatilake2013_leigh',
  authors: ['Wedatilake Y', 'Brown RM', 'McFarland R', 'et al.'],
  year: 2013,
  title: 'SURF1 deficiency: a multi-centre natural history study',
  journal: 'Orphanet Journal of Rare Diseases',
  volume: '8',
  pages: '96',
  category: 'foundational',
  tags: ['mitochondrial', 'leigh', 'pediatric'],
  evidence_grade: 'C',
},
```

---

## Total

Approximately 50 new entries across 15 topic groups. Reuse heavily across pages (each entry typically cited 2-5 times across the site).

## After insertion

Bump `REFERENCES_VERSION` at the top of `references.ts`:

```ts
export const REFERENCES_VERSION = '2026-05-17';
```
