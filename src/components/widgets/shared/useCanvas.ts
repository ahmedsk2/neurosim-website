'use client';

import { useEffect, useRef } from 'react';

export type CanvasRenderer = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

export function useCanvas(render: CanvasRenderer, deps: unknown[] = []) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    cv.width = w * dpr;
    cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render(ctx, w, h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  bg = '#0F1A2E',
) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
}

export function useAnimationLoop(tick: (now: number, dtMs: number) => void, running: boolean) {
  const handleRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);
  const tickRef = useRef(tick);

  // Keep tickRef pointing at the latest closure so changes to props captured
  // inside `tick` (e.g. simulation speed) take effect on the very next frame
  // without having to tear down and restart the loop.
  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useEffect(() => {
    if (!running) {
      if (handleRef.current != null) cancelAnimationFrame(handleRef.current);
      handleRef.current = null;
      return;
    }
    lastRef.current = performance.now();
    const loop = (now: number) => {
      const dt = now - lastRef.current;
      lastRef.current = now;
      tickRef.current(now, dt);
      handleRef.current = requestAnimationFrame(loop);
    };
    handleRef.current = requestAnimationFrame(loop);
    return () => {
      if (handleRef.current != null) cancelAnimationFrame(handleRef.current);
      handleRef.current = null;
    };
  }, [running]);
}
