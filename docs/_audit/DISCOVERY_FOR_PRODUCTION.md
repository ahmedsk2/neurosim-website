# DISCOVERY_FOR_PRODUCTION — read-only pass for the production plan

Read-only discovery run to support `docs/MNM_PRODUCTION_PLAN_v1.md` (Section 14). It gathers the four
repo facts the plan needs before per-phase execution specs can be written, plus a structure confirm.
Every claim cites the file or command that proves it. **Nothing was modified, installed, or built.**
The only file written is this report.

- **Run date:** 2026-05-24
- **Scope:** `C:\Users\ahmed\Documents\neurosim website`
- **Method:** `node -e` reads of `package.json`, read-only `npm outdated` / `npm audit` (registry
  network was available), `grep`/`find`/`ls`, and inspection of the existing `out/` build.
- **Companion:** counts and structure cross-checked against `docs/_audit/CURRENT_STATE.md`.

---

## 1. Dependencies

### 1.1 Exact declared versions (`package.json`)

**dependencies**

| Package | Declared | Package | Declared |
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
| lucide-react | 0.469.0 | | |
| mermaid | ^11.14.0 | | |

**devDependencies**

| Package | Declared | Package | Declared |
|---|---|---|---|
| @axe-core/playwright | 4.10.1 | eslint-config-next | 15.1.6 |
| @playwright/test | 1.49.1 | jsdom | 25.0.1 |
| @testing-library/jest-dom | 6.6.3 | postcss | 8.5.1 |
| @testing-library/react | 16.1.0 | prettier | 3.4.2 |
| @types/node | 22.10.5 | tailwindcss | 3.4.17 |
| @types/react | 19.0.4 | typescript | 5.7.2 |
| @types/react-dom | 19.0.2 | vitest | 2.1.8 |
| @vitejs/plugin-react | 4.3.4 | | |
| autoprefixer | 10.4.20 | | |
| eslint | 9.18.0 | | |

`node_modules/` present (655 entries). `package-lock.json` present (13,836 lines), committed and
authoritative.

### 1.2 `npm outdated` (current / wanted / latest)

Full table (command: `npm outdated`):

