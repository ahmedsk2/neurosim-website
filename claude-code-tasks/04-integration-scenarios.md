# Integration scenario briefs (Tier 1, case-narrative spine)

**Updated 2026-05-17.** Every integration scenario is now **Tier 1**, using a case-narrative adaptation of the modality 18-section spine. Length target: ~3x existing, ~500-600 lines.

Each scenario is a worked clinical case showing how multiple modalities combine at the bedside. The case-narrative format preserves the storytelling that makes integration scenarios useful while adding the depth of a Tier 1 modality page.

## Integration Tier 1 spine

Use this for every scenario in this file:

1. **Frontmatter** (preserve `modalities` array; update `lastReviewed`).
2. **Acronyms callout** (when 5+ acronyms appear).
3. **TldrCard** (60-second version of the scenario and its take-home).
4. **Three patient vignettes**, the same scenario at different ages / severities / care settings:
   - **Vignette A**: canonical presentation in a school-age child.
   - **Vignette B**: same scenario in an infant / neonate or adolescent (age-band contrast).
   - **Vignette C**: an atypical or misleading presentation (the "this is where the textbook is wrong" case).
5. **The clinical question** explicitly framed (1-2 sentences).
6. **Pathophysiology refresher** (300-500 words; why this scenario produces the multimodal pattern; cite the foundation papers).
7. **The multimodal picture table** (what each monitor shows; what each finding rules in / rules out).
8. **Decision tree** (Mermaid `flowchart TD` for branching logic + `<Figure>` for the timeline / mechanism).
9. **Step-by-step bedside actions** (numbered 1-10; include drug doses where relevant).
10. **Management ladder / endpoints**: what success and failure look like, when to escalate, when to de-escalate.
11. **Subsections for variants**: 4-6 variant scenarios within the broader topic. E.g., for SAH vasospasm: aneurysmal vs AVM vs traumatic, pediatric vs adult, mild vs severe, MCA vs ACA vs basilar.
12. **Multimodal integration matrix table** (pairings; what each pair tells you that one alone does not).
13. **Worked alternative scenarios**: 2-3 brief "what if the diagnosis is wrong?" walk-throughs showing how the multimodal picture should change.
14. **Outcome data**: what the literature says about this scenario; cite 4-6 papers; include numbers (sensitivity / specificity, hazard ratios, time-to-treatment effects).
15. **Pitfalls** (expanded list, 5-8 items).
16. **Pediatric considerations** (`<Pediatric>` callout; what is different in children).
17. **Combine-with cross-links** to relevant modalities and other integration scenarios.
18. **Evidence summary + recent literature 2022-2025** (DeepDive; 4-6 recent papers).
19. **Self-check Quiz** (3 questions, case-style stems).

## How to use this file with the seed briefs

Each scenario below has a **seed brief** with the patient, clinical question, modalities row, decision tree summary, figure, and citations already chosen. Treat the seed as the spine; **build the Tier 1 expansion around it** using the spine above.

For every scenario, you must add at least:

- **Two more vignettes** beyond the seed (different ages or settings).
- **Pathophysiology refresher** (300-500 words; the seed lists the patient but not the mechanism in depth).
- **Subsections for 4-6 variants** of the scenario.
- **2-3 worked alternative scenarios** (what if the diagnosis is wrong).
- **15-25 citations** total (the seed lists 5-10; expand).
- **Multimodal integration matrix table** (the seed mentions which modalities; the table explicitly states what each pair adds).
- **Recent literature subsection** with 4-6 entries from 2022-2025.

## Common citation pool

Reuse the citation pool from `03-modalities-tier2.md` (clinical contexts). Especially for the outcome-data and pathophysiology subsections, lean heavily on:

- `leroux2014_neurocrit_consensus` (MMM consensus, foundational)
- `figaji2025_mmm_pediatric_consensus` (pediatric MMM consensus)
- `helbok2024_pediatric_mmm` (pediatric MMM update)
- `tasker2023mnm` (pediatric autoregulation review)
- The condition-specific canonical citations (e.g., `hoh2023sah_aha` for SAH, `kochanek2019_pbtf4` for severe TBI, `topjian2021aha_pediatric` for post-cardiac arrest).

