'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FIELD =
  'w-full rounded border border-[#1e293b] bg-[#0b1220] px-3 py-2 text-[#e2e8f0] outline-none focus:border-[#5eead4]';
const PRIMARY = 'rounded bg-[#0d9488] px-4 py-2 font-bold text-white hover:bg-[#14b8a6] disabled:opacity-50';

// Public set-password form, shared by accept-invite and reset-password. The plaintext token comes
// from the URL and is POSTed (never shown). Client-side it enforces the 12-char minimum and a
// match check for UX; the server re-enforces the minimum and returns a single generic error for
// any bad/expired/used token (no enumeration).
export function SetPasswordForm({ token, endpoint, cta }: { token: string; endpoint: string; cta: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="rounded border border-[#7f1d1d] bg-[#7f1d1d]/20 px-3 py-2 text-[#fca5a5]">
        This link is invalid or has expired. Ask an admin for a new one.
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-3">
        <div className="rounded border border-[#14532d] bg-[#052e16] px-3 py-2 text-[#86efac]">
          Your password has been set. You can now sign in.
        </div>
        <button type="button" className={PRIMARY} onClick={() => router.push('/review/login')}>
          Go to sign in
        </button>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 12) {
      setError('Password must be at least 12 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) setDone(true);
    else setError(typeof j?.error === 'string' ? j.error : 'Something went wrong. Please try again.');
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block space-y-1">
        <span className="text-[#94a3b8]">New password (at least 12 characters)</span>
        <input
          className={FIELD}
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label className="block space-y-1">
        <span className="text-[#94a3b8]">Confirm password</span>
        <input
          className={FIELD}
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </label>
      {error && (
        <div className="rounded border border-[#7f1d1d] bg-[#7f1d1d]/20 px-3 py-2 text-[#fca5a5]">{error}</div>
      )}
      <button type="submit" disabled={busy} className={PRIMARY}>
        {busy ? 'Saving...' : cta}
      </button>
    </form>
  );
}
