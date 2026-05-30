# Operations

Practical notes for whoever runs this on their PC. Short and to the point.

## 1. What this system is

The MNM-Edu Review Console is a local-PC clinical-review platform. The app runs on
this one machine and is published to the internet at https://mnm.towardpcc.com
through a Cloudflare Tunnel. Everything that matters lives on THIS machine: the
review database, the encrypted SMTP credential, and the uploaded attachment files.
There is no cloud database and no managed backup. If the PC dies and nothing was
copied off it, the review history is gone.

## 2. Critical files to protect

Three things, in order of how much it hurts to lose them:

1. **`.env`** (gitignored, never commit) holds the secrets:
   - `NEXTAUTH_SECRET` signs reviewer login sessions. If lost or changed: active
     sessions become invalid and reviewers just log in again. Low pain.
   - `SMTP_ENCRYPTION_KEY` is the AES-256 key that encrypts the stored SMTP
     password. If lost or changed: the saved SMTP password can no longer be
     decrypted, so reviewer emails stop until an admin re-enters it in
     `/review/settings`. Recoverable, but annoying.
2. **`prisma/dev.db`** is the ENTIRE review history: every finding, its audit
   trail, comments, and attachment records. If lost: everything is gone. This is
   the one to back up (section 3).
3. **`uploads/findings/`** holds the screenshot and annotation image files attached
   to findings. If lost: the image files are gone, but the findings themselves
   (text, audit, status) survive in `dev.db`.

Everything else (the code, the educational content, the schema, and
`prisma/migrations/`) lives in git on GitHub and is not at risk from a local disk
failure. Only `.env`, `dev.db`, and `uploads/` are PC-only.

## 3. Backup workflow

Run a backup:

```
npm run backup
```

- It writes a consolidated SQLite snapshot to `./backups/dev-YYYYMMDD-HHMMSS.db`.
  It is safe to run while the server is up (it uses SQLite's online backup, not a
  plain file copy), and each run makes a new timestamped file.
- Choose a different location with `BACKUP_DIR`, for example
  `BACKUP_DIR=D:\mnm-backups npm run backup`.
- `backups/` is gitignored, so backups are never committed.
- It does NOT include `.env` or `uploads/` (handle those separately, below).

Suggested cadence:

- Daily while findings are being filed actively; weekly otherwise.
- Copy the backups OFF this machine regularly (OneDrive, an external drive, or an
  encrypted cloud folder). A backup sitting on the same disk as `dev.db` does not
  survive a disk failure.
- Also keep a private copy of `.env` (password manager or encrypted note), and
  occasionally copy the `uploads/` folder.

## 4. Restoring from backup

1. Stop the server (close the running process so port 3041 is free).
2. Swap in the backup: rename the current `prisma/dev.db` (keep it just in case),
   then copy your chosen `backups/dev-*.db` to `prisma/dev.db`.
3. If that backup predates a schema change, bring its schema current:
   `npx prisma migrate deploy` (migrations come from git).
4. Restart the server (section 6).

Caveat: if `SMTP_ENCRYPTION_KEY` in `.env` has changed since that backup was taken,
the SMTP password stored inside it will not decrypt. Re-enter the SMTP password in
`/review/settings` after restoring.

## 5. Key management

Generate a fresh 32-byte key (base64):