## Vignette generation template (for integration scenarios)

For every scenario, the three vignettes follow this template:

- **Vignette A**: canonical presentation, school-age child (6-12 y), with all the multimodal pieces in place. The "textbook" version.
- **Vignette B**: same scenario in a younger patient (neonate, infant, toddler) or an older adolescent, where age-band differences matter (different thresholds, different drug doses, different MRI patterns).
- **Vignette C**: an atypical or misleading presentation. Examples:
  - For TCD-vasospasm: a child with rising MFV but LR < 3 (hyperaemia, not spasm).
  - For DKA cerebral oedema: a patient with normal MAP and normal HR but rising PI (silent rise).
  - For brain death: a patient with all clinical criteria met but persistent SSEP N20 (not brain dead).

Each vignette: 80-120 words, with specific numbers, ending in the question the integration answers.

## Variant subsection template

The "Subsections for variants" section (item 11 in the spine) should add 4-6 short subsections (each 100-200 words). Examples by scenario:

| Scenario | Variant subsections |
|---|---|
| TCD vs ICP vasospasm | Aneurysmal SAH, AVM-related SAH, traumatic SAH, pediatric vs adult, MCA vs ACA vs basilar territory, severe (LR > 6) vs mild (LR 3-6) |
| CPPopt targeting | Severe TBI (validated), SAH (emerging), pediatric severe TBI, when CPPopt is unobtainable, after decompressive craniectomy |
| Osmotherapy ICP NIRS | Mannitol vs hypertonic saline, age-banded dosing, severe TBI bolus, DKA pre-emptive, post-stroke malignant MCA, refractory case |
| MNM on ECMO | VA-ECMO non-pulsatile considerations, VV-ECMO, embolic detection (HITS), seizure monitoring, central cannulation vs peripheral |
| Brain death MNM | Pediatric (nakagawa2011_peds_bd) vs adult (greer2020), ancillary testing requirements, jurisdictional differences, complete vs incomplete clinical exam |
| Refractory status epilepticus | Convulsive vs non-convulsive, super-refractory, anti-NMDA encephalitis-related, FIRES, neonatal status |
| Pediatric stroke AIS | Anterior vs posterior circulation, thrombectomy-eligible vs not, peri-procedural monitoring, post-recanalisation hyperperfusion, moyamoya |
| HIE / post-arrest | Out-of-hospital vs in-hospital, hypothermia complications, prognostic certainty at 24h vs 72h vs 5d, neonatal vs older child |
| Pediatric AIS / Maya case | Same as pediatric stroke AIS, with age-banded thrombolysis windows |
| Meningitis / Idris case | Bacterial vs viral vs tuberculous, hydrocephalus management, vasculitic vasospasm, post-treatment monitoring |
| DKA / Asher case | New-onset T1DM vs known, severity-stratified rehydration, recognition timing windows, refractory cases |
| Inborn errors / Rafa case | Mitochondrial disease subtypes, Leigh, MELAS, organic acidaemias, urea cycle defects, monitoring during decompensation |

Pick the variants that fit the scenario. Aim for 4-6 per scenario.

---

# Seed briefs

(Original Tier 2 seeds preserved below. Apply the integration Tier 1 spine and the upgrade list above when expanding each.)

---

## 1. `tcd-vs-icp-vasospasm.mdx`

**Patient**: a 14-year-old SAH day 6, EVD ICP 12 stable, TCD MFV rising 80 → 140 cm/s right MCA, LR 4.2.

**Question**: is this DCI from spasm, hyperaemia, or something else?

**Modalities row**: ICP (stable, low), TCD (rising MFV + high LR), NIRS (rSO2 falling on the affected side), qEEG (alpha-delta ratio dropping), clinical (subtle right-arm drift).

**Decision tree**: rising MFV + LR > 3 + concordant qEEG drop → spasm-driven DCI; angiography / spasmolytics. Rising MFV + LR < 3 → hyperaemia, look for sepsis / fever / anaemia.

**Figure**: `/images/integration/tcd-vs-icp-vasospasm/timeline.svg`.

