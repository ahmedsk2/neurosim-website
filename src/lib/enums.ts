import { z } from 'zod';

/**
 * The single source of truth for the Console's enumerated values (locked resolution 2,
 * docs/_audit/PHASE3_SCHEMA_PROPOSAL.md). On SQLite these are stored as String columns
 * and validated at runtime here (used by the sync and by finding create/transition). On
 * the Postgres flip these same value sets become native Prisma enums (Section E), so the
 * members must stay identical.
 */

export const FindingSeverity = z.enum(['blocker', 'major', 'minor', 'nitpick']);

export const FindingCategory = z.enum([
  'clinical-accuracy',
  'citation',
  'evidence-grade',
  'figure',
  'pediatric-specific',
  'typo-grammar',
  'accessibility',
  'code-bug',
  'ux-clarity',
  'other',
]);

export const FindingStatus = z.enum([
  'open',
  'triaged',
  'accepted',
  'in_progress',
  'resolved',
  'verified',
  'closed',
  'wontfix',
  'duplicate',
]);

export const ReviewerRole = z.enum(['validator', 'admin', 'implementer', 'observer']);

export const AuditAction = z.enum([
  'created',
  'status_change',
  'assigned',
  'edited',
  'commented',
  'drift_detected', // system event: a reviewed page's contentHash changed (D.5)
  'reverified', // reviewer re-attested a stale finding against the new contentHash (D.5)
]);

// Value arrays (derived from the schemas, so there is exactly one definition each).
export const FINDING_SEVERITIES = FindingSeverity.options;
export const FINDING_CATEGORIES = FindingCategory.options;
export const FINDING_STATUSES = FindingStatus.options;
export const REVIEWER_ROLES = ReviewerRole.options;
export const AUDIT_ACTIONS = AuditAction.options;

export type FindingSeverity = z.infer<typeof FindingSeverity>;
export type FindingCategory = z.infer<typeof FindingCategory>;
export type FindingStatus = z.infer<typeof FindingStatus>;
export type ReviewerRole = z.infer<typeof ReviewerRole>;
export type AuditAction = z.infer<typeof AuditAction>;

/**
 * Statuses whose terminal/resolved state is invalidated when the page content changes
 * after review, so a re-sync flags them for re-verification (D.5).
 */
export const REVIEWED_STATUSES = ['resolved', 'verified', 'closed'] as const satisfies readonly FindingStatus[];
