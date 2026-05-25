# Wave 3c Discovery: UI-library majors (READ ONLY)

Phase 2, Wave 3, sub-wave 3c prep. Discovery only. Nothing installed, no branch, no
commits. The one write is this file.

- Date: 2026-05-25
- Git precondition (verified first): on `main`, working tree clean,
  `HEAD == origin/main == ed3e63a` (the Wave 3b Tailwind 4 merge), in sync. Evidence:
  `git branch --show-current`, `git status -sb` (`## main...origin/main`, no
  ahead/behind), `git rev-parse HEAD` and `git rev-parse origin/main`,
  `git fetch origin main --dry-run` (no new refs).
- Method: every claim cites its source. `npm view ...` = read-only registry query;
  file/usage claims cite the grep; each library's breaking changes are grounded in
  the official changelog or migration guide, fetched (not from memory):
  - tailwind-merge v3: https://github.com/dcastil/tailwind-merge/releases/tag/v3.0.0
  - Lucide v1: https://lucide.dev/guide/version-1 and https://lucide.dev/guide/react/migration
  - Motion (formerly Framer Motion): https://motion.dev/docs/react-upgrade-guide
  - recharts v3: https://github.com/recharts/recharts/releases/tag/v3.0.0

## Headline (this reframes the wave)

Two of the four "UI majors" are DEAD DEPENDENCIES with zero imports in src, so they
carry no migration or visual risk for us:
- recharts: not imported anywhere in src (charts are drawn with canvas and SVG).
- framer-motion: not imported anywhere in src (animations are CSS keyframes plus a
  custom `useReducedMotion` hook).

Of the two that are actually used:
- lucide-react (icons, 32 across 21 files): low risk.
- tailwind-merge (the `cn()` helper, 48 call sites): low effort but HIGH importance,
  because v2 is incorrect against the Tailwind 4 we just shipped in Wave 3b. This is
  a correctness fix, not housekeeping, and is the real reason Wave 3c matters.

So the plan's assumed risk order (recharts charts first, then animations, then icons)
is inverted: recharts and framer-motion are no-ops for us; tailwind-merge is the one
to get right.

| Library | Current | Latest | Used in src? | Risk | Note |
| --- | --- | --- | --- | --- | --- |
| recharts | 2.15.0 | 3.8.1 | NO | none | dead dep; remove or trivially bump |
| framer-motion | 11.18.0 | 12.40.0 (renamed `motion`) | NO | none | dead dep; remove or trivially bump |
| lucide-react | 0.469.0 | 1.16.0 | YES (icons) | low | brand icons removed (we use none); verify via typecheck |
| tailwind-merge | 2.6.0 | 3.6.0 | YES (`cn`) | low effort, high importance | required for correct Tailwind 4 class merges |

(Versions from `npm view <pkg> version`. `npm view motion version` is also 12.40.0,
confirming the rename is versioned in lockstep.)

---

## 1. recharts (2.15.0 to 3.8.1) - UNUSED

- Usage: `grep -rIn "recharts" src` returns NOTHING. The only repository references
  are this audit's own docs (DEPENDENCY_BASELINE.md, DISCOVERY_FOR_PRODUCTION.md),
  `package.json:43`, and a `.next/` build artifact. No source file imports it; there
  are no `from 'recharts'`, `d3`, or `visx` imports. The widgets render charts with
  HTML canvas and hand-built SVG.
- Rename: none.
- v3 breaking changes (recharts v3.0.0 release): a substantial major (state
  management rewrite, about 915 commits, ~3,500 new tests). It removes
  `CategoricalChartState` access in event handlers and `Customized`, stops passing
  recharts state/props to `<Customized />`, and removes internal and deprecated
  props. Adds portals, multiple axes, accessibility improvements.
- Does it hit us? NO. Nothing imports recharts, so none of the breaking changes apply.
- Action: since it is unused, the cleanest move is to REMOVE it (dead dependency)
  rather than bump it. If kept for possible future use, a 2 to 3 bump is zero-risk
  because there is no chart code to migrate.

## 2. framer-motion (11.18.0 to 12.40.0, renamed to `motion`) - UNUSED

- Usage: `grep` for `from 'framer-motion' | 'motion' | 'motion/react'` and for
  `require(...)` / dynamic `import(...)` of either returns NOTHING in src. The
  word-hits for "motion" are all unrelated: the CSS string `prefers-reduced-motion`,
  the Tailwind variant `motion-reduce:` (`ui/Card.tsx`), and a project-local hook
  `useReducedMotion` defined in `src/hooks/useReducedMotion.ts` (uses
  `window.matchMedia('(prefers-reduced-motion: reduce)')`, imported from
  `@/hooks/useReducedMotion`, NOT from framer-motion). Animations are CSS keyframes
  (`home.css`, `globals.css`).
