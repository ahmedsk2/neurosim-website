# MNM-Edu Design Improvement Plan

This is the single source of truth for "where are we on improving the design/UX." It tracks the
improvements surfaced by the UI/UX design audit (`docs/_audit/UI_UX_DESIGN_AUDIT.md`). It does not
re-do the audit; the audit is the source of FINDINGS, this file is the source of EXECUTION STATUS.

Companion docs: the full design findings (per-surface, with measured values) live in
[`_audit/UI_UX_DESIGN_AUDIT.md`](./_audit/UI_UX_DESIGN_AUDIT.md); the launch tracking lives in
[`LAUNCH_PLAN.md`](./LAUNCH_PLAN.md); load-bearing decisions live in
[`DECISIONS.md`](./DECISIONS.md).

## How this document is maintained

- Every backlog item carries a status checkbox. Status is updated **on PR merge** (at the same
  time as the memory update), so this file always answers: "what would I do next if I sat down to
  work right now?"
- Improvements ship as **separate, focused, gated PRs, one coherent piece at a time**. There is no
  big-bang rewrite.
- Every design PR must be verified in **both themes (dark and light)** and at **mobile, tablet,
  and desktop** before merge. Regression checks against the "preserve" list (below) are part of
  every review.
- When an item merges, move it to the **Completed** section with its PR number and merged SHA, and
  add a one-line changelog entry.

## Engineering notes (read before any sizing or typography work)

- **The root font-size is 14px, not 16px** (`html { font-size: 14px }` in
  `src/styles/globals.css`). Tailwind spacing and size utilities are rem-based, so they all render
  at **0.875x** their nominal pixel value. For example `h-11` / `min-h-11` (nominally 44px) actually
  render at **38.5px**. Any control that must hit an EXACT pixel value (a 44px tap target, a precise
  icon box) must use a literal arbitrary value like `min-h-[44px]`, or a px-valued CSS rule (the
  `.tap-target` utility uses literal `44px`), NOT a rem-based Tailwind class. This bit A3: `BackToTop`
  and the mobile nav rows were silently 38.5px. **Cross-reference B4:** changing the base font size
  will rescale every rem-based size site-wide, so B4 must audit that knock-on effect.
- **Preview CDP emulation decouples the visual viewport from the layout viewport.** In this
  environment the Preview connector's mobile emulation sets the LAYOUT viewport (which drives
  `documentElement.clientWidth`, media queries, and normal layout) to the target width (e.g. 375),
  but leaves `window.innerWidth` (the VISUAL viewport, the initial containing block for
  `position: fixed`) at the host-window width (e.g. 1500). CONSEQUENCE: a fixed full-width element
  (`left:0 right:0` or `width:100%`) appears ~1500px wide and seems to force horizontal overflow
  under Preview emulation, but does NOT on a real device (where `innerWidth === clientWidth`). When
  diagnosing mobile overflow, distinguish REAL min-content overflow (genuine, layout-viewport-based,
  like the A1 tables) from fixed-element PSEUDO-overflow (emulation artifact) by checking
  `window.innerWidth` vs `documentElement.clientWidth` and whether the element's `offsetParent` /
  containing block is actually constrained. Do NOT "fix" an emulation artifact with `width: 100vw`
  (regresses desktop by ~1 scrollbar width) or a root `overflow-x: clip` (masks real overflow bugs).
  This was the finding of A7 (see Completed).

## Status legend

