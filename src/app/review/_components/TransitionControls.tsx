'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function TransitionControls({
  findingId,
  current,
  targets,
  reattest,
}: {
  findingId: number;
  current: string;
  targets: string[];
  reattest: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

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
    router.refresh();
  }

  const btn = 'rounded border border-[#334155] bg-[#0b1220] px-2.5 py-1 hover:border-[#5eead4] disabled:opacity-50';

  return (
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
  );
}
