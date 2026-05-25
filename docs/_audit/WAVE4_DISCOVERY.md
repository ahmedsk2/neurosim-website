# Wave 4 Discovery: MDX pipeline (READ ONLY)

Phase 2, Wave 4 prep. Discovery only. Nothing installed, no branch, no commits. The
one write is this file.

- Date: 2026-05-25
- Git precondition (verified first): on `main`, working tree clean,
  `HEAD == origin/main == 6496eb7` (the Wave 3c PR2 merge), in sync. Evidence:
  `git branch --show-current`, `git status -sb` (`## main...origin/main`, no
  ahead/behind), `git fetch origin main --dry-run` (no new refs).
- Method: every claim cites its source. `npm view ...` = read-only registry query;
  file/usage claims cite the read or grep; breaking changes are grounded in official
  changelogs, fetched (not from memory):
  - next-mdx-remote v6.0.0 release: https://github.com/hashicorp/next-mdx-remote/releases/tag/v6.0.0
  - next-mdx-remote README (blockJS semantics): https://github.com/hashicorp/next-mdx-remote
  - @next/mdx is governed by the Next 16 changelog (fetched in the Wave 3a/3b discoveries).

## Headline

The only bump that actually affects rendering is **next-mdx-remote 5 to 6**, because
next-mdx-remote is the sole compiler of our 54 content pages. It is also the package
behind the one remaining HIGH advisory, and v6 fixes it. The good news: v6's fix
(`blockJS`/`blockDangerousJS` default true) does NOT block custom JSX components, and
our content uses no import/export and no raw JS expressions, so v6 should be a
near-drop-in. It still needs an empirical render-parity check (the security default
is new and the repo is now archived, so v6 is the final version).

Everything else is a non-event:
- **@next/mdx 15 to 16 compiles NOTHING in this app** (no `.mdx` pages, no `.mdx`
  module imports), so its bump has no rendering impact; it is inert config plus a
  convention stub.
- **katex 0.16 to 0.17 is still BLOCKED** by rehype-katex 7.0.1 (the latest), which
  peer-requires `katex ^0.16`. katex 0.16.47 is not flagged by npm audit, so 0.17 is
  not security-required. Keep 0.16.47.
- **rehype-katex (7.0.1), mermaid (11.15.0), remark-math (6.0.0) are already the
  latest**; no bump.

| Package | Current | Latest | Action |
| --- | --- | --- | --- |
| next-mdx-remote | 5.0.0 | 6.0.0 | BUMP (security + render-critical; parity check) |
| @next/mdx | 15.1.6 | 16.2.6 | inert; optional align-or-remove |
| katex | 0.16.47 | 0.17.0 | DEFER (blocked by rehype-katex; not security-needed) |
| rehype-katex | 7.0.1 | 7.0.1 | none (latest; it is the katex 0.17 blocker) |
| mermaid | 11.15.0 | 11.15.0 | none (latest) |
| remark-math | 6.0.0 | 6.0.0 | none (latest) |

(Versions from `npm view <pkg> version`.)

## Execution correction (Wave 4 PR1, 2026-05-25)

This discovery's section 3 called next-mdx-remote 6 a "near-drop-in" because "content
has no raw JS expressions." That was WRONG and is corrected here: our content DOES use
JS EXPRESSION PROPS on components, for example `<Quiz questions={[ ... ]} />` (and
other object/array-literal props). next-mdx-remote 6's new `blockJS: true` default
strips exactly those `{...}` expressions (it preserves JSX elements and Markdown but
removes expression nodes), so the bumped build crashed prerendering the first content
page with such a prop, `/foundations/astrup-cascade`, with `TypeError: Cannot read
properties of undefined (reading 'map')` (the Quiz received `questions = undefined`).
This affects every page with an expression prop (53 `<Quiz>` usages alone), not just
astrup-cascade.

Resolution (owner-approved): set `blockJS: false` plus an explicit
`blockDangerousJS: true` at all three `MDXRemote` call sites. Verified from
next-mdx-remote 6's compiled `serialize.js`: the dangerous-globals guard is applied
under exactly `!blockJS && blockDangerousJS`, so with our config eval / Function /
process / require remain blocked while our legitimate first-party expression props
compile. The threat model the v6 default guards against (RCE when compiling UNTRUSTED
MDX) does not apply here: all MDX is first-party authored and never compiled from
untrusted input. The npm audit HIGH still clears because it is resolved by the v6
version itself (3 to 2). Parity was then re-verified on a COMPLETE v6 build: all seven
canaries byte-identical to v5, and the Quiz on `/foundations/astrup-cascade` renders
with its options intact.