- Rename: CONFIRMED. Per the Motion upgrade guide, you "uninstall `framer-motion` and
  install `motion`" and "swap imports from `framer-motion` to `motion/react`". The
  npm `motion` package is at the same 12.40.0.
- v12 breaking changes: the guide states there are NO breaking changes in Motion for
  React in v12 (the v11 velocity / microtask-scheduling changes predate our 11.18.0).
- Does it hit us? NO. Nothing imports it.
- Action: same as recharts. Best to REMOVE it (dead dependency); the framer-motion to
  motion rename is pointless churn for a package we do not use. If kept, bump and
  rename trivially (zero-risk, since unused).

## 3. lucide-react (0.469.0 to 1.16.0) - USED (icons)

- Usage: imported in 21 files; 32 distinct icons (`grep` of the `lucide-react`
  imports): Activity, AlertTriangle, ArrowLeft, ArrowRight, ArrowUp, Baby, BookOpen,
  Check, ChevronDown, ChevronRight, Clock, ExternalLink, FileText, Globe, Globe2,
  Image (aliased as ImageIcon), Menu, Microscope, Moon, Pause, Play, Printer,
  RotateCcw, Search, Settings, Sparkles, Stethoscope, Sun, Users, Workflow, Wrench, X.
  These are all generic UI icons (named ESM imports like
  `import { Search, X } from 'lucide-react'`).
- v1 breaking changes (Lucide v1 guide + React migration guide):
  - BRAND icons removed (legal/trademark): the migration guide lists 13 removed brand
    icons (Chromium, Codepen, Codesandbox, Dribbble, Facebook, Figma, Framer, Github,
    Gitlab, Instagram, LinkedIn, Pocket, RailSymbol, Slack). NONE of our 32 icons is a
    brand icon, so this does NOT affect us.
  - Build format: the UMD build was dropped; only ESM and CJS remain (about a 32 pct
    size reduction). We import named icons in a Next.js/ESM context, so unaffected.
  - Accessibility default change: icons now set `aria-hidden="true"` by default. This
    is a real behavior change to watch: any icon that conveys meaning on its own
    (icon-only buttons without an `aria-label`) would now be hidden from screen
    readers. Most of our icons are decorative or sit in labelled controls, but this
    should be checked (and our Playwright axe sweep may surface a regression).
  - Some icons were renamed for consistency; the official guides do not show a table
    covering our specific icons, and none of ours appears among the documented
    changes (only the brand removals are enumerated).
