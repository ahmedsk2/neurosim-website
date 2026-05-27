import type { ReactNode } from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { isAdminRole } from '@/lib/auth/roles';
import { ReviewProviders } from './providers';
import { SignOutButton } from './_components/SignOutButton';

// Utilitarian internal-tool chrome (not the MNM-Edu design system). Renders inside the
// root layout's <main>; the root layout is untouched so public content stays identical.
export default async function ReviewLayout({ children }: { children: ReactNode }) {
  // Read the role without redirecting (this layout also wraps /review/login, which must stay
  // reachable while signed out). The Settings link is admin-only; the page itself also gates.
  const session = await getServerSession(authOptions);
  const admin = isAdminRole(session?.user?.role);
  return (
    <ReviewProviders>
      <div className="min-h-[60vh] font-mono text-[13px] text-[#e2e8f0]">
        <nav className="mb-4 flex items-center gap-4 border-b border-[#1e293b] pb-3">
          <span className="font-bold text-[#5eead4]">Review Console</span>
          <Link href="/review" className="hover:underline">Pages</Link>
          <Link href="/review/findings" className="hover:underline">Findings</Link>
          <Link href="/review/needs-reverification" className="hover:underline">Needs re-verify</Link>
          {admin && <Link href="/review/reviewers" className="hover:underline">Reviewers</Link>}
          {admin && <Link href="/review/deleted" className="hover:underline">Deleted</Link>}
          {admin && <Link href="/review/settings" className="hover:underline">Settings</Link>}
          <span className="ml-auto">
            <SignOutButton />
          </span>
        </nav>
        {children}
      </div>
    </ReviewProviders>
  );
}
