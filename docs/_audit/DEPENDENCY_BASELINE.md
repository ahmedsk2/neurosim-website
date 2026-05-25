# DEPENDENCY_BASELINE: Phase 2 re-baseline (read-only)

Live dependency state for `docs/MNM_PRODUCTION_PLAN_v1.md` Section 5 (Phase 2). This run installed
nothing, fixed nothing, and modified no file except this report. Every claim cites the command that
produced it.

- **Run date:** 2026-05-24
- **Scope:** `C:\Users\ahmed\Documents\Neurosim website`
- **Git state (command: `git status -sb`, `git rev-parse --short HEAD`/`origin/main`):** on branch
  `main`, working tree clean, `HEAD == origin/main == b941d3e` (in sync; Phase 1 merged via PR #1).
- **Commands used:** `npm outdated`, `npm audit`, `npm audit --json` (parsed with PowerShell
  `ConvertFrom-Json`), and reads of `package.json`, `.github/workflows/ci.yml`, `postcss.config.mjs`,
  `tailwind.config.ts`.
- **Node/npm:** `node v24.15.0`, `npm 11.12.1` (recorded in Phase 0).

---

## 1. Declared versions (command: read `package.json`)

**dependencies (28)**

| Package | Pinned | Package | Pinned |
|---|---|---|---|
| @mdx-js/loader | 3.1.0 | next | 15.1.6 |
| @mdx-js/react | 3.1.0 | next-mdx-remote | 5.0.0 |
| @next/mdx | 15.1.6 | react | 19.0.0 |
| @radix-ui/react-dialog | 1.1.4 | react-dom | 19.0.0 |
| @radix-ui/react-popover | 1.1.4 | recharts | 2.15.0 |
| @radix-ui/react-tabs | 1.1.2 | rehype-autolink-headings | 7.1.0 |
| @radix-ui/react-toggle-group | 1.1.1 | rehype-katex | 7.0.0 |
| @radix-ui/react-tooltip | 1.1.6 | rehype-slug | 6.0.0 |
| clsx | 2.1.1 | remark-gfm | 4.0.0 |
| framer-motion | 11.18.0 | remark-math | 6.0.0 |
| fuse.js | 7.0.0 | simplex-noise | ^4.0.3 |
| gray-matter | 4.0.3 | tailwind-merge | 2.6.0 |
| katex | 0.16.11 | three | ^0.184.0 |
| lucide-react | 0.469.0 | mermaid | ^11.14.0 |

**devDependencies (19)**

| Package | Pinned | Package | Pinned |
|---|---|---|---|
| @axe-core/playwright | 4.10.1 | eslint-config-next | 15.1.6 |
| @playwright/test | 1.49.1 | jsdom | 25.0.1 |
| @testing-library/jest-dom | 6.6.3 | postcss | 8.5.1 |
| @testing-library/react | 16.1.0 | prettier | 3.4.2 |
| @types/node | 22.10.5 | serve | ^14.2.6 |
| @types/react | 19.0.4 | tailwindcss | 3.4.17 |
| @types/react-dom | 19.0.2 | typescript | 5.7.2 |
| @types/three | ^0.184.1 | vitest | 2.1.8 |
| @vitejs/plugin-react | 4.3.4 | | |
| autoprefixer | 10.4.20 | eslint | 9.18.0 |

**Pinning note:** almost every entry is an exact pin (no caret). Only `mermaid ^11.14.0`,
`three ^0.184.0`, `simplex-noise ^4.0.3`, `@types/three ^0.184.1`, and `serve ^14.2.6` carry a range.
This matters for Wave 1: `npm update` (within ranges) can move only those caret packages; every other
bump (including the low-risk patch/minor ones) requires editing the pin.

---

## 2. npm outdated (command: `npm outdated`)

Full table, 38 packages. "Type" is from `package.json` (Section 1). "Gap" is semver distance
current to latest.

| Package | Current | Wanted | Latest | Type | Gap |
|---|---|---|---|---|---|
| @axe-core/playwright | 4.10.1 | 4.10.1 | 4.11.3 | dev | minor |
| @mdx-js/loader | 3.1.0 | 3.1.0 | 3.1.1 | dep | patch |
| @mdx-js/react | 3.1.0 | 3.1.0 | 3.1.1 | dep | patch |
| @next/mdx | 15.1.6 | 15.1.6 | 16.2.6 | dep | major |
| @playwright/test | 1.49.1 | 1.49.1 | 1.60.0 | dev | minor |
| @radix-ui/react-dialog | 1.1.4 | 1.1.4 | 1.1.15 | dep | patch |
| @radix-ui/react-popover | 1.1.4 | 1.1.4 | 1.1.15 | dep | patch |
| @radix-ui/react-tabs | 1.1.2 | 1.1.2 | 1.1.13 | dep | patch |
| @radix-ui/react-toggle-group | 1.1.1 | 1.1.1 | 1.1.11 | dep | patch |
| @radix-ui/react-tooltip | 1.1.6 | 1.1.6 | 1.2.8 | dep | minor |
| @testing-library/jest-dom | 6.6.3 | 6.6.3 | 6.9.1 | dev | minor |
| @testing-library/react | 16.1.0 | 16.1.0 | 16.3.2 | dev | minor |
| @types/node | 22.10.5 | 22.10.5 | 25.9.1 | dev | major |
| @types/react | 19.0.4 | 19.0.4 | 19.2.15 | dev | minor |
| @types/react-dom | 19.0.2 | 19.0.2 | 19.2.3 | dev | minor |
| @vitejs/plugin-react | 4.3.4 | 4.3.4 | 6.0.2 | dev | major |
| autoprefixer | 10.4.20 | 10.4.20 | 10.5.0 | dev | minor |
| eslint | 9.18.0 | 9.18.0 | 10.4.0 | dev | major |
| eslint-config-next | 15.1.6 | 15.1.6 | 16.2.6 | dev | major |
| framer-motion | 11.18.0 | 11.18.0 | 12.40.0 | dep | major |
| fuse.js | 7.0.0 | 7.0.0 | 7.3.0 | dep | minor |
| jsdom | 25.0.1 | 25.0.1 | 29.1.1 | dev | major |
| katex | 0.16.11 | 0.16.11 | 0.17.0 | dep | minor (0.x) |
| lucide-react | 0.469.0 | 0.469.0 | 1.16.0 | dep | major |
| mermaid | 11.14.0 | 11.15.0 | 11.15.0 | dep | minor (in range) |
| next | 15.1.6 | 15.1.6 | 16.2.6 | dep | major |
| next-mdx-remote | 5.0.0 | 5.0.0 | 6.0.0 | dep | major |
| postcss | 8.5.1 | 8.5.1 | 8.5.15 | dev | patch |
| prettier | 3.4.2 | 3.4.2 | 3.8.3 | dev | minor |
| react | 19.0.0 | 19.0.0 | 19.2.6 | dep | minor |
| react-dom | 19.0.0 | 19.0.0 | 19.2.6 | dep | minor |
| recharts | 2.15.0 | 2.15.0 | 3.8.1 | dep | major |
| rehype-katex | 7.0.0 | 7.0.0 | 7.0.1 | dep | patch |
| remark-gfm | 4.0.0 | 4.0.0 | 4.0.1 | dep | patch |
| tailwind-merge | 2.6.0 | 2.6.0 | 3.6.0 | dep | major |
| tailwindcss | 3.4.17 | 3.4.17 | 4.3.0 | dev | major |
| typescript | 5.7.2 | 5.7.2 | 6.0.3 | dev | major |
| vitest | 2.1.8 | 2.1.8 | 4.1.7 | dev | major |

**Not listed by `npm outdated` (already current / at latest in range):** clsx, gray-matter,
remark-math, rehype-slug, rehype-autolink-headings, simplex-noise, three (deps); @types/three, serve
(dev). `mermaid` is the only caret dep with a pending in-range bump (wanted 11.15.0).

---

## 3. npm audit (commands: `npm audit`, `npm audit --json`)

**Totals (from `npm audit --json` metadata):** 15 vulnerabilities = 2 low, 8 moderate, 3 high,
2 critical. 0 info.

"Path": where the package runs relative to the shipped product. The site is a static export
(`output: 'export'`), so there is no runtime Node server, no middleware, and no runtime image
optimizer in production; "render/build" means it runs at build time or its output is shipped HTML/CSS;
"dev/test" means tooling that is never shipped.

| Package | Severity | Direct? | Path | Fix npm proposes |
|---|---|---|---|---|
| next | critical | yes | framework / build (most advisories are dev-server / middleware / image-optimizer / SSR runtime features NOT shipped by a static export) | force to next@15.5.18 (non-major, within 15.x) |
| vitest | critical | yes | dev/test only | force to vitest@2.1.9 (non-major, within 2.1.x) |
| next-mdx-remote | high | yes | render (MDX content rendering) | force to next-mdx-remote@6.0.0 (MAJOR, breaking) |
| @playwright/test | high | yes | dev/test only (e2e) | force to @playwright/test@1.60.0 (non-major, within 1.x) |
| playwright | high | no | dev/test only | resolved by @playwright/test@1.60.0 |
| esbuild | moderate | no | dev/test only (vitest stack) | force to vitest@2.1.9 (non-major) |
| @vitest/mocker | moderate | no | dev/test only | force to vitest@2.1.9 (non-major) |
| vite | moderate | no | dev/test only | force to vitest@2.1.9 (non-major) |
| vite-node | moderate | no | dev/test only | force to vitest@2.1.9 (non-major) |
| katex | moderate | yes | render (math in content) | force to katex@0.16.47 (non-major, within 0.16.x) |
| mermaid | moderate | yes | render (diagrams in content) | in-range via `npm audit fix` (to 11.15.0) |
| postcss | moderate | yes | build (CSS processing) | force to next@15.5.18 for next's bundled copy; the direct devDep is fixable with an in-range 8.5.x patch |
| ws | moderate | no | dev/test only | in-range via `npm audit fix` |
| eslint | low | yes | dev/test only (lint) | force to eslint@9.39.4 (non-major, within 9.x) |
| @eslint/plugin-kit | low | no | dev/test only | resolved by eslint@9.39.4 (non-major) |

**Advisory titles by package (command: `npm audit`):**
- **next (critical):** 24 advisories, including dev-server information exposure (critical), RCE in the
  React flight protocol (RSC), cache poisoning / cache-key confusion, SSRF via middleware and
  WebSocket upgrades, content injection and DoS in the image optimizer, XSS in App Router with CSP
  nonces and in beforeInteractive scripts, HTTP request smuggling in rewrites, and authorization
  bypass in middleware. The majority target the dev server, middleware, and the runtime image
  optimizer, none of which a static export ships; the React-flight-protocol RCE and build-time items
  are the ones that touch this project.
- **vitest (critical):** rolls up the dev-server advisories in its `@vitest/mocker` / `vite` /
  `esbuild` / `vite-node` chain (esbuild dev server can be reached by any website). Dev/test only.
- **next-mdx-remote (high):** arbitrary code execution in React server-side rendering of UNTRUSTED MDX
  content. This site renders only first-party authored MDX, so practical exploitability is low, but it
  is the highest-severity package in the render path. See Section 6 flag.
- **@playwright/test / playwright (high):** downloads browsers without verifying the SSL certificate.
  Dev/test only.
- **katex (moderate):** `\htmlData` does not validate attribute names. Render path.
- **mermaid (moderate):** Gantt-chart infinite-loop DoS, CSS injection via `classDefs` and via config,
  HTML injection via `classDef` in state diagrams. Render path. In-range fix.
- **postcss (moderate):** XSS via unescaped `</style>` in CSS stringify output. Build path.
- **ws (moderate):** uninitialized memory disclosure. Dev/test only. In-range fix.
- **eslint / @eslint/plugin-kit (low):** ReDoS in `ConfigCommentParser`. Dev/test only.

**Fix summary:** of the 15, only **`next-mdx-remote` requires a breaking major (5 to 6)**. Two fixes
are fully in-range (`npm audit fix`): mermaid and ws. The remaining fixes are non-major but land
outside the current exact pins (next 15.5.18, vitest 2.1.9, @playwright/test 1.60.0, katex 0.16.47,
eslint 9.39.4, postcss 8.5.x), so they need explicit pin bumps rather than a plain `npm update`.
`npm audit fix` was NOT run.

---

## 4. Plan-flagged packages: current to latest and gap (command: `npm outdated`)

| Package | Current | Latest | Gap | Note |
|---|---|---|---|---|
| next | 15.1.6 | 16.2.6 | major | security fix needs only a 15.x minor (15.5.18), not the 16 major |
| react | 19.0.0 | 19.2.6 | minor | current generation |
| react-dom | 19.0.0 | 19.2.6 | minor | current generation |
| tailwindcss | 3.4.17 | 4.3.0 | major | see migration status below |
| @next/mdx | 15.1.6 | 16.2.6 | major | MDX pipeline |
| next-mdx-remote | 5.0.0 | 6.0.0 | major | MDX pipeline; also the render-path HIGH advisory |
| remark-gfm | 4.0.0 | 4.0.1 | patch | |
| remark-math | 6.0.0 | 6.0.0 | none | not flagged by npm outdated |
| rehype-katex | 7.0.0 | 7.0.1 | patch | |
| rehype-slug | 6.0.0 | 6.0.0 | none | not flagged |
| rehype-autolink-headings | 7.1.0 | 7.1.0 | none | not flagged |
| katex | 0.16.11 | 0.17.0 | minor (0.x) | security fix is 0.16.47 (within 0.16.x) |
| mermaid | 11.14.0 | 11.15.0 | minor (in range) | security fix is in-range |
| three | ^0.184.0 (installed 0.184.x) | n/a | none | not flagged by npm outdated; no pending bump today |
| simplex-noise | ^4.0.3 (installed 4.0.x) | n/a | none | not flagged; no pending bump today |
| typescript | 5.7.2 | 6.0.3 | major | |
| vitest | 2.1.8 | 4.1.7 | major | skips a major (2 to 4); security fix only needs 2.1.9 |
| @playwright/test | 1.49.1 | 1.60.0 | minor | clears the HIGH advisory |
| playwright | transitive of @playwright/test | n/a | n/a | advisory is `<1.55.1`; resolved by @playwright/test 1.60.0 |
| eslint | 9.18.0 | 10.4.0 | major | security fix only needs 9.x (9.39.4) |
| eslint-config-next | 15.1.6 | 16.2.6 | major | tracks Next major; bump alongside Next |
| serve | ^14.2.6 (installed 14.2.x) | none | none | not flagged; current |

**Tailwind v4 migration status (commands: read `postcss.config.mjs`, `tailwind.config.ts`,
`package.json`):** NO v4 migration has started. `@tailwindcss/postcss` is NOT present in
`package.json`. `postcss.config.mjs` still uses the v3 plugin form (`plugins: { tailwindcss: {},
autoprefixer: {} }`). `tailwind.config.ts` is a v3 TypeScript config (`theme.extend` mapping to
`var(--*)` tokens; no `@theme` / CSS-first config). So Tailwind 3 to 4 is a pending, not-yet-begun
migration.

---

## 5. CI action versions (command: read `.github/workflows/ci.yml`)

- `actions/checkout@v4` (line 23) and `actions/setup-node@v4` (line 26). No other actions are used.
- Both v4 majors run on the GitHub Actions **Node 20** runtime. GitHub is deprecating the Node 20
  action runtime in favor of Node 24, so these v4 actions emit a Node-20 deprecation warning in
  current runs. The next major of each action (the v5 line) moves to Node 24.
- **Wave 1 action bump:** raise `actions/checkout` and `actions/setup-node` from v4 to their current
  latest major (the Node-24 / v5 line) to clear the deprecation warning. Verify the exact latest tag
  at execution time, since action releases postdate this baseline.

---

## 6. Grouping into the plan's four waves (synthesis of Sections 2, 3, 5 and plan Section 5)

Mechanic to keep in mind (from Section 1): the project exact-pins almost everything, so a "patch/minor"
Wave 1 bump still means editing the pin for most packages; only `mermaid` and `ws` are resolved purely
in-range by `npm update` / `npm audit fix`.

### Wave 1: security + patch + minor (low risk) + CI actions
- **Security, in-range (`npm audit fix`):** mermaid (to 11.15.0, clears 4 advisories), ws.
- **Security, non-major (pin bump, same major, low risk):** next (to 15.5.18, clears the critical and
  most others), vitest (to 2.1.9, clears the critical dev/test chain), @playwright/test (to 1.60.0,
  clears the HIGH), katex (to 0.16.47), eslint (to 9.39.4, clears the low), postcss direct devDep
  (to 8.5.x).
- **Non-security patch:** @mdx-js/loader, @mdx-js/react, @radix-ui/react-dialog,
  @radix-ui/react-popover, @radix-ui/react-tabs, @radix-ui/react-toggle-group, rehype-katex,
  remark-gfm.
- **Non-security minor:** @axe-core/playwright, @radix-ui/react-tooltip, @testing-library/jest-dom,
  @testing-library/react, @types/react, @types/react-dom, autoprefixer, fuse.js, prettier, react,
  react-dom.
- **CI:** bump actions/checkout and actions/setup-node v4 to the latest major (Section 5).
- **Overlap calls (your decision):** react and react-dom minors are listed by the plan under Wave 3
  (Next/React), but they are low-risk minors and could land in Wave 1. next 15.5.18, katex 0.16.47,
  and mermaid 11.15.0 are framework/MDX packages (Waves 3/4) but their fixes are security and low-risk;
  pulling them into Wave 1 clears nearly every advisory early and leaves only one outstanding
  (next-mdx-remote, Wave 4). Recommendation: take every in-range/non-major SECURITY fix in Wave 1.

### Wave 2: toolchain majors
Original plan list: typescript (5 to 6), vitest (2 to 4; the security fix only needed 2.1.9, the 4.x is
the toolchain upgrade), @playwright/test (1.49 to 1.60, a minor), eslint (9 to 10),
@vitejs/plugin-react (4 to 6), jsdom (25 to 29), with @types/node (22 to 25) folded in.

**Executed (landed, merged to main):** typescript 6.0.3, vitest 4.1.7, @vitejs/plugin-react 6.0.2,
jsdom 29.1.1, @types/node 25.9.1. All six local gates green; CI green. @playwright/test 1.60.0 had
already landed in Wave 1. vitest 4 needed no config migration (the existing vitest.config.ts shape is
still valid in v4). vite resolved to 8.0.14, shared (deduped) by @vitejs/plugin-react 6 and vitest 4;
the vitest 4 bump also cleared the 5 dev/test vite-chain advisories (vitest, vite, vite-node, esbuild,
@vitest/mocker), moving the audit from 8 vulnerabilities to 3 (the remaining 3 are out-of-scope:
next, postcss, next-mdx-remote).

**typescript 6 KEPT:** the secondary coupling (eslint-config-next 15.1.6 drives @typescript-eslint v8)
produced no failure and not even an "unsupported version" warning; typecheck and lint both pass. TS 6
did require one new ambient declaration (globals.d.ts: `declare module '*.css';`) because TS 6 raises
TS2882 on side-effect imports of untyped CSS assets that TS 5 allowed silently. That is the idiomatic
fix and loosens no strictness (strict / noUncheckedIndexedAccess etc. unchanged).

**eslint 10 DEFERRED to Wave 3:** the pinned eslint-config-next 15.1.6 declares peer
`eslint ^7.23.0 || ^8.0.0 || ^9.0.0` (no ^10), so eslint 10 cannot land without bumping
eslint-config-next, which is out of Wave 2 scope. Moved to Wave 3 to ride with eslint-config-next 16
(and Next 16), per the rule not to bump eslint-config-next standalone.

- **Coupling flag:** eslint-config-next (15 to 16) is a "lint config" but its major tracks Next's
  major; bump it WITH Next 16 in Wave 3, not standalone. @types/node (22 to 25) is a dev-types major,
  low runtime risk; landed in Wave 2 as planned.

### Wave 3: framework / runtime majors (highest risk, each its own PR)
Split into sub-waves. Wave 3a is EXECUTED and merged; 3b and 3c remain.

**Wave 3a (next 16 + eslint cluster): EXECUTED.** next 15.5.18 to 16.2.6, eslint-config-next 15.1.6 to
16.2.6, eslint 9.39.4 to 10.4.0, plus @eslint/eslintrc 3.3.5 (devDep). eslint-config-next 16's peer
(`eslint >=9.0.0`, `typescript >=3.3.1`) admits both eslint 10 and our TS 6, which is why this cluster
landed together (eslint 10 was deferred here from Wave 2 for exactly that reason). Decisions and findings
(grounded in docs/_audit/WAVE3A_DISCOVERY.md):
- BUILD STAYS ON WEBPACK (Path A). Next 16 defaults builds to Turbopack, which cannot take our
  function-form @next/mdx remark/rehype plugins, and no gate proves MDX parity across all 54 pages
  between the webpack and Turbopack compile paths. The build / dev / analyze scripts use `--webpack` to
  preserve the exact current MDX compilation (KaTeX, anchors, GFM). Turbopack adoption is a separate
  future project, explicitly OUT OF SCOPE. @next/mdx therefore stays at 15.1.6 (its webpack loader is
  unchanged; @next/mdx 16 remains Wave 4).
- LINT MIGRATED TO FLAT CONFIG. eslint 10 drops legacy .eslintrc, so .eslintrc.json was replaced by
  eslint.config.mjs using eslint-config-next 16's native flat exports (eslint-config-next/core-web-vitals
  and /typescript; no FlatCompat needed). The two custom rules carried over verbatim and the 11 baseline
  warnings reproduce exactly. The lint script is `eslint src` (matches next lint's old coverage: root has
  no app/pages/components/lib dirs, so src is the full source set). One required setting: a pinned
  settings.react.version, because eslint-plugin-react 7.37.5 calls the removed context.getFilename()
  under eslint 10 when the version is 'detect'.
