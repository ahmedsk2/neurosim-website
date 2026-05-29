#!/usr/bin/env node
/**
 * One-time data migration: old SQLite dev.db -> MySQL/MariaDB (Stage C of item 8).
 *
 * Reads every row from the source SQLite file with the better-sqlite3 driver (raw, read-only) and
 * writes to the target MySQL via the Prisma client (mariadb adapter, DATABASE_URL). Rows are copied
 * in FK-respecting order with their explicit ids; MySQL advances AUTO_INCREMENT past them
 * automatically (no manual sequence reset, unlike Postgres).
 *
 * SmtpSetting.pass holds the AES-256-GCM ciphertext (base64). It is a plain String and is copied
 * VERBATIM (no transform / re-encode), so it stays decryptable as long as the SAME
 * SMTP_ENCRYPTION_KEY is present on the target server.
 *
 * Caveat: @updatedAt columns (Finding.updatedAt, EmailTemplate.updatedAt, SmtpSetting.updatedAt)
 * are set by Prisma to the migration time on insert. createdAt and all other timestamps are
 * preserved verbatim, and the authoritative history (append-only FindingAudit, with its own `at`)
 * is preserved exactly.
 *
 * Usage:
 *   node --env-file=.env scripts/migrate-to-mysql.mjs [--source prisma/dev.db] [--truncate]
 *
 *   --truncate first clears the target (reverse FK order) so a re-run / test is idempotent.
 *
 * Prints a per-table source-vs-target row-count diff and exits non-zero on any mismatch.
 */
import Database from 'better-sqlite3';
import { PrismaClient } from '@prisma/client';
import { mariadbAdapter } from './_dbAdapter.mjs';

const args = process.argv.slice(2);
function argVal(flag, def) {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
}
const SOURCE = argVal('--source', 'prisma/dev.db');
const TRUNCATE = args.includes('--truncate');

// FK-respecting insert order (parents first). Reverse it for truncation.
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

// Columns that SQLite stores as ISO strings (DateTime) / as 0|1 (Boolean) and must be converted
// to JS Date / boolean before the Prisma MySQL write. Everything else passes through unchanged.
const DATETIME = {
  Page: ['lastSyncedAt'],
  Heading: [],
  Reviewer: ['createdAt'],
  InviteToken: ['expiresAt', 'consumedAt', 'createdAt'],
  Finding: ['resolvedAt', 'verifiedAt', 'createdAt', 'updatedAt', 'lastNotifiedAt', 'deletedAt'],
  FindingComment: ['createdAt'],
  FindingAudit: ['at'],
  FindingAttachment: ['createdAt'],
  EmailTemplate: ['createdAt', 'updatedAt'],
  SmtpSetting: ['updatedAt'],
};
const BOOLEAN = {
  Reviewer: ['isActive'],
  EmailTemplate: ['isActive'],
  SmtpSetting: ['secure'],
};

const delegate = (model) => model.charAt(0).toLowerCase() + model.slice(1);

function rowToData(model, row) {
  const dt = new Set(DATETIME[model] ?? []);
  const bool = new Set(BOOLEAN[model] ?? []);
  const data = {};
  for (const [key, value] of Object.entries(row)) {
    if (value === null || value === undefined) {
      data[key] = null;
    } else if (dt.has(key)) {
      data[key] = value instanceof Date ? value : new Date(value);
    } else if (bool.has(key)) {
      data[key] = Boolean(value);
    } else {
      data[key] = value;
    }
  }
  return data;
}

const sqlite = new Database(SOURCE, { readonly: true, fileMustExist: true });
const prisma = new PrismaClient({ adapter: mariadbAdapter() });

const sourceCount = (model) => sqlite.prepare(`SELECT COUNT(*) AS c FROM "${model}"`).get().c;
const sourceRows = (model) => sqlite.prepare(`SELECT * FROM "${model}"`).all();

async function main() {
  console.log(`source: ${SOURCE}`);

  if (TRUNCATE) {
    for (const model of [...ORDER].reverse()) {
      const r = await prisma[delegate(model)].deleteMany({});
      console.log(`  truncate ${model}: deleted ${r.count}`);
    }
  }

  for (const model of ORDER) {
    const rows = sourceRows(model);
    // Finding has a self-relation (duplicateOfId -> Finding.id). Insert that FK as null first, then
    // backfill, so a row referencing a not-yet-inserted finding cannot trip the foreign key.
    const deferSelfRef = model === 'Finding';
    const backfill = [];

    for (const row of rows) {
      const data = rowToData(model, row);
      if (deferSelfRef && data.duplicateOfId != null) {
        backfill.push({ id: data.id, duplicateOfId: data.duplicateOfId });
        data.duplicateOfId = null;
      }
      await prisma[delegate(model)].create({ data });
    }
    for (const b of backfill) {
      await prisma.finding.update({ where: { id: b.id }, data: { duplicateOfId: b.duplicateOfId } });
    }
    console.log(`  copied ${model}: ${rows.length}`);
  }

  console.log('\nverification (source vs target row counts):');
  let mismatch = false;
  for (const model of ORDER) {
    const s = sourceCount(model);
    const t = await prisma[delegate(model)].count();
    const ok = s === t;
    if (!ok) mismatch = true;
    console.log(`  ${ok ? 'OK ' : 'XX '} ${model}: source=${s} target=${t}`);
  }

  await prisma.$disconnect();
  sqlite.close();

  if (mismatch) {
    console.error('\nROW COUNT MISMATCH - migration incomplete.');
    process.exit(1);
  }
  console.log('\nAll table row counts match. Migration complete.');
}

main().catch(async (e) => {
  console.error('migration failed:', e);
  try {
    await prisma.$disconnect();
  } catch {}
  try {
    sqlite.close();
  } catch {}
  process.exit(1);
});
