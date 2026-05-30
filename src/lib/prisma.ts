import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// Runtime client (mirrors the NeuroSim lib/prisma.ts singleton). Stage A (item 8) migrated
// SQLite -> MySQL/MariaDB. The mariadb driver adapter reads DATABASE_URL from the environment
// ONLY (never hardcoded; set in the server env at deploy time; .env locally and gitignored).
// The URL is parsed (not passed as a raw string) so a percent-encoded password decodes correctly
// and SSL can be opted in via ?ssl=true / ?ssl=skip-verify. Kept in sync with prisma.config.ts.
function mariadbConfig() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error('DATABASE_URL is not set (expected mysql://USER:PASS@HOST:3306/DB).');
  const u = new URL(raw);
  const base = {
    host: u.hostname,
    port: u.port ? Number(u.port) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ''),
  };
  const ssl = u.searchParams.get('ssl');
  if (ssl === 'true' || ssl === 'require') return { ...base, ssl: true };
  if (ssl === 'skip-verify') return { ...base, ssl: { rejectUnauthorized: false } };
  return base;
}

function createPrismaClient() {
  const adapter = new PrismaMariaDb(mariadbConfig());
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
