// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Prisma singleton + bcrypt so authorizeCredentials() is unit-testable with no DB and no
// real hashing. vi.hoisted exposes the spy to the hoisted vi.mock factory.
const db = vi.hoisted(() => ({ reviewerFindUnique: vi.fn() }));
vi.mock('@/lib/prisma', () => ({
  prisma: { reviewer: { findUnique: db.reviewerFindUnique } },
}));
vi.mock('bcryptjs', () => ({ default: { compare: vi.fn() } }));

import { authorizeCredentials } from '../options';
import bcrypt from 'bcryptjs';

const compareMock = bcrypt.compare as unknown as ReturnType<typeof vi.fn>;

const ACTIVE_REVIEWER = {
  id: 'r1',
  email: 'admin@example.com',
  name: 'Admin',
  role: 'admin',
  isActive: true,
  passwordHash: 'bcrypt-hash',
};

describe('authorizeCredentials: email normalization (MySQL casing fix)', () => {
  beforeEach(() => {
    db.reviewerFindUnique.mockReset();
    compareMock.mockReset();
  });

  it('looks up the email lowercased + trimmed, so a mixed-case login resolves the stored record', async () => {
    db.reviewerFindUnique.mockResolvedValue(ACTIVE_REVIEWER);
    compareMock.mockResolvedValue(true);

    const user = await authorizeCredentials({ email: '  Admin@Example.COM  ', password: 'pw' });

    expect(db.reviewerFindUnique).toHaveBeenCalledWith({ where: { email: 'admin@example.com' } });
    expect(user).toMatchObject({ id: 'r1', email: 'admin@example.com', role: 'admin' });
  });

  it('normalizes before the lookup even when no account matches (no casing leak)', async () => {
    db.reviewerFindUnique.mockResolvedValue(null);

    const user = await authorizeCredentials({ email: 'NOBODY@Example.com', password: 'pw' });

    expect(user).toBeNull();
    expect(db.reviewerFindUnique).toHaveBeenCalledWith({ where: { email: 'nobody@example.com' } });
  });

  it('rejects when the password does not match', async () => {
    db.reviewerFindUnique.mockResolvedValue(ACTIVE_REVIEWER);
    compareMock.mockResolvedValue(false);

    const user = await authorizeCredentials({ email: 'admin@example.com', password: 'wrong' });

    expect(user).toBeNull();
  });

  it('returns null when credentials are missing (no lookup attempted)', async () => {
    expect(await authorizeCredentials(undefined)).toBeNull();
    expect(await authorizeCredentials({ email: '', password: '' })).toBeNull();
    expect(db.reviewerFindUnique).not.toHaveBeenCalled();
  });
});
