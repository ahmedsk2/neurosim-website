# Modality briefs, Group B (Tier 1)

**File name is historical.** As of the 2026-05-17 update, every modality in this file is **Tier 1**, matching the depth of the TCD page (`src/content/modalities/tcd.mdx`). The file name `03-modalities-tier2.md` is preserved so existing references in commits and external notes do not break.

Nineteen modality pages. Each gets the **full TCD 18-section spine**, three bedside vignettes, age-banded normative table where relevant, BP / CPP / condition-specific management section, 8+ clinical contexts, multimodal integration matrix, recent literature, 3-question Quiz.

## Tier 1 spine (re-stated; use for every page in this file)

1. Frontmatter (update `lastReviewed`).
2. Acronyms callout.
3. TldrCard (60-second version).
4. **Three bedside vignettes** (different ages, severities, or care settings).
5. What X is, and what it is not (primer with the canonical equation or principle).
6. Anatomy / placement / windows (with `<Figure>`).
7. The signal / waveform / measurement detail (with `<Figure>`).
8. The numbers to record (six-pack table).
9. What is normal (age-banded table for pediatric pages).
10. What is abnormal (pattern library with `<Figure>` showing side-by-side examples).
11. Try it (existing widgets).
12. Management section (BP / CPP / dosing titration where relevant; condition-specific where not).
13. **Clinical contexts (8+ subsections)**: each subsection 80-150 words, citing the canonical evidence and stating bedside thresholds / actions. Cover SAH, severe TBI, AIS, HIE, ECMO, meningitis, brain death, DKA, sickle cell, and any modality-specific scenarios.
14. Multimodal integration matrix (table).
15. Setup and technique (DeepDive).
16. Pitfalls.
17. Combine-with cross-links.
18. Evidence summary + recent literature (DeepDive).
19. Self-check Quiz.

## How to use this file with the seed briefs below

Each page below has a **seed brief** with the vignette, key sections, citations, widgets, and figures already chosen. Treat the seed as the spine of the page; **build the Tier 1 expansion around it**.

For every page, you must add at least:

- **Two more vignettes** beyond the seed (different ages or settings).
- **Anatomy / placement subsection** with a figure (use the seed figure as Fig. 1; add 1-2 more figures if the page needs them).
- **Management section** even on pages that do not have a direct BP / CPP management role (give the equivalent: dose titration, sedation depth, etc.).
- **At least 8 clinical contexts** (seed lists 3-4; expand to 8 by following the standard panel: SAH, severe TBI, pediatric AIS, HIE / post-arrest, pediatric ECMO, meningitis, brain death, DKA, sickle cell, and any modality-specific scenario).
- **Multimodal integration matrix** with ≥4 pairings.
- **Setup and technique DeepDive** with at least 6 numbered steps.
- **15-30 citations** total across the page (the seed lists 5-10; add more from `05-references-to-add.md` and existing references).
- **Recent literature subsection** with 4-6 entries from 2022-2025.

## Common citation pool (for "clinical contexts" subsections)

When expanding a page's clinical-contexts panel to the full 8+ topics, the standard citations are:

