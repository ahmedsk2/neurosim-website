import { PrismaMariaDb } from '@prisma/adapter-mariadb';

/**
 * Build a MariaDB driver adapter from DATABASE_URL for the CLI / build scripts (Stage A, item 8).
 * Parses the URL so a percent-encoded password decodes correctly, and opts into TLS via
 * ?ssl=true (validate cert) or ?ssl=skip-verify. Mirrors src/lib/prisma.ts and prisma.config.ts.
 *
 * DATABASE_URL is read from the environment ONLY (.env is gitignored). Run the scripts via npm
 * (the package.json scripts pass --env-file-if-exists=.env) or `node --env-file=.env scripts/...`.
 */
export function mariadbAdapter() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    console.error('DATABASE_URL is not set (expected mysql://USER:PASS@HOST:3306/DB).');
    process.exit(1);
  }
  const u = new URL(raw);
  const base = {
    host: u.hostname,
    port: u.port ? Number(u.port) : 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ''),
  };
  const ssl = u.searchParams.get('ssl');
  const config =
    ssl === 'true' || ssl === 'require'
      ? { ...base, ssl: true }
      : ssl === 'skip-verify'
        ? { ...base, ssl: { rejectUnauthorized: false } }
        : base;
  return new PrismaMariaDb(config);
}
