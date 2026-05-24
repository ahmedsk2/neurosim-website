# DOC_RECONCILIATION: existing docs vs verified code

Each existing documentation file is classified **CURRENT** / **PARTLY-STALE** / **OBSOLETE** based on
the ground truth in `CURRENT_STATE.md`. Discrepancies are specific. Recommendations are advisory only;
**no doc was edited as part of this audit** (the read-only constraint allows writing only under
`docs/_audit/`).

Legend: 🟢 CURRENT · 🟡 PARTLY-STALE · 🔴 OBSOLETE

---

## Summary table

| Doc | Verdict | Headline reason | Recommendation (advisory) |
|---|---|---|---|
| `README.md` | 🟡 PARTLY-STALE | 12-section template (now 18); Essentials/Deep Dive authoring (removed); links 2 missing how-to docs | Update |
| `DEPLOYMENT_NOTES.md` | 🟡 PARTLY-STALE | 38 widgets / 152 refs / 55 routes / 46 tests; "useDetailLevel" (removed); "OG per page" (incomplete) | Update or mark historical |
| `docs/PHASE_SUMMARIES.md` | 🔴 OBSOLETE | 24 modalities / 10 integration; light theme + PWA + i18n listed as deferred but all shipped | Mark obsolete or rewrite |
| `docs/editorial-guidelines.md` | 🟡 PARTLY-STALE | 12-section template; Essentials/Deep Dive detail levels | Update (tone/citation rules still good) |
| `docs/detail-level-authoring.md` | 🔴 OBSOLETE | Entire doc describes the Essentials/Deep Dive toggle, which is now a pass-through | Mark obsolete or delete |
| `docs/deployment.md` | 🟡 PARTLY-STALE | Post-deploy check references the removed detail toggle; hosting recipes still valid | Minor update |
| `docs/ENGINEERING_OVERVIEW.md` | 🟢 CURRENT (minor drift) | 307 refs (actual 306); "44 widget folders" (42 + 2 shared); figure provenance now complete | Small corrections |
| `modalities-for-review.md` | 🟡 PARTLY-STALE (artifact) | A frozen bundled export of modality content for external review, not a spec | Regenerate when needed |

---

## Detail

### `README.md`: 🟡 PARTLY-STALE
- **"12-section template" (line ~35):** modality pages now follow an 18-section Tier-1 spine
  (`claude-code-tasks/00-style-guide.md`, exemplar `src/content/modalities/tcd.mdx`).
- **Essentials / Deep Dive authoring block (lines ~51-59):** the split was removed; the wrappers are
  pass-throughs (`src/components/content/Detail.tsx`). The "wrap content with `<Essentials>` /
  `<DeepDive>`" guidance no longer reflects behavior.
- **Broken doc links:** references `docs/adding-a-modality.md` and `docs/adding-a-widget.md`. Neither
  file exists.
- **Stack claims are CORRECT:** Next.js 15, React 19, TS strict, Tailwind, `output:'export'`,
  Fuse.js, KaTeX, Mermaid all verified.
- Already carries an audit-added banner pointing to `docs/ENGINEERING_OVERVIEW.md`.
- *Recommendation:* update the template count, remove/replace the detail-level section, fix or remove
  the two dead links.

### `DEPLOYMENT_NOTES.md`: 🟡 PARTLY-STALE
- **Counts (verified actual in parentheses):** 38 widgets (42 folders), 152 references (306), 55
  routes (68), 46 unit tests (48), 29 widgets in the catalog (42), 9 foundation chapters (9, correct),
  24 modality pages (27), 10 integration scenarios (18).
- **"All widgets read `useDetailLevel()`":** the detail-level system was removed; this no longer
  holds.
- **"OG images per page":** incomplete. 44 OG SVGs exist; 11 pages (3 modalities + 8 integration)
  have no OG image (`CURRENT_STATE.md` §9).
- **Pediatric data "9 normative-value rows":** now 11 rows (`NORMS`).
- Already carries an audit-added "superseded counts" banner.
- *Recommendation:* either refresh all counts or retain explicitly as a historical build record and
  point to `CURRENT_STATE.md`.

