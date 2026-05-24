# Figures to create as placeholder SVGs

Each entry is a placeholder SVG file to create under `public/images/<page>/<slug>.svg`. The TCD page placeholders (`public/images/tcd/*.svg`) are the model: dark background, schematic style, clear "PLACEHOLDER" label so a future pass can polish.

These files serve two purposes:
1. The pages render without broken-image icons.
2. The captions are the brief for the eventual polished version.

## Literature audit (2026-05-17)

The captions below have been cross-checked against the primary literature where the figure depicts specific numeric thresholds, ranges, or trial-derived values. When you create each SVG, **the cited paper is the source of truth**, not the caption shorthand. A few specific gotchas Claude Code should respect:

- **Pediatric ICP treatment thresholds**: PBTF 2019 (Kochanek) recommends **20 mmHg for all pediatric ages** (weak recommendation, weaker evidence in infants). Age-banded thresholds (10 mmHg for neonates, 15 for infants) are **proposals from the literature, not guideline values**. Label them as heuristic.
- **Lundberg wave amplitudes**: A-waves reach **50-100 mmHg** (Lundberg 1960), not "20 mmHg+". The threshold for "plateau wave" is sustained elevation above baseline, not a fixed amplitude.
- **Astrup CBF thresholds**: original Astrup 1981 numbers were 18 mL/100g/min (electrical failure) and 10 (membrane failure). Modern reviews (Hossmann 1994) give a gradient, not hard cutoffs.
- **PRx threshold for LLA/ULA**: 0.25 is most-cited (Sorrentino 2012); some authors use 0.3 (Czosnyka 2014). Either is defensible.
- **NIRS depth**: photon path depth is roughly source-detector distance / 3. For adult cwNIRS (4-5 cm separation) this is ~1.5-2 cm; "2-3 cm" is the rough teaching figure.
- **BOOST-II vs BOOST-III**: BOOST-II (Okonkwo 2017) showed feasibility and reduced brain tissue hypoxia burden. BOOST-III (Bernard 2025) phase III primary endpoint was equivalent on extended GOS at 6 months. Figure should reflect this mixed result, not a uniform "PbtO2-guided is better" story.
- **CO2 reactivity slope**: 3-4% per mmHg is correct, but the linear range is roughly **25-60 mmHg PaCO2** (Brian 1998, Willie 2014), not the full 20-80 range; outside that band the response saturates.
- **Therapeutic hypothermia targets**: HIE uses **33.5 C** (TOBY, NICHD, Shankaran 2005); adult TTM/TTM2 used 33 vs 36/37.5 with equivalence; adult TBI Eurotherm3235 did not show benefit.

If a primary-source number contradicts the caption shorthand, **defer to the primary source.** Update the caption while you write the polished SVG.

## Template SVG structure