---

## 1. Versions and breaking changes per package

### next-mdx-remote 5.0.0 to 6.0.0
- Breaking changes (v6.0.0 release): bumped internal `unist-util-remove` to `^4.0.0`;
  introduced `blockJS` and `blockDangerousJS` options, **both default `true` for
  security**. `blockJS: true` strips JavaScript expressions (`{variable}`,
  `{func()}`) from the MDX source; `blockDangerousJS` (relevant when `blockJS: false`)
  blocks dangerous globals (`eval`, `Function`, `process`, `require`).
- Peer: `react: >=16` only (`npm view next-mdx-remote@6 peerDependencies`). No `next`
  peer. We are on React 19.2.6, so satisfied.
- The repo was ARCHIVED on 2026-04-09 and is read-only; v6.0.0 is the final release.
  This is fine for landing the security fix, but means future MDX-tooling changes
  would require migrating off next-mdx-remote (out of scope here; worth noting).

### @next/mdx 15.1.6 to 16.2.6
- @next/mdx is versioned with Next; 16.2.6 aligns with our Next 16.2.6. Its breaking
  changes live in the Next 16 changelog. BUT see section 2: it compiles nothing in
  this app, so its breaking changes do not reach our rendering.

### katex 0.16.47 to 0.17.0
- See section 4. Blocked by rehype-katex; not currently security-flagged.

### rehype-katex, mermaid, remark-math
- All already at the latest (`npm view` returned the same versions we have). No bump.

---

## 2. How we actually compile MDX (the compile-path map)

This is the crux, because it determines which bump touches rendering.

1. **Storage.** 54 `.mdx` files live ONLY in `src/content` (9 foundations + 18
   integration + 27 modalities; `find src -name '*.mdx'`). There are NO `.mdx` files
   in `src/app`.

2. **Loading (no compile).** `src/lib/content.ts` `loadContent()` reads each file with
   `gray-matter`, returns the RAW MDX `body` string plus parsed frontmatter and a
   regex-extracted `citationOrder`. It does not compile MDX.

3. **Compiling.** Each dynamic route page compiles `doc.body` at render time with
   **next-mdx-remote**. All three pages
   (`src/app/modalities/[slug]/page.tsx`, `foundations/[slug]/page.tsx`,
   `integration/[scenario]/page.tsx`) do:
   ```tsx
   import { MDXRemote } from 'next-mdx-remote/rsc';
   ...
   <MDXRemote
     source={doc.body}
     components={mdxComponents}                 // from '@/components/mdx/components'
     options={{ mdxOptions: {
       remarkPlugins: [remarkMath, remarkGfm],
       rehypePlugins: [rehypeKatex, rehypeSlug],
     }}}
   />
   ```
   So **next-mdx-remote/rsc is the sole compiler of all content**, with the
   remark/rehype plugins passed AT THE PAGE LEVEL (function-form), and the component
   scope supplied via the `components` prop.

4. **@next/mdx compiles nothing.** `next.config.mjs` wraps the config with
   `createMDX({ options: { remarkPlugins: [...], rehypePlugins: [...] } })` and
   `pageExtensions` includes `'mdx'`, but there are NO `.mdx` pages in `src/app` and NO
   `.mdx` module imports anywhere (`grep` for `from '*.mdx'` and `import('*.mdx')`
   returns nothing). So @next/mdx's loader never fires; its plugin array is never
   used. It is inert configuration. `mdx-components.tsx` at the root just re-exports
   `useMDXComponents` from `@/components/mdx/components` (the @next/mdx App Router
   convention stub); next-mdx-remote does not use it (it uses the explicit
   `components` prop).

