import { createHash, randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import type { InvitePurpose } from '@/lib/enums';

const TOKEN_BYTES = 32; // 256-bit random token
const EXPIRY_DAYS = 7;

/** sha256(token) hex - what the DB stores. The plaintext token lives only in the emailed link. */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Create a one-time token for a reviewer and store ONLY its sha256 hash (+ a 7-day expiry).
 * Returns the plaintext token for the email link; it is never persisted in plaintext.
 */
export async function createInviteToken(
  reviewerId: string,
  purpose: InvitePurpose,
): Promise<{ id: string; token: string; expiresAt: Date }> {
  const token = randomBytes(TOKEN_BYTES).toString('base64url'); // URL-safe, no padding
  const expiresAt = new Date(Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  const row = await prisma.inviteToken.create({
    data: { reviewerId, tokenHash: hashToken(token), purpose, expiresAt },
  });
  return { id: row.id, token, expiresAt };
}

export type TokenLookup = { ok: true; tokenId: string; reviewerId: string } | { ok: false };

/**
 * Validate a token (by hash) for a purpose: it must exist, match the purpose, be unconsumed,
 * and be unexpired. Returns a SINGLE generic { ok: false } for every failure mode so callers
 * cannot distinguish "not found" vs "expired" vs "already used" (no enumeration).
 */
export async function validateInviteToken(token: string, purpose: InvitePurpose): Promise<TokenLookup> {
  if (!token) return { ok: false };
  const row = await prisma.inviteToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!row || row.purpose !== purpose || row.consumedAt !== null || row.expiresAt.getTime() <= Date.now()) {
    return { ok: false };
  }
  return { ok: true, tokenId: row.id, reviewerId: row.reviewerId };
}

/**
 * Redeem a token and set the reviewer's password, atomically and single-use: the token is
 * consumed with a conditional update (only if still unconsumed + unexpired), so a racing second
 * request cannot redeem it twice. Does NOT change isActive, so a deactivated reviewer cannot
 * reactivate via a reset link. Returns a generic ok:false on any failure (no enumeration).
 */
export async function setPasswordViaToken(
  token: string,
  purpose: InvitePurpose,
  password: string,
): Promise<{ ok: boolean }> {
  const lookup = await validateInviteToken(token, purpose);
  if (!lookup.ok) return { ok: false };
  const passwordHash = await bcrypt.hash(password, 12);
  try {
    await prisma.$transaction(async (tx) => {
      const consumed = await tx.inviteToken.updateMany({
        where: { id: lookup.tokenId, consumedAt: null, expiresAt: { gt: new Date() } },
        data: { consumedAt: new Date() },
      });
      if (consumed.count !== 1) throw new Error('token already consumed'); // race -> roll back
      await tx.reviewer.update({ where: { id: lookup.reviewerId }, data: { passwordHash } });
    });
  } catch {
    return { ok: false };
  }
  return { ok: true };
}

/** Public base URL from the request (tunnel-aware: x-forwarded-* first, then Host, then env). */
export function requestBaseUrl(req: Request): string {
  const proto = req.headers.get('x-forwarded-proto') ?? 'http';
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  return (host ? `${proto}://${host}` : (process.env.NEXTAUTH_URL ?? '')).replace(/\/+$/, '');
}

/** The public redemption URL for a token (invite -> accept-invite, reset -> reset-password). */
export function inviteLink(base: string, purpose: InvitePurpose, token: string): string {
  const page = purpose === 'invite' ? 'accept-invite' : 'reset-password';
  return `${base.replace(/\/+$/, '')}/review/${page}?token=${encodeURIComponent(token)}`;
}
