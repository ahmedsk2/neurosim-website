import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/options';
import { isReviewerRole } from '@/lib/auth/roles';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export type AuthResult = { ok: true; user: AuthUser } | { ok: false; status: 401 | 403; body: { error: string } };

async function getAuthedReviewer(): Promise<AuthUser | null> {
  const session = await getServerSession(authOptions);
  const u = session?.user;
  if (!u?.id || !u.role) return null;
  if (!isReviewerRole(u.role)) return null;
  return { id: u.id, email: u.email ?? '', name: u.name ?? null, role: u.role };
}

/** API-route gate: returns a Result discriminator (mirrors NeuroSim apiAuth). */
export async function requireReviewer(): Promise<AuthResult> {
  const session = await getServerSession(authOptions);
  const u = session?.user;
  if (!u?.id || !u.role) return { ok: false, status: 401, body: { error: 'Unauthorized' } };
  if (!isReviewerRole(u.role)) return { ok: false, status: 403, body: { error: 'Forbidden' } };
  return { ok: true, user: { id: u.id, email: u.email ?? '', name: u.name ?? null, role: u.role } };
}

/** Page gate (server component): redirect to login if not an authenticated reviewer. */
export async function requireReviewerPage(): Promise<AuthUser> {
  const user = await getAuthedReviewer();
  if (!user) redirect('/review/login');
  return user;
}
