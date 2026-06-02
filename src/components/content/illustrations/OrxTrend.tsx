/**
 * Cerebral oximetry index (COx) in a preterm infant. Three stacked panels:
 *   1. rSO2 (%) and MAP (mmHg) trends over a 4-hour window
 *   2. COx trend (rolling 5-min correlation of MAP and rSO2)
 *   3. COx-vs-MAP U-curve, vertex = MAPopt (shallow, low confidence)
 *
 * Neonatal autoregulation is monitored with MAP-based NIRS indices (COx, HVx),
 * not ORx. Threshold COx approx 0.3 = pressure-passive. rSO2 55% hypoxic line.
 *
 * Original schematic for MNM-Edu. Illustrative preterm values, not a cited cohort.
 */
export function OrxTrend() {
  const W = 720;
  const H = 462;

  const noise = (i: number) => ((i * 9301 + 49297) % 233280) / 233280 - 0.5;

  // ----- Panel 1: rSO2 + MAP trends -----
  const p1 = { x: 50, y: 56, w: 620, h: 112 };
  const plotL = p1.x + 44;
  const plotR = p1.x + p1.w - 14;
  const xT = (t: number) => plotL + (t / 4) * (plotR - plotL);
  const rTop = p1.y + 22;
  const rBot = p1.y + 58;
  const ySr = (v: number) => rBot - ((v - 50) / 25) * (rBot - rTop); // rSO2 50..75 %
  const mTop = p1.y + 70;
  const mBot = p1.y + 102;
  const ySm = (v: number) => mBot - ((v - 25) / 25) * (mBot - mTop); // MAP 25..50 mmHg

  const N = 180;
  const rso2Pts: string[] = [];
  const mapPts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 4;
    const rso2 = 70 - 3.4 * t + 4 * Math.sin((2 * Math.PI * t) / 1.1) + 2 * noise(i);
    const map = 40 - 1.4 * t + 5 * Math.sin((2 * Math.PI * t) / 0.9) + 1.6 * noise(i * 2 + 1);
    rso2Pts.push(`${xT(t).toFixed(1)},${ySr(Math.max(50, Math.min(75, rso2))).toFixed(1)}`);
    mapPts.push(`${xT(t).toFixed(1)},${ySm(Math.max(25, Math.min(50, map))).toFixed(1)}`);
  }

  // ----- Panel 2: COx trend -----
  const p2 = { x: 50, y: 176, w: 620, h: 92 };
  const cTop = p2.y + 24;
  const cBot = p2.y + 74;
  const ySc = (v: number) => cBot - ((v + 0.2) / 1.0) * (cBot - cTop); // COx -0.2..0.8
  const coxPts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 4;
    const cox = 0.45 + 0.05 * Math.sin((2 * Math.PI * t) / 1.0) + 0.02 * noise(i * 3 + 2);
    coxPts.push(`${xT(t).toFixed(1)},${ySc(cox).toFixed(1)}`);
  }

  // ----- Panel 3: COx-vs-MAP U-curve -----
  const p3 = { x: 50, y: 276, w: 620, h: 152 };
  const u3L = p3.x + 50;
  const u3R = p3.x + p3.w - 16;
  const u3T = p3.y + 26;
  const u3B = p3.y + p3.h - 26;
  const mapMin = 25;
  const mapMax = 55;
  const xM = (m: number) => u3L + ((m - mapMin) / (mapMax - mapMin)) * (u3R - u3L);
  const yU = (v: number) => u3B - ((v + 0.2) / 1.0) * (u3B - u3T); // COx -0.2..0.8
  const MAPOPT = 38;
  const parab = (m: number) => Math.min(0.8, Math.max(-0.2, 0.38 + 0.0016 * (m - MAPOPT) ** 2));
  const uPts: string[] = [];
  for (let m = mapMin; m <= mapMax + 1e-6; m += 1) {
    uPts.push(`${xM(m).toFixed(1)},${yU(parab(m)).toFixed(1)}`);
  }
  const uScatter: { x: number; y: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const m = mapMin + 2 + (i / 29) * (mapMax - mapMin - 4) + 1.4 * noise(i * 5);
    const c = parab(m) + 0.07 * noise(i * 9 + 4);
    uScatter.push({ x: xM(m), y: yU(Math.max(-0.2, Math.min(0.8, c))) });
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block w-full h-auto"
      role="img"
      aria-label="Cerebral oximetry index COx in a preterm infant, three panels: rSO2 falling toward the 55 percent hypoxic line and MAP drifting below optimum; COx sustained at plus 0.4 to 0.5 above the 0.3 impaired threshold; and a shallow COx-versus-MAP U-curve with the nadir MAPopt near 38 mmHg."
    >
      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={26} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        CEREBRAL OXIMETRY INDEX (COx) · PRETERM INFANT
      </text>
      <text x={W / 2} y={45} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10.5" fill="#94A3B8">
        COx = rolling 5-min correlation(MAP, rSO2) · 4-hour window · impaired when COx &gt; 0.3
      </text>

      {/* ---------- Panel 1 ---------- */}
      <rect x={p1.x} y={p1.y} width={p1.w} height={p1.h} rx="6" fill="#0B1B33" stroke="#23344f" strokeWidth="1" />
      <text x={p1.x + 8} y={rTop - 4} fontFamily="Consolas, monospace" fontSize="9.5" fontWeight="700" fill="#5EEAD4">rSO2 (%)</text>
      {/* 55% hypoxic line */}
      <line x1={plotL} y1={ySr(55)} x2={plotR} y2={ySr(55)} stroke="#EF4444" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.85" />
      <text x={plotL - 4} y={ySr(55) + 3} textAnchor="end" fontFamily="Consolas, monospace" fontSize="8" fill="#EF4444">55</text>
      <text x={plotL - 4} y={ySr(72) + 3} textAnchor="end" fontFamily="Consolas, monospace" fontSize="8" fill="#64748B">72</text>
      <polyline points={rso2Pts.join(' ')} fill="none" stroke="#5EEAD4" strokeWidth="1.7" />
      <text x={p1.x + 8} y={mTop - 2} fontFamily="Consolas, monospace" fontSize="9.5" fontWeight="700" fill="#FCD34D">MAP (mmHg)</text>
      {/* MAPopt 38 reference */}
      <line x1={plotL} y1={ySm(38)} x2={plotR} y2={ySm(38)} stroke="#86EFAC" strokeWidth="0.7" strokeDasharray="2 3" opacity="0.7" />
      <text x={plotL - 4} y={ySm(38) + 3} textAnchor="end" fontFamily="Consolas, monospace" fontSize="8" fill="#86EFAC">38</text>
      <polyline points={mapPts.join(' ')} fill="none" stroke="#FCD34D" strokeWidth="1.7" />
      <text x={(plotL + plotR) / 2} y={p1.y + p1.h - 3} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fill="#64748B">time · 0 to 4 h</text>

      {/* ---------- Panel 2 ---------- */}
      <rect x={p2.x} y={p2.y} width={p2.w} height={p2.h} rx="6" fill="#0B1B33" stroke="#23344f" strokeWidth="1" />
      <text x={p2.x + 8} y={p2.y + 16} fontFamily="Consolas, monospace" fontSize="9.5" fontWeight="700" fill="#EF4444">COx (rolling 5 min)</text>
      {/* impaired shade above 0.3 */}
      <rect x={plotL} y={ySc(0.8)} width={plotR - plotL} height={ySc(0.3) - ySc(0.8)} fill="#EF4444" opacity="0.07" />
      <line x1={plotL} y1={ySc(0.3)} x2={plotR} y2={ySc(0.3)} stroke="#EF4444" strokeWidth="0.9" strokeDasharray="4 3" opacity="0.9" />
      <text x={plotR} y={ySc(0.3) + 11} textAnchor="end" fontFamily="Consolas, monospace" fontSize="8" fontWeight="700" fill="#EF4444">impaired &gt; 0.3</text>
      <line x1={plotL} y1={ySc(0)} x2={plotR} y2={ySc(0)} stroke="#334155" strokeWidth="0.6" strokeDasharray="2 2" />
      <text x={plotL - 4} y={ySc(0) + 3} textAnchor="end" fontFamily="Consolas, monospace" fontSize="8" fill="#64748B">0</text>
      <text x={plotR} y={p2.y + 16} textAnchor="end" fontFamily="Consolas, monospace" fontSize="8.5" fill="#F97316">COx approx +0.4 to +0.5</text>
      <polyline points={coxPts.join(' ')} fill="none" stroke="#F97316" strokeWidth="1.9" />

      {/* ---------- Panel 3 ---------- */}
      <rect x={p3.x} y={p3.y} width={p3.w} height={p3.h} rx="6" fill="#0B1B33" stroke="#23344f" strokeWidth="1" />
      <text x={p3.x + 8} y={p3.y + 16} fontFamily="Consolas, monospace" fontSize="9.5" fontWeight="700" fill="#86EFAC">COx vs MAP · U-curve</text>
      {/* axes */}
      <line x1={u3L} y1={u3B} x2={u3R} y2={u3B} stroke="#475569" strokeWidth="1.2" />
      <line x1={u3L} y1={u3T} x2={u3L} y2={u3B} stroke="#475569" strokeWidth="1.2" />
      {[25, 35, 45, 55].map((m) => (
        <g key={`m-${m}`}>
          <line x1={xM(m)} y1={u3B} x2={xM(m)} y2={u3B + 4} stroke="#475569" />
          <text x={xM(m)} y={u3B + 15} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8.5" fill="#94A3B8">{m}</text>
        </g>
      ))}
      <text x={(u3L + u3R) / 2} y={p3.y + p3.h - 4} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#86EFAC">MAP (mmHg)</text>
      {[0.8, 0.3, 0, -0.2].map((v) => (
        <text key={`cy-${v}`} x={u3L - 6} y={yU(v) + 3} textAnchor="end" fontFamily="Consolas, monospace" fontSize="8" fill={v === 0.3 ? '#EF4444' : '#64748B'}>
          {v > 0 ? `+${v}` : `${v}`}
        </text>
      ))}
      {/* threshold 0.3 */}
      <line x1={u3L} y1={yU(0.3)} x2={u3R} y2={yU(0.3)} stroke="#EF4444" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.85" />
      {/* scatter + curve */}
      {uScatter.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2" fill="#86EFAC" opacity="0.55" />
      ))}
      <polyline points={uPts.join(' ')} fill="none" stroke="#86EFAC" strokeWidth="2.6" />
      {/* vertex MAPopt */}
      <circle cx={xM(MAPOPT)} cy={yU(parab(MAPOPT))} r="4" fill="#FCD34D" stroke="#0B1B33" strokeWidth="1.2" />
      <line x1={xM(MAPOPT)} y1={yU(parab(MAPOPT))} x2={xM(MAPOPT)} y2={u3B} stroke="#FCD34D" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.7" />
      <text x={xM(MAPOPT)} y={yU(parab(MAPOPT)) - 8} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">MAPopt 38</text>
      <text x={u3R} y={u3T + 4} textAnchor="end" fontFamily="Segoe UI, sans-serif" fontSize="8.5" fontStyle="italic" fill="#94A3B8">shallow vertex · low confidence</text>

      <text x={W / 2} y={H - 3} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · COx = correlation(MAP, rSO2) · illustrative preterm values, not a cited cohort
      </text>
    </svg>
  );
}
