# MNM-Edu — Operational Development Plan to Production

> A full operational plan to take MNM-Edu (the pediatric multimodal neuromonitoring educational website) from feature-complete v1 to a validated, maintained, production resource. Three workstreams run through it: (A) engineering validation and hardening, (B) software/dependency modernization, and (C) a validator review system through which clinical and editorial experts log in, read pages, mark findings, and feed a single reviewable database that an administrator triages and assigns. Grounded in the verified 2026-05-24 filesystem audit (`docs/_audit/`).

---

## 0. The one decision everything hinges on

**The public site is a 100% static export (`output: 'export'`) with no backend, no database, and no auth.** That is a feature: zero attack surface, no PHI, hostable anywhere, survives spikes. The validator review system you want — login, mark findings, write to one database, admin triage — **cannot live inside a static site**, because login and a writable database both require a server.

There are three ways to resolve this. The plan recommends the third.

| Option | What it means | Verdict |
|---|---|---|
| **1. Convert the site to a server app** | Drop `output:'export'`, add Next.js server routes, a database, and auth into the one app. | **Rejected.** Throws away the static-export benefits (security, cacheability, host-agnosticism) for the whole public site just to serve a handful of internal reviewers. Wrong trade. |
| **2. Build a fully custom backend** | Stand up your own API server + database + auth from scratch, deployed separately. | **Possible but heavy.** Maximum control, maximum build-and-maintain cost. Overkill for an internal review tool. |
| **3. Keep the static public site; add a separate authenticated Review Console backed by a managed backend (Supabase)** | The public site stays exactly as it is. A second, small app — the **Review Console** — renders the same content pages with an annotation overlay, behind a login, and reads/writes findings to a managed Postgres + Auth service (Supabase). | **Recommended.** The public site keeps every static-export advantage; reviewers get real auth + a real relational database + row-level security + an audit trail, with almost no server to operate. |

Everything below assumes **Option 3**. Section 6 specifies it fully. (Supabase is the concrete recommendation; Pocketbase self-hosted or Firebase are drop-in alternatives if you prefer — the data model and workflow are portable.)

---

## 0.5 Toolchain (active plugins and skills)

**Purpose:** record the Claude Code plugins and skills this project actually relies on, so the expected toolchain state is documented and a future session can confirm it. Verified by a read-only toolchain audit (2026-05-24).

**Active and relied on.**

| Tool | What it is | Role |
|---|---|---|
| **superpowers** | Plugin, v5.1.0, active. Sourced via the `claude-community` marketplace. | General engineering discipline skills. |
| **feature-dev** | Plugin, active. The `feature-dev` skill plus the code-architect, code-explorer, and code-reviewer agents. | Primary asset for the Phase 3 Review Console build. |
| **code-simplifier** | Plugin (agent), active. | Used during Phase 2 dependency-update waves. |
| **skill-creator** | Session skill, no install. | Kept in reserve to author a custom skill only if a genuinely repeated, well-defined task emerges. |
| **code-review** | Session skill, no install. | Run on every PR alongside CI. |

**Phase mapping.**

- **Phase 1 (engineering hardening):** `code-review` + CI gates.
- **Phase 2 (dependency waves):** `code-simplifier` + `code-review`.
- **Phase 3 (Review Console):** `feature-dev` and its architect/reviewer agents.
- **All phases:** `superpowers` for general discipline.

**Deliberately not built (decision recorded).** The functions of a "quality-gates", "test-runner", and "domain-grounding" skill are intentionally not implemented as custom Claude skills, because each is already covered more reliably elsewhere:

| Skill not built | Why, and what covers it instead |
|---|---|
| **quality-gates** | The CI workflow (Section 3, Phase 0.2) and the build-time content-integrity assertions (Section 4, Phase 1.1). Enforced by the pipeline, not by invoking a skill. |
| **test-runner** | The existing `npm run test` (Vitest) and `npm run test:e2e` (Playwright + axe) scripts, automated in CI. |
| **domain-grounding** | The human clinical-validation track (Section 7, Phase 4), where the reviewer panel verifies thresholds, doses, and evidence grades through the Review Console. A skill cannot substitute for a clinician confirming a dose against the cited trial. |

If a repeated, well-defined task later justifies a custom skill, author it with `skill-creator` at that point rather than pre-building it now.

**Working-directory requirement (action before Phase 0).** Project-scoped Claude config and skills load relative to the directory Claude is launched from. A prior session ran from the `neuro sim project` folder while this website lives in `neurosim website` (two different folders). Before Phase 0, standardize on launching Claude Code from the website's own directory, or move any project-scoped config to user-level `~/.claude/` so it is cwd-independent. This gates whether the Git init, CI config, and all plan artifacts land in the correct repo.

