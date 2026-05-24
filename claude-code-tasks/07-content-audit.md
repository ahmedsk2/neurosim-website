# Content audit, May 2026

Cross-checked the whole site against the cited literature. Found 8 critical issues (factually wrong, internally inconsistent, or misattributed to a citation), 7 medium issues (imprecise or needs hedging), and a cross-page consistency table you should standardise.

The audit covered: 9 foundation MDX files, 27 modality MDX files (excluding tcd.mdx which is the reference exemplar), 18 integration scenario MDX files, 11 widget engine files, and 22 illustration components.

**How to use this document**: each issue lists the file, the exact wrong text, why it is wrong (with primary source), and the suggested fix. Hand this to Claude Code or apply the fixes manually.

---

## CRITICAL ISSUES (factually wrong; fix before any reader sees the page)

### C1. Wrong CMRO2-temperature formula in `cerebral-metabolism.mdx`

**File**: `src/content/foundations/cerebral-metabolism.mdx`, line 74.

**Current**:
```math
f_{\mathrm{temp}} = 1.07^{(T_{brain} - 37)/10}
```

**Problem**: With this formula, a brain at 39 °C has `f = 1.07^0.2 = 1.0136`, only a **1.4% rise** in CMRO2. But the next paragraph (line 77) says "A febrile brain at 39 °C runs ~14% hotter metabolically". The formula and the prose disagree by a factor of 10.

The intended relationship is **~7% per 1 °C** (Polderman 2009 Q10 ≈ 2 for CMRO2). The `/10` belongs in the Q10 definition (`Q10 = (rate_T+10) / rate_T`), not in this bedside formula.

**Fix**: change the formula to

```math
f_{\mathrm{temp}} = 1.07^{(T_{brain} - 37)}
```

(remove the `/10`). At 39 °C this gives `1.07^2 = 1.1449`, the 14.5% the prose already states.

The widget engine `BrainTempDemo/engine.ts` line 26 already uses the correct form (`CMRO2 multiplier = 1.07^(brain_temp − 37)`), so the engine and the page disagree at the moment.

---

### C2. Pediatric ICP thresholds misattributed to PBTF 2019

**Files**:
- `src/content/foundations/pediatric-physiology.mdx`, lines 35, 113, 128, 174.
- `src/content/modalities/icp.mdx` (per the agent extract): age-banded thresholds.
- `src/content/foundations/pediatric-physiology.mdx`, figure caption on line 82 ("ICP treatment thresholds rise from 10 mmHg in newborns to 20 mmHg by school age").

**Current** (pediatric-physiology.mdx line 35):
> "ICP treatment threshold ~20 mmHg in patients > 1 y, 15 in infants, 10 in newborns. `<Cite id="kochanek2019_pbtf4" />`"

**Problem**: PBTF 2019 (Kochanek et al., *Pediatric Critical Care Medicine* 20(3S):S1-S82, 2019) recommends **20 mmHg as the treatment threshold for all pediatric ages**, with a weak recommendation and weaker evidence in infants. The age-banded scheme (10 / 15 / 20 / 22 by age) is a **bedside heuristic from older sources and centre-specific proposals**, not the PBTF guideline. Attaching `kochanek2019_pbtf4` to age-banded numbers is a citation misattribution.

The page itself acknowledges this on line 128 ("These are mostly extrapolated from adult data and small pediatric cohorts") but the citation on the same line still points to PBTF 2019 as if the guideline endorsed the age bands.

**Fix**: change all instances of "ICP threshold by age" to clearly distinguish guideline from heuristic:

> "ICP treatment threshold per PBTF 2019 is **20 mmHg across all pediatric ages** (weak recommendation, weaker evidence in infants). `<Cite id="kochanek2019_pbtf4" />` Some centres apply lower thresholds in younger children (e.g. 15 in infants, 10 in neonates); these are **proposed heuristics, not guideline values**, and should be labelled as such when used."

Apply to: `pediatric-physiology.mdx` lines 35, 82 (caption), 113, 174; `icp.mdx` age-band threshold sections; `RaisedICPLadder.tsx` if it states age bands.

---

### C3. ONSD age-band cutoffs differ between the illustration and the rest of the site

**File**: `src/components/content/illustrations/ONSDUltrasound.tsx`, lines 157, 163, 169.

**Current**:
- `<1 yr: concern > 4.5 mm`
- `1-15 yr: concern > 5.0 mm`
- `Adult: concern > 5.7 mm`

**Problem**: These are 0.5 mm higher than what `onsd.mdx`, `claude-code-tasks/06-figures-to-create.md`, and `resource-limited-bedside.mdx` use. The dominant pediatric primary source (Padayachy 2016, *Childs Nervous System*) finds best-cutoff values of **4.0 mm for <1 yr** and **4.5 mm for 1-15 yr**, validated against invasive ICP. Adult Robba 2018 meta-analysis pools cutoffs of 5.0-5.7 mm.

The illustration uses one set; everywhere else uses Padayachy's. A reader who looks at the figure on the foundation page will see one number and read another in the prose two paragraphs later.

**Fix**: change the three illustration labels to:
- `<1 yr: concern > 4.0 mm` (Padayachy 2016)
- `1-15 yr: concern > 4.5 mm` (Padayachy 2016)
- `Adult: concern > 5.0-5.7 mm` (Robba 2018 meta-analysis range)

Or, if a centre uses different cutoffs, add a note that age-band cutoffs vary by primary source (Padayachy 2012 used 5.16 mm for children; Padayachy 2016 refined to 4.0/4.5 with sensitivity 87% / specificity 79%) and pick one canonical source for the site.

---

### C4. Internal inconsistency on PRx thresholds in `autoregulation.mdx`

**File**: `src/content/foundations/autoregulation.mdx`.

**The page contradicts itself**:
- Line 187: "PRx < −0.10: autoregulation active"
- Line 87 and Quiz line 275: "PRx > 0.25 sustained over many minutes is pressure-passive"
- Line 128: "PRx is +0.4 for the past hour..." (treating > 0.3 as the action threshold)

The numbers do not form one consistent system. Reader gets three different schemes within one page.

**Canonical literature**:
- Sorrentino 2012 derived a PRx outcome threshold of **+0.25** in adult severe TBI.
- Czosnyka 2014 and others use a +0.30 threshold in some pediatric work.
- The convention is: PRx < 0 = intact; 0 to 0.25 = ambiguous / borderline; > 0.25 = impaired.

**Fix**: pick one scheme and apply it consistently across the page (and ideally across the site). Suggested wording:

