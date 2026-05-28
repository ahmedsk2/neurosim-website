# MNM-Edu Architectural Decisions

Append-only log of load-bearing decisions and **why**. Future-you, six months from now, reads this
when wondering why something is the way it is. New entries go at the **bottom** with a date. Never
edit a prior entry except to mark it superseded with a link forward to the entry that replaced it.

Format per entry: **What** (the decision), **Why** (the reasoning), and **Tradeoff accepted** where
one was made. Companion docs: [`LAUNCH_PLAN.md`](./LAUNCH_PLAN.md) (current work) and
[`_audit/`](./_audit/) (ground-truth audits).

---

## 2026-05 - Public GitHub repository, pre-validation (Phase 0)

**What:** The GitHub remote is public, chosen deliberately even though plan step 0.1 recommended a
private remote until clinical content is validated.

**Why:** The owner accepted the trade-off of publishing pre-validation educational content and
internal docs in exchange for an open, inspectable project.

**Tradeoff accepted:** Pre-validation clinical content and internal planning docs are publicly
visible. The convention of keeping `docs/_audit/*.md` working notes untracked partly offsets the
second part.

## 2026-05 - Builds stay on webpack, not Turbopack (Wave 3a)

**What:** `dev`, `build`, and `analyze` all pass `--webpack`; Turbopack is explicitly out of scope.

**Why:** Next 16 defaults builds to Turbopack, which cannot serialize the function-form `@next/mdx`
remark/rehype plugins this project uses, and no gate proves MDX render parity across all content
pages between the webpack and Turbopack compile paths. Webpack preserves the exact, verified MDX
compilation.

**Tradeoff accepted:** The project forgoes Turbopack's build speed. Adopting Turbopack later is a
separate project that must first establish an MDX-parity gate.

## 2026-05 - Static export to running server (Phase 3a)

**What:** Dropped `output: 'export'`; the site became a running Next.js server.

**Why:** Phase 3 needed auth, an API, and a database, none of which a static export can serve. The
reviewer system required server capabilities.

**Tradeoff accepted:** The "host anywhere as a static folder" property was lost; the running server
now requires Node + the database to operate. Public-content routes still prerender as SSG so
visitors see static-fast pages. (Phase 4 revisits this: the public layer can still be served
statically from a CDN; see the hosting-split entry below.)

## 2026-05 - next-mdx-remote v6 with blockJS:false + blockDangerousJS:true (Wave 4)

**What:** All content pages compile through next-mdx-remote v6 with `blockJS: false` and
`blockDangerousJS: true` at the three MDXRemote call sites.

**Why:** v6's new `blockJS: true` default strips JS expression nodes, which broke real content that
passes expression props to components (e.g. `<Quiz questions={[...]} />`). Re-enabling JS
expressions while keeping `blockDangerousJS` blocks `eval`/`Function`/`process`/`require`. All MDX is
first-party, so the untrusted-MDX RCE threat model does not apply.

**Tradeoff accepted:** A non-default MDX configuration that must be re-justified if untrusted MDX is
ever introduced (it must not be without revisiting this).

## 2026-05 - Local Prisma + SQLite + NextAuth, not Supabase

**What:** Pivoted from the original Phase 3 plan's hosted Supabase design to a local Prisma 7 +
SQLite + NextAuth v4 stack (mirroring the NeuroSim project).

**Why:** Single-PC deployment with zero hosted services matched the actual scale and ownership model
better than a hosted DB for a few reviewers.

**Tradeoff accepted:** The data layer lives on one machine (see the backup discipline in
`OPERATIONS.md`). The schema is written Postgres-compatible so the datasource can flip if the
reviewer system ever needs real hosting.

## 2026-05 - Role split enforced at the data layer, not the UI (PR #29)

**What:** Reviewers (validator/implementer/observer) see and comment on only their own findings and
cannot change status; admins get full triage. Enforcement lives on every server data path (the API
routes and the dashboard RSCs that query Prisma directly), not in the UI.

**Why:** A hidden button is not a security boundary. Scoping the queries and gating the mutations
server-side means the rule holds against a hand-crafted request, not just against the rendered UI.

## 2026-05 - In-context overlay is client-only and self-nulls for anonymous (PR #22, Phase 3d)

**What:** The reviewer finding-capture overlay is mounted in the root layout but renders `null` at
SSR and for anonymous / non-reviewer visitors; it reads the session client-side (no SessionProvider
wrapping content).

**Why:** It keeps the public (anonymous) HTML free of any reviewer UI, so public content pages stay
cacheable and identical for everyone, and the service worker can safely cache them. The real
security boundary remains the requireReviewer-gated API.

**Tradeoff accepted:** The session is detected client-side after hydration (a brief delay before the
FAB appears for a logged-in reviewer), which is acceptable because the overlay is a reviewer
convenience, not a security control.

## 2026-05 - Soft-delete, not hard-delete (PR #32 / #33)

**What:** Finding deletion sets `deletedAt` instead of removing rows.

**Why:** The clinical audit trail is the governance value; hard-delete destroys it. Soft-delete
preserves "this existed, it was deleted on Y by Z" while removing it from normal queries
server-side.

**Tradeoff accepted:** Every normal query must filter `deletedAt`; the data is retained rather than
purged (acceptable, and intended, for an audit-bearing tool).

## 2026-05 - SMTP password encrypted at rest (PR #31)

**What:** AES-256-GCM with an env-held `SMTP_ENCRYPTION_KEY`; `dev.db` holds ciphertext.

**Why:** `dev.db` is more mobile than `.env` (backups, copies). Encryption decouples the DB's safety
from the credential's safety - `dev.db` can be backed up without exposing SMTP.

**Tradeoff accepted:** The env key is now load-bearing; lose it and the stored password must be
re-entered (the system degrades gracefully to "email not configured" rather than crashing).

## 2026-05 - Closed reviewer registration, public read (Phase 4 scope)

**What:** The public educational site goes openly public; reviewer registration stays
invitation-only and admin-managed.

**Why:** Public reading serves the educational mission; opening reviewer registration would be a much
larger security and operational undertaking disproportionate to actual need.

## 2026-05 - Public/reviewer hosting split (Phase 4 architecture)

**What:** The public layer (all SSG) deploys to a static CDN; the reviewer system stays on the PC
behind the Cloudflare Tunnel.

**Why:** The Phase 4 audit confirmed every public route is SSG, so static-CDN deployment is trivial
and gives DDoS protection, edge caching, and zero ongoing cost for the public surface. Keeping the
reviewer system on the PC preserves the zero-hosted-services posture for the dynamic, sensitive part.

**Tradeoff accepted:** Two deploy targets to reason about instead of one; the public and reviewer
experiences are served from different origins (the reviewer overlay's client-side session check
already tolerates this).
