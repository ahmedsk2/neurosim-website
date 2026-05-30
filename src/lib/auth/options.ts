import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

/**
 * NextAuth v4, mirroring the NeuroSim pattern: Credentials + bcrypt + JWT sessions, and
 * NO Prisma adapter (JWT needs no Account/Session tables). A Reviewer row IS the login
 * user (email + passwordHash + role).
 */

/**
 * Credentials authorize, extracted so it is unit-testable in isolation. Email is normalized to
 * lowercase (+ trimmed) before the lookup so login matches the stored identity regardless of the
 * database collation; Reviewer.email is stored lowercased too (src/app/api/reviewers/route.ts and
 * scripts/create-reviewer.mjs). Returns the session user, or null for a generic auth failure.
 */
export async function authorizeCredentials(
  credentials: { email?: string; password?: string } | undefined,
) {
  if (!credentials?.email || !credentials.password) return null;
  const email = credentials.email.trim().toLowerCase();
  const reviewer = await prisma.reviewer.findUnique({ where: { email } });
  if (!reviewer) return null; // unknown email -> generic failure (no account enumeration)
  // Clear, distinguishable messages for the two admin-managed states (the spec accepts the
  // minor enumeration here: these are admin-created accounts, not public signups).
  if (!reviewer.isActive) throw new Error('Your account has been deactivated. Contact an administrator.');
  if (!reviewer.passwordHash) {
    throw new Error('Your account is not active yet. Open the invite link from your email to set a password.');
  }
  const valid = await bcrypt.compare(credentials.password, reviewer.passwordHash);
  if (!valid) return null;
  return { id: reviewer.id, email: reviewer.email, name: reviewer.name, role: reviewer.role };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        return authorizeCredentials(credentials);
      },
    }),
  ],
  session: { strategy: 'jwt' },
  // Cloudflare-Tunnel redirect callback (from NeuroSim): NEXTAUTH_URL bakes a single
  // host, but the app is reached via the tunnel (mnm.towardpcc.com) AND localhost in
  // dev. NextAuth v4 has no trustHost, so accept relative + same-origin URLs and fall
  // back to the request's own baseUrl (computed from the inbound Host header).
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return url;
      try {
        const u = new URL(url);
        if (u.origin === baseUrl) return url;
      } catch {
        /* fall through to baseUrl */
      }
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: { signIn: '/review/login' },
};