Every placeholder follows this structure (copy from `public/images/tcd/waveform-anatomy.svg` and adapt):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" role="img" aria-label="<page-specific>">
  <style>
    .bg { fill: #081224; }
    .title { fill: #f1f5f9; font: 600 14px sans-serif; }
    .axis { stroke: #475569; stroke-width: 1; }
    .label { fill: #e2e8f0; font: 12px sans-serif; }
    .smallLabel { fill: #94a3b8; font: 10px sans-serif; }
    .placeholder { fill: #64748b; font: italic 10px sans-serif; }
    .curve { stroke: #5eead4; stroke-width: 2; fill: none; }
    .accent { fill: #fbbf24; }
    .danger { stroke: #f87171; }
  </style>
  <rect class="bg" width="800" height="380"/>
  <text class="title" x="20" y="28"><Figure title>, placeholder schematic</text>
  <!-- minimal but informative content -->
  <text class="placeholder" x="20" y="370">PLACEHOLDER, TODO: polish (Fig. N on <page> page).</text>
</svg>
```

## Per-page figure list

### Foundations

#### `/images/foundations/autoregulation/`
- `lassen-curves-overlay.svg`, "Three Lassen curves overlaid (source: Lassen 1959, Brady 2009, Czosnyka 1997). X-axis MAP 40-180 mmHg; Y-axis CBF in mL/100g/min with plateau at ~50. Healthy adult plateau 60-150 mmHg. Neonate / young infant plateau narrower (10-20 mmHg wide) and shifted leftward (LLA can be only 5-10 mmHg above resting MAP). Severe TBI: plateau lost, CBF tracks MAP linearly (pressure-passive)."
- `myogenic-metabolic-neurogenic.svg`, "Three time-scale rows: myogenic (Bayliss 1902, response onset within 1-5 s, full response 15-30 s; TRPM4 / Piezo1 mediated). Metabolic (CO2 / lactate / adenosine / NO, tens of seconds). Neurogenic (sympathetic and parasympathetic, slowest). Schematic vessels constricting / dilating per row."

#### `/images/foundations/co2-o2-reactivity/`
- `co2-curve.svg`, "CO2 reactivity curve: CBF vs PaCO2 (Reivich 1964, Brian 1998, Willie 2014). X-axis PaCO2 15-90 mmHg. Linear-response window roughly 25-60 mmHg with slope 3-4% per mmHg. Below ~20 mmHg the response saturates (maximum vasoconstriction); above ~70 mmHg also saturates (maximum vasodilatation). Highlight the linear band."
- `o2-reactivity-low-pao2.svg`, "Hyperbolic CBF response to PaO2 (Kety 1948, Brown 1985). Minimal change in CBF above PaO2 ~60 mmHg. Response onset around PaO2 50 mmHg; steep rise below 40 mmHg; plateau by ~25-30 mmHg."

#### `/images/foundations/cerebral-metabolism/`
- `cmro2-temperature.svg`, "CMRO2 vs brain temperature (Michenfelder, Polderman 2009). 6-7% reduction in CMRO2 per 1 C fall in the 25-37 C range (Q10 ≈ 2-3). Annotate therapeutic targets by indication: HIE 33.5 C (NICHD / TOBY / Shankaran 2005); adult cardiac arrest TTM-2 33 vs 37.5 C equivalent (Dankiewicz 2021); adult severe TBI 32-35 C (Eurotherm3235; outcome not improved). Pediatric TBI THAPCA-OH used 33 C (Moler 2015)."

#### `/images/foundations/monro-kellie/`
- `compartments-shift.svg`, "Three compartments (brain, blood, CSF) at baseline and after a mass lesion, showing buffer exhaustion."

#### `/images/foundations/marmarou-pv-curve/`
- `pv-curve-annotated.svg`, "Pressure-volume curve with compensated and decompensated phases marked; elastance, compliance."

#### `/images/foundations/astrup-cascade/`
- `astrup-thresholds.svg`, "CBF thresholds from baboon ischaemia data (Astrup 1981, Hossmann 1994; values are a gradient, not hard cutoffs). Normal ~50 mL/100g/min. Oligaemic penumbra ~22 mL/100g/min. EEG slowing ~18. SSEP loss / electrical failure ~15. K+ release ~12. Anoxic depolarisation / membrane failure ~10. Sustained <10 progresses to infarction over minutes to hours."

#### `/images/foundations/spreading-depolarizations/`
- `sd-propagation.svg`, "ECoG strip showing an SD wave (Leao 1944, Dreier 2009, COSBID Dreier 2017). Large negative DC shift (typically -10 to -30 mV at the cortical surface), simultaneous suppression of high-frequency activity, slow propagation at 2-5 mm/min across the cortex."

#### `/images/foundations/blood-brain-barrier/`
- `bbb-anatomy.svg`, "Endothelial tight junctions, astrocyte end-feet, pericyte. Note arrows for transport mechanisms."

#### `/images/foundations/pediatric-physiology/`
- `peds-mfv-and-icp-age.svg`, "Two-panel. Panel A: pediatric MCA MFV vs age (Bode 1988, O'Brien 2015): term newborn ~24 cm/s, peak 4-6 y at ~97 cm/s, adult ~55 cm/s. Panel B: pediatric ICP treatment thresholds. PBTF 2019 (Kochanek) recommends 20 mmHg for all pediatric ages (weak recommendation, weaker evidence in infants). Age-banded heuristics (10 / 15 / 18 / 20 mmHg in neonate / infant / child / adolescent) are proposals from the literature, not guideline values; label as heuristic and cite Smith 2021, Tasker 2023."

### Tier 1 modalities

#### `/images/icp/`
- `p1p2p3-anatomy.svg`, "Annotated ICP pulse (Cardoso 1983, Kazimierska 2021): P1 (percussion, arterial-pulse-driven), P2 (tidal, brain compliance), P3 (dicrotic, aortic-valve closure transmitted). Normal P2 < P1. Pathological P2 > P1 indicates reduced craniospinal compliance and predicts decompensation."
- `lundberg-waves.svg`, "Lundberg 1960 wave taxonomy. A-waves (plateau waves): amplitude 50-100 mmHg above baseline, duration 5-20 minutes, indicate severe intracranial hypertension. B-waves: 0.5-2 per minute, amplitude up to 50 mmHg, of obscure significance, may herald A-waves. C-waves: 4-8 per minute, ~20 mmHg amplitude, Traube-Hering-Mayer arterial waves transmitted into the ICP signal, generally benign."
- `age-band-icp-thresholds.svg`, "Pediatric ICP treatment thresholds. PBTF 2019 (Kochanek) recommends a treatment threshold of 20 mmHg across all pediatric ages (weak recommendation). Show this as the guideline value. Annotate proposed age-banded heuristics (10 / 15 / 18 / 20 mmHg by age, Smith 2021 review; Tasker 2023) as a separate column labelled 'proposed' to distinguish from guideline. Do not present age-banded numbers as guideline thresholds."
- `evd-vs-ipm-placement.svg`, "Schematic of EVD (Kocher's point or Frazier's point; CSF diversion possible) vs intraparenchymal monitor (parenchymal probe; no CSF diversion). Pros / cons callout: EVD allows drainage but higher infection risk (~5-10%); IPM lower infection risk but no therapeutic option, drift over days."

#### `/images/prx/`
- `prx-time-series.svg`, "Three rows: MAP, ICP, PRx over 4 hours showing slow-wave correlation. Colour-code PRx state (intact, ambiguous, impaired) using PRx thresholds: < 0.05 intact, 0.05-0.25 ambiguous, > 0.25 impaired (Sorrentino 2012, Czosnyka 1997)."
- `prx-vs-cpp-ucurve.svg`, "Classic PRx vs CPP U-curve (Steiner 2002, Aries 2012). CPPopt at the vertex. LLA and ULA where PRx crosses the 0.25 threshold (Sorrentino 2012); some authors use 0.30 (Czosnyka 2014). Shaded target band: CPPopt ± 5 mmHg."
- `prx-vs-mx-vs-orx.svg`, "Three-panel: same patient, same time window, autoregulation index computed by PRx (using ICP), Mx (using TCD MFV), and ORx (using NIRS rSO2). Discordance highlighted; explain by macro-vs-micro autoregulation (Rivera-Lara 2017) or technique sensitivity to signal quality."

#### `/images/cppopt/`
- `cppopt-workflow.svg`, "Six-step workflow (Steiner 2002, Aries 2012, COGiTATE Beqiri 2021): (1) continuous ABP and ICP at 100 Hz, (2) 10-second moving averages, (3) 5-minute Pearson PRx, (4) bin into 5-mmHg CPP windows over the past 4 hours, (5) fit least-squares parabola, (6) vertex = CPPopt."
- `cppopt-dose-response.svg`, "Dose-response (Aries 2012): U-shape relating time outside CPPopt ± 5 mmHg to outcome. Both time below CPPopt and time above CPPopt independently associated with worse outcome. Reproduce the trajectory shown in Aries 2012 Critical Care Medicine fig. 2."

#### `/images/nirs/`
- `nirs-optode-pair.svg`, "Source-detector geometry. Banana-shaped photon path (Jobsis 1977). Effective interrogated depth approximately one-third of the source-detector distance; for typical adult cwNIRS (~4-5 cm separation) depth ~1.5-2 cm into cortex; for pediatric / neonatal NIRS (shorter separation) depth proportionally shallower. Three layers: skin and scalp (extracerebral contamination), skull, brain. rSO2 reflects a mixed venous-weighted compartment (~70-75% venous, ~25-30% arterial)."
- `rso2-trend-shock.svg`, "rSO2 falling during septic shock, recovering with fluid bolus. Annotate with MAP and lactate overlay. Note: the magnitude of rSO2 recovery is variable and not always proportionate to MAP recovery (extracerebral contamination, anaemia, peripheral vasoconstriction all confound)."
- `orx-vs-prx-discordance.svg`, "Side-by-side trends: PRx intact while ORx impaired (or vice versa). Mechanism callout (Rivera-Lara 2017, Lee 2009): PRx tracks ICP-MAP coupling (macrovascular reactivity); ORx tracks tissue-oxygenation-MAP coupling (incorporates microvascular and metabolic effects). Sepsis-driven microvascular shunting, anaemia, and scalp / skull NIRS contamination all selectively impair ORx without changing PRx."

#### `/images/eeg/`
- `montage-bipolar-vs-referential.svg`, "Standard pediatric montage comparison: bipolar (anteroposterior chains, e.g. Fp1-F3-C3-P3-O1) vs referential (each electrode to a common reference, typically Cz or average). Reference ACNS guidelines (Herman 2015 ACNS consensus)."
- `pattern-library.svg`, "Eight-panel pattern library following ACNS 2021 terminology (Hirsch 2021): normal background, burst suppression, generalized periodic discharges (GPDs), lateralized periodic discharges (LPDs), non-convulsive status epilepticus (NCSE), isoelectric (suppression), alpha coma, theta coma."
- `aDR-trend.svg`, "Alpha-delta ratio (aDR) trend in SAH: monotonic decline correlates with delayed cerebral ischaemia (Claassen 2004, Foreman 2022, Sandsmark 2024). A sustained relative drop of more than 10-25% from baseline over 6-24 hours is the most commonly cited DCI-warning threshold; the precise magnitude is centre-dependent and the temporal pattern (monotonic decline) is more informative than any single percentage cutoff."

#### `/images/pbto2/`
- `licox-probe.svg`, "Clark polarographic electrode tip with the diffusion sampling zone (~17 mm2; the most commonly cited Licox figure). Placement: subcortical white matter, depth 25-30 mm from cortex, in non-infarcted tissue when possible. Tissue interface schematic: capillary-tissue oxygen tension at the probe tip."
- `pbto2-cpp-titration.svg`, "Bedside titration tree (BOOST-II protocol, Okonkwo 2017; PBTF 2019 Kochanek): for PbtO2 < 20 mmHg, check sequentially: MAP / CPP, FiO2 / SaO2, Hb, temperature, sedation depth, sepsis / fever. Reference the actual ladder published in BOOST-II / III protocols rather than improvising."
- `pbto2-trend-events.svg`, "12-hour PbtO2 trend with annotated events: endotracheal suction (transient drop and recovery), CPP drop (sustained low), fever (gradual drop), recovery interventions (transfusion, FiO2 escalation, CPP increase). Time-scale 720 min on X-axis; Y-axis PbtO2 0-40 mmHg with threshold lines at 10 (critical) and 20 (target)."

#### `/images/onsd/`
- `onsd-anatomy.svg`, "Optic nerve sheath ultrasound technique (Helmke 1996, Geeraerts 2008). Probe in transverse axial plane on the closed upper eyelid with generous gel; measurement plane 3 mm posterior to the globe; perpendicular to the long axis of the nerve. Measure twice per eye, both eyes; report the mean. Mechanical index < 0.23 to protect lens."
- `onsd-by-age.svg`, "ONSD cutoffs by age. Padayachy 2016 pediatric data: <1 y > 4.0 mm abnormal; 1-15 y > 4.5 mm abnormal. Adult thresholds (Robba 2018 meta-analysis): pooled best cutoff 5.0-5.7 mm with sensitivity ~90% and specificity ~85% for raised ICP. Show both pediatric and adult bands stacked with the underlying primary studies cited."
- `niicp-stack.svg`, "Non-invasive ICP estimator comparison (Cardim 2016, Rasulo 2022, Robba 2018, Brasil 2022). Side-by-side panels: TCD-PI (Bellner regression; PI > 1.4 suggestive; PI < 1.26 high NPV for ICH exclusion, Rasulo 2022); ONSD (cutoffs above); Brain4Care extensometer (Rasulo 2024); tympanic membrane displacement. Sensitivity / specificity table per method; flag that none is a measurement substitute, all are triage."

### Tier 2 modalities

(One representative figure per Tier 2 page; add more if the page benefits.)

- `/images/clinical-exam/gcs-vs-four.svg`, "GCS components (E/V/M) and FOUR score (eye, motor, brainstem, respiration). Pediatric GCS variants in a callout."
- `/images/cpp/triangle-equation.svg`, "CPP = MAP - ICP visualised as a triangle; same CPP reachable by many MAP/ICP combinations."
- `/images/mx/mx-vs-prx-arch.svg`, "Architecture diagram: Mx uses TCD MFV; PRx uses ICP; both correlate slow waves with MAP. Reuse existing MxVsPrxArchitecture component if available."
- `/images/orx/orx-trend.svg`, "ORx U-curve and trend showing impaired autoregulation in a septic neonate."
- `/images/rap/rap-vs-icp.svg`, "RAP (correlation between ICP pulse amplitude and mean ICP, Czosnyka 1996) plotted against mean ICP. Three zones following Czosnyka 1996, Kim 2009, Howells 2017: (a) RAP near 0 at low-to-moderate ICP indicates good compensatory reserve, the cranium absorbs added volume; (b) RAP rising toward +1 indicates exhausted reserve, on the steep part of the Marmarou PV curve; (c) RAP falling back toward 0 or negative at very high ICP indicates terminal exhaustion / vascular collapse. The C-shape of RAP-vs-ICP is the canonical pattern."
- `/images/aeeg/aeeg-patterns.svg`, "Five aEEG patterns following the Hellstrom-Westas classification (Hellstrom-Westas 2006): continuous normal voltage (CNV), discontinuous normal voltage (DNV), burst suppression (BS), continuous low voltage (CLV), and flat / inactive trace. Annotate typical voltage envelope ranges and clinical significance per pattern."
- `/images/qeeg/qeeg-spectrogram.svg`, "Spectrogram showing alpha-delta ratio drop preceding DCI; suppression burst index."
- `/images/bis/bis-vs-sedation.svg`, "BIS values across sedation depth (Rampil 1998, Sigl 1994, Davidson 2005 pediatric). Awake 90-100; light sedation 70-90; general anaesthesia / surgical 40-60; deep anaesthesia 20-40; burst suppression < 20; isoelectric near 0. Caveat: BIS is unreliable below age 1 year and with ketamine (paradoxical high values). Pediatric studies show looser correlation with clinical depth than in adults."
- `/images/pupillometry/npi-vs-clinical.svg`, "Neurological Pupil index (NPI, 0-5; NeurOptics device, proprietary algorithm). NPI 3.0-5.0 normal; < 3.0 abnormal; < 2.0 strongly suggests catastrophic neurologic injury (Oddo 2018 ORANGE, Olson 2016). Distribution histogram in normal vs comatose populations from ORANGE. Inset: handheld pupillometer probe."
- `/images/microdialysis/lpr-grid.svg`, "Lactate / pyruvate ratio (LPR) interpretation grid (Hutchinson 2015 consensus, Hillered 2005). LPR < 25 normal. LPR > 25 with **low pyruvate** suggests ischaemic pattern (anaerobic glycolysis). LPR > 25 with **normal or elevated pyruvate** suggests mitochondrial dysfunction (oxygen and substrate present but unable to oxidise). Add glucose column (< 0.8 mmol/L brain glucose, classic ischaemia) and glutamate column (rise with neuronal injury). Cite for thresholds."
- `/images/sjvo2/jugular-anatomy.svg`, "Retrograde IJ catheter to jugular bulb. Sampling for SjvO2; CMRO2 by Fick principle."
- `/images/non-invasive-icp/methods-comparison.svg`, "Side-by-side: TCD-PI, ONSD, Brain4Care extensometer, tympanic membrane displacement. Sensitivity/specificity, ease, age limits."
- `/images/brain-temp/brain-core-gradient.svg`, "Brain-core temperature gradient. In healthy adults, brain temperature is 0.5-1 C higher than core (Mellergard 1992, Henker 1998). After severe TBI, the gradient can widen to 1-2 C and may invert in moribund patients (brain colder than core). Core temperature underestimates brain temperature; assume the brain is hotter than the rectum / bladder by ~1 C unless directly measured."
- `/images/direct-cbf/thermal-diffusion.svg`, "Hemedex / Bowman probe schematic; thermal-diffusion measurement principle."
- `/images/evoked-potentials/ssep-baer-pathway.svg`, "SSEP cortical and subcortical pathway; BAER waves I-V. Lesion localisation by which wave is lost."
- `/images/ecog-sd/cosbid-electrode.svg`, "Subdural strip placement during surgery; ECoG channels labelled. SD waves on the trace."
- `/images/fontanelle-us/transfontanellar.svg`, "Coronal and sagittal views through the anterior fontanelle; landmarks for ventricle size, IVH, PVL."
- `/images/advanced-nirs/dcs-trnirs.svg`, "Diffuse correlation spectroscopy and TR-NIRS schematics. Absolute CBF and tissue oxygenation."
- `/images/pediatric-stroke-monitoring/aha-pathway.svg`, "Pediatric AIS pathway: door-to-imaging, candidacy for IV-tPA / thrombectomy, post-recanalisation monitoring."

### Integration scenarios

(One scenario diagram per integration page; many already have decision flowcharts. Reuse Mermaid where possible. Where an SVG fits better, add it as below.)

- `/images/integration/tcd-vs-icp-vasospasm/timeline.svg`, "SAH days 0-14 timeline. Mark spasm window (typically day 3 onset, peak day 7-10, resolution by day 14-21; Hoh 2023 AHA, Rass 2021). Four parallel tracks: ICP (often stable until DCI / oedema), TCD MFV (rising through the window if spasm develops), Lindegaard ratio (key for spasm vs hyperaemia, > 3 confirms spasm; Lindegaard 1989, Mastantuono 2018), neurological exam (subtle drift / new deficit triggers angiography). Mastantuono 2018 meta-analysis sensitivity 85% for MCA spasm, lower for ACA / posterior circulation."
- `/images/integration/cppopt-targeting/dose-response.svg`, "Dose-response curve of time outside CPPopt vs neurological outcome (Aries 2012 Critical Care Medicine). U-shape relating cumulative time outside CPPopt ± 5 mmHg (both above and below) to GOS at 6 months. Reproduce the trajectory from Aries 2012 fig. 2. Add a note that COGiTATE phase II (Beqiri 2021) confirmed feasibility of CPPopt targeting; outcome effect remains under investigation (Tas 2025)."
- `/images/integration/osmotherapy-icp-nirs/triple-trend.svg`, "Three trends after 3% NaCl 5 mL/kg bolus over 20 min in severe TBI: ICP falling (typically 20-40% reduction lasting 4-6 h, Kochanek 2019 pediatric guidelines). Serum Na rising 4-6 mmol/L per bolus. rSO2: variable response in the literature, ranging from no change to transient rise; do not depict a uniform rise. Show rSO2 as a variable / uncertain trace and annotate that interpretation requires caution (extracerebral contamination, anaemia, peripheral effects can confound)."
- `/images/integration/mnm-on-ecmo/embolus-detection.svg`, "TCD high-intensity transient signals (HITS) on ECMO. Schematic spectral envelope with HITS event spike annotated. Time series of daily HITS count over 10 days of VA-ECMO. Annotate that high HITS burden correlates with downstream cerebrovascular events (Lorusso 2017, Cho 2024); a threshold above which intervention is warranted is not established. Pediatric ECMO TCD references LaRovere 2017."
- `/images/integration/brain-death-mnm/ancillary-tree.svg`, "Brain-death determination decision tree following the World Brain Death Project (Greer 2020 JAMA) and pediatric guidelines (Nakagawa 2011). Clinical exam plus apnoea test is the standard. Ancillary testing required when clinical exam cannot be reliably completed (severe facial trauma, high cervical injury, severe pulmonary dysfunction preventing apnoea test, drug effect not eliminated). Ancillary options: TCD (oscillating / reverberating / systolic-spikes-only pattern; Rasulo 2008), CT angiography (no intracranial filling), EEG (electrocerebral silence over 30 minutes, ACNS standards), evoked potentials (SSEP / BAER patterns). Jurisdictional variation exists; defer to local protocols."
- `/images/integration/mnm-in-the-newborn/hie-monitoring-bundle.svg`, "Neonatal HIE monitoring bundle during 72 h cooling at 33.5 C (Shankaran 2005, NICHD, TOBY). aEEG (continuity over time; recovery to continuous normal voltage by 24-48 h is favourable, Toet 2002, Hellstrom-Westas 2006). NIRS (regional oxygenation; luxury perfusion pattern with high rSO2 plus low PI in severe HIE). TCD (PI trend; Kirschen 2020 showed low PI < 0.6 with high EDV at 24-48 h post-arrest associated with poor outcome). MRI timing at day 4-7 (DWI sensitivity peaks; injury patterns localise to deep grey nuclei and watershed). Cite the bundle papers explicitly."
- `/images/integration/dka-cerebral-edema/timeline.svg`, "Pediatric DKA cerebral oedema timeline (Glaser 2001, Muir 2004, Kuppermann 2018 PECARN FLUID). Onset typically 4-12 h after rehydration starts (median ~7 h). Modal sequence: subtle GCS change (often missed) → progressive headache → vomiting → bradycardia → pupillary asymmetry → herniation. PI rise on TCD and ONSD widening can precede clinical signs by 1-2 h. Risk factors per Glaser: age < 5 y, new-onset T1DM, hypocapnia, high BUN, bicarbonate use, rapid fluid administration."
- `/images/integration/meningitis-encephalitis/icp-pathway.svg`, "Decision tree: bacterial meningitis with raised ICP / hydrocephalus / vasculitic vasospasm. Where ICP, TCD, EEG fit."
- `/images/integration/pbto2-cpp-titration/boost2-3.svg`, "BOOST-II and BOOST-III trial result comparison. BOOST-II (Okonkwo 2017): phase 2 RCT (n=119), PbtO2-guided care reduced the burden of brain tissue hypoxia and trended toward better outcomes, primary endpoint feasibility met. BOOST-III (Bernard 2025 NEJM): phase 3 RCT (~1100 randomised), primary endpoint of extended GOS at 6 months was **equivalent** between PbtO2-guided and ICP-only arms. Reflect this honestly: BOOST-II positive on feasibility / mechanistic endpoints, BOOST-III not positive on the primary clinical outcome. Do not present BOOST-III as supporting routine PbtO2-guided care."
- `/images/integration/refractory-status-epilepticus/treatment-ladder.svg`, "Status epilepticus treatment ladder. Stage 1 (5-20 min): IV / IM / IO benzodiazepine (midazolam 0.2 mg/kg IM up to 10 mg, lorazepam 0.1 mg/kg IV up to 4 mg). Stage 2 / established SE (20-40 min): per ESETT (Kapur 2019 NEJM), levetiracetam, fosphenytoin, or valproate are equivalent first-choice second-line agents. Stage 3 / refractory SE (> 40 min or after two failed agents): continuous infusion (midazolam, pentobarbital / thiopental, ketamine). cEEG endpoint typically suppression of electrographic seizures; for super-refractory SE, burst-suppression endpoint commonly targeted (varies by centre). Glauser 2016 evidence-based guideline overview."
- `/images/integration/eeg-tcd-non-convulsive/pair-up.svg`, "Sedated TBI: aEEG narrowing + TCD systolic peaks pattern. Mechanism diagram."
- `/images/integration/inborn-errors-encephalopathy/leigh-mri.svg`, "Schematic of bilateral symmetric T2 hyperintensities classic for Leigh syndrome / subacute necrotising encephalomyelopathy (Parikh 2017 Mitochondrial Medicine Society consensus). Typical distribution: putamen, caudate, globus pallidus, midbrain (red nucleus, substantia nigra, periaqueductal grey), pons (central tegmental tract), dentate nuclei. Show coronal and axial views with characteristic patterns."
- `/images/integration/resource-limited-bedside/three-modality-bundle.svg`, "Resource-limited monitoring bundle: clinical exam + ONSD + fontanelle US + handheld TCD."
- `/images/integration/family-communication-mnm/conversation-templates.svg`, "Three conversation templates: prognosis after HIE, brain-death disclosure, WLST discussion. Two-column layout: what to say, what to avoid."
- `/images/integration/wlst-organ-donation/dcd-pathway.svg`, "DCD pathway operational diagram: pre-extubation, controlled WLST, asystole criteria, retrieval window."
- `/images/integration/prx-vs-orx-discordance/mechanism.svg`, "Mechanism diagram explaining why PRx and ORx can disagree: macrovascular vs tissue-level autoregulation, sepsis, anaemia."
- `/images/integration/discordance-triage/flowchart.svg`, "Multimodal discordance triage flowchart: what to check when ICP, NIRS, TCD, EEG disagree."
- `/images/integration/pediatric-stroke-ais/maya-case.svg`, "Maya, 8 y AIS case timeline. Stroke onset → ED arrival (door time 0) → CT / CTA decision (within 30 min) → IV-tPA candidacy assessment per Ferriero 2019 AHA pediatric stroke statement (consider in selected pediatric AIS within 4.5 h; TIPS Rivkin 2015 informs dosing) → thrombectomy decision per Sun 2020 (case series support; no pediatric RCT) → post-recanalisation monitoring (TCD for hyperperfusion, NIRS for asymmetry, cEEG for sub-clinical seizures, BP control targeting age-specific norms). Annotate the difference from adult AIS time windows where applicable."

## Total

Approximately 60-70 placeholder SVGs. Create them once at the start of the project as a batch; future polish passes can replace them individually.