**Citations**: `mastantuono2018_tcd`, `lindegaard1989`, `topcuoglu2017_vasospasm`, `hoh2023sah_aha`, `rass2021dci_review`, `connolly2012_sah_aha`, `sandsmark2024_qeeg_dci`.

**Pediatric note**: pediatric SAH vasospasm thresholds defer to ratios + within-child trend.

---

## 2. `cppopt-targeting.mdx`

**Patient**: severe TBI 12-year-old day 2; ICP 18, MAP 75, CPP 57. The COGiTATE-style 4-hour CPPopt loop produces a U-curve vertex at CPP 62.

**Question**: lift MAP into the CPPopt ± 5 mmHg band, or stay on a fixed CPP > 50 protocol?

**Modalities**: ICP, PRx, optional PbtO2 / Mx for cross-validation.

**Decision tree**: U-curve confidence → re-target MAP; no clear U-curve → wait, stay on fixed CPP.

**Figure**: `/images/integration/cppopt-targeting/dose-response.svg`.

**Citations**: `aries2012cppopt`, `beqiri2024_cogitate`, `tas2022peds`, `tas2024_pediatric_cppopt`, `tas2025_cogitate_followup`, `donnelly2017mapopt`.

---

## 3. `osmotherapy-icp-nirs.mdx`

**Patient**: severe TBI in a 5-year-old; ICP 30; team decides on 3% NaCl bolus 5 mL/kg.

**Question**: what does each modality show during and after the bolus?

**Trajectory**: ICP falls (target by 30 min); NIRS rSO2 transiently rises (osmotic vasodilation); serum Na rises; CPP improves; urine output increases if mannitol vs minimal if HTS.

**Decision tree**: choosing HTS vs mannitol based on patient state (sodium baseline, kidney function, volume status).

**Figure**: `/images/integration/osmotherapy-icp-nirs/triple-trend.svg`.

**Citations**: `kochanek2019_pbtf4`, `kochanek2019pbtf`, `roberts2019` (existing if any), pediatric mannitol vs HTS papers.

**Widget**: `OsmotherapyExplorer`.

---

## 4. `mnm-on-ecmo.mdx`

**Patient**: a 6-year-old on VA-ECMO post-cardiac arrest; on day 3 a left-arm HITS cluster of 10 on TCD over 1 hour.

**Question**: clinically silent embolus burden or impending stroke?

**Modalities row**: TCD (HITS, pulsatility recovery), aEEG (background continuity), NIRS (asymmetry), serial neuro exam.

**Decision tree**: HITS + clinical change → urgent CT; HITS + aEEG change → escalate anti-coagulation / circuit review.

**Figure**: `/images/integration/mnm-on-ecmo/embolus-detection.svg`.

**Citations**: `lorusso2017_elso_neuro`, `cho2024_ecmo_outcomes`, `larovere2017_ecmo`, `naim2023_brain_injury_pccm`.

---

## 5. `brain-death-mnm.mdx`

**Patient**: severe TBI day 5 in a 13-year-old (Aliyah) (continues to wlst-organ-donation case); pentobarbital washed out; formal brain-death exam.

**Question**: when do ancillary tests (TCD, EEG, CTA, SSEP) add value? When are they required?

**Decision tree**: jurisdictional pathway; when clinical exam is incomplete or apnoea test contraindicated → ancillary.

**Figure**: `/images/integration/brain-death-mnm/ancillary-tree.svg`.

**Citations**: `greer2020_braindeath`, `nakagawa2011peds_bd`, `rasulo2008`, `wijdicks2005`, `wijdicks2006`, `kondziella2017`.

**Pediatric note**: nakagawa2011 pediatric brain-death guidelines (apnoea test, observation periods).

---

## 6. `mnm-in-the-newborn.mdx`

**Patient**: term infant with severe HIE; cooled day 1; aEEG isoelectric → discontinuous over 48 h; NIRS rSO2 high (luxury); TCD PI low.

**Question**: which monitoring bundle, and how to predict outcome.

**Bundle**: aEEG continuity + MRI day 4-5 + clinical exam.