---

## 1. Guiding principles and constraints

- **The public site stays static and unchanged in character.** No backend creeps into it. The Review Console is a separate deployment that happens to render the same MDX content.
- **No PHI, ever** — neither site touches patient data. The Review Console stores only reviewer accounts and findings about *content*. This keeps the whole project out of clinical-data regulatory scope.
- **Findings are pinned to a content version.** Every finding records the git commit SHA (or content hash) of the page it was filed against, so "this was reviewed at version X" is always answerable and findings never silently rot when a page changes.
- **Two validation tracks, one funnel.** Engineering findings and clinical/editorial findings flow into the *same* findings database with a `category` field, so the administrator has one queue, one export, one source of truth.
- **Auditability is a first-class requirement.** Because this underpins clinical sign-off, every status change is logged immutably (who, what, when). A reviewer's sign-off must be attributable.
- **Version control and CI come first.** The audit found no `.git` at the project path and no CI. Nothing else in this plan is safe until that is fixed (Phase 0).

---

## 2. Workstream and phase map

```
Phase 0  Foundation            git, CI, dependency baseline, env hygiene        (prerequisite)
Phase 1  Engineering hardening  integrity checks, OG, a11y, perf, fix stale copy (Workstream A)
Phase 2  Software modernization dependency + toolchain updates in controlled waves (Workstream B)
Phase 3  Review Console build   auth + DB + annotation overlay + admin dashboard  (Workstream C)
Phase 4  Informational validation  clinical/editorial reviewers drive findings via Console
Phase 5  Pre-launch hardening   resolve blockers, security review, launch runbook
Phase 6  Post-launch operations recurring re-curation, monitoring, governance
```

Phases 1, 2, and 3 can run in parallel once Phase 0 is done (different skills: A is web-eng, B is eng, C is full-stack). Phase 4 depends on Phase 3 being live. Phase 5 gates the public launch.

---

## 3. Phase 0 — Foundation (prerequisite, ~1 week)

Nothing is reproducible or safe to change until these exist.

### 0.1 Version control
- Initialize git at the project root (the audit found no `.git` there).
- Establish a `.gitignore` (node_modules, `out/`, `.next/`, `.env*`, editor cruft).
- Push to a private remote (GitHub/GitLab).
- Adopt a branch model: `main` (protected, deployable) + short-lived feature branches + PRs. No direct pushes to `main`.
- Tag the current state as `v1.0.0-pre-validation` so there is a named baseline.

### 0.2 Continuous integration
- Add a CI workflow (GitHub Actions assumed) that runs on every PR and on `main`:
  - `npm ci` (clean install from lockfile)
  - `npm run typecheck`
  - `npm run lint`
  - `npm run test` (Vitest)
  - `npm run test:e2e` (Playwright + axe)
  - `npm run build` (must produce `out/` cleanly with all 68 routes)
- Block merge to `main` unless all gates pass. This is the single highest-leverage production-readiness step.

### 0.3 Environment + secrets hygiene
- Standardize on a documented Node version (`.nvmrc`).
- Confirm the lockfile is committed and authoritative.
- Establish `.env.example` for the Review Console (Supabase URL + anon key live in env, never in code).

### 0.4 Documentation governance (closes audit OPEN_QUESTIONS #7)
- Create `docs/INDEX.md` declaring the canonical source of truth: the `docs/_audit/CURRENT_STATE.md` snapshot, refreshed each release.
- Mark `PHASE_SUMMARIES.md` and `detail-level-authoring.md` as historical (header banner), or move them to `docs/_archive/`.
- This stops the "which doc do I trust" drift permanently.

**Phase 0 exit criteria:** repo is under version control with a protected `main`; every PR runs the full gate suite in CI; a canonical doc index exists.

---
## 4. Phase 1 — Engineering validation and hardening (Workstream A)

Each item is an independent, testable unit of work. Most map directly to findings in the audit.

### 4.1 Build-time integrity assertions (turn conventions into gates)
Today these are conventions; make them fail the build if violated:
- Every `<Cite id>` resolves in `src/data/references.ts`.
- Every `<Figure src>` points to a file that exists in `public/images/`.
- Every `<WidgetEmbed name>` exists in the `WidgetEmbed` registry.
- Every internal cross-link target route exists.
- Em-dash check (house rule: U+2014 count must be 0 in content).
Wire these as a `validate-content` script run inside CI.

### 4.2 Close the OG-image gap (audit finding #1)
- Wire `scripts/generate-og.mjs` into the build as a `prebuild` step so OG images regenerate on every build.
- Confirm coverage for all 27 modalities + 18 integration + 9 foundations + default (currently 11 pages reference an OG image that does not exist).
- Add an integrity assertion: every page's referenced OG file exists post-build.

