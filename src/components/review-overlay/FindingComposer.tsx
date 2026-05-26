'use client';

import { useRef, useState } from 'react';
import { FINDING_SEVERITIES, FINDING_CATEGORIES } from '@/lib/enums';
import { DrawCanvas, type DrawCanvasHandle } from './DrawCanvas';

interface HeadingOpt {
  id: string;
  text: string;
}

// Read the page's headings straight from the rendered DOM (no API needed). The
// rehype-autolink anchor is stripped so the label is clean; the server snapshots the
// canonical sectionTextSnapshot from the Heading row at file time.
function readHeadings(): HeadingOpt[] {
  if (typeof document === 'undefined') return [];
  const article = document.querySelector('article.prose-mnm');
  if (!article) return [];
  const out: HeadingOpt[] = [];
  article.querySelectorAll('h2[id], h3[id], h4[id], h5[id], h6[id]').forEach((h) => {
    const id = h.getAttribute('id');
    if (!id) return;
    const clone = h.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('a.heading-anchor').forEach((a) => a.remove());
    out.push({ id, text: (clone.textContent || '').replace(/\s+/g, ' ').trim() });
  });
  return out;
}

const fieldCls =
  'w-full rounded border border-[#1e293b] bg-[#0b1220] px-2 py-1.5 text-[#e2e8f0] outline-none focus:border-[#5eead4]';

