# OPEN_QUESTIONS: things the repo alone could not settle

Phrased as questions for the project owner. None of these were acted on (read-only audit). They are
grouped by theme. Each notes what was observed so you have the context to answer.

---

## Version control and CI

1. **Is this directory meant to be a git repository?** No `.git` was found at
   `C:\Users\ahmed\Documents\neurosim website`. The related NeuroSim ICU simulator project lives under
   a different path and has its own worktrees. Is the website tracked elsewhere, intentionally
   untracked, or is version control a missing step?
2. **Is there a CI expectation before production?** No `.github/workflows` (or GitLab/Circle) config
   exists. The quality gates (`typecheck`, `lint`, `test`, `test:e2e`, `build`) are all manual today.
   Should these be wired into CI, and against which host/deploy hook?

## OG images (concrete gap)

3. **Should `scripts/generate-og.mjs` be part of the build?** It writes `public/og/...` but is not
   referenced in `package.json` scripts, so OG output is frozen at the last manual run. As a result
   **11 pages reference an OG image that does not exist** (3 modalities: `advanced-nirs`,
   `fontanelle-us`, `pediatric-stroke-monitoring`; 8 integration scenarios listed in
   `CURRENT_STATE.md` §9). Should I (in a future, non-read-only task) wire it as a `prebuild` step and
   regenerate, or is OG coverage out of scope for v1?

## In-code stale counts (user-visible)

4. **The "24 modalities / Twenty-four" copy is wrong (repo has 27).** It appears in
   `src/app/page.tsx` (metadata), `src/app/about/page.tsx`, and `src/app/modalities/page.tsx` (the
   page title "Twenty-four monitors, one template"). Do you want these updated to 27, or is the count
   deliberately frozen for some reason? (Recorded as a finding only; not changed.)

## Removed detail-level system

5. **Are the `Essentials` / `DeepDive` / `Detail` pass-through shims permanent?** The split was
   removed (`Detail.tsx` renders children unchanged) but the wrappers are still registered and still
   used inside MDX. Keep them as no-op shims indefinitely for backward compatibility, or schedule a
   content pass to strip them and the related docs?
6. **Should `SpeakerNote` be removed from the MDX scope?** It is still registered in
   `components.tsx`, though the house style (`claude-code-tasks/00-style-guide.md`) forbids its use in
   new content. Keep available, or remove to enforce the rule structurally?

## Documentation governance

7. **Which document is the canonical source of truth going forward:** `docs/ENGINEERING_OVERVIEW.md`,
   or this `docs/_audit/` set, or a new `docs/INDEX.md` that points to the right one? Several existing
   docs disagree with each other and with the code; a single declared canonical doc would resolve it.
8. **Two README-referenced how-to docs do not exist** (`docs/adding-a-modality.md`,
   `docs/adding-a-widget.md`). Should these be written, or should the README pointers be removed?
9. **Is `modalities-for-review.md` a living artifact or a one-time export?** It is a 3082-line bundle
   produced by `scripts/bundle-modalities.mjs`. Should it be regenerated on a cadence (and by whom),
   or retired?

## Structure and naming

10. **Is the `shared/` vs `_shared/` split under `widgets/` intentional?** Both are used and serve
    different purposes (`shared/` = WidgetShell + useCanvas; `_shared/` = correlation engine), so this
    is not a bug, but the near-identical names are easy to confuse. Consolidate/rename, or leave as is?
11. **Is `src/content/pediatrics/` meant to stay empty?** The pediatrics hub is data-driven
    (`pediatric-norms.ts` + the `AgeBandNorms` widget) and there are no MDX files in that folder. Is
    the empty content dir a placeholder for future chapters, or should it be removed?
12. **Widget-registry vs widget-folder reconciliation.** There are 42 widget folders and 42
    `WidgetEmbed` registry entries, but the audit did not confirm a 1:1 mapping (some widgets may be
    embedded directly or via the homepage rather than the registry; some folders may be unreferenced).
    Do you want a definitive "every widget folder is embedded somewhere and tested" reconciliation as
    a follow-up?

## Clinical / informational validation (flagged, not assessed here)

13. **This audit verified structure and counts, not clinical accuracy.** Thresholds, trial figures,
    drug doses, and reference volume/page numbers were not re-checked against the literature in this
    pass. Confirm that clinical sign-off is tracked separately (a prior audit checklist exists at
    `claude-code-tasks/07-content-audit.md`); should a fresh clinical pass be scheduled before
    production?

## Hosting and release

14. **What is the production target and cache strategy?** The static bundle is host-agnostic
    (`docs/deployment.md` lists options). Is a specific host/domain chosen, and should the audit
    follow-up include a deploy runbook and cache-header recommendation?

## Content cross-links (recorded during Phase 1)

15. **Two referenced foundation pages do not exist (possible content gaps).** The Phase 1
    content-integrity validator found internal links to `/foundations/prognostic-timing/`
    (`family-communication-mnm`, `wlst-organ-donation`) and `/foundations/cerebral-perfusion/`
    (`pediatric-stroke-ais`). Phase 1 removed the prognostic-timing links and retargeted
    cerebral-perfusion to the autoregulation foundation. Recorded in case a dedicated "prognostic
    timing" or "cerebral perfusion / CBF" foundation page is worth authoring later.

## Build artifacts (revisit at Phase 5)

16. **`public/og/*` and `public/search-index.json` are build-generated** (OG via the `prebuild` hook,
    search index by `next build`) and may later be gitignored once deploy-time generation is
    confirmed. Kept tracked for now to stay safe; revisit when the Phase 5 deploy pipeline is finalized.