| Context | Canonical citation keys |
|---|---|
| Severe TBI | `kochanek2019_pbtf4`, `chesnut2012best`, `guiza2015_b_dose`, `tasker2023_pccm_review`, `leroux2014_neurocrit_consensus` |
| SAH / DCI | `hoh2023sah_aha`, `connolly2012_sah_aha`, `rass2021dci_review`, `mastantuono2018_tcd`, `sandsmark2024_qeeg_dci` |
| Pediatric AIS | `ferriero2019aha_pedstroke`, `sun2020_pediatric_thrombectomy`, `rivkin2016_TIPS`, `larovere2018_pedsais` |
| HIE / post-cardiac arrest | `shankaran2005hie_nichd`, `moler2015thapca_oh`, `topjian2021aha_pediatric`, `naim2023_brain_injury_pccm`, `kirschen2020_pedshie_tcd` |
| Pediatric ECMO | `lorusso2017_elso_neuro`, `cho2024_ecmo_outcomes`, `larovere2017_ecmo` |
| Meningitis / encephalitis | `tunkel2004_idsa_meningitis`, `tunkel2017idsa_encephalitis`, `vandebeek2016eu_meningitis`, `brouwer2010_dexamethasone_meta` |
| Brain death | `greer2020_braindeath`, `nakagawa2011peds_bd`, `wijdicks2005`, `wijdicks2006`, `rasulo2008` |
| DKA cerebral oedema | `glaser2001`, `muir2004`, `kuppermann2018_pecarn_dka`, `glaser2024_dka_review` |
| Sickle cell (TCD-screening modalities only) | `adams1998_stop`, `adams2005_stop2` |
| Refractory SE | `glauser2016esett`, `kapur2019eclipse_se`, `trinka2015_status_definition` |
| Pediatric multimodal consensus | `figaji2025_mmm_pediatric_consensus`, `helbok2024_pediatric_mmm`, `tasker2023mnm` |

Pick the 8 contexts most relevant for the modality. Skip "Sickle cell" for modalities that play no STOP-screening role (most pages).

## Vignette generation template

For every page, the three vignettes must follow this template:

- **Vignette A**: an acute event in a school-age child (~6-12 y) where the modality drives an immediate decision.
- **Vignette B**: a different age (preterm / neonate / infant OR adolescent) demonstrating age-band differences.
- **Vignette C**: a counter-intuitive or "this is where it can mislead you" case, often a pitfall demonstration (e.g., NIRS rSO2 high but cortex is dead; PI low with high EDV in HIE).

Each vignette: 60-100 words, with specific numbers (age, MAP, ICP, MFV, PI, etc.), ending in the question the modality answers or the next action.

## Per-page seed briefs

The seed briefs below are the **starting point**, not the finished plan. Apply the Tier 1 spine and the "you must add at least" list above to each.

---

(The 19 per-page briefs that follow are the seeds. Expand each one into a Tier 1 page using the spine above.)

---

## Tier 1 spine (compact form)

For quick recall while writing:

1. Acronyms
2. TldrCard
3. Three vignettes
4. What it is, and is not
5. Anatomy (Figure)
6. Signal (Figure)
7. Numbers (table)
8. Normal (age-band table)
9. Abnormal (pattern library, Figure)
10. Widgets
11. Management section
12. 8+ clinical contexts
13. Multimodal integration matrix (table)
14. Setup (DeepDive)
15. Pitfalls
16. Combine-with
17. Evidence + recent literature (DeepDive)
18. Quiz

---

## Group B page list, in recommended execution order

After all of Group A (`02-modalities-tier1.md`) is complete:

1. clinical-exam
2. pupillometry
3. non-invasive-icp
4. qeeg
5. microdialysis
6. pediatric-stroke-monitoring
7. cpp
8. mx
9. orx
10. rap
11. aeeg
12. bis
13. sjvo2
14. brain-temp
15. evoked-potentials
16. fontanelle-us
17. direct-cbf
18. ecog-sd
19. advanced-nirs

This ordering puts the "almost Tier 1 anyway" pages first (1-6) while Claude Code is still fresh, and leaves the niche / research-grade pages (16-19) for the end when the patterns are well-rehearsed.

---

# Seed briefs

(Original Tier 2 seeds preserved below. Apply the Tier 1 spine and the upgrade list above when expanding each.)

---

## 1. `clinical-exam.mdx`

**Vignette**: a 6-year-old post-MVC with GCS 9 (E2V2M5) on arrival, FOUR score 13. Anisocoria right > left. Disposition decision in 60 seconds.