```
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

- Put the value in `.env` as `SMTP_ENCRYPTION_KEY=...`, restart the server, then
  re-enter the SMTP password once in `/review/settings` (it is re-encrypted with
  the new key).
- `.env` is the only copy of these secrets, so keep it backed up somewhere private.
- If `SMTP_ENCRYPTION_KEY` is lost: nothing breaks except outbound email. Generate
  a new key, restart, and re-enter the SMTP password.
- `NEXTAUTH_SECRET` can likewise be regenerated; doing so just logs everyone out.

## 6. Running the server

From the project folder:

```
npm install              # first time, or after pulling new code
npm run build            # compile the app (also regenerates the search index)
npx next start -p 3041   # serve on http://localhost:3041
```

- Use `-p 3041` (or set `PORT=3041`): a bare `npm run start` uses Next's default
  port, but the Cloudflare Tunnel expects 3041.
- The public URL https://mnm.towardpcc.com works only while the Cloudflare Tunnel
  is running and pointed at `localhost:3041`. The tunnel is already configured; if
  the public site is down, check that both the tunnel and the server (on 3041) are
  running.
- Reviewer accounts: there is no public signup. Create one with
  `REVIEWER_PASSWORD=... npm run create-reviewer -- <email> <name> [role]`
  (role is one of validator, admin, implementer, observer).

## 7. Cloudflare settings required for the strict CSP

The strict nonce-based Content-Security-Policy (Option B; see `docs/DECISIONS.md` and
`src/middleware.ts`) trusts ONLY inline scripts that carry the per-request nonce Next emits. Any
Cloudflare feature that auto-injects or rewrites scripts on the fly produces non-nonced inline
scripts, which the browser refuses to execute, and the symptoms look like a broken site: widgets
dead, console full of "Refused to execute inline script" CSP errors. This cost a debugging round at
launch; it must be re-verified after every Cloudflare configuration change and whenever a new zone
is set up.

These Cloudflare features MUST stay OFF on the `mnm.towardpcc.com` zone:

- **Rocket Loader** - this is the one that actually broke the launch. Rocket Loader replaces page
  scripts with a Cloudflare loader script (non-nonced) and defers them, blocking essentially every
  page script under strict CSP. Dashboard: Speed -> Optimization -> Content Optimization -> Rocket
  Loader (must be OFF).
- **Email Obfuscation** - rewrites `mailto:` links and injects an inline decoder script. Would
  break the About page contact (`info@towardpcc.com`) and any other email link, with a CSP
  violation on the decoder. Dashboard: Scrape Shield -> Email Address Obfuscation (must be OFF).
- **Cloudflare Web Analytics auto-injection / Insights beacon** - if enabled, Cloudflare injects
  `static.cloudflareinsights.com/beacon.min.js` on every page. The script is non-nonced and
  cross-origin, so it would be blocked by both `script-src 'nonce-...' 'strict-dynamic'` and the
  absence of `static.cloudflareinsights.com` from `connect-src`. Dashboard: Analytics & Logs ->
  Web Analytics -> auto-injection (must be OFF). The cookie-banner PR will add Google Analytics
  with consent gating; do not enable Cloudflare's beacon in parallel.
- Any other "Auto Minify", "HTML rewrite", or "auto-inject" feature on the zone should be checked.
  Rule of thumb: under strict CSP, the zone must not modify response HTML at all.

**After changing any of these settings, purge the Cloudflare cache** (Caching -> Configuration ->
Purge Everything), or the next request will replay a previously-rewritten HTML response from the
edge cache and the symptoms will persist.

**Setting up a NEW Cloudflare zone** (different domain, second site) requires re-doing these
toggles. New zones default Rocket Loader OFF, but Email Obfuscation defaults ON in many account
templates, and Web Analytics auto-injection varies. Treat this section as a checklist whenever the
public origin moves.

## 8. Server-side snapshot disabled on this host (no Chromium)

The reviewer overlay's "Capture page" button posts to `/api/snapshot`, which launches a
headless Chromium via Playwright to render the full page. Infomaniak's Managed Cloud Server
does not ship Chromium and it has not been installed here, so server-side snapshot is disabled.

The `NEXT_PUBLIC_ENABLE_SERVER_SNAPSHOT` env flag controls this:

- **Unset (default) or `0`:** the API returns a clean `503` instead of crashing; the UI hides
  the "Capture page" button entirely so it is not shown-and-broken; only "Capture my current
  view" (the browser's `getDisplayMedia`) is offered, and that path stays fully working.
- **`1`:** the API and the UI re-enable the server-side path. Only set this on a host where
  Chromium and the Playwright OS deps are installed
  (`npx playwright install --with-deps chromium`).

The feature has not been removed - it stays a single env flag flip away on a Chromium-capable
host. The same `NEXT_PUBLIC_` flag is read by both the API route
(`src/app/api/snapshot/route.ts`) and `src/components/review-overlay/FindingComposer.tsx`.

## 9. What this system is NOT

This is an educational review tool, NOT a HIPAA-compliant clinical record system
and NOT a medical device. Do not put patient-identifiable information in it. It is
also not a backup for the educational content itself (that lives in git). Treat the
review data as working notes for improving educational material, kept on a single
personal machine, with the backup discipline above.
