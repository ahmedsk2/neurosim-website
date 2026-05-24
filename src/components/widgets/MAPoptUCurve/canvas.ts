/**
 * Canvas drawing helpers for the MAPopt-from-ORx/Mx widget.
 * Mirrors the visual structure of the PRx CPPopt widget but bins by MAP and
 * supports either ORx or Mx as the driving index.
 */

import type { IndexChoice, IndexPipelineState, MAPoptConfig, MAPoptState } from './types';

const COLORS = {
  bg: '#0F1A2E',
  grid: '#1e293b',
  axis: '#475569',
  text: '#94A3B8',
  abp: '#5EEAD4',
  meanTeal: '#14B8A6',
  rso2: '#FCD34D',
  mfv: '#A78BFA',
  red: '#EF4444',
  good: '#10B981',
  amber: '#F59E0B',
  amberLight: '#FCD34D',
  ink: '#FFFFFF',
  inkDim: '#64748B',
} as const;

function clearCv(ctx: CanvasRenderingContext2D, w: number, h: number, bg = COLORS.bg) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

interface PanelInfo {
  derivedColor: string;
  derivedKey: 'rso2' | 'mfv';
  derivedLabel: string;
  derivedUnit: string;
  derivedMin: number;
  derivedMax: number;
  pipe: IndexPipelineState;
  indexName: string;
}

function panelFor(state: MAPoptState, choice: IndexChoice): PanelInfo {
  if (choice === 'orx') {
    return {
      derivedColor: COLORS.rso2,
      derivedKey: 'rso2',
      derivedLabel: 'rSO₂',
      derivedUnit: '%',
      derivedMin: 50,
      derivedMax: 80,
      pipe: state.orx,
      indexName: 'ORx',
    };
  }
  return {
    derivedColor: COLORS.mfv,
    derivedKey: 'mfv',
    derivedLabel: 'MFV',
    derivedUnit: 'cm/s',
    derivedMin: 30,
    derivedMax: 90,
    pipe: state.mx,
    indexName: 'Mx',
  };
}

