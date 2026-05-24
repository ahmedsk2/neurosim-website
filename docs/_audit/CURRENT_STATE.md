# CURRENT_STATE: verified ground-truth snapshot

Read-only audit of the MNM-Edu repository. Every nontrivial claim cites the file or command that
proves it, so a reviewer can confirm it independently. Counts were taken from the filesystem on the
audit date, not carried over from any existing doc.

- **Audit date:** 2026-05-24
- **Audit scope:** `C:\Users\ahmed\Documents\neurosim website`
- **Method:** filesystem inspection (`ls`, `grep`, `find`, file reads). No source/config/assets were
  modified. No build or install was run during the audit.

---

## 1. Stack and runtime (verified)

| Item | Value | Evidence |
|---|---|---|
| Framework | Next.js **15.1.6** | `package.json` → `dependencies.next` |
| UI runtime | React **19.0.0** / react-dom **19.0.0** | `package.json` |
| Language | TypeScript **5.7.2**, `strict: true` | `package.json` devDeps; `tsconfig.json` `compilerOptions.strict` |
| Styling | Tailwind CSS **3.4.17** | `package.json` devDeps |
| Rendering | Static export: `output: 'export'` | `next.config.mjs` |
| Routing extras | `trailingSlash: true`, `images.unoptimized: true`, `pageExtensions: ['ts','tsx','mdx']` | `next.config.mjs` |
| MDX pipeline | `@next/mdx` + `next-mdx-remote`; remark-math, remark-gfm; rehype-katex, rehype-slug, rehype-autolink-headings | `next.config.mjs` |

There is no runtime server: the site is a static export. Dynamic content is expanded at build time
(see Routes).

---

## 2. Content inventory (verified)

Counted from `src/content/<kind>/*.mdx`.

| Kind | Count | Path |
|---|---|---|
| Foundations | **9** | `src/content/foundations/` |
| Modalities | **27** | `src/content/modalities/` |
| Integration scenarios | **18** | `src/content/integration/` |
| **Total authored pages** | **54** | |

`src/content/pediatrics/` exists but contains **no `.mdx` files** (the pediatrics hub is data-driven,
not MDX-driven).

### 2.1 Foundation slugs (9)
`astrup-cascade, autoregulation, blood-brain-barrier, cerebral-metabolism, co2-o2-reactivity,
marmarou-pv-curve, monro-kellie, pediatric-physiology, spreading-depolarizations`

### 2.2 Modality slugs (27)
`advanced-nirs, aeeg, bis, brain-temp, clinical-exam, cpp, cppopt, direct-cbf, ecog-sd, eeg,
evoked-potentials, fontanelle-us, icp, microdialysis, mx, nirs, non-invasive-icp, onsd, orx, pbto2,
pediatric-stroke-monitoring, prx, pupillometry, qeeg, rap, sjvo2, tcd`

### 2.3 Integration slugs (18)
`brain-death-mnm, cppopt-targeting, discordance-triage, dka-cerebral-edema, eeg-tcd-non-convulsive,
family-communication-mnm, inborn-errors-encephalopathy, meningitis-encephalitis, mnm-in-the-newborn,
mnm-on-ecmo, osmotherapy-icp-nirs, pbto2-cpp-titration, pediatric-stroke-ais, prx-vs-orx-discordance,
refractory-status-epilepticus, resource-limited-bedside, tcd-vs-icp-vasospasm, wlst-organ-donation`

---

## 3. Routes (verified)

| Item | Value | Evidence |
|---|---|---|
| Route entry points (`page.tsx`) | **16** | `find src/app -name page.tsx` |
| Dynamic route segments | **3** | `foundations/[slug]`, `modalities/[slug]`, `integration/[scenario]` |
| `generateStaticParams` present | all 3 dynamic routes | grep in each dynamic `page.tsx` |
| **Prerendered routes in `out/`** | **68** | `find out -name index.html` |

Composition of the 68: 13 static routes (home, foundations index, modalities index, integration
index, pediatrics, evidence, glossary, search, about, figure-credits, quick-card, roadmap,
teach/fellow-lecture) + 54 dynamic (9+27+18) + 1 (`404`).

**`out/` freshness:** the existing build is current. Newest content file
`src/content/modalities/tcd.mdx` mtime `2026-05-18 10:48`; `out/` index.html mtime `2026-05-18 10:53`
(built after the latest content change). The 68 count therefore reflects current source.

---

## 4. Widgets (verified)

