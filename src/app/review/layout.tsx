import type { ReactNode } from 'react';
import Link from 'next/link';
import { ReviewProviders } from './providers';
import { SignOutButton } from './_components/SignOutButton';

// Utilitarian internal-tool chrome (not the MNM-Edu design system). Renders inside the
// root layout's <main>; the root layout is untouched so public content stays identical.
export default function ReviewLayout({ children }: { children: ReactNode }) {
  return (
    <ReviewProviders>
      <div className="min-h-[60vh] font-mono text-[13px] text-[#e2e8f0]">
        <nav className="mb-4 flex items-center gap-4 border-b border-[#1e293b] pb-3">
          <span className="font-bold text-[#5eead4]">Review Console</span>
          <Link href="/review" className="hover:underline">Pages</Link>
          <Link href="/review/findings" className="hover:underline">Findings</Link>
          <Link href="/review/needs-reverification" className="hover:underline">Needs re-verify</Link>
          <span className="ml-auto">
            <SignOutButton />
          </span>
        </nav>
        {children}
      </div>
    </ReviewProviders>
  );
}
