import { REVIEWED_STATUSES } from '@/lib/enums';

/**
 * The finding lifecycle transition map (PHASE3_SCHEMA_PROPOSAL.md D.3). Drift handling
 * is folded in: from a reviewed state (resolved/verified/closed) a finding can re-open
 * to in_progress, and `closed` is re-openable on drift.
 */
export const ALLOWED_TRANSITIONS: Record<string, readonly string[]> = {
  open: ['triaged'],
  triaged: ['accepted', 'wontfix', 'duplicate'],
  accepted: ['in_progress'],
  in_progress: ['resolved'],
  resolved: ['verified', 'in_progress'],
  verified: ['closed', 'in_progress'],
  closed: ['in_progress'],
  wontfix: [],
  duplicate: [],
};

export function canTransition(from: string, to: string): boolean {
  return (ALLOWED_TRANSITIONS[from] ?? []).includes(to);
}

/**
 * Re-attest: a reviewed finding (resolved/verified/closed) re-affirmed against the
 * current contentHash with its status unchanged. This clears the stale flag (D.5).
 */
export function isReattest(from: string, to: string): boolean {
  return from === to && (REVIEWED_STATUSES as readonly string[]).includes(from);
}

/** Entering these statuses stamps reviewedContentHash = the current Page.contentHash. */
export function stampsReviewedHash(to: string): boolean {
  return to === 'resolved' || to === 'verified' || to === 'closed';
}

/**
 * Derived "needs re-verification" (D.5): a reviewed finding whose page changed since the
 * resolved/verified/closed state was established. Keyed on contentHash, not gitSha (N3).
 */
export function needsReverification(
  status: string,
  reviewedContentHash: string | null,
  pageContentHash: string,
): boolean {
  return (
    (REVIEWED_STATUSES as readonly string[]).includes(status) &&
    reviewedContentHash !== null &&
    reviewedContentHash !== pageContentHash
  );
}