- REACT-HOOKS v7 BACKLOG. eslint-config-next 16 ships eslint-plugin-react-hooks v7, whose new rules of
  React (immutability, purity, set-state-in-effect, static-components) error on 18 pre-existing patterns
  across 14 widget/lib files, plus 5 now-stale exhaustive-deps disable directives. These are DEMOTED TO
  WARNINGS (not off, not error) so they surface as a tracked backlog without failing the gate. Fixing the
  flagged code is deferred to a dedicated react-hooks-fixes PR (see docs/_audit/OPEN_QUESTIONS.md); it is
  application-logic work and must not ride in a dependency PR.
- AUTO-EDITED FILES KEPT. Next 16's build rewrote tsconfig.json (jsx preserve to react-jsx, added
  .next/dev/types to include) and next-env.d.ts (routes reference became an import). Kept, since Next
  manages these tracked files and reverting churns them on every build.
- AUDIT UNCHANGED (3 to 3). next 16.2.6 bundles postcss 8.4.31 (< 8.5.10), so the `next` (via postcss)
  and `postcss` moderates persist; our direct postcss devDep is already 8.5.15 (safe). Clearing them
  needs an npm `overrides` forcing next's postcss to >=8.5.10, out of scope here. next-mdx-remote (HIGH)
  remains for Wave 4. All gates green (build via --webpack exported all routes).