5. **Component scope.** `@/components/mdx/components` provides `mdxComponents` (the map
   passed to MDXRemote: `Cite`, `Figure`, `Callout`, `WidgetEmbed`, `Quiz`, etc.) and
   maps `pre: MermaidPre`, so fenced ` ```mermaid ` blocks render via the local
   `Mermaid` component (`src/components/content/Mermaid.tsx`).

Conclusion: next-mdx-remote 6 is the only bump in the rendering path. @next/mdx 16,
katex, rehype-katex, mermaid do not change how content renders (the first is inert,
the rest are not being bumped).

Note: the page-level rehype list is `[rehypeKatex, rehypeSlug]` (no
rehype-autolink-headings), which DIFFERS from next.config's
`[rehypeKatex, rehypeSlug, rehypeAutolinkHeadings]`. Since @next/mdx is inert, only
the page-level list is in effect, so content headings get slugs but no autolink
wrap. Not a Wave 4 change, just a fact to know.

---

## 3. next-mdx-remote 6 breaking changes vs OUR usage

| v6 change | Hits us? |
| --- | --- |
| `blockJS` defaults to `true` (strips `{expr}` JS expressions) | NO. Content has no raw JS expressions. The `{...}` in content are all LaTeX inside math (e.g. `\mathrm{PRx}`), which remark-math captures as math nodes before MDX expression parsing, so they are not treated as JS expressions. Custom JSX components (`<Cite/>`, `<Figure/>`, ...) are explicitly EXEMPT per the README (they resolve through the `components` prop). |
| `blockDangerousJS` defaults to `true` | NO. Only relevant if `blockJS: false`; we keep the defaults. |
| import/export in MDX restricted | NO. `grep` for `^import`/`^export` in `src/content/**/*.mdx` returns nothing. |
| RSC API (`MDXRemote` from `next-mdx-remote/rsc`, props `source`/`components`/`options.mdxOptions.{remarkPlugins,rehypePlugins}`) | UNCHANGED per the README; this is exactly our usage, so no code change to the three pages is expected. |
| `unist-util-remove` to ^4 (internal) | NO direct effect; transitive. |
| repo archived, v6 final | Not a breakage, but means no future fixes; note for the long term. |

Net: next-mdx-remote 6 should be a near-drop-in for our trusted, component-based,
import/export-free content. The risk is not API breakage but subtle render-output
differences from the new security defaults and any bundled-compiler change, which the
parity check (section 5) must confirm. If the build or a page errors under v6, the
likely culprit would be a stray `{expression}` in content that blockJS strips; none
was found, but the build is the backstop.

---

## 4. The katex 0.16 to 0.17 resolution

Still blocked, and not needed:
- `npm view rehype-katex version` is `7.0.1`, i.e. the version we already run IS the
  latest. `npm view rehype-katex peerDependencies` shows `katex: ^0.16.0` (and
  `@types/katex: ^0.16.0`). `^0.16.0` means `>=0.16.0 <0.17.0`, so katex 0.17.0 would
  VIOLATE rehype-katex 7.0.1's peer. There is no newer rehype-katex that admits
  katex 0.17, so the Wave 1 blocker is unchanged: bumping katex to 0.17 would either
  force a peer override (rehype-katex 7.0.1 was not built or tested against 0.17) or
  install two katex copies (a nested 0.16 for rehype-katex plus our direct 0.17),
  which is exactly the split we avoided in Wave 1.
- katex 0.16.47 is NOT flagged by npm audit (the only advisories are next, postcss,
  next-mdx-remote), so 0.17 is not security-required. 0.16.47 is a current, patched
  0.16.x.
- CSS/JS lockstep: `src/app/layout.tsx` imports `katex/dist/katex.min.css`. KaTeX's
  CSS and JS must be the same version, and rehype-katex's internal katex must match
  the CSS too. With rehype-katex pinned to katex ^0.16, the only consistent state is
  katex 0.16.x JS + 0.16.x CSS + rehype-katex 7.0.1. Moving the CSS to 0.17 while
  rehype-katex still uses 0.16 would risk render mismatches.

Recommendation: KEEP katex 0.16.47 (and rehype-katex 7.0.1). Revisit katex 0.17 only
when rehype-katex ships a release whose peer admits `katex ^0.17`. This is not part of
Wave 4.

---

## 5. Parity risk and how to verify it

No automated gate proves MDX render parity: typecheck/lint/validate-content do not
compile MDX through next-mdx-remote, unit tests do not render content pages, the build
proves it compiles (and would catch a blockJS strip that errors) but not that the
HTML is unchanged, and the Playwright axe sweep covers only about 12 routes and checks
a11y, not visual/structural fidelity.

Concrete parity check for this wave (HTML snapshot diff):
1. On current main (next-mdx-remote 5), run `npm run build` and copy the rendered
   `out/<route>/index.html` for the canary set below to a scratch folder.
2. On the bump branch (next-mdx-remote 6), `npm run build` again and diff each canary
   page's `index.html` against the saved copy. Expect either no diff or only benign
   differences (for example attribute ordering); investigate any change to KaTeX
   markup, table structure, heading ids, citation anchors, or Mermaid blocks.
3. Eyeball the same canaries in the browser (`npm run build` then `npx serve out`) in
   both dark and light themes.

Canary pages (real slugs, chosen by measured density):
- KaTeX / math (and the blockJS-vs-LaTeX-braces test): **modalities/sjvo2** (most
  LaTeX-dense, 47 LaTeX tokens), with **modalities/bis** and **modalities/aeeg** as
  secondary.
- Citation-dense (the `<Cite>` component and references list): **modalities/icp**
  (102 `<Cite>`), then **modalities/orx** (92) and **modalities/eeg** (88).
- Mermaid (fenced ` ```mermaid ` routed via `pre: MermaidPre`): **modalities/pbto2**
  (mermaid plus 4 widgets) or **modalities/tcd**; most modality pages carry one
  mermaid block, so any modality page works as the Mermaid canary.
