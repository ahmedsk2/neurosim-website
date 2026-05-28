# MNM-Edu Public Launch Plan

This is the single source of truth for "where are we in the launch." It is populated from the
Phase 4 pre-launch audit (`docs/_audit/PRE_LAUNCH_AUDIT.md`); it does not re-do the audit, it tracks
the work the audit surfaced. Status is updated **on PR merge** (at the same time as the memory
update), so this file should always answer: "what would I do next if I sat down to work right now?"

**Scope reminder.** The architecture is now settled (see "Decisions locked" below and
`DECISIONS.md`): the public read-only educational layer and the closed, invite-only reviewer system
run together on **one managed host**, fronted by Cloudflare. The public site is openly readable and
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

### `[ ]` 1. Set the production domain in metadata  -  PR: ___
- **Why it matters:** `metadataBase` is the placeholder `https://mnm-edu.example`, so every absolute
  OG URL and the derived canonical point at a non-existent domain.
- **Fix direction:** Set `metadataBase` in `src/app/layout.tsx:14` to `https://web.towardpcc.com`,
  and set `NEXTAUTH_URL` to match.
- **Refs:** audit C.5, C.10, D.2; `src/app/layout.tsx:14`.

### `[ ]` 2. Add security headers  -  PR: ___
- **Why it matters:** The app sends no CSP, HSTS, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, or Permissions-Policy (verified live: only Cache-Control + Content-Type). No
  clickjacking or MIME-sniffing protection, no script-origin constraint.
- **Fix direction:** Add a `headers()` function in `next.config.mjs` (Next-server-side, not a CDN
  `_headers` file, because the unified-host architecture serves public and reviewer from one host).
  CSP needs a nonce or hashes for the inline theme-bootstrap script and KaTeX/Mermaid inline styles.
- **Refs:** audit C.1; `next.config.mjs:6-22` (no `headers()`), no `src/middleware.ts`,
  `src/app/layout.tsx:40-42` (inline bootstrap script).

### `[ ]` 3. Add robots.txt + sitemap.xml  -  PR: ___
- **Why it matters:** Both currently 404. Indexing is now welcomed (Decisions locked), so the site
  needs to both allow and aid crawlers.
- **Fix direction:** Emit `app/robots.ts` (allow indexing) + `app/sitemap.ts` enumerating the SSG
  routes (use the trailing-slash URL form to match `trailingSlash: true`).
- **Refs:** audit C.5, D.5 (both 404 live; no `public/robots.txt`/`sitemap.xml`, no app routes).

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
  existing NextAuth login (access-from-anywhere preserved). Gates the migration (item 9).
- **Refs:** DECISIONS.md (Cloudflare Access in front of reviewer routes).

### `[ ]` 6. Legal pages + public accountability  -  PR: ___
- **Why it matters:** No privacy policy, no terms of use, no public contact, and the About page names
  no responsible author - a credibility and compliance gap for a public clinical educational resource
  (and Google Analytics raises the privacy-disclosure bar; see item 7-8).
- **Fix direction (concrete sub-items, you supply the wording):**
  - (a) **About page** with the locked author details: Ahmed S. Alkhalifah, MD MBBS, Pediatric
    Intensivist with subspecialty in Neurocritical Care; framed as an independent personal
    educational project (no institutional affiliation); contact `info@towardpcc.com` (best-effort
    response). (`src/app/about/page.tsx`)
  - (b) **Privacy policy page**, expanded to disclose Google Analytics: what it collects, that data
    flows to Google's ad business, retention, and opt-out instructions.
  - (c) **Terms-of-use page.**
  - (d) **Reinforce the medical disclaimer site-wide** so a reader landing on any single page sees it
    (it currently lives in the footer + About + home).
- **Refs:** audit C.6, C.7, D.6; `src/app/about/page.tsx`, `src/components/layout/Footer.tsx:45-54`.

### `[ ]` 7. Cookie consent banner  -  PR: ___
- **Why it matters:** **Launch-blocking.** Google Analytics sets cookies, which under PIPEDA/GDPR
  require prior consent. GA without a consent banner is a legal violation, not an oversight.
- **Fix direction:** Proper consent implementation: block GA until the visitor consents, persist the
  choice across visits, and allow withdrawal. Wired to the GA gating (item 8).
- **Refs:** DECISIONS.md (Google Analytics; consent banner is a consequence).

### `[ ]` 8. Google Analytics with consent gating  -  PR: ___
- **Why it matters:** The GA script must not load before consent; first visit is default-deny.
- **Fix direction:** Load the GA script ONLY after consent is given (default-deny on first visit),
  with consent state persisted across visits. Not a one-line script-tag drop-in; it is driven by the
  consent banner (item 7).
- **Refs:** DECISIONS.md (Google Analytics over privacy-friendly alternatives).

### `[ ]` 9. Migrate to the managed hosting platform  -  PR: ___
- **Why it matters:** The current single-PC + SQLite + personal-tunnel setup cannot back a published
  site; the unified-host decision is the production target. This is the **final** 4a step - the code
  and content items above can land on the current setup first, then cut over.
- **Fix direction:** Select the platform (Railway / Fly / Render, TBD); migrate the data SQLite ->
  Postgres (schema is already Postgres-compatible); move attachment storage to R2 or the platform
  equivalent; configure all env vars (the encrypted-SMTP path's `SMTP_ENCRYPTION_KEY` + `SMTP_*`,
  plus `NEXTAUTH_SECRET` / `NEXTAUTH_URL`); configure Cloudflare Access on `/review/*` (item 5);
  plan and execute the cutover.
- **Refs:** audit C.2, D.1; DECISIONS.md (unified-host architecture); `src/lib/prisma.ts`,
  `src/app/api/snapshot/route.ts:47-48`, `uploads/`.

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
- `[ ]` **Flip `images.unoptimized`** - the unified host means the Next image optimizer would run,
  so it is no longer host-blocked; still a modest gain because the site is SVG-heavy. Deferred.
  (audit C.3, D.15)
- `[ ]` **Custom branded 404** - currently the Next default `/_not-found`. (audit D.12)

---

## Decisions locked

The launch-shaping decisions are settled. Each is one line here for at-a-glance state; the full
reasoning and tradeoffs live in [`DECISIONS.md`](./DECISIONS.md).

1. **Domain** - launch at the existing subdomain `web.towardpcc.com` (no dedicated domain acquired).
2. **Indexing** - search engines are welcomed (robots.txt allows, sitemap.xml aids).
3. **Hosting architecture** - **unified host**: public site + reviewer system + Postgres + attachments
   on one managed platform (Railway/Fly/Render, selection deferred). The audit's public/reviewer split
   was considered and rejected.
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
