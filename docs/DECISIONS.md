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
`OPERATIONS.md`). The schema is written MySQL/MariaDB-compatible so the datasource can flip if the
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

**Superseded (2026-05) by [Unified-host architecture (one managed host for everything)](#2026-05---unified-host-architecture-one-managed-host-for-everything).** The split was reconsidered and rejected in favor of one managed host for everything; the original rationale is retained below for history.

**What:** The public layer (all SSG) deploys to a static CDN; the reviewer system stays on the PC
behind the Cloudflare Tunnel.

**Why:** The Phase 4 audit confirmed every public route is SSG, so static-CDN deployment is trivial
and gives DDoS protection, edge caching, and zero ongoing cost for the public surface. Keeping the
reviewer system on the PC preserves the zero-hosted-services posture for the dynamic, sensitive part.

**Tradeoff accepted:** Two deploy targets to reason about instead of one; the public and reviewer
experiences are served from different origins (the reviewer overlay's client-side session check
already tolerates this).

## 2026-05 - Public launch domain: web.towardpcc.com

**What:** Launching the public site at the existing subdomain web.towardpcc.com rather than
acquiring a dedicated domain.

**Why:** The user chose the existing URL knowingly for the launch.

**Tradeoff accepted:** If the URL is ever changed later, the cost is broken citations, lost search
ranking, broken bookmarks, and a re-indexing period estimated at 6-12 months. Recorded so future-you
understands the choice was deliberate, not defaulted; revisit before any external promotion if a
better domain becomes available.

## 2026-05 - Public site indexed by search engines

**What:** robots.txt + sitemap.xml will welcome general search-engine indexing.

**Why:** The point of going public is for clinicians searching for relevant topics to find the
resource. Not indexing would defeat the educational reach.

## 2026-05 - Unified-host architecture (one managed host for everything)

**Reworded (2026-05) as [PaaS hosting (one host for everything)](#2026-05---paas-hosting-one-host-for-everything) - the same one-host decision, restated with precise PaaS terminology (managed runtime + managed MySQL/MariaDB + zero OS-ops) and an expanded candidate list (adds DigitalOcean App Platform and Vercel). See that entry for the current form.**

**What:** Public site + reviewer system + MySQL/MariaDB + attachments all on ONE managed application
platform (Railway/Fly/Render-style; selection deferred). The audit's recommended split (public to
CDN, reviewer on a separate host) was considered and rejected.

**Why:** The user preferred unified-management simplicity (one host, one bill, one deploy target)
over the split's cost and performance advantages on the public side.

**Tradeoffs accepted:** (1) Modestly higher cost than the split (~$15-30/month vs $0 + $15-25);
(2) loss of free global edge caching on the public site; (3) loss of free CDN-grade DDoS protection
on the public side (Cloudflare in front still provides basic protection); (4) public-traffic spikes
can affect the reviewer system since they share host capacity. The choice was made knowingly with
the costs surfaced explicitly.

## 2026-05 - Cloudflare Access in front of reviewer routes

**What:** /review/* paths and reviewer-side APIs are gated by Cloudflare Access with an email
allow-list at the edge, before traffic reaches the unified host.

**Why:** With reviewer login on a public-facing host (no longer behind the personal tunnel), the
login route would otherwise be a public attack surface subject to brute-force probing and bot abuse.
Cloudflare Access closes that surface entirely at the edge - only allow-listed reviewer emails can
reach the login page; everyone else gets a Cloudflare-served "not authorized" response. Reviewers
retain "access from anywhere" through the Cloudflare Access challenge. Free for small allow-lists.
The existing application-level rate-limit remains as defense-in-depth.

## 2026-05 - Google Analytics over privacy-friendly alternatives

**What:** GA chosen for visitor analytics, despite Cloudflare Web Analytics and Plausible being
recommended privacy-friendly alternatives.

**Why:** User preference; the recommendation against GA (twice) was heard and overridden.

**Tradeoffs accepted:** (1) A cookie consent banner becomes legally required under PIPEDA and GDPR;
(2) the privacy policy must explicitly disclose GA's data collection, that data flows to Google's ad
business, retention policies, and opt-out instructions; (3) some compliance complexity (GA-EU
data-transfer rulings); (4) visitor data flowing to a third-party ad business from a clinical
educational resource. These costs are accepted in exchange for the user's preference for the
familiar tool.

## 2026-05 - Named author, independent personal project, alias contact

**What:** The About page identifies the author as Ahmed S. Alkhalifah, MD, MBBS, Pediatric
Intensivist with subspecialty in Neurocritical Care. The project is framed as an independent
personal educational project with no institutional affiliation. Contact alias: info@towardpcc.com,
with a best-effort response caveat.

**Why:** A public clinical educational resource needs a named human taking responsibility for
credibility; institutional affiliation deferred to keep liability and ownership clean. Alias email
separates project contact from personal correspondence.

## 2026-05 - PaaS hosting (one host for everything)

**What:** Public site + reviewer system + MySQL/MariaDB + attachments deploy to ONE PaaS host
(Platform-as-a-Service: managed runtime + managed MySQL/MariaDB + zero OS-ops). Specific PaaS platform
(Railway / Fly.io / Render / DO App Platform / Vercel) selected at migration time, not now. The
Phase 4 audit's recommended split (public to static CDN + reviewer to a separate host) was
considered and rejected.

**Why:** User preferred unified-management simplicity (one host, one bill, one deploy target) over
the split's cost and performance advantages on the public side.

**Tradeoffs accepted:** (1) Modestly higher cost than the split (~$15-30/month vs $0 + $15-25);
(2) loss of free global edge caching on the public site; (3) loss of free CDN-grade DDoS protection
on the public side (Cloudflare in front provides basic protection); (4) public-traffic spikes can
affect the reviewer system because they share host capacity. Made knowingly with the costs surfaced.

## 2026-05 - Database engine: MySQL/MariaDB (Infomaniak managed), not Postgres (item 8 Stage A)

**What:** The hosted database is MySQL/MariaDB (the Infomaniak Managed Cloud Server provides managed
MariaDB 10.11), not Postgres. Earlier entries above and the migration discovery's first draft assumed
Postgres; this entry supersedes those references. The Prisma datasource provider is `mysql`, via the
`@prisma/adapter-mariadb` driver adapter (the `mariadb` driver speaks the MySQL wire protocol and
serves both MySQL and MariaDB). Schema shape is unchanged; long free-text columns carry `@db.Text`
so MySQL does not truncate them at the VARCHAR(191) default.

**Why:** Infomaniak (the chosen managed host) offers MySQL/MariaDB, not Postgres. Prisma supports
MySQL as a first-class provider, so the migration shape is identical; only DB-specific details differ
(driver adapter, port 3306, `@db.Text` annotations, `mysqldump` backups instead of `pg_dump`).

**Tradeoffs accepted:** MySQL's default collation is case-insensitive (Postgres is case-sensitive);
the app now normalizes email to lowercase on both store and login lookup so correctness does not
depend on the collation. The one-time SQLite -> MySQL data copy uses a Prisma two-client script
(`scripts/migrate-to-mysql.mjs`); `pgloader` (Postgres-only) does not apply.

**Supersedes:** the earlier [Unified-host architecture](#2026-05---unified-host-architecture-one-managed-host-for-everything)
entry - same decision, now stated with PaaS terminology.

## 2026-05 - Strict nonce-based CSP (Option B), SSG traded for security

**What:** The CSP uses strict `script-src 'self' 'nonce-<per-request>' 'strict-dynamic'` (NOT
`'unsafe-inline'`), via per-request middleware (`src/middleware.ts`). `style-src` keeps
`'unsafe-inline'` (KaTeX / Mermaid / React inline styles; impractical to nonce). Every other
directive is strict. The pragmatic `'unsafe-inline'` script-src (Option A) was considered and
**rejected**.

**Why:** The user chose maximum security hardening. Per-request nonces force every route dynamic,
trading away the SSG `s-maxage` cache; accepted because at this site's modest traffic the cache's
value is low, while the author's name and credentials are on the site, so the security margin is
worth more. Content parity confirmed byte-identical (static vs dynamic) across the 7 canary pages;
dynamic TTFB ~170 ms, acceptable.

**Tradeoff accepted:** routes are dynamic (no SSG cache); per-request nonce middleware runs on
every request. No Google Analytics allowance in the CSP yet; that lands with the cookie banner.

**Implementation note:** requires Cloudflare Rocket Loader (and any other script-injecting
Cloudflare feature) to be OFF on the production zone, or widgets fail to hydrate under the strict
CSP. See `OPERATIONS.md` section 7 "Cloudflare settings required for the strict CSP" for the full
checklist and cache-purge step.

## 2026-05 - Privacy-respecting GA, consent-gated (default-deny)

**What:** Google Analytics (GA4) loads ONLY after affirmative consent (default-deny consent mode),
configured with `anonymize_ip: true`, Google Signals off, and ad personalization off. Consent
persists in `localStorage`; withdrawal via a footer "Cookie settings" link stops GA and clears its
cookies. **Double kill-switch:** GA requires BOTH user consent AND `NEXT_PUBLIC_GA_ID` set in the
build; absent the env var, the public site is fully cookie-free and the CSP carries no Google
hosts. Implementation in `src/components/consent/` (provider + banner + GA loader + footer link)
and `src/middleware.ts` (CSP conditionally extended when GA_ID is set).

**Why:** Compliance (PIPEDA / Quebec Law 25 / GDPR) requires GA not load before consent and that
reject be as easy as accept. The privacy-respecting config matches what the draft privacy policy
(PR #50) describes - policy and implementation must agree. The env-var kill-switch lets this merge
WITHOUT turning GA on before the privacy policy is lawyer-cleared and published.

**Tradeoff / dependency:** GA goes live in production ONLY when **both** (1) the lawyer-cleared
privacy policy is published AND (2) `NEXT_PUBLIC_GA_ID` is set in the production environment.
Until both, GA is dark.

## 2026-05 - MySQL @db.Text annotations are load-bearing (do NOT simplify them away)

**What:** The production database is **MySQL/MariaDB 10.11** (Infomaniak managed hosting), migrated
from SQLite in Stage A of item 8 (PR #53, `fd4e687`). The Prisma datasource adapter is
`@prisma/adapter-mariadb`. The `@db.Text` annotations on the long free-text and encrypted columns in
`prisma/schema.prisma` are **REQUIRED, not cosmetic**.

**Why this is recorded:** On MySQL an unannotated Prisma `String` defaults to `VARCHAR(191)`. Removing
the `@db.Text` annotations would make MySQL **silently truncate** finding bodies (`Finding.detail`,
`quotedText`, `suggestedFix`, `suggestedCitation`, `resolutionNote`, `sectionTextSnapshot`),
`FindingComment.body`, `FindingAudit.detail` (JSON), `EmailTemplate.subject` / `body`, and - most
dangerously - `SmtpSetting.pass`, the AES-256-GCM ciphertext: a truncated ciphertext is permanently
**undecryptable** (silent SMTP breakage). Indexed / unique columns deliberately stay `VARCHAR(191)`
(`Reviewer.email`, `InviteToken.tokenHash`, `EmailTemplate.key`, `Finding.severity` / `status`).

**Guardrail:** do not drop the `@db.Text` annotations to "tidy" the schema, and do not move the
datasource to another engine without re-checking every long / encrypted column for truncation.
Verified live on MariaDB 10.11.16 (no-truncation + ciphertext round-trip proofs, PR #53).
