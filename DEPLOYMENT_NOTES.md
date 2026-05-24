# MNM-Edu, Deployment Notes

> **⚠️ Superseded counts:** the figures below (38 widgets, 152 references, 55 routes) are from an
> earlier build. The current verified snapshot (9 foundations · 27 modalities · 18 integration · 44
> widgets · 307 references · 68 routes) and the full system reference live in
> [`docs/ENGINEERING_OVERVIEW.md`](docs/ENGINEERING_OVERVIEW.md). This file is retained for its
> deployment/accessibility/i18n detail.

## What shipped

A static, evidence-anchored educational site for pediatric multimodal neuromonitoring, built with Next.js 15 + React 19 + TypeScript and exported to a self-contained `out/` directory. **38 widgets**, **152 references**, **55 routes**, **46 unit tests**, **12-route axe audit**, **OG images per page**, **FR + AR translations of the autoregulation chapter**, **PDF / print button**.

### Page count

55 prerendered routes:

- 1 home + 1 about + 1 search + 1 glossary + 1 evidence + 1 pediatrics
- **9 foundation chapters** (`/foundations/*`)
- **24 modality pages** (`/modalities/*`)
- **10 integration scenarios** (`/integration/*`)
- + index pages for foundations / modalities / integration

### Widget count

**29 widgets**, full v1 catalog. All widgets read `useDetailLevel()` to adjust visible controls.

Launch-critical batch (24):
1. CPPoptUCurve, full port + 11 unit tests
2. PRxCalculator
3. ICPWaveformTrainer
4. GCSChart + 3 unit tests
5. AgeBandNorms (pediatrics hub)
6. CPPTriangle
7. MarmarouPVCurve
8. AstrupCascade
9. CO2ReactivityCurve
10. LindegaardCalculator
11. TCDWaveformExplorer
12. NIRSDisplay
13. EEGPatternLibrary
14. aEEGGenerator
15. PupilTrainer
16. BISDemo
17. qEEGSpectrogram
18. PbtO2Demo
19. MicrodialysisGrid
20. SjvO2Demo
21. ONSDDemo
22. NonInvasiveICPDemo
23. PEEPICPMAPDemo
24. RAPDemo

Previously deferred, now shipped:
25. CushingReflexDemo, embedded in `/foundations/autoregulation/` Deep Dive
26. PlateauWaveSimulator, embedded in `/modalities/icp/` Deep Dive
27. MultimodalDiscordance, embedded in `/integration/discordance-triage/`
28. SpreadingDepolarizationAnimator, embedded in `/foundations/spreading-depolarizations/`
29. OsmotherapyExplorer, embedded in `/integration/osmotherapy-icp-nirs/`

Round-3 batch (modality "Visual demo planned" placeholders + utility widgets):
30. SSEPViewer, embedded in `/modalities/evoked-potentials/`
31. BrainTempDemo, embedded in `/modalities/brain-temp/`
32. ThermalCBFDemo, embedded in `/modalities/direct-cbf/`
33. SDPropagation, embedded in `/modalities/ecog-sd/` (1-D companion to W17)
34. LassenCurve, embedded in `/foundations/autoregulation/`
35. O2ReactivityCurve, embedded in `/foundations/co2-o2-reactivity/`
36. CMRO2TempSlider, embedded in `/foundations/cerebral-metabolism/`
37. VolumeCompartmentAnimation, embedded in `/foundations/monro-kellie/`
38. GCSChartQuick, embeddable mini variant available

### Reference count

**152 references** in `src/data/references.ts`, every entry with full bibliographic data, DOI, category, tags, and (where present) evidence grade. Bumped via `REFERENCES_VERSION` constant on each curation pass.

### Tests

**9 engine test files · 46 unit tests · all passing** (CPPopt, GCS, Marmarou, Astrup, Pupil, Cushing, Plateau-wave, Brain temperature, Thermal CBF). Run with `npm run test`.

### Accessibility audit

Playwright + axe-core spec at `tests/e2e/a11y.spec.ts` runs WCAG 2.1 A + AA across 12 representative routes (home, all 4 hub indexes, 2 dynamic pages from each kind, glossary, evidence, search, about). All routes pass on critical violations. Remaining serious violations are reported but not blocking, they originate from edge-case hover-state contrast where Tailwind's translucent overlays blend below 4.5:1 with underlying ink-muted text. The resting layout is WCAG AA-clean.

### OG share images

`scripts/generate-og.mjs` produces 43 1200×630 SVG OG images at build time, one per foundation chapter, modality page, and integration scenario, plus `public/og/default.svg` for the site root. Each carries the page title, an accent strip, the MNM-Edu mark, and the kind label. Per-route Next.js metadata (`generateMetadata`) wires the appropriate image into OpenGraph + Twitter card tags.