| Item | Value | Evidence |
|---|---|---|
| Directories under `src/components/widgets/` | **44** | `find … -maxdepth 1 -type d` |
| Real widget folders (have `index.tsx`) | **42** | per-folder check |
| Shared utility folders | **2** | `shared/` and `_shared/` |
| Folders with `engine.ts` | **11** | `find … -name engine.ts` |
| Folders with a `__tests__/*.test.ts` | **9** | `find … -path "*__tests__*" -name "*.test.ts"` |
| Total unit test cases (it/test calls) | **48** | grep across the 9 test files |

**The two shared folders are distinct, not duplicates:**
- `src/components/widgets/shared/` → `WidgetShell.tsx` + `useCanvas.ts` (imported by ~41 widgets).
- `src/components/widgets/_shared/` → `correlationCanvas.ts` + `correlationIndex.ts` (imported by ~8
  correlation-index widgets such as PRx/Mx/ORx).

**Tested widgets (9 test files):** AstrupCascade, BrainTempDemo, CPPoptUCurve, CushingReflexDemo,
GCSChart, MarmarouPVCurve, PlateauWaveSimulator, PupilTrainer, ThermalCBFDemo.

**Note on engine location:** `CushingReflexDemo` and `PlateauWaveSimulator` have no `engine.ts`; their
math is exported from `index.tsx` and the tests import from `../index`. So "11 engine.ts files" and "9
tested widgets" are different facts and both are correct.

---

## 5. Data layer (verified)

| Module | Content | Count / constant |
|---|---|---|
| `src/data/references.ts` | Bibliography | **306 entries** (4-space-indented `key:` lines; 0 double-quoted keys). `REFERENCES_VERSION = '2026-05-17'`. Exports `REFERENCES` (map) + `REFERENCE_LIST` (array). |
| `src/data/glossary.ts` | Glossary terms | **31 terms** (`term:` fields) |
| `src/data/pediatric-norms.ts` | Age-banded norms | **6 age bands** (`AGE_BANDS`) + **11 norm rows** (`NORMS`); each `NormRow` carries per-band normal/concern/source/grade |
| `src/data/modalities.ts` | Modality registry | drives catalog + filters |
| `src/data/integration-cases.ts` | Scenario metadata | drives integration index |

Only one version constant exists in the data layer: `REFERENCES_VERSION` (no separate content or
glossary version stamp).

---

## 6. MDX component scope (verified)

Registered in `src/components/mdx/components.tsx`. Includes callouts (`Pearl`, `Pitfall`,
`Pediatric`, `Tutorial`, `Controversy`, `RealWorld`, `Callout`), structure (`TldrCard`, `Figure`,
`SourcedFigure`, `WidgetEmbed`, `Quiz`, `AlgorithmDisclaimer`, `Mermaid`), citation/definition
(`Cite`, `Definition`, `EvidenceLevel`), `Lang`, the detail wrappers, and 22 illustration components
(`ICPProbePlacement`, `NIRSOptodes`, `TCDWindows`, `BrainCompartments`, `PupillaryPathway`,
`MarmarouCurve`, `AstrupCascadeFig`, `NeurovascularUnit`, `EEGMontage`, `EvokedPotentialPathway`,
`ECoGStrip`, `MicrodialysisCatheter`, `JugularBulbCatheter`, `ONSDUltrasound`, `PbtO2Probe`,
`ICPWaveformMorph`, `RaisedICPLadder`, `NCSEPathway`, `PostArrestProgPathway`, `MxAutoregContrast`,
`MxVsPrxArchitecture`, `AutoregLayered`).

**Detail-level wrappers are pass-throughs.** `src/components/content/Detail.tsx` defines
`Essentials`, `DeepDive`, and `Detail` as components that render `{children}` unchanged. The file's
own comment: "The Essentials/DeepDive split was removed, the site now shows all content at all times."
They remain registered only so legacy MDX still compiles.

**`SpeakerNote` is still registered** in the MDX scope, even though the house style forbids its use in
new content (`claude-code-tasks/00-style-guide.md`).

---

## 7. Homepage hero (verified)

`src/app/page.tsx` composes: `Hero`, `SectionNav`, `StatStrip`, `DomainPentagon`,
`SecondaryInjuryTimeline`, `ModalityGridTeaser`, `FoundationsEntry`, `AboutFooter` (all under
`src/components/home/`).