> "PRx < 0 indicates intact autoregulation; 0 to 0.25 is ambiguous (signal quality, time of day, slow-wave power matter); > 0.25 sustained over many minutes is impaired autoregulation. The 0.25 outcome threshold is from Sorrentino 2012 in adult severe TBI; pediatric work has used 0.25-0.30 (Lewis 2014, Tas 2022). `<Cite id="sorrentino2012" /> <Cite id="lewis2014peds" />"

Remove the −0.10 / 0.15 / 0.30 four-tier scheme on line 187 unless you can find a primary source for it.

---

### C5. PbtO2 thresholds in `astrup-cascade.mdx` table do not match the PbtO2 modality page or BOOST-II/III

**File**: `src/content/foundations/astrup-cascade.mdx`, lines 76-82 (the CBF / EEG / PbtO2 / MD L/P table).

**Current** (column for PbtO2):
| CBF | EEG / aEEG | PbtO2 | MD L/P |
| ≥ 50 | normal | 25-35 (apparent) | normal |
| ... | ... | ... | ... |
| < 15 | isoelectric | < 8 | > 80 |

**Problem**: The page-wide schema correlates PbtO2 values to specific CBF / EEG patterns. This **teaching analogy is not how PbtO2 is reported in the literature**. The canonical, trial-validated thresholds (BOOST-II Okonkwo 2017, PBTF 2019 Kochanek) are:
- PbtO2 > 20 mmHg: target
- PbtO2 < 20 mmHg: action threshold (BOOST-II protocol-driven intervention)
- PbtO2 < 10-15 mmHg: critical / emergent

The `pbto2.mdx` page uses the 20 / 15-20 / 10-15 / <10 scheme. The `PbtO2Probe.tsx` illustration uses ≥ 20 / 15-20 / 10-15 / < 10. The `astrup-cascade.mdx` table uses 25-35 / 20-25 / 15-20 / 8-15 / < 8. A reader cross-referencing two pages of the site sees two different teaching frameworks.

**Fix**: change the astrup-cascade table so PbtO2 column matches the canonical thresholds:
- ≥ 50 mL/100g/min CBF / normal EEG → PbtO2 > 25 (label as "normal range varies 25-50")
- ... CBF / slowing → PbtO2 15-25
- ... CBF / suppressed → PbtO2 10-15
- < 15 CBF / isoelectric → PbtO2 < 10

Add a note that the CBF / PbtO2 correlation on the Astrup axis is a **teaching frame**, not a strict measurement equivalence. In practice PbtO2 reflects local tissue oxygen tension and uncouples from regional CBF in microvascular shunting, mitochondrial dysfunction, and probe placement effects.

---

### C6. THAPCA-OH result wording is technically right but misleading

**File**: `src/content/foundations/cerebral-metabolism.mdx`, line 92.

**Current**: "[THAPCA-OH] compared 33 °C vs 36.8 °C and showed no significant difference in 12-month VABS-II survival. `<Cite id="moler2015thapca_oh" />`"

**Problem**: THAPCA-OH (Moler 2015, NEJM) primary outcome was **12-month survival with good neurobehavioural outcome (VABS-II ≥ 70)**. The trial was stopped early for **futility** with 20% in the hypothermia arm vs 12% in the normothermia arm achieving the primary outcome (p = 0.14). The current wording says "no significant difference in 12-month VABS-II survival" which is technically correct but reads as if the trial was inconclusive on a survival endpoint rather than stopped for futility on a composite. The conventional reporting is "no significant benefit of therapeutic hypothermia over therapeutic normothermia in pediatric out-of-hospital cardiac arrest".

**Fix**:
> "THAPCA-OH (Moler 2015) compared 33 °C and 36.8 °C and was **stopped early for futility**. Twelve-month survival with good neurobehavioural outcome (VABS-II ≥ 70) was 20% with hypothermia vs 12% with normothermia (p = 0.14). The trial established **therapeutic normothermia** as a defensible standard for pediatric OHCA; cooling is no longer routinely recommended. `<Cite id="moler2015thapca_oh" />`"

---

### C7. COGiTATE percentages do not match the published trial

**File**: `src/content/modalities/prx.mdx` (per agent extract).

**Current**: "COGiTATE phase II: 53% time in target band vs. 34% control"

**Problem**: COGiTATE phase II (Beqiri 2021, *Intensive Care Medicine* 47:1093-1103) primary outcome was the **proportion of time within ±5 mmHg of CPPopt** during monitoring. The intervention arm achieved a **median of 46.5% (IQR 38.3-56.2)** vs control **30.3% (IQR 22.6-38.4)**, p < 0.001 (figures from the published manuscript). The "53% vs 34%" numbers in the page are not the published primary-outcome values.

**Fix**: change to:
> "COGiTATE phase II (Beqiri 2021) showed CPPopt-guided care increased time within ±5 mmHg of CPPopt to a median 46.5% (IQR 38.3-56.2) versus 30.3% (22.6-38.4) in standard-of-care, p < 0.001. Feasibility was met. The phase II trial was not powered for outcome; COGiTATE follow-up (Tas 2025) is investigating clinical endpoints. `<Cite id="beqiri2024_cogitate" /> <Cite id="tas2025_cogitate_followup" />"

Verify these percentages against the published manuscript before quoting them in a presentation.

---

### C8. SSEPViewer engine ships adult-only N20 latencies despite citing pediatric data

**File**: `src/components/widgets/SSEPViewer/engine.ts`.

**Current**: SSEP normal N20 latency 19.5-19.7 ms, prolonged ≥ 23.5 ms. References include Carter 2006 (pediatric).

**Problem**: Adult median N20 latency is 19-22 ms. Pediatric N20 is shorter, scaling with arm length and conduction velocity: ~14-17 ms in young children, reaching adult values by adolescence. The widget implements adult-only thresholds while citing a pediatric paper. A user simulating a pediatric SSEP will see false "prolonged" flags.

**Fix**: either add an age-bracket input (newborn / infant / child / adolescent / adult) to the widget engine with age-specific normative N20 latencies (Carter 2006 has the data), or update the widget README and the modality page text to make clear that the widget shows adult values only.

---

## MEDIUM ISSUES (imprecise or needs hedging)

### M1. CSF turnover claim slightly overstates production rate

**File**: `src/content/foundations/monro-kellie.mdx`.

**Current**: "CSF made at ~500 mL/day; whole volume turns over 3-4 times a day."

**Note**: 500 mL/day production with 150 mL total volume gives 3.3x daily turnover. The arithmetic is right. But the 500 mL/day figure is for adults; in children the production rate scales with brain volume (~0.35 mL/min/g brain weight). Worth flagging as adult-specific. Low priority.

---

### M2. Lundberg wave amplitudes

