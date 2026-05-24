# ARCHITECTURE_NOTES: how the system actually fits together

Written from the code read during this audit, not from the older docs. Each subsystem notes the
files that implement it. This is descriptive (what is), not prescriptive (what should be).

---

## 1. Rendering model: static export

`next.config.mjs` sets `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`, and
`pageExtensions: ['ts','tsx','mdx']`. The result of `next build` is a self-contained `out/` directory
of static HTML/JS/CSS/JSON/assets. There is **no server at runtime**: all 68 routes are prerendered
at build time. The three dynamic routes (`foundations/[slug]`, `modalities/[slug]`,
`integration/[scenario]`) each export `generateStaticParams`, which enumerates the slugs to render.

Implication for reviewers: anything that must reflect content (search index, OG images, copied
`public/` assets) is produced **at build time**. Files added to `public/` after a build do not appear
until the next build copies them into `out/`.

---

## 2. Content pipeline (MDX → HTML)

```
src/content/<kind>/<slug>.mdx
        │  (gray-matter splits frontmatter from body)
src/lib/content.ts   loadContent / listContent / listSlugs / extractCitationOrder
        │
app/<kind>/[slug]/page.tsx
        │  MDXRemote (next-mdx-remote/rsc) compiles the body
        │  components = mdxComponents  (the allow-list scope)
        ▼
   prerendered HTML inside the page scaffold
```

- **Loader:** `src/lib/content.ts` reads the `.mdx` file, parses frontmatter with `gray-matter`,
  exposes `ContentDoc`, and provides `extractCitationOrder(body)` so `<Cite>` chips number in
  document order per page.
- **Compile:** the dynamic route renders `<MDXRemote source=… components={mdxComponents} />` from
  `next-mdx-remote/rsc` (`src/app/modalities/[slug]/page.tsx`, and the foundations/integration
  equivalents).
- **MDX plugins** (`next.config.mjs`): remark-math + remark-gfm; rehype-katex (server-rendered
  equations), rehype-slug + rehype-autolink-headings (heading anchors).
- **Component scope:** `src/components/mdx/components.tsx` is the single allow-list of tags an author
  may use. Anything not in that map will fail to render. It includes callouts, structure components,
  citation/definition, `WidgetEmbed`, `Mermaid`, and the 22 illustration components.
- **Detail wrappers:** `Essentials` / `DeepDive` / `Detail` are registered but are **pass-throughs**
  (`src/components/content/Detail.tsx`); they render children unchanged. The reading-mode toggle they
  once drove no longer exists.

---

## 3. Widget contract

```
src/components/widgets/<Name>/
   index.tsx       React shell (controls, readouts, layout, a11y)
   engine.ts       pure math/physiology (11 of 42 widgets)  ── OR ── math exported from index.tsx
   __tests__/*.test.ts   Vitest unit tests (9 widgets, 48 cases)
```

- **Shared infra (two folders, distinct roles):**
  - `widgets/shared/` → `WidgetShell.tsx` (the common chrome) + `useCanvas.ts` (Canvas setup hook),
    imported by ~41 widgets.
  - `widgets/_shared/` → `correlationCanvas.ts` + `correlationIndex.ts` (the slow-wave correlation
    engine reused by the autoregulation-index widgets: PRx/Mx/ORx and kin), imported by ~8 widgets.
- **Embedding / registry:** authors write `<WidgetEmbed name="X" />`. `WidgetEmbed.tsx` holds a
  `REGISTRY` of **42 entries** mapping a name to a lazy `() => import('@/components/widgets/X')`
  (code-split, `ssr:false`, skeleton fallback while loading). Widgets are therefore not in the
  initial bundle; they hydrate on demand.
- **Math separation:** where it exists, `engine.ts` holds pure functions and the React component does
  presentation only, which is what makes the math unit-testable. Two widgets (`CushingReflexDemo`,
  `PlateauWaveSimulator`) keep their math inline in `index.tsx` and test it via `../index` instead of
  a separate engine file.
- **Rendering tech:** Recharts for trend charts; hand-rolled Canvas 2D (via `useCanvas`) for
  high-frequency waveform widgets.

---

## 4. Theming and design tokens

- **Token source:** `src/styles/globals.css` defines CSS custom properties on `:root` (dark, the
  default) and re-maps them under `[data-theme='light']`. Examples: `--bg-darker #081224`,
  `--teal #14B8A6`, `--text #FFFFFF`, `--muted #94A3B8`.
