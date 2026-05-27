'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Admin-only restore for a soft-deleted finding. The server route
 * (POST /api/findings/[id]/restore) enforces requireAdmin; this only renders on the admin
 * read-only detail view of a deleted finding. On success the detail refreshes and the finding
 * shows its normal (restored) view.
 */
export function RestoreFindingButton({ findingId }: { findingId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function restore() {
    setBusy(true);
    setErr('');
    const res = await fetch(`/api/findings/${findingId}/restore/`, { method: 'POST' });
    if (res.ok) {
      router.refresh();
      return;
    }
    setBusy(false);
    const j = await res.json().catch(() => ({}));
    setErr(typeof j?.error === 'string' ? j.error : 'Restore failed');
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={restore}
        disabled={busy}
        className="rounded border border-[#0d9488] bg-[#0b1220] px-2.5 py-1 text-[#5eead4] hover:bg-[#0d9488]/10 disabled:opacity-50"
      >
        {busy ? 'Restoring...' : 'Restore finding'}
      </button>
      {err && <span className="text-[#fca5a5]">{err}</span>}
    </div>
  );
}