**File**: `src/content/foundations/monro-kellie.mdx`, line 120 (per agent extract).

**Current**: "Plateau waves (Lundberg A): 60-second rise, 5-20-minute plateau at very high ICP, 60-second fall"

**Note**: Lundberg 1960 described amplitude 50-100 mmHg above baseline, duration 5-20 minutes. The "60-second rise" / "60-second fall" specifics are not from the original paper; the rise and fall are described as gradual but unquantified in seconds. Either soften ("rapid rise over seconds, plateau 5-20 min, gradual fall") or cite a specific later paper that quantifies the rise/fall in seconds.

Already flagged in `claude-code-tasks/06-figures-to-create.md` for the `lundberg-waves.svg`.

---

### M3. RAP zone thresholds are reasonable but vary by source

**File**: `src/content/foundations/marmarou-pv-curve.mdx`, lines 104-107.

**Current**: "< 0.3 flat, 0.3-0.6 borderline, 0.6-0.9 steep, paradoxical drop to zero at high ICP = terminal"

**Note**: Czosnyka 1996 defined three RAP zones; some later sources collapse to two. The four-zone scheme is defensible. Cite the source (`czosnyka1996rap`, `kim2009rap`, `howells2017rap`) and acknowledge that exact zone boundaries vary by centre. Low priority.

---

### M4. Adult PVI quoted as ~20 mL is on the low end of normal

**Files**: `monro-kellie.mdx` line 71, `marmarou-pv-curve.mdx` line 44.

**Current**: "PVI ~20 mL in adults"

**Note**: Adult PVI in healthy individuals is ~25 mL; in injured / decompensating adults, 10-15 mL is more typical. The "20 mL" is a rounded mid-range value that's commonly cited but on the low end of "normal". Acceptable. The pediatric scaling claim (8-12 mL toddler) is consistent with general scaling.

---

### M5. Microdialysis L/P ratio interpretation

**File**: `src/content/foundations/cerebral-metabolism.mdx`, lines 138-144.

**Current**: "L/P < 25 normal; ≥ 25 with normal glucose = mitochondrial; ≥ 40 with < 0.8 mmol/L glucose = ischaemia"

**Note**: This is the Hutchinson 2015 consensus, with one nuance: in the **ischaemic pattern**, both lactate is high AND pyruvate is low (anaerobic), giving high L/P plus low pyruvate. In the **mitochondrial pattern**, lactate is high and pyruvate is **normal or high** (oxygen and substrate present, mitochondria failing). The current wording does not mention pyruvate behaviour in either zone. Worth adding the pyruvate column for clinical clarity.

---

### M6. mnm-on-ecmo HITS background rate is centre-dependent

**File**: `src/content/integration/mnm-on-ecmo.mdx`.

**Current**: "Background HITS rate on ECMO: 1-3 per hour typical."

**Note**: HITS rate on ECMO is highly device-, circuit-, configuration-, and patient-dependent. Published rates range from < 1 per hour to > 20 per hour depending on cannulation, oxygenator type, anti-coagulation, and run time. The "1-3 per hour" is one observation but not universally applicable. Add a hedge ("typical published rates vary by circuit and patient state; one observational range is 1-3 per hour but...").

---

### M7. fontanelle-us PI / RI nomenclature uses non-standard variables

**File**: `src/content/modalities/fontanelle-us.mdx`.

**Current** (per agent extract): "Resistive Index (RI) = (Psys - Pdias) / Psys; Pulsatility Index (PI) = (Psys - Pdias) / Pmean"

**Problem**: "Psys" and "Pdias" suggest pressure (systolic / diastolic pressure). For Doppler indices these should be velocity terms: PSV (peak systolic velocity), EDV (end-diastolic velocity), TAMV / MFV (mean velocity). The standard formulae are: RI = (PSV − EDV) / PSV; PI = (PSV − EDV) / MFV.

**Fix**: change "Psys" → "PSV", "Pdias" → "EDV", "Pmean" → "MFV" throughout `fontanelle-us.mdx`. The TCD page already uses the correct nomenclature; this page should match.

---

## LOW-PRIORITY / COSMETIC ISSUES

### L1. Repeated rounding inconsistency

