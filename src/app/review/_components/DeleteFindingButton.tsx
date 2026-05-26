'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Destructive delete for a finding, with a two-step in-place confirm. The server route
 * (DELETE /api/findings/[id]) enforces who may delete (admin any, reviewer own); this only
 * renders where the detail page is viewable, which is already admin-or-author.
 */
export function DeleteFindingButton({ findingId }: { findingId: number }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function del() {
    setBusy(true);
    setErr('');
    const res = await fetch(`/api/findings/${findingId}/`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/review/findings');
      router.refresh();
      return;
    }
    setBusy(false);
    const j = await res.json().catch(() => ({}));
    setErr(typeof j?.error === 'string' ? j.error : 'Delete failed');
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded border border-[#7f1d1d] px-2.5 py-1 text-[#fca5a5] hover:bg-[#7f1d1d]/20"
      >
        Delete finding
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[#fca5a5]">Delete this finding and its comments/attachments permanently?</span>
      <button
        type="button"
        onClick={del}
        disabled={busy}
        className="rounded bg-[#b91c1c] px-2.5 py-1 font-bold text-white hover:bg-[#dc2626] disabled:opacity-50"
      >
        {busy ? 'Deleting...' : 'Yes, delete'}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={busy}
        className="rounded border border-[#334155] px-2.5 py-1 hover:border-[#5eead4] disabled:opacity-50"
      >
        Cancel
      </button>
      {err && <span className="text-[#fca5a5]">{err}</span>}
    </div>
  );
}