The hero is a **3D animated WebGL brain**, not a static image:
- `src/components/home/Hero.tsx` dynamically imports `BrainModel` with `ssr: false` (client-only).
- `src/components/home/BrainModel.tsx` imports `three` and `simplex-noise` at runtime, creates a
  `Three.WebGLRenderer`, pauses rendering off-screen via `IntersectionObserver`, and accepts a
  `reducedMotion` prop that short-circuits to a static fallback.

---

## 8. Figures and illustrations (verified)

Two figure mechanisms coexist:
1. **22 React illustration components** under `src/components/content/illustrations/` (registered in
   the MDX scope, embedded as `<Figure><Component/></Figure>`).
2. **Commissioned raster figures** under `public/images/<page>/`, embedded as `<Figure src=… />`.

**The 6 commissioned PNGs referenced by the converted pages all now exist on disk** (verified):
`public/images/foundations/monro-kellie/monro-kellie-sagittal.png`,
`public/images/sjvo2/jugular-bulb-catheter.png`,
`public/images/pupillometry/pupillary-light-reflex.png`,
`public/images/nirs/nirs-optode-placement.png`,
`public/images/icp/icp-probe-placement.png`,
`public/images/tcd/tcd-acoustic-windows.png`.

(This is newer than `docs/ENGINEERING_OVERVIEW.md`, which described figure provenance as
"mid-transition" with files still to be added.)

---

## 9. Open-Graph share images (verified, INCOMPLETE)

`scripts/generate-og.mjs` writes `public/og/<kind>/<slug>.svg`. Per-page metadata
(`app/*/[slug]/page.tsx`, `app/layout.tsx`) references `/og/<kind>/<slug>.svg`.

| Set | Present | Expected (1 per page) | Gap |
|---|---|---|---|
| `public/og/foundations/` | 9 | 9 | none |
| `public/og/modalities/` | 24 | 27 | **3 missing** |
| `public/og/integration/` | 10 | 18 | **8 missing** |
| `public/og/default.svg` | 1 | 1 | none |
| **Total** | **44** | 55 | **11 missing** |

**Modality pages missing an OG image:** `advanced-nirs`, `fontanelle-us`,
`pediatric-stroke-monitoring`.
**Integration pages missing an OG image:** `dka-cerebral-edema`, `family-communication-mnm`,
`inborn-errors-encephalopathy`, `meningitis-encephalitis`, `pediatric-stroke-ais`,
`refractory-status-epilepticus`, `resource-limited-bedside`, `wlst-organ-donation`.

Those 11 pages reference `/og/<kind>/<slug>.svg` in their metadata, but the file does not exist, so
their social-share preview is a broken link. Root cause: `generate-og.mjs` is **not wired into the
build** (no `prebuild`/`postbuild`/`generate-og` reference in `package.json`), so OG output is frozen
at the last manual run, predating the newer pages.

---

## 10. Build, test, CI (verified)

`package.json` scripts: `dev`, `build` (`next build`), `start`, `lint` (`next lint`), `typecheck`
(`tsc --noEmit`), `test` (`vitest run`), `test:watch`, `test:e2e` (`playwright test`), `analyze`
(`ANALYZE=true next build`).

- **CI:** none found. No `.github/workflows/`, no `.gitlab-ci.yml`, no `.circleci/`.
- **Version control:** no `.git` directory at the project path. The website directory is not a git
  repository at this location (version control, if any, is managed elsewhere). See OPEN_QUESTIONS.
- **e2e/a11y:** Playwright config present (`playwright.config.ts`) and a test dir (`tests/`).
- **OG generation** is manual (not in the build pipeline).

---

## 11. In-code stale counts (findings, not fixed)

The string "24 modalities / Twenty-four" appears in user-visible code while the repo has 27 modality
pages:
- `src/app/page.tsx` line 14: metadata description "…24 modalities…".
- `src/app/about/page.tsx` line 18: "Twenty-four modalities are covered…".
- `src/app/modalities/page.tsx` line 12: page title "Twenty-four monitors, one template".

Per the read-only constraint these are recorded as findings only and were not changed.

---

## 12. Headline numbers (one-line summary)

Next.js 15.1.6 / React 19 / TS strict / Tailwind 3.4, static export. **9 foundations, 27 modalities,
18 integration scenarios (54 pages); 68 prerendered routes; 42 widget folders (9 with unit tests, 48
test cases); 306 references (v2026-05-17); 31 glossary terms; 6 age bands + 11 norm rows; 22
illustration components; 44 OG SVGs (11 pages missing); 3D WebGL hero. No CI, no .git at this path,
OG generation not in the build.**