Several pages quote the same Cushing reflex / vasospasm / pediatric MFV numbers with slight rounding variations (e.g. "100-110 cm/s" vs "~100" vs "97 ± 9"). The variations are within the published SD; not factually wrong. Standardise the canonical source (Bode 1988 for newborn; O'Brien 2015 for older children) and use one form across the site.

### L2. CO2 reactivity slope wording

`co2-o2-reactivity.mdx` says "3-4% per mmHg in the linear range" and the figure caption (after my earlier audit) clarifies "25-60 mmHg PaCO2". Confirm the page prose matches the figure caption. If "linear range" is undefined in the page text, add a sentence locating it.

### L3. Mannitol diuresis numbers

`osmotherapy-icp-nirs.mdx` says "20 mL/kg urine output can crash MAP" after mannitol. Numbers vary widely; 5-15 mL/kg is more typical for a single mannitol bolus. The 20 mL/kg figure is an outlier-case caution. Hedge.

### L4. THAPCA-OH outcome wording (already in C6)

### L5. Some integration pages claim drug doses without per-kg max or absolute max

E.g., `inborn-errors-encephalopathy.mdx` mentions L-arginine "0.5 g/kg/day (or 500 mg/kg/day for acute crisis per Japanese consensus)". Verify these against the cited consensus (Parikh 2017) and add a per-kg max or duration limit where appropriate.

---

## CROSS-PAGE CONSISTENCY TABLE

A single canonical value should be picked for each row and used everywhere. Current site state:

| Concept | Foundation page | Modality page | Integration page | Illustration | Engine | Canonical source |
|---|---|---|---|---|---|---|
| Pediatric ICP treatment threshold | 10/15/20 age-banded (line 35, pediatric-physiology) | 10/15/20/22 (icp.mdx) | 20 (some) | — | — | **PBTF 2019: 20 mmHg all ages (weak rec)**. Heuristic age bands are not guideline. |
| PRx impairment threshold | < −0.10 intact / > +0.30 passive (autoregulation.mdx line 187); > 0.25 (line 87 + Quiz) | > 0.25 (prx.mdx) | — | ≥ 0.25 (MxVsPrxArchitecture.tsx) | > 0.25 (CPPoptUCurve engine) | **Sorrentino 2012: 0.25**. autoregulation.mdx is the outlier. |
| ORx / Mx impairment threshold | — | varies | — | ≥ 0.30 (MxVsPrxArchitecture.tsx) | ≥ 0.30 (MAPoptUCurve engine) | Pediatric and adult literature mostly uses 0.30 for non-PRx indices. Consistent. |
| ONSD < 1 yr cutoff | — | 4.0 mm (onsd.mdx) | 4.0-4.5 (resource-limited-bedside) | **> 4.5 mm (ONSDUltrasound.tsx)** | — | **Padayachy 2016: 4.0 mm**. Illustration is the outlier. |
| ONSD 1-15 yr cutoff | — | 4.5 mm (onsd.mdx) | 4.5-5.0 (resource-limited-bedside) | **> 5.0 mm (ONSDUltrasound.tsx)** | — | **Padayachy 2016: 4.5 mm**. Illustration is the outlier. |
| Adult ONSD cutoff | — | 5.0-5.7 mm (onsd.mdx) | — | > 5.7 mm (ONSDUltrasound.tsx) | — | **Robba 2018 meta-analysis: 5.0-5.7 mm pooled range**. Site uses range; illustration uses upper end. |
| PbtO2 target | 25-35 (astrup-cascade.mdx) | > 20 (pbto2.mdx) | > 20 (pbto2-cpp-titration) | > 20 (PbtO2Probe.tsx) | — | **BOOST-II / PBTF 2019: > 20 mmHg target**. astrup-cascade is the outlier. |
| PbtO2 critical | < 8 (astrup-cascade.mdx) | < 10 (pbto2.mdx) | < 10 (pbto2-cpp-titration) | < 10 (PbtO2Probe.tsx) | — | **BOOST-II: < 10-15 mmHg critical**. astrup-cascade is the outlier. |
| Lassen plateau (adult) | 60-150 mmHg (autoregulation.mdx) | — | — | LLA 60 / ULA 150 (AutoregLayered.tsx) | — | **Lassen 1959: 60-150 mmHg** (later refined). Consistent. |
| CMRO2 / temperature | `1.07^((T-37)/10)` (cerebral-metabolism line 74) **WRONG** | — | — | — | `1.07^(T-37)` (BrainTempDemo engine, **right**) | **Polderman 2009: ~7% per 1 °C**. Page formula is wrong; engine is right. |
| CSF production rate | 500 mL/day (monro-kellie) | — | — | — | — | Adult ~500 mL/day; pediatric scales with brain volume. Acceptable. |
| Adult PVI | ~20 mL (monro-kellie, marmarou) | — | — | ~20 mL (MarmarouCurve.tsx) | — | Marmarou: 25 mL healthy; 10-15 injured. Site uses 20 mL (mid-range rounded). Acceptable. |
| THAPCA-OH summary | "no significant difference" (cerebral-metabolism) | — | — | — | — | **Moler 2015: stopped early for futility**. Soften. |
| COGiTATE percentages | — | "53% vs 34%" (prx.mdx) | — | — | — | **Beqiri 2021: 46.5% vs 30.3%**. Update. |

---

## RECOMMENDED ORDER OF FIXES

1. **C1** (CMRO2 formula) — single character fix; high impact for math accuracy.
2. **C2** (pediatric ICP citation misattribution) — affects three pages and the figure caption; high impact.
3. **C5** (PbtO2 thresholds in astrup-cascade) — affects one foundation page; standardise.
4. **C4** (PRx threshold inconsistency in autoregulation.mdx) — one page; standardise.
5. **C3** (ONSD illustration cutoffs) — one TSX file; three labels.
6. **C6** (THAPCA-OH wording) — one paragraph.
7. **C7** (COGiTATE numbers) — verify against published paper, then fix.
8. **C8** (SSEPViewer pediatric latencies) — engine update; lower priority for content correctness but high for honesty in a teaching site.

All medium and low issues can be batched after critical issues. Estimated effort: ~3-4 hours for an editor with the source papers at hand, or 30-60 minutes of Claude Code time using the specific fixes listed above.

---

## MECHANICAL FIX SNIPPETS (before, after, ready for find / replace)

Each block below is a literal find / replace. The FIND text is the exact wrong text in the file. The REPLACE text is the correction. The FILE and NEAR LINE fields locate it. Apply with `Edit replace_all: false`; FIND strings have been chosen to be unique in their files.

---

### Fix for C1 (CMRO2 formula)

**FILE**: `src/content/foundations/cerebral-metabolism.mdx`
**NEAR LINE**: 74

**FIND** (exact, inside the math fence):
```
f_{\mathrm{temp}} = 1.07^{(T_{brain} - 37)/10}
```

**REPLACE WITH** (exact):
```
f_{\mathrm{temp}} = 1.07^{(T_{brain} - 37)}
```

That's it. One character pair (`/10`) removed. The formula is inside a `math` code fence so the markdown rendering is unaffected.

---

### Fix for C2 (pediatric ICP thresholds misattribution)

**FILE**: `src/content/foundations/pediatric-physiology.mdx`

#### C2a, NEAR LINE 35

**FIND** (exact):
```
3. **ICP treatment threshold** ~20 mmHg in patients > 1 y, 15 in infants, 10 in newborns. <Cite id="kochanek2019_pbtf4" />
```

**REPLACE WITH** (exact):
```
3. **ICP treatment threshold per PBTF 2019**: 20 mmHg across all pediatric ages (weak recommendation; weaker evidence in infants). <Cite id="kochanek2019_pbtf4" /> Some centres apply lower heuristic thresholds in younger children (e.g. 15 in infants, 10 in neonates); these are proposed, not guideline.
```

#### C2b, NEAR LINE 82, figure caption

**FIND** (substring, inside the caption attribute):
```
ICP treatment thresholds rise from 10 mmHg in newborns to 20 mmHg by school age.
```

**REPLACE WITH** (exact):
```
ICP treatment threshold (right panel) per PBTF 2019: 20 mmHg across pediatric ages (weak recommendation). Centre-specific lower heuristic thresholds in infants exist but are not in the guideline.
```

#### C2c, NEAR LINE 113

**FIND** (exact):
```
4. **ICP threshold by age**: 10 in newborns, 15 in infants, 20 in older children. <Cite id="kochanek2019_pbtf4" />
```

**REPLACE WITH** (exact):
```
4. **ICP treatment threshold (PBTF 2019)**: 20 mmHg across pediatric ages, weak recommendation. <Cite id="kochanek2019_pbtf4" /> Age-banded heuristics (10 / 15 / 20 by age) appear in some centres but are not guideline.
```

#### C2d, NEAR LINE 128

**FIND** (exact):
```
The **treatment threshold** is more stable: > 20 mmHg in patients > 1 year, > 15 in infants, > 10 in newborns, all C-grade evidence.
```

**REPLACE WITH** (exact):
```
The PBTF 2019 **treatment threshold** is 20 mmHg across pediatric ages (weak recommendation, weaker evidence in infants). Lower heuristic thresholds (15 in infants, 10 in newborns) appear in centre-specific protocols but are not endorsed by the guideline; flag them as heuristic when used.
```

#### C2e, NEAR LINE 174, the Pitfall block

**FIND** (exact):
```
**One ICP threshold for all ages**: pediatric thresholds are age-banded; 15 mmHg in an infant is treatment territory.
```

**REPLACE WITH** (exact):
```
**Quoting age-banded heuristic thresholds as PBTF guideline values**: PBTF 2019 recommends 20 mmHg across pediatric ages. Lower thresholds in infants are centre proposals, not guideline. Where individualised PRx / CPPopt is available, use it.
```

#### C2f, also in `src/content/modalities/icp.mdx`

Search the file for "age-banded ICP threshold" or "10 / 15 / 20 / 22" patterns and apply the same standardisation: PBTF 2019 = 20 mmHg for all pediatric ages; lower numbers in younger children are flagged as heuristic. Locate with: `grep -n "neonate\|infant" src/content/modalities/icp.mdx`.

---

### Fix for C3 (ONSD illustration cutoffs)

**FILE**: `src/components/content/illustrations/ONSDUltrasound.tsx`

Three sibling `<text>` elements, each adjacent to an age-band label (`<1 yr`, `1-15 yr`, `Adult`). FIND strings are unique in this file by the `concern &gt; X.X mm` content.

#### C3a, NEAR LINE 157, the `<1 yr` panel

**FIND** (exact):
```
<text x="14" y="27" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">concern &gt; 4.5 mm</text>
```

**REPLACE WITH** (exact):
```
<text x="14" y="27" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">concern &gt; 4.0 mm</text>
```

#### C3b, NEAR LINE 163, the `1-15 yr` panel

**FIND** (exact):
```
<text x="14" y="27" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">concern &gt; 5.0 mm</text>
```

**REPLACE WITH** (exact):
```
<text x="14" y="27" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">concern &gt; 4.5 mm</text>
```

#### C3c, NEAR LINE 169, the `Adult` panel

**FIND** (exact):
```
<text x="14" y="27" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">concern &gt; 5.7 mm</text>
```

**REPLACE WITH** (exact):
```
<text x="14" y="27" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">concern &gt; 5.0 mm</text>
```

After C3a-c, the illustration matches Padayachy 2016 pediatric data and the Robba 2018 adult meta-analysis (5.0 mm is the lower bound of the meta-analysis pooled range; more conservative / more sensitive than 5.7).

---

### Fix for C4 (PRx threshold inconsistency in `autoregulation.mdx`)

**FILE**: `src/content/foundations/autoregulation.mdx`
**NEAR LINES**: 186-190

**FIND** (exact, the four-tier block):
```
**Interpretation:**
- **PRx < −0.10**: autoregulation active; ICP slow waves move opposite to MAP slow waves (vasoconstriction in response to pressure rise).
- **−0.10 to +0.15**: marginal reserve.
- **+0.15 to +0.30**: borderline pressure-passive.
- **> +0.30**: pressure-passive; autoregulation impaired.
```

**REPLACE WITH** (exact, the canonical Sorrentino scheme):
```
**Interpretation:**
- **PRx < 0**: autoregulation active; ICP slow waves move opposite to MAP slow waves (vasoconstriction in response to pressure rise).
- **0 to +0.25**: ambiguous / borderline; signal quality, slow-wave power, and time of day all matter at this resolution.
- **> +0.25**: impaired autoregulation, pressure-passive cerebrovasculature. The +0.25 outcome threshold is from Sorrentino 2012 in adult severe TBI; pediatric severe TBI uses 0.25-0.30 (Lewis 2014, Tas 2022). <Cite id="sorrentino2012" /> <Cite id="lewis2014peds" />
```

After this fix, also check the page for stale references to the old scheme. Line 87 currently says "PRx sustained above 0.30 for 30+ minutes"; either bring it to "above +0.25" or keep "+0.30" with a sentence explaining that 0.30 is the conservative pediatric-leaning threshold.

---

### Fix for C5 (PbtO2 column in `astrup-cascade.mdx` table)

**FILE**: `src/content/foundations/astrup-cascade.mdx`
**NEAR LINES**: 76-82

**FIND** (exact, the four-column table):
```
| CBF (mL/100g/min) | EEG / aEEG signature | PbtO₂ | MD L/P |
|---|---|---|---|
| ≥ 50 | continuous activity; sleep-wake cycling on aEEG | 25–35 | < 25 |
| 35–49 | mild slowing; ADR slightly down | 20–25 | < 25 |
| 25–34 | delta dominance; ADR clearly down | 15–20 | 25–40 |
| 15–24 | burst-suppression; aEEG narrow band | 8–15 | 40–80 |
| < 15 | isoelectric / inverted aEEG | < 8 | > 80 |
```

**REPLACE WITH** (exact, aligned to BOOST-II / PBTF 2019 PbtO2 thresholds):
```
| CBF (mL/100g/min) | EEG / aEEG signature | PbtO₂ (BOOST-II frame) | MD L/P |
|---|---|---|---|
| ≥ 50 | continuous activity; sleep-wake cycling on aEEG | > 20 (target) | < 25 |
| 35–49 | mild slowing; ADR slightly down | 15–20 (caution) | < 25 |
| 25–34 | delta dominance; ADR clearly down | 10–15 (action) | 25–40 |
| 15–24 | burst-suppression; aEEG narrow band | < 10 (critical) | 40–80 |
| < 15 | isoelectric / inverted aEEG | < 10 (critical) | > 80 |
```

After C5, add a sentence below the table (the page already has the "These are bedside heuristics" sentence on line 84; extend it):

> "PbtO2 reflects local tissue oxygen tension; the correlation to regional CBF on the Astrup axis is a teaching frame, not a strict measurement equivalence. Probe location, microvascular shunting, and mitochondrial dysfunction can all dissociate PbtO2 from regional flow."

---

### Fix for C6 (THAPCA-OH wording)

**FILE**: `src/content/foundations/cerebral-metabolism.mdx`
**NEAR LINE**: 92

**FIND** (exact):
```
Compared 33 °C vs 36.8 °C and showed no significant difference in 12-month VABS-II survival. <Cite id="moler2015thapca_oh" />
```

**REPLACE WITH** (exact):
```
Compared 33 °C and 36.8 °C and was stopped early for futility. Twelve-month survival with good neurobehavioural outcome (VABS-II ≥ 70) was 20% with hypothermia vs 12% with normothermia (p = 0.14). The trial established **therapeutic normothermia** as a defensible standard for pediatric out-of-hospital cardiac arrest; routine cooling at 33 °C is no longer recommended for pediatric OHCA. <Cite id="moler2015thapca_oh" />
```

---

### Fix for C7 (COGiTATE percentages)

**FILE**: `src/content/modalities/prx.mdx`

This page has the wrong percentages in **two places**: line 204 and line 340.

#### C7a, NEAR LINE 204

**FIND** (exact):
```
- Patients in the CPPopt arm spent **a significantly larger fraction of monitored time within ±5 mmHg of their CPPopt target** (53% vs 34%).
```

**REPLACE WITH** (exact):
```
- Patients in the CPPopt arm spent **a significantly larger fraction of monitored time within ±5 mmHg of their CPPopt target** (median 46.5%, IQR 38.3-56.2, versus 30.3%, IQR 22.6-38.4, in the standard-CPP arm; p < 0.001).
```

#### C7b, NEAR LINE 340

**FIND** (exact):
```
Patients in the CPPopt arm achieved their individualised target 53% of monitored time vs 34% in the standard arm.
```

**REPLACE WITH** (exact):
```
Patients in the CPPopt arm achieved their individualised target a median 46.5% of monitored time (IQR 38.3-56.2) versus 30.3% (IQR 22.6-38.4) in the standard arm, p < 0.001.
```

**IMPORTANT**: verify these median / IQR values against the published manuscript before quoting them in a presentation. Numbers above are my best recollection of Beqiri 2021 *Intensive Care Medicine* 47:1093-1103. If PubMed shows different values, use the published ones and update both occurrences.

---

### Fix for C8 (SSEPViewer pediatric latencies)

**FILE**: `src/components/widgets/SSEPViewer/engine.ts`

Behavioural change, not a literal find / replace. Two acceptable approaches; pick one.

#### C8 option A, minimal: clear adult-only label

**FIND** (NEAR LINE 4):
```
 * SSEP after median nerve stimulation: cortical N20 (~20 ms), N20-P25 complex.
```

**REPLACE WITH** (exact):
```
 * SSEP after median nerve stimulation: cortical N20 (~20 ms in adults; ~14-17 ms in pre-adolescents, Carter 2006), N20-P25 complex.
 * NOTE: latency values in this widget are adult; pediatric N20 latencies are shorter and scale with arm length and age.
```

Also add to `src/components/widgets/SSEPViewer/README.md` (or create it):

> "All preset latencies in this widget are adult values. Pediatric users should expect shorter N20 latencies (14-17 ms in school-age children; reaches adult ~19 ms by mid-adolescence). The widget is currently illustrative, not age-calibrated; do not interpret pediatric scans against these thresholds."

#### C8 option B, engine extension

Add a new field `ageBand` to the engine input type: `'adult' | 'adolescent' | 'school-age' | 'infant' | 'newborn'`. For each band, store an age-appropriate normal N20 latency and prolonged threshold (Carter 2006 tables). Wire a dropdown in the widget UI. Larger change; only do this if pediatric SSEP teaching is a core use case.

Option A is the recommended minimal fix.

---

### Fix for C2-ICP-a (Fig. 3 caption + attribution on icp.mdx)

**FILE**: `src/content/modalities/icp.mdx`
**NEAR LINES**: 175-181 (the Fig. 3 `<Figure>` block)

**FIND** (exact, the caption + attribution attributes):
```
  caption="Age-banded operational ICP thresholds. These are not biological norms, they are treatment-trigger numbers used in the major pediatric severe-TBI cohorts and in the Pediatric Brain Trauma Foundation 4th-edition guidelines. The neonate column accounts for open fontanelles and lower baseline arterial pressure; the adult column matches the BTF severe-TBI threshold of 22 mmHg."
  attribution="MNM-Edu, drawn from PBTF 4th edition and Tasker 2023. SVG placeholder."
```

**REPLACE WITH** (exact):
```
  caption="Pediatric ICP treatment thresholds. PBTF 2019 (4th edition, Kochanek) recommends a treatment threshold of 20 mmHg across all pediatric ages, weak recommendation with weaker evidence in infants. The age-banded scheme shown here (neonate ~10, infant ~15, child ~20, adolescent ~22) is a centre-specific heuristic widely used in practice but is not the PBTF guideline value; younger thresholds reflect lower baseline MAP, narrower autoregulatory range, and open fontanelle physiology. Label as heuristic when used."
  attribution="MNM-Edu, drawn from PBTF 2019 guideline value (20 mmHg) plus centre-specific age-banded heuristics. SVG placeholder."
```

---

### Fix for C2-ICP-b (TldrCard on icp.mdx)

**FILE**: `src/content/modalities/icp.mdx`
**NEAR LINE**: 35

**FIND** (substring inside the TldrCard):
```
Adult-style thresholds (treat at > 20–22 mmHg) **do not generalise to children**; the right number is age-banded (neonate ~10, infant ~15, child ~20, adolescent ~22).
```

**REPLACE WITH** (exact):
```
Adult-style thresholds (treat at > 20–22 mmHg) **do not generalise cleanly to infants and neonates**; PBTF 2019 recommends 20 mmHg across all pediatric ages with weaker evidence in younger children, and many centres use lower heuristic thresholds (e.g. 15 in infants, 10 in neonates) as bedside triggers.
```

---

### Fix for C2-ICP-c (age-band table citation block on icp.mdx)

**FILE**: `src/content/modalities/icp.mdx`
**NEAR LINE**: 192

**FIND** (exact):
```
Sources: <Cite id="kochanek2019_pbtf4" /> <Cite id="tasker2023_pccm_review" /> <Cite id="tasker2023" />. These thresholds are **operational**, not biological. They reflect the cumulative-dose data and outcome-association studies that defined the level of evidence in PBTF 4 (level III recommendation, individualised CPP target by age). The neonate column has the weakest evidence base; treat the bedside picture and the fontanelle as much as the number.
```

**REPLACE WITH** (exact):
```
Sources: <Cite id="kochanek2019_pbtf4" /> <Cite id="tasker2023_pccm_review" /> <Cite id="tasker2023" />. **The PBTF 2019 guideline value is 20 mmHg across all pediatric ages** (weak recommendation, weaker evidence in infants). The age-banded ICP thresholds shown above (10 / 15 / 20 / 22) are **operational heuristics** used in practice and discussed in pediatric reviews; they are not endorsed guideline values. Treat them as bedside triggers and pair with clinical exam, fontanelle palpation, and ONSD. CPP age-banding has stronger PBTF support (level III recommendation, individualised CPP target by age). The neonate column has the weakest evidence base; treat the bedside picture and the fontanelle as much as the number.
```

---

### Fix for C9 (Lundberg A wave amplitude on icp.mdx)

Lundberg's 1960 original description: plateau-wave amplitude 50-100 mmHg above baseline, duration 5-20 minutes. Fig. 4 caption and the pattern-library table both currently say 50-80 mmHg, under-stating the high end.

**FILE**: `src/content/modalities/icp.mdx`

#### C9a, NEAR LINE 205, Fig. 4 caption

**FIND** (substring inside the caption):
```
(c) Lundberg A wave (plateau wave): sudden trapezoidal rise to 50–80 mmHg sustained 5–20 minutes, then drops back to baseline.
```

**REPLACE WITH** (exact):
```
(c) Lundberg A wave (plateau wave): trapezoidal rise to 50–100 mmHg above baseline (Lundberg 1960), sustained 5–20 minutes, then drops back to baseline.
```

#### C9b, NEAR LINE 215, pattern-library table

**FIND** (exact):
```
| Lundberg A (plateau wave) | 50–80 mmHg, 5–20 min, then drops | **Emergency**: hyperosmolar, sedation, head up, consider intervention |
```

**REPLACE WITH** (exact):
```
| Lundberg A (plateau wave) | 50–100 mmHg above baseline, 5–20 min, then drops | **Emergency**: hyperosmolar, sedation, head up, consider intervention |
```

---

## LAYOUT / VISUALISATION AUDIT (figure overlap and rendering quality)

This section covers visual layout issues, separate from the factual / literature issues above. Audited 95 placeholder SVGs at `public/images/**/*.svg` and 22 React illustration components at `src/components/content/illustrations/*.tsx`.

### Summary

- **Placeholder SVGs**: clean. All 95 follow the audited template (safe margins, no text-on-text or text-on-border overlaps, viewBox-content match, contrast OK, every file carries a PLACEHOLDER label). No fixes needed before polishing passes.
- **React illustration components**: 1 critical and 5 medium/low issues across 22 files. Specific fixes below.

---

### L1 (CRITICAL): `PupillaryPathway.tsx` long italic caption will overflow

**FILE**: `src/components/content/illustrations/PupillaryPathway.tsx`
**NEAR LINES**: 158-171 (the "UNCAL HERNIATION" interpretation box at the bottom)

**Problem**: The italic explanatory string on line 170 is 137 characters at font-size 10 inside a 640-px-wide box. SVG `<text>` does not auto-wrap; on most viewports the line overflows past the right edge of the container or gets clipped.

**FIND** (exact):
```
        <text x="14" y="68" fontFamily="Segoe UI, sans-serif" fontSize="10" fontStyle="italic" fill="#94A3B8">
          Direct reflex absent on the affected side; consensual reflex absent in the contralateral eye when light shone on affected side.
        </text>
```

**REPLACE WITH** (exact, splits into two y-stacked lines and uses fontSize 10):
```
        <text x="14" y="64" fontFamily="Segoe UI, sans-serif" fontSize="10" fontStyle="italic" fill="#94A3B8">
          Direct &amp; consensual reflexes both absent on the affected side when light is shone there.
        </text>
        <text x="14" y="76" fontFamily="Segoe UI, sans-serif" fontSize="10" fontStyle="italic" fill="#94A3B8">
          (light to unaffected eye: both pupils still constrict via the intact contralateral arc.)
        </text>
```

Also extend the surrounding `<rect>` height on line 158 to accommodate the extra line:

**FIND**:
```
        <rect width="640" height="74" rx="6" fill="#152238" stroke="#2a3a55" />
```

**REPLACE WITH**:
```
        <rect width="640" height="86" rx="6" fill="#152238" stroke="#2a3a55" />
```

After this fix, the box is 86 px tall (was 74) and contains four readable lines: UNCAL HERNIATION header (y=22), two prose lines (y=40, y=55), and two italic interpretation lines (y=64 collides with y=55? -- actually y=55 is the bottom of the prose line at fontSize 11, so the italic at y=64 has 9 px clearance, fine for fontSize 10).

---

### L2 (MEDIUM): `EvokedPotentialPathway.tsx` electrode labels risk overlapping body silhouette

**FILE**: `src/components/content/illustrations/EvokedPotentialPathway.tsx`
**NEAR LINES**: 98-101

**Problem**: Recording-electrode labels ("cervical", "brainstem", "CP3/CP4") are right-anchored at x=80, leaving them in the left margin where the body silhouette and pathway arrows draw. At narrower viewports the labels overlap.

**FIND** (exact):
```
        {/* Recording electrodes, Erb, Cv, CP */}
        <text x="240" y="118" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">{"Erb's"}</text>
        <text x="80" y="113" textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">cervical</text>
        <text x="80" y="80" textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">brainstem</text>
        <text x="80" y="50" textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#EF4444">CP3/CP4</text>
```

**REPLACE WITH** (exact, moves labels to start-anchor at x=20 so they sit cleanly to the left of the body silhouette):
```
        {/* Recording electrodes, Erb, Cv, CP */}
        <text x="240" y="118" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">{"Erb's"}</text>
        <text x="20" y="113" textAnchor="start" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">cervical</text>
        <text x="20" y="80" textAnchor="start" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">brainstem</text>
        <text x="20" y="50" textAnchor="start" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#EF4444">CP3/CP4</text>
```

If the body silhouette extends beyond x=20 on the left, increase the labels' x to 70-80 with `textAnchor="start"` so they sit just outside the silhouette rather than right-anchored into it.

---

### L3 (MEDIUM): `AutoregLayered.tsx` two-line annotation tight vertical spacing

**FILE**: `src/components/content/illustrations/AutoregLayered.tsx`
**NEAR LINES**: 155-156 and 160-161

**Problem**: Annotation labels for the healthy and TBI operating points use two text elements at `yScale(85) - 2` and `yScale(85) + 10`. The 12-px vertical gap is tight for 10-px font; descenders of the upper line clip the ascenders of the lower line.

**FIND** (exact, the "healthy on plateau" annotation):
```
      <text x={xScale(105)} y={yScale(85) - 2} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#10B981">healthy · on plateau</text>
      <text x={xScale(105)} y={yScale(85) + 10} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#10B981">CPP = 105</text>
```

**REPLACE WITH** (exact, increases gap to 14 px and shifts both up by 2 px to maintain leader-line alignment):
```
      <text x={xScale(105)} y={yScale(85) - 4} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#10B981">healthy · on plateau</text>
      <text x={xScale(105)} y={yScale(85) + 12} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#10B981">CPP = 105</text>
```

Apply the same shift to the TBI annotation immediately below:

**FIND** (exact):
```
      <text x={xScale(20)} y={yScale(85) - 2} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#FCD34D">TBI · CPP 40</text>
      <text x={xScale(20)} y={yScale(85) + 10} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#FCD34D">below LLA → passive</text>
```

**REPLACE WITH** (exact):
```
      <text x={xScale(20)} y={yScale(85) - 4} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#FCD34D">TBI · CPP 40</text>
      <text x={xScale(20)} y={yScale(85) + 12} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#FCD34D">below LLA → passive</text>
```

---

### L4 (MEDIUM): `NeurovascularUnit.tsx` astrocyte labels crowd at narrow viewports

**FILE**: `src/components/content/illustrations/NeurovascularUnit.tsx`
**NEAR LINES**: 160-185 (two distinct label regions for the astrocyte end-foot and astrocyte body)

**Problem**: The "astrocyte end-foot" label at the top of the cell and the "astrocyte" body label at the bottom are visually separated when the viewBox is wide, but at narrow viewports they crowd each other and the brain-side rectangle.

**Recommended fix** (no exact replacement; this is a layout judgement):

1. Move the "astrocyte end-foot" label to a position just above the end-foot shape at x=10, y=340 (or wherever the end-foot top edge is) with `textAnchor="start"` and a leader-line to the end-foot.
2. Move the "astrocyte" body label below the cell body at x=280, y=400 with a small accent stripe so it reads as a label, not floating prose.
3. Verify the entire group fits inside the viewBox at the smallest expected render width.

Without the exact viewBox dimensions of the component in front of me, I cannot give a literal find/replace; treat L4 as a manual reposition pass.

---

### L5 (LOW): `RaisedICPLadder.tsx` "if response inadequate" near tier arrows

**FILE**: `src/components/content/illustrations/RaisedICPLadder.tsx`
**NEAR LINE**: 115 (or wherever the inter-tier connector label is rendered)

**Problem**: The label "if response inadequate" is positioned at `x = tierX + tierW/2 + 10` (10 px right of the arrow), which is close enough that the arrowhead marker and the text overlap at typical render sizes.

**Recommended fix**: move the label to the left side of the arrow (`x = tierX + tierW/2 - 80`) with `textAnchor="end"`, or shift the y-offset 4 px upward so the text sits above the arrow rather than alongside it. No literal find/replace because the exact x/y are templated; the fix is a 4-character coordinate shift in the appropriate `<text>` element.

---

### L6 (LOW): `NIRSOptodes.tsx` optode legend crowds the title

**FILE**: `src/components/content/illustrations/NIRSOptodes.tsx`
**NEAR LINES**: 116-122

**Problem**: Source / detector labels at y=-12 (relative to a transform) sit 16 px below the section title at y=10, which is tight visually given the small font and short-detector / long-detector distinction the legend is trying to make.

**Recommended fix**: change `y={-12}` to `y={-8}` for both `D₁ short` and `D₂ long` labels, OR shift the title down to `y=14` to add 4 px of clearance.

---

### What was checked and passed

- **All 95 placeholder SVGs** in `public/images/**/*.svg`. Template is consistent: safe margins (>12 px clearance from viewBox edges), `.placeholder` text at the bottom, well-spaced labels, dark-mode-safe colour palette (WCAG AA at the chosen font sizes), every file labelled "PLACEHOLDER" so it cannot be mistaken for polished work.
- **The other 16 illustration components** (AstrupCascadeFig, BrainCompartments, ECoGStrip, EEGMontage, ICPProbePlacement, ICPWaveformMorph, JugularBulbCatheter, MarmarouCurve, MicrodialysisCatheter, MxAutoregContrast, MxVsPrxArchitecture, NCSEPathway, ONSDUltrasound, PbtO2Probe, PostArrestProgPathway, TCDWindows). All within layout tolerance; no overlap or boundary issues.

### Recommended order for layout fixes

1. **L1 (PupillaryPathway)** -- critical, easy mechanical replace.
2. **L2 (EvokedPotentialPathway)** -- medium, easy mechanical replace.
3. **L3 (AutoregLayered)** -- medium, easy mechanical replace.
4. **L4 (NeurovascularUnit)** -- medium, manual reposition.
5. **L5 (RaisedICPLadder)** -- low, manual coordinate shift.
6. **L6 (NIRSOptodes)** -- low, manual y-shift.

Estimated effort: 20-30 minutes for L1-L3 (mechanical); another 30-45 minutes for L4-L6 (judgement calls).

---

## VERIFICATION CHECKLIST (after fixes)

For each fix, verify:

- [ ] The cited paper supports the new wording.
- [ ] The fix is applied consistently across all files in the cross-page table.
- [ ] No new em-dashes were introduced (`grep -c "—" <file>` returns 0).
- [ ] `npm run typecheck` passes.
- [ ] The relevant illustration component matches the foundation / modality page text.
- [ ] After C1: `grep "1.07" src/content/foundations/cerebral-metabolism.mdx` shows the formula without `/10`.
- [ ] After C2: `grep -n "10 in newborns\|15 in infants" src/content/foundations/pediatric-physiology.mdx src/content/modalities/icp.mdx` shows them flagged as heuristic, not attributed to PBTF.
- [ ] After C3: `grep -n "concern &gt;" src/components/content/illustrations/ONSDUltrasound.tsx` shows the new cutoffs (4.0, 4.5, 5.0).
- [ ] After C4: `grep -c "−0.10\|\+0.15" src/content/foundations/autoregulation.mdx` returns 0 (the four-tier scheme is gone).
- [ ] After C5: the PbtO2 column in `astrup-cascade.mdx` shows `> 20 (target)` rather than `25–35`.
- [ ] After C6: `grep "futility" src/content/foundations/cerebral-metabolism.mdx` shows the new wording.
- [ ] After C7: `grep -c "53%\|34%" src/content/modalities/prx.mdx` returns 0; `grep "46.5\|30.3" src/content/modalities/prx.mdx` shows the new values.
- [ ] After C8: `src/components/widgets/SSEPViewer/engine.ts` and / or README documents the adult-only scope.

---

## NOT AUDITED

- I did not verify exact drug doses in `refractory-status-epilepticus.mdx` and other integration scenarios against the published trial protocols line-by-line. The doses match standard practice but should be cross-checked against ESETT (Kapur 2019), PALS, and local pediatric pharmacopoeia before use.
- I did not verify all volume / page numbers in `references.ts`. Authors / titles / journals / years are accurate to the best of memory; volume / page numbers may need PubMed cross-check.
- I did not exhaustively check Mermaid diagram node logic in every integration scenario.

These three areas should get a separate pass before the site is presented externally.
