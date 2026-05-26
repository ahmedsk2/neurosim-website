'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CommentForm({ findingId }: { findingId: number }) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    const res = await fetch(`/api/findings/${findingId}/comments/`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    setBusy(false);
    if (res.ok) {
      setBody('');
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="add a comment"
        className="w-full rounded border border-[#1e293b] bg-[#0b1220] px-3 py-2 text-[#e2e8f0] outline-none focus:border-[#5eead4]"
      />
      <button
        type="submit"
        disabled={busy || !body.trim()}
        className="rounded bg-[#0d9488] px-3 py-1.5 font-bold text-white hover:bg-[#14b8a6] disabled:opacity-50"
      >
        {busy ? 'Posting...' : 'Comment'}
      </button>
    </form>
  );
}
