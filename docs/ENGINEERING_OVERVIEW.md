# MNM-Edu: Engineering & Design Overview

**Canonical technical reference for the MNM-Edu pediatric multimodal neuromonitoring website.**
Written for a technical review board and for AI review agents. This is the single document that
explains how the project is architected (engineering, UI, UX, content, data) and what remains
before production. Where a claim is verifiable in code, the file path is given so a reviewer or
agent can confirm it directly.

- **Status:** pre-production, feature-complete v1 content build
- **Last updated:** 2026-05-18
- **Owner doc set:** see [§16 Document map](#16-document-map). This file supersedes the
  scope/figures in `DEPLOYMENT_NOTES.md`, `README.md`, and `docs/PHASE_SUMMARIES.md`, which carry
  earlier (smaller) counts and an Essentials/Deep-Dive split that has since been removed.

---

## 1. What this is, and who it is for

MNM-Edu is an interactive, evidence-anchored educational website about **pediatric multimodal
neuromonitoring (MNM)**: how the bedside team reads ICP, CPP, PRx, CPPopt, TCD, NIRS, EEG/qEEG/aEEG,
BIS, pupillometry, PbtO₂, microdialysis, SjvO₂, ONSD, and related monitors in a child's brain, and
how those signals are interpreted **together**.

- **Primary audience:** PICU fellows, pediatric intensivists, neurosurgery / neurology trainees,
  and allied bedside clinicians.
- **Pedagogical stance:** bedside-first, pediatric-first, evidence-graded. Every quantitative claim
  carries a citation chip; every page leads with a clinical vignette.
- **Independence:** a standalone static website. It has **no runtime dependency** on any backend,
  database, or external simulator. The entire site is pre-rendered to static HTML/JS/CSS and can be
  served from any static host or a directory on an existing webserver.

It is **educational, not a clinical device.** Every page carries that framing; no patient data is
collected or processed.

---

## 2. System architecture at a glance

```
Authoring (MDX + TS data)  ─►  Build (Next.js static export)  ─►  out/ (static HTML/JS/CSS/JSON)  ─►  any static host
        │                              │                                    │
   src/content/*.mdx            next build (output:'export')        68 prerendered routes
   src/data/*.ts                remark/rehype MDX pipeline          search-index.json
   src/components/**            Fuse.js index built at compile      og/*.svg share images
```

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript (strict).
- **Rendering model:** 100% **static export** (`output: 'export'` in `next.config.mjs`). There is
  no server at runtime. Dynamic content (modalities, foundations, integration scenarios) is
  generated at build time via `generateStaticParams`.
- **Content:** MDX 3 files under `src/content/`, compiled through a remark/rehype pipeline
  (math, GFM, KaTeX, heading slugs/anchors). Frontmatter parsed with `gray-matter`.
- **Interactivity:** client React components (widgets, the 3D hero, search) hydrate on top of the
  static HTML. Canvas 2D and a single WebGL surface (the hero brain) are the only heavy client work.
- **Search:** a Fuse.js index is generated at export time (`search-index.json`) and shipped with the
  bundle; the search page is fully client-side.
- **Offline:** a service worker (`public/sw.js`) provides stale-while-revalidate for HTML,
  cache-first for static assets, network-first for the search index (production only).

**Why static export:** zero attack surface, trivially cacheable, hostable anywhere, no PHI/DB,
survives traffic spikes, and is the right fit for an evidence resource that updates on an editorial
cadence rather than per-request.

---

## 3. Repository map

```
neurosim website/
├── src/
│   ├── app/                    # Next.js App Router routes (one folder per route)
│   │   ├── page.tsx            # Home (3D brain hero + section nav + catalog)
│   │   ├── layout.tsx          # Root layout: ScrollProgress, Header, Footer, BackToTop, SW
│   │   ├── foundations/        # index + [slug] dynamic chapter route
│   │   ├── modalities/         # index + [slug] dynamic modality route
│   │   ├── integration/        # index + [scenario] dynamic scenario route
│   │   ├── pediatrics/         # pediatrics hub (age-band norms)
│   │   ├── evidence/           # full reference library (search + filter)
│   │   ├── glossary/           # A–Z glossary (search + jump bar)
│   │   ├── search/             # Fuse.js search UI + symptom/scenario chips
│   │   ├── teach/              # fellow-lecture presenter mode (timer)
│   │   ├── quick-card/         # bedside quick-reference card
│   │   ├── about/  roadmap/  figure-credits/
│   ├── content/                # MDX content (the clinical material)
│   │   ├── foundations/        # 9 chapters
│   │   ├── modalities/         # 27 modality pages
│   │   ├── integration/        # 18 worked clinical scenarios
│   │   └── pediatrics/
│   ├── components/
│   │   ├── ui/                 # design-system primitives (Card, Panel, Callout, …)
│   │   ├── content/            # MDX-facing components (Cite, Quiz, Figure, …) + illustrations/
│   │   ├── layout/             # Header, Footer, ScrollProgress, PageScaffold, …
│   │   ├── home/               # homepage sections (Hero, BrainModel, DomainPentagon, …)
│   │   ├── widgets/            # 44 interactive widget folders (engine + React shell)
│   │   ├── mdx/                # MDX component registry (the scope map)
│   │   ├── modalities/         # ModalitiesBrowser (filterable catalog)
│   │   └── teach/              # LectureTimer, LectureSection
│   ├── data/                   # typed data layer (references, modalities, glossary, norms)
│   ├── lib/                    # content loader, search, citations, i18n, theme, thumbnails
│   ├── hooks/                  # useCountUp, useReducedMotion
│   └── styles/                 # globals.css (design tokens), home.css (hero animations)
├── public/                     # static assets: images/, og/, icons/, manifest, sw.js
├── docs/                       # engineering + editorial docs (this file lives here)
├── claude-code-tasks/          # content-expansion task package + content audit + image prompts
├── scripts/                    # serve.js (static server), generate-og, gen-placeholders
├── tests/                      # Playwright + axe e2e specs
├── out/                        # build output (static export), gitignore in production
├── next.config.mjs  tailwind.config.ts  tsconfig.json  package.json
└── Start MNM-Edu.bat           # double-click Windows launcher (build + serve on :3041)
```

---

## 4. Technology stack and rationale

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15** App Router, static export | Mature MDX + routing + image story; `output:'export'` gives a dependency-free static bundle |
| UI runtime | **React 19** + **TypeScript strict** | Type safety across the data layer and widget engines; strict mode catches contract drift |
| Styling | **Tailwind CSS 3.4** + CSS custom properties | Utility classes for layout; CSS variables for themeable design tokens (dark + light) |
| Content | **MDX 3** via `@next/mdx` + `next-mdx-remote` | Lets clinical authors write prose with embedded interactive components and math |
| Math | **KaTeX** (`remark-math` + `rehype-katex`) | Server-rendered equations, no client math cost |
| Diagrams | **Mermaid** (client-side dynamic import) | Decision trees / flowcharts authored as text fences |
| Charts | **Recharts** + hand-rolled **Canvas 2D** | Recharts for trends; Canvas for high-frequency waveform widgets |
| 3D | **three.js** + **simplex-noise** | The homepage anatomical brain (single WebGL surface, lazy + reduced-motion aware) |
| Search | **Fuse.js** | Fuzzy client search over a compile-time index |
| Frontmatter | **gray-matter** | YAML frontmatter parsing |
| Icons | **lucide-react** | Consistent stroke-icon set |
| Motion | **framer-motion** + CSS keyframes | Subtle entrance/scroll motion, all `prefers-reduced-motion` gated |
| Tests | **Vitest** (unit), **Playwright + axe-core** (e2e + a11y) | Pure-function widget math is unit-tested; routes are a11y-audited |

Install note: Next 15 / React 19 plugin compatibility requires `npm install --legacy-peer-deps`.

---

## 5. Content architecture

### 5.1 Three content kinds

| Kind | Folder | Count | Purpose |
|---|---|---|---|
| Foundations | `src/content/foundations/` | **9** | Cerebral-physiology primer chapters (autoregulation, Monro-Kellie, Astrup cascade, …) |
| Modalities | `src/content/modalities/` | **27** | One page per monitor (ICP, TCD, NIRS, EEG, PbtO₂, …) |
| Integration | `src/content/integration/` | **18** | Worked multi-modal clinical scenarios (vasospasm, DKA oedema, brain death, …) |

Total: **54 authored clinical pages**, plus the utility routes (home, search, glossary, evidence,
pediatrics, teach, quick-card, about, roadmap, figure-credits) → **68 prerendered routes**.

### 5.2 The Tier 1 page spine (modalities + integration)

Every modality and integration page follows an 18-section spine modeled on the reference exemplar
`src/content/modalities/tcd.mdx`:

1. Frontmatter → 2. Acronyms callout → 3. TldrCard (60-second version) → 4. Three bedside vignettes
→ 5. What it is / is not → 6. Anatomy / placement (Figure) → 7. The signal/waveform (Figure)
→ 8. The numbers to record → 9. What is normal (age-banded table) → 10. What is abnormal (pattern
library) → 11. Try-it widgets → 12. Management section → 13. 8+ clinical contexts
→ 14. Multimodal integration matrix → 15. Setup & technique (deep dive) → 16. Pitfalls
→ 17. Combine-with cross-links → 18. Evidence + recent literature → **3-question Quiz**.

Foundation chapters use a condensed Tier-2 spine (vignette + primer + pattern library + 3–4 clinical
contexts + pitfalls + quiz). Authoring rules live in `claude-code-tasks/00-style-guide.md` and
`docs/editorial-guidelines.md`.

### 5.3 MDX pipeline (how a page becomes HTML)

1. `src/lib/content.ts` (`loadContent`, `listContent`, `listSlugs`) reads the `.mdx` file and splits
   frontmatter (gray-matter) from body.
2. Citations are pre-extracted in document order (`extractCitationOrder`) so `<Cite>` chips number
   per-page.
3. The body is compiled by `next-mdx-remote/rsc` with the remark/rehype plugin set from
   `next.config.mjs` (math, GFM, KaTeX, heading slugs + wrap-anchors).
4. MDX tags resolve against the component scope in `src/components/mdx/components.tsx`, the
   authoritative allow-list of components an author may use.
5. The dynamic route (`app/<kind>/[slug]/page.tsx`) renders the compiled content inside the
   `PageScaffold` (header, breadcrumbs, sidebar TOC, prev/next nav, print button).

### 5.4 Frontmatter schema

```yaml
title:        # human-readable
description:  # one line (quote it if it contains a colon, YAML)
eyebrow:      # "Modality 2 · Invasive pressure" / "Foundation 3"
short:        # nav acronym
domain:       # category slug
labels:       # modalities only: { usage, population, invasiveness, validation }
prereqs / relatedModalities:   # foundations only
modalities:   # integration only, array of modality slugs
evidenceGrade: A | B | C | expert | sparse
lastReviewed: YYYY-MM-DD
```

### 5.5 Authoring hard rules (enforced editorially)

- **No em-dashes** (the character U+2014) anywhere, replaced by commas / colons / semicolons /
  parentheses. (Historical rationale: encoding-safety + house style. Verified per file by grepping
  for U+2014; the count must be 0.)
- **No `<SpeakerNote>`** in new content (legacy component, being phased out).
- Only components in the `src/components/mdx/components.tsx` scope may be used.
- Every `<Cite id>` key must resolve in `src/data/references.ts`; every `<Figure src>` must resolve
  in `public/images/`.

> **Note on detail levels:** the original Essentials/Deep-Dive split (`<Essentials>`/`<DeepDive>`)
> has been **removed**, those components are now pass-throughs (`src/components/content/Detail.tsx`)
> and the site shows all content at all times. `README.md` and `docs/detail-level-authoring.md`
> still describe the old split and are stale on this point.

---

## 6. Data layer

Typed, version-controlled TypeScript modules under `src/data/`, no database.

| File | Holds | Notes |
|---|---|---|
| `references.ts` | **307** bibliographic entries | Keyed by stable citation key; full author/title/journal/DOI/category/tags/`evidence_grade`. `REFERENCES_VERSION` constant stamps each curation pass (currently `2026-05-17`). Drives `<Cite>` and the `/evidence` library. |
| `modalities.ts` | Modality registry | `slug`, `title`, `short`, `summary`, `domain`, `labels` (type/usage/population/invasiveness/validation), `evidenceGrade`. Drives the catalog, sidebar, and filter. |
| `glossary.ts` | 30+ terms | `term`, `definition`, `related[]`. Drives `<Definition>` hover-cards and `/glossary`. |
| `pediatric-norms.ts` | Age-banded normative values | Powers the pediatrics hub + the `AgeBandNorms` widget; sparse data flagged with evidence chips. |
| `integration-cases.ts` | Scenario metadata | Backing data for the integration index. |

Adding a reference is appending one object; adding a modality is one registry row + one MDX file.

---

## 7. UI / UX design system

### 7.1 Design tokens (`src/styles/globals.css`)

Dark-first, with a fully remapped light theme (`[data-theme='light']`) and localStorage persistence
+ no-flash bootstrap. Tokens are CSS custom properties surfaced to Tailwind via `tailwind.config.ts`.

| Token group | Dark values | Purpose |
|---|---|---|
| Background scale | `--bg-darker #081224`, `--bg-dark #0F1A2E`, `--bg-card #152238`, `--bg-deeper #0a1426` | Layered surface depth |
| Borders | `--border #2a3a55`, `--border-strong #3b4d70` | Resting vs scrolled/active |
| Brand / accent | `--teal #14B8A6`, `--teal-light #5EEAD4`, `--amber #F59E0B`, `--purple #7C3AED`, `--blue #3B82F6` | Domain colour coding |
| Status | `--green #10B981`, `--red #EF4444`, `--red-strong #DC2626` | Good / caution / danger |
| Text | `--text #FFFFFF`, `--muted #94A3B8`, `--muted-dark #8B96A8` | Foreground scale |

**Accessibility is baked into the token values, not bolted on.** The CSS comments record the WCAG
math: purple was darkened from `#8B5CF6` to `#7C3AED` (4.23:1 → ~5.4:1 on white), `--muted-dark` from
`#64748B` to `#8B96A8` (3.65:1 → ~4.6:1 on dark), and there are two reds so that both red-text-on-dark
and white-text-on-red clear 4.5:1.

### 7.2 Component layers

- **UI primitives** (`src/components/ui/`): `Card`, `Panel`, `Readout`, `StatusPill`, `ToggleRow`,
  `Button`, `Callout`, `EvidenceLevel`, `ModalityLabels`, `Tabs`, `Tooltip`, `Dialog`, `Thumbnail`.
- **Content components** (`src/components/content/`, MDX-facing): `Cite`, `Definition`, `Quiz`,
  `Pearl`, `Pitfall`, `Pediatric`, `Tutorial`, `Controversy`, `RealWorld`, `TldrCard`,
  `AlgorithmDisclaimer`, `Figure`, `WidgetEmbed`, `Lang`, `SourcedFigure`, plus the
  `illustrations/` set (22 hand-built anatomical/schematic SVG components).
- **Layout** (`src/components/layout/`): `Header` (scroll-aware, 9-item nav), `Footer`,
  `Breadcrumbs`, `PageScaffold`, `PageSidebar`, `TableOfContents`, `PrevNextNav`, `ScrollProgress`,
  `BackToTop`, `ThemeToggle`, `LocalePicker`, `LocaleBanner`, `PrintButton`,
  `ServiceWorkerRegister`.

### 7.3 The homepage (`src/components/home/`)

A bespoke landing experience, distinct from the content-page scaffold:

- **`Hero` + `BrainModel`**, a procedurally generated 3D anatomical brain (three.js + simplex-noise:
  ~640 nodes, k-NN edges, 5 monitoring-channel hotspots, signal pulses, 24 s rotation). It pauses
  off-screen (IntersectionObserver), disposes all WebGL resources on unmount, and renders a **static
  SVG fallback** when `prefers-reduced-motion` is set or on low-power devices.
- **`SectionNav`**, sticky pill bar with scroll-spy (IntersectionObserver) and a sentinel-based
  "stuck" state for scroll-aware contrast.
- **`StatStrip`**, count-up stats (IntersectionObserver-gated, eased), reduced-motion aware.
- **`DomainPentagon`**, the five monitoring domains with hover-isolate interaction.
- **`SecondaryInjuryTimeline`, `ModalityGridTeaser`** (filterable 27-card grid), **`FoundationsEntry`,
  `AboutFooter`.**

### 7.4 UX patterns and conventions

- **Responsive grid:** content catalogs use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (1/2/3 cards
  by breakpoint). The desktop nav collapses to a hamburger below the `lg` (1024 px) breakpoint.
- **Navigation:** sticky scroll-aware header (opaque + shadow when scrolled), per-page sticky TOC
  sidebar, breadcrumbs, prev/next chapter nav, back-to-top, and a 2 px scroll-progress bar.
- **Reading aids:** reading-time estimate, collapsible acronym box (the page-top reference callout),
  per-page citation side-sheet, glossary hover-cards.
- **Discovery:** `/evidence` (full reference library with search + category/grade filters + chip
  legend), `/glossary` (search + sticky A–Z jump bar), `/search` (fuzzy + symptom/scenario chips).
- **Motion discipline:** every animation has a `prefers-reduced-motion` path; motion is entrance/
  scroll-spy only, never load-blocking.
- **Print:** `<PrintButton>` + a print stylesheet that strips chrome and renders clean
  black-on-white with inline DOI references.

---

## 8. Interactive widget architecture

44 widget folders under `src/components/widgets/`. The contract:

```
widgets/<Name>/
  index.tsx          # React shell: controls, readouts, layout, a11y. Presentation only.
  engine.ts          # pure, testable math/physiology functions. No React, no DOM.
  (canvas/draw code) # Canvas 2D rendering for waveform/trace widgets
  __tests__/engine.test.ts   # Vitest unit tests for the math
```

- **Separation of concerns:** all math lives in `engine.ts` as pure functions; the React component
  does presentation only. This makes the clinically important logic unit-testable in isolation.
- **Registry:** `src/components/content/WidgetEmbed.tsx` maps a widget name → a lazy dynamic import
  (`ssr:false`, with a skeleton loader). Authors embed via `<WidgetEmbed name="CPPoptUCurve" />`.
- **Examples of the math under test:** `CPPoptUCurve` (PRx-vs-CPP parabola fit), `MarmarouPVCurve`
  (sigmoid PV curve with terminal plateau), `GCSChart`, `AstrupCascade`, `PupilTrainer`,
  `BrainTempDemo`, `ThermalCBFDemo`, plateau-wave, Cushing reflex.

> Count note: the widget *folder* count is 44; earlier docs cite "29/38 widgets" from earlier build
> snapshots. The folder count is the current source of truth.

---

## 9. Illustration system

Two complementary approaches for figures:

1. **React illustration components** (`src/components/content/illustrations/`, 22 files): hand-built
   SVG schematics (`ICPProbePlacement`, `NIRSOptodes`, `TCDWindows`, `BrainCompartments`,
   `PupillaryPathway`, `MarmarouCurve`, `AstrupCascadeFig`, `NeurovascularUnit`, …). They are
   registered in the MDX scope and embedded as `<Figure caption="…"><ComponentName /></Figure>`.
2. **Static image figures**: polished raster/vector art placed under `public/images/<page>/` and
   embedded as `<Figure src="/images/…" caption="…" alt="…" />`. Several key anatomy figures
   (Monro-Kellie, SjvO₂, pupillary reflex, NIRS optodes, ICP probes, TCD windows) are transitioning
   from the React schematics to commissioned images; the `<Figure>` component (`Figure.tsx`) renders
   either form behind one API.

A complete set of AI-image-generation prompts for every figure is maintained in
`claude-code-tasks/08-illustration-prompts.md` (with clinical landmarks, label lists, and a
post-audit accuracy checklist), so figures can be regenerated consistently.

---

## 10. Accessibility

- **Target:** WCAG 2.1 / 2.2 AA.
- **Tokens:** contrast ratios are engineered into the palette (see §7.1) with the math recorded in
  CSS comments.
- **Audit:** Playwright + axe-core spec (`tests/e2e/a11y.spec.ts`) sweeps representative routes; the
  resting layout is AA-clean. Residual "serious" items are edge-case translucent hover-state
  contrast, reported but non-blocking.
- **Interaction:** skip-link, keyboard navigation for widgets, ARIA roles on interactive primitives,
  colour is never the sole information channel (evidence grade also carries a letter; domains carry
  labels), every figure/illustration has descriptive `alt`/`aria-label`, motion respects
  `prefers-reduced-motion`.

---

## 11. Internationalization

- Infrastructure in `src/lib/i18n.ts` (`STRINGS` table) + `<LocalePicker>` (en / fr / ar) +
  `<Lang locale="…">` MDX component + `<LocaleBanner>`.
- Header chrome is translated to **French** and **Arabic**; **Arabic flips to RTL** via `dir="rtl"`.
- Clinical prose is English at v1 (the autoregulation chapter carries a translated sample); the
  banner discloses this. Adding a language is adding a column to `STRINGS` and translated content.

---

## 12. Search & discovery

- A search index is generated at static-export time and shipped as `public/search-index.json`.
- The `/search` route is a fully client-side **Fuse.js** fuzzy search over the union of all content,
  plus a row of symptom/scenario quick-chips (e.g. "Fixed dilated pupil", "Raised ICP", "Suspected
  vasospasm / DCI") that route to the relevant scenarios.

---

## 13. Build, export & deploy

```bash
npm install --legacy-peer-deps   # Next 15 / React 19 peer-dep compatibility
npm run dev                       # local dev server (:3000)
npm run build                     # static export → out/  (68 routes)
npm run typecheck                 # tsc --noEmit (must be clean)
npm run lint                      # next lint
npm run test                      # vitest (engine unit tests)
npm run test:e2e                  # Playwright + axe
```

- **Output:** `out/` is a self-contained static bundle (HTML + JS + CSS + JSON + images + OG SVGs).
- **Hosting:** Cloudflare Pages, GitHub Pages, Vercel, S3+CloudFront, or any static directory. See
  `docs/deployment.md`.
- **Local production preview:** `scripts/serve.js` (zero-dependency Node static server) serves `out/`
  on port 3041; `Start MNM-Edu.bat` is a double-click Windows launcher that builds if needed, opens
  the browser, and serves.
- **Static-export gotcha** (important for reviewers testing locally): `public/` is copied into `out/`
  **only at build time**. New assets dropped into `public/` after a build will not appear until the
  next `npm run build` (or until copied into `out/` directly). The same applies to the service
  worker cache, a hard refresh / SW unregister is needed to see new content during iteration.

---

## 14. Testing & quality gates

| Gate | Command | Current state |
|---|---|---|
| Type safety | `npm run typecheck` | Strict, expected to exit 0 |
| Lint | `npm run lint` | Passes (warnings only: a few unused vars, `<img>` advisory) |
| Unit (widget math) | `npm run test` | 9 engine test files (Vitest) |
| e2e + a11y | `npm run test:e2e` | Playwright + axe across representative routes |
| Production build | `npm run build` | 68 routes prerendered cleanly |

**Gap:** there is currently **no CI pipeline**. These gates are run manually. Wiring them into CI is
the first production-readiness item (§15).

---

## 15. Current-state snapshot (verified 2026-05-18)

| Metric | Value | Source of truth |
|---|---|---|
| Foundation chapters | 9 | `src/content/foundations/*.mdx` |
| Modality pages | 27 | `src/content/modalities/*.mdx` |
| Integration scenarios | 18 | `src/content/integration/*.mdx` |
| Prerendered routes | 68 | `out/**/index.html` |
| Interactive widgets | 44 folders | `src/components/widgets/*/` |
| Illustration components | 22 | `src/components/content/illustrations/*.tsx` |
| References | 307 | `src/data/references.ts` (`REFERENCES_VERSION 2026-05-17`) |
| Engine unit-test files | 9 | `src/**/__tests__/*.test.ts` |
| Themes | dark + light | `globals.css` |
| Locales (chrome) | en / fr / ar | `src/lib/i18n.ts` |

---

## 16. Document map

| Document | Scope | Freshness |
|---|---|---|
| **`docs/ENGINEERING_OVERVIEW.md`** (this file) | The whole system, engineering, UI/UX, content, data, build, validation | **Current** |
| `README.md` | Quickstart + content-adding | Partly stale (24 modalities, 12-section template, Essentials/DeepDive) |
| `DEPLOYMENT_NOTES.md` | "What shipped" snapshot | Stale counts (38 widgets, 152 refs, 55 routes) |
| `docs/PHASE_SUMMARIES.md` | Build-phase narrative | Stale (lists light theme / PWA / i18n as deferred, all now shipped) |
| `docs/editorial-guidelines.md` | Content tone, citation rules, authoring checklist | Current (minor: 12-section → 18-section) |
| `docs/detail-level-authoring.md` | Essentials/Deep-Dive | **Obsolete** (split removed) |
| `docs/deployment.md` | Hosting recipes | Current |
| `claude-code-tasks/00-style-guide.md` | Authoring hard rules + component allow-list + Quiz schema | Current |
| `claude-code-tasks/07-content-audit.md` | Clinical fact-check audit (thresholds, citations) | Current |
| `claude-code-tasks/08-illustration-prompts.md` | Figure regeneration prompts + accuracy checklist | Current |

---

## 17. Known limitations

- **No CI/CD.** Quality gates are run by hand.
- **Stale satellite docs.** README / DEPLOYMENT_NOTES / PHASE_SUMMARIES carry earlier counts and the
  removed detail-level split (this file is the corrected reference).
- **Pediatric normative data is sparse** and explicitly flagged with `<EvidenceLevel grade="sparse">`.
- **Clinical translation is English-only** at v1 (chrome is translated; one sample chapter is
  translated). The locale banner discloses this.
- **Figure provenance is mid-transition**, some pages use React SVG schematics, some use commissioned
  images; a few image files still need to be dropped into `public/images/`.
- **Reference volume/page numbers** were authored to best knowledge and not all line-by-line
  PubMed-verified (titles/authors/journals/years are; some volume/page fields need confirmation).
- **Drug doses in integration scenarios** match standard practice but have not been verified
  line-by-line against the cited trial protocols.
- **Widget folder count (44)** exceeds the count surfaced in older docs; a reconciliation pass to
  confirm every folder is wired into a page and the registry is advisable.

---

## 18. Validation readiness & next steps (the path to production)

The build is feature-complete and structurally sound. Before production it needs two distinct
validation tracks (structural/technical and informational/clinical) plus operational
setup. Recommended order:

### A. Structural / technical validation
1. **Stand up CI** (GitHub Actions): run `typecheck`, `lint`, `vitest`, `playwright+axe`, and
   `build` on every PR. This is the single highest-leverage step.
2. **Link & asset integrity audit:** automated check that every `<Cite id>` resolves, every
   `<Figure src>` file exists, every `<WidgetEmbed name>` is in the registry, every internal
   cross-link target exists. (Most of these are conventions today; turn them into a build-time
   assertion.)
3. **Widget registry reconciliation:** confirm all 44 widget folders are embedded somewhere and
   tested; retire or document orphans.
4. **Performance budget:** measure the 3D hero's cost on low-end devices; confirm the reduced-motion
   fallback path and lazy-load boundaries hold; set a first-load JS budget.
5. **Full a11y pass:** extend the axe sweep to all 68 routes; resolve or formally accept the residual
   hover-contrast items.
6. **Cross-browser / responsive matrix:** verify the figure layouts and homepage 3D across Chrome,
   Safari, Firefox, and at mobile/tablet/desktop breakpoints.
7. **Refresh the satellite docs** (README, DEPLOYMENT_NOTES, PHASE_SUMMARIES) to current counts, or
   redirect them to this overview.

### B. Informational / clinical validation
8. **Clinical fact-check sign-off:** a pediatric neurocritical-care reviewer walks the
   `claude-code-tasks/07-content-audit.md` checklist plus a fresh read of all 54 pages, thresholds
   (ICP/CPP by age, PRx, PbtO₂, ONSD cutoffs), trial figures (COGiTATE, BOOST, ESETT, THAPCA), and
   drug doses, signed against the cited sources.
9. **Reference verification:** PubMed-confirm volume/page numbers and DOIs across `references.ts`;
   stamp a new `REFERENCES_VERSION`.
10. **Figure accuracy review:** apply the clinical-accuracy checklist in
    `claude-code-tasks/08-illustration-prompts.md` to every figure; finalize the React-schematic vs
    commissioned-image decision per page and ensure all referenced image files are present.
11. **Pediatric-data expansion:** fill or re-confirm the `pediatric-norms.ts` rows; keep sparse data
    flagged.
12. **Editorial consistency sweep:** confirm the hard rules (no em-dashes, no SpeakerNote, Quiz
    schema) hold across all pages, and that terminology (acronyms, units, rounding) is consistent
    site-wide.

### C. Operational / governance
13. **Versioning & changelog:** adopt a content version + per-page `lastReviewed` cadence; publish a
    review schedule (the evidence base needs periodic re-curation).
14. **Medico-legal review** of the "educational, not a clinical device" framing and license
    (content CC BY-SA 4.0, code MIT).
15. **Analytics / feedback** (privacy-preserving) to learn which pages and widgets are used, to guide
    the next content cycle.
16. **Hosting + domain + cache strategy** finalized (the static bundle is host-agnostic; pick the
    target and set cache headers + a deploy hook).

**One-line summary for the board:** the engineering is production-grade and the content is
feature-complete; what remains is (1) automating the quality gates in CI, (2) a clinical reviewer's
formal sign-off on facts/figures/doses against the cited literature, and (3) routine operational
setup (versioning, hosting, analytics). None of these are blockers to *reviewing* the site today;
all are prerequisites to *publishing* it as an authoritative resource.
