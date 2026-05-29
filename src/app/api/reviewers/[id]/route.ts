import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/apiAuth';
import { ReviewerRole } from '@/lib/enums';
import { isSelfDeactivation, isAdminPromotion, removesActiveAdmin } from '@/lib/reviewerGuards';

export const runtime = 'nodejs'; // prisma (mariadb driver) needs the Node runtime
export const dynamic = 'force-dynamic';

// PATCH /api/reviewers/[id] - admin-only: change a reviewer's role and/or active flag. Guards:
//   - you cannot deactivate your own account (lock-out / accidental self-removal),
//   - the LAST active admin cannot be demoted or deactivated (always keep one admin),
//   - promoting someone to admin needs an explicit confirmAdmin flag.
// Never touches passwordHash (password changes go through the invite/reset token flow).
const PatchBody = z
  .object({
    role: ReviewerRole.optional(),
    isActive: z.boolean().optional(),
    confirmAdmin: z.boolean().optional(),
  })
  .refine((b) => b.role !== undefined || b.isActive !== undefined, {
    message: 'Provide role and/or isActive.',
  });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const { id } = await params;

  const parsed = PatchBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body', issues: parsed.error.issues }, { status: 400 });
  }
  const { role, isActive, confirmAdmin } = parsed.data;

  const target = await prisma.reviewer.findUnique({
    where: { id },
    select: { id: true, role: true, isActive: true },
  });
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const change = { role, isActive };

  // Self-deactivation guard (you can still change your own role, subject to the last-admin guard).
  if (isSelfDeactivation(id, auth.user.id, change)) {
    return NextResponse.json({ error: 'You cannot deactivate your own account.' }, { status: 409 });
  }

  // Promotion to admin needs the same explicit confirmation as creating an admin.
  if (isAdminPromotion(target, change) && !confirmAdmin) {
    return NextResponse.json({ error: 'Promoting to admin needs confirmation.', needsAdminConfirm: true }, { status: 409 });
  }

  // Last-active-admin guard: block any change that would remove the target from the set of active
  // admins when they are the only one left, so the Console always keeps at least one admin.
  if (removesActiveAdmin(target, change)) {
    const activeAdmins = await prisma.reviewer.count({ where: { role: 'admin', isActive: true } });
    if (activeAdmins <= 1) {
      return NextResponse.json({ error: 'Cannot demote or deactivate the last active admin.' }, { status: 409 });
    }
  }

  const reviewer = await prisma.reviewer.update({
    where: { id },
    data: { ...(role !== undefined ? { role } : {}), ...(isActive !== undefined ? { isActive } : {}) },
    select: { id: true, email: true, name: true, role: true, isActive: true },
  });

  return NextResponse.json({ ok: true, reviewer });
}
