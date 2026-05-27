#!/usr/bin/env node
/**
 * Seed the Review Console's default email templates (admin -> reviewer status notifications).
 *
 * Usage:
 *   node scripts/seed-email-templates.mjs            # create any missing templates (safe; never clobbers admin edits)
 *   SEED_FORCE=1 node scripts/seed-email-templates.mjs   # also refresh existing templates back to these defaults
 *   npm run seed-email-templates
 *
 * Requires a migrated prisma/dev.db (npm run db:migrate / prisma migrate dev). Idempotent:
 * by default it only fills in templates that do not exist yet, so re-running will not overwrite
 * a template the admin has edited in-app. Pass SEED_FORCE=1 to reset the defaults during dev.
 *
 * Placeholders ({{...}}) are resolved at compose time by src/lib/email/templates.ts:
 *   {{reviewerName}} {{ticketTitle}} {{page}} {{status}} {{link}}
 */
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const SIGNOFF = 'The MNM-Edu review team';

const TEMPLATES = [
  {
    key: 'triaged',
    label: 'Triaged',
    subject: 'Your review finding has been triaged: {{ticketTitle}}',
    body: `Hi {{reviewerName}},

Thank you for your review finding on {{page}}. We have triaged it and it is now in our queue for assessment.

You can follow its progress on your ticket here:
{{link}}

Thank you for helping improve the accuracy of this material.

${SIGNOFF}`,
  },
  {
    key: 'accepted',
    label: 'Accepted',
    subject: 'Your review finding was accepted: {{ticketTitle}}',
    body: `Hi {{reviewerName}},

Thank you for flagging this. After review, your finding on {{page}} has been accepted and scheduled for a content fix.

You can follow its progress here:
{{link}}

We will let you know when it is resolved.

${SIGNOFF}`,
  },
  {
    key: 'wontfix',
    label: "Won't fix",
    subject: 'Update on your review finding: {{ticketTitle}}',
    body: `Hi {{reviewerName}},

Thank you for your review finding on {{page}}. After careful consideration we have decided not to make a change in this case. The reasoning is recorded on the ticket:
{{link}}

We appreciate the time you took to review this material, and we welcome any further comments on the ticket.

${SIGNOFF}`,
  },
  {
    key: 'duplicate',
    label: 'Duplicate',
    subject: 'Your review finding was marked a duplicate: {{ticketTitle}}',
    body: `Hi {{reviewerName}},

Thank you for your review finding on {{page}}. It overlaps with an existing finding, so we have marked it as a duplicate and will track the issue on the original ticket.

Your ticket, with a link to the original, is here:
{{link}}

Thank you for helping improve this material.

${SIGNOFF}`,
  },
  {
    key: 'resolved',
    label: 'Resolved',
    subject: 'Resolved: {{ticketTitle}}',
    body: `Hi {{reviewerName}},

The issue you reported on {{page}} has been resolved. We would be grateful if you could re-read the section and confirm the change addresses your finding:
{{link}}

If anything still looks off, please re-open the ticket or add a comment.

${SIGNOFF}`,
  },
  {
    key: 'verified',
    label: 'Verified',
    subject: 'Your review finding has been verified as fixed: {{ticketTitle}}',
    body: `Hi {{reviewerName}},

The fix for your finding on {{page}} has now been verified. Thank you for the careful review that led to this improvement.

The ticket, for your records, is here:
{{link}}

${SIGNOFF}`,
  },
  {
    key: 'closed',
    label: 'Closed',
    subject: 'Your review finding is now closed: {{ticketTitle}}',
    body: `Hi {{reviewerName}},

Your review finding on {{page}} has been closed. Thank you for contributing to the accuracy of this material.

The ticket remains available for your reference here:
{{link}}

${SIGNOFF}`,
  },
  {
    key: 'general',
    label: 'General / ad-hoc',
    subject: 'About your review finding: {{ticketTitle}}',
    body: `Hi {{reviewerName}},

A note about your review finding on {{page}} (current status: {{status}}):

[write your message here]

You can view the ticket here:
{{link}}

${SIGNOFF}`,
  },
  {
    key: 'invite',
    label: 'Reviewer invite (system)',
    subject: 'You are invited to the MNM-Edu Review Console',
    body: `Hi {{reviewerName}},

{{inviterName}} has invited you to the MNM-Edu Review Console.

Set your password and activate your account using this one-time link:
{{link}}

The link expires {{expiresAt}} and can be used once. If it expires, ask an admin to send a fresh invite.

${SIGNOFF}`,
  },
  {
    key: 'password_reset',
    label: 'Password reset (system)',
    subject: 'Reset your MNM-Edu Review Console password',
    body: `Hi {{reviewerName}},

A password reset was requested for your MNM-Edu Review Console account. Set a new password using this one-time link:
{{link}}

The link expires {{expiresAt}} and can be used once. If you did not request this, you can ignore this email.

${SIGNOFF}`,
  },
];

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: `file:${dbPath}` }) });

const force = process.env.SEED_FORCE === '1';
let created = 0;
let updated = 0;
let skipped = 0;

for (const t of TEMPLATES) {
  const existing = await prisma.emailTemplate.findUnique({ where: { key: t.key } });
  if (!existing) {
    await prisma.emailTemplate.create({ data: t });
    created += 1;
  } else if (force) {
    await prisma.emailTemplate.update({
      where: { key: t.key },
      data: { label: t.label, subject: t.subject, body: t.body, isActive: true },
    });
    updated += 1;
  } else {
    skipped += 1;
  }
}

console.log(
  `email templates: created=${created} updated=${updated} skipped=${skipped} total=${TEMPLATES.length}` +
    (force ? '' : ' (set SEED_FORCE=1 to refresh existing)'),
);
await prisma.$disconnect();