**Wave 3b (remaining): tailwindcss (3 to 4)** a real migration (CSS-first `@theme`, breaking utilities).
Its own PR, visual regression review, rollback plan. react / react-dom are only minors (19.0 to 19.2).
- three / simplex-noise: no pending bump today, but the plan flags them for hero-specific testing on
  any future bump.
- **UI/library majors the plan did not name (place here or in a dedicated UI-majors PR):** framer-motion
  (11 to 12), recharts (2 to 3), lucide-react (0.469 to 1.16), tailwind-merge (2 to 3). Each needs its
  own migration review.

### Wave 4: content / MDX pipeline
- @next/mdx (15 to 16, major), next-mdx-remote (5 to 6, major; also the render-path HIGH advisory),
  remark-gfm (patch), rehype-katex (patch), katex (security, see Wave 1 overlap), mermaid (security,
  see Wave 1 overlap). Re-render a sample of every content kind and diff; math (KaTeX) and Mermaid are
  the fragile points.

### Render-path advisory to prioritize (your explicit ask)
- **`next-mdx-remote` (HIGH, render path)** is the advisory to flag. Resolving it requires a
  **breaking major (5 to 6)**, which lives in Wave 4. Caveat: the vulnerability is RCE when rendering
  UNTRUSTED MDX; this site renders only first-party authored MDX, so practical exploitability is low.
  It is the only advisory that needs a breaking change.
- Other render/build-path advisories are lower-cost: mermaid (moderate, in-range now), katex (moderate,
  non-major 0.16.x), next (critical rating but its shipped-surface exposure is limited by static
  export; fix is a non-major 15.x bump). postcss (moderate, build) is non-major / in-range.

---

*End of baseline. Read-only: nothing was installed, fixed, or modified except this file. No changes
proposed beyond the wave grouping above; the owner directs the waves.*
