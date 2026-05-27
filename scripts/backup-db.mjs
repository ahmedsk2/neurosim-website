#!/usr/bin/env node
/**
 * Hot backup of prisma/dev.db using better-sqlite3's online backup API. This is safe to run
 * while the server has the database open: it uses SQLite's backup machinery (not a naive file
 * copy) and produces a single CONSOLIDATED snapshot (any WAL/-shm content is folded in), so
 * there is no need to copy the *-wal / *-shm sidecars separately.
 *
 * Usage:
 *   npm run backup
 *   BACKUP_DIR=/path/to/dir npm run backup
 *
 * Output: BACKUP_DIR/dev-YYYYMMDD-HHMMSS.db  (default BACKUP_DIR = ./backups/). Each run makes a
 * new timestamped file (never overwrites). Exits non-zero on failure.
 *
 * NOT included (intentionally - see OPERATIONS.md):
 *   - .env       (secrets: NEXTAUTH_SECRET, SMTP_ENCRYPTION_KEY) - back up privately yourself
 *   - uploads/   (attachment screenshots) - can be large; back up separately
 * prisma/migrations/ is tracked in git and is needed alongside a restored DB.
 */
import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';

const root = process.cwd();
const src = path.join(root, 'prisma', 'dev.db');
const backupDir =
  process.env.BACKUP_DIR && process.env.BACKUP_DIR.trim()
    ? path.resolve(process.env.BACKUP_DIR.trim())
    : path.join(root, 'backups');

if (!fs.existsSync(src)) {
  console.error(`No database found at ${src} - nothing to back up.`);
  process.exit(1);
}

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
const dest = path.join(backupDir, `dev-${stamp}.db`);

fs.mkdirSync(backupDir, { recursive: true });

try {
  const db = new Database(src, { readonly: true, fileMustExist: true });
  try {
    await db.backup(dest);
  } finally {
    db.close();
  }
} catch (err) {
  console.error('Backup failed:', err instanceof Error ? err.message : err);
  process.exit(1);
}

const bytes = fs.statSync(dest).size;
console.log(`Backup written: ${dest}`);
console.log(`Size: ${(bytes / 1024).toFixed(1)} KiB (consolidated SQLite snapshot)`);
console.log('Not included: .env (secrets) and uploads/ (attachments) - back those up separately.');
console.log('Restore also needs prisma/migrations/ (tracked in git). See OPERATIONS.md.');
