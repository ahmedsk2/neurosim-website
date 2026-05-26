'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export interface DrawCanvasHandle {
  exportPng: () => string | null;
}

type Tool = 'pen' | 'arrow' | 'rect' | 'ellipse' | 'text' | 'pan';
type DrawTool = Exclude<Tool, 'pan'>;
interface Pt {
  x: number; // IMAGE-space (full-resolution) coordinates
  y: number;
}
interface Op {
  tool: DrawTool;
  color: string;
  pts: Pt[];
  text?: string;
  lw: number; // line width in IMAGE-space px, so it composites correctly on the full-res export
  fs: number; // text size in IMAGE-space px
}
interface View {
  scale: number; // image -> screen: screen = image * scale + offset
  ox: number;
  oy: number;
}

const COLORS = ['#ef4444', '#fbbf24', '#22d3ee', '#a3e635', '#0ea5e9', '#ffffff'];
const TOOLS: Tool[] = ['pen', 'arrow', 'rect', 'ellipse', 'text', 'pan'];
const INLINE_W = 520;
const SCREEN_LW = 2.5; // desired on-screen stroke px; stored in image space as SCREEN_LW / scale
const SCREEN_FS = 16;

// Draw one op. `m` maps image-space points to the target canvas; `lw`/`fs` are in target units.
// Used for both the on-screen viewport (scaled by the view) and the full-res export (1:1).
function drawOp(ctx: CanvasRenderingContext2D, op: Op, m: (p: Pt) => Pt, lw: number, fs: number): void {
  ctx.strokeStyle = op.color;
  ctx.fillStyle = op.color;
  ctx.lineWidth = lw;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const p0 = op.pts[0];
  if (!p0) return;
  const a = m(p0);

  if (op.tool === 'pen') {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    for (let i = 1; i < op.pts.length; i++) {
      const p = op.pts[i];
      if (p) {
        const q = m(p);
        ctx.lineTo(q.x, q.y);
      }
    }
    ctx.stroke();
    return;
  }
  if (op.tool === 'text') {
    ctx.font = `bold ${fs}px sans-serif`;
    ctx.fillText(op.text ?? '', a.x, a.y);
    return;
  }

  const p1 = op.pts[1];
  if (!p1) return;
  const b = m(p1);
  if (op.tool === 'rect') {
    ctx.strokeRect(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.abs(b.x - a.x), Math.abs(b.y - a.y));
    return;
  }
  if (op.tool === 'ellipse') {
    ctx.beginPath();
    ctx.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2, Math.abs(b.x - a.x) / 2, Math.abs(b.y - a.y) / 2, 0, 0, 2 * Math.PI);
    ctx.stroke();
    return;
  }
  // arrow
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const h = Math.max(8, lw * 4.4);
  ctx.beginPath();
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(b.x - h * Math.cos(ang - Math.PI / 6), b.y - h * Math.sin(ang - Math.PI / 6));
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(b.x - h * Math.cos(ang + Math.PI / 6), b.y - h * Math.sin(ang + Math.PI / 6));
  ctx.stroke();
}

