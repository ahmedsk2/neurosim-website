import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireReviewerPage } from '@/lib/auth/apiAuth';
import { isAdminRole } from '@/lib/auth/roles';
import { SmtpSettingsForm } from '../_components/SmtpSettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const me = await requireReviewerPage();
  // Admin-only at the data layer: a non-admin reviewer who deep-links here gets 404, not just a
  // hidden nav item (mirrors the role-split scoping).
  if (!isAdminRole(me.role)) notFound();

  const row = await prisma.smtpSetting.findUnique({ where: { id: 'default' } });

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-[15px] font-bold text-[#5eead4]">SMTP settings</h1>
      <p className="text-[#94a3b8]">
        Outbound email for reviewer notifications. Saved to the local database (gitignored), so
        changes take effect with no server restart and no shell access to .env. A blank field
        falls back to the matching SMTP_ env var. The password is write-only: it is stored for
        sending but never shown back here.
      </p>
      <SmtpSettingsForm
        initial={{
          host: row?.host ?? '',
          port: row?.port ?? 587,
          secure: row?.secure ?? false,
          user: row?.user ?? '',
          from: row?.from ?? '',
          hasPassword: !!row?.pass,
          envHost: !!process.env.SMTP_HOST?.trim(),
          envFrom: !!process.env.SMTP_FROM?.trim(),
        }}
      />
    </div>
  );
}
