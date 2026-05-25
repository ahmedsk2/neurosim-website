# Wave 3b Discovery: Tailwind CSS 3 to 4 migration (READ ONLY)

Phase 2, Wave 3, sub-wave 3b prep. Discovery only. Nothing was installed, no branch
opened, no source or config changed. The one write is this file.

- Date: 2026-05-25
- Git precondition (verified first): on `main`, working tree clean,
  `HEAD == origin/main == c54cd64` (the Wave 3a merge), in sync. Evidence:
  `git branch --show-current`, `git status -sb` (`## main...origin/main`, no
  ahead/behind), `git rev-parse HEAD` and `git rev-parse origin/main`,
  `git fetch origin main --dry-run` (no new refs).
- Method: every claim cites its source. `npm view ...` = read-only registry query;
  file citations use `path:line`; grep findings cite the search. Every Tailwind v4
  claim is grounded in the official upgrade guide, fetched (not from memory):
  https://tailwindcss.com/docs/upgrade-guide

## Headline

This is the cleanest possible Tailwind 3 to 4 setup to migrate, because our project
uses almost none of the constructs v4 changed: there is NO `@apply`, NO `@layer`, NO
`theme()` call anywhere in src (grep: 0 matches), and NO Tailwind `dark:` variant
anywhere (the only `dark:` grep hits are CSS variable names like `--bg-dark:`). Our
dark/light theming is pure CSS custom properties keyed off `[data-theme]`, which v4
does not touch. The real work is mechanical (config form, PostCSS plugin, import
directive, a handful of tool-renamed utilities) plus one global preflight change
(button cursor) and a visual review.

---

## 1. Versions and the upgrade tool

| Package | Current | Latest | Source |
| --- | --- | --- | --- |
| tailwindcss | 3.4.17 (`package.json`) | 4.3.0 | `npm view tailwindcss version` |
| @tailwindcss/postcss | not installed | 4.3.0 | `npm view @tailwindcss/postcss version` |
| @tailwindcss/upgrade | not installed | 4.3.0 | `npm view @tailwindcss/upgrade version` |

`npm view tailwindcss dist-tags` shows `latest: 4.3.0` and a maintained `v3-lts: 3.4.19`.
v4 moved the PostCSS plugin to its own package: `npm view @tailwindcss/postcss
peerDependencies dependencies` shows peer `postcss: ^8.5.10` (our direct postcss is
8.5.15, so satisfied) and deps `tailwindcss@4.3.0`, `@tailwindcss/node@4.3.0`,
`@tailwindcss/oxide@4.3.0` (the Rust engine), `@alloc/quick-lru`.

**Official upgrade tool: `npx @tailwindcss/upgrade` (v4.3.0).** Per the upgrade guide it:
- updates dependencies (removes tailwindcss v3, adds the v4 packages),
- migrates the config file to the CSS-first format,
- rewrites template class names for renamed utilities and the important-modifier
  position.
Requirement: Node.js 20+. We are on Node 24 (`.nvmrc`), so satisfied. The guide
recommends running it on a branch and reviewing the diff; complex projects may need
manual tweaks.

`npm view tailwindcss engines` returned no engines field, so the Node floor comes
from the guide (20+ for the tool). Browser baseline (guide): Safari 16.4+, Chrome
111+, Firefox 128+, because v4 relies on `@property` and `color-mix()`. DECISION FOR
THE OWNER: if older browser support is required, the guide says stay on v3.4; for a
modern educational site this is likely acceptable but should be confirmed.

---

## 2. Our current Tailwind setup

### tailwind.config.ts (full read)
- `content`: `./src/app/**/*.{ts,tsx,mdx}`, `./src/components/**/*.{ts,tsx,mdx}`,
  `./src/content/**/*.{md,mdx}` (`tailwind.config.ts:4-8`).
- `darkMode: 'class'` (`:9`) but see section 2 note: it is effectively unused (no
  `dark:` utilities exist).
- `theme.extend.colors` (`:12-43`): every token maps to a runtime CSS variable, e.g.
  `surface.darker: var(--bg-darker)`, `brand.teal: var(--teal)`, `line.DEFAULT:
  var(--border)`, `ink.DEFAULT: var(--text)`, `status.danger: var(--red-strong)`.
  This is a TWO-LAYER system: Tailwind color names point at design CSS vars, which are
  themed by `[data-theme]`.
- `fontFamily` (`:44-47`), `maxWidth` (prose 70ch, page 1500px, `:48-51`),
  `letterSpacing` (eyebrow 0.2em, `:52-54`), `keyframes`/`animation`
  (`demo-pulse`, `:55-64`).