### `docs/PHASE_SUMMARIES.md`: 🔴 OBSOLETE
- Lists **24 modality pages** and **10 integration scenarios** (now 27 and 18).
- "Known limits / deferred" lists **light theme** ("reserved but not implemented"), **PWA**
  ("manifest / service worker not wired"), and **i18n (FR/AR)** ("deferred") as not-done. All three
  are present in the codebase now (light theme tokens in `globals.css`, `public/sw.js` +
  `ServiceWorkerRegister`, `src/lib/i18n.ts` + `LocalePicker`).
- Lists several "deferred to v1.1" widgets (Cushing, plateau-wave, SD animator, osmotherapy) that now
  exist as widget folders.
- *Recommendation:* mark as a historical build narrative (it is accurate as a record of phases) or
  rewrite against current state.

### `docs/editorial-guidelines.md`: 🟡 PARTLY-STALE
- **"Detail levels" section:** describes Essentials (default) + Deep Dive with word targets; this
  authoring model is retired (pass-through wrappers).
- **"12 sections" authoring checklist:** now an 18-section Tier-1 spine.
- **Tone, pediatric-first, citation-key, and "In children" rules are CURRENT** and still match house
  practice.
- *Recommendation:* update the detail-level and section-count parts; keep the tone/citation guidance.

### `docs/detail-level-authoring.md`: 🔴 OBSOLETE
- The whole document teaches how to author with the Essentials/Deep Dive toggle ("two reading modes,
  switchable at any time, persisted across sessions"). That toggle no longer exists; the components
  render children unconditionally (`Detail.tsx`).
- *Recommendation:* mark obsolete or delete; if the split may return, keep it but add a clear
  "NOT CURRENTLY ACTIVE" header.

### `docs/deployment.md`: 🟡 PARTLY-STALE
- Hosting recipes (Cloudflare Pages, GitHub Pages, Vercel, rsync), search-index note, and versioning
  note are **accurate**.
- **Post-deployment check** says to verify a chapter "renders with both detail levels (toggle in the
  header)". The toggle is gone.
- *Recommendation:* drop the detail-toggle check line; otherwise current.

### `docs/ENGINEERING_OVERVIEW.md`: 🟢 CURRENT (minor drift)
- Created in a prior session; the most accurate existing doc. Verified-correct on: stack, static
  export, content counts (9/27/18), 68 routes, `REFERENCES_VERSION 2026-05-17`, glossary "30+"
  (actual 31), Essentials/Deep-Dive removed, no CI.
- **Drift to correct:** says **307 references** (actual **306**, off by one, counted the interface
  `key:` field); says **"44 widget folders"** (actual **42 widget folders + 2 shared utility
  folders**); describes **figure provenance as mid-transition with files still to add** (all 6
  commissioned PNGs now exist on disk).
- **Did not surface** the OG-coverage gap (11 pages) or the in-code "24 modalities" strings; this
  audit adds them.
- *Recommendation:* small corrections (reference count, widget-folder phrasing, figure status), then
  it can remain the canonical narrative reference alongside this `_audit` set.

### `modalities-for-review.md` (repo root): 🟡 PARTLY-STALE (artifact, not a spec)
- A 3082-line bundled export of every modality page's frontmatter + MDX body, generated for external
  review (`scripts/bundle-modalities.mjs`). Its header still references `<DeepDive/>` as a live
  wrapper.
- It is a point-in-time snapshot, not living documentation. Freshness depends on when it was last
  regenerated.
- *Recommendation:* regenerate on demand before a review cycle; not something to hand-maintain.

---

## Cross-cutting doc issues

1. **No `docs/INDEX.md`.** There is no catalog telling a reader which doc is canonical vs historical.
   The `_audit/` set plus a one-line index would resolve the "which doc do I trust" problem.
2. **Two how-to docs are referenced but absent** (`docs/adding-a-modality.md`,
   `docs/adding-a-widget.md`), so the README's "see …" pointers dead-end.
3. **The Essentials/Deep-Dive removal is the single most common stale theme**, appearing in README,
   editorial-guidelines, detail-level-authoring, deployment, and DEPLOYMENT_NOTES.