**Sections**:
- GCS components and pediatric adaptations (P-GCS for preverbal; Adelaide).
- FOUR score (eye, motor, brainstem, respiration); advantages over GCS for intubated patients.
- Pupillary exam (size, light, NPI from pupillometer overlap).
- Brainstem reflexes ladder.

**Figure**: `/images/clinical-exam/gcs-vs-four.svg`.

**Citations**: `teasdale1974`, `teasdale2014`, `wijdicks2005`, `wijdicks2006`, `cohen2009four`, `cohen2015`, `jamal2017four`, `reith2016gcsreliability`, `alkhachroum2024gcslimits`.

**Widgets**: `GCSChart`, `GCSChartQuick`.

---

## 2. `cpp.mdx`

**Vignette**: a 14-year-old SAH with MAP 95, ICP 18, CPP 77. After hyperosmolar therapy, MAP 110, ICP 20, CPP 90. PRx +0.4: above ULA?

**Sections**:
- CPP = MAP − ICP, but the two paths are not equivalent.
- Age-banded CPP minimums (35-40 neonate, 40-50 infant, 50-60 toddler, 60-70 older child / adult; kochanek2019_pbtf4).
- Fixed thresholds vs individualised CPPopt.
- The risk of pushing CPP too high (ARDS-like lung injury, hyperaemia, PRESS-like).

**Figure**: `/images/cpp/triangle-equation.svg`.

**Citations**: `rosner1995cppmanagement` (existing?), `kochanek2019_pbtf4`, `aries2012cppopt`, `donnelly2017mapopt`, `depreitere2014icpdose`.

**Widgets**: `CPPTriangle`, `CPPoptUCurve`.

---

## 3. `mx.mdx`

**Vignette**: severe TBI with no ICP monitor; TCD over MCA with arterial line; Mx +0.35 sustained. Implication for BP management.

**Sections**:
- Mx as TCD-derived PRx surrogate.
- Methodology (10-s MFV averages, 5-min Pearson with CPP or MAP).
- Thresholds and time constants.
- Where Mx works (TBI, SAH, peri-arrest research) and where it does not (irregular rhythms, low slow-wave power).

**Figure**: `/images/mx/mx-vs-prx-arch.svg` (reuse `MxVsPrxArchitecture` if present).

**Citations**: `czosnyka1996mx`, `aaslid1989_autoreg`, `lang2003poss`, `aries2012cppopt`, `donnelly2017mapopt`, `rivera-lara2017autoreg`.

**Widgets**: `MxCalculator`, `MAPoptUCurve`.

---

## 4. `orx.mdx`

**Vignette**: preterm SafeBoosC patient; ORx +0.4 after dopamine wean; rSO2 still in target. What changed?

**Sections**:
- ORx as NIRS-derived autoregulation index.
- Methodology (rSO2 vs MAP slow-wave correlation).
- Thresholds and patient populations validated.
- Limitations vs PRx and Mx (regional, mixed compartment, scalp contamination).

**Figure**: `/images/orx/orx-trend.svg`.

**Citations**: `brady2007piglet`, `brady2010orx`, `lee2009ndnirs`, `oddo2017`, `rivera-lara2017autoreg`, `naim2023_brain_injury_pccm`.

**Widgets**: `OrxCalculator`.

---

## 5. `rap.mdx`

**Vignette**: ICP 16 in a 7-year-old severe TBI, RAP +0.7. Implication for the next 30 minutes.

**Sections**:
- RAP as a moving correlation between ICP pulse amplitude and mean ICP.
- The compliance zones (RAP near 0 = good compliance; +1 = near exhaustion; falling below 0 at very high ICP = decompensation).
- Clinical use as a heads-up that a benign-looking ICP is about to spike.
- Pediatric data (sparse; lewis2014peds, kazimierska2021).

**Figure**: `/images/rap/rap-vs-icp.svg`.

**Citations**: `czosnyka1996rap`, `kim2009rap`, `howells2017rap`, `kazimierska2021`, `lewis2014peds`.