| Package | Current | Wanted | Latest | Jump |
|---|---|---|---|---|
| @axe-core/playwright | 4.10.1 | 4.10.1 | 4.11.3 | minor |
| @mdx-js/loader | 3.1.0 | 3.1.0 | 3.1.1 | patch |
| @mdx-js/react | 3.1.0 | 3.1.0 | 3.1.1 | patch |
| @next/mdx | 15.1.6 | 15.1.6 | **16.2.6** | **major** |
| @playwright/test | 1.49.1 | 1.49.1 | 1.60.0 | minor |
| @radix-ui/react-dialog | 1.1.4 | 1.1.4 | 1.1.15 | patch/minor |
| @radix-ui/react-popover | 1.1.4 | 1.1.4 | 1.1.15 | patch/minor |
| @radix-ui/react-tabs | 1.1.2 | 1.1.2 | 1.1.13 | patch/minor |
| @radix-ui/react-toggle-group | 1.1.1 | 1.1.1 | 1.1.11 | patch/minor |
| @radix-ui/react-tooltip | 1.1.6 | 1.1.6 | 1.2.8 | minor |
| @testing-library/jest-dom | 6.6.3 | 6.6.3 | 6.9.1 | minor |
| @testing-library/react | 16.1.0 | 16.1.0 | 16.3.2 | minor |
| @types/node | 22.10.5 | 22.10.5 | **25.9.1** | **major** |
| @types/react | 19.0.4 | 19.0.4 | 19.2.15 | minor |
| @types/react-dom | 19.0.2 | 19.0.2 | 19.2.3 | minor |
| @vitejs/plugin-react | 4.3.4 | 4.3.4 | **6.0.2** | **major** |
| autoprefixer | 10.4.20 | 10.4.20 | 10.5.0 | minor |
| eslint | 9.18.0 | 9.18.0 | **10.4.0** | **major** |
| eslint-config-next | 15.1.6 | 15.1.6 | **16.2.6** | **major** |
| framer-motion | 11.18.0 | 11.18.0 | **12.40.0** | **major** |
| fuse.js | 7.0.0 | 7.0.0 | 7.3.0 | minor |
| jsdom | 25.0.1 | 25.0.1 | **29.1.1** | **major** |
| katex | 0.16.11 | 0.16.11 | 0.17.0 | minor (0.x) |
| lucide-react | 0.469.0 | 0.469.0 | **1.16.0** | **major** |
| mermaid | 11.14.0 | 11.15.0 | 11.15.0 | minor (in range) |
| next | 15.1.6 | 15.1.6 | **16.2.6** | **major** |
| next-mdx-remote | 5.0.0 | 5.0.0 | **6.0.0** | **major** |
| postcss | 8.5.1 | 8.5.1 | 8.5.15 | patch |
| prettier | 3.4.2 | 3.4.2 | 3.8.3 | minor |
| react | 19.0.0 | 19.0.0 | 19.2.6 | minor |
| react-dom | 19.0.0 | 19.0.0 | 19.2.6 | minor |
| recharts | 2.15.0 | 2.15.0 | **3.8.1** | **major** |
| rehype-katex | 7.0.0 | 7.0.0 | 7.0.1 | patch |
| remark-gfm | 4.0.0 | 4.0.0 | 4.0.1 | patch |
| tailwind-merge | 2.6.0 | 2.6.0 | **3.6.0** | **major** |
| tailwindcss | 3.4.17 | 3.4.17 | **4.3.0** | **major** |
| typescript | 5.7.2 | 5.7.2 | **6.0.3** | **major** |
| vitest | 2.1.8 | 2.1.8 | **4.1.7** | **major** |

`three` and `simplex-noise` do not appear in `npm outdated`, meaning the installed versions already
satisfy both the declared range and the registry latest within that range.

### 1.3 Plan-flagged specifics (Section 14 asked for these by name)

| Item | Installed | Latest | Note |
|---|---|---|---|
| **Tailwind major** | **3.4.17** | **4.3.0** | On v3. **No v4 migration has begun** (config is still `tailwind.config.ts` with `var(--*)` token mapping; no `@theme`/CSS-first config present). This is the big Phase 2 Wave-3 migration. |
| **three.js** | **0.184.0** (declared `^0.184.0`) | within range | Verified from `node_modules/three/package.json`. Pin + test the hero on any bump. |
| **simplex-noise** | **4.0.3** (declared `^4.0.3`) | within range | Verified from `node_modules/simplex-noise/package.json`. |
| **Next.js** | **15.1.6** | 16.2.6 | Major (16.x) available; static-export contract must be re-verified if bumped. |
| **React / react-dom** | **19.0.0** | 19.2.6 | Minor only (already current generation). |
| **MDX pipeline** | @next/mdx 15.1.6, next-mdx-remote 5.0.0, remark-gfm 4.0.0, remark-math 6.0.0, rehype-katex 7.0.0, rehype-slug 6.0.0, rehype-autolink-headings 7.1.0, katex 0.16.11, mermaid 11.14.0 | mixed | next-mdx-remote 5→6 and @next/mdx 15→16 are majors (Wave 4). mermaid has a minor in range. |

### 1.4 `npm audit` (command: `npm audit` / `npm audit --json`)

**Totals: 15 vulnerabilities — 2 critical, 3 high, 8 moderate, 2 low.**