- `plugins: []` (`:67`). No `safelist`, no `corePlugins`, no `separator`, no custom
  plugins. This matters: those are exactly the JS-config options v4 does not support
  via `@config`, and we use none of them.

### postcss.config.mjs (full read)
`export default { plugins: { tailwindcss: {}, autoprefixer: {} } };`
(`postcss.config.mjs:1-6`). Standard v3 chain. No `postcss-import`.

### CSS entries
- `src/styles/globals.css`: the Tailwind entry. Uses the v3 directives `@tailwind
  base; @tailwind components; @tailwind utilities;` (`globals.css:1-3`). Then the
  design-token system: dark defaults on `:root` (`:8-42`) and a light remap on
  `[data-theme='light']` (`:45-68`), with WCAG contrast annotations baked into the
  palette comments (e.g. purple raised to `#7C3AED` for AA, `:25-26`; `--muted-dark`
  raised for AA, `:39-41`). The rest is plain CSS: base resets, locale-block
  visibility, reduced-motion, the print stylesheet (`:113-125`), focus ring, skip
  link, the `.prose-mnm` typography system (`:164-242`, all `var(--...)` based),
  KaTeX dark overrides, scrollbar. None of it uses Tailwind at-rules or functions.
- `src/styles/home.css`: pure CSS (hero keyframes and animation classes,
  `home.css:1-107`). No Tailwind directives. Unaffected by v4.

### How Tailwind is imported and what v4 changes
- Import: the three `@tailwind` directives in `globals.css:1-3` (v4 replaces these
  with a single `@import "tailwindcss";`).
- `@apply` / `@layer` / `theme()`: grep across all of `src` returned NO matches
  (`grep "@apply|@layer|theme\("`). So the v4 changes to those constructs do not
  affect us at all.
- `dark:` variants: grep `\bdark:` across `src` returned 6 hits, ALL in
  `globals.css`, and all are CSS variable names (`--bg-dark:`, `--teal-dark:`,
  `--muted-dark:` on `:root` and the light remap), not utilities. Zero `dark:`
  utilities in components. So the v4 dark-mode handling is irrelevant to us.
- Arbitrary CSS-var-in-class old syntax (`bg-[--x]`): grep `[a-z]-\[--` returned NO
  matches, so the `bg-[--x]` to `bg-(--x)` change does not affect us.

---

## 3. v4 breaking changes that actually hit us

Source for the v4 behavior: the official upgrade guide. Mapped to our code.

### 3a. Config model: JS config to CSS-first, and the lower-risk path
v4 prefers CSS-first `@theme` and NO LONGER auto-detects a JS config; a JS/TS config
must be loaded explicitly with `@config "..."`. Two viable paths:

- Path A (lower risk for our token setup): keep `tailwind.config.ts` and add
  `@config "../../tailwind.config.ts";` above `@import "tailwindcss";` in
  `globals.css`. v4 then reads our existing `theme.extend` (the `var(--...)` color
  map, fonts, maxWidth, letterSpacing, keyframes/animation) and content globs
  unchanged. The unsupported-via-@config options (corePlugins, safelist, separator)
  are ones we DO NOT use, so there is no loss. This preserves the exact two-layer
  token behavior with the smallest diff. CAVEAT to confirm at execution: the guide
  example shows a `.js` path; v4's `@config` is expected to load a `.ts` config too,
  but confirm against the installed 4.x (or rename/transpile if needed).
- Path B (idiomatic v4): move the theme into a CSS `@theme` block, e.g.
  `--color-brand-teal: var(--teal); --color-line: var(--border); --font-sans: ...;
  --max-width-prose: 70ch; --animate-demo-pulse: ...`. v4 `@theme` accepts `var()`
  values, so the two-layer scheme survives, but every token is re-expressed (more
  surface for error, and the nested `DEFAULT` keys like `line.DEFAULT`/`ink.DEFAULT`
  must become the base `--color-line` / `--color-ink`).

The upgrade tool defaults to converting the JS config to `@theme` (Path B shape).
RECOMMENDATION: let the tool attempt the conversion, but if its `@theme` output is
noisy or mis-maps the nested `DEFAULT`/`var()` tokens, fall back to Path A (`@config`),
which is the conservative choice that guarantees identical token resolution.