**Widgets**: `RAPDemo`.

---

## 6. `aeeg.mdx`

**Vignette**: neonatal HIE day 2 cooled infant, aEEG with discontinuous pattern; later evolves to continuous normal voltage. Outcome implications.

**Sections**:
- aEEG as the bedside-friendly cEEG envelope.
- Five canonical patterns (Hellstrom-Westas classification).
- Sleep-wake cycling, time to recovery.
- Pediatric / neonatal use vs adult limited utility.

**Figure**: `/images/aeeg/aeeg-patterns.svg`.

**Citations**: `hellstromwestas2006`, `toet1999`, `toet2002`, `hellstrom2008`, `pressler2017neonatal`, `sansevere2023_neonatal_ceeg`.

**Widgets**: `aEEGGenerator`.

---

## 7. `qeeg.mdx`

**Vignette**: SAH day 6 with alpha-delta ratio falling 30% over 6 hours, still no clinical signs of DCI. What to do.

**Sections**:
- qEEG as the data-reduction layer on top of cEEG.
- Key trends: alpha-delta ratio, suppression burst ratio, total power, asymmetry.
- DCI detection in SAH (sandsmark2024_qeeg_dci, claassen2004).
- Limitations (sedation effect on alpha; need for skilled interpretation).

**Figure**: `/images/qeeg/qeeg-spectrogram.svg`.

**Citations**: `claassen2004`, `claassen2013`, `foreman2012`, `foreman2022`, `sandsmark2024_qeeg_dci`, `williams2024qeeg`, `herman2015acns_ceeg`.

**Widgets**: `qEEGSpectrogram`.

---

## 8. `bis.mdx`

**Vignette**: pediatric ICU patient on midazolam + fentanyl + cisatracurium; BIS 35-45 target during titration.

**Sections**:
- BIS as a proprietary frontal-EEG-derived sedation index.
- Range correlations to clinical sedation depth.
- Limitations: EMG contamination, age-dependent baseline, ketamine paradox, neonatal unreliability.
- Where BIS is useful (sedation titration in paralysed pediatric ICU patients) and where it is not (prognostication, seizure detection).

**Figure**: `/images/bis/bis-vs-sedation.svg`.

**Citations**: `rampil1998`, `sigl1994bis`, `davidson2005bis`, `mckeever2014bis`, `whitlock2014`.

**Widgets**: `BISDemo`.

---

## 9. `pupillometry.mdx`

**Vignette**: post-cardiac-arrest 5-year-old at 72 h; NPI persistently 0 bilaterally with absent constriction velocity. Prognostic implication.

**Sections**:
- Quantitative pupillometry vs clinical exam (NPI 0-5 scale; constriction velocity; latency; max-min size).
- Validated thresholds: NPI < 3 abnormal; < 2 strongly suggests catastrophic injury.
- Trend over absolute (sequential NPI more useful than single).
- Pediatric data (freeman2020_pediatric_pupil, kerscher2023_npi).

**Figure**: `/images/pupillometry/npi-vs-clinical.svg`.

**Citations**: `oddo2018_npi_orange`, `oddo2023orange`, `oddo2025_pupillometry_arrest`, `olson2016npi`, `freeman2020_pediatric_pupil`, `kerscher2023_npi`, `petrosino2025orange`.

**Widgets**: `PupilTrainer`.

---

## 10. `microdialysis.mdx`

**Vignette**: severe TBI day 3 with normal ICP, normal CPP, normal PbtO2, but L/P ratio rising to 30. What does it mean.

**Sections**:
- Microdialysis principle (semi-permeable catheter; perfusate; recovery of small molecules).
- The canonical four (glucose, lactate, pyruvate, glutamate); the L/P ratio as ischaemia vs mitochondrial dysfunction marker.
- Sampling cadence and limitations (60-min minimum; one tissue zone).
- Pediatric data (sparse).

