'use client';

import { Suspense, useId, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailId = useId();
  const passwordId = useId();

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

  // Inputs sit on the deeper surface, with a token border and a teal focus border; the global
  // :focus-visible ring (globals.css) still applies for keyboard focus. tap-target gives the >=44px
  // touch hit area (design A3). No outline-none, so the focus ring is preserved.
  const inputClass =
    'tap-target w-full rounded-md border border-line bg-surface-deeper px-3 py-2.5 text-[14px] text-ink placeholder:text-ink-dim focus:border-brand-teal';
  const labelClass = 'mb-1.5 block text-[12px] font-bold uppercase tracking-[0.06em] text-ink-muted';

  return (
    // font-sans overrides the review layout's font-mono so the login page matches the public site.
    <div className="font-sans flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-[380px] rounded-lg border border-line bg-surface-card p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] md:p-8">
        <p className="eyebrow mb-2">MNM-Edu</p>
        <h1 className="m-0 mb-1 text-[22px] font-bold text-ink">Reviewer sign in</h1>
        <p className="m-0 mb-6 text-[13px] leading-[1.5] text-ink-muted">
          Sign in to the clinical review console.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor={emailId} className={labelClass}>
              Email
            </label>
            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={passwordId} className={labelClass}>
              Password
            </label>
            <input
              id={passwordId}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </div>
          {error && (
            <div
              role="alert"
              className="rounded-md border border-status-danger/40 bg-status-danger/10 px-3 py-2 text-[13px] text-status-dangerText"
            >
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
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