### 4.3 Fix user-visible stale counts (audit finding #2)
- Update "24 modalities / Twenty-four" → 27 in `src/app/page.tsx` metadata, `src/app/about/page.tsx`, and the `src/app/modalities/page.tsx` title.
- Better: derive the count from `modalities.ts` length so it can never drift again.

### 4.4 Widget registry reconciliation (audit OPEN_QUESTIONS #12)
- Confirm all 42 widget folders are embedded somewhere and that the 42 registry entries map 1:1.
- Retire or document any orphan folder.
- Confirm the 9 tested widgets are the high-risk-math ones; add engine tests where physiology logic is untested.

### 4.5 Accessibility pass (WCAG 2.1/2.2 AA)
- Extend the axe-core sweep from representative routes to all 68.
- Resolve or formally accept the residual translucent-hover-contrast items the overview noted.
- Verify the 3D hero's reduced-motion path and the Review Console's own a11y (Section 6.9).

### 4.6 Performance budget
- Measure the three.js hero on low-end devices; confirm the IntersectionObserver pause and reduced-motion fallback hold.
- Set a first-load JS budget; confirm widgets stay code-split (lazy, `ssr:false`).
- Lighthouse target: Performance > 85 desktop, > 75 mobile; all other categories > 90.

### 4.7 Cross-browser / responsive matrix
- Verify figures, the homepage 3D, and widget canvases across Chrome, Safari, Firefox at mobile/tablet/desktop breakpoints.

### 4.8 SpeakerNote + detail-shim cleanup (audit findings #5, #6)
- Decide: strip the `Essentials`/`DeepDive`/`Detail` pass-through shims and `SpeakerNote` from the MDX scope (and content), or keep as documented no-ops. Recommendation: schedule a content pass to remove them so the scope reflects reality.

**Phase 1 exit criteria:** content-integrity, OG, and stale-count assertions pass in CI; axe is clean across all 68 routes; Lighthouse budgets met; widget registry reconciled.

---

## 5. Phase 2 — Software / dependency modernization (Workstream B)

"Update all the software" — done methodically, in waves, behind the CI gates from Phase 0, never in one big-bang bump.

### 5.1 Establish the baseline
- Run `npm outdated` and `npm audit` and capture the full table (current / wanted / latest) as `docs/_audit/DEPENDENCY_BASELINE.md`. (Claude Code prompt at the end gathers this — exact live versions should come from the repo, not be guessed.)
- Categorize each dependency: **patch/minor** (safe), **major** (needs migration review), **security** (prioritize), **dev-only** (lower risk).

### 5.2 Update in controlled waves, each its own PR
1. **Wave 1 — security + patch + minor.** Low risk. `npm update` within semver ranges, plus `npm audit fix`. Full CI gate. Merge.
2. **Wave 2 — toolchain majors** (TypeScript, Vitest, Playwright, ESLint, lint configs). Update one at a time; fix breakage; gate; merge.
3. **Wave 3 — framework + runtime majors**, the highest-risk:
   - **Next.js / React.** Already on Next 15.1.6 / React 19 (current generation) — likely only minor bumps; confirm against latest 15.x and the static-export contract still holds.
   - **Tailwind 3.4 → 4.x.** This is a *real migration* (CSS-first config, `@theme`, breaking utility changes). Treat as its own project with a dedicated PR, visual-regression review across representative pages, and a rollback plan. Do NOT bundle with other updates.
   - **three.js / simplex-noise.** three.js has frequent breaking minors; pin and test the hero specifically (WebGL init, dispose, reduced-motion).
4. **Wave 4 — content/MDX pipeline** (`@next/mdx`, `next-mdx-remote`, remark/rehype/KaTeX/Mermaid). Re-render a sample of every content kind and diff output; math and Mermaid are the fragile points.

### 5.3 Lock and document
- Commit the updated lockfile each wave.
- Record the final versions in `DEPENDENCY_BASELINE.md` and stamp the date.
- Add a recurring cadence (Section 9): `npm outdated`/`npm audit` reviewed monthly, security advisories actioned within an agreed SLA.

### 5.4 Standing dependency hygiene
- Optionally add Dependabot/Renovate to open update PRs automatically; CI gates catch regressions before merge.

**Phase 2 exit criteria:** zero known security advisories; all majors either updated-and-green or explicitly deferred with a reason; lockfile committed; baseline doc stamped.

---
## 6. Phase 3 — The Validator Review System (Workstream C)