**Figure**: `/images/microdialysis/lpr-grid.svg`.

**Citations**: `ungerstedt1991`, `hillered2005`, `hutchinson2015_md`, `hutchinson2016`, `leroux2014_neurocrit_consensus`, `tolias2013peds`.

**Widgets**: `MicrodialysisGrid`.

---

## 11. `sjvo2.mdx`

**Vignette**: severe TBI titration of hyperventilation; SjvO2 falling to 50% as PaCO2 falls.

**Sections**:
- Retrograde IJ catheter; tip at the jugular bulb.
- Global cerebral oxygen extraction (CMRO2 by Fick principle).
- Thresholds (55-75% normal; < 55% extraction stressed; > 75% luxury perfusion).
- Limitations vs PbtO2 (global vs regional).

**Figure**: `/images/sjvo2/jugular-anatomy.svg`.

**Citations**: `gopinath1994sjvo2`, `robertson1989sjvo2`, `cruz1992`, `leroux2014_neurocrit_consensus`.

**Widgets**: `SjvO2Demo`.

---

## 12. `non-invasive-icp.mdx`

**Vignette**: ED-presenting 10-year-old with suspected raised ICP, no invasive monitor. ONSD + TCD-PI estimate ICP 25-30.

**Sections**:
- Methods catalogue: TCD-PI (Bellner regression), ONSD, Brain4Care extensometer, tympanic membrane displacement, MRI volume.
- Accuracy summary by method (cardim2016_nicp_review, robba2018_onsd_review).
- Best use cases: triage, screening, monitoring trend in patients where invasive monitoring is contraindicated.
- Pitfalls of each method.

**Figure**: `/images/non-invasive-icp/methods-comparison.svg`.

**Citations**: `bellner2004`, `bellner2004ebic`, `geeraerts2008`, `padayachy2012`, `padayachy2016_pediatric_onsd`, `robba2018_onsd_review`, `cardim2016_nicp_review`, `rasulo2022_arrest`, `rasulo2024_b4c`, `brasil2022_waveform`, `cardim2023nicp`, `robba2017nicp`, `czosnyka2012ni`.

**Widgets**: `NonInvasiveICPDemo`, `ONSDDemo`.

---

## 13. `brain-temp.mdx`

**Vignette**: severe TBI in a 9-year-old; core 36.5; brain temperature monitor reads 38.4. Implications.

**Sections**:
- Brain-core temperature gradient (typically 0.5-2 C higher in brain; gradient widens with injury).
- Measurement: combined PbtO2/temperature probe; rectal/bladder/oesophageal as core.
- CMRO2 reduction with hypothermia.
- Fever and brain temperature management.

**Figure**: `/images/brain-temp/brain-core-gradient.svg`.

**Citations**: `henker1998`, `mellergard2002` (existing?), `polderman2009`, `andrade2021`.

**Widgets**: `BrainTempDemo`.

---

## 14. `direct-cbf.mdx`

**Vignette**: SAH day 8 with high TCD MFV but thermal-diffusion CBF showing 18 mL/100g/min in the at-risk territory. DCI confirmed.

**Sections**:
- Methods: thermal diffusion (Hemedex/Bowman), laser Doppler, xenon CT, perfusion CT/MR.
- Thresholds: Astrup cascade applied to direct CBF.
- Research-grade in most centres; limited bedside use.
- Pediatric data sparse.

**Figure**: `/images/direct-cbf/thermal-diffusion.svg`.

**Citations**: `vajkoczy2000tdf`, `kirkpatrick1994ldf`, `kirkpatrick1995`.

**Widgets**: `ThermalCBFDemo`.

---

## 15. `evoked-potentials.mdx`

**Vignette**: comatose post-arrest child at 72 h; bilateral absent SSEP N20. Prognostic implication.

