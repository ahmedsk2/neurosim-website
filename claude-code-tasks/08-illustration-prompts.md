# AI image-generation prompts for the MNM-Edu anatomical illustrations

One detailed prompt per illustration. Designed for any modern text-to-image model (DALL-E 3, Midjourney v6+, Stable Diffusion XL, Imagen, Flux). Each entry has:

- **File** — current React component or placeholder SVG path
- **Appears on** — site page(s)
- **Aspect** — recommended canvas ratio
- **Prompt** — verbatim text to paste into the image generator
- **Must label** — labels that must be present in the final image
- **Avoid** — common failure modes to constrain against
- **Reference** — primary anatomical source(s)

## Global style guidance (paste at the top of any prompt that drops it)

> Clinical schematic illustration for a medical-education website. Dark navy / near-black background (#081224 to #0F1A2E). Anatomy rendered with clean line work, soft gradient fills, muted but distinguishable colours. Labels in clean sans-serif (matching Segoe UI or Inter) for prose labels, monospace (matching Consolas) for measurements and numeric values. Labels coloured to match the structure they point to via thin leader lines. Avoid photorealistic skin or hair; this is a textbook diagram, not a 3D render. No watermarks, no AI artist signatures, no decorative borders. Accurate human anatomy at all times.

## Colour conventions used across the site

| Element | Colour | Hex |
|---|---|---|
| Background | dark navy | `#0F1A2E` (foundation) / `#081224` (modality) |
| Primary structures (vessels, nerves, tracts) | teal | `#5EEAD4` |
| Secondary structures / labels | mint | `#86EFAC` |
| Warning / pathological / critical | red | `#EF4444` |
| Caution / probe-tip highlights | amber | `#FCD34D` / `#FBBF24` |
| Bone | warm bone | `#E8DFC9` |
| Brain parenchyma | dusty pink | `#F8B5C0` |
| Blood (arterial) | bright red | `#DC2626` |
| Blood (venous) | dark red / purple | `#7C3AED` |
| CSF | pale blue | `#BAE6FD` |
| Skin / scalp | warm pink | `#FBC8C8` |

---

# Part A — Anatomical and device-placement illustrations (22 React components)

## A1. ICPProbePlacement — `<ICPProbePlacement />`

**File:** `src/components/content/illustrations/ICPProbePlacement.tsx`
**Appears on:** `/modalities/icp/` (Fig. 1)
**Aspect:** 16:9 (e.g., 1600 × 900 px), single-panel sagittal

**Prompt:**

> Side-by-side comparison schematic on a dark navy background showing the two principal pediatric ICP probe placements, both in sagittal cross-section through a child's head. Left panel: **external ventricular drain (EVD)** — a thin silicone catheter entering through a small burr hole at Kocher's point (2.5 cm lateral to midline at the coronal suture, non-dominant hemisphere), traversing frontal white matter, and terminating with its tip in the frontal horn of the lateral ventricle. The catheter is tunnelled subcutaneously over the scalp and exits the skin posteriorly, connecting via clear tubing to an external pressure transducer mounted at the level of the tragus (drawn with a labelled "zero at tragus, foramen of Monro level" reference line). A small CSF drainage chamber is visible in the tubing path. Right panel: **intraparenchymal monitor (IPM)** — a short fibre-optic or strain-gauge probe held in a cranial bolt screwed into the same Kocher's point burr hole, the probe tip sitting 1 to 2 cm into the frontal white matter (no ventricle access, no drainage capability). The bolt sits flush with the scalp; a thin cable runs to a bedside monitor. Both views show: scalp, skull, dura, brain parenchyma, lateral ventricles, falx cerebri, coronal suture for landmark reference. Use teal for the EVD silicone, amber for the IPM probe tip, warm-bone for the skull, dusty-pink for brain.

**Must label:** "EVD" with arrow to catheter tip in ventricle; "Kocher's point (2.5 cm lateral, coronal suture)"; "Tragus (zero level / foramen of Monro)"; "Frontal horn"; "IPM"; "Intraparenchymal probe tip (1–2 cm white matter)"; "Cranial bolt".

**Avoid:** photorealistic skin; cartoonish "anime" head; placement in the parietal or occipital lobe (this is a frontal approach); EVD tip in the third ventricle (it should be the frontal horn).

**Reference:** Kochanek 2019 PBTF 4; Hawthorne & Piper 2014.

---

## A2. ICPWaveformMorph — `<ICPWaveformMorph />`

**File:** `src/components/content/illustrations/ICPWaveformMorph.tsx`
**Appears on:** `/modalities/icp/` (Fig. 2)
**Aspect:** 16:9 single-panel, time-series

**Prompt:**

> Annotated pressure-time waveform illustration on a dark navy background showing the morphological evolution of a single cardiac-cycle intracranial pressure (ICP) pulse across three compliance states. Render three stacked traces from top to bottom: (1) **Normal compliance** — sharp three-peak waveform with P1 (percussion wave, tallest, sharp leading edge) > P2 (tidal wave, mid) > P3 (dicrotic wave, smallest, after a small notch). (2) **Marginal compliance** — same three peaks but P1 and P2 are nearly equal in height, contour starts to broaden. (3) **Exhausted compliance** — P2 is the dominant peak, P1 is reduced, the contour is rounded and smooth, P3 has merged into the descending limb. Each trace shows three cardiac cycles. Y-axis labelled "ICP (mmHg)", X-axis "time (seconds)". Show a clear amplitude (AMP) bracket on the third trace indicating the peak-to-trough pulse pressure. Use a single teal stroke for each trace with subtle glow. Annotate each peak with small arrows and labels P1, P2, P3.

**Must label:** "P1 (percussion)", "P2 (tidal)", "P3 (dicrotic)", "Normal compliance", "Marginal compliance", "Exhausted compliance (P2 > P1)", "AMP (peak-to-trough)".

**Avoid:** ECG-style triplets; arterial-pressure-style sharp drops; showing only one cycle (the morphology evolution must show 3 distinct compliance states stacked vertically).

**Reference:** Czosnyka 2004; Kazimierska 2021.

---

## A3. NIRSOptodes — `<NIRSOptodes />`

**File:** `src/components/content/illustrations/NIRSOptodes.tsx`
**Appears on:** `/modalities/nirs/` (Fig. 1)
**Aspect:** 16:9 split panel (frontal + sagittal)

**Prompt:**

> Two-panel medical schematic on a dark navy background showing near-infrared spectroscopy (NIRS) optode placement on a paediatric patient. **Left panel: frontal view of a child's face and forehead.** Draw a stylised, anatomically correct child's head, slightly turned three-quarters, with two NIRS optode pads applied symmetrically over the frontal cortex — each pad is a small rectangular sticker (~4 cm wide) sitting 2 cm above the eyebrow and 3 cm lateral to the midline. Each pad shows an internal source LED (amber dot) and detector (teal dot) with a measurement-distance arrow labelled "3 cm" between them. Thin cables run from the pads up over the hairline. Label the pads "L" (left) and "R" (right). **Right panel: sagittal cross-section through one optode position**, showing the path of near-infrared photons from the source LED (amber, at the scalp surface), curving through the scalp (5 mm), skull (5–7 mm), thin CSF layer, and into the frontal cortex (~2 cm depth) before re-emerging at the detector (teal). Render two photon paths simultaneously: a short "banana-shaped" path between source and near detector (sampling only scalp + skull), and a longer banana between source and far detector (sampling additionally ~2 cm of frontal cortex). Use a soft amber glow for the photon paths and a faint teal cloud for the sampled cortical volume. Annotate tissue layers (scalp, skull, CSF, cortex) on the right margin.

**Must label:** "source LED (730 + 810 nm)", "near detector D₁ (~1.5 cm)", "far detector D₂ (~3 cm)", "scalp ~5 mm", "skull ~5–7 mm", "CSF", "cortex (grey matter)", "short path (scalp/skull only)", "long path (samples cortex, ~1–2 cm depth)", "D₂ − D₁ subtracts scalp/skull contamination".

**Avoid:** rainbow-coloured photon paths; placing optodes on the temporal or occipital region (frontal is standard); showing optodes touching each other (they need the 3 cm separation).

**Reference:** Jöbsis 1977; modified Beer-Lambert with banana-shape photon migration model.

---

## A4. PbtO2Probe — `<PbtO2Probe />`

**File:** `src/components/content/illustrations/PbtO2Probe.tsx`
**Appears on:** `/modalities/pbto2/` (Fig. 1)
**Aspect:** 16:9 single sagittal section + magnified probe-tip inset

**Prompt:**

> Medical schematic on a dark navy background showing **Licox brain-tissue oxygen (PbtO₂) probe placement** in a paediatric head, sagittal cross-section. Main view: a single multi-lumen cranial bolt is screwed into a burr hole at Kocher's point (2.5 cm lateral to midline, at the coronal suture, non-dominant hemisphere or contralateral to the dominant injury). Three thin probes emerge from the bolt and descend into the brain to a depth of ~2.5–3 cm in frontal white matter: one labelled **ICP probe**, one **PbtO₂ Clark electrode (Licox)**, one **temperature probe**. Each probe has a slightly different colour: ICP teal, PbtO₂ amber, temperature pale green. Show scalp, skull, dura, cortex, white matter, lateral ventricles for landmark reference. **Magnified inset (bottom right corner):** a 4× close-up of the PbtO₂ probe tip showing a Clark electrode (gold-coloured anode + silver cathode in an electrolyte solution behind a thin membrane) sitting in viable white matter, surrounded by a small circular highlighted "diffusion zone" (~17 mm² area) that represents the tissue volume being sampled. Tiny dots within this zone represent O₂ molecules diffusing toward the electrode.

**Must label:** "Kocher's point", "Cranial bolt (multi-lumen)", "ICP probe", "PbtO₂ Clark electrode (Licox)", "Temperature probe", "White matter, depth ~2.5–3 cm", "Diffusion zone ~17 mm²", "Anode / cathode (Clark electrode)".

**Avoid:** placing the probe tip in grey matter (white-matter placement is standard); showing the probe near the ventricle (it should be in white matter, NOT cannulating the ventricle); inset omitted (the probe-tip close-up is essential for teaching).

**Reference:** Maas 1993 PbtO₂; Okonkwo 2017 BOOST-II.

---

## A5. ONSDUltrasound — `<ONSDUltrasound />`

**File:** `src/components/content/illustrations/ONSDUltrasound.tsx`
**Appears on:** `/modalities/onsd/` (Fig. 1), `/integration/resource-limited-bedside/`
**Aspect:** 16:9 split (probe placement + ultrasound view + age-band threshold cards)

**Prompt:**

> Three-panel medical schematic on a dark navy background. **Top-left panel:** anatomical side-view of a paediatric eye and orbit with a high-frequency linear ultrasound probe (7.5–15 MHz) placed transversely over the closed eyelid. Show generous gel coupling between probe and lid (mechanical index labelled "< 0.23"). The probe's beam is drawn fanning posteriorly through the globe to the optic nerve. **Top-right panel:** the resulting ultrasound image — a grayscale schematic ocular ultrasound showing the anterior chamber, lens, posterior chamber (vitreous), retina, the hyperechoic globe-retina junction, and the hypoechoic optic nerve extending posteriorly. Critically: a measurement caliper drawn perpendicular to the optic nerve axis, at exactly **3 mm posterior to the globe-retina junction**, measuring the optic nerve sheath diameter (ONSD). Label both ends of the caliper. **Bottom panel:** three coloured threshold cards in a horizontal row (Padayachy 2016 + Robba 2018 pooled cutoffs): green "< 1 year: concern > 4.0 mm", amber "1–15 years: concern > 4.5 mm", orange "adult: concern > 5.0 mm". Each card has its threshold value in monospace font, and a small icon showing the age group.

**Must label:** "Linear probe 7.5–15 MHz", "Closed eyelid + ample gel", "Mechanical index < 0.23 (lens-safe)", "Globe", "Optic nerve (hypoechoic)", "Optic nerve sheath", "3 mm posterior to globe", "ONSD measurement", "< 1 year: > 4.0 mm", "1–15 years: > 4.5 mm", "Adult: > 5.0 mm".

**Avoid:** probe on the open eye; old (5.7 mm) adult cutoff (use 5.0 mm pooled); measurement at distances other than 3 mm posterior to the globe; placement perpendicular to the nerve from the side (the beam must come from anterior over the lid).

**Reference:** Padayachy 2016; Robba 2018 meta-analysis. (These are the corrected post-audit cutoffs.)

---

## A6. JugularBulbCatheter — `<JugularBulbCatheter />`

**File:** `src/components/content/illustrations/JugularBulbCatheter.tsx`
**Appears on:** `/modalities/sjvo2/` (Fig. 1)
**Aspect:** 16:9 sagittal head + neck

**Prompt:**

> Anatomical schematic on a dark navy background showing **retrograde jugular bulb catheter placement** for SjvO₂ monitoring. Sagittal view of a paediatric head and neck with skin partly transparent so the carotid sheath structures are visible. Draw the right internal jugular vein (IJ) running from the base of the skull down to the subclavian vein. A central venous catheter (CVC) is inserted at the level of the cricoid cartilage, threaded **cephalad** (against normal venous flow), advanced ~15 cm so the tip sits in the **jugular bulb** — the dilated proximal portion of the IJ just below the jugular foramen, at approximately the level of the C1 vertebral body. Show the sigmoid sinus emptying into the bulb superiorly. The catheter is single-lumen, slightly curved, with a clear hub at the skin entry point. Label the dominant (right) jugular vs the smaller left. Show anatomical relationships within the carotid sheath: internal carotid artery medial, vagus nerve between IJ and ICA, vertebral artery in the posterior compartment. Include a small magnified "tip position" inset showing the catheter tip in the bulb relative to the C1 vertebral body and mastoid tip (radiographic landmarks).

**Must label:** "Internal jugular vein (IJ)", "Jugular bulb", "Jugular foramen", "Sigmoid sinus", "Cricoid cartilage (insertion level)", "C1 vertebral body", "Mastoid tip", "ICA (medial)", "Vagus nerve", "Catheter advanced cephalad (retrograde)", "Dominant (right) jugular ~60–70% of cerebral venous outflow".

**Avoid:** placing the catheter tip too low (in the body of the IJ); showing antegrade flow (this is retrograde sampling); drawing it on the left side (right is conventional unless contraindicated).

**Reference:** Gopinath 1994; Robertson 1989.

---

## A7. EvokedPotentialPathway — `<EvokedPotentialPathway />`

**File:** `src/components/content/illustrations/EvokedPotentialPathway.tsx`
**Appears on:** `/modalities/evoked-potentials/` (Fig. 1)
**Aspect:** 16:9 split panel (SSEP left, BAER right)

**Prompt:**

> Two-panel neuroanatomical pathway diagram on a dark navy background. **Left panel: SSEP (somatosensory evoked potential) pathway** after median nerve stimulation at the wrist. Draw a coronal-style anatomical map showing the ascending sensory pathway: stimulation site at median nerve (wrist) → up through Erb's point (clavicle) → through the cervical spinal cord dorsal columns → cervicomedullary junction → medial lemniscus through the brainstem → synapse at the ventroposterolateral (VPL) nucleus of the thalamus → projection to the primary somatosensory cortex (S1, postcentral gyrus). Mark each canonical recording site with a small electrode icon and label: **N9** at Erb's point, **N13** at cervicomedullary junction, **N20** over the contralateral C3'/C4' scalp position. Use teal for the pathway, with brighter colour at recording sites and red highlight if pathway is broken (show one variant where N20 is "absent" with an X). **Right panel: BAER (brainstem auditory evoked response) pathway** after click stimulation. Draw a sagittal section of the brainstem with the auditory pathway from cochlea → cochlear nucleus → superior olivary complex → lateral lemniscus → inferior colliculus. Label each generator with the corresponding wave: **Wave I** (cochlea / distal auditory nerve), **II** (cochlear nucleus), **III** (superior olive), **IV** (lateral lemniscus), **V** (inferior colliculus). Show a small trace inset for each panel: the SSEP showing the N20 peak, the BAER showing waves I-V.

**Must label:** Left panel: "Median nerve", "Erb's point (N9)", "Cervical cord dorsal columns", "Cervicomedullary junction (N13)", "Medial lemniscus", "VPL thalamus", "S1 cortex (N20 at contralateral C3'/C4')". Right panel: "Cochlea (Wave I)", "Cochlear nucleus (II)", "Superior olivary complex (III)", "Lateral lemniscus (IV)", "Inferior colliculus (V)".

**Avoid:** showing the pathway on the ipsilateral side (sensory pathway crosses at the medulla; cortical recording is contralateral); skipping the synapse at VPL; omitting wave numbers.

**Reference:** Carter 2006 pediatric; Logi 2003.

---

## A8. ECoGStrip — `<ECoGStrip />`

**File:** `src/components/content/illustrations/ECoGStrip.tsx`
**Appears on:** `/modalities/ecog-sd/` (Fig. 1)
**Aspect:** 16:9 (intraoperative view + signal trace inset)

**Prompt:**

> Intraoperative-style anatomical schematic on a dark navy background showing **subdural electrocorticography (ECoG) strip placement** during a craniotomy. Top-down view of an exposed cerebral cortex through a craniotomy window. Show a small portion of skull edge and dura retracted, exposing the gyral surface of the brain (with sulci and gyri rendered in dusty-pink with darker sulcal folds). On the cortical surface, lay a flexible silicone subdural strip electrode with **six platinum disc contacts** (each 1 mm diameter, 1 cm spacing centre-to-centre). The strip is placed **adjacent to** (not on top of) a contusion site (drawn as a darker red haemorrhagic patch on a nearby gyrus). The strip's wire tail tunnels under the scalp and exits through a separate stab wound. Add a small bottom-strip signal panel showing one of the six channels recording a spreading depolarisation: a slow negative DC shift over 1–2 minutes with concurrent suppression of high-frequency activity. Use teal for normal ECoG, deep red for the SD event.

**Must label:** "Subdural strip (silicone, 6 platinum contacts)", "1 mm contact diameter", "1 cm spacing", "Pia-arachnoid surface (placement)", "Contusion margin (adjacent placement)", "Tunnelled exit", "DC-coupled amplifier required", "SD signature: negative DC shift + HF suppression".

**Avoid:** placing the strip ON the contusion (it should be adjacent); showing penetrating depth electrodes (this is subdural surface placement); standard scalp EEG-style electrodes.

**Reference:** Dreier 2017 COSBID consensus.

---

## A9. EEGMontage — `<EEGMontage />`

**File:** `src/components/content/illustrations/EEGMontage.tsx`
**Appears on:** `/modalities/eeg/` (Fig. 1)
**Aspect:** 16:9 split panel (10-20 head map + bipolar vs referential side-by-side)

**Prompt:**

> Three-panel EEG montage schematic on a dark navy background. **Left panel: 10-20 international system head map** — a top-down view of a paediatric head (nose at top, ears at sides) showing all 19 standard scalp electrode positions as small filled circles, each labelled by the standard nomenclature: Fp1, Fp2 (frontopolar); F3, F4, F7, F8, Fz (frontal); C3, C4, Cz (central); T3, T4, T5, T6 (temporal); P3, P4, Pz (parietal); O1, O2 (occipital). Include reference electrodes A1, A2 at the ears. Use teal for left-hemisphere electrodes, amber for right-hemisphere electrodes, white for midline (z) electrodes. **Top-right panel: bipolar (longitudinal "banana") montage** — same head map but with curved arrows connecting adjacent electrodes in anterior-to-posterior chains (Fp1-F3-C3-P3-O1 on the left; Fp2-F4-C4-P4-O2 on the right). Each chain is colour-coded as a chain. **Bottom-right panel: referential (average reference) montage** — same head map with each electrode showing a small arrow pointing to a central "average reference" node (a small grey circle in the centre of the diagram representing the calculated average of all electrodes).

**Must label:** Left: all 19 electrode labels + "10-20 international system". Top-right: "Bipolar (longitudinal 'banana')" + arrows along chain. Bottom-right: "Referential (average reference)" + central average node.

**Avoid:** odd numbers on the right side (odd = left, even = right is the convention); missing the Cz/Pz/Fz midline electrodes; showing the head from the side.

**Reference:** ACNS 10-20 international system; Hirsch 2021 ACNS terminology.

---

## A10. MicrodialysisCatheter — `<MicrodialysisCatheter />`

**File:** `src/components/content/illustrations/MicrodialysisCatheter.tsx`
**Appears on:** `/modalities/microdialysis/` (Fig. 1)
**Aspect:** 16:9 (probe in brain + magnified membrane inset)

**Prompt:**

> Anatomical and engineering schematic on a dark navy background showing **cerebral microdialysis catheter** placement and operation. Left half: sagittal cross-section of a paediatric head showing a 0.6 mm diameter flexible catheter entering through a Kocher's-point cranial bolt (with adjacent ICP and PbtO₂ probes for context), traversing 2–3 cm into frontal white matter, with the distal 10–20 mm of the catheter (the membrane segment) sitting in viable tissue. The proximal end of the catheter exits the bolt and is connected via fine tubing to a tiny portable infusion pump (CMA pump, drawn as a small rectangular device with a display) and a sample-collection vial that holds clear dialysate. **Right half: large magnified inset (4×) of the catheter tip**, drawn as a tubular structure with a semi-permeable membrane on its outer surface. Show a small portion of the membrane in cross-section: inflow channel carrying perfusate (sterile Ringer's or CSF-like solution at 0.3 µL/min) along the inside of the catheter; outflow channel carrying dialysate back out. Across the membrane, small molecules (glucose, lactate, pyruvate, glutamate, glycerol, urea — each rendered as a different coloured small molecule) cross from the brain interstitium into the catheter; large molecules and cells (proteins, cells — large red shapes) are excluded. Label the molecular-weight cutoff (~20 kDa).

