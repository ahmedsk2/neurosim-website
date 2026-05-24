# Tier 1 modality briefs (heavy expansion)

Seven highest-impact modality pages. Each gets a full TCD-style rewrite: ~3x length, the full 18-section spine, three bedside vignettes, age-banded normative tables, BP/CPP/management section, 8-10 clinical contexts, MMM integration matrix, recent literature, 3-question Quiz.

**Reference exemplar**: `src/content/modalities/tcd.mdx`. When in doubt, mirror its section ordering and tone.

---

## 1. `icp.mdx` (Tier 1)

**Current state**: ~37 em-dashes (now removed). The most central modality on the site. Current content covers measurement, waveform, normal ranges.

**Audience**: PICU fellow first-time reader; pediatric intensivist; neurosurgical trainee.

**Target length**: ~600 lines.

**Three bedside vignettes**:
1. A 4-year-old severe TBI day 1, ICP 28 sustained, P2 > P1 on waveform, RAP 0.8. Bedside ladder (head up, sedation, hyperosmolar, ?craniectomy).
2. A neonate with hydrocephalus, fontanelle tense, ONSD 5.8 mm, no invasive monitor available. How to decide on shunt vs medical management with ONSD as the bedside surrogate.
3. A 12-year-old with subarachnoid haemorrhage, EVD draining 5 mL/h, MFV rising on TCD. Distinguishing rising ICP from spasm-related flow change.

**Section spine** (mirror TCD page):

1. Acronyms callout (ICP, EVD, IPM, CPP, RAP, PRx, MAP).
2. TldrCard (60-second version: ICP is bedrock, waveform shape matters more than the number once high, thresholds 20-22 mmHg general / age-banded for kids).
3. Three vignettes (above).
4. What ICP is, and what it is not (Monro-Kellie ground truth; ICP equals brain-tissue pressure only when the waveform shape is healthy; what ICP cannot do: localise the cause, distinguish vasogenic vs cytotoxic edema).
5. EVD vs intraparenchymal placement (`<Figure>`): pros, cons, complication rates, drift, calibration.
6. The ICP waveform (`<Figure>` annotated P1/P2/P3 + dicrotic notch). Normal P2 < P1; pathological P2 > P1 with reduced compliance.
7. The numbers to record: ICP mean, ICP pulse amplitude (AMP), RAP, CPP, and the time-of-elevation burden (dose, not just peak).
8. Age-banded normative thresholds: neonate 10 mmHg, infant 15, child 20, adolescent 22, adult 22 mmHg. Cite kochanek2019_pbtf4 and Tasker 2023.
9. Pattern library (`<Figure>` side-by-side): normal, plateau (A-waves), B-waves, "rounded" low-compliance, sustained high-ICP. Include the Lundberg taxonomy.
10. Widgets: `ICPWaveformTrainer`, `RAPDemo`, `PlateauWaveSimulator`.
11. CPP management section: deriving CPP target by age (35-40 in neonate, 40-50 infant, 50-60 toddler, 60-70 older child / adult); CPPopt loop where PRx is available; pitfalls of fixed CPP targets.
12. Clinical contexts (8 subsections):
    - Severe TBI (kochanek2019_pbtf4, guiza2015_b_dose).
    - Aneurysmal SAH / IVH.
    - HIE / post-cardiac arrest.
    - Bacterial meningitis with raised ICP.
    - Hydrocephalus / shunt malfunction.
    - DKA cerebral oedema.
    - Hepatic encephalopathy with cerebral oedema.
    - Post-stroke malignant MCA syndrome / decompressive craniectomy.
13. Multimodal integration matrix:
    - Pair with PRx for autoregulation.
    - Pair with TCD for spasm-versus-rising-ICP differentiation.
    - Pair with NIRS for non-invasive surrogate when EVD/IPM contraindicated.
    - Pair with PbtO2 for tissue oxygenation.
    - Pair with EEG for seizure-driven ICP elevations.
