import { defineConfig } from 'prisma/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// Stage A (item 8): SQLite -> MySQL/MariaDB. The connection + driver adapter live here (not in
// schema.prisma), mirroring the NeuroSim Prisma 7 convention. The mariadb driver speaks the MySQL
// wire protocol and connects to both MySQL and MariaDB (the Infomaniak managed target, 10.11.x).
//
// DATABASE_URL is read from the environment ONLY: never hardcoded, never committed (.env is
// gitignored; the real value is set in the server environment at deploy time). The URL is parsed
// here (not passed as a raw string) so a percent-encoded password is decoded correctly and so SSL
// can be opted in. Append ?ssl=true (validate the server cert) or ?ssl=skip-verify to the URL when
// the managed host requires TLS.
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

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  // @ts-ignore - 'migrate' is valid in Prisma 7 runtime but lags in type definitions
  migrate: {
    adapter() {
      return new PrismaMariaDb(mariadbConfig());
    },
  },
});
