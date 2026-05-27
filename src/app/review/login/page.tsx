'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const raw = sp?.get('callbackUrl') ?? null;
  const callbackUrl = raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/review';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    // NextAuth returns 'CredentialsSignin' for a returned-null authorize (bad email/password);
    // a thrown authorize error (deactivated / not-activated) surfaces its message here.
    if (res?.error) setError(res.error === 'CredentialsSignin' ? 'Invalid email or password' : res.error);
    else router.push(callbackUrl);
  }

  return (
    <div className="max-w-sm">
      <h1 className="mb-4 text-[15px] font-bold text-[#5eead4]">Reviewer sign in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          required
          autoComplete="email"
          className="w-full rounded border border-[#1e293b] bg-[#0b1220] px-3 py-2 text-[#e2e8f0] outline-none focus:border-[#5eead4]"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          required
          autoComplete="current-password"
          className="w-full rounded border border-[#1e293b] bg-[#0b1220] px-3 py-2 text-[#e2e8f0] outline-none focus:border-[#5eead4]"
        />
        {error && <div className="rounded border border-[#7f1d1d] bg-[#7f1d1d]/20 px-3 py-2 text-[#fca5a5]">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-[#0d9488] px-4 py-2 font-bold text-white hover:bg-[#14b8a6] disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default function ReviewLogin() {
  return (
    <Suspense fallback={<div />}>
      <LoginInner />
    </Suspense>
  );
}
