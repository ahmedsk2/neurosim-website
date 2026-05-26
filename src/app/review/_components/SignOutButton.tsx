'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/review/login' })}
      className="text-[#94a3b8] underline hover:text-[#e2e8f0]"
    >
      Sign out
    </button>
  );
}