- Does it hit us? LOW. No brand icons, ESM already. The icon-rename risk is bounded
  and DEFINITIVELY caught by the typecheck/build gate at execution: a renamed or
  removed icon becomes a TypeScript error ("Module 'lucide-react' has no exported
  member 'X'"). The less-common icons to watch if the build flags anything: Globe2,
  Workflow, Microscope, RotateCcw, Stethoscope, Baby, Sparkles. React 19 is supported.
- Action: bump 0.469.0 to 1.16.0; rely on typecheck/build to catch any icon rename;
  review the `aria-hidden` default for icon-only controls.

## 4. tailwind-merge (2.6.0 to 3.6.0) - USED (the `cn` helper), the one that matters

- Usage: `src/lib/utils.ts` defines `cn(...inputs) => twMerge(clsx(inputs))` (the only
  `tailwind-merge` import). `cn(` is called at 48 sites across the components. No
  custom configuration anywhere (no `extendTailwindMerge`, `createTailwindMerge`,
  custom prefix, or custom separator).
- v3 breaking changes (tailwind-merge v3.0.0 release): the release "drops support for
  Tailwind CSS v3 and in turn adds support for Tailwind CSS v4," and states v2 is
  incompatible with v4 classes. The 8 listed breaking changes are all about CUSTOM
  configuration: theme scale keys now match v4 theme variable namespaces, `isLength`
  split into `isNumber`/`isFraction`, config prefix handling and position changed,
  custom separators dropped, a new mandatory `orderSensitiveModifiers` for
  `createTailwindMerge`, and a `DefaultThemeGroupIds` type change. We use NONE of
  those, so for our plain `twMerge(clsx(...))` the public API is a drop-in.
- Does it hit us? YES, and it is the point of this wave (see coupling below). The
  migration EFFORT is low (no custom config to port), but the IMPACT is real: with
  Tailwind 4 already shipped (Wave 3b) and tailwind-merge still at 2.x, `cn()` is
  merging v4 classes with a v3-era ruleset and can produce wrong results.
- Action: bump 2.6.0 to 3.6.0. This is the highest-priority bump of the four.

---

## Coupling note: tailwind-merge 3 is REQUIRED for the Tailwind 4 we already shipped

This is not housekeeping. tailwind-merge has NO peer dependency on tailwindcss
(`npm view tailwind-merge peerDependencies` is empty); instead it hardcodes Tailwind's
class structure per major. v2 encodes Tailwind 3's utilities; v3 encodes Tailwind 4's.
The official v3 release says explicitly that it drops v3 support, adds v4 support, and
that v2 is incompatible with v4 classes.

We migrated to Tailwind 4 in Wave 3b (merged, `ed3e63a`) but left tailwind-merge at
2.6.0. So right now `cn()` can mis-merge: for v4-renamed or v4-new utilities,
tailwind-merge 2 may not recognize them as belonging to the same conflict group, so it
keeps BOTH instead of letting the last one win (or vice versa). Concretely, our codebase
now uses v4 forms like `rounded-xs`, `shadow-xs`, `backdrop-blur-xs`, and arbitrary
values, all funnelled through `cn()` at 48 sites; conflicts among these are exactly what
a Tailwind-3-era merger gets wrong. In short, Wave 3b created a latent correctness gap
that tailwind-merge 3 closes. Arguably this bump should have ridden with 3b; it is the
first thing to land in 3c.

---

## 5. Visual-regression risk map (where to look; no gate covers visual correctness)

Reframed by the usage findings. No automated gate (typecheck, lint, validate-content,
unit, build, the Playwright axe sweep) asserts pixel, chart, or animation fidelity.

1. tailwind-merge `cn()` output (TOP, and somewhat counterintuitive). Bumping to v3
   CHANGES merge results exactly where v2 was wrong on v4 classes. Review the 48
   `cn()` sites, especially components that compose conditional/competing utilities:
   `ui/Button.tsx`, `ui/Card.tsx`, `ui/Tabs.tsx`, `ui/Callout.tsx`, `ui/Panel.tsx`,
   `ui/StatusPill.tsx`, `ui/ModalityLabels.tsx`, and the widget readouts/pills. Look
   for rounding, shadow, spacing, or color classes that should override and now do (or
   that changed because v2 had been keeping a stale duplicate).
2. lucide-react icons (LOW): same glyphs, but check icon-only controls for the new
   `aria-hidden="true"` default (a11y, axe may catch it) and confirm the build did not
   flag any renamed icon.
3. recharts, framer-motion: NONE. Unused, so nothing renders differently.

The practical visual pass is small: it is really "check the shared UI primitives and a
sample of widgets render identically after the tailwind-merge bump," plus a glance at
icons. There are no chart or animation surfaces at risk.

---

## 6. Sequencing recommendation

The four are independent, and two are dead, so this does not need to be a single risky
PR. Recommended:

- PR 1 (the substantive one): tailwind-merge 2 to 3 PLUS lucide-react 0.469 to 1.16.
  Both are USED, both are low-effort, and both are fully gated (typecheck catches icon
  renames; build/e2e exercise the styles). tailwind-merge is the correctness fix and
  the reason to do this now; lucide is a cheap ride-along. Because tailwind-merge
  changes `cn()` output, this PR wants a short visual pass on the shared UI primitives
  (item 1 above), so it fits the manual-review posture if desired, though its blast
  radius is far smaller than the Tailwind 4 migration.
- PR 2 (housekeeping, owner's call): recharts and framer-motion. Since both are unused,
  the RECOMMENDATION is to REMOVE them (and the framer-motion to motion rename is
  pointless for a package we do not import) rather than bump. If the owner wants them
  kept installed for planned future charts/animations, bump them (recharts 3.8.1,
  motion 12.40.0) as a zero-risk no-op and confirm nothing imports them.

If the owner prefers fewer PRs, all four can go in one PR safely (no real churn for
us), but keep the tailwind-merge change conceptually separate in the description and
review, since it is the only one that can alter rendered output.

Priority within the wave: tailwind-merge first (correctness, already coupled to the
shipped Tailwind 4), then lucide-react, then the recharts/framer-motion remove-or-bump
decision.

---

## Appendix: commands run for this discovery (all read-only)

- Git: `git branch --show-current`, `git status -sb`, `git rev-parse HEAD`,
  `git rev-parse origin/main`, `git fetch origin main --dry-run`.
- Registry: `npm view {recharts,framer-motion,motion,lucide-react,tailwind-merge} version`,
  `npm view tailwind-merge peerDependencies dependencies`,
  `npm view framer-motion dist-tags deprecated`.
- Usage (src): grep for `recharts` (none), `from 'framer-motion'|'motion'|'motion/react'`
  and `require`/dynamic import of them (none); the framer-motion API words resolve to
  `prefers-reduced-motion` / `motion-reduce:` / the local `useReducedMotion` hook;
  `from 'lucide-react'` imports (21 files, 32 icons enumerated); `tailwind-merge` /
  `twMerge` (`src/lib/utils.ts`) and `cn(` call sites (48).
- Web (read-only fetch): the four official sources listed in the method section, plus a
  web search for the Lucide v1 migration.
