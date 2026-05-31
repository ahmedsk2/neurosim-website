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

#### `[ ]` A1. Wrap data tables in a horizontal-scroll container
- **What:** wide tables (the age-band and threshold tables) should scroll within themselves
  instead of forcing the whole page to scroll sideways on phones.
- **Audit finding:** High, mobile. `/modalities/icp/` overflows to 402 px at a 375 px viewport;
  `.prose-mnm` is `overflow-x: visible`, so tables are not wrapped.
- **Effort:** Quick win (CSS-level).
- **Touches:** mobile and tablet primarily; verify desktop unchanged; both themes.

#### `[ ]` A2. Theme the mermaid diagrams for light mode (and fix node sizing)
- **What:** mermaid nodes currently stay dark navy on the light page (a dark island). Make mermaid
  theme-aware (re-render or re-color on theme change) and size node boxes to their labels so text
  is not clipped.
- **Audit finding:** High, light theme. Measured: light page `#F8FAFC` but node fill stays
  `#13243A`. Also the clipped "Allow modest MAP variability to bu..." node.
- **Effort:** Quick to moderate.
- **Touches:** light theme specifically (verify dark unchanged); all breakpoints; every integration
  page that uses mermaid.

#### `[ ]` A3. Enlarge tap targets toward the comfortable 44 px
- **What:** raise header icon controls (search, theme, menu) and primary buttons toward 44 px on
  touch.
- **Audit finding:** Moderate, accessibility and touch. Today header icons measure about 25 to
  28 px and buttons about 37 px tall (above the 24 px floor, below comfortable).
- **Effort:** Quick win.
- **Touches:** mobile and tablet primarily; both themes; verify desktop layout unchanged.

#### `[ ]` A4. Fix the recurring bold-runs-into-next-word spacing typos
- **What:** correct the MDX bold-adjacency spacing defect, for example "Neurology 2011,pooled"
  (homepage stat) and "public pagesuntil" / "Analytics(when enabled" (privacy policy). Grep the
  whole content set for the same pattern.
- **Audit finding:** Low, content polish (recurring).
- **Effort:** Quick win.
- **Touches:** content (MDX). NOTE: this touches CONTENT; verify each change carefully and confirm
  no clinical meaning is altered. All themes/breakpoints unaffected (text only).

#### `[ ]` A5. Polish the reviewer login page
- **What:** center the form in a card, add real field labels (not placeholder-only), add
  `aria-expanded` to the menu toggle, and reconcile the review sub-nav and "Sign out" showing when
  logged out, so the page matches the site's quality.
- **Audit finding:** Low to moderate, polish and trust. It is technically public-facing (and gated
  behind Cloudflare Access in production).
- **Effort:** Quick win.
- **Touches:** `/review/login/`; both themes; mobile to desktop.

#### `[ ]` A6. Make the cookie consent banner use theme tokens
- **What:** the banner is currently hardcoded dark (`#0b1220` and similar), so it stays dark in
  light mode. Drive it from the design tokens so it adapts.
- **Audit finding:** Noted (light-theme / token-consistency gap). Banner only renders in builds
  where `NEXT_PUBLIC_GA_ID` is set, so assess live in production.
- **Effort:** Quick win.
- **Touches:** light theme specifically; verify in a GA-enabled build; all breakpoints.

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
  reading cap is itself a strength and should be kept.

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

Nothing yet. Items move here on merge, newest first, with PR number and merged SHA.

### Changelog

- (none yet)
