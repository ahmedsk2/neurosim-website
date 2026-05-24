# Phase Summaries

## Phase 0, Reading

The physiology, math, and bibliography are encoded directly in code:
- `src/data/references.ts`, 110+ references with DOIs and evidence grades.
- `src/data/pediatric-norms.ts`, age-banded normative values.
- `src/data/glossary.ts`, 30+ terms.
- Widget engines (`engine.ts` files) implement the canonical math from Appendix A.

## Phase 1, Scaffold ✓

- Next.js 15 + React 19 + TypeScript strict.
- Tailwind 3 + CSS variables for design tokens.
- MDX 3 via `next-mdx-remote` for content authoring under `src/content/`.
- Vitest + Playwright + axe-core configured.

## Phase 2, Design system ✓

- Color tokens (dark theme).
- UI primitives: Card, Panel, Readout, StatusPill, ToggleRow, Button, Callout, EvidenceLevel, Tabs, Tooltip, Dialog.
- Content components: Cite, Reference, Definition, Quiz, Pearl, Pitfall, Pediatric, Essentials, DeepDive, Detail, WidgetEmbed.
- Detail toggle with localStorage persistence and no-flash bootstrap.
- Header / Footer / Breadcrumbs / Sidebar / TableOfContents.
- Home page with hero, 4-up grid, featured widget tile.

## Phase 3, Content pipeline ✓

- MDX loader with citation pre-extraction (per-page numbering).
- Citation system with side-sheet display.
- Glossary with hover-card definitions.
- Search index built at static-export time; Fuse.js client.
- Dynamic routes for foundations / modalities / integration.

## Phase 4, Foundation chapters ✓

All 9 chapters authored with Essentials + DeepDive, embedded widgets, and 3-question retrieval quizzes:
1. autoregulation
2. co2-o2-reactivity
3. cerebral-metabolism
4. monro-kellie
5. marmarou-pv-curve
6. astrup-cascade
7. spreading-depolarizations
8. blood-brain-barrier
9. pediatric-physiology

## Phase 5, Modality pages ✓

All 24 modality pages authored following the 12-section template:
- Clinical exam, ICP, RAP, CPP, PRx, Mx, ORx, CPPopt
- TCD, NIRS, EEG, qEEG, aEEG, BIS, Pupillometry
- PbtO₂, Microdialysis, SjvO₂
- ONSD, Non-invasive ICP, Brain temperature
- SSEPs/BAERs, Direct CBF, ECoG/SD

## Phase 6, Widgets ✓

24 widgets built (the launch-critical batch):
- CPPoptUCurve (full port of attached HTML reference; tested)
- PRxCalculator (shares engine with CPPopt)
- ICPWaveformTrainer
- GCSChart (tested)
- AgeBandNorms
- CPPTriangle
- MarmarouPVCurve
- AstrupCascade
- CO2ReactivityCurve
- LindegaardCalculator
- TCDWaveformExplorer
- NIRSDisplay
- EEGPatternLibrary
- aEEGGenerator
- PupilTrainer
- BISDemo
- qEEGSpectrogram
- PbtO2Demo
- MicrodialysisGrid
- SjvO2Demo
- ONSDDemo
- NonInvasiveICPDemo
- PEEPICPMAPDemo
- RAPDemo

Deferred to v1.1 (P2): CushingReflexDemo, PlateauWaveSimulator, MultimodalDiscordance, SpreadingDepolarizationAnimator, OsmotherapyExplorer.

## Phase 7, Integration scenarios ✓

All 10 scenarios authored:
1. PRx vs ORx discordance
2. TCD vs ICP vasospasm
3. aEEG narrowing + TCD systolic peaks (NCSE)
4. CPPopt-targeting (COGiTATE-style)
5. Osmotherapy + ICP + NIRS
6. MNM on VA-ECMO
7. Brain death MNM
8. Discordance triage (flowchart)
9. PbtO₂ CPP titration (BOOST-style)
10. MNM in the newborn (HIE)

## Phase 8, Polish ✓

- Search page + index.
- Global header navigation with detail toggle.
- Print stylesheet (defaults to Deep Dive).
- Skip-link for accessibility.
- OG / Twitter card metadata in root layout.
- Reading-progress / TOC component scaffolded.

## Phase 9, Build & deploy

- `npm install` + `npm run build` produces `out/`.
- Static export deployable to any static host.
- See `docs/deployment.md`.

## Known limits / deferred

- Light theme is reserved but not implemented.
- PWA manifest / service worker not wired (asset budget reasons).
- i18n (FR / AR) deferred to v1.1.
- Some P2 widgets (Cushing, plateau-wave, SD animator, osmotherapy) deferred.
- The "Recent literature" feed for each modality is a curated stub, bump and re-curate monthly.