**Must label:** "Microdialysis catheter (0.6 mm)", "Membrane segment (10–20 mm)", "White matter depth 2–3 cm", "Cranial bolt at Kocher's point", "Perfusate inflow (0.3 µL/min)", "Dialysate outflow (hourly vials)", "20 kDa molecular-weight cutoff", "Crosses: glucose, lactate, pyruvate, glutamate, glycerol", "Excluded: proteins, cells".

**Avoid:** showing the catheter in grey matter (white matter is standard); omitting the inflow/outflow distinction; making the membrane look like a simple hole (it must be a semi-permeable barrier).

**Reference:** Hutchinson 2015 microdialysis consensus.

---

## A11. PupillaryPathway — `<PupillaryPathway />`

**File:** `src/components/content/illustrations/PupillaryPathway.tsx`
**Appears on:** `/modalities/pupillometry/` (Fig. 1), `/modalities/clinical-exam/`
**Aspect:** 4:3 (axial brain + interpretation key box)

**Prompt:**

> Neuroanatomical pathway diagram on a dark navy background showing **the pupillary light reflex arc**. Axial view of the brainstem and midbrain with both eyes drawn anteriorly. **Afferent limb (teal):** light enters the right eye → retina → optic nerve (CN II) → optic chiasm → optic tracts → bilateral pretectal nuclei in the midbrain (just rostral to the superior colliculus). **Efferent limb (amber):** from the pretectal nuclei, fibres project bilaterally to both Edinger-Westphal (EW) nuclei → preganglionic parasympathetic fibres run on the dorsal surface of CN III (oculomotor nerve) → synapse at the ciliary ganglion in the orbit → short ciliary nerves → sphincter pupillae muscle. Show both eyes constricting in response to light in either eye (direct + consensual reflex). **Bottom interpretation panel: UNCAL HERNIATION.** Schematic showing a unilateral mass effect compressing CN III at the tentorial edge. The parasympathetic fibres on the dorsal surface fail first → ipsilateral fixed dilated pupil. Two short italic interpretation lines: "Direct & consensual reflexes both absent on the affected side when light is shone there." / "(light to unaffected eye: both pupils still constrict via the intact contralateral arc.)"

