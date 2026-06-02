/**
 * PRx vs Mx vs ORx: the same patient's autoregulation index computed three ways,
 * each as an index-vs-CPP U-curve. Top row concordant (the three agree on CPPopt);
 * bottom row discordant (the three give different CPPopt). Discordance carries
 * information: the indices sample different vascular beds.
 *   PRx  ICP            whole-brain
 *   Mx   TCD MFV        large-vessel
 *   ORx  NIRS rSO2      regional cortex
 *
 * Original schematic for MNM-Edu. Rivera-Lara 2017 (macro vs micro autoregulation);
 * Czosnyka 1997 (PRx) / 1996 (Mx); Brady 2010 (ORx). Illustrative, not patient data.
 */
export function PrxMxOrx() {
  const W = 720;
  const H = 450;

  type Mini = { title: string; color: string; cppopt: number; depth: number };

  const concordant: Mini[] = [
    { title: 'PRx · ICP', color: '#5EEAD4', cppopt: 70, depth: -0.15 },
    { title: 'Mx · TCD MFV', color: '#FCD34D', cppopt: 70, depth: -0.13 },
    { title: 'ORx · NIRS rSO2', color: '#86EFAC', cppopt: 70, depth: -0.12 },
  ];
  const discordant: Mini[] = [
    { title: 'PRx · ICP', color: '#5EEAD4', cppopt: 70, depth: -0.2 },
    { title: 'Mx · TCD MFV', color: '#FCD34D', cppopt: 60, depth: -0.12 },
    { title: 'ORx · NIRS rSO2', color: '#86EFAC', cppopt: 82, depth: -0.05 },
  ];

  const PWID = 200;
  const PHGT = 148;
  const GAP = 10;
  const X0 = 50;
  const xsByCol = [X0, X0 + PWID + GAP, X0 + 2 * (PWID + GAP)];

  const renderMini = (m: Mini, px: number, py: number, keyId: string) => {
    const plotL = px + 26;
    const plotR = px + PWID - 10;
    const plotT = py + 24;
    const plotB = py + PHGT - 20;
    const xMin = 48;
    const xMax = 92;
    const yMin = -0.4;
    const yMax = 0.8;
    const xScale = (cpp: number) => plotL + ((cpp - xMin) / (xMax - xMin)) * (plotR - plotL);
    const yScale = (v: number) => plotB - ((v - yMin) / (yMax - yMin)) * (plotB - plotT);
    const A = 0.0024;
    const parab = (cpp: number) => Math.min(yMax, Math.max(yMin, m.depth + A * (cpp - m.cppopt) ** 2));

    const pts: string[] = [];
    for (let cpp = xMin; cpp <= xMax + 1e-6; cpp += 1) {
      pts.push(`${xScale(cpp).toFixed(1)},${yScale(parab(cpp)).toFixed(1)}`);
    }

    return (
      <g key={keyId}>
        <rect x={px} y={py} width={PWID} height={PHGT} rx="6" fill="#0B1B33" stroke="#23344f" strokeWidth="1" />
        <text x={px + 10} y={py + 16} fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill={m.color} letterSpacing="0.5">
          {m.title}
        </text>
        {/* zero + threshold lines */}
        <line x1={plotL} y1={yScale(0)} x2={plotR} y2={yScale(0)} stroke="#334155" strokeWidth="0.6" strokeDasharray="2 2" />
        <line x1={plotL} y1={yScale(0.25)} x2={plotR} y2={yScale(0.25)} stroke="#EF4444" strokeWidth="0.7" strokeDasharray="3 3" opacity="0.75" />
        <text x={plotL + 1} y={yScale(0.25) - 3} fontFamily="Consolas, monospace" fontSize="7.5" fill="#EF4444">
          +0.25
        </text>
        {/* y end labels */}
        <text x={px + 22} y={yScale(0.8) + 3} textAnchor="end" fontFamily="Consolas, monospace" fontSize="7.5" fill="#64748B">+.8</text>
        <text x={px + 22} y={yScale(-0.4) + 3} textAnchor="end" fontFamily="Consolas, monospace" fontSize="7.5" fill="#64748B">-.4</text>
        {/* curve */}
        <polyline points={pts.join(' ')} fill="none" stroke={m.color} strokeWidth="2.2" />
        {/* vertex */}
        <circle cx={xScale(m.cppopt)} cy={yScale(m.depth)} r="3.2" fill={m.color} stroke="#0B1B33" strokeWidth="1" />
        <line x1={xScale(m.cppopt)} y1={yScale(m.depth)} x2={xScale(m.cppopt)} y2={plotB} stroke={m.color} strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />
        <text x={xScale(m.cppopt)} y={plotB + 12} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8.5" fontWeight="700" fill={m.color}>
          CPPopt {m.cppopt}
        </text>
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block w-full h-auto"
      role="img"
      aria-label="Six small U-curve panels comparing PRx, Mx and ORx for one patient. Top row concordant: all three share CPPopt near 70. Bottom row discordant: PRx 70, Mx 60, ORx 82. The indices sample different vascular beds."
    >
      <rect width={W} height={H} fill="#081224" />

      <text x={W / 2} y={26} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        PRx vs Mx vs ORx · ONE PATIENT, THREE INDICES
      </text>
      <text x={W / 2} y={45} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10.5" fill="#94A3B8">
        Each panel is an index-vs-CPP U-curve · shared scale -1 to +1 · threshold +0.25
      </text>

      {/* Concordant row */}
      <text x={X0} y={64} fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#10B981" letterSpacing="1">
        CONCORDANT · the three agree on CPPopt (~70)
      </text>
      {concordant.map((m, i) => renderMini(m, xsByCol[i]!, 70, `c-${i}`))}

      {/* Discordant row */}
      <text x={X0} y={236} fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#F97316" letterSpacing="1">
        DISCORDANT · different CPPopt per index (PRx 70 · Mx 60 · ORx 82)
      </text>
      {discordant.map((m, i) => renderMini(m, xsByCol[i]!, 242, `d-${i}`))}

      {/* Bottom interpretation strip */}
      <g transform={`translate(${X0}, 402)`}>
        <rect width={W - 2 * X0} height="34" rx="6" fill="#152238" stroke="#2a3a55" />
        <text x="14" y="15" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4" letterSpacing="1">
          DISCORDANCE IS INFORMATION
        </text>
        <text x="14" y="28" fontFamily="Segoe UI, sans-serif" fontSize="9.5" fill="#FFFFFF">
          PRx samples whole-brain (ICP) · Mx large-vessel (TCD MFV) · ORx regional cortex (NIRS rSO2). Disagreement localises where autoregulation fails.
        </text>
      </g>

      <text x={W / 2} y={H - 3} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · Rivera-Lara 2017 · Czosnyka 1997 (PRx) / 1996 (Mx) · Brady 2010 (ORx)
      </text>
    </svg>
  );
}
