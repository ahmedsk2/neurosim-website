# MNM-Edu Public Launch Plan

This is the single source of truth for "where are we in the launch." It is populated from the
Phase 4 pre-launch audit (`docs/_audit/PRE_LAUNCH_AUDIT.md`); it does not re-do the audit, it tracks
the work the audit surfaced. Status is updated **on PR merge** (at the same time as the memory
update), so this file should always answer: "what would I do next if I sat down to work right now?"

**Scope reminder.** The public read-only educational layer (modalities, foundations, integration,
widgets) goes openly public, intended for a **static CDN** (every public route is SSG). The reviewer
system stays **closed and invite-only**, running on the PC behind the Cloudflare Tunnel. Most of the
work below is about the public surface; the reviewer layer was security-reviewed in Phase 3 and is
not being reopened.

Companion docs: architectural decisions live in [`DECISIONS.md`](./DECISIONS.md); the detailed
findings (with full citations) live in [`_audit/PRE_LAUNCH_AUDIT.md`](./_audit/PRE_LAUNCH_AUDIT.md).

## Status legend

- `[ ]` Not started
- `[~]` In flight (with PR #)
- `[x]` Done (with merged SHA)

---

## Phase 4a: Must-fix before public launch

The blocking and launch-gating items. Hosting is first because it determines where several of the
others (headers, login throttle, logging) are actually implemented.

### `[ ]` 1. Choose and stand up the hosting posture  -  PR: ___
- **Why it matters:** A single PC + SQLite + a personal Cloudflare Tunnel cannot back a published
  site (single disk, single machine, single network, personal-account ingress). This gates the
  other 4a items.
- **Fix direction:** Publish the static public layer on a CDN/host and keep the reviewer server
  private on the PC. Every public route is SSG so a static/CDN deploy is low-risk; the reviewer
  layer is the part that, if ever moved, wants Postgres (schema is already Postgres-compatible) and
  object storage for `uploads/`.
- **Refs:** audit C.2, D.1; `src/lib/prisma.ts` (SQLite path), `src/app/api/snapshot/route.ts:47-48`
  (launches local Chromium), `next.config.mjs` (no `output: 'export'` since Phase 3a).

### `[ ]` 2. Add security headers  -  PR: ___
- **Why it matters:** The app sends no CSP, HSTS, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, or Permissions-Policy (verified live: only Cache-Control + Content-Type). No
  clickjacking or MIME-sniffing protection, no script-origin constraint.
- **Fix direction:** Add a response-header policy in `next.config` and/or at the edge. CSP needs a
  nonce or hashes for the inline theme-bootstrap script and KaTeX/Mermaid inline styles.
- **Refs:** audit C.1; `next.config.mjs:6-22` (no `headers()`), no `src/middleware.ts`,
  `src/app/layout.tsx:40-42` (inline bootstrap script).

### `[ ]` 3. Set the real production domain  -  PR: ___
- **Why it matters:** `metadataBase` is the placeholder `https://mnm-edu.example`, so every absolute
  OG URL and the derived canonical point at a non-existent domain. `NEXTAUTH_URL` likewise must be
  the real origin.
- **Fix direction:** Set the real origin before any public link is shared (depends on the domain
  decision in Open Questions).
- **Refs:** audit C.5, C.10, D.2; `src/app/layout.tsx:14`.

### `[ ]` 4. Throttle the reviewer login endpoint  -  PR: ___
- **Why it matters:** `POST /api/auth/callback/credentials` (NextAuth) is anonymous-reachable and
  unthrottled, so the public surface allows password-spray against reviewer accounts (bounded by
  invite-only accounts + the 12-char minimum, but still open).
- **Fix direction:** Rate-limit / lock out the login path (the in-memory limiter already exists) or
  protect it at the edge. See also the login-exposure Open Question.
- **Refs:** audit C.1, D.4; `src/lib/rateLimit.ts` (limiter exists, applied only to the two token
  routes), `src/lib/auth/options.ts`.

### `[ ]` 5. Add robots.txt + sitemap.xml  -  PR: ___
- **Why it matters:** Both currently 404. Nothing blocks indexing and nothing aids it; "public"
  implies a deliberate indexing decision.
- **Fix direction:** Decide index vs no-index (Open Questions), then emit `app/robots.ts` +
  `app/sitemap.ts` (the sitemap can enumerate the SSG routes; use the trailing-slash URL form).
- **Refs:** audit C.5, D.5 (both 404 live; no `public/robots.txt`/`sitemap.xml`, no app routes).

### `[ ]` 6. Legal scaffolding + public accountability  -  PR: ___
- **Why it matters:** No privacy policy, no terms of use, and no public contact / "report an issue"
  channel (the FAB is reviewer-only). The About page names no author, institution, or contact, which
  is a credibility gap for a public pediatric-neurocritical-care resource.
- **Fix direction:** Add the pages and a public contact path, and add authorship + affiliation +
  contact to About. You (or a lawyer) supply the wording; the gap is the missing pages, not phrasing.
- **Refs:** audit C.6, C.7, D.6; `src/app/about/page.tsx`, `src/components/layout/Footer.tsx:45-54`
  (Legal column has license lines only).

---

## Phase 4b: Soon after launch

Important but able to follow the launch.

### `[ ]` 7. Raster (PNG) Open Graph images  -  PR: ___
- **Why it matters:** OG/Twitter images are SVG, which major social scrapers (X, Facebook, LinkedIn,
  Slack) do not render, so share cards come up blank. (The earlier "11 missing OG images" gap is
  already closed; format is the remaining issue.)
- **Fix direction:** Emit PNG share cards (the `generate-og` prebuild already produces 55 SVGs, one
  per page; convert or render to raster).
- **Refs:** audit C.5, D.7; `src/app/layout.tsx:31-33`, `src/app/modalities/[slug]/page.tsx:34-35`,
  `scripts/generate-og.mjs`.

### `[ ]` 8. Accessibility: meet WCAG 2.1 AA  -  PR: ___
- **Why it matters:** axe finds no critical violations (all 12 pages pass), but serious
  color-contrast failures recur on 5 pages (~168 node-instances), plus `definition-list` structure
  (glossary) and `scrollable-region-focusable` (autoregulation, cppopt). AA is the stated target.
- **Fix direction:** Lift muted-ink token contrast above 4.5:1, fix the `<dl>` child markup, and add
  keyboard access (tabindex) to scroll containers; re-run the axe suite.
- **Refs:** audit C.4, D.8; `tests/e2e/a11y.spec.ts`, `src/styles/globals.css` (ink tokens),
  `src/app/glossary/page.tsx`.

### `[ ]` 9. Observability  -  PR: ___
- **Why it matters:** Zero today (no error monitoring, uptime, analytics, or log persistence);
  server errors go to stdout and vanish. Important once real traffic arrives.
- **Fix direction:** Add error monitoring (e.g. Sentry), an external uptime check (e.g. UptimeRobot
  or Cloudflare health checks), and optionally privacy-friendly analytics (e.g. Plausible/Umami,
  which fits the no-PII ethos and avoids a cookie-consent burden). Cookie disclosure becomes
  required if analytics is added (see Open Questions).
- **Refs:** audit C.9, D.9.

### `[ ]` 10. Refresh `.env.example`  -  PR: ___
- **Why it matters:** It is stale: it describes `PORT` as feeding the static-era `serve.js`, lists
  dead commented Supabase vars for a "Phase 3 not used yet" that actually shipped on Prisma/SQLite,
  and never documents `NEXTAUTH_SECRET` / `NEXTAUTH_URL` as required app vars. Misleads anyone
  setting up the production environment (which the hosting item needs).
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
- `[ ]` **Flip `images.unoptimized`** - only worthwhile if raster images exist and the chosen host
  runs the Next optimizer; modest on this SVG-heavy site. (audit C.3, D.15)
- `[ ]` **Custom branded 404** - currently the Next default `/_not-found`. (audit D.12)

---

## Open questions

Decisions still owed; each shapes one or more 4a items. When decided, the decision and its rationale
go to [`DECISIONS.md`](./DECISIONS.md) and the relevant item above is updated.

1. **Domain** - what is the real production domain? (gates 4a.3 `metadataBase`/`NEXTAUTH_URL`,
   canonical URLs, and OG absolute URLs)
2. **Indexing** - should search engines index the site? (gates 4a.5 robots/sitemap content)
3. **Login exposure** - should the reviewer login be reachable from the public domain at all, or only
   via the tunnel / a private host? If it is off the public domain, the brute-force surface shrinks
   and 4a.4 changes shape. (gates 4a.1 hosting split + 4a.4 login throttle)
4. **Analytics** - add analytics, and if so which? (gates 4b.9 observability + whether a
   cookie/analytics disclosure is required)
5. **About-page accountability** - who is named as the responsible author / institution, and what is
   the public contact? (gates 4a.6 About + legal contact)

---

## How this file is maintained

- **Status updates happen on PR merge**, at the same time as the project-memory update. An item goes
  `[ ]` -> `[~]` (with the PR #) when work starts, and `[~]` -> `[x]` (with the merged SHA) when it
  lands.
- **Items move between phases only with a deliberate note** (a one-line reason on the item), not
  silently.
- **This file should always reflect "what would I do next right now."** If it has drifted from
  reality, fix the file first.
- **When an Open Question is decided**, record the decision in `DECISIONS.md` and update the affected
  item(s) here.
