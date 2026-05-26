'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Initial {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  from: string;
  hasPassword: boolean;
  envHost: boolean;
  envFrom: boolean;
}

export function SmtpSettingsForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [host, setHost] = useState(initial.host);
  const [port, setPort] = useState(String(initial.port));
  const [secure, setSecure] = useState(initial.secure);
  const [user, setUser] = useState(initial.user);
  const [from, setFrom] = useState(initial.from);
  const [password, setPassword] = useState('');
  const [clearPassword, setClearPassword] = useState(false);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [testMsg, setTestMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const body: Record<string, unknown> = { host, port: Number(port), secure, user, from };
    if (clearPassword) body.clearPassword = true;
    else if (password) body.password = password;
    const res = await fetch('/api/settings/smtp/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    setBusy(false);
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      setMsg({ ok: true, text: 'Saved.' });
      setPassword('');
      setClearPassword(false);
      router.refresh();
    } else {
      setMsg({ ok: false, text: typeof j?.error === 'string' ? j.error : 'Save failed' });
    }
  }

  async function sendTest() {
    setTesting(true);
    setTestMsg(null);
    const res = await fetch('/api/settings/smtp/test/', { method: 'POST' });
    setTesting(false);
    const j = await res.json().catch(() => ({}));
    if (res.ok) setTestMsg({ ok: true, text: `Test email sent to ${typeof j?.to === 'string' ? j.to : 'you'}.` });
    else setTestMsg({ ok: false, text: typeof j?.error === 'string' ? j.error : 'Test failed' });
  }

  const field = 'w-full rounded border border-[#1e293b] bg-[#0b1220] px-3 py-2 text-[#e2e8f0] outline-none focus:border-[#5eead4]';
  const label = 'block space-y-1';
  const labelText = 'text-[#94a3b8]';

  return (
    <form onSubmit={save} className="space-y-3 rounded border border-[#1e293b] bg-[#0b1220] p-4">
      <label className={label}>
        <span className={labelText}>Host{!initial.host && initial.envHost ? ' (env fallback active)' : ''}</span>
        <input className={field} value={host} onChange={(e) => setHost(e.target.value)} placeholder="smtp.your-provider.example" />
      </label>

      <div className="flex gap-3">
        <label className={`${label} w-32`}>
          <span className={labelText}>Port</span>
          <input className={field} value={port} onChange={(e) => setPort(e.target.value)} inputMode="numeric" placeholder="587" />
        </label>
        <label className="flex items-end gap-2 pb-2">
          <input type="checkbox" checked={secure} onChange={(e) => setSecure(e.target.checked)} />
          <span className={labelText}>Implicit TLS (port 465). Leave off for 587/STARTTLS.</span>
        </label>
      </div>

      <label className={label}>
        <span className={labelText}>Username (if the server requires auth)</span>
        <input className={field} value={user} onChange={(e) => setUser(e.target.value)} autoComplete="off" />
      </label>

      <label className={label}>
        <span className={labelText}>
          Password{' '}
          <span className="text-[#64748b]">
            {initial.hasPassword ? '(a password is saved; leave blank to keep it)' : '(not set)'}
          </span>
        </span>
        <input
          className={field}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder={initial.hasPassword ? '••••••• (unchanged)' : 'app password or API key'}
          disabled={clearPassword}
        />
      </label>
      {initial.hasPassword && (
        <label className="flex items-center gap-2 text-[#94a3b8]">
          <input type="checkbox" checked={clearPassword} onChange={(e) => setClearPassword(e.target.checked)} />
          clear the saved password (for a server that needs no auth)
        </label>
      )}

      <label className={label}>
        <span className={labelText}>From{!initial.from && initial.envFrom ? ' (env fallback active)' : ''}</span>
        <input className={field} value={from} onChange={(e) => setFrom(e.target.value)} placeholder="MNM-Edu Review <reviews@your-domain.example>" />
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={busy}
          className="rounded bg-[#0d9488] px-3 py-1.5 font-bold text-white hover:bg-[#14b8a6] disabled:opacity-50"
        >
          {busy ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={sendTest}
          disabled={testing}
          className="rounded border border-[#334155] bg-[#0b1220] px-3 py-1.5 hover:border-[#5eead4] disabled:opacity-50"
        >
          {testing ? 'Sending...' : 'Send test email to myself'}
        </button>
        {msg && <span className={msg.ok ? 'text-[#5eead4]' : 'text-[#fca5a5]'}>{msg.text}</span>}
        {testMsg && <span className={testMsg.ok ? 'text-[#5eead4]' : 'text-[#fca5a5]'}>{testMsg.text}</span>}
      </div>
      <p className="text-[#64748b]">Send test uses the saved settings, so save first. The test goes to your own login email.</p>
    </form>
  );
}
