import path from 'node:path';
import { defineConfig } from 'prisma/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Mirrors the NeuroSim (master-picu-simulator) Prisma 7 convention: the datasource URL
// and the better-sqlite3 driver adapter live here, not in schema.prisma. To go hosted,
// flip datasource.provider to "postgresql" in schema.prisma and swap this adapter for a
// Postgres driver adapter pointed at a connection string.
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');

export default defineConfig({
  datasource: {
    url: `file:${dbPath}`,
  },
  // @ts-ignore - 'migrate' is valid in Prisma 7 runtime but lags in type definitions
  migrate: {
    adapter() {
      return new PrismaBetterSqlite3({ url: `file:${dbPath}` });
    },
  },
});
