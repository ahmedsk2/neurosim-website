// Client-safe role helpers (no server deps). Imports only the plain value array from
// the Zod enum module, so this is safe to use in client components for UX gating.
import { REVIEWER_ROLES } from '@/lib/enums';

/**
 * Any authenticated Reviewer (validator / admin / implementer / observer) may use the
 * Review Console. Finer-grained, action-specific gates (e.g. admin-only triage) are
 * enforced per action, not here. The real security boundary is the server-side gate +
 * the API routes; this helper is for UX and the page redirect.
 */
export function isReviewerRole(role: string | null | undefined): boolean {
  return !!role && (REVIEWER_ROLES as readonly string[]).includes(role);
}
