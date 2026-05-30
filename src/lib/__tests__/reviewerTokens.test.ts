import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Prisma client BEFORE importing the module under test, so importing reviewerTokens does
// not spin up better-sqlite3 / touch dev.db. Only the methods exercised here are stubbed.
vi.mock('@/lib/prisma', () => ({
  prisma: { inviteToken: { findUnique: vi.fn() } },
}));

import { hashToken, inviteLink, requestBaseUrl, validateInviteToken } from '@/lib/reviewerTokens';
import { prisma } from '@/lib/prisma';

const findUnique = vi.mocked(prisma.inviteToken.findUnique);

describe('hashToken', () => {
  it('is deterministic and 64 hex chars (sha256)', () => {
    const a = hashToken('abc');
    expect(a).toBe(hashToken('abc'));
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });
  it('differs for different inputs (so the DB cannot be reverse-mapped to a token)', () => {
    expect(hashToken('abc')).not.toBe(hashToken('abd'));
  });
});

describe('inviteLink', () => {
  it('routes invite -> accept-invite and password_reset -> reset-password', () => {
    expect(inviteLink('https://x.test', 'invite', 't')).toBe('https://x.test/review/accept-invite?token=t');
    expect(inviteLink('https://x.test', 'password_reset', 't')).toBe('https://x.test/review/reset-password?token=t');
  });
  it('strips a trailing slash from the base and url-encodes the token', () => {
    expect(inviteLink('https://x.test/', 'invite', 'a b+/=')).toBe(
      'https://x.test/review/accept-invite?token=a%20b%2B%2F%3D',
    );
  });
});

describe('requestBaseUrl', () => {
  const reqWith = (headers: Record<string, string>) => ({ headers: new Headers(headers) }) as unknown as Request;

  it('prefers x-forwarded-proto/host (tunnel-aware)', () => {
    expect(requestBaseUrl(reqWith({ 'x-forwarded-proto': 'https', 'x-forwarded-host': 'mnm.towardpcc.com' }))).toBe(
      'https://mnm.towardpcc.com',
    );
  });
  it('falls back to Host with default http', () => {
    expect(requestBaseUrl(reqWith({ host: 'localhost:3041' }))).toBe('http://localhost:3041');
  });
});

describe('validateInviteToken (non-enumerating)', () => {
  const valid = {
    id: 'tok1',
    reviewerId: 'rev1',
    tokenHash: hashToken('good'),
    purpose: 'invite' as const,
    consumedAt: null as Date | null,
    expiresAt: new Date(Date.now() + 60_000),
  };

  beforeEach(() => findUnique.mockReset());

  it('accepts a valid, unconsumed, unexpired token of the right purpose', async () => {
    findUnique.mockResolvedValue(valid as never);
    await expect(validateInviteToken('good', 'invite')).resolves.toEqual({
      ok: true,
      tokenId: 'tok1',
      reviewerId: 'rev1',
    });
  });

  it('returns the SAME generic {ok:false} for empty / not-found / wrong-purpose / consumed / expired', async () => {
    // empty token: short-circuits without a DB lookup
    await expect(validateInviteToken('', 'invite')).resolves.toEqual({ ok: false });
    expect(findUnique).not.toHaveBeenCalled();

    findUnique.mockResolvedValue(null as never); // not found
    await expect(validateInviteToken('x', 'invite')).resolves.toEqual({ ok: false });

    findUnique.mockResolvedValue({ ...valid, purpose: 'password_reset' } as never); // wrong purpose
    await expect(validateInviteToken('good', 'invite')).resolves.toEqual({ ok: false });

    findUnique.mockResolvedValue({ ...valid, consumedAt: new Date() } as never); // already used
    await expect(validateInviteToken('good', 'invite')).resolves.toEqual({ ok: false });

    findUnique.mockResolvedValue({ ...valid, expiresAt: new Date(Date.now() - 1) } as never); // expired
    await expect(validateInviteToken('good', 'invite')).resolves.toEqual({ ok: false });
  });
});
