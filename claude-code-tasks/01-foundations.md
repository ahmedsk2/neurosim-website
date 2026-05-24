# Foundation chapter briefs (Tier 2)

Nine foundation chapters at `src/content/foundations/*.mdx`. Each gets a Tier 2 expansion: roughly 2x the current length, add one bedside vignette, expand the "why it matters" framing, embed at least one new figure, refresh references against `05-references-to-add.md`, end with a 3-question Quiz.

**Common spine** (Tier 2):

1. Frontmatter (keep existing title/eyebrow; update `lastReviewed`).
2. Acronyms callout (only if 5+ acronyms are used on the page).
3. TldrCard.
4. One bedside vignette.
5. The mechanism / equation primer (existing).
6. Why it matters (clinical importance).
7. Pediatric considerations (Pediatric callout).
8. Pattern library or figure (existing or new).
9. Common pitfalls.
10. Combine-with cross-links to relevant modalities.
11. Evidence summary.
12. Self-check Quiz.

---

## 1. `autoregulation.mdx`

**Current state**: ~400 lines, the most developed foundation page. Already has Lassen-curve description, three mechanisms, PRx/Mx/ORx links.

**Target**: Add tighter bedside framing, an explicit BP-target reasoning section, a new "Why pediatric autoregulation is different" subsection, and a self-check.

**New sections to insert / expand**:

- After section 1 (the introductory paragraph), insert a TldrCard.
- Insert a bedside vignette before "How a single arteriole holds the line": a 9-year-old severe TBI day 3, PRx +0.4 sustained, MAP 65 → CPP 50. Question: where is CPPopt for this child?
- Expand "Why it matters at the bedside" with explicit LLA / ULA / passive zone consequences and a small management ladder.
- New subsection: "Setting individualised BP targets" with the four available indices (PRx, Mx, ORx, COx), their probe requirements, and recommended use cases.
- Pediatric callout: emphasise the narrower plateau (10-20 mmHg wide in infants); brady2009 piglet data.
- Self-check Quiz with three case stems.

**Figures to add (placeholders)**:
- `/images/foundations/autoregulation/lassen-curves-overlay.svg`
- `/images/foundations/autoregulation/myogenic-metabolic-neurogenic.svg`

**Citations to use** (existing or from 05-references-to-add):
`lassen1959`, `aaslid1989_autoreg`, `czosnyka1997prx`, `czosnyka1996mx`, `brady2007piglet`, `brady2009`, `aries2012cppopt`, `donnelly2017mapopt`, `rivera-lara2017autoreg`, `lee2009ndnirs`, `tasker2023_pccm_review`, `figaji2025_mmm_pediatric_consensus`.

**Widgets to embed (existing)**: `LassenCurve`, `PRxCalculator`, `MxCalculator`, `OrxCalculator`, `CPPoptUCurve`.

**Notes**: This is the most-linked foundation page. Quality bar is high. Keep the existing prose intact where it works; expand around it.

---

## 2. `co2-o2-reactivity.mdx`

**Current state**: shorter foundation page. Focus on CO2 vasoreactivity slope and the O2 reactivity hyperbola.

**Target**: ~2x length. Add one vignette (a hyperventilated infant with falling MFV), expand the management implications, link to NIRS / TCD.

**New sections**:
- TldrCard with the canonical bedside numbers (3-4% per mmHg PaCO2, vasoconstriction below 35).
- Bedside vignette: severe TBI ventilated to PaCO2 28, NIRS rSO2 falling, MFV falling. Restore to PaCO2 35.
- "When hypocapnia is helpful and when it harms": short ladder.
- Combine with NIRS (vasoreactivity testing as bedside autoreg surrogate).
- Quiz.

**Figures**: `/images/foundations/co2-o2-reactivity/co2-curve.svg`, `/images/foundations/co2-o2-reactivity/o2-reactivity-low-pao2.svg`.

**Citations**: `kety1948`, `reivich1964`, `obrien2015`, `figaji2025_mmm_pediatric_consensus`, `tasker2023_pccm_review`.

**Widgets**: `CO2ReactivityCurve`, `O2ReactivityCurve`.

---

## 3. `cerebral-metabolism.mdx`

**Current state**: covers CMRO2, CBF coupling, lactate / pyruvate, BBB transport.

**Target**: Add a temperature-CMRO2 section (cooling reduces demand 6-7% per degree), tie to HIE management, expand microdialysis link.

**New sections**:
- TldrCard.
- Bedside vignette: HIE day 1 cooled neonate; aEEG suppressed; rSO2 high; metabolism collapsed.
- Temperature subsection: CMRO2 fall with hypothermia; therapeutic window 33-34 C.
- "When supply meets demand": CMRO2 vs CBF coupling; how flow-metabolism uncoupling shows up at the bedside.
- Quiz.

**Figures**: `/images/foundations/cerebral-metabolism/cmro2-temperature.svg`.

**Citations**: `shankaran2005hie_nichd`, `moler2015thapca_oh`, `hutchinson2015_md`, `kirschen2020_pedshie_tcd`, `naim2023_brain_injury_pccm`.

**Widgets**: `CMRO2TempSlider`, `MicrodialysisGrid`.

---

## 4. `monro-kellie.mdx`

**Current state**: anatomical exposition of the three-compartment model.

**Target**: tighter bedside framing of what happens when the model fails (herniation, plateau waves, B-waves). Connect to ICP, RAP.

**New sections**:
- TldrCard.
- Vignette: 6-year-old with a unilateral mass, baseline ICP 12 with a normal RAP 0.4; small additional volume produces an ICP spike to 32.
- "Why the curve goes vertical": Marmarou exponential and compliance exhaustion.
- Combine-with: RAP, Marmarou PV curve, plateau-wave page.
- Quiz.