**Sections**:
- SSEPs (cortical and subcortical pathway).
- BAERs (waves I-V; brainstem function).
- Visual EPs (less used in ICU).
- Use in prognosis (post-arrest, severe TBI), in monitoring during cardiac surgery, in brainstem testing.

**Figure**: `/images/evoked-potentials/ssep-baer-pathway.svg`.

**Citations**: `logi2003`, `amorim2022`, `marshall2020`, `topjian2021aha_pediatric`.

**Widgets**: `SSEPViewer`.

---

## 16. `ecog-sd.mdx`

**Vignette**: severe TBI day 3 with subdural ECoG strip; cluster of SDs over 4 hours followed by haematoma expansion.

**Sections**:
- Subdural strip placement during surgery.
- SD detection: large negative DC shift, suppression of high-frequency activity.
- COSBID recommendations (dreier2017sd_cosbid).
- Pediatric data sparse; mostly adult TBI / SAH research centres.

**Figure**: `/images/ecog-sd/cosbid-electrode.svg`.

**Citations**: `leao1944`, `strong2002`, `dreier2009`, `dreier2017sd_cosbid`, `hartings2017cosbid`, `hartings2020_sd_natural_history`, `hartings2024_sd_intervention`.

**Widgets**: `SDPropagation`, `SpreadingDepolarizationAnimator`.

---

## 17. `fontanelle-us.mdx`

**Vignette**: 6-month-old with bulging fontanelle and irritability; through-fontanelle ultrasound shows ventriculomegaly and a small IVH.

**Sections**:
- Window: anterior fontanelle until ~18 months.
- Coronal and sagittal sweeps; what to look for (ventricle size, IVH grade, PVL, oedema).
- Through-fontanelle TCD as a flow surrogate.
- Limitations vs cross-sectional imaging.

**Figure**: `/images/fontanelle-us/transfontanellar.svg`.

**Citations**: `papile1978` (IVH grading), Pinto / pediatric US references (search PubMed; add as needed).

**Widgets**: none (placeholder if available).

---

## 18. `advanced-nirs.mdx`

**Vignette**: research-protocol preterm with diffuse correlation spectroscopy showing CBF index falling pre-IVH.

**Sections**:
- Diffuse correlation spectroscopy (DCS): absolute CBF index by photon-decorrelation.
- Time-resolved NIRS (TR-NIRS) and frequency-domain NIRS (FD-NIRS): absolute tissue oxygenation.
- Use cases: research and emerging clinical in CHD, preterm, post-arrest.
- Cost / availability gap vs cwNIRS.

**Figure**: `/images/advanced-nirs/dcs-trnirs.svg`.

**Citations**: `lovett2022noninvasive`, `andrade2021`.

**Widgets**: none.

---

## 19. `pediatric-stroke-monitoring.mdx`

**Vignette**: an 8-year-old with sudden-onset right-arm weakness; CT angio shows M1 occlusion; thrombectomy considered.

**Sections**:
- Childhood AIS vs sinovenous thrombosis differential.
- Hyperacute monitoring during thrombolysis or thrombectomy: continuous TCD, NIRS, cEEG.
- Post-recanalisation hyperperfusion management: BP lowering, NIRS-driven targets.
- Moyamoya progression monitoring.

**Figure**: `/images/pediatric-stroke-monitoring/aha-pathway.svg`.

**Citations**: `ferriero2019aha_pedstroke`, `sun2020_pediatric_thrombectomy`, `rivkin2016_TIPS`, `larovere2018_pedsais`.

**Widgets**: `LindegaardCalculator` (moyamoya use).

---

## Tier 2 completion checklist (per page)

- [ ] 12-section spine present.
- [ ] One vignette at the top.
- [ ] One new figure (placeholder fine).
- [ ] 3-question Quiz at bottom.
- [ ] No em-dashes.
- [ ] No `<SpeakerNote>`.
- [ ] `lastReviewed` updated.
- [ ] Cite keys resolve.
- [ ] `npm run typecheck` passes.