### PDF / print

A `<PrintButton />` in every dynamic-page header triggers `window.print()` after pre-toggling Deep Dive (so the print copy is the most complete version). The print stylesheet hides chrome (site header, footer, nav, breadcrumbs, widget shells) and renders a clean black-on-white reading layout with inline DOI references.

### Internationalization

Header chrome (navigation, toggles, banner) translated to **French** and **Arabic**. RTL layout flips for Arabic via `dir="rtl"` on `<html>`. The autoregulation foundation chapter (`/foundations/autoregulation/`) carries fully translated FR + AR Essentials content; other clinical pages remain English at v1 and the locale banner notes this. The translation infrastructure (`<Lang locale="...">` MDX component + `[lang]`-driven CSS visibility) is ready for additional content as translators contribute.

### Pediatric data

`src/data/pediatric-norms.ts` carries 9 normative-value rows × 6 age bands × evidence-grade chips.

### Glossary

30+ terms with hover-card definitions on every page.

## Build & verification

- `npm install` (with `--legacy-peer-deps` for Next 15 / React 19 plugin compatibility).
- `npm run build` produces `out/` cleanly. 55 routes prerendered.
- All 7 top-level routes return HTTP 200 against `npx serve out/`.
- TypeScript strict-mode passes with no errors.
- Sample widget unit tests (CPPopt + GCSChart) pass.

## Build output (verified)

```
Route (app)                              Size     First Load JS
┌ ○ /                                    1.56 kB         144 kB
├ ○ /_not-found                          983 B           107 kB
├ ○ /about                               1.54 kB         140 kB
├ ○ /evidence                            1.54 kB         140 kB
├ ○ /foundations                         1.56 kB         144 kB
├ ● /foundations/[slug]                  150 B           169 kB     (9 paths)
├ ○ /glossary                            1.54 kB         140 kB
├ ○ /integration                         1.56 kB         144 kB
├ ● /integration/[scenario]              150 B           169 kB     (10 paths)
├ ○ /modalities                          1.56 kB         144 kB
├ ● /modalities/[slug]                   149 B           169 kB     (24 paths)
├ ○ /pediatrics                          1.56 kB         144 kB
└ ○ /search                              7.2 kB          150 kB
+ First Load JS shared by all            106 kB
```

## Deferred items, now delivered

All previously deferred v1.1 items are shipped in this build:

- **Light theme** (`[data-theme="light"]`), full token re-mapping in `globals.css` + `<ThemeToggle />` in the header + localStorage persistence + no-flash bootstrap.
- **PWA**, `public/manifest.webmanifest`, `public/sw.js` (stale-while-revalidate HTML, cache-first static, network-first search index), SVG app icon, and `<ServiceWorkerRegister />` only in production.
- **i18n**, `<LocalePicker />` in the header (en / fr / ar), RTL `dir="rtl"` for Arabic, locale bootstrap script, `<LocaleBanner />` notes that clinical content is English-only at v1. Translation infrastructure is in `src/lib/i18n.ts`, adding a new language is dropping a column into `STRINGS`.
- **5 widgets** built and embedded in their relevant pages (see widget list).
- **Recent literature**, 10 new 2024–2026 references curated and surfaced on 7 modality pages. Bibliography version stamp on `/evidence` (`REFERENCES_VERSION` constant in `src/data/references.ts`).

## Known limitations (still v1.1+ candidates)

- **Pediatric normative values** are still sparse and clearly flagged with `<EvidenceLevel grade="sparse" />`.
- **Full clinical translation** (FR / AR) requires actual medical translators, UI chrome is translated; foundation / modality / integration prose remains English. Banner notifies the user.
- **PWA icons** ship as SVG (universal); a PNG sequence (192/512) can be added if a target store requires raster.
- **Bibliography curation** is still manual, bump `REFERENCES_VERSION` each refresh.

## Accessibility

- WCAG 2.2 AA targeting; skip-link present, keyboard nav for all widgets, ARIA roles on all interactive primitives, color is never the sole channel.
- `axe-core` integration in Playwright config (run `npm run test:e2e` to lint).

## Hosting

Static export deploys anywhere: Cloudflare Pages, GitHub Pages, Vercel, S3+CloudFront, or any static directory. See `docs/deployment.md`.

## Next steps for the author

1. Set up the GitHub repo and CI (lint + typecheck + vitest + Playwright + axe).
2. Add Open-Graph share images per page under `public/og/`.
3. Curate "Recent literature" sections monthly.
4. Build out the deferred 5 widgets when bandwidth allows.
5. Consider Spanish + Arabic translations as v1.1 candidates.