export function renderRawChart(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: MAPoptState,
  choice: IndexChoice,
) {
  clearCv(ctx, w, h);
  if (state.rawAbp.length < 2) return;
  const info = panelFor(state, choice);
  const tNow = state.simT;
  const tStart = tNow - 60;
  const xScale = (t: number) => ((t - tStart) / 60) * (w - 60) + 30;
  const padTop = 8;
  const padBot = 22;

  const mapMin = 40;
  const mapMax = 130;
  const yMap = (v: number) =>
    h - padBot - ((v - mapMin) / (mapMax - mapMin)) * (h - padTop - padBot);
  const yDer = (v: number) =>
    h - padBot -
    ((v - info.derivedMin) / (info.derivedMax - info.derivedMin)) * (h - padTop - padBot);

  // Gridlines on the MAP scale
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 0.5;
  for (let v = mapMin; v <= mapMax; v += 30) {
    ctx.beginPath();
    ctx.moveTo(30, yMap(v));
    ctx.lineTo(w - 30, yMap(v));
    ctx.stroke();
    ctx.fillStyle = COLORS.meanTeal;
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(String(v), 26, yMap(v) + 3);
  }
  // Right axis labels for the derived signal
  for (
    let v = info.derivedMin;
    v <= info.derivedMax;
    v += Math.max(5, Math.round((info.derivedMax - info.derivedMin) / 4))
  ) {
    ctx.fillStyle = info.derivedColor;
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(String(v), w - 28, yDer(v) + 3);
  }

  // ABP trace
  ctx.strokeStyle = COLORS.abp;
  ctx.lineWidth = 1;
  ctx.beginPath();
  state.rawAbp.forEach((s, i) => {
    const x = xScale(s.t);
    const y = yMap(s.v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Derived raw signal trace
  const rawDerived = choice === 'orx' ? state.rawRso2 : state.rawMfv;
  ctx.strokeStyle = info.derivedColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  rawDerived.forEach((s, i) => {
    const x = xScale(s.t);
    const y = yDer(s.v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Decimated 10-s mean dots
  ctx.fillStyle = COLORS.meanTeal;
  for (const p of state.meanPairs) {
    if (p.t < tStart) continue;
    const x = xScale(p.t);
    ctx.beginPath();
    ctx.arc(x, yMap(p.map), 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = info.derivedColor;
    ctx.beginPath();
    ctx.arc(x, yDer(p[info.derivedKey]), 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = COLORS.meanTeal;
  }
}

export function renderWindowChart(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: MAPoptState,
  choice: IndexChoice,
) {
  clearCv(ctx, w, h);
  const info = panelFor(state, choice);
  const padL = 36;
  const padR = 36;
  const padT = 8;
  const padB = 22;
  const N = 30;
  const win = state.meanPairs.slice(-N);
  if (win.length < 2) return;
  const xScale = (i: number) => padL + (i / (N - 1)) * (w - padL - padR);
  const mapMin = 50;
  const mapMax = 110;
  const yMap = (v: number) =>
    h - padB - ((v - mapMin) / (mapMax - mapMin)) * (h - padT - padB);
  const yDer = (v: number) =>
    h - padB -
    ((v - info.derivedMin) / (info.derivedMax - info.derivedMin)) * (h - padT - padB);
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 0.5;
  for (let v = mapMin; v <= mapMax; v += 15) {
    ctx.beginPath();
    ctx.moveTo(padL, yMap(v));
    ctx.lineTo(w - padR, yMap(v));
    ctx.stroke();
    ctx.fillStyle = COLORS.meanTeal;
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(String(v), padL - 4, yMap(v) + 3);
  }
  const dStep = Math.max(5, Math.round((info.derivedMax - info.derivedMin) / 4));
  for (let v = info.derivedMin; v <= info.derivedMax; v += dStep) {
    ctx.fillStyle = info.derivedColor;
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(String(v), w - padR + 4, yDer(v) + 3);
  }
  ctx.strokeStyle = COLORS.meanTeal;
  ctx.lineWidth = 2;
  ctx.beginPath();
  win.forEach((p, i) => {
    const x = xScale(i);
    const y = yMap(p.map);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.strokeStyle = info.derivedColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  win.forEach((p, i) => {
    const x = xScale(i);
    const y = yDer(p[info.derivedKey]);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  win.forEach((p, i) => {
    const x = xScale(i);
    ctx.fillStyle = COLORS.meanTeal;
    ctx.beginPath();
    ctx.arc(x, yMap(p.map), 2.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = info.derivedColor;
    ctx.beginPath();
    ctx.arc(x, yDer(p[info.derivedKey]), 2.5, 0, 2 * Math.PI);
    ctx.fill();
  });
  if (info.pipe.rValue != null) {
    const r = info.pipe.rValue;
    let col: string = COLORS.good;
    if (r >= 0.3) col = COLORS.red;
    else if (r >= 0.05) col = COLORS.amber;
    ctx.fillStyle = col;
    ctx.font = 'bold 14px Consolas, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(
      `${info.indexName} = ${(r >= 0 ? '+' : '') + r.toFixed(2)}`,
      w - padR - 4,
      padT + 14,
    );
  }
}

export function renderTraceChart(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: MAPoptState,
  choice: IndexChoice,
) {
  clearCv(ctx, w, h);
  const info = panelFor(state, choice);
  const trace = info.pipe.trace;
  const padL = 36;
  const padR = 14;
  const padT = 12;
  const padB = 22;
  const minR = -1;
  const maxR = 1;
  const minutes = 60;
  if (trace.length === 0) return;
  const lastT = trace[trace.length - 1]!.t;
  const startT = lastT - minutes * 60;
  const xScale = (t: number) =>
    padL + ((t - startT) / (minutes * 60)) * (w - padL - padR);
  const yScale = (r: number) =>
    h - padB - ((r - minR) / (maxR - minR)) * (h - padT - padB);
  ctx.fillStyle = 'rgba(16, 185, 129, 0.10)';
  ctx.fillRect(padL, yScale(0.05), w - padL - padR, yScale(-1) - yScale(0.05));
  ctx.fillStyle = 'rgba(245, 158, 11, 0.10)';
  ctx.fillRect(padL, yScale(0.3), w - padL - padR, yScale(0.05) - yScale(0.3));
  ctx.fillStyle = 'rgba(239, 68, 68, 0.10)';
  ctx.fillRect(padL, yScale(1), w - padL - padR, yScale(0.3) - yScale(1));
  ctx.strokeStyle = COLORS.axis;
  ctx.lineWidth = 0.5;
  for (const r of [-1, -0.5, 0, 0.3, 0.5, 1]) {
    ctx.setLineDash(r === 0 ? [] : [3, 3]);
    ctx.beginPath();
    ctx.moveTo(padL, yScale(r));
    ctx.lineTo(w - padR, yScale(r));
    ctx.stroke();
    ctx.fillStyle = COLORS.text;
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(r.toFixed(r === 0 ? 0 : Math.abs(r) === 0.3 ? 2 : 1), padL - 4, yScale(r) + 3);
  }
  ctx.setLineDash([]);
  trace.forEach((p, i) => {
    if (p.t < startT) return;
    let col: string = COLORS.good;
    if (p.r >= 0.3) col = COLORS.red;
    else if (p.r >= 0.05) col = COLORS.amber;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(xScale(p.t), yScale(p.r), 2.5, 0, 2 * Math.PI);
    ctx.fill();
    if (i > 0) {
      const prev = trace[i - 1]!;
      if (prev.t >= startT) {
        ctx.strokeStyle = COLORS.axis;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(xScale(prev.t), yScale(prev.r));
        ctx.lineTo(xScale(p.t), yScale(p.r));
        ctx.stroke();
      }
    }
  });
}

export function renderMAPoptChart(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  state: MAPoptState,
  cfg: MAPoptConfig,
  choice: IndexChoice,
) {
  clearCv(ctx, w, h);
  const info = panelFor(state, choice);
  const pipe = info.pipe;
  const padL = 50;
  const padR = 24;
  const padT = 28;
  const padB = 42;
  const xMin = cfg.mapBinMin - 5;
  const xMax = cfg.mapBinMax + 5;
  const yMin = -1;
  const yMax = 1;
  const xScale = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * (w - padL - padR);
  const yScale = (y: number) =>
    h - padB - ((y - yMin) / (yMax - yMin)) * (h - padT - padB);

  // Coloured zones
  ctx.fillStyle = 'rgba(239, 68, 68, 0.06)';
  ctx.fillRect(padL, yScale(1), w - padL - padR, yScale(0.3) - yScale(1));
  ctx.fillStyle = 'rgba(16, 185, 129, 0.06)';
  ctx.fillRect(padL, yScale(0.05), w - padL - padR, yScale(-1) - yScale(0.05));

  ctx.strokeStyle = COLORS.axis;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, padT);
  ctx.lineTo(padL, h - padB);
  ctx.lineTo(w - padR, h - padB);
  ctx.stroke();

  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 0.5;
  for (let x = 50; x <= 110; x += 10) {
    ctx.beginPath();
    ctx.moveTo(xScale(x), padT);
    ctx.lineTo(xScale(x), h - padB);
    ctx.stroke();
    ctx.fillStyle = COLORS.text;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(x), xScale(x), h - padB + 14);
  }
  for (let y = -1; y <= 1; y += 0.5) {
    ctx.beginPath();
    ctx.moveTo(padL, yScale(y));
    ctx.lineTo(w - padR, yScale(y));
    ctx.stroke();
    ctx.fillStyle = COLORS.text;
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(y.toFixed(1), padL - 4, yScale(y) + 3);
  }
  ctx.strokeStyle = COLORS.text;
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(padL, yScale(0));
  ctx.lineTo(w - padR, yScale(0));
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = COLORS.abp;
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MAP (mmHg)', (padL + w - padR) / 2, h - 8);
  ctx.save();
  ctx.translate(15, (padT + h - padB) / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText(info.indexName, 0, 0);
  ctx.restore();

  // Raw scatter
  ctx.fillStyle =
    choice === 'orx' ? 'rgba(252, 211, 77, 0.20)' : 'rgba(167, 139, 250, 0.22)';
  for (const p of pipe.buffer) {
    ctx.beginPath();
    ctx.arc(xScale(p.map), yScale(Math.max(yMin, Math.min(yMax, p.r))), 1.8, 0, 2 * Math.PI);
    ctx.fill();
  }
  // Bin means
  for (const k of Object.keys(pipe.binData)) {
    const x = parseFloat(k);
    const y = pipe.binData[Number(k)] ?? 0;
    ctx.fillStyle = info.derivedColor;
    ctx.strokeStyle = COLORS.bg;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xScale(x), yScale(Math.max(yMin, Math.min(yMax, y))), 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  if (pipe.fitCoeff && pipe.optValue != null) {
    const { a, b, c } = pipe.fitCoeff;
    const opt = pipe.optValue;
    const bandX0 = xScale(opt - 5);
    const bandX1 = xScale(opt + 5);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.20)';
    ctx.fillRect(bandX0, padT, bandX1 - bandX0, h - padT - padB);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(bandX0, padT);
    ctx.lineTo(bandX0, h - padB);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bandX1, padT);
    ctx.lineTo(bandX1, h - padB);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = COLORS.amber;
    ctx.lineWidth = 3;
    ctx.beginPath();
    let first = true;
    for (let x = xMin; x <= xMax; x += 0.5) {
      const y = a * x * x + b * x + c;
      if (y < yMin || y > yMax) {
        first = true;
        continue;
      }
      const px = xScale(x);
      const py = yScale(y);
      if (first) {
        ctx.moveTo(px, py);
        first = false;
      } else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.strokeStyle = COLORS.amber;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(xScale(opt), padT);
    ctx.lineTo(xScale(opt), h - padB);
    ctx.stroke();
    ctx.setLineDash([]);

    const yAtOpt = a * opt * opt + b * opt + c;
    ctx.fillStyle = COLORS.amber;
    ctx.strokeStyle = COLORS.bg;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xScale(opt), yScale(yAtOpt), 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(15, 26, 46, 0.95)';
    ctx.strokeStyle = COLORS.amber;
    ctx.lineWidth = 1.5;
    const boxX = padL + 8;
    const boxY = padT + 6;
    const boxW = 200;
    const boxH = 50;
    roundRect(ctx, boxX, boxY, boxW, boxH, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = COLORS.amber;
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`MAPopt(${info.indexName}) = −b ⁄ (2a)`, boxX + 10, boxY + 16);
    ctx.fillStyle = COLORS.ink;
    ctx.font = 'bold 22px Consolas, monospace';
    ctx.fillText(opt.toFixed(0) + ' mmHg', boxX + 10, boxY + 38);
    ctx.fillStyle = COLORS.text;
    ctx.font = '10px sans-serif';
    ctx.fillText(
      'target: ' + (opt - 5).toFixed(0) + '–' + (opt + 5).toFixed(0),
      boxX + 120,
      boxY + 36,
    );

    const ax = boxX + boxW;
    const ay = boxY + boxH / 2;
    const vx = xScale(opt) - 9;
    const vy = yScale(yAtOpt);
    ctx.strokeStyle = COLORS.amber;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(vx, vy);
    ctx.stroke();
    const angle = Math.atan2(vy - ay, vx - ax);
    ctx.beginPath();
    ctx.moveTo(vx, vy);
    ctx.lineTo(vx - 8 * Math.cos(angle - 0.4), vy - 8 * Math.sin(angle - 0.4));
    ctx.lineTo(vx - 8 * Math.cos(angle + 0.4), vy - 8 * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fillStyle = COLORS.amber;
    ctx.fill();

    ctx.fillStyle = COLORS.amber;
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MAPopt', xScale(opt), h - padB + 26);

    ctx.fillStyle = COLORS.amberLight;
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('±5 mmHg target band', xScale(opt), padT - 6);
  } else {
    ctx.fillStyle = COLORS.inkDim;
    ctx.font = 'italic 12px sans-serif';
    ctx.textAlign = 'center';
    const need = Math.max(0, cfg.minBinsForFit - Object.keys(pipe.binData).length);
    let msg: string;
    if (pipe.buffer.length === 0)
      msg = 'Waiting for first ' + info.indexName + ' update… (1 minute of sim time)';
    else if (need > 0)
      msg = 'Building bins, need ' + need + ' more before fit can converge.';
    else msg = 'Fit not converged (a ≤ 0). Try Realistic mode.';
    ctx.fillText(msg, (padL + w - padR) / 2, (padT + h - padB) / 2);
  }
}
