/**
 * Canvas renderers shared by ORx and Mx widgets. Each function takes the
 * generic IndexState + IndexConfig and draws on the supplied 2D context.
 */

import type { IndexState, IndexConfig } from './correlationIndex';

const COLOR_BG = '#0F1A2E';
const COLOR_GRID = '#1E293B';
const COLOR_AXIS = '#475569';
const COLOR_INK = '#94A3B8';
const COLOR_INK_BRIGHT = '#FFFFFF';
const COLOR_MAP = '#5EEAD4';
const COLOR_Y = '#FCD34D';
const COLOR_GOOD = '#10B981';
const COLOR_WARN = '#FCD34D';
const COLOR_DANGER = '#EF4444';

function clear(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = COLOR_BG;
  ctx.fillRect(0, 0, w, h);
}

function gridH(ctx: CanvasRenderingContext2D, x0: number, y: number, x1: number) {
  ctx.strokeStyle = COLOR_GRID;
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x1, y);
  ctx.stroke();
}

/** Draw the raw signals (ABP and derived signal) over the last 60 sim-seconds. */
export function renderRawChart(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: IndexState,
  cfg: IndexConfig,
) {
  clear(ctx, w, h);
  const padL = 38;
  const padR = 60;
  const padT = 16;
  const padB = 22;
  const plotW = Math.max(10, w - padL - padR);
  const plotH = Math.max(10, h - padT - padB);

  // Time window: last 60 sim-seconds
  const tEnd = state.simT;
  const tStart = tEnd - 60;

  // ABP range is roughly 50–150 mmHg
  const abpMin = 40;
  const abpMax = 160;
  // Derived signal range: bracket around baseline
  const yPad = Math.max(8, cfg.signalBaseline * 0.2);
  const yMin = cfg.signalBaseline - yPad;
  const yMax = cfg.signalBaseline + yPad;

  // Grid + axes
  ctx.strokeStyle = COLOR_AXIS;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, padT + plotH);
  ctx.lineTo(padL + plotW, padT + plotH);
  ctx.stroke();

  // Y-axis ticks (left = ABP)
  ctx.fillStyle = COLOR_INK;
  ctx.font = '9px Consolas, monospace';
  ctx.textAlign = 'right';
  [60, 90, 120, 150].forEach((v) => {
    const py = padT + plotH - ((v - abpMin) / (abpMax - abpMin)) * plotH;
    gridH(ctx, padL, py, padL + plotW);
    ctx.fillText(String(v), padL - 4, py + 3);
  });

  // Y-axis ticks (right = derived signal)
  ctx.textAlign = 'left';
  ctx.fillStyle = COLOR_Y;
  [yMin, cfg.signalBaseline, yMax].forEach((v) => {
    const py = padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
    ctx.fillText(v.toFixed(0), padL + plotW + 4, py + 3);
  });

  // X-axis label
  ctx.fillStyle = COLOR_INK;
  ctx.textAlign = 'center';
  ctx.fillText('last 60 sim-seconds', padL + plotW / 2, padT + plotH + 16);

  // ABP trace (decimated for visual smoothness)
  if (state.rawAbp.length > 0) {
    ctx.strokeStyle = COLOR_MAP;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    let first = true;
    for (const s of state.rawAbp) {
      if (s.t < tStart) continue;
      const px = padL + ((s.t - tStart) / 60) * plotW;
      const py = padT + plotH - ((s.v - abpMin) / (abpMax - abpMin)) * plotH;
      if (first) {
        ctx.moveTo(px, py);
        first = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
  }

  // Derived signal trace (rSO₂ or MFV)
  if (state.rawY.length > 0) {
    ctx.strokeStyle = COLOR_Y;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    let first = true;
    for (const s of state.rawY) {
      if (s.t < tStart) continue;
      const px = padL + ((s.t - tStart) / 60) * plotW;
      const py = padT + plotH - ((s.v - yMin) / (yMax - yMin)) * plotH;
      if (first) {
        ctx.moveTo(px, py);
        first = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
  }

  // Decimated 10-s averages, green dots over the means
  if (state.meanPairs.length > 0) {
    ctx.fillStyle = COLOR_GOOD;
    for (const p of state.meanPairs) {
      if (p.t < tStart) continue;
      const px = padL + ((p.t - tStart) / 60) * plotW;
      const pyMap = padT + plotH - ((p.map - abpMin) / (abpMax - abpMin)) * plotH;
      const pyY = padT + plotH - ((p.y - yMin) / (yMax - yMin)) * plotH;
      ctx.beginPath();
      ctx.arc(px, pyMap, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, pyY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Legend
  ctx.font = 'bold 10px Consolas, monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = COLOR_MAP;
  ctx.fillText('· ABP', padL + 4, padT + 12);
  ctx.fillStyle = COLOR_Y;
  ctx.fillText(`· ${cfg.signalLabel}`, padL + 64, padT + 12);
  ctx.fillStyle = COLOR_GOOD;
  ctx.fillText('● 10-s mean', padL + 140, padT + 12);
}

/** Draw the moving 5-minute window of paired (MAP, y) points as a scatter. */
export function renderWindowChart(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: IndexState,
  cfg: IndexConfig,
) {
  clear(ctx, w, h);
  const padL = 44;
  const padR = 12;
  const padT = 16;
  const padB = 24;
  const plotW = Math.max(10, w - padL - padR);
  const plotH = Math.max(10, h - padT - padB);

  const win = state.meanPairs.slice(-cfg.windowSize);

  // Axis bounds, adapt to current window
  let mapMin = 60;
  let mapMax = 110;
  let yMin = cfg.signalBaseline - 8;
  let yMax = cfg.signalBaseline + 8;
  if (win.length > 0) {
    let aMin = Infinity;
    let aMax = -Infinity;
    let bMin = Infinity;
    let bMax = -Infinity;
    for (const p of win) {
      if (p.map < aMin) aMin = p.map;
      if (p.map > aMax) aMax = p.map;
      if (p.y < bMin) bMin = p.y;
      if (p.y > bMax) bMax = p.y;
    }
    const aPad = Math.max(2, (aMax - aMin) * 0.1);
    const bPad = Math.max(0.5, (bMax - bMin) * 0.15);
    mapMin = aMin - aPad;
    mapMax = aMax + aPad;
    yMin = bMin - bPad;
    yMax = bMax + bPad;
  }

  // Axes
  ctx.strokeStyle = COLOR_AXIS;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, padT + plotH);
  ctx.lineTo(padL + plotW, padT + plotH);
  ctx.stroke();

  // Axis labels
  ctx.fillStyle = COLOR_INK;
  ctx.font = '9px Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MAP (mmHg)', padL + plotW / 2, padT + plotH + 18);
  ctx.save();
  ctx.translate(12, padT + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(`${cfg.signalLabel} (${cfg.signalUnit})`, 0, 0);
  ctx.restore();

  // Scatter
  if (win.length > 0) {
    ctx.fillStyle = COLOR_GOOD;
    for (const p of win) {
      const px = padL + ((p.map - mapMin) / Math.max(0.01, mapMax - mapMin)) * plotW;
      const py = padT + plotH - ((p.y - yMin) / Math.max(0.01, yMax - yMin)) * plotH;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Pearson r overlay
  ctx.font = 'bold 11px Consolas, monospace';
  ctx.textAlign = 'right';
  ctx.fillStyle = COLOR_INK_BRIGHT;
  ctx.fillText(
    `${win.length} of ${cfg.windowSize} paired points`,
    padL + plotW - 4,
    padT + 12,
  );
}

/** Continuous index trace (last ~60 sim-min). */
export function renderTraceChart(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: IndexState,
  cfg: IndexConfig,
) {
  clear(ctx, w, h);
  const padL = 38;
  const padR = 12;
  const padT = 18;
  const padB = 28;
  const plotW = Math.max(10, w - padL - padR);
  const plotH = Math.max(10, h - padT - padB);

  const trace = state.trace;
  if (trace.length === 0) {
    ctx.fillStyle = COLOR_INK;
    ctx.font = '11px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Building window, values appear once 30 paired points are buffered.', w / 2, h / 2);
    return;
  }

  const tEnd = trace[trace.length - 1]!.t;
  const tStart = Math.max(0, tEnd - 60 * 60);

  const yMin = -0.6;
  const yMax = 0.8;

  // Threshold bands
  // good: r < warn
  ctx.fillStyle = '#10B981';
  ctx.globalAlpha = 0.08;
  const yWarn = padT + plotH - ((cfg.warnThreshold - yMin) / (yMax - yMin)) * plotH;
  const yImp = padT + plotH - ((cfg.impairedThreshold - yMin) / (yMax - yMin)) * plotH;
  ctx.fillRect(padL, yWarn, plotW, padT + plotH - yWarn);
  ctx.fillStyle = '#FCD34D';
  ctx.fillRect(padL, yImp, plotW, yWarn - yImp);
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(padL, padT, plotW, yImp - padT);
  ctx.globalAlpha = 1;

  // Axes
  ctx.strokeStyle = COLOR_AXIS;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, padT + plotH);
  ctx.lineTo(padL + plotW, padT + plotH);
  ctx.stroke();

  // Y-axis ticks
  ctx.fillStyle = COLOR_INK;
  ctx.font = '9px Consolas, monospace';
  ctx.textAlign = 'right';
  [-0.5, 0, cfg.warnThreshold, cfg.impairedThreshold, 0.6].forEach((v) => {
    const py = padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
    gridH(ctx, padL, py, padL + plotW);
    ctx.fillText(v.toFixed(2), padL - 4, py + 3);
  });

  // Threshold labels
  ctx.textAlign = 'left';
  ctx.fillStyle = COLOR_WARN;
  ctx.fillText(`warn ≥ ${cfg.warnThreshold.toFixed(2)}`, padL + 4, yWarn - 3);
  ctx.fillStyle = COLOR_DANGER;
  ctx.fillText(`impaired ≥ ${cfg.impairedThreshold.toFixed(2)}`, padL + 4, yImp - 3);

  // X-axis label
  ctx.textAlign = 'center';
  ctx.fillStyle = COLOR_INK;
  ctx.fillText('last 60 sim-min', padL + plotW / 2, padT + plotH + 18);

  // Trace polyline (color by zone)
  for (let i = 1; i < trace.length; i++) {
    const a = trace[i - 1]!;
    const b = trace[i]!;
    if (b.t < tStart) continue;
    const ax = padL + ((a.t - tStart) / (tEnd - tStart)) * plotW;
    const ay = padT + plotH - ((a.r - yMin) / (yMax - yMin)) * plotH;
    const bx = padL + ((b.t - tStart) / (tEnd - tStart)) * plotW;
    const by = padT + plotH - ((b.r - yMin) / (yMax - yMin)) * plotH;
    const v = b.r;
    let color = COLOR_GOOD;
    if (v >= cfg.impairedThreshold) color = COLOR_DANGER;
    else if (v >= cfg.warnThreshold) color = COLOR_WARN;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }

  // Latest point
  const last = trace[trace.length - 1]!;
  if (tEnd > tStart) {
    const lx = padL + ((last.t - tStart) / (tEnd - tStart)) * plotW;
    const ly = padT + plotH - ((last.r - yMin) / (yMax - yMin)) * plotH;
    ctx.fillStyle = COLOR_INK_BRIGHT;
    ctx.beginPath();
    ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