14. Setup and technique (DeepDive): EVD insertion (Frazier point, Kocher's point), zeroing, dampening troubleshooting, infection prevention bundles.
15. Pitfalls: drift over days, dampening, blocked EVD, transducer height, sedation effect on baseline, ICP vs ventricular pressure differences in compartmentalised oedema.
16. Combine-with cross-links: `cpp`, `prx`, `cppopt`, `rap`, `non-invasive-icp`, `onsd`, `tcd`, `pbto2`.
17. Evidence summary + recent literature (DeepDive): chesnut2012best, guiza2015_b_dose, kochanek2019_pbtf4, depreitere2014icpdose, tasker2023_pccm_review.
18. 3-question Quiz.

**New figures**:
- `/images/icp/p1p2p3-anatomy.svg`
- `/images/icp/lundberg-waves.svg`
- `/images/icp/age-band-icp-thresholds.svg`
- `/images/icp/evd-vs-ipm-placement.svg`

**Citations** (new, from `05-references-to-add.md`): `chesnut2012best`, `guiza2015_b_dose`, `kochanek2019_pbtf4`, `depreitere2014icpdose`, `tasker2023_pccm_review`, `leroux2014_neurocrit_consensus`, `hawthorne2014icp`.

**Notes**: This is the canonical reference page for the whole site. Get it right.

---

## 2. `prx.mdx` (Tier 1)

**Audience**: PICU fellow with some autoregulation background; intensivist using or considering PRx-guided CPP.

**Target length**: ~550 lines.

**Three bedside vignettes**:
1. Severe TBI day 2 in a 10-year-old, PRx +0.45 sustained over 30 min, CPP 60. Where is CPPopt?
2. SAH day 5 with intermittent vasospasm, PRx oscillating 0-+0.3. Is this autoregulation or noise?
3. Post-cardiac-arrest day 1, PRx not interpretable (low slow-wave power). When to trust the index and when to wait.

**Section spine**:

1. Acronyms callout (PRx, MAP, ICP, CPP, Mx, ORx).
2. TldrCard.
3. Three vignettes.
4. What PRx is, and what it is not (moving Pearson correlation of MAP↔ICP at slow-wave frequencies, ~0.04-0.07 Hz).
5. The math (DeepDive optional): 30 paired 10-second averages, Pearson over 5-min window, sliding update every minute.
6. Thresholds: -0.3 to 0.0 intact, 0.0 to 0.25 ambiguous, > 0.25 impaired. Time constants.
7. Widgets: `PRxCalculator`, `CPPoptUCurve`, `MxCalculator` (compare).
8. **CPPopt by PRx** section: U-curve method, target band ±5 mmHg, COGiTATE evidence.
9. Pattern library: intact, impaired, ambiguous, artifactual.
10. Clinical contexts:
    - Severe TBI (aries2012cppopt, depreitere2014icpdose, beqiri2024_cogitate).
    - SAH (rass2021dci_review, foreman2022).
    - Pediatric TBI (lewis2014peds, tas2022peds, tas2024_pediatric_cppopt).
    - Post-cardiac arrest (less validated; sparse).
    - ECMO (lorusso2017_elso_neuro).
11. Multimodal integration: pair with Mx (TCD), ORx (NIRS) for cross-validation; pair with PbtO2 / microdialysis for endpoint validation.
12. Pitfalls: ABP/ICP signal quality, missing data, motion artifact, sedation/anaesthesia changing slow-wave power, age-related differences.
13. Combine-with cross-links: `mx`, `orx`, `cppopt`, `icp`, `cpp`.
14. Evidence summary + recent literature (DeepDive).
15. Quiz.

**New figures**:
- `/images/prx/prx-time-series.svg`
- `/images/prx/prx-vs-cpp-ucurve.svg`
- `/images/prx/prx-vs-mx-vs-orx.svg`

**Citations** (new): `czosnyka1997prx`, `aries2012cppopt`, `depreitere2014icpdose`, `beqiri2024_cogitate`, `tas2025_cogitate_followup`, `donnelly2017mapopt`, `tas2022peds`, `tas2024_pediatric_cppopt`, `lewis2014peds`, `tasker2023_pccm_review`, `rivera-lara2017autoreg`.

---

## 3. `cppopt.mdx` (Tier 1)

**Audience**: clinician using or considering individualised CPP targeting; trial-aware reader.

**Target length**: ~500 lines.

**Three bedside vignettes**:
1. COGiTATE-style 8-hour CPPopt loop in a 12-year-old severe TBI. How to recognise a "trust the number" moment vs a "wait for more data" moment.
2. CPPopt unobtainable (no clear U-shape after 4 h). What to do.
3. Pediatric difference: 3-year-old where CPPopt is 50; the team's default CPP threshold is 60.

**Section spine**:

1. Acronyms.
2. TldrCard.
3. Three vignettes.
4. What CPPopt is: bottom of the (CPP, PRx) parabola fit over the past 4 hours.
5. The five-step workflow (`<Figure>`).
6. Widgets: `CPPoptUCurve` (the worked simulation), `MAPoptUCurve`.
7. Dose-response: time outside CPPopt vs neurological outcome (aries2012cppopt).
8. **Trial evidence**: COGiTATE phase II (beqiri2024_cogitate), COGiTATE follow-up (tas2025_cogitate_followup), pediatric tas2024.
9. Clinical contexts:
    - Severe TBI as the validated indication.
    - SAH (less validated, growing use).
    - Pediatric severe TBI (tas2024).
    - HIE / post-arrest (research only).
10. Multimodal integration: PRx as the canonical input; Mx as the non-invasive fallback; ORx with NIRS as a non-invasive backup.
11. Pitfalls: parabola not always present; "yes-bias" of fitting; need for trend-not-snapshot interpretation; sedation effects.
12. Combine-with: `prx`, `mx`, `orx`, `cpp`, `icp`.
13. Evidence summary + recent literature (DeepDive).
14. Quiz.

**New figures**:
- `/images/cppopt/cppopt-workflow.svg`
- `/images/cppopt/cppopt-dose-response.svg`

**Citations**: `steiner2002`, `aries2012cppopt`, `beqiri2024_cogitate`, `tas2022peds`, `tas2024_pediatric_cppopt`, `tas2025_cogitate_followup`, `donnelly2017mapopt`, `sorrentino2012`.

---

## 4. `nirs.mdx` (Tier 1)

**Audience**: NICU / CICU / PICU clinician; CHD surgeon's perioperative team; anaesthetist.

**Target length**: ~550 lines.

**Three bedside vignettes**:
1. CHD repair on cardiopulmonary bypass: NIRS rSO2 drops to 45% during arch reconstruction. What to do.
2. Preterm SafeBoosC-eligible neonate; rSO2 oscillating 40-55%; intervention algorithm.
3. PICU septic shock: rSO2 falling despite stable BP; ORx becomes positive. Implications.

**Section spine** (mirror TCD page closely):

1. Acronyms (NIRS, rSO2, ORx, COx, CHD, CBP).
2. TldrCard.
3. Three vignettes.
4. What NIRS is, and what it is not: modified Beer-Lambert; light penetrates 2-3 cm; samples mixed arterial/venous compartments (~75% venous-weighted); rSO2 is a regional, mostly venous index.
5. Optode placement and physics (`<Figure>` showing source-detector geometry, banana-shaped photon path).
6. The numbers: rSO2 trend, fractional change from baseline, ORx (slow-wave correlation with MAP), area-under-threshold (40% or 50%).
7. Age-banded reference values: term newborn baseline ~70-80%, preterm 70-90%, infants/older children 65-75%.
8. Pattern library (`<Figure>` side-by-side): normal trend, hypoperfusion drop, hyperaemia, sensor artefact, asymmetry signaling unilateral lesion.
9. Widgets: `NIRSDisplay`, `OrxCalculator`.
10. **BP/CPP management section**: ORx-defined LLA / ULA, COx use, integration with PRx where available; SafeBoosC algorithm for preterms.
11. Clinical contexts:
    - CHD intra-op (paediatric cardiac).
    - Preterm neonate (SafeBoosC, plomgaard2024_safeboosc3).
    - Septic shock.
    - Severe TBI (davies2017nirs).
    - Cardiac arrest / ROSC monitoring.
    - Pediatric AIS thrombectomy / post-recanalisation.
    - SAH / DCI (limited validation).
12. Multimodal integration: NIRS-TCD pair (macro vs micro); NIRS-PbtO2 (regional surrogate vs invasive truth); NIRS-EEG (alpha-delta + rSO2 trends).
13. Setup and technique (DeepDive): optode selection, placement angle, light-shielding, hair / skin pigmentation effects, intercalibration between devices (INVOS, Foresight, Masimo, EQUANOX).
14. Pitfalls: extracerebral contamination, sensor migration, low arterial saturation paradoxes, calibration drift, anaemia-induced underestimation.
15. Combine-with: `orx`, `prx`, `tcd`, `pbto2`, `advanced-nirs`.
16. Evidence summary + recent literature.
17. Quiz.

**New figures**:
- `/images/nirs/nirs-optode-pair.svg`
- `/images/nirs/rso2-trend-shock.svg`
- `/images/nirs/orx-vs-prx-discordance.svg`

**Citations**: `jobsis1977`, `kurth2009`, `hyttel2015safeboosc`, `plomgaard2024_safeboosc3`, `davies2017nirs`, `lee2009ndnirs`, `brady2010orx`, `rivera-lara2017autoreg`, `naim2023_brain_injury_pccm`, `andresen2014nirs`.

---

## 5. `eeg.mdx` (Tier 1)

**Audience**: PICU clinician; neurology trainee; epileptologist.

**Target length**: ~550 lines.

**Three vignettes**:
1. Comatose post-arrest child day 1: aEEG with discontinuous pattern, cEEG with intermittent rhythmic discharges. NCSE vs ictal-interictal-continuum?
2. Refractory status epilepticus in a 5-year-old: progression from benzo to second-line to continuous infusion guided by burst-suppression endpoint.
3. SAH day 6: alpha-delta ratio falling on quantitative trends 6 h before clinical signs of DCI.

**Section spine**:

1. Acronyms (EEG, cEEG, qEEG, aEEG, NCSE, RDA, GPD, LPD, ESETT, ACNS).
2. TldrCard.
3. Three vignettes.
4. What EEG is, and what it is not: cortical surface electrical activity; not seizure-detector-only; the only non-invasive bedside tool for NCSE.
5. Montage and electrode placement (`<Figure>`).
6. The signal: frequency bands, rhythms, reactivity, continuity.
7. ACNS terminology refresher (hirsch2021acns): GPD, LPD, RDA, BIRDS.
8. Pattern library (`<Figure>` 8-panel).
9. Widgets: `EEGPatternLibrary`, `aEEGGenerator`, `qEEGSpectrogram`.
10. **Status epilepticus management section**: ESETT-validated drug ladder; cEEG endpoints (burst suppression for super-refractory; resolution of electrographic seizures for refractory).
11. Clinical contexts:
    - Convulsive and non-convulsive status epilepticus (glauser2016esett, kapur2019eclipse_se).
    - HIE / post-cardiac arrest neuroprognosis (topjian2021aha_pediatric, naim2023).
    - SAH and DCI (qEEG; sandsmark2024_qeeg_dci).
    - Bacterial meningitis with seizures.
    - Sepsis-associated encephalopathy.
    - Severe TBI: subclinical seizures.
    - Neonatal seizures (pressler2017neonatal, sansevere2023_neonatal_ceeg).
12. Multimodal integration: EEG + TCD (NCSE-driven flow), EEG + NIRS (rSO2 reactivity), EEG + ICP (seizure-driven ICP spikes).
13. Setup (DeepDive): 10-20 system, pediatric considerations, scalp prep, impedance, artefact reduction, video-EEG.
14. Pitfalls: under-reading (sedation-induced patterns), over-reading (RDA without seizure), inter-rater variability, montage choice obscuring focal patterns.
15. Combine-with: `qeeg`, `aeeg`, `bis`, `evoked-potentials`.
16. Evidence summary.
17. Quiz.

**New figures**:
- `/images/eeg/montage-bipolar-vs-referential.svg`
- `/images/eeg/pattern-library.svg`
- `/images/eeg/aDR-trend.svg`

**Citations**: `herman2015acns_ceeg`, `hirsch2021acns`, `topjian2021aha_pediatric`, `glauser2016esett`, `kapur2019eclipse_se`, `pressler2017neonatal`, `sansevere2023_neonatal_ceeg`, `sandsmark2024_qeeg_dci`, `naim2023_brain_injury_pccm`, `claassen2004`, `claassen2013`, `foreman2012`, `foreman2022`.

---

## 6. `pbto2.mdx` (Tier 1)

**Audience**: severe-TBI clinician; neurocritical-care intensivist; pediatric intensivist using PbtO2.

**Target length**: ~500 lines.

**Three vignettes**:
1. Severe TBI day 2, ICP 18 (acceptable), CPP 65, but PbtO2 14 mmHg. Bedside titration tree.
2. Pediatric severe TBI, PbtO2 placement at age 6: where, how, and complications.
3. SAH day 6 with high MFV: PbtO2 falling concurrently → DCI mechanism confirmation.

**Section spine**:

1. Acronyms.
2. TldrCard.
3. Three vignettes.
4. What PbtO2 is, and what it is not: Clark electrode; samples ~17 mm² tissue zone around probe tip; absolute oxygen tension in interstitial fluid.
5. Probe placement (`<Figure>`).
6. Numbers: PbtO2 thresholds 20 mmHg target, 15 mmHg action, 10 mmHg critical (BOOST-II/III).
7. Pattern library: normal trend, low-CPP drop, low-FiO2 drop, sepsis low, post-suction transient.
8. Widget: `PbtO2Demo`.
9. **CPP / FiO2 / Hb titration tree**: walk through the bedside titration step-by-step (`<Figure>`).
10. Clinical contexts:
    - Severe TBI (BOOST-II/III).
    - Pediatric severe TBI (figaji2024_pbto2_peds).
    - SAH with DCI (foreman2022, sandsmark2024_qeeg_dci).
    - Post-cardiac arrest (research).
11. Multimodal integration: PbtO2 + ICP + PRx as the gold-standard triplet; PbtO2 + microdialysis.
12. Setup (DeepDive): pre-insertion 1-2 h calibration drift; troubleshooting low values (probe trauma artefact); MRI compatibility.
13. Pitfalls: probe trauma transient low values 24-48 h post-insertion; sample-volume limitation (one region); ischaemia at the probe tip from haematoma.
14. Combine-with: `icp`, `prx`, `cppopt`, `microdialysis`, `sjvo2`.
15. Evidence summary + recent literature.
16. Quiz.

**New figures**:
- `/images/pbto2/licox-probe.svg`
- `/images/pbto2/pbto2-cpp-titration.svg`
- `/images/pbto2/pbto2-trend-events.svg`

**Citations**: `maas1993pbto2`, `okonkwo2017_boost2`, `bernard2025_boost3`, `figaji2009peds`, `figaji2024_pbto2_peds`, `marshall2020boost3`, `leroux2014_neurocrit_consensus`.

---

## 7. `onsd.mdx` (Tier 1)

**Audience**: emergency physician, PICU clinician, intensivist in resource-limited setting.

**Target length**: ~450 lines.

**Three vignettes**:
1. Suspected raised ICP in a 4-year-old at a peripheral hospital, no neurosurgery onsite. ONSD as triage to transfer.
2. Bacterial meningitis with raised ICP; ONSD trend over 24 h guiding therapy.
3. DKA cerebral oedema: ONSD rising 4 h into rehydration. Decision threshold.

**Section spine**:

1. Acronyms.
2. TldrCard.
3. Three vignettes.
4. What ONSD is, and what it is not: ultrasound measurement of the optic nerve sheath 3 mm posterior to the globe; a non-invasive ICP surrogate.
5. Technique (`<Figure>`): probe orientation, plane, depth, both eyes, axes.
6. Age-banded cutoffs (`<Figure>`): <1 y ~4.0 mm, 1-15 y ~4.5 mm, adult ~5.0-5.7 mm.
7. Pattern library: normal, raised (acute), raised (chronic with thickened sheath).
8. Widget: `ONSDDemo`.
9. **Clinical decision triage section**: ONSD-driven decisions (intubate? CT? transfer? ICP monitor?).
10. Clinical contexts:
    - Suspected raised ICP without invasive monitor.
    - Bacterial meningitis.
    - DKA cerebral oedema.
    - Post-traumatic in low-resource settings.
    - Hydrocephalus / shunt failure.
    - Idiopathic intracranial hypertension.
11. Multimodal integration: ONSD + TCD-PI + clinical (non-invasive triple); ONSD trend as a "follow the patient" tool when invasive monitoring is contraindicated or unavailable.
12. Setup (DeepDive): probe choice, gel quantity, eye-on-axis technique, repeatability bench.
13. Pitfalls: thickened chronic sheath, optic neuritis, optic disc oedema confounders, asymmetric ONSD with unilateral disease, operator dependence.
14. Combine-with: `non-invasive-icp`, `icp`, `tcd`, `fontanelle-us`.
15. Evidence summary.
16. Quiz.

**New figures**:
- `/images/onsd/onsd-anatomy.svg`
- `/images/onsd/onsd-by-age.svg`
- `/images/onsd/niicp-stack.svg`

**Citations**: `geeraerts2008`, `padayachy2012`, `padayachy2016_pediatric_onsd`, `robba2018_onsd_review`, `cardim2016_nicp_review`, `helmke1996`.

---

## Tier 1 completion checklist (per page)

- [ ] All 18 sections present (mirror TCD page).
- [ ] Three case-style vignettes at the top.
- [ ] Age-banded normative table (where relevant).
- [ ] BP / CPP / management section.
- [ ] 8+ clinical contexts subsections.
- [ ] Multimodal integration matrix table.
- [ ] DeepDive setup-and-technique section.
- [ ] Pitfalls list.
- [ ] 3-question Quiz with case stems.
- [ ] No em-dashes (grep returns 0).
- [ ] No `<SpeakerNote>`.
- [ ] All cite keys resolve.
- [ ] All figure src paths exist.
- [ ] `lastReviewed` updated.
- [ ] `npm run typecheck` passes.