**Figure**: `/images/integration/mnm-in-the-newborn/hie-monitoring-bundle.svg`.

**Citations**: `shankaran2005hie_nichd`, `toet2002`, `hellstromwestas2006`, `pressler2017neonatal`, `sansevere2023_neonatal_ceeg`, `kirschen2020_pedshie_tcd`, `naim2023_brain_injury_pccm`.

---

## 7. `dka-cerebral-edema.mdx`

**Patient**: a 9-year-old (Asher) in DKA with rapidly progressive headache, then GCS drop 4 hours into rehydration. TCD PI rising 0.9 → 1.5; ONSD 5.6 mm; pupillary asymmetry developing.

**Question**: pre-empt herniation with osmotherapy.

**Decision tree**: PI trend + ONSD + clinical → hyperosmolar therapy + airway + neuro consult.

**Figure**: `/images/integration/dka-cerebral-edema/timeline.svg`.

**Citations**: `glaser2001`, `muir2004`, `kuppermann2018_pecarn_dka`, `glaser2024_dka_review`.

---

## 8. `meningitis-encephalitis.mdx`

**Patient**: a 4-year-old (Idris) with bacterial meningitis, GCS 11, raised ICP suspected; ONSD 5.4; bedside TCD PI 1.5.

**Question**: confirm raised ICP non-invasively; pursue ICP monitoring; manage haemodynamics.

**Decision tree**: ONSD + TCD-PI threshold → CT / ICP placement vs medical management.

**Figure**: `/images/integration/meningitis-encephalitis/icp-pathway.svg`.

**Citations**: `tunkel2004_idsa_meningitis`, `tunkel2017idsa_encephalitis`, `vandebeek2016eu_meningitis`, `brouwer2010_dexamethasone_meta`.

---

## 9. `pbto2-cpp-titration.mdx`

**Patient**: severe TBI day 2 with ICP 18 (acceptable), CPP 65, but PbtO2 12 mmHg.

**Question**: where in the titration tree are you?

**Tree**: check CPP → raise to 70-75; check PaO2 → increase FiO2; check Hb → transfuse if < 7-8 g/dL; check fever / sedation / sepsis; check probe trauma transient.

**Figure**: `/images/integration/pbto2-cpp-titration/boost2-3.svg`.

**Citations**: `okonkwo2017_boost2`, `bernard2025_boost3`, `figaji2009peds`, `figaji2024_pbto2_peds`, `marshall2020boost3`.

---

## 10. `refractory-status-epilepticus.mdx`

**Patient**: a 5-year-old (Noah) with febrile illness; seizing > 30 min; first-line benzo failed; cEEG shows continuous electrographic seizures.

**Question**: ESETT-validated second-line; when to escalate to continuous infusion; cEEG endpoint.

**Decision tree**: ESETT-validated drugs; continuous infusion choices (midazolam, pentobarbital, ketamine); aEEG / cEEG endpoints (burst-suppression).

**Figure**: `/images/integration/refractory-status-epilepticus/treatment-ladder.svg`.

**Citations**: `glauser2016esett`, `kapur2019eclipse_se`, `trinka2015_status_definition`, `herman2015acns_ceeg`, `hirsch2021acns`.

---

## 11. `eeg-tcd-non-convulsive.mdx`

**Patient**: a sedated PICU TBI patient with intermittent aEEG narrowing + TCD systolic peaks every 3-5 min.

**Question**: NCSE vs sedation-induced burst-suppression with paradoxical flow swings.

**Decision tree**: turn down sedation if safe; sustained aEEG narrowing without sedation → NCSE.

**Figure**: `/images/integration/eeg-tcd-non-convulsive/pair-up.svg`.

**Citations**: `herman2015acns_ceeg`, `claassen2004`, `foreman2012`, `foreman2022`.

---

## 12. `inborn-errors-encephalopathy.mdx`

**Patient**: an 18-month-old (Rafa) with regression and stereotyped movements; MRI shows bilateral basal ganglia T2 hyperintensities. Suspected Leigh syndrome.

**Question**: monitoring strategy and prognostic markers.

**Approach**: aEEG / cEEG for sub-clinical seizures; NIRS for autoreg surrogate; metabolic workup; genetic confirmation.

