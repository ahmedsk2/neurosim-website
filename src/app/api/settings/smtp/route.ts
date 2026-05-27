import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/apiAuth';
import { encryptSecret, SmtpCryptoError } from '@/lib/email/crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Save the admin-editable SMTP settings (single row id="default"). requireAdmin (403 otherwise).
// The password is WRITE-ONLY: a non-empty `password` sets it, `clearPassword` removes it, and
// omitting both leaves the stored password untouched (so other fields can be edited without
// re-typing it). The password is never returned by any route.
const SaveBody = z.object({
  host: z.string().trim().max(255),
  port: z.number().int().min(1).max(65535),
  secure: z.boolean(),
  user: z.string().trim().max(255),
  from: z.string().trim().max(320),
  password: z.string().max(1024).optional(),
  clearPassword: z.boolean().optional(),
});

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

  const parsed = SaveBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body', issues: parsed.error.issues }, { status: 400 });
  }
  const { host, port, secure, user, from, password, clearPassword } = parsed.data;

  // The password is ENCRYPTED (AES-256-GCM) before it touches the DB, so dev.db never holds it
  // in plaintext. clearPassword removes it; omitting password leaves the stored ciphertext.
  let passUpdate: { pass?: string | null } = {};
  if (clearPassword) {
    passUpdate = { pass: null };
  } else if (password && password.length > 0) {
    try {
      passUpdate = { pass: encryptSecret(password) };
    } catch (e) {
      return NextResponse.json(
        {
          error:
            e instanceof SmtpCryptoError
              ? `${e.message} Set SMTP_ENCRYPTION_KEY in .env before saving a password.`
              : 'Could not encrypt the password.',
        },
        { status: 500 },
      );
    }
  }

  const data = {
    host: host || null,
    port,
    secure,
    user: user || null,
    from: from || null,
    updatedById: auth.user.id,
    ...passUpdate,
  };

  await prisma.smtpSetting.upsert({
    where: { id: 'default' },
    create: { id: 'default', ...data },
    update: data,
  });

  return NextResponse.json({ ok: true });
}