export function FindingComposer({
  kind,
  slug,
  onClose,
}: {
  kind: string;
  slug: string;
  onClose: () => void;
}) {
  // Read once at mount-render. The composer is ssr:false and only mounts after the
  // reviewer clicks the FAB on an already-hydrated content page, so the article DOM is
  // present and a lazy initializer (no effect) is correct here.
  const [headings] = useState<HeadingOpt[]>(() => readHeadings());
  const [sectionAnchor, setSectionAnchor] = useState('');
  const [severity, setSeverity] = useState<string>(FINDING_SEVERITIES[2] ?? 'minor');
  const [category, setCategory] = useState<string>(FINDING_CATEGORIES[0] ?? 'clinical-accuracy');
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [suggestedFix, setSuggestedFix] = useState('');
  const [suggestedCitation, setSuggestedCitation] = useState('');
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  // Briefly hide this overlay panel while grabbing a getDisplayMedia frame, so "Capture my
  // current view" shows the page (and the reviewer's widget state), not the composer itself.
  const [hidden, setHidden] = useState(false);
  // Two-step "Capture my current view": show a one-line instruction before the browser's
  // share-tab prompt, so reviewers know to pick "This Tab".
  const [viewPrompt, setViewPrompt] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const drawRef = useRef<DrawCanvasHandle>(null);

  // OPTION 1 (default): server-side full-page screenshot via headless Chromium (the e2e
  // Playwright). Headless Chromium renders the canvas/WebGL widgets that html2canvas could
  // not, so widget-heavy pages capture completely. Captures the page in its DEFAULT state.
  async function capturePage() {
    setCapturing(true);
    setMsg('');
    try {
      const res = await fetch('/api/snapshot/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind, slug }),
      });
      if (!res.ok) {
        setMsg('Page capture failed. Try "Capture my current view", or submit without an image.');
        return;
      }
      const data = await res.json();
      if (typeof data?.dataUrl === 'string') setSnapshot(data.dataUrl);
      else setMsg('Page capture returned no image. You can still submit.');
    } catch {
      setMsg('Page capture failed (network). You can still submit.');
    } finally {
      setCapturing(false);
    }
  }

  // OPTION 2: native screen capture of the visible tab as the reviewer currently sees it
  // (their scroll + exact widget state). Triggers the browser's share-tab prompt each time.
  async function captureView() {
    setCapturing(true);
    setMsg('');
    let stream: MediaStream | null = null;
    try {
      // preferCurrentTab makes the current tab the default/highlighted choice in the picker.
      const displayOpts = {
        video: true,
        audio: false,
        preferCurrentTab: true,
      } satisfies DisplayMediaStreamOptions & { preferCurrentTab?: boolean };
      stream = await navigator.mediaDevices.getDisplayMedia(displayOpts);
      const video = document.createElement('video');
      video.srcObject = stream;
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve();
      });
      await video.play();
      // Hide this panel and let the capture stream repaint so the frame shows the page, not
      // the composer; then grab one frame and restore.
      setHidden(true);
      await new Promise((r) => setTimeout(r, 250));
      const w = video.videoWidth || 1280;
      const h = video.videoHeight || 720;
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      let dataUrl: string | null = null;
      if (ctx) {
        ctx.drawImage(video, 0, 0, w, h);
        dataUrl = canvas.toDataURL('image/png');
      }
      setHidden(false);
      video.pause();
      if (dataUrl) setSnapshot(dataUrl);
      else setMsg('Could not read the captured frame. You can still submit.');
    } catch {
      setHidden(false);
      setMsg('Screen capture was cancelled or unavailable. You can still submit.');
    } finally {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      setCapturing(false);
    }
  }

  async function submit() {
    if (!title.trim() || !detail.trim()) {
      setMsg('Title and detail are required.');
      return;
    }
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch('/api/findings/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind,
          slug,
          sectionAnchor: sectionAnchor || null,
          severity,
          category,
          title: title.trim(),
          detail: detail.trim(),
          suggestedFix: suggestedFix.trim() || null,
          suggestedCitation: suggestedCitation.trim() || null,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMsg(typeof j?.error === 'string' ? j.error : 'Create failed');
        setBusy(false);
        return;
      }
      const data = await res.json();
      const findingId: number | undefined = data?.finding?.id;
      if (findingId && snapshot) {
        await fetch(`/api/findings/${findingId}/attachments/`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ variant: 'original', dataUrl: snapshot }),
        });
        const annotated = drawRef.current?.exportPng();
        if (annotated && annotated !== snapshot) {
          await fetch(`/api/findings/${findingId}/attachments/`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ variant: 'annotated', dataUrl: annotated }),
          });
        }
      }
      setMsg(`Filed finding #${findingId}. It is now in /review.`);
      setBusy(false);
      setTimeout(onClose, 1000);
    } catch {
      setMsg('Network error.');
      setBusy(false);
    }
  }

  return (
    <div
      data-review-overlay=""
      style={{ visibility: hidden ? 'hidden' : 'visible' }}
      className="fixed inset-0 z-[70] flex justify-end font-mono text-[13px]"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="relative h-full w-[min(560px,100vw)] space-y-3 overflow-y-auto border-l border-[#1e293b] bg-[#081224] p-4 text-[#e2e8f0]">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#5eead4]">File finding · {kind}/{slug}</span>
          <button type="button" onClick={onClose} className="text-[#94a3b8] hover:text-white" aria-label="Close">
            ✕
          </button>
        </div>

        <label className="block">
          <span className="text-[#94a3b8]">Section</span>
          <select value={sectionAnchor} onChange={(e) => setSectionAnchor(e.target.value)} className={fieldCls}>
            <option value="">(whole page)</option>
            {headings.map((h) => (
              <option key={h.id} value={h.id}>
                {h.text}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[#94a3b8]">Severity</span>
            <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={fieldCls}>
              {FINDING_SEVERITIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[#94a3b8]">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={fieldCls}>
              {FINDING_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-[#94a3b8]">Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={fieldCls} placeholder="one-line summary" />
        </label>
        <label className="block">
          <span className="text-[#94a3b8]">Detail</span>
          <textarea value={detail} onChange={(e) => setDetail(e.target.value)} rows={4} className={fieldCls} placeholder="what is wrong and why" />
        </label>
        <label className="block">
          <span className="text-[#94a3b8]">Suggested fix (optional)</span>
          <input value={suggestedFix} onChange={(e) => setSuggestedFix(e.target.value)} className={fieldCls} />
        </label>
        <label className="block">
          <span className="text-[#94a3b8]">Suggested citation (optional)</span>
          <input value={suggestedCitation} onChange={(e) => setSuggestedCitation(e.target.value)} className={fieldCls} />
        </label>

        <div className="border-t border-[#1e293b] pt-3">
          {snapshot ? (
            <DrawCanvas ref={drawRef} src={snapshot} />
          ) : viewPrompt ? (
            <div className="space-y-2 rounded border border-[#334155] bg-[#0b1220] p-3">
              <p className="text-[#e2e8f0]">
                Next, your browser will ask what to share. Choose{' '}
                <b className="text-[#5eead4]">This Tab</b>, then click <b className="text-[#5eead4]">Share</b>.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewPrompt(false);
                    captureView();
                  }}
                  disabled={capturing}
                  className="rounded bg-[#0d9488] px-3 py-1.5 font-bold text-white hover:bg-[#14b8a6] disabled:opacity-50"
                >
                  {capturing ? 'Capturing…' : 'Continue'}
                </button>
                <button type="button" onClick={() => setViewPrompt(false)} className="text-[#94a3b8] hover:text-white">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={capturePage}
                  disabled={capturing}
                  className="rounded border border-[#334155] px-3 py-1.5 hover:border-[#5eead4] disabled:opacity-50"
                >
                  {capturing ? 'Capturing…' : 'Capture page'}
                </button>
                <button
                  type="button"
                  onClick={() => setViewPrompt(true)}
                  disabled={capturing}
                  className="rounded border border-[#334155] px-3 py-1.5 hover:border-[#5eead4] disabled:opacity-50"
                >
                  Capture my current view
                </button>
              </div>
              <p className="text-[#64748b]">
                "Capture page" shoots the full page with widgets rendered (default state).
                "Capture my current view" grabs this tab exactly as you see it now, including
                your current widget state.
              </p>
            </div>
          )}
        </div>

        {msg && <div className="rounded border border-[#334155] bg-[#0b1220] px-3 py-2 text-[#fbbf24]">{msg}</div>}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={submit}
            disabled={busy || !title.trim() || !detail.trim()}
            className="rounded bg-[#0d9488] px-4 py-2 font-bold text-white hover:bg-[#14b8a6] disabled:opacity-50"
          >
            {busy ? 'Filing…' : 'File finding'}
          </button>
          <button type="button" onClick={onClose} className="text-[#94a3b8] hover:text-white">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