- `[ ]` Not started
- `[~]` In progress (with PR #)
- `[x]` Done (with PR # and merged SHA)

Each item also records: a one-line description, the **audit finding** it addresses, the rough
**effort** (quick win / moderate / large), and which **themes / breakpoints** it touches.

---

## Current state

The site is **live at `https://mnm.towardpcc.com`** (Phase 4a launch complete; see
`LAUNCH_PLAN.md`). This plan is about elevating the design and UX **incrementally and safely** on
top of a shipped, working product. Nothing here is launch-blocking; it is quality and polish work.

### Preserve, do not regress

The audit found these are genuinely good. Every design PR must avoid regressing them:

- The polished dark theme and the homepage hero (color-coded headline plus the 3D brain-network).
- The coherent color system and the evidence-grade encoding (A / B / C / EXPERT / SPARSE).
- The Evidence library (faceted filters, grade legend, citation keys, DOI links).
- The Search page's symptom and scenario entry points (bedside-first UX).
- The CPPopt simulation widget (live traces, correlation panel, PRx-vs-CPP U-curve).
- The trust signals (named author, review dates, citations, disclaimers).
- The genuinely-good light theme (a real token remap, not an inversion). Its only blemish is the
  mermaid diagrams, tracked as A2.
- The accessibility foundations (focus ring, skip-link, reduced-motion, prior contrast fixes).

---

## Improvement backlog

### Track A: Quick safe wins (small, low-risk, high-value)

> A1 (data-table horizontal scroll), A2 (mermaid light theme and label fit), A3 (>= 44px tap
> targets), A5 (reviewer login polish), and A6 (consent-banner theming) are DONE, and A7 was
> investigated and RESOLVED WITH NO FIX (a Preview-CDP emulation artifact, not a real bug); see the
> Completed section below. Only A4 (content spacing typos) remains open in Track A.

#### `[ ]` A4. Fix the recurring bold-runs-into-next-word spacing typos
- **What:** correct the MDX bold-adjacency spacing defect, for example "Neurology 2011,pooled"
  (homepage stat) and "public pagesuntil" / "Analytics(when enabled" (privacy policy). Grep the
  whole content set for the same pattern.
- **Audit finding:** Low, content polish (recurring).
- **Effort:** Quick win.
- **Touches:** content (MDX). NOTE: this touches CONTENT; verify each change carefully and confirm
  no clinical meaning is altered. All themes/breakpoints unaffected (text only).

### Track B: Deeper design and readability work (moderate, more judgment)

#### `[ ]` B1. Strengthen the type hierarchy on content pages
- **What:** widen the visual gap between headings and body so dense clinical pages are scannable
  (for example raise content-page body size and strengthen h3 size/weight).
- **Audit finding:** High, readability. h3 (17 px) sits too close to body (14 px); pages read flat
  on first scan.
- **Effort:** Moderate (do it once on the content template; it propagates).
- **Touches:** all content pages; both themes; all breakpoints.

#### `[ ]` B2. Rework the "5-minute summary" into a bedside-scannable format
- **What:** convert the dense 14 px single-paragraph summary into a scannable format (bulleted key
  points or bolded lead-ins).
- **Audit finding:** High, readability.
- **Effort:** Moderate.
- **Touches:** content presentation on modality and foundation pages; both themes; all breakpoints.
  NOTE: this changes how clinical content is PRESENTED; the clinical owner should sign off on the
  format before it propagates site-wide.

#### `[ ]` B3. Improve mobile mermaid legibility
- **What:** a 997 px-tall flowchart scaled to about 324 px wide on a phone makes labels illegible.
  Provide a usable mobile path (zoom/pan, a full-scale horizontal-scroll container, or a
  mobile-specific rendering) instead of shrinking to fit.
- **Audit finding:** Moderate, mobile.
- **Effort:** Moderate.
- **Touches:** mobile primarily; integration pages; both themes. Coordinate with A2.

#### `[ ]` B4. Reconsider the base 14 px font size and the wide empty-right gutter
- **What:** two related judgment calls: (a) whether 14 px is the right base for dense clinical
  text, and (b) the large empty band to the right of prose on wide screens (text caps at about
  85ch). A natural fill for the gutter is an "on this page" / reading-progress rail on long pages.
- **Audit finding:** Noted (readability vs balance; judgment call).
- **Effort:** Moderate to large depending on scope.
- **Touches:** site-wide typography and content-page layout; both themes; all breakpoints.
  NOTE: this is a judgment call with broad reach; flag for OWNER decision before acting. The 85ch
  reading cap is itself a strength and should be kept. IMPORTANT cross-reference: the root font-size
  is 14px and Tailwind sizing is rem-based (see "Engineering notes" at the top), so changing the
  base font will rescale every rem-based size (spacing, icon boxes, heights) site-wide. Audit that
  knock-on effect as part of B4.

### Track C: The figures (highest impact, largest effort, own track)

#### `[ ]` C1. Replace the placeholder figure SVGs with finished, clinically-accurate figures
- **What:** roughly 72 of 77 figure SVGs are auto-generated placeholders that visibly render
  "PLACEHOLDER, TODO: polish (filename.svg)". Replace them with finished figures, page by page.
- **Audit finding:** CRITICAL, trust. This is the single biggest lever on perceived quality and
  trustworthiness for a clinical educational resource.
- **Effort:** Large. This is an illustration-production program, NOT a CSS task. It needs clinical
  accuracy (the owner is a pediatric intensivist) and should be planned as its own sub-sequence,
  one modality or foundation per PR. Use the existing inventory in
  `claude-code-tasks/06-figures-to-create.md` to sequence it.
- **Touches:** every content page over time; both themes (figures must read on light and dark);
  all breakpoints.
- **Note:** the placeholder SYSTEM is well-architected already (consistent template, real `alt`
  text, evidence-graded captions and attributions). The gap is purely the finished art, so each
  replacement is a drop-in. Highest impact item on this plan; also the largest and most involved,
  so sequence it as a parallel, longer-running program (see sequencing below).

---

## Sequencing recommendation

This is a recommendation; the OWNER sets the real priority.

1. **Track A first.** Quick, low-risk wins that ship visible improvement and build momentum.
   A1 (table overflow) and A2 (mermaid light theme) remove the two most noticeable defects.
2. **Track B next**, with owner input on the judgment-call items (B2 summary format, B4 base font
   and gutter) before they propagate site-wide.
3. **Track C in parallel**, as a longer-running program. Because it is content/illustration
   production rather than code, it does not block A or B and can proceed on its own cadence, one
   page at a time, sequenced by traffic (homepage-linked core modalities and key foundations
   first).

Rationale: A is safe and fast, B needs a few decisions, and C is the biggest quality lever but the
slowest, so starting it early in parallel lets it run while the faster tracks land.

---

## Completed

Items move here on merge, newest first, with PR number and merged SHA.

#### `[x]` A5. Polish the reviewer login page  -  Done: PR #73 (`56090fa`)
- **Shipped:** the reviewer login (`/review/login/`) was rebuilt as a centered card using the site
  design tokens and `font-sans` (replacing the utilitarian monospace top-left form), with real
  `<label>` elements (associated via `htmlFor` + `useId`), correct input `type` + `autocomplete`,
  preserved focus states, and tap-targets (>= 44px touch) on the inputs and the shared `Button`.
  Themes in dark and light.
- **Conditional nav:** the review console sub-nav (Pages/Findings/Sign out and admin links) now
  renders only when authenticated (`{session && <nav>}`), so it no longer shows on the logged-out
  login, accept-invite, or reset-password pages.
- **Auth untouched:** render-only change. The `signIn('credentials')` submission, callbackUrl
  sanitization, error mapping, and redirect are byte-identical; the layout never enforced auth and
  each page still gates itself.
- **Verified:** both themes (desktop screenshots; the h1 font is now `-apple-system`, not
  monospace), real labels + types/autocomplete confirmed in the DOM, logged-out nav hidden
  (`hasConsoleNav: false`), card centered and fits at 375 with 44px inputs/button. Full gate green
  (typecheck, lint, validate-content, vitest 94/94, build, e2e 12 passed).
- **Post-deploy verification:** the AUTHENTICATED-state nav (that the sub-nav still renders for a
  logged-in reviewer) was confirmed by code logic but NOT live-tested locally (no DB creds locally).
  Eyeball it on the live site after deploy: log into `/review/` and confirm the
  Pages/Findings/Sign-out nav shows for the authed state.

#### `[x]` A7. /modalities/tcd/ mobile overflow from the fixed ScrollProgress bar  -  RESOLVED, NO FIX (Preview-CDP emulation artifact)
- **Finding:** investigated and found NOT to be a real bug. It is a Preview-CDP emulation artifact,
  not a real overflow. No code change made.
- **Evidence:** under Preview CDP mobile emulation the VISUAL viewport (used by `position:fixed`)
  stays at the host-window width (`window.innerWidth` 1500) while the LAYOUT viewport
  (`documentElement.clientWidth`) is the emulated 375, so any fixed `left:0 right:0` element
  mis-measures to 1500. A freshly-injected fixed `left:0 right:0` test div reproduced the 1500 width;
  `ScrollProgress` has `offsetParent` null and no containing-block ancestor (its only ancestors, body
  and html, are 375px with no transform/filter/contain); and removing `ScrollProgress` did not change
  `scrollWidth`. `ScrollProgress` is viewport-correct on real devices, where
  `innerWidth === clientWidth`.
- **Why no code change:** a `width: 100vw` change would have introduced a real ~15px horizontal
  scroll on desktop (100vw includes the scrollbar gutter) to "fix" a non-bug. See the "Preview CDP
  emulation" Engineering note above.
- **Re-confirms A1:** the A1 table overflow was real and the A1 fix was correct and complete; the
  residual TCD overflow that A1 attributed to ScrollProgress was this same emulation artifact, so A1
  missed nothing.
- **Pending:** one optional real-device eyeball of `/modalities/tcd/` to confirm empirically.

#### `[x]` A6. Theme the cookie consent banner with design tokens  -  Done: PR #70 (`b06b8e7`)
- **Shipped:** `CookieBanner.tsx` now uses the design tokens instead of hardcoded dark colors, so it
  themes in both modes. In light it renders as a white bar (`bg-surface-card`, `text-ink`,
  `border-line`) that blends with the page instead of a dark island; dark is unchanged. Accept and
  Decline use the site's secondary-button tokens and are kept computed-identical (equal weight, no
  dark pattern); the dismiss control uses `text-ink-muted`.
- **Color/token swap only:** the consent logic is untouched (the diff is 6 className color swaps):
  the `NEXT_PUBLIC_GA_ID` kill-switch, default-deny, `showBanner` derivation, accept/decline/dismiss
  handlers, the no-first-visit-dismiss rule, and the privacy link are all unchanged.
- **Verified:** built locally with a dummy `NEXT_PUBLIC_GA_ID` (build-command env only, never
  committed) to render the banner; computed colors + screenshots in both themes; reverted (the dummy
  id is in no tracked file; the gate build was re-run plain). Full gate green (typecheck, lint,
  validate-content, vitest 94/94, build, e2e 12 passed).
- **Prod note:** GA is live in production, so the themed banner can be eyeballed on the live site
  after the next deploy.

#### `[x]` A3. Enlarge interactive tap targets to >= 44px on touch  -  Done: PR #68 (`fdac4b4`)
- **Shipped:** a `.tap-target` utility (`globals.css`) gated by `@media (pointer: coarse),
  (max-width: 1023px)` gives a >= 44px hit area on touch and narrow viewports ONLY. Applied to the
  header search / theme / hamburger controls, the shared `Button`, the homepage Hero CTAs,
  `PrintButton`, the cookie-banner buttons, and `LocalePicker` (the latter is not currently mounted,
  so that one is a defensive fix). Mobile nav rows and the `BackToTop` FAB were switched to explicit
  `[44px]` (they used rem-based `min-h-11` / `h-11`, which rendered at 38.5px under the 14px root,
  see "Engineering notes" above). `aria-expanded` was added to the hamburger toggle.
- **Verified:** at 375px, search/theme/hamburger 44x44, CTAs 44 tall, mobile nav rows 44, BackToTop
  44x44; `aria-expanded` toggles false to true. Desktop (1600px, fine pointer) completely unchanged
  in both themes (the media query does not apply; search/theme 24x24, CTA 245x37, no wrap). Full
  gate green (typecheck, lint, validate-content, vitest 94/94, build, e2e 12 passed).
- **Left intentionally:** inline citation chips and filter chips, which meet the 24px AA floor
  (WCAG 2.5.8 inline exception) and would be bloated by a 44px minimum.
- **Prod note:** the cookie-banner buttons got the fix but were unverified locally (the banner only
  renders when `NEXT_PUBLIC_GA_ID` is set). GA is live in production, so the fix applies there and
  can be eyeballed on the live site.

#### `[x]` A2. Theme the mermaid diagrams for light mode (and fix clipped labels)  -  Done: PR #66 (`f0ec55d`)
- **Shipped:** the `Mermaid` component reads the active theme via `useTheme()` and re-initializes
  mermaid with token-mapped theme variables before each render, re-rendering when the theme toggles
  (effect keyed on the theme). Dark keeps its exact previous colors; light maps to white node fill,
  navy text, and teal borders/lines, so diagrams no longer render as a dark island on light-mode
  pages.
- **Label fit:** `flowchart.wrappingWidth` raised to 400 so node boxes size to their full label and
  the long "...build buffer" label is no longer clipped; `htmlLabels` stays `true` so HTML entities
  in labels (`&ge;`, `&lt;`) still decode.
- **Verified:** light node fill `#13243A` to `#FFFFFF` (stroke `#0D9488`, text `#0F172A`); dark
  unchanged; both toggle directions re-render with no stale diagram; labels not clipped; fits at
  375/768/desktop; full gate green (typecheck, lint, validate-content, vitest 94/94, build, e2e 12
  passed).
- **Maintenance note:** with `wrappingWidth: 400`, mermaid node labels stay single-line up to 400px
  before wrapping. All current labels are well under that; a future label longer than ~400px would
  wrap (by design).

#### `[x]` A1. Wrap data tables in a horizontal-scroll container  -  Done: PR #64 (`4bdf253`)
- **Shipped:** a `TableScroll` client component registered as the MDX `table` override (alongside
  the Mermaid `pre` override), so every content-page table (modalities, foundations, integration) is
  wrapped in an `overflow-x: auto` box. Wide tables now scroll within their own box instead of
  forcing page-level horizontal scroll on mobile.
- **Behavior:** the wrapper becomes a focusable, labelled scroll region (`role="region"`,
  `aria-label`, `tabindex=0`) ONLY when a table actually overflows (ResizeObserver), so tables that
  fit get no dead tab stops. The affordance is a thin, token-matched scrollbar; no fade overlay (it
  would tint the values in edge columns). Desktop is unchanged in both themes (tables still fill the
  column at `width:100%`).
- **Verified:** ICP `/modalities/icp/` 375 px page overflow resolved (scrollWidth 402 to 375; the
  388 px table scrolls internally); 768 px and desktop no overflow; dark and light; full gate green
  (typecheck, lint, validate-content, vitest 94/94, build, e2e 12 passed).

### Changelog

- 2026-05-31, PR #73 (`56090fa`): A5 shipped. Reviewer login rebuilt as a centered card using site
  tokens + font-sans (replacing the monospace top-left form), with real <label> elements and correct
  input types/autocomplete/focus states, tap-targets applied; the review console sub-nav now renders
  only when authenticated ({session && nav}) so it no longer shows on the logged-out
  login/accept-invite/reset-password pages; auth logic byte-identical (render-only change); verified
  both themes and at 375/768. POST-DEPLOY: the authenticated-state nav was confirmed by code logic,
  not live-tested locally (no DB creds), so eyeball it on the live site after deploy.
- 2026-05-31: A7 RESOLVED, NO FIX. Investigated the reported `/modalities/tcd/` mobile overflow and
  found it is a Preview-CDP emulation artifact, not a real bug: the emulator's visual viewport
  (`window.innerWidth` 1500, used by `position:fixed`) is decoupled from the layout viewport
  (`clientWidth` 375), so any fixed full-width element mis-measures; a fresh injected fixed div
  reproduced it; `ScrollProgress` `offsetParent` is null with no containing-block ancestor; and
  removing it did not change `scrollWidth`. ScrollProgress is viewport-correct on real devices, so no
  code change was made (a 100vw change would have regressed desktop). Methodology recorded in the
  Engineering notes; re-confirms A1 was complete (its table fix was real; the residual TCD overflow
  was this artifact).
- 2026-05-31, PR #70 (`b06b8e7`): A6 shipped. CookieBanner now uses design tokens instead of
  hardcoded dark colors, so it themes correctly in both modes: light renders as a white bar blending
  with the page instead of a dark island, dark unchanged. Accept/Decline kept computed-identical
  (equal weight, no dark pattern); consent logic untouched (color/token swap only). Since GA is live
  in prod, the themed banner can be eyeballed on the live site after the next deploy.
- 2026-05-31, PR #68 (`fdac4b4`): A3 shipped. A `.tap-target` utility gated by
  `@media (pointer: coarse),(max-width:1023px)` gives >= 44px hit areas on touch/narrow only:
  header search/theme/hamburger, shared Button, homepage CTAs, PrintButton, cookie-banner buttons,
  LocalePicker; mobile nav rows and BackToTop switched to explicit [44px]; aria-expanded added to
  the hamburger; desktop completely unchanged in both themes; inline citation chips and filter chips
  left per WCAG 2.5.8 inline exception. (Engineering note recorded: the 14px root font-size rescales
  all rem-based Tailwind sizes by 0.875x, so use literal [Npx] for exact targets; cross-ref B4.)
- 2026-05-31, PR #66 (`f0ec55d`): A2 shipped. Mermaid diagrams now read the active theme via
  useTheme() and re-render on theme toggle with token-mapped variables; dark is unchanged, light
  maps to white nodes / navy text / teal borders so diagrams no longer render as a dark island on
  light-mode pages; the long-label clip is fixed via wrappingWidth: 400 with htmlLabels kept true so
  HTML entities still decode; verified both themes, both toggle directions, and at 375/768/desktop.
  (Maintenance note: with wrappingWidth: 400, mermaid node labels stay single-line up to 400px
  before wrapping; all current labels are well under that.)
- 2026-05-31, PR #64 (`4bdf253`): A1 shipped. Added a `TableScroll` wrapper as the MDX `table`
  override; wide content-page tables now scroll within their own box instead of forcing page-level
  horizontal scroll on mobile; the a11y scroll-region is applied only when a table overflows;
  token-matched scrollbar; desktop unchanged in both themes.
