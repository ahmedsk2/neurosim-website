#!/usr/bin/env node
/**
 * Create or update a Review Console reviewer (there is no public signup).
 *
 * Usage (password from env so it is not in shell history):
 *   REVIEWER_PASSWORD='...' node scripts/create-reviewer.mjs <email> <name> [role]
 *   REVIEWER_PASSWORD='...' npm run create-reviewer -- <email> <name> [role]
 *
 * role defaults to 'validator' (one of validator | admin | implementer | observer).
 * Requires a migrated prisma/dev.db (npm run db:migrate).
 */
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const [email, name, role = 'validator'] = process.argv.slice(2);
const password = process.env.REVIEWER_PASSWORD;

if (!email || !name || !password) {
  console.error('Usage: REVIEWER_PASSWORD=... node scripts/create-reviewer.mjs <email> <name> [role]');
  process.exit(1);
}
const ALLOWED = ['validator', 'admin', 'implementer', 'observer'];
if (!ALLOWED.includes(role)) {
  console.error(`role must be one of: ${ALLOWED.join(', ')}`);
  process.exit(1);
}

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: `file:${dbPath}` }) });

const passwordHash = await bcrypt.hash(password, 12);
const reviewer = await prisma.reviewer.upsert({
  where: { email },
  create: { email, name, role, passwordHash },
  update: { name, role, passwordHash },
});
console.log(`reviewer ready: ${reviewer.email} (${reviewer.role}) id=${reviewer.id}`);
await prisma.$disconnect();