export const DrawCanvas = forwardRef<DrawCanvasHandle, { src: string }>(function DrawCanvas({ src }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const draftRef = useRef<Op | null>(null);
  const panRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState<string>(COLORS[0] ?? '#ef4444');
  const [ops, setOps] = useState<Op[]>([]);
  const [natural, setNatural] = useState<{ w: number; h: number }>({ w: INLINE_W, h: 320 });
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState<View>({ scale: 1, ox: 0, oy: 0 });

  // Load the captured image once. It is kept at FULL resolution; the canvas is only a viewport
  // onto it (annotations are stored in image space and flattened onto the full image on export).
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setNatural({ w: img.width || INLINE_W, h: img.height || 320 });
    };
    img.src = src;
  }, [src]);

  function viewport(): { w: number; h: number } {
    if (expanded && typeof window !== 'undefined') {
      return {
        w: Math.max(320, Math.min(window.innerWidth - 40, 1500)),
        h: Math.max(240, window.innerHeight - 150),
      };
    }
    const s = Math.min(1, INLINE_W / natural.w);
    return { w: Math.round(natural.w * s), h: Math.round(natural.h * s) };
  }

  // Reset to a fit-width view when the image loads or the mode (inline/expanded) changes.
  useEffect(() => {
    const vpW =
      expanded && typeof window !== 'undefined'
        ? Math.max(320, Math.min(window.innerWidth - 40, 1500))
        : Math.min(natural.w, INLINE_W);
    setView({ scale: vpW / natural.w, ox: 0, oy: 0 });
  }, [natural, expanded]);

  function redraw(draft: Op | null): void {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, cv.width, cv.height);
    const img = imgRef.current;
    if (img) {
      ctx.drawImage(img, 0, 0, natural.w, natural.h, view.ox, view.oy, natural.w * view.scale, natural.h * view.scale);
    }
    const m = (p: Pt): Pt => ({ x: p.x * view.scale + view.ox, y: p.y * view.scale + view.oy });
    for (const op of ops) drawOp(ctx, op, m, op.lw * view.scale, op.fs * view.scale);
    if (draft) drawOp(ctx, draft, m, draft.lw * view.scale, draft.fs * view.scale);
  }

  // Redraw after every render (image load, ops/view/mode change). Live drafts are drawn
  // imperatively from onMove so a stroke does not need a state update per pointer sample.
  useEffect(() => {
    redraw(null);
  });

  function toImage(e: React.PointerEvent<HTMLCanvasElement>): Pt {
    return {
      x: (e.nativeEvent.offsetX - view.ox) / view.scale,
      y: (e.nativeEvent.offsetY - view.oy) / view.scale,
    };
  }

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (tool === 'pan') {
      e.currentTarget.setPointerCapture(e.pointerId);
      panRef.current = { sx: e.nativeEvent.offsetX, sy: e.nativeEvent.offsetY, ox: view.ox, oy: view.oy };
      return;
    }
    const p = toImage(e);
    const lw = SCREEN_LW / view.scale;
    const fs = SCREEN_FS / view.scale;
    if (tool === 'text') {
      const text = window.prompt('Label text:')?.trim();
      if (text) setOps((o) => [...o, { tool: 'text', color, pts: [p], text, lw, fs }]);
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    draftRef.current = { tool, color, pts: tool === 'pen' ? [p] : [p, { ...p }], lw, fs };
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (panRef.current) {
      const pr = panRef.current;
      setView((v) => ({ ...v, ox: pr.ox + (e.nativeEvent.offsetX - pr.sx), oy: pr.oy + (e.nativeEvent.offsetY - pr.sy) }));
      return;
    }
    const d = draftRef.current;
    if (!d) return;
    const p = toImage(e);
    if (d.tool === 'pen') d.pts.push(p);
    else d.pts[1] = p;
    redraw(d);
  }

  function onUp() {
    if (panRef.current) {
      panRef.current = null;
      return;
    }
    const d = draftRef.current;
    draftRef.current = null;
    if (d) setOps((o) => [...o, d]);
  }

  function zoomAt(factor: number, cx: number, cy: number) {
    setView((v) => {
      const ns = Math.max(0.05, Math.min(8, v.scale * factor));
      const ix = (cx - v.ox) / v.scale;
      const iy = (cy - v.oy) / v.scale;
      return { scale: ns, ox: cx - ix * ns, oy: cy - iy * ns };
    });
  }

  function onWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    if (!expanded) return;
    zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }

  function fitWidth() {
    const vpW = typeof window !== 'undefined' ? Math.max(320, Math.min(window.innerWidth - 40, 1500)) : INLINE_W;
    setView({ scale: vpW / natural.w, ox: 0, oy: 0 });
  }

  useImperativeHandle(
    ref,
    () => ({
      // Flatten annotations onto the FULL-resolution image (not the zoomed viewport): render
      // the source image 1:1 and replay the ops in their image-space coordinates.
      exportPng: () => {
        const out = document.createElement('canvas');
        out.width = natural.w;
        out.height = natural.h;
        const ctx = out.getContext('2d');
        if (!ctx) return null;
        const img = imgRef.current;
        if (img) ctx.drawImage(img, 0, 0, natural.w, natural.h);
        const identity = (p: Pt): Pt => p;
        for (const op of ops) drawOp(ctx, op, identity, op.lw, op.fs);
        return out.toDataURL('image/png');
      },
    }),
    [ops, natural],
  );

  const vp = viewport();
  const tbtn = (active: boolean) =>
    `rounded border px-2 py-0.5 ${active ? 'border-[#5eead4] text-[#5eead4]' : 'border-[#334155] text-[#cbd5e1]'}`;

  const toolbar = (
    <div className="flex flex-wrap items-center gap-1.5">
      {TOOLS.map((t) => (
        <button key={t} type="button" onClick={() => setTool(t)} className={tbtn(tool === t)}>
          {t}
        </button>
      ))}
      <span className="mx-1 text-[#334155]">|</span>
      {COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setColor(c)}
          aria-label={`color ${c}`}
          style={{ background: c }}
          className={`h-5 w-5 rounded ${color === c ? 'ring-2 ring-white' : ''}`}
        />
      ))}
      <span className="mx-1 text-[#334155]">|</span>
      <button type="button" onClick={() => setOps((o) => o.slice(0, -1))} className="rounded border border-[#334155] px-2 py-0.5">
        undo
      </button>
      <button type="button" onClick={() => setOps([])} className="rounded border border-[#334155] px-2 py-0.5">
        clear
      </button>
    </div>
  );

  const canvasEl = (
    <canvas
      ref={canvasRef}
      width={vp.w}
      height={vp.h}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onWheel={onWheel}
      className={`block touch-none rounded border border-[#1e293b] ${tool === 'pan' ? 'cursor-grab' : 'cursor-crosshair'} ${expanded ? '' : 'max-w-full'}`}
    />
  );

  if (expanded) {
    return (
      <div data-review-overlay="" className="fixed inset-0 z-[80] flex flex-col gap-2 bg-[#020617]/95 p-3 font-mono text-[13px] text-[#e2e8f0]">
        <div className="flex flex-wrap items-center gap-1.5">
          {toolbar}
          <span className="mx-1 text-[#334155]">|</span>
          <button type="button" onClick={() => zoomAt(1 / 1.25, vp.w / 2, vp.h / 2)} className="rounded border border-[#334155] px-2 py-0.5">
            zoom -
          </button>
          <button type="button" onClick={() => zoomAt(1.25, vp.w / 2, vp.h / 2)} className="rounded border border-[#334155] px-2 py-0.5">
            zoom +
          </button>
          <button type="button" onClick={fitWidth} className="rounded border border-[#334155] px-2 py-0.5">
            fit width
          </button>
          <span className="text-[#64748b]">{Math.round(view.scale * 100)}%</span>
          <button type="button" onClick={() => setExpanded(false)} className="ml-auto rounded bg-[#0d9488] px-3 py-0.5 font-bold text-white hover:bg-[#14b8a6]">
            Done
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">{canvasEl}</div>
        <p className="text-[#64748b]">
          Pick the "pan" tool to move around; use the wheel or zoom buttons to zoom. Annotations save onto the full-resolution image.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {toolbar}
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="rounded border border-[#334155] px-2 py-0.5 text-[#cbd5e1] hover:border-[#5eead4]"
      >
        expand to annotate (zoom + pan)
      </button>
      {canvasEl}
      <p className="text-[#64748b]">
        Both the original snapshot and this annotated image are saved on submit. Use "expand to annotate" for a larger, zoomable surface on tall captures.
      </p>
    </div>
  );
});