| Severity | Package | Advisory (short) |
|---|---|---|
| CRITICAL | next | Information exposure in the Next.js **dev server** (origin verification) |
| CRITICAL | vitest | `@vitest/mocker` RCE when accessing a malicious website (test/dev tooling) |
| HIGH | next-mdx-remote | Arbitrary code execution in React server-side rendering |
| HIGH | @playwright/test | Depends on vulnerable `playwright` |
| HIGH | playwright | Downloads browsers without verifying authenticity |
| MODERATE | @vitest/mocker, esbuild, katex, mermaid, postcss, vite, vite-node, ws | various (dev-server SSRF, KaTeX attribute validation, Mermaid Gantt DoS, PostCSS stringify XSS, ws memory disclosure) |
| LOW | @eslint/plugin-kit, eslint | ReDoS in `@eslint/plugin-kit` |

**Important context for triage (observation, not a recommendation):** the 2 critical and 2 of the 3
high advisories are in **dev-server / test tooling** (Next dev server, vitest/@vitest/mocker,
playwright). The production artifact is a **static export with no dev server and no test tooling
shipped**, so their runtime exposure on the live site is limited. The exception worth attention is
**next-mdx-remote (HIGH, RCE in RSC)** and **next** itself, which sit in the content-render path.
`npm audit fix` is offered for some; `--force` would pull `next@15.5.18` and `@playwright/test@1.60.0`
outside current ranges. None of this was applied (read-only).

---

## 2. Hosting and deploy

| Question | Finding | Evidence |
|---|---|---|
| Deploy config present? | **None.** No `vercel.json`, `netlify.toml`, `wrangler.toml/.jsonc`, Cloudflare config, `Dockerfile`, `docker-compose.yml`, `Procfile`, or `firebase.json`. | `ls` for each |
| CI workflow? | **None.** No `.github/workflows/`. | `ls .github/workflows` → absent |
| `.env` files? | **None.** No `.env`, `.env.example`, `.env.local`, etc. | `ls .env*` → absent |
| Env vars referenced in code | Only **`process.env.NODE_ENV`** and **`process.env.PORT`**. No secrets, no app config env, no backend keys. | `grep process.env src scripts next.config.mjs` |
| How the build is served | `scripts/serve.js` (zero-dependency Node static server; `PORT` from `process.argv[2]` or `process.env.PORT`, default **3041**) launched by **`Start MNM-Edu.bat`**. | `scripts/serve.js` lines 20/104/115; `Start MNM-Edu.bat` |
| Other build-time scripts | `scripts/generate-og.mjs` (OG images), `scripts/gen-placeholders.mjs` (figure placeholders), `scripts/bundle-modalities.mjs` (the `modalities-for-review.md` export). | `ls scripts/` |

**Implication for the plan:** no host is chosen yet, no deploy automation exists, and secret handling
is greenfield. Phase 0.3 (`.nvmrc`, `.env.example`) and Phase 5 (host + cache + deploy hook) start
from zero. The only runtime env knob today is `PORT` for the local static server.

---

## 3. Existing auth / backend (expected: none)

**Confirmed: there is no auth, server, database, or backend of any kind.** The Review Console
(Phase 3) is fully greenfield and will not collide with anything present.

| Probe | Result | Evidence |
|---|---|---|
| Backend/auth/DB dependencies | **NONE** (searched supabase, firebase, prisma, drizzle, pg, mongoose/mongodb, next-auth, @auth, clerk, lucia, passport, express, fastify, knex, sequelize, typeorm) | `package.json` scan |
| `src/app/api/` directory | **Absent** | `find` / `ls` |
| `route.ts` / `route.tsx` handlers | **None** | `find src/app -name route.ts*` |
| Source imports of backend/auth SDKs | **None** | `grep -rlE "from '(@supabase\|firebase\|@prisma\|drizzle\|pg\|mongoose\|next-auth\|@clerk)'" src` |

This matches the static-export model in `next.config.mjs` (`output: 'export'`): server routes are not
even buildable in that mode.

---

## 4. Content anchors (for the Review Console annotation overlay)

**Headings render stable, unique, kebab-case `id` slugs on every built page** — exactly what the
Console needs to attach a finding to a section.