- Widget-heavy (`<WidgetEmbed>` plus dynamic loading): **modalities/cppopt** or
  **modalities/prx** (5 widgets each; prx also has math).
- A different layout / component mix: one integration scenario, for example
  **integration/cppopt-targeting** (mermaid) or
  **integration/refractory-status-epilepticus** (math-dense for an integration page).

This set exercises KaTeX, GFM tables, heading slugs, the citation system, Mermaid, and
widget embedding across all three content kinds, which is the full surface
next-mdx-remote 6 could perturb.

---

## 6. Sequencing recommendation

- **PR 1 (the real Wave 4): next-mdx-remote 5 to 6 alone.** It is the security fix
  (the only remaining HIGH advisory) and the only render-affecting change, so it
  deserves its own PR and the parity check above. Treat it as MANUAL-MERGE after the
  HTML-diff and visual parity pass (same posture as the Tailwind 4 wave), since CI
  cannot prove render parity. Expected to be a near-drop-in (no page code change), but
  the parity check is mandatory because the blockJS default and the (final, archived)
  compiler are new.
- **PR 2 (optional, low-stakes): @next/mdx.** Two clean options, since it is inert:
  - Align: bump @next/mdx 15.1.6 to 16.2.6 to match Next 16. Low risk, CI-verifiable
    (it compiles nothing), can be hands-off. Verify the build still runs on the
    `--webpack` path (createMDX still injects a webpack MDX loader that simply never
    fires).
  - Remove: delete @next/mdx, the `createMDX` wrapper and the `mdx` entry in
    `pageExtensions` from `next.config.mjs`, and the root `mdx-components.tsx`, since
    nothing in the app is compiled by it (the same dead-config logic as the Wave 3c
    removals). Cleaner, but it is a small config refactor rather than a version bump;
    confirm with the owner which they prefer.
  Either way, keep it OUT of PR 1 so the next-mdx-remote parity review stays focused.
- **Not in Wave 4:** katex 0.17 (deferred, blocked and unneeded), rehype-katex,
  mermaid, remark-math (already latest).

So Wave 4 in practice is: ship next-mdx-remote 6 (security + parity), and make a
small, separate decision about @next/mdx (align or remove). The katex item closes as
"deferred, documented" rather than as an action.

---

## Appendix: commands run for this discovery (all read-only)

- Git: `git branch --show-current`, `git status -sb`, `git fetch origin main --dry-run`,
  `git rev-parse HEAD`.
- Registry: `npm view {next-mdx-remote,@next/mdx,katex,rehype-katex,mermaid,remark-math} version`,
  `npm view rehype-katex peerDependencies dependencies`,
  `npm view next-mdx-remote@latest peerDependencies`, `npm view @next/mdx dist-tags`,
  and an `npm audit` check confirming katex is not flagged.
- Files read: `src/lib/content.ts`, `src/app/modalities/[slug]/page.tsx` (the
  MDXRemote call), `mdx-components.tsx`; greps of `src/components/mdx/components.tsx`.
- Usage searches: `.mdx` pages in `src/app` (none) and `.mdx` module imports (none);
  next-mdx-remote / MDXRemote / remark / rehype imports in `src`; import/export in
  content (none); JSX component-tag census in `src/content`; math (LaTeX), citation
  (`<Cite>`), mermaid (fenced), and widget (`<WidgetEmbed>`) density per file.
- Web (read-only fetch): the next-mdx-remote v6.0.0 release and README.
