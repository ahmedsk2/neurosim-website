'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { REVIEWER_ROLES } from '@/lib/enums';

interface Row {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  hasPassword: boolean; // false => outstanding invite (not yet accepted)
  createdAt: string;
}

type Msg = { ok: boolean; text: string };

const FIELD =
  'w-full rounded border border-[#1e293b] bg-[#0b1220] px-3 py-2 text-[#e2e8f0] outline-none focus:border-[#5eead4]';
const SELECT =
  'rounded border border-[#1e293b] bg-[#0b1220] px-2 py-1 text-[#e2e8f0] outline-none focus:border-[#5eead4] disabled:opacity-50';
const PRIMARY = 'rounded bg-[#0d9488] px-3 py-1.5 font-bold text-white hover:bg-[#14b8a6] disabled:opacity-50';
const ACTION = 'rounded border border-[#334155] bg-[#0b1220] px-2.5 py-1 hover:border-[#5eead4] disabled:opacity-50';

export function ReviewerManager({ initial, meId }: { initial: Row[]; meId: string }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(initial);

  // Create form
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('validator');
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState<Msg | null>(null);

  // Per-row busy + feedback
  const [rowBusy, setRowBusy] = useState<Record<string, boolean>>({});
  const [rowMsg, setRowMsg] = useState<Record<string, Msg>>({});

  const setBusy = (id: string, v: boolean) => setRowBusy((m) => ({ ...m, [id]: v }));
  const say = (id: string, m: Msg) => setRowMsg((s) => ({ ...s, [id]: m }));

  const pendingCount = rows.filter((r) => r.isActive && !r.hasPassword).length;

  async function createReviewer(e: React.FormEvent) {
    e.preventDefault();
    setCreateMsg(null);
    const wantsAdmin = role === 'admin';
    if (
      wantsAdmin &&
      !window.confirm('Create an ADMIN account? Admins can triage every finding and manage all reviewers.')
    ) {
      return;
    }
    setCreating(true);
    const res = await fetch('/api/reviewers/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, name, role, confirmAdmin: wantsAdmin }),
    });
    const j = await res.json().catch(() => ({}));
    setCreating(false);
    if (!res.ok) {
      setCreateMsg({ ok: false, text: typeof j?.error === 'string' ? j.error : 'Could not create the reviewer.' });
      return;
    }
    const created: Row = {
      id: j.reviewerId,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role,
      isActive: true,
      hasPassword: false,
      createdAt: new Date().toISOString(),
    };
    setRows((rs) => [...rs, created]);
    setCreateMsg({
      ok: j.emailSent,
      text: j.emailSent
        ? `Reviewer created and an invite was emailed to ${created.email}.`
        : `Reviewer created, but the invite email failed (${j.emailError ?? 'unknown error'}). Use "Resend invite".`,
    });
    setEmail('');
    setName('');
    setRole('validator');
    router.refresh();
  }

  async function changeRole(r: Row, newRole: string) {
    if (newRole === r.role) return;
    const wantsAdmin = newRole === 'admin';
    if (
      wantsAdmin &&
      !window.confirm(`Promote ${r.email} to ADMIN? Admins can triage every finding and manage all reviewers.`)
    ) {
      return;
    }
    setBusy(r.id, true);
    const res = await fetch(`/api/reviewers/${r.id}/`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ role: newRole, confirmAdmin: wantsAdmin }),
    });
    const j = await res.json().catch(() => ({}));
    setBusy(r.id, false);
    if (res.ok) {
      setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, role: newRole } : x)));
      say(r.id, { ok: true, text: `Role changed to ${newRole}.` });
      router.refresh();
    } else {
      say(r.id, { ok: false, text: typeof j?.error === 'string' ? j.error : 'Could not change the role.' });
    }
  }

  async function toggleActive(r: Row) {
    const next = !r.isActive;
    if (
      !next &&
      !window.confirm(`Deactivate ${r.email}? They will be unable to sign in until an admin reactivates them.`)
    ) {
      return;
    }
    setBusy(r.id, true);
    const res = await fetch(`/api/reviewers/${r.id}/`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ isActive: next }),
    });
    const j = await res.json().catch(() => ({}));
    setBusy(r.id, false);
    if (res.ok) {
      setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, isActive: next } : x)));
      say(r.id, { ok: true, text: next ? 'Reactivated.' : 'Deactivated.' });
      router.refresh();
    } else {
      say(r.id, { ok: false, text: typeof j?.error === 'string' ? j.error : 'Could not update the account.' });
    }
  }

  async function sendLink(r: Row) {
    setBusy(r.id, true);
    const res = await fetch(`/api/reviewers/${r.id}/reset-password/`, { method: 'POST' });
    const j = await res.json().catch(() => ({}));
    setBusy(r.id, false);
    if (!res.ok) {
      say(r.id, { ok: false, text: typeof j?.error === 'string' ? j.error : 'Could not send the link.' });
      return;
    }
    const label = j.purpose === 'invite' ? 'Invite' : 'Password-reset link';
    say(r.id, {
      ok: !!j.emailSent,
      text: j.emailSent ? `${label} sent.` : `Email failed (${j.emailError ?? 'unknown error'}).`,
    });
  }

  function statusCell(r: Row) {
    if (!r.isActive) return <span className="text-[#fca5a5]">inactive</span>;
    if (!r.hasPassword) return <span className="text-[#fbbf24]">invite pending</span>;
    return <span className="text-[#5eead4]">active</span>;
  }

  return (
    <div className="space-y-6">
      {/* Create */}
      <form onSubmit={createReviewer} className="space-y-3 rounded border border-[#1e293b] bg-[#0b1220] p-4">
        <h2 className="font-bold text-[#cbd5e1]">Add a reviewer</h2>
        <div className="flex flex-wrap gap-3">
          <label className="min-w-[16rem] flex-1 space-y-1">
            <span className="text-[#94a3b8]">Email</span>
            <input
              className={FIELD}
              type="email"
              required
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reviewer@example.org"
            />
          </label>
          <label className="min-w-[12rem] flex-1 space-y-1">
            <span className="text-[#94a3b8]">Name</span>
            <input
              className={FIELD}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dr Jane Reviewer"
            />
          </label>
          <label className="space-y-1">
            <span className="text-[#94a3b8]">Role</span>
            <select className={`${SELECT} w-full py-2`} value={role} onChange={(e) => setRole(e.target.value)}>
              {REVIEWER_ROLES.map((rr) => (
                <option key={rr} value={rr}>
                  {rr}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={creating} className={PRIMARY}>
            {creating ? 'Creating...' : 'Create and send invite'}
          </button>
          {createMsg && <span className={createMsg.ok ? 'text-[#5eead4]' : 'text-[#fca5a5]'}>{createMsg.text}</span>}
        </div>
        <p className="text-[#64748b]">
          The reviewer receives a one-time link to set their own password (valid 7 days). No password is set here.
        </p>
      </form>

      {/* List */}
      <div>
        <p className="mb-2 text-[#94a3b8]">
          {rows.length} reviewer{rows.length === 1 ? '' : 's'}
          {pendingCount > 0 ? `, ${pendingCount} invite${pendingCount === 1 ? '' : 's'} pending` : ''}.
        </p>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#1e293b] text-left text-[#94a3b8]">
              <th className="py-1.5 pr-3">email</th>
              <th className="py-1.5 pr-3">name</th>
              <th className="py-1.5 pr-3">role</th>
              <th className="py-1.5 pr-3">status</th>
              <th className="py-1.5 pr-3">created</th>
              <th className="py-1.5 pr-3">actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const busy = !!rowBusy[r.id];
              const isSelf = r.id === meId;
              const m = rowMsg[r.id];
              return (
                <tr key={r.id} className="border-b border-[#0f172a] align-top">
                  <td className="py-2 pr-3 text-[#cbd5e1]">
                    {r.email}
                    {isSelf && <span className="ml-1 text-[#64748b]">(you)</span>}
                  </td>
                  <td className="py-2 pr-3 text-[#cbd5e1]">{r.name}</td>
                  <td className="py-2 pr-3">
                    <select
                      className={SELECT}
                      value={r.role}
                      disabled={busy}
                      onChange={(e) => changeRole(r, e.target.value)}
                    >
                      {REVIEWER_ROLES.map((rr) => (
                        <option key={rr} value={rr}>
                          {rr}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-3">{statusCell(r)}</td>
                  <td className="py-2 pr-3 text-[#64748b]">{r.createdAt.slice(0, 10)}</td>
                  <td className="py-2 pr-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className={ACTION}
                        disabled={busy || !r.isActive}
                        onClick={() => sendLink(r)}
                        title={r.isActive ? '' : 'Reactivate first'}
                      >
                        {r.hasPassword ? 'Send reset' : 'Resend invite'}
                      </button>
                      {isSelf ? (
                        <span className="text-[#64748b]">(cannot deactivate self)</span>
                      ) : (
                        <button type="button" className={ACTION} disabled={busy} onClick={() => toggleActive(r)}>
                          {r.isActive ? 'Deactivate' : 'Reactivate'}
                        </button>
                      )}
                      {m && <span className={m.ok ? 'text-[#5eead4]' : 'text-[#fca5a5]'}>{m.text}</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
