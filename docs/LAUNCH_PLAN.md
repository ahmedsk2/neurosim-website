# MNM-Edu Public Launch Plan

This is the single source of truth for "where are we in the launch." It is populated from the
Phase 4 pre-launch audit (`docs/_audit/PRE_LAUNCH_AUDIT.md`); it does not re-do the audit, it tracks
the work the audit surfaced. Status is updated **on PR merge** (at the same time as the memory
update), so this file should always answer: "what would I do next if I sat down to work right now?"

**Scope reminder.** The architecture is now settled (see "Decisions locked" below and
`DECISIONS.md`): the public read-only educational layer and the closed, invite-only reviewer system
run together on **one PaaS host** (Platform-as-a-Service), fronted by Cloudflare. The public site is openly readable and
search-indexed at **web.towardpcc.com**; the reviewer routes (`/review/*`) sit behind **Cloudflare
Access** (email allow-list). The reviewer registration model is unchanged (admin-invite only).

Companion docs: architectural decisions live in [`DECISIONS.md`](./DECISIONS.md); the detailed
findings (with full citations) live in [`_audit/PRE_LAUNCH_AUDIT.md`](./_audit/PRE_LAUNCH_AUDIT.md).

## Status legend

- `[ ]` Not started
- `[~]` In flight (with PR #)
- `[x]` Done (with merged SHA)

---

## Phase 4a: Must-fix before public launch

The blocking and launch-gating items. The architecture is now decided (Decisions locked, below), so
most items are code/content work that can land on the current setup; the actual platform migration
and cutover is the **final** 4a step.

### `[x]` 1. Set the production domain in metadata  -  Done: PR #41 (`59a6ca0`)
- **Why it matters:** `metadataBase` is the placeholder `https://mnm-edu.example`, so every absolute
  OG URL and the derived canonical point at a non-existent domain.
- **Fix direction:** Set `metadataBase` in `src/app/layout.tsx:14` to `https://web.towardpcc.com`,
  and set `NEXTAUTH_URL` to match.
- **Refs:** audit C.5, C.10, D.2; `src/app/layout.tsx:14`.

### `[x]` 2. Add security headers  -  Done: PR #44 (`ab975d0`) - shipped as strict nonce-based CSP (Option B)
- **Shipped as:** strict middleware-generated per-request nonces in `src/middleware.ts`
  (`script-src 'self' 'nonce-<value>' 'strict-dynamic'`, no `'unsafe-inline'` for scripts). All six
  security headers (CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
  Permissions-Policy) come from the same middleware - single source. `style-src` keeps
  `'unsafe-inline'` (KaTeX/Mermaid/React inline styles, documented). The pragmatic Option A
  (`script-src 'unsafe-inline'`) was considered and rejected; see `DECISIONS.md`. Routes are now
  dynamic - the SSG `s-maxage` cache was the accepted tradeoff.
- **Operational dependency:** the strict CSP requires Cloudflare Rocket Loader (and other
  script-injecting features) to be OFF on the production zone, or widgets fail to hydrate. See
  `OPERATIONS.md` section 7 "Cloudflare settings required for the strict CSP" for the full
  checklist and the cache-purge step.
- **Refs:** `src/middleware.ts`, `src/app/layout.tsx` (nonce threaded into the theme-bootstrap
  `<Script>`), `DECISIONS.md` ("Strict nonce-based CSP (Option B)").

### `[x]` 3. Add robots.txt + sitemap.xml + canonical URLs  -  Done: PR #46 (`635c268`)
- **Shipped as:** `src/app/robots.ts` (allows `/`, disallows `/review/` and `/api/`, references the
  sitemap), `src/app/sitemap.ts` (**67 entries** = 13 static + 54 content (27 modalities + 9
  foundations + 18 integration); generated from `listContent()` so it stays in sync with the MDX;
  `lastReviewed` drives `<lastmod>`), and **`alternates.canonical` on every public page** via
  metadata / `generateMetadata`. This also closes the canonical-link gap that item 1 (metadataBase)
  surfaced - the site previously emitted no `<link rel="canonical">` at all.
- **Consistency verified byte-identical:** canonical URL == sitemap entry == served URL form, all
  `https://web.towardpcc.com/<path>/` with the trailing slash matching `trailingSlash: true`.
  `/review/*` deliberately carries NO canonical and is disallowed in robots.
- **Refs:** `src/app/robots.ts`, `src/app/sitemap.ts`; `alternates.canonical` added in each public
  page's metadata / `generateMetadata`.

### `[ ]` 4. Reviewer login hardening (access model)  -  PR: ___
- **Why it matters:** On a public-facing host the reviewer login (`POST /api/auth/callback/credentials`)
  would otherwise be an open, unthrottled attack surface (password-spray / bot probing).
- **Fix direction:** **Cloudflare Access in front of `/review/*` is the primary defense** (item 5);
  the existing in-memory rate-limiter stays as application-level defense-in-depth. No additional
  app-level throttle is required for launch.
- **Refs:** audit C.1, D.4; `src/lib/rateLimit.ts` (limiter exists), `src/lib/auth/options.ts`.

### `[ ]` 5. Configure Cloudflare Access on reviewer routes  -  PR: ___
- **Why it matters:** It closes the reviewer attack surface at the edge: only allow-listed reviewer
  emails can even reach the login page; everyone else gets a Cloudflare "not authorized" response.
- **Fix direction:** Set up a Cloudflare Access application over `/review/*` and the reviewer-side
  APIs with an email allow-list. Reviewers pass the Cloudflare Access challenge first, then the
  existing NextAuth login (access-from-anywhere preserved). Gates the migration (item 8).
- **Refs:** DECISIONS.md (Cloudflare Access in front of reviewer routes).

### `[ ]` 6. Legal pages + public accountability  -  PR: ___
- **Why it matters:** No privacy policy, no terms of use, no public contact, and the About page names
  no responsible author - a credibility and compliance gap for a public clinical educational resource
  (and Google Analytics raises the privacy-disclosure bar; see item 7).
- **Fix direction (concrete sub-items, you supply the wording):**
  - (a) **About page** with the locked author details (Ahmed S. Alkhalifah, MD MBBS, Pediatric
    Intensivist with subspecialty in Neurocritical Care; framed as an independent personal
    educational project, no institutional affiliation; contact `info@towardpcc.com` with a
    best-effort caveat; reinforced medical disclaimer in a `caveat`-styled Callout; plain
    `<a href="mailto:...">` so no Cloudflare Email Obfuscation is needed). **`[x]` Done: PR #48
    (`e11b235`).**
  - (b) **Privacy policy page**, expanded to disclose Google Analytics: what it collects, that data
    flows to Google's ad business, retention, and opt-out instructions.
  - (c) **Terms-of-use page.**
  - (d) **Reinforce the medical disclaimer site-wide** so a reader landing on any single page sees it
    (it currently lives in the footer + About + home).
- **Refs:** audit C.6, C.7, D.6; `src/app/about/page.tsx`, `src/components/layout/Footer.tsx:45-54`.

### `[x]` 7. Cookie consent banner + GA with consent gating  -  Done: PR #51 (`edefabf`)
- **Shipped as:** default-deny cookie consent banner with Accept and Decline equally styled and
  equally accessible (GDPR / Quebec Law 25 / UK ICO requirement), consent persisted in
  `localStorage`, footer "Cookie settings" link to change or withdraw at any time (withdrawal
  clears `_ga*` cookies and stops GA on next load). GA4 loads ONLY when BOTH
  `NEXT_PUBLIC_GA_ID` is set AND consent is granted; config matches the privacy policy exactly
  (consent-mode default-deny, `anonymize_ip:true`, `allow_google_signals:false`,
  `allow_ad_personalization_signals:false`). The strict nonce CSP is extended for the GA
  endpoints **only when** the env var is set; absent it, the public site is fully cookie-free
  and the CSP carries no Google hosts. Verified A-G in a real Chromium across both build states.
- **Production dependency (recorded in `DECISIONS.md`):** GA goes live ONLY when **both** the
  lawyer-cleared privacy policy is published AND `NEXT_PUBLIC_GA_ID` is set in the production
  environment. Until both, GA stays dark.
- **Refs:** `src/components/consent/{ConsentProvider,CookieBanner,GoogleAnalytics,CookieSettingsLink}.tsx`,
  `src/middleware.ts` (conditional CSP), `src/app/layout.tsx`,
  `src/components/layout/Footer.tsx`, `.env.example` (kill-switch documentation),
  `DECISIONS.md` ("Privacy-respecting GA, consent-gated").

### `[ ]` 8. Migrate to PaaS host  -  Stage A done (PR #53, `fd4e687`); Stages B-E open
- **Why it matters:** The current single-PC + SQLite + personal-tunnel setup cannot back a published
  site; the PaaS-host decision is the production target. This is the **final** 4a step - the code
  and content items above can land on the current setup first, then cut over.
- **Stage A - datasource conversion (DONE, PR #53 `fd4e687`):** Prisma datasource converted SQLite ->
  MySQL/MariaDB and verified live against a throwaway MariaDB 10.11.16 (matching production): the
  `@db.Text` no-truncation proof, the `SmtpSetting` ciphertext round-trip, the data-copy row-count
  match, the email-casing fix, and all gates (typecheck / lint / validate-content / unit 94 / build /
  e2e 12) green. Adapter is `@prisma/adapter-mariadb`; the one-time copy script is
  `scripts/migrate-to-mysql.mjs`.
- **Stage B - server provisioning (OPEN, runbook):** Infomaniak Managed Cloud Server (Node 24,
  MariaDB 10.11, Nginx, Playwright Chromium deps, systemd, TLS, firewall); set all env vars
  (`DATABASE_URL`, `NEXTAUTH_SECRET` / `NEXTAUTH_URL`, `SMTP_ENCRYPTION_KEY` + `SMTP_*`) in the server
  environment, never the repo. **Follow-up: the now-obsolete SQLite `scripts/backup-db.mjs` needs a
  `mysqldump` replacement** (paired with a `uploads/` tar) - it no longer works against MySQL.
- **Stage C - real data migration (OPEN):** run `scripts/migrate-to-mysql.mjs` against the real
  `prisma/dev.db` into the production MySQL with the SAME `SMTP_ENCRYPTION_KEY` (so the encrypted SMTP
  row stays decryptable); verify per-table row counts. **Accepted behavior:** the copy sets the three
  `@updatedAt` columns to migration time; `createdAt` and the append-only `FindingAudit` history are
  preserved verbatim, which is what matters for governance.
- **Stage D - cutover (OPEN):** DNS to the server; smoke-test public + reviewer login + finding-create
  + email; Cloudflare Access on `/review/*` (item 5); confirm the strict-CSP zone settings
  (`OPERATIONS.md` section 7).
- **Stage E - rollback / parallel-run (OPEN):** keep the PC + tunnel as a fast rollback target for
  ~2 weeks before decommissioning.
- **Item 8 overall stays `[ ]` until cutover (Stage D).**
- **Refs:** PR #53 (`fd4e687`); `docs/_audit/PAAS_MIGRATION_DISCOVERY.md`; DECISIONS.md (PaaS hosting;
  Database engine MySQL/MariaDB; @db.Text load-bearing); `scripts/migrate-to-mysql.mjs`,
  `src/lib/prisma.ts`, `uploads/`.

---

## Phase 4b: Soon after launch

Important but able to follow the launch.

### `[ ]` 10. Raster (PNG) Open Graph images  -  PR: ___
- **Why it matters:** OG/Twitter images are SVG, which major social scrapers (X, Facebook, LinkedIn,
  Slack) do not render, so share cards come up blank. (The earlier "11 missing OG images" gap is
  already closed; format is the remaining issue.)
- **Fix direction:** Emit PNG share cards (the `generate-og` prebuild already produces 55 SVGs, one
  per page; convert or render to raster).
- **Refs:** audit C.5, D.7; `src/app/layout.tsx:31-33`, `src/app/modalities/[slug]/page.tsx:34-35`,
  `scripts/generate-og.mjs`.

### `[ ]` 11. Accessibility: meet WCAG 2.1 AA  -  PR: ___
- **Why it matters:** axe finds no critical violations (all 12 pages pass), but serious
  color-contrast failures recur on 5 pages (~168 node-instances), plus `definition-list` structure
  (glossary) and `scrollable-region-focusable` (autoregulation, cppopt). AA is the stated target.
- **Fix direction:** Lift muted-ink token contrast above 4.5:1, fix the `<dl>` child markup, and add
  keyboard access (tabindex) to scroll containers; re-run the axe suite.
- **Refs:** audit C.4, D.8; `tests/e2e/a11y.spec.ts`, `src/styles/globals.css` (ink tokens),
  `src/app/glossary/page.tsx`.

### `[ ]` 12. Observability  -  PR: ___
- **Why it matters:** Zero today (no error monitoring, uptime, or log persistence); server errors go
  to stdout and vanish. Important once real traffic arrives.
- **Fix direction:** Add error monitoring (e.g. Sentry) and an external uptime check (e.g.
  UptimeRobot or Cloudflare health checks). (Visitor analytics is handled in Phase 4a via Google
  Analytics + consent gating, items 7-8.)
- **Refs:** audit C.9, D.9.

### `[ ]` 13. Refresh `.env.example`  -  PR: ___
- **Why it matters:** It is stale: it describes `PORT` as feeding the static-era `serve.js`, lists
  dead commented Supabase vars for a "Phase 3 not used yet" that actually shipped on Prisma/SQLite,
  and never documents `NEXTAUTH_SECRET` / `NEXTAUTH_URL` as required app vars. Misleads anyone setting
  up the production environment (which the hosting migration needs).
- **Fix direction:** Rewrite to match the current running-server + NextAuth reality.
- **Refs:** audit C.10, D.10; `.env.example:14-26`.

---

## Phase 4c: Defer indefinitely

Clearly deferrable; no launch impact. Pick up opportunistically.

- `[ ]` **npm audit `overrides` cleanup** - 5 moderate advisories, none in the public runtime path
  (`@hono/node-server` via the dev-only Prisma CLI; `uuid` via next-auth, effectively
  non-exploitable). Dedupe `uuid` via `overrides`; accept the dev-only one. (audit C.8, D.11)
- `[ ]` **Stale homepage count** - the hero CTA reads "Browse 24 modalities" but there are 27;
  derive from `MODALITIES.length` (already used correctly elsewhere). (audit C.6; `src/components/home/Hero.tsx:56`)
- `[ ]` **JSON-LD structured data** - add `MedicalWebPage`/`Article`/`BreadcrumbList` schema for
  richer search presentation. (audit C.5, D.12)
- `[ ]` **Wire `@next/bundle-analyzer`** - the `analyze` script is currently a no-op; bundle sizes
  are unmeasured. (audit C.3, B.4)
- `[ ]` **Scope KaTeX CSS** - it loads globally (every page) though only content pages need it.
  (audit C.3; `src/app/layout.tsx:3`)
- `[ ]` **Flip `images.unoptimized`** - the PaaS host can run the Next image optimizer, so it is no
  longer host-blocked; still a modest gain because the site is SVG-heavy. Deferred.
  (audit C.3, D.15)
- `[ ]` **Custom branded 404** - currently the Next default `/_not-found`. (audit D.12)

---

## Decisions locked

The launch-shaping decisions are settled. Each is one line here for at-a-glance state; the full
reasoning and tradeoffs live in [`DECISIONS.md`](./DECISIONS.md).

1. **Domain** - launch at the existing subdomain `web.towardpcc.com` (no dedicated domain acquired).
2. **Indexing** - search engines are welcomed (robots.txt allows, sitemap.xml aids).
3. **Hosting architecture** - **PaaS host**: public site + reviewer system + MySQL/MariaDB + attachments
   on one PaaS platform (Railway / Fly.io / Render / DO App Platform / Vercel, selection deferred). The
   audit's public/reviewer split was considered and rejected.
4. **Analytics** - **Google Analytics** (over the recommended privacy-friendly alternatives), which
   makes the cookie consent banner and a GA privacy disclosure legally required.
5. **Reviewer access model** - **Cloudflare Access** email allow-list in front of `/review/*`;
   reviewers pass the Cloudflare challenge, then the existing NextAuth login.
6. **About-page accountability** - named author **Ahmed S. Alkhalifah, MD MBBS**, Pediatric
   Intensivist (subspecialty Neurocritical Care); independent personal project, no institutional
   affiliation.
7. **Contact path** - alias `info@towardpcc.com` (best-effort response), separate from personal email.

---

## How this file is maintained

- **Status updates happen on PR merge**, at the same time as the project-memory update. An item goes
  `[ ]` -> `[~]` (with the PR #) when work starts, and `[~]` -> `[x]` (with the merged SHA) when it
  lands.
- **Items move between phases only with a deliberate note** (a one-line reason on the item), not
  silently.
- **This file should always reflect "what would I do next right now."** If it has drifted from
  reality, fix the file first.
- **When a new decision is made**, append it to `DECISIONS.md` (with its reasoning and tradeoffs),
  record the one-line state in "Decisions locked" above, and update the affected item(s).