### 3b. PostCSS plugin
`postcss.config.mjs` becomes `export default { plugins: { "@tailwindcss/postcss": {} } };`
(guide section 4). Two of our current plugins are dropped: `autoprefixer` (v4 prefixes
internally) and there is no `postcss-import` to drop. So `autoprefixer` (devDep
10.5.0) becomes unused and can be removed. New devDeps: `@tailwindcss/postcss`
(and it pulls `@tailwindcss/oxide`).

### 3c. Import directive
`globals.css:1-3` (`@tailwind base/components/utilities`) becomes a single
`@import "tailwindcss";` (guide section 5). If Path A is chosen, the `@config` line
goes immediately before it.

### 3d. Renamed/removed utilities and default-value changes, mapped to our usage
The tool rewrites renamed classes; the silent default changes are the ones to watch.

| v4 change (guide) | Our usage (grep) | Risk | Who fixes |
| --- | --- | --- | --- |
| `flex-shrink-*` to `shrink-*` | `flex-shrink-0` in ~10 components (integration/foundations pages, ModalitiesBrowser, Callout, SectionNav, ModalityGridTeaser, FoundationsEntry, DomainPentagon, PrevNextNav) | low | tool rename |
| `outline-none` to `outline-hidden` | `focus:outline-none` in ~12 spots (EvidenceLibrary, GlossaryIndex, SearchClient, Callout, BackToTop, Hero, ModalityGridTeaser, FoundationsEntry, PrevNextNav) | low | tool rename |
| `shadow` to `shadow-sm`; `shadow-sm` to `shadow-xs` | bare `shadow` in `ui/Card.tsx` (2x) | low | tool rename |
| `rounded` to `rounded-sm`; `rounded-sm` to `rounded-xs` | bare `rounded` (LocalePicker, LectureTimer, LectureSection); `rounded-sm` (Tabs, CPPoptUCurve) | low | tool rename |
| `backdrop-blur-sm` to `backdrop-blur-xs` | `backdrop-blur-sm` in `ui/Dialog.tsx`, `BackToTop.tsx` | low | tool rename |
| important `!x` to `x!` | `!max-w-none` x5 in `app/quick-card/page.tsx` | low | tool rename (old syntax also still supported) |
| default border color gray-200 to currentColor | our borders pair an explicit color (`border border-line`, `border-brand-teal`, `border-l-brand-teal`); no bare color-less `border` seen in the sampled set | low IF every `border` is color-paired | verify + optional base style |
| default ring 3px/blue to 1px/currentColor | we use explicit `ring-1`/`ring-2` AND explicit `ring-brand-teal(Light)` everywhere | very low (width and color are explicit) | none |
| placeholder gray-400 to 50% text opacity | we set `placeholder:text-ink-dim` explicitly on the search/glossary inputs | low | verify any input lacking explicit placeholder color |
| button cursor pointer to default | 23 files contain `<button>` (about 33 occurrences) | MEDIUM (global UX shift, not layout) | add a base style |
| `space-x/y` selector change (`:not([hidden]) ~` to `:not(:last-child)`) | `space-y-*` used in 30+ places (page stacks, widget panels, `ol`/`ul` lists); no `space-x-` or `divide-*` | low to medium | visual review of stacked lists / any hidden children |

Safe (unchanged) in our code: `rounded-md`/`rounded-lg`/`rounded-full`/`rounded-[5px]`,
`backdrop-blur-md`, `shadow-lg`/`shadow-xl`, and arbitrary `shadow-[0_...]`.

Two items deserve explicit attention because they are NOT class renames the tool can
fully resolve:
- BUTTON CURSOR (preflight): v4 makes buttons use `cursor: default`. The guide gives
  the exact restore snippet; for us it would live in `globals.css`:
  `button:not(:disabled), [role="button"]:not(:disabled) { cursor: pointer; }`.
  Without it, all 23 button-bearing files lose the pointer cursor on hover.
- DEFAULT BORDER COLOR: low risk because our borders are color-paired, but the
  zero-risk safety net is one base rule setting the default border color to our token,
  e.g. `*, ::after, ::before { border-color: var(--border); }` (or the guide's
  `var(--color-gray-200, currentColor)` form). Worth adding so no bare `border`
  anywhere can shift.

### 3e. @apply / theme() / @layer
Not used anywhere (section 2). Zero impact.

### 3f. Dark/light theming
Unaffected. Our theming is `[data-theme]` + CSS variables in plain CSS
(`globals.css:8-68`), independent of Tailwind's `dark:` mechanism (which we do not
use). It works identically under v4. The `darkMode: 'class'` config line is vestigial
and can be dropped (or left in the JS config under Path A with no effect).

---

## 4. Visual-regression risk map (where the human review must look)