- **Pipeline:** `next.config.mjs` line 21 applies `rehypeSlug` then
  `[rehypeAutolinkHeadings, { behavior: 'wrap' }]`. So every heading gets an `id` and is wrapped in an
  anchor.
- **Observed format** (from the existing `out/modalities/icp/index.html`):
  - `<h2 id="2-what-icp-is-and-what-it-is-not">`
  - `<h2 id="3-evd-versus-intraparenchymal-choosing-the-probe">`
  - `<h3 id="vignette-a-severe-pediatric-tbi-day-1-the-waveform-changes-shape-before-the-number-does">`
  - Slugs are lowercase, hyphen-separated, derived from the full heading text.
- **Uniqueness:** that page has **38 id-bearing headings, all unique** (no duplicate `id="…"`).
- **Page-level identifier:** the stable page key is **(kind, slug)**. `kind` is the route segment
  (`modalities` / `foundations` / `integration`); `slug` comes from `generateStaticParams` /
  `params` and feeds `getModality(slug)` + `loadContent('modalities', slug)`
  (`src/app/modalities/[slug]/page.tsx`).
- **Content hash / build SHA:** **none is emitted.** No `contentHash`, `content_hash`, `gitSha`,
  `git_sha`, `buildSha`, `commitHash`, or `VERCEL_GIT*` anywhere in `src`, `scripts`, or
  `next.config.mjs`. The plan's `pages.git_sha` and `pages.content_hash` (Section 6.3) will therefore
  have to be generated at Console-sync time, and `git_sha` depends on git existing first (Phase 0).

**Stability nuance to feed into the Console spec:** because the slug includes the leading section
number (`2-what-icp-is-…`), renumbering or inserting a section changes that heading's `id`. Findings
anchored to a numbered-section slug can drift if sections are reordered. The Console's version-pinning
(`page_git_sha`) and the `quoted_text` field mitigate this, but the spec should account for
anchor-renumbering when diffing versions.

---

## 5. Project structure quick confirm

- **Content location matches the audit:** `src/content/<kind>/*.mdx` with foundations **9**,
  modalities **27**, integration **18** (`ls src/content/<kind>/*.mdx`). Consistent with
  `CURRENT_STATE.md`.
- **Homepage components present** under `src/components/home/` (11 files): `AboutFooter.tsx`,
  `BrainModel.tsx`, `DomainPentagon.tsx`, `FeaturedWidget.tsx`, `FoundationsEntry.tsx`, `Hero.tsx`,
  `ModalityGridTeaser.tsx`, `NavQuadrant.tsx`, `SecondaryInjuryTimeline.tsx`, `SectionNav.tsx`,
  `StatStrip.tsx`.
- **3D brain hero file exists:** `src/components/home/BrainModel.tsx` (**666 lines**), the three.js +
  simplex-noise WebGL hero referenced by `Hero.tsx`.

---

## 6. What this unblocks (mapping back to plan Section 13)

| Plan need (Section 13) | Status from this pass |
|---|---|
| 1. Exact dependency state | Captured (§1): full table + audit. Phase 2 waves can target real versions. Tailwind 3.4.17→4.3.0 and the Next/MDX majors are the headline migrations. |
| 2. Hosting + deploy reality | Captured (§2): no host, no deploy config, no CI, no secrets. All greenfield. |
| 3. Existing auth/backend | Captured (§3): genuinely none. Review Console is greenfield. |
| 4. Anchor stability | Captured (§4): stable unique slugs confirmed; format recorded; no content hash/SHA today; section-number-in-slug nuance flagged. |

The three owner decisions the plan lists (backend choice, reviewer auth method, Console hosting model)
are **not** resolvable from the repo and remain open for the owner.

---

*End of discovery report. Read-only: no source, config, content, or asset was changed; the only file
written is this report. Proposing no changes.*
