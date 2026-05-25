# Wave 3a Discovery: Next 16 / ESLint cluster (READ ONLY)

Phase 2, Wave 3, sub-wave 3a prep. This document is discovery only. Nothing was
installed, no branch was opened, no source or config file was changed. The one
write is this file.

- Date: 2026-05-24
- Git precondition (verified before discovery): on `main`, working tree clean,
  `HEAD == origin/main == 56ab47c`, in sync. Evidence: `git branch --show-current`
  (main), `git status -sb` (`## main...origin/main`, no ahead/behind),
  `git rev-parse HEAD` and `git rev-parse origin/main` (both 56ab47c),
  `git fetch origin main --dry-run` (no new refs).
- Method: every claim cites its source. `npm view ...` = read-only registry query.
  File citations use `path:line`. Web citations name the official Next.js doc and
  its stated version. The two Next.js docs fetched both report `version: 16.2.6`,
  `lastUpdated: 2026-05-19`:
  - Upgrade guide: https://nextjs.org/docs/app/guides/upgrading/version-16
  - MDX guide: https://nextjs.org/docs/app/guides/mdx

---

## 1. Versions and the coupling that blocked Wave 2

### Current vs latest

| Package | Current (package.json on main) | Latest | Source for latest |
| --- | --- | --- | --- |
| next | 15.5.18 | 16.2.6 | `npm view next version` |
| eslint-config-next | 15.1.6 | 16.2.6 | `npm view eslint-config-next version` |
| eslint | 9.39.4 | 10.4.0 | `npm view eslint version` |
| @typescript-eslint/* | not a direct dependency | n/a | absent from package.json; pulled transitively by eslint-config-next |

Note on dist-tags: `npm view next dist-tags` shows `latest: '16.2.6'` and
`backport: '15.5.18'`. Our current `next` (15.5.18) is the `backport` tag, i.e. a
maintenance release of the 15 line; the current stable is 16.2.6.

Note on @typescript-eslint: it is not in `package.json` (verified by reading the
file), so it is transitive. Under eslint-config-next 16 it arrives via the
`typescript-eslint` umbrella package at `^8.46.0`
(`npm view eslint-config-next dependencies` shows `'typescript-eslint': '^8.46.0'`,
`'@next/eslint-plugin-next': '16.2.6'`). This is the same v8 line that Wave 2
already ran (8.59.4) against TypeScript 6.0.3 with no warning, so TS 6 should
remain fine under eslint-config-next 16.

### The coupling that blocked eslint 10 in Wave 2: now unblocked

Wave 2 deferred eslint 10 because eslint-config-next 15.1.6 peer-required
`eslint ^7.23.0 || ^8.0.0 || ^9.0.0` (no `^10`). For 16.x:

- `npm view eslint-config-next peerDependencies` (latest = 16.2.6):
  `{ eslint: '>=9.0.0', typescript: '>=3.3.1' }`.
  - `eslint: '>=9.0.0'` ADMITS eslint 10.4.0. The Wave 2 blocker is gone.
  - `typescript: '>=3.3.1'` ADMITS typescript 6.0.3 (already on main).

So eslint-config-next 16 unblocks BOTH eslint 10 and the TS 6 we already shipped.
That is the whole reason this cluster (next 16 + eslint-config-next 16 + eslint 10)
is grouped together.

### Engine / peer fit against our toolchain

| Constraint | Value | Our value | Fit |
| --- | --- | --- | --- |
| next engines.node | `>=20.9.0` (`npm view next engines`) | Node 24 (`.nvmrc` = 24; package.json engines `>=24`) | OK |
| next peer react / react-dom | `^18.2.0 \|\| ... \|\| ^19.0.0` (`npm view next peerDependencies`) | react / react-dom 19.2.6 | OK |
| next peer @playwright/test | `^1.51.1` (same source) | 1.60.0 | OK |
| eslint engines.node | `^20.19.0 \|\| ^22.13.0 \|\| >=24` (`npm view eslint engines`) | Node 24 | OK |
| upgrade-guide min Node | `20.9.0` (Node 18 dropped) | Node 24 | OK |
| upgrade-guide min TypeScript | `5.1.0` | 6.0.3 | OK |
| upgrade-guide React baseline | App Router uses React 19.2 features | 19.2.6 | OK |

Conclusion for section 1: every version and peer constraint in the cluster is
satisfied by what is already on main. There is no version-level blocker. The risk
is entirely in behavior changes, covered next.

---

## 2. Next 16 breaking changes relevant to THIS project

Source for this section: the Next 16 upgrade guide and MDX guide named above,
cross-referenced against our `next.config.mjs` and `src/app` code.

### 2a. Per-option verdict for our `next.config.mjs`

Our config (read from `next.config.mjs:9-16` and `:18-25`):

| Option (next.config.mjs) | Next 16 status | Verdict for us |
| --- | --- | --- |
| `output: 'export'` (`:10`) | Not listed in the upgrade guide's Removals or breaking changes | Remains supported. BUT see 2b: must verify it works under the new default bundler (Turbopack). |
| `trailingSlash: true` (`:11`) | No change in the guide | Safe. |
| `images: { unoptimized: true }` (`:12`) | `unoptimized` itself not deprecated. Many image defaults changed (minimumCacheTTL 60s to 4h, imageSizes drops 16, qualities to [75], localPatterns.search, dangerouslyAllowLocalIP, maximumRedirects) | All N/A: with `output:'export'` + `unoptimized:true` the optimizer is off, so those optimizer defaults never apply. `images.domains` (deprecated) is not used. |
| `pageExtensions: ['ts','tsx','mdx']` (`:13`) | No change in the guide | Safe. |
| `reactStrictMode: true` (`:14`) | No change in the guide | Safe. |
| `experimental: { mdxRs: false }` (`:15`) | mdxRs is still labeled experimental and "not recommended for production" (MDX guide, "Using the Rust-based MDX compiler (experimental)") | See 2b. Interacts with the Turbopack default. |
| `createMDX({...})` with imported plugin functions (`:18-23`) | Turbopack (new default) cannot accept plugin function references | See 2b. This is the main risk. |

We have NO `eslint` key and NO explicit `webpack` key in `next.config.mjs`
(verified: `grep -nE "eslint:|webpack" next.config.mjs` returns nothing). So the
Next 16 removal of the `eslint` config option is N/A for the source file. However,
`createMDX(...)` injects a webpack loader internally when `mdxRs:false`; that
injected webpack config is what interacts with Turbopack (2b).

### 2b. The one big change for us: Turbopack is the default bundler

Per the upgrade guide ("Turbopack by default"): "Starting with Next.js 16,
Turbopack is stable and used by default with `next dev` and `next build`." And:
"If your project has a custom `webpack` configuration and you run `next build`
(which now uses Turbopack by default), the build will FAIL ... If you see failing
builds because a webpack configuration was found, but you don't define one
yourself, it is likely that a plugin is adding a webpack option."

`@next/mdx` with `mdxRs:false` is exactly such a plugin (it registers the
`@mdx-js/loader` webpack loader). And the MDX guide ("Using Plugins with
Turbopack") adds the decisive constraint: to use remark/rehype plugins with
Turbopack you must pass plugin names as STRINGS, because "remark and rehype
plugins without serializable options cannot be used yet with Turbopack, because
JavaScript functions can't be passed to Rust."

Our `next.config.mjs:1-6, 20-21` passes IMPORTED FUNCTIONS:
`remarkPlugins: [remarkMath, remarkGfm]`,
`rehypePlugins: [rehypeKatex, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]`.
That form is incompatible with the Turbopack MDX path.

Two viable paths (both are findings, not a chosen plan):

- Path A, keep Webpack: opt out per the guide with `next build --webpack` (and
  `next dev --webpack`). The current MDX config is kept verbatim. Lowest risk; it
  fully decouples the bundler migration from the version bump. The guide documents
  `--webpack` as a supported opt-out.
- Path B, adopt Turbopack: rewrite the plugin lists to string names, e.g.
  `remarkPlugins: ['remark-math','remark-gfm']`,
  `rehypePlugins: ['rehype-katex','rehype-slug',['rehype-autolink-headings',{ behavior: 'wrap' }]]`.
  All five plugins have package string names and our only options object
  (`{ behavior: 'wrap' }`) is serializable, so it is expressible. Higher risk: it
  runs MDX through a different compile path, so KaTeX math, heading slugs/anchors,
  and GFM output must be re-verified. `experimental.mdxRs` is still flagged
  experimental, so Path B should not lean on the Rust compiler for production.

### 2c. Static export under the new default bundler

`output:'export'` is not removed (2a). The open question is whether
`next build` under Turbopack (now default) produces the same `out/` static export
for this project. The guide does not flag an export+Turbopack incompatibility, but
this must be confirmed empirically in the execution wave. Path A (`--webpack`)
sidesteps any export+Turbopack gap entirely.

### 2d. `next lint` removed

Per the guide ("Removals -> `next lint` Command"): "The `next lint` command has
been removed. Use Biome or ESLint directly. `next build` no longer runs linting."
Our lint runs through `next lint` (`package.json:15` `"lint": "next lint"`), so
this requires the migration described in section 3. Also note `next build` no
longer lints, so lint must be its own CI step (it already is:
`.github/workflows/ci.yml` runs `npm run lint` as a discrete step).

### 2e. Breaking changes that are N/A for this project (with evidence)

- Async Request APIs (sync access removed for `params`, `searchParams`, `cookies`,
  `headers`, `draftMode`): ALREADY COMPLIANT. All three dynamic routes type params
  as Promises and await them:
  `src/app/foundations/[slug]/page.tsx:35-36,57-61`,
  `src/app/modalities/[slug]/page.tsx:23-24,37-42`,
  `src/app/integration/[scenario]/page.tsx:23-28,41-46`. No `searchParams` usage
  found. (Grep over `src/app/**/*.tsx`.)
- Async params for `opengraph-image`/`twitter-image`/`icon`/`apple-icon` and async
  `id` for `sitemap`: N/A. No such file conventions exist
  (`find src -name 'opengraph-image*' -o -name 'sitemap.*' ...` returns nothing).
  OG images are produced by the prebuild script `scripts/generate-og.mjs`, not the
  Next file convention.
- `middleware` to `proxy` rename: N/A. No `middleware.*` or `proxy.*` file
  (find returns nothing); static export cannot use middleware anyway.
- Parallel-route `default.js` requirement: N/A. No `@slot` directories under
  `src/app` (find returns nothing).
- Removed APIs `serverRuntimeConfig` / `publicRuntimeConfig`, `revalidateTag`
  second-arg change, AMP (`next/amp`, `useAmp`), `next/legacy/image`: N/A. None are
  imported anywhere in `src/` (grep returns none).
- Image optimizer default changes (2a): N/A due to `unoptimized:true` + export.
- Scroll-behavior override change: N/A. We set `scroll-behavior: auto !important`
  (`src/styles/globals.css:106`); the Next 16 change only matters to sites that set
  `scroll-behavior: smooth` and relied on Next forcing it to auto during nav.
- `next build` output drops `size` / `First Load JS` columns: cosmetic only; no
  code consumes those numbers (our human-readable reports cited them, nothing else).

### 2f. The official codemod and what it touches

`npx @next/codemod@canary upgrade latest` (upgrade guide, "Using the Codemod") can:
update `next.config` to the new `turbopack` config, migrate `next lint` to the
ESLint CLI, rename `middleware` to `proxy`, strip `unstable_` prefixes from
stabilized APIs, and remove `experimental_ppr` segment config. For us, only the
first two are potentially relevant; the rest target features we do not use (2e).
A separate, narrower codemod exists for the lint step alone:
`npx @next/codemod@canary next-lint-to-eslint-cli .` (guide, "`next lint` Command").

---

## 3. The lint migration shape (next lint -> ESLint CLI + flat config)

### Current state (read from files)

- `package.json:15`: `"lint": "next lint"`.
- `.eslintrc.json` (legacy eslintrc format), full contents:
  - `extends: ["next/core-web-vitals", "next/typescript"]`
  - `rules: { "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], "react/no-unescaped-entities": "off" }`
- No flat `eslint.config.*` exists at the repo root (glob found only `.eslintrc.json`).
- CI invokes lint via `npm run lint` (`.github/workflows/ci.yml`).

### What must change under eslint 10 + eslint-config-next 16

Two forcing functions: (a) `next lint` is removed (2d), so the script must call
ESLint directly; (b) eslint 10 drops legacy `.eslintrc` support and
`@next/eslint-plugin-next` now defaults to flat config (upgrade guide, "ESLint Flat
Config": "aligning with ESLint v10 which will drop legacy config support ... If
you're using the legacy `.eslintrc` format, consider migrating to the flat config
format"). So the eslintrc file must become a flat config.

Concretely, the migration is:

1. `package.json` script: `"lint": "next lint"` becomes an ESLint CLI invocation,
   e.g. `"lint": "eslint ."` (the `next-lint-to-eslint-cli` codemod writes this).
2. Delete `.eslintrc.json`.
3. Add a flat `eslint.config.mjs`. The documented bridge pattern keeps the same
   `extends` targets via FlatCompat, carrying the two custom rules verbatim:

   ```js
   // eslint.config.mjs (illustrative target shape, NOT applied here)
   import { dirname } from 'node:path';
   import { fileURLToPath } from 'node:url';
   import { FlatCompat } from '@eslint/eslintrc';

   const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

   export default [
     ...compat.extends('next/core-web-vitals', 'next/typescript'),
     {
       rules: {
         '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
         'react/no-unescaped-entities': 'off',
       },
     },
   ];
   ```

4. Likely add devDependency `@eslint/eslintrc` (provides `FlatCompat`, used by the
   generated flat config and by create-next-app's Next 16 template). If
   eslint-config-next 16 exposes a native flat export, FlatCompat may not be needed;
   the codemod emits whichever shape 16 supports. This must be confirmed against the
   installed 16.x at execution time.
5. CI needs no change: `npm run lint` still works because only the script body
   changed, not the script name.

Rule carry-over: yes. Both custom rules are plain rule entries and move unchanged
into the flat config's `rules` block. The `extends` of `next/core-web-vitals` and
`next/typescript` are preserved through FlatCompat (or the native flat equivalent).

Caveat to verify at execution: flat config changes how ignores and file globbing
work (no `.eslintignore`; ignores live in the config). Today there is no
`.eslintignore` to migrate (none found), so this is low impact, but the default
file set ESLint lints under flat config should be confirmed to match what
`next lint` covered (app, src, etc.).

---

## 4. Risk call

### What could break in OUR build/export when Next goes to 16

Ranked by likelihood/impact for this specific project:

1. HIGH: MDX compile under Turbopack default. Our remark/rehype plugins are passed
   as function imports (`next.config.mjs:20-21`), which Turbopack cannot serialize
   (2b). On a default `next build`, this surfaces either as a "webpack configuration
   was found" build failure (the injected `@mdx-js/loader` webpack config) or as
   plugins silently not applying. Mitigations: `--webpack` (keep current config) or
   string-named plugins (Turbopack path, needs re-verification of KaTeX/anchors/GFM).
2. MEDIUM: Static export under Turbopack. `output:'export'` is not removed, but the
   export path under the new default bundler must be proven for this project (2c).
   `--webpack` removes this risk.
3. LOW to MEDIUM: Lint migration correctness. A malformed flat config, a missing
   `@eslint/eslintrc` dep, or a changed default lint file set could make lint error
   out or silently lint fewer files (section 3).
4. LOW: Transitive churn. Bumping next + eslint-config-next + eslint will move many
   transitives (as in Wave 2). Out-of-scope direct deps are exact-pinned and cannot
   drift, but the lockfile diff will be large.
5. NONE expected (already handled, 2e): async params, image optimizer defaults,
   middleware, parallel routes, removed runtime APIs, AMP, legacy image,
   scroll-behavior.

### Gate coverage: what the suite catches vs does not

| Gate | Catches for this migration | Does NOT catch |
| --- | --- | --- |
| typecheck (`tsc --noEmit`) | TS errors from any edited TS (e.g. a bad flat-config `.ts`, type fallout) | Bundler/MDX compile behavior; runtime; export output |
| lint | After migration: that the flat config loads and rules run; rule violations | Whether the lint file set still matches old coverage; build/runtime |
| validate-content (`scripts/validate-content.mjs`) | MDX reference keys, links, widgets, routes integrity (parses content) | It does NOT compile MDX through Next/Turbopack, so it will not catch Turbopack-vs-webpack rendering differences (math, anchors, GFM) |
| unit (vitest 4) | Component/lib logic. Runs on vitest's own vite pipeline, NOT Next's bundler | Anything specific to Next 16's build/export or MDX compile path |
| build (`next build`, static export) | THE key gate: Turbopack-vs-webpack MDX failure, export failure, removed/renamed config errors, async-params type/runtime errors. Most Next 16 problems surface here | Subtle correct-but-different MDX rendering that still builds; dev-only behavior |
| e2e (Playwright + axe) | Built `out/` rendering and a11y on the sampled routes; broken routes, runtime errors, missing content on tested pages | Content correctness across ALL 54 MDX pages: the a11y sweep covers ~12 routes, so MDX rendering regressions on untested pages can slip through |

Coverage gap worth noting: no gate fully proves MDX content parity across all 54
pages between the webpack JS loader and a Turbopack compile. If Path B (Turbopack)
is ever taken, that parity needs either expanded e2e/snapshot coverage or a manual
visual pass; `build` + the current e2e sample alone will not guarantee it. Path A
(`--webpack`) keeps the exact compile path we ship today, so it does not introduce
this gap.

### Sequencing consideration (for the owner, not a proposal acted on here)

The version bump (next 16 + eslint-config-next 16 + eslint 10) and the bundler
decision (stay on Webpack via `--webpack`, or move to Turbopack with string
plugins) are separable. Landing the bump on `--webpack` first keeps the proven MDX
compile path and isolates the Turbopack migration as its own later, separately
verified step. The lint migration (section 3) is mechanical and can ride with the
version bump since eslint-config-next 16 is what makes eslint 10 installable.

---

## Appendix: commands run for this discovery (all read-only)

- Git state: `git branch --show-current`, `git status -sb`, `git rev-parse HEAD`,
  `git rev-parse origin/main`, `git fetch origin main --dry-run`.
- Registry: `npm view next version|dist-tags|engines|peerDependencies`,
  `npm view eslint-config-next version|peerDependencies|dependencies`,
  `npm view eslint version|engines`.
- Files read: `next.config.mjs`, `.eslintrc.json`, `package.json`, `.nvmrc`,
  `src/styles/globals.css` (scroll-behavior), the three dynamic-route
  `page.tsx` files.
- Searches: grep for `params`/`searchParams`/`generateStaticParams` in
  `src/app/**/*.tsx`; find for `opengraph-image*`/`sitemap.*`/`icon.*`/
  `middleware.*`/`proxy.*` and `@*` slot dirs; grep for removed-API imports in
  `src/`; glob for root config files.
- Web (read-only fetch): Next 16 upgrade guide and Next MDX guide (URLs and version
  16.2.6 cited above).
