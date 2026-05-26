'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

export interface DrawCanvasHandle {
  exportPng: () => string | null;
}

type Tool = 'pen' | 'arrow' | 'rect' | 'ellipse' | 'text';
interface Pt {
  x: number;
  y: number;
}
interface Op {
  tool: Tool;
  color: string;
  pts: Pt[];
  text?: string;
}

const COLORS = ['#ef4444', '#fbbf24', '#22d3ee', '#a3e635', '#0ea5e9', '#ffffff'];
const TOOLS: Tool[] = ['pen', 'arrow', 'rect', 'ellipse', 'text'];
const MAX_W = 520;

function drawOp(ctx: CanvasRenderingContext2D, op: Op): void {
  ctx.strokeStyle = op.color;
  ctx.fillStyle = op.color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const a = op.pts[0];
  if (!a) return;

  if (op.tool === 'pen') {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    for (let i = 1; i < op.pts.length; i++) {
      const p = op.pts[i];
      if (p) ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    return;
  }
  if (op.tool === 'text') {
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(op.text ?? '', a.x, a.y);
    return;
  }

  const b = op.pts[1];
  if (!b) return;
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
  const h = 11;
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
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState<string>(COLORS[0] ?? '#ef4444');
  const [ops, setOps] = useState<Op[]>([]);
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: MAX_W, h: 320 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const w = img.width || MAX_W;
      const scale = Math.min(1, MAX_W / w);
      setDims({ w: Math.round(w * scale), h: Math.round((img.height || 320) * scale) });
    };
    img.src = src;
  }, [src]);

  function redraw(draft: Op | null) {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    const img = imgRef.current;
    if (img) ctx.drawImage(img, 0, 0, cv.width, cv.height);
    for (const op of ops) drawOp(ctx, op);
    if (draft) drawOp(ctx, draft);
  }

  // Redraw after each render (image load, ops change, tool/color change). Cheap.
  useEffect(() => {
    redraw(null);
  });

  function ptFrom(e: React.PointerEvent<HTMLCanvasElement>): Pt {
    return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  }

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const p = ptFrom(e);
    if (tool === 'text') {
      const text = window.prompt('Label text:')?.trim();
      if (text) setOps((o) => [...o, { tool: 'text', color, pts: [p], text }]);
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    draftRef.current = { tool, color, pts: tool === 'pen' ? [p] : [p, { ...p }] };
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const d = draftRef.current;
    if (!d) return;
    const p = ptFrom(e);
    if (d.tool === 'pen') d.pts.push(p);
    else d.pts[1] = p;
    redraw(d);
  }

  function onUp() {
    const d = draftRef.current;
    draftRef.current = null;
    if (d) setOps((o) => [...o, d]);
  }

  useImperativeHandle(
    ref,
    () => ({
      exportPng: () => {
        const cv = canvasRef.current;
        return cv ? cv.toDataURL('image/png') : null;
      },
    }),
    [],
  );

  const tbtn = (active: boolean) =>
    `rounded border px-2 py-0.5 ${active ? 'border-[#5eead4] text-[#5eead4]' : 'border-[#334155] text-[#cbd5e1]'}`;

  return (
    <div className="space-y-2">
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
      <canvas
        ref={canvasRef}
        width={dims.w}
        height={dims.h}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        className="block max-w-full cursor-crosshair touch-none rounded border border-[#1e293b]"
      />
      <p className="text-[#64748b]">Both the original snapshot and this annotated image are saved on submit.</p>
    </div>
  );
});