**Figures**: `/images/foundations/monro-kellie/compartments-shift.svg` (reuse `VolumeCompartmentAnimation` widget).

**Citations**: `monro1783`, `kellie1824`, `marmarou1975`, `avezaat1979`, `kim2009rap`.

**Widgets**: `VolumeCompartmentAnimation`, `MarmarouPVCurve`.

---

## 5. `marmarou-pv-curve.mdx`

**Current state**: explanation of the exponential PV curve, infusion test, RAP derivation.

**Target**: keep math; add bedside-importance framing, a pediatric note about smaller buffer volumes in infants, a "what you do at the bedside" subsection.

**New sections**:
- TldrCard.
- Vignette: post-craniectomy infant with a tense fontanelle; bedside infusion or palpation as proxy for the curve.
- Pediatric callout: smaller CSF buffer; faster decompensation.
- Combine-with: RAP, ICP, ONSD.
- Quiz.

**Figures**: `/images/foundations/marmarou-pv-curve/pv-curve-annotated.svg`.

**Citations**: `marmarou1975`, `czosnyka1996rap`, `kim2009rap`, `howells2017rap`, `kazimierska2021`.

**Widgets**: `MarmarouPVCurve`.

---

## 6. `astrup-cascade.mdx`

**Current state**: thresholds of ischaemia.

**Target**: add an aEEG / cEEG translation table (which CBF thresholds match which EEG patterns), tie to spreading depolarisations and microdialysis.

**New sections**:
- TldrCard.
- Vignette: post-arrest day 2 with aEEG burst-suppression; what CBF range is this likely in?
- "Where electrical failure meets membrane failure": SD generation zone.
- Combine-with: EEG, microdialysis, spreading-depolarizations.
- Quiz.

**Figures**: `/images/foundations/astrup-cascade/astrup-thresholds.svg`.

**Citations**: `astrup1981` (existing if any; else add), `hossmann1994`, `dreier2017sd_cosbid`, `hartings2020_sd_natural_history`.

**Widgets**: `AstrupCascade`, `EEGPatternLibrary`.

---

## 7. `spreading-depolarizations.mdx`

**Current state**: explains the wave, ECoG signature, COSBID, intervention trial mentions.

**Target**: refresh with 2020-2024 evidence, add a pediatric note (rare but real), strengthen mechanism diagram caption.

**New sections**:
- TldrCard.
- Vignette: severe TBI day 2 with ECoG strip in place; clustered SDs in the watershed.
- Brief evidence summary including hartings2024 phase II result.
- Pediatric callout: SDs documented in pediatric TBI but ECoG monitoring rare; aEEG suppression patterns may be a proxy.
- Combine-with: ECoG-SD modality, astrup cascade.
- Quiz.

**Figures**: `/images/foundations/spreading-depolarizations/sd-propagation.svg` (reuse `SDPropagation` widget).

**Citations**: `leao1944`, `dreier2009`, `dreier2017sd_cosbid`, `hartings2017cosbid`, `hartings2020_sd_natural_history`, `hartings2024_sd_intervention`.

**Widgets**: `SpreadingDepolarizationAnimator`, `SDPropagation`.

---

## 8. `blood-brain-barrier.mdx`

**Current state**: anatomy and transport mechanisms; breakdown in disease.

**Target**: shorter rewrite (still Tier 2). Add bedside relevance for steroid dosing, mannitol osmolar reflection coefficient, antibiotic CSF penetration.

**New sections**:
- TldrCard.
- Vignette: bacterial meningitis with raised ICP; why does dexamethasone reduce death.
- Reflection coefficient subsection: why mannitol and HTS draw water; pediatric considerations.
- Combine-with: osmotherapy page, meningitis-encephalitis page.
- Quiz.

**Figures**: `/images/foundations/blood-brain-barrier/bbb-anatomy.svg` (reuse `NeurovascularUnit` if it exists; else create placeholder).

**Citations**: `brouwer2010_dexamethasone_meta`, `tunkel2017idsa_encephalitis`, `vandebeek2016eu_meningitis`.

**Widgets**: none new.

---

## 9. `pediatric-physiology.mdx`

**Current state**: PALS hemodynamic ranges, brain growth, MFV by age, ICP thresholds by age.

**Target**: keep as reference page; expand age-band tables, add a "rules of thumb" section, link to AgeBandNorms widget.

**New sections**:
- TldrCard with the 5 most useful pediatric numbers (MAP at age, MFV peak at 4-6 y, ICP threshold 20 mmHg, normal CPP 50-60 in <2 y, narrower autoreg plateau).
- Vignette: comparing two infants at the same MAP and how it maps to plateau differently by age.
- Age-band table refresh with O'Brien 2015 and PALS 2020 references.
- Combine-with: every modality page.
- Quiz.

**Figures**: `/images/foundations/pediatric-physiology/peds-mfv-and-icp-age.svg`.

**Citations**: `bode1988`, `obrien2015`, `larovere2018_pedsais`, `kochanek2019_pbtf4`, `topjian2021aha_pediatric`.

**Widgets**: `AgeBandNorms`, `GCSChart` (pediatric variant).

---

## Foundation pages, completion checklist (per page)

- [ ] No em-dashes (`grep -c "—"` returns 0).
- [ ] No `<SpeakerNote>`.
- [ ] At least one new vignette inserted.
- [ ] TldrCard at top.
- [ ] 3-question Quiz at bottom.
- [ ] `lastReviewed` updated.
- [ ] All new `<Cite id>` keys exist in `references.ts`.
- [ ] All new `<Figure src>` paths exist in `public/images/foundations/...`.
- [ ] `npm run typecheck` passes.