This is the mechanism you asked for: validators log in, read pages, mark points for improvement, and submit them as detailed jobs into one database that an administrator reviews and assigns. Specified to a professional standard: roles, schema, workflow, security, audit, and admin tooling.

### 6.1 Architecture overview

```
┌─────────────────────────┐         ┌──────────────────────────────┐
│  PUBLIC SITE (unchanged) │         │  REVIEW CONSOLE (new, gated)  │
│  Next.js static export   │         │  Next.js app, auth-protected  │
│  output:'export'         │         │  renders the SAME MDX content │
│  no backend, no DB        │         │  + annotation overlay         │
└─────────────────────────┘         └───────────────┬──────────────┘
                                                     │ HTTPS (RLS-enforced)
                                                     ▼
                                     ┌──────────────────────────────┐
                                     │  SUPABASE (managed backend)   │
                                     │  • Auth (magic-link / SSO)     │
                                     │  • Postgres (findings, users)  │
                                     │  • Row-Level Security          │
                                     │  • Storage (optional uploads)  │
                                     │  • Auto REST + realtime         │
                                     └──────────────────────────────┘
```

- The **Review Console** is a separate app (`mnm-review/`) sharing the content source so reviewers see the *real* pages, section-for-section, with the same heading anchors the public site uses (the audit confirmed `rehype-slug` gives every heading a stable slug — that is the anchor a finding attaches to).
- It is deployed privately (behind auth; optionally IP-restricted or on an internal domain). It is **not** part of the public static bundle.
- Supabase supplies auth, the database, row-level security, and an auto-generated API, so there is almost no server code to write or operate.

### 6.2 Roles

| Role | Can do |
|---|---|
| **Validator** (clinical or editorial reviewer) | Log in; read all pages; create findings; comment; edit/withdraw their own findings while still `open`; verify that a resolved finding is actually fixed. |
| **Administrator** | Everything a validator can, plus: triage findings; set severity/priority; assign to an implementer; change status across the full workflow; close/reject; export to-do batches; manage user accounts and roles; view metrics. |
| **Implementer** (optional, often the dev/Claude Code operator) | See assigned findings; move them `in_progress` → `resolved`; attach a resolution note + the commit/PR that fixed them. |
| **Observer** (optional) | Read-only access to findings and dashboards (e.g. a department head). |

Roles live on the `profiles` row and are enforced by row-level security, not just UI.

### 6.3 Data model (Postgres / Supabase)

Enumerated types keep the data clean and the dashboards filterable.

```sql
-- ENUMS
create type finding_severity as enum ('blocker','major','minor','nitpick');
create type finding_category as enum (
  'clinical-accuracy',  -- a clinical fact/threshold/dose is wrong or unsafe
  'citation',           -- missing, wrong, or unverifiable reference
  'evidence-grade',     -- the evidence label overstates/understates the data
  'figure',             -- anatomy/diagram inaccuracy or missing figure
  'pediatric-specific', -- pediatric nuance missing or incorrect
  'typo-grammar',       -- copy editing
  'accessibility',      -- a11y defect
  'code-bug',           -- widget/interaction defect
  'ux-clarity',         -- confusing layout/flow
  'other'
);
create type finding_status as enum (
  'open',         -- newly filed by a validator
  'triaged',      -- admin has reviewed and categorized
  'accepted',     -- agreed to be actioned
  'in_progress',  -- implementer is working it
  'resolved',     -- implementer says fixed (awaiting verification)
  'verified',     -- a validator confirms the fix is correct
  'closed',       -- done and verified
  'wontfix',      -- deliberately not actioning (reason required)
  'duplicate'     -- merged into another finding
);
create type user_role as enum ('validator','admin','implementer','observer');

-- USERS (extends Supabase auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'validator',
  specialty text,             -- e.g. "Pediatric neurocritical care"
  credentials text,           -- e.g. "MD, PICU consultant"
  conflict_of_interest text,  -- declared COI, for sign-off credibility
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- PAGES (synced from content at each build/deploy)
create table pages (
  id uuid primary key default gen_random_uuid(),
  kind text not null,             -- 'foundation' | 'modality' | 'integration' | 'other'
  slug text not null,
  title text not null,
  git_sha text not null,          -- content version this row reflects
  content_hash text not null,     -- hash of the rendered page body
  last_synced_at timestamptz not null default now(),
  unique (kind, slug)
);

-- FINDINGS (the heart of the system)
create table findings (
  id bigint generated always as identity primary key,
  page_id uuid not null references pages(id),
  section_anchor text,            -- heading slug the finding is attached to (nullable = whole page)
  quoted_text text,               -- the exact passage the reviewer is flagging
  author_id uuid not null references profiles(id),
  severity finding_severity not null,
  category finding_category not null,
  status finding_status not null default 'open',
  title text not null,            -- one-line summary
  detail text not null,           -- what is wrong and why
  suggested_fix text,             -- the reviewer's proposed correction
  suggested_citation text,        -- supporting reference for the correction
  page_git_sha text not null,     -- version the finding was filed against (pinned)
  assigned_to uuid references profiles(id),
  priority int,                   -- admin-set ordering within severity
  resolution_note text,           -- what the implementer actually did
  resolved_by uuid references profiles(id),
  resolved_at timestamptz,
  verified_by uuid references profiles(id),
  verified_at timestamptz,
  duplicate_of bigint references findings(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- THREADED DISCUSSION on a finding
create table finding_comments (
  id bigint generated always as identity primary key,
  finding_id bigint not null references findings(id) on delete cascade,
  author_id uuid not null references profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

-- IMMUTABLE AUDIT LOG (every status/assignment change)
create table finding_audit (
  id bigint generated always as identity primary key,
  finding_id bigint not null references findings(id),
  actor_id uuid not null references profiles(id),
  action text not null,           -- 'created','status_change','assigned','edited','commented'
  from_status finding_status,
  to_status finding_status,
  detail jsonb,
  at timestamptz not null default now()
);

-- OPTIONAL: screenshot/file attachments (Supabase Storage)
create table finding_attachments (
  id bigint generated always as identity primary key,
  finding_id bigint not null references findings(id) on delete cascade,
  storage_path text not null,
  uploaded_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);
```