No automated gate covers visual correctness: typecheck, lint, validate-content, unit,
and the Playwright e2e suite (an a11y/axe sweep of about 12 routes) do not assert
pixel or layout fidelity. After migration, review these specifically, in BOTH dark
(default) and light (`[data-theme='light']`) themes:

1. Design-token colors end to end. Confirm the `surface/brand/status/ink/line` tokens
   still resolve to the right CSS vars in both themes (tailwind.config.ts:12-43 plus
   globals.css:8-68). This is the highest-leverage check: if the config conversion
   mis-maps a token, many pages shift at once. Pay attention to the WCAG-tuned values
   (purple, muted-dark, the two reds).
2. Buttons everywhere (23 files): verify the cursor and any focus-ring/hover styling.
   Confirm the cursor base style (if added) took effect.
3. Focus rings: the `focus:ring-2 focus:ring-brand-teal` pattern on Hero CTAs, cards
   (ModalityGridTeaser, FoundationsEntry, PrevNextNav), Callout, BackToTop, and the
   search/glossary inputs.
4. Homepage (`/`): Hero buttons/borders, ModalityGridTeaser cards, DomainPentagon,
   SectionNav, FeaturedWidget, the 3D hero area (home.css is plain CSS, low risk).
5. Modality cards grid (`/modalities`, ModalitiesBrowser) and the cards' rounded/
   shadow/border treatment.
6. Widgets and charts (the `src/components/widgets/*` set, many using Recharts and
   canvas): borders, rounded corners, `space-y` panels, readouts, pills, tabs
   (`ui/Tabs.tsx` uses `rounded-sm`). Confirm the tool's shadow/rounded renames did
   not change perceived corner radius or elevation.
7. `space-y` stacked lists (30+ spots, especially `ol`/`ul` with `list-*` and the
   widget takeaway panels): the v4 selector change is usually invisible for plain
   block stacks but check any list with conditionally-hidden children or custom child
   margins.
8. Print stylesheet (`globals.css:113-125`, `@media print`): plain CSS, low risk, but
   confirm Tailwind preflight changes did not alter print output (it hides canvases
   and widget shells and forces black-on-white).
9. Dialog/Tooltip/Callout overlays (`backdrop-blur` and shadows) in both themes.

---

## 5. Interaction with Wave 3a (webpack build path)

Wave 3a set the build to `next build --webpack` (`package.json` build script). The v4
PostCSS integration is `@tailwindcss/postcss`, a standard PostCSS plugin. Next.js runs
PostCSS (reading `postcss.config.mjs`) inside its CSS pipeline regardless of bundler,
so `@tailwindcss/postcss` works on the webpack build path. It is NOT Turbopack
specific. The guide's faster `@tailwindcss/vite` plugin is for Vite projects and does
NOT apply to Next.js; for Next.js the PostCSS plugin is the correct and only path here.
So the 3a webpack decision and a v4 Tailwind migration are compatible: no conflict.

One watch-item, not a blocker: `@tailwindcss/postcss` pulls `@tailwindcss/oxide`, a
native (Rust) binary delivered through platform-specific optional dependencies. npm
installs the right binary per platform, so CI (ubuntu-latest) and local (win32) each
get their own. Confirm a clean `npm ci` on CI after the bump (the same way Wave 3a was
CI-verified); native optional deps are the usual suspect if an install ever differs
across platforms.

---

## Appendix: commands run for this discovery (all read-only)

- Git: `git branch --show-current`, `git status -sb`, `git rev-parse HEAD`,
  `git rev-parse origin/main`, `git fetch origin main --dry-run`.
- Registry: `npm view tailwindcss version|dist-tags|engines`,
  `npm view @tailwindcss/postcss version|peerDependencies|dependencies`,
  `npm view @tailwindcss/upgrade version`.
- Files read: `tailwind.config.ts`, `postcss.config.mjs`, `src/styles/globals.css`,
  `src/styles/home.css`; glob `src/**/*.css`.
- Searches (src): `@apply|@layer|theme\(` (0 matches); `\bdark:` (6, all CSS var
  names); the removed/renamed utility set (`*-opacity-*`, `flex-shrink/grow`,
  `outline-none`, etc.); `space-x-|space-y-|divide-x|divide-y`; the
  `shadow|rounded|blur|drop-shadow|backdrop-blur` token distribution; `<button>`
  count; `[a-z]-\[--` (0) and important `!` prefix.
- Web (read-only fetch): the official Tailwind v4 upgrade guide
  (https://tailwindcss.com/docs/upgrade-guide).
