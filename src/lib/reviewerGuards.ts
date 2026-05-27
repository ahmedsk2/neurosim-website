import type { ReviewerRole } from '@/lib/enums';

/**
 * Pure decision helpers for the admin reviewer-management guards, extracted so the
 * security-critical rules (no self-deactivation, never zero admins, confirm admin promotion) can
 * be unit-tested deterministically without a DB or a session. The PATCH route composes these with
 * the live active-admin count.
 */
export interface ReviewerState {
  role: string;
  isActive: boolean;
}
export interface ReviewerChange {
  role?: ReviewerRole;
  isActive?: boolean;
}

/** The actor is trying to deactivate their OWN account (blocked, so an admin cannot lock themselves out). */
export function isSelfDeactivation(targetId: string, actorId: string, change: ReviewerChange): boolean {
  return targetId === actorId && change.isActive === false;
}

/** Promotion to admin from a non-admin role (requires an explicit confirmAdmin flag). */
export function isAdminPromotion(target: ReviewerState, change: ReviewerChange): boolean {
  return change.role === 'admin' && target.role !== 'admin';
}

/**
 * True when the change would remove the target from the set of ACTIVE ADMINS (demote away from
 * admin, or deactivate while an admin). The route then counts active admins and blocks the change
 * when this is the last one, so the Console can never be left with zero admins.
 */
export function removesActiveAdmin(target: ReviewerState, change: ReviewerChange): boolean {
  const demotes = change.role !== undefined && change.role !== 'admin';
  const deactivates = change.isActive === false;
  return target.role === 'admin' && target.isActive && (demotes || deactivates);
}