### 6.4 The finding lifecycle (workflow)

```
                 ┌────────── validator files ──────────┐
                 ▼                                       │
   open ──▶ triaged ──▶ accepted ──▶ in_progress ──▶ resolved ──▶ verified ──▶ closed
    │           │                                                    ▲
    │           ├──▶ wontfix (reason required, terminal)             │
    │           └──▶ duplicate (linked to canonical, terminal)       │
    └── validator may edit/withdraw while still 'open' ──────────────┘
                                                  if fix is wrong, verified step
                                                  kicks it back to in_progress
```

- **Validator** creates (`open`) and later **verifies** (`resolved` → `verified`). Only a validator — ideally a *different* one than the author for clinical items — can verify, which gives the sign-off independent attestation.
- **Administrator** triages (`open` → `triaged`), accepts, assigns, and closes.
- **Implementer** works `accepted`/`in_progress` → `resolved`, attaching the commit/PR and a resolution note.
- Every transition writes a `finding_audit` row automatically (DB trigger), so the history is tamper-evident.

### 6.5 Row-Level Security (enforced in the database, not just the UI)

- Anyone authenticated can `select` pages and findings (reviewers benefit from seeing each other's findings — avoids duplicates).
- A validator can `insert` findings as themselves and `update`/`delete` only their own findings while `status = 'open'`.
- Status transitions beyond `open` are allowed only for `admin` (and `implementer` for the implement-side transitions), via policy + a `SECURITY DEFINER` transition function that also writes the audit row.
- `finding_audit` is **append-only** (no update/delete policy for anyone) — the integrity guarantee.
- `profiles.role` is writable only by `admin`.

### 6.6 The annotation capture experience (what a validator actually does)

1. Validator logs in (magic-link email or institutional SSO) and lands on the page catalog, with a per-page review-progress badge.
2. They open a page; it renders **identically to the public page** (same content, same components, same anchors), with a thin review toolbar.
3. Beside each section (anchored to its heading slug) is an unobtrusive "flag" affordance. They can also select text to capture the exact `quoted_text`.
4. Clicking it opens the **finding form**: severity, category, title, detail, suggested fix, suggested citation. The section anchor, page, and current `git_sha` are captured automatically.
5. On submit, the finding lands in the database as `open`, pinned to the page version. The validator sees their own findings listed and their per-page progress advance.
6. A "mark page reviewed" action records that this validator completed this page at this version — the basis for sign-off coverage tracking.

### 6.7 The administrator dashboard

- **Queue** with filters: page, kind, severity, category, status, assignee, author, free-text. Sort by severity then priority.
- **Triage actions:** set/adjust severity + category, accept, assign to an implementer, set priority, merge duplicates, mark wontfix (reason required).
- **The "detailed to-do" export** you asked for: select a filtered set (e.g. "all accepted blockers + majors") and export as a structured Markdown work order — one section per finding with page, section anchor, severity, the problem, the suggested fix, the citation, the pinned version, and a stable finding ID. This is the artifact handed to the implementer (or pasted to Claude Code) and it round-trips: the implementer marks each `resolved` with the commit that closed it.
- **Metrics:** open findings by severity; per-page finding density (which pages need the most work); reviewer throughput and coverage (who has reviewed what, at which version); mean time open → closed; verification backlog.
- **Coverage view for sign-off:** for each page, which validators reviewed it, at which version, and whether all blockers/majors are `verified` — the gate for declaring a page clinically signed off.

### 6.8 Versioning, staleness, and sign-off integrity

- Because each finding pins `page_git_sha`, when a page changes after review the dashboard flags affected findings as "filed against an older version" and can mark prior page sign-offs as stale, prompting re-review. This is what makes the clinical sign-off defensible over time rather than a one-time rubber stamp.
- A page is "signed off at version X" only when: every blocker/major against version X is `verified`, and the required reviewer(s) recorded a `mark page reviewed` at version X.

### 6.9 Console quality bar (it is up-to-standard too)

- The Console itself meets WCAG AA (keyboard, focus, contrast) — reviewers may use assistive tech.
- Backups: Supabase point-in-time recovery enabled; periodic logical dump exported to your own storage.
- Privacy: only reviewer name/credentials/COI and content findings are stored; no patient data; a short data-handling note in the Console.
- Rate-limiting and email-domain allowlisting on signups so only invited reviewers get accounts.
- All access over HTTPS; secrets in env; the anon key is RLS-gated so it is safe in the client.

**Phase 3 exit criteria:** Review Console deployed privately; auth working; schema + RLS + audit triggers live; a validator can file a finding pinned to a version; an admin can triage, assign, and export a to-do batch; metrics and coverage views render.

---
## 7. Phase 4 — Informational / clinical validation (runs through the Console)

Now the Review Console is the instrument for the clinical and editorial validation the project actually needs. This is where domain truth gets established.

### 7.1 Assemble the reviewer panel
- Recruit reviewers with declared specialties and conflicts of interest (captured on their `profile`): pediatric neurocritical care, pediatric neurology, neurosurgery, neonatology, clinical pharmacology (for drug doses), and a methodologist/librarian (for reference verification).
- For credibility, each clinical page should be reviewed by at least one reviewer who did not author it, and high-stakes pages (dosing, thresholds, brain-death, prognostication) by two.

### 7.2 What every clinical reviewer checks (the rubric)
Each page, against the cited literature, looking for findings in these categories:
- **Thresholds** by age (ICP/CPP by age band, PRx ~0.25, PbtO₂ cutoffs, ONSD cutoffs, TCD velocities).
- **Trial figures** (COGiTATE, BOOST/BOOST-3 status, SafeBoosC-III, STARSHIP/KidsBrainIT, THAPCA, ORANGE, STOP).
- **Drug doses** in integration scenarios, against the cited protocols.
- **Evidence grades** — does the A/B/C/expert/sparse chip honestly reflect the data? (The pediatric-honesty stance is a selling point; reviewers police it.)
- **Pediatric specificity** — is the "in children" nuance correct and present?
- **Figure accuracy** — anatomy/diagram correctness against the figure-accuracy checklist (`claude-code-tasks/08-illustration-prompts.md`).

### 7.3 Reference verification (methodologist track)
- PubMed-confirm author/title/journal/year and, where the overview flagged gaps, volume/page/DOI across `references.ts` (306 entries).
- File `citation` findings for any mismatch.
- On completion, bump `REFERENCES_VERSION` and stamp affected pages' `lastReviewed`.

### 7.4 Editorial consistency sweep
- House rules hold across all pages: no em-dashes, consistent acronym expansion, units, rounding, the 18-section spine where applicable, Quiz schema.
- Confirm the detail-shim/SpeakerNote decision from 4.8 is applied.

### 7.5 The loop
Reviewers file findings → admin triages and assigns → implementer fixes and marks resolved with the commit → a reviewer verifies → page reaches "signed off at version X." Repeat until every page clears its blocker/major findings. The dashboard's coverage view is the burn-down.

**Phase 4 exit criteria:** every clinical page reviewed by the required number of independent reviewers at the current version; all blocker/major clinical findings `verified`; references re-verified and re-stamped; editorial sweep clean.

---

## 8. Phase 5 — Pre-launch hardening and launch

- **Resolve all blockers and majors** across both tracks (engineering + clinical). Minors/nitpicks may ship with a documented backlog.
- **Security review:** confirm the public site has zero write surface; the Console's RLS policies tested against a misuse checklist (can a validator escalate to admin? can anyone edit the audit log? can the anon key do anything unintended?).
- **Medico-legal framing:** confirm the "educational, not a clinical device" disclaimer on every page; finalize the content license (e.g. CC BY-SA) and code license.
- **Hosting + cache:** pick the public host (Cloudflare Pages / Vercel / static dir), set cache headers, wire a deploy hook so `main` → build → deploy. Decide the Console's private hosting + access model.
- **Analytics (privacy-preserving):** optional, cookieless, to learn which pages/widgets are used and guide re-curation. No PHI, no personal tracking.
- **Launch runbook:** a written deploy/rollback procedure; smoke-test checklist (home renders, a chapter renders, a widget runs, search returns, print stylesheet, OG images resolve).
- **Tag the release** `v1.0.0` and record the signed-off content version.

**Phase 5 exit criteria:** zero open blockers/majors; security checklist passed; disclaimer + licenses in place; host + cache + deploy hook live; runbook written; release tagged.

---

## 9. Phase 6 — Post-launch operations (the resource stays alive)

- **Re-curation cadence:** the evidence base ages. Set a per-page `lastReviewed` SLA (e.g. annual, sooner for fast-moving areas like CPPopt/PbtO₂ trials). The Console's staleness flags drive the re-review queue.
- **Dependency cadence:** monthly `npm outdated`/`npm audit`; security advisories actioned within an agreed SLA; CI catches regressions.
- **Findings never close the door:** the Console stays live post-launch as the standing channel for reviewer feedback and reader-reported issues.
- **Governance:** a named content owner; a quarterly review of metrics (most-flagged pages, coverage gaps); a changelog per release.
- **Backups verified, not just enabled** (periodic restore test of the findings DB).

---

## 10. Roles and responsibilities (RACI, condensed)

| Activity | Owner | Support |
|---|---|---|
| Git/CI/infra (Phase 0) | Dev/eng | Admin |
| Engineering hardening (Phase 1) | Dev/eng | Admin |
| Dependency waves (Phase 2) | Dev/eng | — |
| Review Console build (Phase 3) | Full-stack dev | Admin (requirements) |
| Clinical/editorial validation (Phase 4) | Reviewer panel | Admin (triage), Implementer (fixes) |
| Triage + assignment | Administrator | — |
| Implementing fixes | Implementer / Claude Code operator | Admin |
| Verification + sign-off | Validators (independent) | Admin |
| Launch (Phase 5) | Admin + Dev | All |
| Operations (Phase 6) | Content owner | Reviewer panel |

---

## 11. Risk register (top items)

| Risk | Impact | Mitigation |
|---|---|---|
| No version control today | Any change is unsafe; no rollback | Phase 0 first; nothing else starts until git + CI exist |
| Scope creep turning the public site into a server app | Loses static-export benefits | Hard architectural rule: public site stays static; review layer is separate (Section 0) |
| Tailwind 3→4 migration breaks layout site-wide | Visual regressions | Own PR, visual-regression review, rollback plan (Section 5.2 Wave 3) |
| three.js update breaks the hero | Broken landing page | Pin + targeted hero test; reduced-motion fallback already exists |
| Clinical sign-off treated as one-time | Evidence rots silently | Version-pinned findings + staleness flags + re-review SLA (Sections 6.8, 9) |
| Reviewer findings lost in email/spreadsheets | No single source of truth | The whole point of the Console: one database, audited, exportable |
| Self-review masquerading as sign-off | Weak validation credibility | Independent verifier required; COI declared on profile |

---

## 12. Sequencing and parallelism

- **Week 0–1:** Phase 0 (blocking).
- **Then in parallel:** Phase 1 (eng hardening) ‖ Phase 2 (dependency waves) ‖ Phase 3 (Console build).
- **When Console is live:** Phase 4 (clinical validation) begins and runs the longest — it is reviewer-bandwidth-bound, not code-bound.
- **Phase 5** gates launch once Phases 1, 2, 4 clear their blockers/majors.
- **Phase 6** is steady-state.

The critical path to a *trustworthy* launch is Phase 4 (clinical validation), which is exactly why Phase 3 (the Console) is worth building rather than improvising with spreadsheets.

---
## 13. What this plan needs from the repo before execution specs can be written

The plan is architecturally complete, but four things must be read from the live repo (not guessed) before I write the per-phase execution specs you hand to Claude Code. A single read-only discovery pass gathers them. The prompt is in Section 14.

1. **Exact dependency state** — full `package.json` + the output of `npm outdated` and `npm audit`, so Phase 2's waves target real current-vs-latest versions (especially the Tailwind 3→4 and three.js decisions).
2. **Hosting + deploy reality** — is a host already chosen? Any existing deploy config? Any existing env/secret handling? This shapes Phase 0.3 and Phase 5.
3. **Any existing auth/backend anywhere** — confirm there is genuinely none today (the audit implies none), so the Review Console is greenfield and won't collide with something already present.
4. **Anchor stability for annotations** — confirm headings render stable, unique slug IDs on every content page (the audit says `rehype-slug` + `rehype-autolink-headings` are in the pipeline, which means yes), and capture the slug format, since the Console anchors findings to those IDs.

Plus three decisions only you can make (they don't need the repo, but they gate Phase 3/5):
- **Backend choice:** Supabase (recommended) vs Pocketbase (self-host) vs Firebase. Affects the Console build spec.
- **Reviewer auth method:** magic-link email vs institutional SSO. Affects signup/allowlist design.
- **Console hosting/access model:** private domain, IP allowlist, or just auth-gated public URL.

---

## 14. Discovery prompt for Claude Code (read-only)

Paste this to gather items 1–4 above. It writes nothing except one report file under `docs/_audit/`.

```
READ-ONLY discovery pass to support a production-readiness plan. Do not modify,
create, move, or delete anything except the single report file named at the end.
No installs, no builds that change tracked files. Record findings; fix nothing.

Gather and report the following, each with the file/command that proves it:

1. DEPENDENCIES
   - Paste the full dependencies + devDependencies from package.json with exact
     versions.
   - Run `npm outdated` (read-only) and capture the current / wanted / latest
     table for every package.
   - Run `npm audit` (read-only) and summarize advisories by severity.
   - Flag specifically: the installed Tailwind major (3.x?) and whether any
     Tailwind v4 migration has begun; the three.js and simplex-noise versions;
     the Next.js and React exact versions; the MDX-pipeline package versions
     (@next/mdx, next-mdx-remote, remark-*, rehype-*, katex, mermaid).

2. HOSTING & DEPLOY
   - Any deploy config present (vercel.json, netlify.toml, cloudflare config,
     wrangler, GitHub Actions deploy workflow, Dockerfile, etc.)?
   - Any .env / .env.example / env usage in the code? List env var names
     referenced (not values).
   - How is the build served today (the .bat launcher, scripts/serve.js, etc.)?

3. EXISTING AUTH / BACKEND (expected: none)
   - Search the repo for any auth, server routes, API handlers, database
     clients, or backend SDKs (e.g. app/api/*, route.ts handlers, supabase,
     firebase, prisma, drizzle, pg, mongoose, next-auth, clerk). Confirm whether
     any exist. Report exactly what you find or confirm none.

4. CONTENT ANCHORS (for the review tool)
   - Confirm that rendered content headings get stable, unique id slugs
     (rehype-slug / rehype-autolink-headings). Show the slug format from one
     built page in out/ (e.g. the actual id="" attributes on h2/h3 in a modality
     page's index.html).
   - Confirm whether a page-level stable identifier exists (slug + kind) and
     whether anything like a content hash or build SHA is currently emitted.

5. PROJECT STRUCTURE QUICK CONFIRM
   - Confirm the content lives where the audit said (src/content/<kind>/*.mdx)
     and that the homepage components from any recent redesign are present under
     src/components/home/ (list them). Note if the 3D brain hero file exists.

Write a single report to docs/_audit/DISCOVERY_FOR_PRODUCTION.md with five
sections matching the above, every claim citing a file path or the command run.
Then stop and summarize the five sections in chat. Propose no changes.
```

---

## 15. After discovery: the execution specs I will produce

Once that report comes back, each phase becomes a precise, paste-ready Claude Code execution spec (same format as the homepage/modality deliverables: integration instructions, file maps, acceptance checklists), in this order:

1. **Phase 0 spec** — git init + `.gitignore` + branch protection notes + the GitHub Actions CI workflow YAML + `docs/INDEX.md`.
2. **Phase 1 spec** — the `validate-content` integrity script, OG build wiring, the count-derivation fix, a11y sweep config, perf budget.
3. **Phase 2 spec** — the exact dependency-wave PRs against the real `npm outdated` output, with the Tailwind 3→4 migration as its own sub-spec.
4. **Phase 3 spec** — the Review Console: Supabase project setup, the SQL migration (schema + enums + RLS policies + audit triggers + transition function), the Next.js Console app (auth, page renderer with annotation overlay, finding form, my-findings, admin dashboard, to-do export), and seed/role setup.
5. **Phase 4 kit** — the reviewer rubric as an onboarding doc, the COI/sign-off template, and the coverage-tracking queries.

Each spec is independently reviewable and shippable behind the Phase 0 CI gates.

---

*End of operational development plan. The public site stays static and safe; a separate audited Review Console gives validators login + a single findings database + admin triage and to-do export; engineering and clinical validation both funnel through it; dependencies modernize in controlled waves; and version control + CI underpin all of it. Run the Section 14 discovery prompt, send me the report, and I will turn each phase into a paste-ready execution spec.*
