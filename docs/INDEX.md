# MNM-Edu Documentation Index

This INDEX is the entry point for all project documentation. Start here to learn which docs are
authoritative, which is the active roadmap to production, and which are historical and should not be
relied on. When two docs disagree, follow the freshness tags below.

Freshness tags: **Canonical** (source of truth) · **Current** (accurate, may have minor drift) ·
**Active roadmap** (the operational plan) · **Historical** (superseded, kept for record only).

---

## Canonical / current (source of truth)

The verified, code-grounded audit set. These take precedence over every other doc when there is a
conflict.

- [`_audit/CURRENT_STATE.md`](./_audit/CURRENT_STATE.md): **Canonical.** The verified ground-truth
  snapshot: stack, exact counts, route list, data and version constants, what the homepage hero
  actually is, and build/test/CI status. The source of truth for counts, stack, and structure.
- [`_audit/ARCHITECTURE_NOTES.md`](./_audit/ARCHITECTURE_NOTES.md): **Canonical.** How the system
  actually fits together today (static-export model, MDX content pipeline, widget contract,
  theming/tokens, search, build-time generators), written from the code.
- [`_audit/DOC_RECONCILIATION.md`](./_audit/DOC_RECONCILIATION.md): **Canonical.** Freshness verdicts
  (Current / Partly-stale / Obsolete) for every existing doc, with the specific discrepancies found.
- [`_audit/OPEN_QUESTIONS.md`](./_audit/OPEN_QUESTIONS.md): **Canonical.** Unresolved decisions and
  ambiguities that the repository alone could not settle, phrased as questions for the owner.

---

## Active roadmap (the plan to production)

- [`MNM_PRODUCTION_PLAN_v1.md`](./MNM_PRODUCTION_PLAN_v1.md): **Active roadmap.** The operational plan
  to production for MNM-Edu. This is the authoritative path-to-production document and **supersedes
  the path-to-production notes in `ENGINEERING_OVERVIEW.md` section 18**; where the two differ, follow
  this plan.

---

## Reference / supporting (still useful)

- [`ENGINEERING_OVERVIEW.md`](./ENGINEERING_OVERVIEW.md): **Current** (minor drift). Broad narrative
  reference for architecture, UI/UX, content, data, and build. Accurate overall, but defer to
  [`_audit/CURRENT_STATE.md`](./_audit/CURRENT_STATE.md) where they disagree (e.g. reference count,
  widget-folder phrasing, figure status), and to the Active roadmap for the production path.
- [`editorial-guidelines.md`](./editorial-guidelines.md): **Current** (mostly). Content tone,
  pediatric-first framing, and citation-key rules still match house practice. Treat its
  "detail levels" and "12-section" notes as outdated (see Historical theme below).
- [`deployment.md`](./deployment.md): **Current** (mostly). Hosting recipes, search-index note, and
  versioning guidance are accurate. Ignore the post-deploy check that mentions a detail-level toggle
  in the header (that toggle was removed).

---

## Historical / superseded (do not rely on)

Kept for the build record. Do not use these for current counts or behavior.

- [`PHASE_SUMMARIES.md`](./PHASE_SUMMARIES.md): **Historical.** Build-phase narrative with stale
  counts (24 modalities / 10 integration vs the current 27 / 18) and a "deferred" list for light
  theme, PWA, and i18n that have all since shipped.
- [`detail-level-authoring.md`](./detail-level-authoring.md): **Historical.** Describes the
  Essentials / Deep-Dive reading-mode split, which has been removed. The `Essentials` / `DeepDive` /
  `Detail` components are now pass-throughs that render their children unchanged.

---

## Notes

- The Essentials / Deep-Dive removal is the most common stale theme across the older docs; it touches
  README, `editorial-guidelines.md`, `detail-level-authoring.md`, `deployment.md`, and
  `DEPLOYMENT_NOTES.md`. Treat any description of a reading-mode toggle as outdated.
- This index links and describes documents only; it does not modify them. For the verdicts behind each
  freshness tag, see [`_audit/DOC_RECONCILIATION.md`](./_audit/DOC_RECONCILIATION.md).
