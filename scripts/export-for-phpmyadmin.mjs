#!/usr/bin/env node
/**
 * Generate a DATA-ONLY MySQL/MariaDB SQL dump from the local SQLite dev.db, for a phpMyAdmin
 * import into a database that ALREADY has the schema (created by `prisma db push`).
 *
 * STRICT properties (so the import cannot corrupt anything):
 *  - DATA-ONLY: only INSERTs (+ a couple of SET statements). NO CREATE / DROP / ALTER. It can
 *    never redefine a table or reintroduce a VARCHAR(191) truncation; the @db.Text columns stay
 *    exactly as the schema made them.
 *  - utf8mb4: the file is UTF-8 and begins with `SET NAMES utf8mb4;` so multibyte / special bytes
 *    are interpreted correctly (ciphertext + free-text are not mangled by a charset mismatch).
 *  - Byte-faithful strings: every string is escaped with the mysql_real_escape_string rule
 *    (scripts/_sqlEscape.mjs), so the exact bytes survive - including the AES-256-GCM
 *    SmtpSetting.pass ciphertext (treated as an opaque exact string), the @db.Text free-text, and
 *    the FindingAudit.detail JSON. Nothing is transformed, re-encoded, or "cleaned".
 *  - FK-safe: rows are emitted in dependency order AND wrapped in
 *    `SET FOREIGN_KEY_CHECKS=0; ... SET FOREIGN_KEY_CHECKS=1;` so phpMyAdmin never rejects a row on
 *    FK ordering or the self-referential Finding (duplicateOfId -> Finding.id). FK_CHECKS is a
 *    session variable; phpMyAdmin runs the whole file in one session, so it covers every INSERT.
 *  - DateTime columns (detected by their SQLite declared type) are converted from ISO text to
 *    MySQL `YYYY-MM-DD HH:MM:SS.fff` (UTC). Booleans (0/1) and Ints are numeric literals; NULL is
 *    NULL.
 *
 * Import the file ONCE into the freshly-pushed (empty) schema; re-importing would hit duplicate-key
 * errors on the primary keys.
 *
 * Usage:
 *   node scripts/export-for-phpmyadmin.mjs [--source prisma/dev.db] [--out mnm-data-export.sql]
 *
 * SECURITY: the output contains REAL data including reviewer emails and the encrypted SMTP secret.
 * It is gitignored - never commit it.
 */
import fs from 'node:fs';
import Database from 'better-sqlite3';
import { escapeMysqlString } from './_sqlEscape.mjs';

const args = process.argv.slice(2);
const argVal = (flag, def) => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const SOURCE = argVal('--source', 'prisma/dev.db');
const OUT = argVal('--out', 'mnm-data-export.sql');

// FK-dependency order (parents first); children reference rows already emitted above them.
const ORDER = [
  'Page',
  'Heading',
  'Reviewer',
  'InviteToken',
  'Finding',
  'FindingComment',
  'FindingAudit',
  'FindingAttachment',
  'EmailTemplate',
  'SmtpSetting',
];

const db = new Database(SOURCE, { readonly: true, fileMustExist: true });

const tableExists = (t) => !!db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name=?").get(t);
const columnsOf = (t) =>
  db.prepare(`PRAGMA table_info("${t}")`).all().map((c) => ({ name: c.name, type: String(c.type || '').toUpperCase() }));

function toMysqlDateTime(v) {
  const d = typeof v === 'number' ? new Date(v) : new Date(String(v));
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}.${p(d.getUTCMilliseconds(), 3)}`;
}

const out = [];
out.push('-- MNM-Edu data-only export for phpMyAdmin (MySQL/MariaDB).');
out.push('-- The target schema must ALREADY exist (prisma db push). INSERTs only - no DDL.');
out.push('-- Import ONCE into the empty schema. Generated ' + new Date().toISOString() + '.');
out.push('SET NAMES utf8mb4;');
out.push('SET FOREIGN_KEY_CHECKS=0;');
out.push('');

const counts = {};
for (const t of ORDER) {
  if (!tableExists(t)) {
    counts[t] = 'table missing';
    continue;
  }
  const cols = columnsOf(t);
  const names = cols.map((c) => c.name);
  const isDateTime = new Set(
    cols.filter((c) => c.type.includes('DATE') || c.type.includes('TIME')).map((c) => c.name),
  );
  const rows = db.prepare(`SELECT * FROM "${t}"`).all();
  counts[t] = rows.length;
  if (rows.length === 0) continue;

  const colList = names.map((n) => '`' + n + '`').join(', ');
  out.push(`-- ${t}: ${rows.length} row(s)`);
  for (const row of rows) {
    const values = names.map((n) => {
      const v = row[n];
      if (v === null || v === undefined) return 'NULL';
      if (isDateTime.has(n)) return `'${toMysqlDateTime(v)}'`;
      if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
      if (typeof v === 'bigint') return v.toString();
      if (Buffer.isBuffer(v)) return `0x${v.toString('hex')}`;
      return `'${escapeMysqlString(String(v))}'`;
    });
    out.push(`INSERT INTO \`${t}\` (${colList}) VALUES (${values.join(', ')});`);
  }
  out.push('');
}

out.push('SET FOREIGN_KEY_CHECKS=1;');
out.push('');

fs.writeFileSync(OUT, out.join('\n'), { encoding: 'utf8' });
db.close();

console.log(`Wrote ${OUT}`);
console.log('Per-table row counts (source dev.db):');
let total = 0;
for (const t of ORDER) {
  console.log(`  ${t}: ${counts[t]}`);
  if (typeof counts[t] === 'number') total += counts[t];
}
console.log(`  TOTAL data rows: ${total}`);
