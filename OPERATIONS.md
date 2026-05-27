# Operations

Practical notes for whoever runs this on their PC. Short and to the point.

## 1. What this system is

The MNM-Edu Review Console is a local-PC clinical-review platform. The app runs on
this one machine and is published to the internet at https://web.towardpcc.com
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
- The public URL https://web.towardpcc.com works only while the Cloudflare Tunnel
  is running and pointed at `localhost:3041`. The tunnel is already configured; if
  the public site is down, check that both the tunnel and the server (on 3041) are
  running.
- Reviewer accounts: there is no public signup. Create one with
  `REVIEWER_PASSWORD=... npm run create-reviewer -- <email> <name> [role]`
  (role is one of validator, admin, implementer, observer).

## 7. What this system is NOT

This is an educational review tool, NOT a HIPAA-compliant clinical record system
and NOT a medical device. Do not put patient-identifiable information in it. It is
also not a backup for the educational content itself (that lives in git). Treat the
review data as working notes for improving educational material, kept on a single
personal machine, with the backup discipline above.