- **Accessibility is encoded in the token values.** The CSS comments record WCAG math: purple was
  darkened `#8B5CF6 → #7C3AED` (4.23:1 → ~5.4:1 on white), `--muted-dark` `#64748B → #8B96A8`
  (3.65:1 → ~4.6:1 on dark), and there are two reds (`--red` for red-text-on-dark, `--red-strong` for
  white-text-on-red) so both clear 4.5:1.
- **Tailwind bridge:** `tailwind.config.ts` maps utility color names to those variables (e.g.
  `surface.darker → var(--bg-darker)`, `border.DEFAULT → var(--border)`), so utilities follow the
  active theme automatically.
- **Theme switching:** `src/lib/theme.ts` toggles the `data-theme` attribute on `<html>`, persists to
  `localStorage`, and exports `THEME_BOOTSTRAP_SCRIPT` (an inline no-flash script that sets the theme
  before first paint, defaulting to dark).

---

## 5. Search

- **Corpus + index:** `src/lib/search.ts` exposes `buildSearchCorpus()` and `writeSearchIndexJSON()`.
  The latter writes `public/search-index.json` (`fs.writeFileSync` to `process.cwd()/public/...`).
- **When it runs:** `src/app/search/page.tsx` calls `writeSearchIndexJSON()` at module evaluation
  during the static export, so the index is generated as a build side-effect and shipped in the
  bundle.
- **Client:** the `/search` route is fully client-side fuzzy search (Fuse.js) over that JSON, plus
  symptom/scenario quick-chips that deep-link into scenarios.

---

## 6. Routing and page scaffold

- **App Router**, 16 `page.tsx` entry points. Static routes render directly; the 3 dynamic routes
  expand via `generateStaticParams` to 54 pages.
- **Per-page metadata:** dynamic routes export `generateMetadata` that wires OpenGraph/Twitter image
  URLs to `/og/<kind>/<slug>.svg` (see the OG gap in `CURRENT_STATE.md` §9).
- **Scaffold:** content pages render inside a shared layout (header, breadcrumbs, sidebar TOC,
  prev/next, print button) under `src/components/layout/`. The homepage uses a bespoke composition
  (`src/components/home/`) instead of the content scaffold.

---

## 7. Homepage hero (client-only 3D)

`src/app/page.tsx` → `Hero` → `BrainModel`. The brain is a WebGL surface built with `three` +
`simplex-noise`, dynamically imported with `ssr:false` so it never runs during static generation. It
pauses when off-screen (`IntersectionObserver`) and renders a static fallback when `reducedMotion` is
true. This is the only WebGL surface in the app; everything else is DOM/SVG/Canvas-2D.

---

## 8. Offline / PWA

`public/sw.js` (registered by `src/components/layout/ServiceWorkerRegister.tsx`, production only)
provides stale-while-revalidate for HTML, cache-first for static assets, and network-first for the
search index. `public/manifest.webmanifest` is present.

---

## 9. Internationalization

`src/lib/i18n.ts` holds a `STRINGS` table; `LocalePicker` (en/fr/ar) + `LocaleBanner` live in
`src/components/layout/`. Chrome is translated; clinical prose is English at v1, disclosed by the
banner. Arabic flips to RTL via `dir="rtl"`.

---

## 10. Build-time generators (not all wired into the build)

| Generator | Output | Wired into `npm run build`? |
|---|---|---|
| Search index (`src/lib/search.ts` via `app/search/page.tsx`) | `public/search-index.json` | Yes (build side-effect) |
| OG images (`scripts/generate-og.mjs`) | `public/og/<kind>/<slug>.svg` | **No** (manual; see OG gap) |
| Modality bundle (`scripts/bundle-modalities.mjs`) | `modalities-for-review.md` | No (manual, on demand) |
| Figure placeholders (`scripts/gen-placeholders.mjs`) | placeholder SVGs under `public/images/` | No (manual, one-time) |

This split is the root cause of the stale/partial OG image set: because OG generation is manual, new
pages added after the last run have no share image.

---

## 11. What is NOT in the architecture (verified absences)

- **No backend, database, or API routes.** Pure static export.
- **No CI pipeline.** Quality gates (`typecheck`, `lint`, `test`, `test:e2e`, `build`) are run by hand
  (`package.json`); no `.github/workflows`.
- **No `.git`** at the project path (version control, if any, is external to this directory).
- **No active reading-mode/detail-level system** (removed; pass-through shims remain).
