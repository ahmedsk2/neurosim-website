#!/usr/bin/env node
/**
 * Create or update a Review Console reviewer (there is no public signup).
 *
 * Usage (password from env so it is not in shell history):
 *   REVIEWER_PASSWORD='...' npm run create-reviewer -- <email> <name> [role]
 *   REVIEWER_PASSWORD='...' node --env-file=.env scripts/create-reviewer.mjs <email> <name> [role]
 *
 * role defaults to 'validator' (one of validator | admin | implementer | observer).
 * Writes to MySQL/MariaDB via DATABASE_URL (Stage A, item 8). The email is normalized to
 * lowercase so it matches the case-insensitive login lookup (src/lib/auth/options.ts).
 */
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { mariadbAdapter } from './_dbAdapter.mjs';

const [rawEmail, name, role = 'validator'] = process.argv.slice(2);
const email = (rawEmail ?? '').trim().toLowerCase();
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

const prisma = new PrismaClient({ adapter: mariadbAdapter() });

const passwordHash = await bcrypt.hash(password, 12);
const reviewer = await prisma.reviewer.upsert({
  where: { email },
  create: { email, name, role, passwordHash },
  update: { name, role, passwordHash },
});
console.log(`reviewer ready: ${reviewer.email} (${reviewer.role}) id=${reviewer.id}`);
await prisma.$disconnect();