**Figure**: `/images/integration/inborn-errors-encephalopathy/leigh-mri.svg`.

**Citations**: `parikh2017_mito_consensus`, `wedatilake2013_leigh`.

---

## 13. `resource-limited-bedside.mdx`

**Patient**: a 3-year-old (Amani) at a centre without invasive ICP capability; presents with raised ICP signs.

**Question**: how to monitor.

**Bundle**: clinical exam + ONSD + fontanelle US + handheld TCD-PI. Sequential trending more useful than single snapshots.

**Figure**: `/images/integration/resource-limited-bedside/three-modality-bundle.svg`.

**Citations**: `padayachy2012`, `padayachy2016_pediatric_onsd`, `cardim2016_nicp_review`, `figaji2025_mmm_pediatric_consensus`.

---

## 14. `family-communication-mnm.mdx`

**Vignettes (three)**: prognosis after HIE, brain-death disclosure, WLST discussion.

**Question**: what to say, what to avoid; the role of MNM evidence in honest communication.

**Templates**: two-column "say this" / "avoid this" for each scenario.

**Figure**: `/images/integration/family-communication-mnm/conversation-templates.svg`.

**Citations**: `meert2015_palliative_care`, `topjian2021aha_pediatric`.

---

## 15. `wlst-organ-donation.mdx`

**Patient**: Aliyah, continues from `brain-death-mnm.mdx`. DCD pathway as one of three options.

**Question**: how MNM contributes to the WLST / DCD conversation.

**Decision tree**: DCD eligibility, hands-off period, retrieval team firewall.

**Figure**: `/images/integration/wlst-organ-donation/dcd-pathway.svg`.

**Citations**: `greer2020_braindeath`, `nakagawa2011peds_bd`, `meert2015_palliative_care`.

---

## 16. `prx-vs-orx-discordance.mdx`

**Patient**: severe TBI day 3 with PRx +0.4 (impaired) but ORx -0.1 (intact). Sepsis day 1.

**Question**: which to trust, why they disagree.

**Mechanism**: macro vs micro autoregulation; sepsis-driven microvascular shunting; scalp NIRS contamination.

**Figure**: `/images/integration/prx-vs-orx-discordance/mechanism.svg`.

**Citations**: `brady2010orx`, `lee2009ndnirs`, `rivera-lara2017autoreg`, `oddo2017`.

---

## 17. `discordance-triage.mdx`

**Patient**: arbitrary multimodal discordance. ICP says one thing, NIRS another, TCD a third.

**Question**: triage strategy for the bedside clinician.

**Flowchart**: when multimodal monitors disagree, prioritise (clinical exam → highest-validated modality → cross-check signal quality → fall back to default thresholds).

**Figure**: `/images/integration/discordance-triage/flowchart.svg`.

**Citations**: `leroux2014_neurocrit_consensus`, `figaji2025_mmm_pediatric_consensus`, `helbok2024_pediatric_mmm`.

**Widget**: `MultimodalDiscordance`.

---

## 18. `pediatric-stroke-ais.mdx`

**Patient**: Maya, 8 y, with sudden right-arm weakness; CT angio M1 occlusion; thrombectomy considered.

**Question**: hyperacute monitoring before, during, after intervention.

**Trajectory**: TCD continuous monitoring during procedure; NIRS for hyperperfusion post-recanalisation; cEEG for sub-clinical seizures.

**Figure**: `/images/integration/pediatric-stroke-ais/maya-case.svg`.

**Citations**: `ferriero2019aha_pedstroke`, `sun2020_pediatric_thrombectomy`, `rivkin2016_TIPS`, `larovere2018_pedsais`.

---

## Integration completion checklist (per scenario)

- [ ] 12-section spine present.
- [ ] One Mermaid or SVG decision tree.
- [ ] Multimodal picture table (what each modality shows).
- [ ] Pediatric callout.
- [ ] 3-question Quiz.
- [ ] No em-dashes; no `<SpeakerNote>`.
- [ ] `lastReviewed` updated.
- [ ] Cite keys resolve.
- [ ] `npm run typecheck` passes.
