'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { renderTemplate, type TemplateContext } from '@/lib/email/templates';

interface TemplateLite {
  key: string;
  label: string;
  subject: string;
  body: string;
}

/**
 * Admin-only lifecycle controls for a finding: status transitions, plus the admin-in-the-loop
 * reviewer notification. After a successful transition it OFFERS (does not force) a "Notify
 * reviewer" step prefilled with the matching-status template; a standalone "Email reviewer"
 * action is always available. Placeholders are resolved client-side from the server-built ctx
 * (the pure resolver in lib/email/templates); the admin edits the resolved text and the server
 * sends exactly that. The recipient is derived server-side, never sent from here.
 */
export function AdminLifecycle({
  findingId,
  current,
  targets,
  reattest,
  templates,
  ctx,
  recipientLabel,
}: {
  findingId: number;
  current: string;
  targets: string[];
  reattest: boolean;
  templates: TemplateLite[];
  ctx: TemplateContext;
  recipientLabel: string;
}) {
  const router = useRouter();

  // transition state
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [justTransitionedTo, setJustTransitionedTo] = useState<string | null>(null);

  // composer state
  const [open, setOpen] = useState(false);
  const [statusForResolve, setStatusForResolve] = useState(current); // the {{status}} value used when resolving
  const [selectedKey, setSelectedKey] = useState('general');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function pickTemplate(key: string): TemplateLite | undefined {
    return templates.find((t) => t.key === key) ?? templates.find((t) => t.key === 'general') ?? templates[0];
  }

  function resolveInto(key: string, statusValue: string) {
    const tpl = pickTemplate(key);
    if (!tpl) {
      setSelectedKey(key);
      setSubject('');
      setBody('');
      return;
    }
    const resolved = renderTemplate(tpl, { ...ctx, status: statusValue });
    setSelectedKey(tpl.key);
    setSubject(resolved.subject);
    setBody(resolved.body);
  }

  function openComposer(presetKey: string, statusValue: string) {
    setStatusForResolve(statusValue);
    setSendMsg(null);
    resolveInto(presetKey, statusValue);
    setOpen(true);
  }

  async function go(toStatus: string) {
    setBusy(true);
    setErr('');
    const res = await fetch(`/api/findings/${findingId}/`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ toStatus }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(typeof j?.error === 'string' ? j.error : 'Transition failed');
      return;
    }
    setJustTransitionedTo(toStatus); // offer (do not force) a notify for the new status
    router.refresh();
  }

  // edited flag = does the current text differ from the freshly-resolved selected template?
  function computeEdited(): boolean {
    const tpl = pickTemplate(selectedKey);
    if (!tpl) return true;
    const resolved = renderTemplate(tpl, { ...ctx, status: statusForResolve });
    return subject !== resolved.subject || body !== resolved.body;
  }

  async function send() {
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    setSendMsg(null);
    const res = await fetch(`/api/findings/${findingId}/email/`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ subject, body, templateKey: selectedKey, edited: computeEdited() }),
    });
    setSending(false);
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      setSendMsg({ ok: true, text: 'Email sent to the reviewer.' });
      setJustTransitionedTo(null);
      router.refresh(); // surfaces the new email_sent row in the audit trail
    } else {
      setSendMsg({ ok: false, text: typeof j?.error === 'string' ? j.error : 'Send failed' });
    }
  }

  const btn = 'rounded border border-[#334155] bg-[#0b1220] px-2.5 py-1 hover:border-[#5eead4] disabled:opacity-50';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {targets.length === 0 && !reattest && <span className="text-[#64748b]">terminal state</span>}
        {targets.map((t) => (
          <button key={t} type="button" disabled={busy} onClick={() => go(t)} className={btn}>
            {`→ ${t}`}
          </button>
        ))}
        {reattest && (
          <button type="button" disabled={busy} onClick={() => go(current)} className={btn}>
            re-verify (re-attest)
          </button>
        )}
        {err && <span className="text-[#fca5a5]">{err}</span>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {justTransitionedTo && !open && (
          <button
            type="button"
            onClick={() => openComposer(justTransitionedTo, justTransitionedTo)}
            className="rounded border border-[#0d9488] bg-[#0b1220] px-2.5 py-1 text-[#5eead4] hover:bg-[#0d9488]/10"
          >
            Notify reviewer about &ldquo;{justTransitionedTo}&rdquo;
          </button>
        )}
        {!open && (
          <button type="button" onClick={() => openComposer('general', current)} className={btn}>
            Email reviewer
          </button>
        )}
      </div>

      {open && (
        <div className="space-y-2 rounded border border-[#1e293b] bg-[#0b1220] p-3">
          <div className="flex items-center justify-between">
            <div className="text-[#94a3b8]">
              To <span className="text-[#e2e8f0]">{recipientLabel}</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-[#64748b] hover:text-[#e2e8f0]">
              close
            </button>
          </div>
          <label className="block text-[#64748b]">
            template
            <select
              value={selectedKey}
              onChange={(e) => resolveInto(e.target.value, statusForResolve)}
              className="ml-2 rounded border border-[#1e293b] bg-[#0b1220] px-2 py-1 text-[#e2e8f0]"
            >
              {templates.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="subject"
            className="w-full rounded border border-[#1e293b] bg-[#0b1220] px-3 py-2 text-[#e2e8f0] outline-none focus:border-[#5eead4]"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            placeholder="body"
            className="w-full rounded border border-[#1e293b] bg-[#0b1220] px-3 py-2 font-mono text-[13px] text-[#e2e8f0] outline-none focus:border-[#5eead4]"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={send}
              disabled={sending || !subject.trim() || !body.trim()}
              className="rounded bg-[#0d9488] px-3 py-1.5 font-bold text-white hover:bg-[#14b8a6] disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
            {sendMsg && <span className={sendMsg.ok ? 'text-[#5eead4]' : 'text-[#fca5a5]'}>{sendMsg.text}</span>}
          </div>
          <p className="text-[#64748b]">
            Goes to the reviewer who filed this finding. Placeholders are already filled; edit freely before sending.
          </p>
        </div>
      )}
    </div>
  );
}