**Must label:** "CN II (optic nerve)", "Optic chiasm", "Pretectal nucleus (bilateral)", "Edinger-Westphal nucleus", "CN III (oculomotor)", "Parasympathetic fibres (dorsal surface)", "Ciliary ganglion", "Sphincter pupillae", "Direct reflex", "Consensual reflex". Bottom panel: "UNCAL HERNIATION", interpretation lines above.

**Avoid:** placing the EW nucleus outside the midbrain; missing the bilateral projection (it's bilateral and crossed); cartoonish pupils.

**Reference:** Standard neuroanatomy; ORANGE study (Oddo 2018) for NPi interpretation context.

---

## A12. MxVsPrxArchitecture — `<MxVsPrxArchitecture />`

**File:** `src/components/content/illustrations/MxVsPrxArchitecture.tsx`
**Appears on:** `/modalities/mx/` (Fig. 1)
**Aspect:** 16:9 architecture flow diagram

**Prompt:**

> Computational-flow architecture diagram on a dark navy background showing the **PRx / Mx / ORx autoregulation-index triad**. Three parallel processing pipelines arranged top-to-bottom, each consisting of: input sensor icon (left) → signal acquisition box → slow-wave filter (0.003–0.05 Hz) box → Pearson-correlation block → output index value. **Top pipeline (PRx, teal):** ICP probe icon → "ICP slow waves" → filter → correlation with MAP → "PRx output". **Middle pipeline (Mx, amber):** TCD probe icon → "TCD MFV slow waves" → filter → correlation with CPP or MAP → "Mx output". **Bottom pipeline (ORx, mint):** NIRS optode icon → "rSO₂ slow waves" → filter → correlation with MAP → "ORx output". All three converge on a final shared interpretation panel showing a numeric scale from −1 to +1 with three colour-coded zones: green "≤ 0 intact", grey "0 to +0.25 ambiguous", red "> +0.3 impaired". Below the architecture, a small caption: "All three indices share the same slow-wave Pearson-correlation backbone; the input signal differs."

**Must label:** "PRx: ICP vs MAP slow waves", "Mx: TCD MFV vs CPP/MAP slow waves", "ORx: NIRS rSO₂ vs MAP slow waves", "Slow-wave band 0.003–0.05 Hz", "Pearson correlation (5-min window)", "Output range −1 to +1", "≤ 0 intact / 0 to +0.25 ambiguous / > +0.3 impaired".

**Avoid:** Mermaid-style boxy decision trees (this is an architecture diagram, not a flowchart); making the three pipelines look completely independent (highlight the shared backbone).

**Reference:** Czosnyka 1997 PRx; Czosnyka 1996 Mx; Brady 2010 ORx.

---

## A13. MxAutoregContrast — `<MxAutoregContrast />`

**File:** `src/components/content/illustrations/MxAutoregContrast.tsx`
**Appears on:** `/modalities/mx/` (Fig. 2)
**Aspect:** 16:9 stacked time-series

**Prompt:**

> Comparative time-series chart on a dark navy background showing **PRx and Mx computed on the same patient over the same observation window** (4 hours). Three stacked panels with a shared X-axis ("Time (hours): 0 to 4"). **Top panel:** MAP slow-wave trace (teal) and ICP slow-wave trace (amber), both rendered as smooth sinusoidal oscillations with periods of ~30–60 seconds. Show that during the first hour the MAP and ICP slow waves are anti-correlated (intact autoregulation), and during hours 2–3 they become positively correlated (impaired). **Middle panel:** continuous PRx trace, computed as a 5-min sliding Pearson correlation, plotted from −1 to +1 on the Y-axis. PRx oscillates around −0.2 in hour 1 (intact), rises through 0 in hour 2, and stays above +0.3 (impaired zone shaded red) in hours 3–4. **Bottom panel:** Mx trace, same structure, computed from TCD MFV slow waves vs MAP. Note that Mx tracks PRx closely but with slight lag and occasionally diverges (around hour 2.5) when the TCD signal has a transient artefact. Add a small annotation box labelled "Discordance: index disagrees when input-signal quality differs."

**Must label:** "MAP slow wave", "ICP slow wave", "PRx", "Mx", "intact ≤ 0", "ambiguous 0 to +0.25", "impaired > +0.3", "Discordance window", "Pearson over 5-min window".

**Avoid:** showing the indices as flat lines (they oscillate); identical traces for PRx and Mx (they should agree in trend but show small differences).

**Reference:** Rivera-Lara 2017 review; Brady 2010.

---

## A14. BrainCompartments — `<BrainCompartments />`

**File:** `src/components/content/illustrations/BrainCompartments.tsx`
**Appears on:** `/foundations/monro-kellie/` (Fig. 1)
**Aspect:** 16:9 split panel (baseline + mass lesion side-by-side)

**Prompt:**

> Conceptual anatomical diagram on a dark navy background illustrating the **Monro-Kellie doctrine** with two side-by-side coronal cross-sections of the skull and brain. **Left panel ("Baseline"):** coronal section through the head showing the cranial vault (warm-bone-coloured skull) containing three colour-coded compartments by volume: brain parenchyma (dusty pink, ~80%), intracranial blood (red, ~10%), CSF (pale blue, ~10%). Show CSF in the lateral ventricles + subarachnoid spaces. Show the lower opening at the foramen magnum where CSF can translocate to the spinal compartment. **Right panel ("Mass lesion"):** same coronal section but with a growing mass (rendered as a circumscribed amber/red lesion in one hemisphere). The three compartments have shifted: CSF volume has decreased (lateral ventricles smaller, subarachnoid spaces compressed), venous blood compressed (smaller red volume), brain parenchyma roughly preserved but now displaced. Show CSF translocating downward through the foramen magnum to the spinal subarachnoid space (small arrow). Total intracranial volume is unchanged. Add an annotation: "Total volume constant. With a growing mass: CSF translocates first → venous blood compressed → then ICP rises on the Marmarou exponential."

**Must label:** "Brain ~80%", "Blood ~10%", "CSF ~10%", "Lateral ventricles", "Subarachnoid space", "Falx cerebri", "Foramen magnum (CSF translocation)", "Mass lesion", "CSF translocates first → blood compressed → ICP rises".

**Avoid:** showing all three compartments equal in volume; missing the foramen magnum escape route; failing to show the volume rearrangement.

**Reference:** Monro 1783; Kellie 1824.

---

## A15. MarmarouCurve — `<MarmarouCurve />`

**File:** `src/components/content/illustrations/MarmarouCurve.tsx`
**Appears on:** `/foundations/marmarou-pv-curve/` (Fig. 1)
**Aspect:** 16:9 single annotated curve

**Prompt:**

> Mathematical pressure-volume curve illustration on a dark navy background showing the **Marmarou pressure-volume relationship**. X-axis: "Volume added (mL)" from 0 to 25. Y-axis: "ICP (mmHg)" from 0 to 60. Draw a smooth exponential curve starting at ICP 8 mmHg, V 0 mL, rising slowly through the "compensated phase" (left segment, flat-ish slope) until ~V 10 mL, then bending sharply upward through "the knee", then steeply ascending through the "decompensated phase" (right segment) to ICP 50+ mmHg. Use a teal curve. Below the curve, shade the compensated region green ("CSF and venous blood absorb the added volume") and the decompensated region red ("buffers exhausted; small volume = large pressure"). Annotate the knee with a labelled point. Add three small example points along the curve at typical operating points: "Healthy" (low volume, low pressure), "Compensated TBI" (mid-curve), "Decompensated TBI" (steep limb). Add a side equation box: ICP = ICP₀ × exp(ΔV / PVI), with "PVI ≈ 25 mL (healthy adult), 10–15 mL (injured)" annotated. Include a small inset showing how RAP and the P2-dominant waveform localise the operating point at the bedside.

**Must label:** "ICP (mmHg)", "Volume added (mL)", "Compensated phase", "Decompensated phase", "Knee", "Healthy", "Compensated TBI", "Decompensated TBI", "ICP = ICP₀ × e^(ΔV/PVI)", "PVI ~25 mL healthy / 10–15 mL injured".

**Avoid:** a straight (linear) line instead of an exponential; missing the knee transition; placing the knee at very low volumes (typical knee is around 10 mL added).

**Reference:** Marmarou 1975; Avezaat 1979.

---

## A16. AstrupCascadeFig — `<AstrupCascadeFig />`

**File:** `src/components/content/illustrations/AstrupCascadeFig.tsx`
**Appears on:** `/foundations/astrup-cascade/` (Fig. 1)
**Aspect:** 16:9 vertical CBF axis with threshold bands

**Prompt:**

> Threshold-ladder diagram on a dark navy background showing the **Astrup cascade of progressive cerebral failure** as CBF declines. Vertical thermometer-style axis with CBF labelled in mL/100g/min from 50 (top, normal) to 0 (bottom, infarction). Five horizontal threshold bands stacked top-to-bottom, each shaded a different colour and labelled with the CBF range, the metabolic/functional state, and which monitor would detect it: (1) **≥ 50 mL/100g/min**: green band, "Normal CBF and CMRO₂"; (2) **25–49**: yellow-green band, "Oligaemia, mild slowing", detected by "qEEG/aEEG"; (3) **15–24**: amber band, "Electrical failure / penumbra (salvageable)", detected by "PbtO₂ falling, EEG slowing → suppression"; (4) **10–14**: orange band, "Ion-pump failure / membrane injury", detected by "MD L/P rising, PbtO₂ < 15"; (5) **< 10**: deep red band, "Membrane failure → infarction", detected by "Isoelectric EEG, PbtO₂ < 10, TCD reverse-flow". On the right side, show a vertical "Penumbra" bracket spanning the 10 to 25 range (the salvageable middle band). Add a small parallel axis on the right side showing PbtO₂ values from "> 25 (normal)" at top to "< 10 (critical)" at bottom, aligned with the CBF bands.

**Must label:** "CBF (mL/100g/min)", "PbtO₂ (mmHg)", "Normal", "Oligaemia", "Electrical failure (penumbra)", "Ion-pump failure", "Membrane failure / infarction", "qEEG/aEEG (slowing)", "PbtO₂ (BOOST frame)", "Microdialysis L/P", "Penumbra bracket: 10–25 mL/100g/min (salvageable)".

**Avoid:** placing the membrane-failure threshold above the electrical-failure threshold (electrical fails first, membrane later — the order matters); flipping the axis (CBF declines top-to-bottom).

**Reference:** Astrup 1981 conceptual; Hossmann 1994.

---

## A17. AutoregLayered — `<AutoregLayered />`

**File:** `src/components/content/illustrations/AutoregLayered.tsx`
**Appears on:** `/foundations/autoregulation/` (Fig. 1)
**Aspect:** 4:3 X-Y plot with three overlaid curves

**Prompt:**

> Classic cerebral autoregulation curve illustration on a dark navy background showing **three overlaid Lassen curves** comparing healthy adult, neonate, and severe-TBI states. X-axis: "MAP (mmHg)" from 0 to 200. Y-axis: "CBF (mL/100g/min)" from 0 to 100. **Curve 1 (Healthy adult, teal):** classic plateau from MAP ~60 to ~150 mmHg with CBF ~50; passive linear rise below 60 (lower limit of autoregulation, LLA) and above 150 (upper limit, ULA). **Curve 2 (Neonate, mint green):** narrower plateau (only ~20 mmHg wide, e.g., from MAP 35 to 55), shifted leftward, slightly lower plateau CBF. **Curve 3 (Severe TBI, amber):** plateau has collapsed; the curve approaches a pressure-passive linear relationship through the entire MAP range. Label LLA and ULA on the healthy curve. Add two annotated operating points: a green dot "healthy · on plateau (CPP 105)" at MAP 105 / CBF 50; an amber dot "TBI · CPP 40 (below LLA → passive)" at MAP 40 / CBF 25. Use dashed leader lines from each operating point to its annotation in the upper margin. Each curve labelled with its identity in matching colour.

**Must label:** "MAP (mmHg)", "CBF (mL/100g/min)", "Healthy adult", "Neonate (narrower plateau)", "Severe TBI (pressure-passive)", "LLA", "ULA", "healthy · on plateau (CPP 105)", "TBI · CPP 40 (below LLA → passive)".

**Avoid:** making all three curves the same shape; placing the neonate plateau at adult MAP values; missing the "passive linear" behaviour outside the plateau.

**Reference:** Lassen 1959; Brady 2009 piglet data; Czosnyka 2014 TBI autoregulation.

---

## A18. NeurovascularUnit — `<NeurovascularUnit />`

**File:** `src/components/content/illustrations/NeurovascularUnit.tsx`
**Appears on:** `/foundations/blood-brain-barrier/` (Fig. 1)
**Aspect:** 4:3 capillary cross-section

**Prompt:**

> Cellular-level cross-section schematic on a dark navy background showing the **neurovascular unit (NVU) at a brain capillary**. Center: a longitudinal section of a capillary lumen (filled with red blood cells and serum). Surrounding the lumen, draw the layered architecture of the BBB: (1) **endothelial cells** lining the lumen, joined by prominent **tight junctions** (yellow bands at cell-cell contacts) — show 2–3 endothelial cells with their cytoplasm and nuclei; (2) thin **basement membrane** outside the endothelium (drawn as a thin grey/pale layer); (3) a **pericyte** wrapped around the basement membrane on one side, with characteristic long processes (drawn as purple-toned); (4) **astrocyte end-feet** (teal/green) ensheathing most of the abluminal surface, with the astrocyte body shown nearby with multiple processes; (5) a nearby **neuron** (yellow/amber) shown with dendrites and a single axon, with one dendritic terminal forming a synaptic contact with the astrocyte. **Transport arrows:** show three classes of substances crossing or being excluded: (a) green arrow "O₂ / CO₂ free diffusion" through endothelial cell; (b) blue arrow "glucose via GLUT1 facilitated transport" through endothelial cell; (c) red blocked arrow "large drugs / proteins excluded" with a "no entry" symbol at the tight junction; (d) red blocked arrow "P-gp / MRP active efflux" pumping substances back into the lumen.

**Must label:** "Capillary lumen", "Red blood cell", "Endothelial cell", "Tight junction (claudin-5, occludin)", "Basement membrane", "Pericyte", "Astrocyte end-foot", "Astrocyte body", "Neuron", "O₂ / CO₂ free diffusion", "Glucose via GLUT1", "Excluded: proteins, most drugs", "P-gp / MRP active efflux".

**Avoid:** showing the tight junctions as gaps (they SEAL the paracellular route); making the astrocyte end-feet look like a separate cell type (they're processes of the astrocyte); omitting any of the four cell types.

**Reference:** Standard NVU anatomy; Daneman & Prat 2015 BBB review.

---

## A19. NCSEPathway — `<NCSEPathway />`

**File:** `src/components/content/illustrations/NCSEPathway.tsx`
**Appears on:** `/integration/eeg-tcd-non-convulsive/` (Fig. 1)
**Aspect:** 16:9 decision flowchart with paired EEG/TCD traces

**Prompt:**

> Clinical decision-tree diagram on a dark navy background showing the **non-convulsive status epilepticus (NCSE) diagnostic and treatment pathway** with paired EEG/TCD signal panels. **Top half: decision tree.** Start node: "Sedated/comatose PICU patient with unexplained altered consciousness". → Continuous EEG showing "Rhythmic discharges > 2.5 Hz OR periodic discharges with spatiotemporal evolution OR focal slowing with reactivity loss" → "Suspected NCSE" → IV benzodiazepine trial (2 mg lorazepam IV) → either: (a) "Pattern resolves + clinical improvement → NCSE confirmed → escalate per ESETT ladder (LEV, FOS, VPA, then continuous infusion)" or (b) "No pattern change → consider sedation-induced burst-suppression or other encephalopathy → reduce sedation and re-read". Use teal nodes for decisions, amber for actions, red for "NCSE confirmed" outcome. **Bottom half: paired signal panels** showing the bedside corollary on TCD: a small two-column comparison: left column "Sedation burst-suppression" (small TCD MFV rises matching aEEG bursts); right column "NCSE" (large TCD MFV rises with post-ictal undershoot following the rhythmic EEG bursts). Each column shows three stacked traces: aEEG envelope (saw-tooth), TCD MFV, full-montage EEG morphology snapshot.

**Must label:** "Suspected NCSE: rhythmic >2.5 Hz OR PD with evolution OR focal slowing", "Benzodiazepine trial", "Resolves → NCSE confirmed → ESETT ladder", "No change → reduce sedation, re-read", "Sedation burst-suppression", "NCSE", "aEEG", "TCD MFV", "Full-montage EEG".

**Avoid:** overly complex tree with many branches (keep it simple, 5–7 nodes); making the two TCD patterns identical.

**Reference:** Hirsch 2021 ACNS terminology; Kapur 2019 ESETT.

---

## A20. PostArrestProgPathway — `<PostArrestProgPathway />`

**File:** `src/components/content/illustrations/PostArrestProgPathway.tsx`
**Appears on:** `/integration/mnm-in-the-newborn/` (Fig. 1)
**Aspect:** 16:9 multimodal decision tree with time axis

**Prompt:**

> Time-anchored multimodal prognostication decision tree on a dark navy background showing the **post-cardiac-arrest neuroprognostication pathway** (or equivalently, neonatal HIE prognostication after 72-hour cooling). Horizontal time axis at the bottom labelled "ROSC → 12h → 24h → 48h → 72h → day 4–7". At each time point, stack three multimodal lanes vertically: (1) **Clinical exam** (top lane): pupillary response, motor response, brainstem reflexes — render as small clinical icons that gain or lose colour depending on time; (2) **Continuous EEG / aEEG** (middle lane): show evolution from isoelectric at 12h → discontinuous at 24–48h → continuous with sleep-wake cycling by 72h (favourable trajectory, green) vs persistent isoelectric or burst-suppression (unfavourable, red); (3) **SSEP + NIRS** (bottom lane): bilaterally present N20 (favourable) vs bilaterally absent N20 (unfavourable, red); NIRS rSO₂ trending back to 70% (favourable) vs paradoxical luxury perfusion 85+% (unfavourable). At day 4–7, all three lanes converge on the prognostic anchor: **MRI** showing one of three injury patterns (basal ganglia + thalamus = worst; watershed; or diffuse cortical/subcortical). Final outcome boxes on the far right: green "Favourable phenotype: continue full support" vs red "Poor phenotype: support honest WLST conversation". Use Edinger-Westphal-style symbols and clean clinical icons.

**Must label:** "ROSC", "12h", "24h", "48h", "72h", "Day 4–7 MRI", "Clinical exam", "cEEG / aEEG", "SSEP + NIRS", "Favourable trajectory", "Poor trajectory", "BGT pattern (worst)", "Watershed", "Diffuse cortical".

**Avoid:** making the favourable and unfavourable trajectories indistinguishable; missing the MRI anchor at day 4–7; rendering EEG as scalp electrodes (it's a trajectory schematic, not an electrode map).

**Reference:** Topjian 2021 AHA pediatric post-arrest; Sansevere 2023 neonatal cEEG.

---

## A21. RaisedICPLadder — `<RaisedICPLadder />`

**File:** `src/components/content/illustrations/RaisedICPLadder.tsx`
**Appears on:** `/modalities/icp/` (Fig. 5)
**Aspect:** 4:3 vertical escalation ladder

**Prompt:**

> Vertical clinical-escalation-ladder schematic on a dark navy background showing the **pediatric raised-ICP tier framework** (adapted from PBTF / Kochanek 2019). Six horizontal tier bars stacked top-to-bottom, each full-width, each with a coloured left edge and short bold label: (Tier 0, grey) "Confirm signal: transducer level, zero, clean waveform, sustained > 5 min"; (Tier 1, green) "First-line: head-up 30°, sedation, normocapnia, normothermia, Na 145–150, drain EVD"; (Tier 2, amber) "Hyperosmolar: 3% NaCl 3–5 mL/kg over 10–20 min OR mannitol 0.25–1 g/kg"; (Tier 3, orange) "Deeper sedation ± neuromuscular blockade: midazolam, fentanyl, paralyse if shivering/coughing driving ICP"; (Tier 4, deep orange) "Bridge therapies: PaCO₂ 30–35 BRIEFLY, targeted hypothermia 35–36 °C"; (Tier 5, deep red) "Barbiturate coma / craniectomy: pentobarbital → cEEG burst-suppression, surgical decompression". Between each tier, draw a downward arrow with the italic teal label "if response inadequate" sitting ABOVE the arrowhead (not alongside). Bottom of the figure: a red-bordered reminder box: "REMINDERS: confirm signal first · prophylactic deep hyperventilation harms · individualise with PRx/CPPopt where available". Top header: "RAISED ICP · PEDIATRIC ESCALATION LADDER" + subheader "Each step = 30–60 min trial · Re-evaluate ICP / pupils / NIRS / CT before escalating".

**Must label:** "TIER 0 CONFIRM SIGNAL" through "TIER 5 BARBITURATE COMA / CRANIECTOMY", "if response inadequate", "REMINDERS", and all tier-specific drug doses.

**Avoid:** missing the "confirm signal" step (tier 0 is the most-skipped); placing barbiturate coma before hyperosmolar (the order matters); cluttering the connector arrows with the response-inadequate text.

**Reference:** Kochanek 2019 PBTF 4; ESPNIC / NCS pediatric consensus.

---

## A22. TCDWindows — `<TCDWindows />` (already rendered on the site)

**File:** `src/components/content/illustrations/TCDWindows.tsx`
**Appears on:** `/modalities/tcd/` (already in place)
**Aspect:** 4:3 lateral skull view

**Prompt (for any polish/regeneration pass):**

> Lateral-view skull diagram on a dark navy background showing the **four standard transcranial Doppler acoustic windows** for insonating the cerebral arteries. Render a paediatric skull from the side, partly transparent, with the major intracranial arteries (Circle of Willis structures) visible inside: ICA, MCA (M1, M2 segments), ACA (A1, A2), PCA (P1, P2), basilar artery, vertebrals. Mark four windows as coloured circular probe-placement icons: (1) **Trans-temporal** (teal, above and anterior to the ear) → insonates MCA (45–60 mm depth), ACA (60–70 mm), terminal ICA (60 mm), PCA (60–75 mm); (2) **Trans-orbital** (amber, over closed eyelid) → insonates ophthalmic artery (50 mm) and ICA siphon (60–80 mm); (3) **Sub-occipital / trans-foraminal** (mint, below the occiput at the foramen magnum) → insonates basilar (80–100 mm) and vertebrals (50–80 mm); (4) **Sub-mandibular** (purple, below the angle of the mandible) → insonates the distal extracranial ICA (40–60 mm). Each window has an arrow showing beam direction and a small bullet list of "what artery, what depth". Include a table or callouts on the side listing the canonical depths.

**Must label:** "Trans-temporal", "Trans-orbital", "Sub-occipital", "Sub-mandibular", names of insonated arteries, "depth in mm".

**Avoid:** placing the trans-temporal window too posteriorly; missing the depths.

**Reference:** Aaslid 1982; Lindegaard 1989.

---

# Part B — Data-visualisation / waveform / pattern-library figures

These are not "anatomical" in the strict sense but are clinical figures that benefit from polished rendering. Brief prompts for each; full details on request.

## B1. `/images/icp/lundberg-waves.svg`
Three time-series traces stacked vertically on a dark background: **Lundberg A** (plateau wave, trapezoidal rise to 50–100 mmHg above baseline, sustained 5–20 minutes, then drops back); **Lundberg B** (rhythmic 0.5–2 per minute oscillations, peaks 20–40 mmHg, often during REM sleep or compensated raised ICP); **Lundberg C** (4–8 per minute, low amplitude, low clinical significance). Each trace ~5 minutes long with time axis. Annotate amplitudes and frequencies.

## B2. `/images/icp/age-band-icp-thresholds.svg`
Horizontal bar chart with five age bands (neonate, infant, toddler, child, adolescent) and two stacked threshold values per band: "resting ICP" (lower bar, blue) and "treatment threshold" (upper bar, red). Add a callout: "PBTF 2019 = 20 mmHg across all pediatric ages; lower values are centre heuristics, not guideline."

## B3. `/images/nirs/rso2-trend-shock.svg`
12-hour time-series showing rSO₂ trace (teal) falling from 70% baseline to 45% over 2 hours of septic shock, then recovering after fluid bolus and noradrenaline (events annotated with vertical dashed lines). Overlay MAP (amber line) showing concurrent BP trajectory.

## B4. `/images/nirs/orx-vs-prx-discordance.svg`
Side-by-side trends: one panel shows PRx +0.1 (intact, teal) while ORx +0.45 (impaired, red) over the same 4 hours. Below, a mechanism diagram showing macrovascular autoregulation intact vs tissue-level microvascular shunting failing (sepsis, anaemia).

## B5. `/images/eeg/pattern-library.svg`
Eight-panel pattern library on a dark grid (2 × 4): normal background, burst-suppression, GPDs, LPDs, NCSE (rhythmic spike-and-wave with frequency evolution), isoelectric, alpha coma, theta coma. Each panel ~3 seconds of multi-channel EEG.

## B6. `/images/eeg/aDR-trend.svg`
Quantitative EEG time-series showing alpha-delta ratio (ADR, teal) falling 30% over 6 hours (from 1.0 to 0.7) in SAH day 6, ahead of clinical signs of DCI marked with a red event line at hour 8.

## B7. `/images/pbto2/pbto2-trend-events.svg`
12-hour PbtO₂ trace (teal) on dark background with annotated bedside events (vertical dashed lines): suction event (transient drop), CPP drop, fever, recovery. Show how each event is recognisable in the trace shape.

## B8. `/images/pbto2/pbto2-cpp-titration.svg`
Bedside titration decision tree (vertical flowchart): "Low PbtO₂?" → check sequentially "MAP/CPP → FiO₂ → Hb → temperature/fever → sedation → sepsis" with action at each step. Use teal nodes for decisions, amber for actions.

## B9. `/images/onsd/onsd-by-age.svg`
Three age-band cards showing ONSD cutoffs (post-audit values): "<1 year: > 4.0 mm" (green), "1–15 years: > 4.5 mm" (amber), "Adult: > 5.0 mm" (orange).

## B10. `/images/foundations/co2-o2-reactivity/co2-curve.svg`
CO₂ reactivity curve on dark background: CBF (Y) vs PaCO₂ (X) from 20 to 80 mmHg. Show a sigmoid with linear central segment ("3–4% per mmHg in the linear range 25–60 mmHg"). Add markers at PaCO₂ 28 (hypocapnia, vasoconstriction risk), 35 (normocapnia), 50 (hypercapnia ceiling).

## B11. `/images/foundations/co2-o2-reactivity/o2-reactivity-low-pao2.svg`
CBF vs PaO₂ on dark background. Hyperbolic curve: flat from 100 mmHg down to ~50 mmHg, then steep rise (vasodilation) as PaO₂ drops below 50. Mark the "vasodilation onset" at 50 mmHg.

## B12. `/images/foundations/cerebral-metabolism/cmro2-temperature.svg`
CMRO₂ multiplier vs brain temperature: X-axis 30 to 42 °C, Y-axis CMRO₂ multiplier 0.5 to 1.5. Plot the curve `1.07^(T-37)` (this is the corrected formula). Highlight the **therapeutic window 33–34 °C** as a coloured band. Mark "normothermia 37 °C = 1.0", "fever 39 °C = 1.14 (+14%)", "hypothermia 33 °C = 0.75 (−25%)".

## B13. `/images/foundations/spreading-depolarizations/sd-propagation.svg`
Top-down view of a cortex with an SD wave propagating outward from an injury focus. Wave shown as concentric coloured rings moving at 2–5 mm/min. Below, an ECoG trace showing the SD signature: slow negative DC shift (1–2 minutes) with simultaneous high-frequency suppression.

## B14. `/images/foundations/pediatric-physiology/peds-mfv-and-icp-age.svg`
Two-panel chart: left panel "MCA MFV by age" showing peak at 4–6 years (~100–110 cm/s) falling to adult ~55 cm/s by adolescence (with O'Brien 2015 norm bands shown as shaded ribbons); right panel "Pediatric ICP treatment threshold" with the PBTF 2019 guideline value (20 mmHg flat across ages) marked as the canonical line, and a fainter "centre heuristic" stepped line (10 → 15 → 20 → 22 by age).

## B15. `/images/clinical-exam/gcs-vs-four.svg`
Two-column comparison of GCS and FOUR score components, with paediatric GCS variants (P-GCS, Adelaide) in callouts. Use clean clinical typography.

## B16. `/images/cpp/triangle-equation.svg`
Conceptual triangle diagram: MAP (top vertex), ICP (left), CPP (right), with CPP = MAP − ICP equation. Show that the same CPP can be reached from many (MAP, ICP) pairs.

## B17. `/images/rap/rap-vs-icp.svg`
Plot of RAP (Y, range −0.5 to +1) vs mean ICP (X, range 0 to 60). Three zones: good compliance (RAP near 0, ICP low), poor compliance (RAP ~+0.7, ICP 15–25), exhausted (RAP falling toward 0 or negative at very high ICP > 40).

## B18. `/images/aeeg/aeeg-patterns.svg`
Five aEEG canonical patterns side-by-side (Hellström-Westas classification): continuous normal voltage, discontinuous normal, burst-suppression, low voltage, flat trace. Each panel ~6 hours of aEEG envelope.

## B19. `/images/qeeg/qeeg-spectrogram.svg`
Time-frequency spectrogram (X = time hours, Y = frequency Hz, colour = power) showing alpha-delta ratio drop preceding DCI in SAH. Overlay a suppression burst index line.

## B20. `/images/bis/bis-vs-sedation.svg`
Horizontal scale 0 to 100 BIS with bands: awake (90–100), light sedation (70–80), surgical anaesthesia (40–60), deep (< 40), isoelectric (~0). Place icons of patient state above each band.

## B21. `/images/microdialysis/lpr-grid.svg`
2-D quadrant grid: X = pyruvate (µmol/L), Y = lactate (mmol/L). Four labelled quadrants: normal metabolism (low L, normal P), ischaemia (high L, low P), mitochondrial dysfunction (high L, normal-high P), atypical (low L, high P). Add a companion four-column readout: glucose / glutamate / glycerol / L/P.

## B22. `/images/non-invasive-icp/methods-comparison.svg`
Comparison table or panel grid of non-invasive ICP estimators: TCD-PI, ONSD, Brain4Care extensometer, tympanic membrane displacement. For each: an icon, key feature, accuracy summary (sensitivity / specificity), age limits, ease of bedside use.

## B23. `/images/brain-temp/brain-core-gradient.svg`
Two-panel: left = sagittal head with thermal gradient overlay showing brain at 38 °C, core at 37 °C; right = bar chart "brain − core gradient" widening from 0.5 °C (healthy) to 2 °C (injury, fever).

## B24. `/images/direct-cbf/thermal-diffusion.svg`
Hemedex / Bowman thermal-diffusion CBF probe schematic: heated thermistor + reference thermistor; measurement principle (heat dissipation = local blood flow).

## B25. `/images/pediatric-stroke-monitoring/aha-pathway.svg`
Pediatric AIS pathway flowchart (AHA 2019 Ferriero): door → imaging (CT/CTA) → IV-tPA / thrombectomy candidacy → post-recanalisation monitoring (TCD, NIRS, cEEG).

## B26. `/images/foundations/autoregulation/myogenic-metabolic-neurogenic.svg`
Three-row diagram showing autoregulation mechanisms by timescale: myogenic (5–15 s, vessel stretch response), metabolic (~30 s, local CO₂ / H⁺ / adenosine), neurogenic (minutes, sympathetic tone). Each row has schematic vessels constricting/dilating with the matching mechanism.

## B27. Integration scenario timelines

- `/images/integration/tcd-vs-icp-vasospasm/timeline.svg` — SAH days 0–14 timeline with ICP, MFV, Lindegaard ratio, neuro exam, spasm window highlighted.
- `/images/integration/cppopt-targeting/dose-response.svg` — Aries 2012-style curve: time outside CPPopt vs neurological outcome.
- `/images/integration/osmotherapy-icp-nirs/triple-trend.svg` — ICP, rSO₂, Na traces after a 3% NaCl bolus over 30 minutes.
- `/images/integration/mnm-on-ecmo/embolus-detection.svg` — TCD HITS bar chart per ECMO day with neurological event overlays.
- `/images/integration/brain-death-mnm/ancillary-tree.svg` — Brain-death ancillary-test decision tree.
- `/images/integration/dka-cerebral-edema/timeline.svg` — Rehydration time-course with PI rise, pupillary asymmetry, herniation window.
- `/images/integration/meningitis-encephalitis/icp-pathway.svg` — Bacterial-meningitis raised-ICP pathway (hydrocephalus vs cerebritis vs vasculitic vasospasm).
- `/images/integration/pbto2-cpp-titration/boost2-3.svg` — BOOST-II vs BOOST-III trial result summary bar chart.
- `/images/integration/refractory-status-epilepticus/treatment-ladder.svg` — RSE escalation ladder with aEEG/cEEG endpoints.
- `/images/integration/inborn-errors-encephalopathy/leigh-mri.svg` — Leigh syndrome MRI schematic with bilateral basal ganglia + brainstem T2 hyperintensities.
- `/images/integration/resource-limited-bedside/three-modality-bundle.svg` — Resource-limited bundle: exam + ONSD + fontanelle US + handheld TCD.
- `/images/integration/family-communication-mnm/conversation-templates.svg` — Three conversation templates as say-this / avoid-this columns.
- `/images/integration/wlst-organ-donation/dcd-pathway.svg` — DCD pathway operational diagram.
- `/images/integration/prx-vs-orx-discordance/mechanism.svg` — Macrovascular vs tissue-level autoregulation mechanism diagram.
- `/images/integration/discordance-triage/flowchart.svg` — Multimodal disagreement triage flowchart.
- `/images/integration/pediatric-stroke-ais/maya-case.svg` — Maya, 8y AIS case timeline.

For any of these, contact the original audit author for specific data to plot (the schematics need real numbers from real cited cohorts).

---

# Part C — Usage notes

## How to use these prompts

1. **Copy the global style guidance block at the top into every prompt** so the AI image generator inherits the colour palette and dark-mode theme. Without this, output will default to white backgrounds.
2. **Append the colour-conventions table** to any prompt where label colour matching matters (most of them).
3. **For models that struggle with long prompts** (DALL-E 3 caps at ~4000 chars), drop the example/operating-point lists and keep the core anatomical description.
4. **Render at 2× target display size** for crisp downscaling. The site renders illustrations at ~720 × 540 (foundation pages) or 800 × 380 (modality figures), so generate at 1440 × 1080 minimum.
5. **Generate 4 candidates per prompt** and pick the most anatomically accurate. AI image generators are notorious for hallucinating extra eyes, mis-routing nerves, and labelling structures incorrectly. The Pupillary Pathway and Evoked Potential Pathway prompts are especially vulnerable to this.
6. **Post-process the labels in Inkscape / Illustrator** if the AI labelling is wrong. The anatomy can stay; the text usually needs manual correction.
7. **Save as SVG when possible** (some models export PNG only; use a vector trace pass). Store under `public/images/<page>/<slug>.svg` matching the path in the relevant MDX `<Figure src=...>` to replace the placeholder.
8. **For React-component figures (Part A)**, the polished image replaces the React render. To swap, change the MDX from `<Figure caption=...><ComponentName /></Figure>` back to `<Figure src="..." caption=.../>` form. Or hand the polished SVG back to a developer to re-render the React component with the new artwork.

## Recommended AI generator per illustration type

| Type | Best model |
|---|---|
| Anatomical cross-sections (A1, A4, A5, A6) | DALL-E 3 (best for clean schematic style); Midjourney v6 (best for atmospheric rendering) |
| Cellular / molecular detail (A18 NVU, A10 microdialysis) | Midjourney v6 (best texture); Stable Diffusion XL with biology LoRA |
| Pathway / circuit diagrams (A7 SSEP/BAER, A11 pupillary) | DALL-E 3 (best for clean line + label work); Flux 1.1 Pro (best for technical accuracy) |
| Time-series and charts (B1–B5, B6–B9) | Pure SVG hand-coding or D3 likely faster than AI; if AI, use ChatGPT with code interpreter to produce SVG directly |
| Decision trees (A19, A20, B22 onwards) | Mermaid / Excalidraw (machine output); AI image generators struggle with tree topology |

## Clinical-accuracy checklist (apply to every generated image before publication)

- [ ] Anatomy correct (no extra digits, eyes, vessels, ventricles)
- [ ] Catheter / probe placement in the correct anatomical region
- [ ] Threshold values match the corrected post-audit numbers (ONSD 4.0 / 4.5 / 5.0; PRx Sorrentino 3-tier; PbtO₂ BOOST-II frame; CMRO₂ formula without /10)
- [ ] Labels spelled correctly and pointing to the right structure
- [ ] Pediatric vs adult anatomy as appropriate (open fontanelles, narrower autoregulation plateau, age-banded MFV)
- [ ] No em-dashes in labels (style guide rule)
- [ ] No "AI-generated" watermark in the corner
- [ ] Colour-palette consistent with the site (teal, amber, mint, red, dark navy)

---

**Total:** 22 React-component anatomical illustrations (Part A, fully detailed) + 27 supporting data-viz figures (Part B, brief prompts). All current site illustrations are covered.

**Maintainer:** when you commission polished artwork, please update this file with the chosen artist / model / final filename so the team can track provenance.
