/**
 * PRx-vs-CPP U-curve: PRx (y) plotted against CPP (x) over a 4-hour window,
 * each point a 5-minute average. A least-squares parabola is fit; its vertex
 * is CPPopt (PRx most negative). LLA / ULA are where the parabola crosses the
 * +0.25 impairment threshold; the green band is the CPPopt +/- 5 mmHg target.
 *
 * Original schematic for MNM-Edu. Steiner 2002 / Aries 2012 (U-curve, CPPopt);
 * Sorrentino 2012 (+0.25). Illustrative values, not patient data.
 */
export function PrxCppUCurve() {
  const W = 720;
  const H = 400;
  const margin = { top: 64, right: 212, bottom: 58, left: 64 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const xMin = 50;
  const xMax = 92;
  const yMin = -0.4;
  const yMax = 0.8;
  const xScale = (cpp: number) => margin.left + ((cpp - xMin) / (xMax - xMin)) * plotW;
  const yScale = (prx: number) => margin.top + plotH - ((prx - yMin) / (yMax - yMin)) * plotH;

  // Parabola: PRx = A*(CPP - CPPopt)^2 + PRxmin, tuned so PRx = +0.25 at CPP 55 / 85.
  const CPPOPT = 70;
  const PRX_MIN = -0.2;
  const A = 0.002;
  const parab = (cpp: number) => Math.min(yMax, Math.max(yMin, PRX_MIN + A * (cpp - CPPOPT) ** 2));

  const curve: string[] = [];
  for (let cpp = xMin; cpp <= xMax + 1e-6; cpp += 0.5) {
    curve.push(`${xScale(cpp).toFixed(1)},${yScale(parab(cpp)).toFixed(1)}`);
  }

  // 5-minute-window scatter around the parabola (deterministic jitter).
  const noise = (i: number) => ((i * 9301 + 49297) % 233280) / 233280 - 0.5;
  const scatter: { x: number; y: number }[] = [];
  const NP = 44;
  for (let i = 0; i < NP; i++) {
    const cpp = xMin + 2 + (i / (NP - 1)) * (xMax - xMin - 4) + 1.6 * noise(i * 3);
    const prx = parab(cpp) + 0.13 * noise(i * 7 + 1);
    scatter.push({ x: xScale(cpp), y: yScale(Math.max(yMin, Math.min(yMax, prx))) });
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block w-full h-auto"
      role="img"
      aria-label="PRx-versus-CPP U-curve with the parabola vertex at CPPopt 70 mmHg, the lower and upper limits of autoregulation where PRx crosses +0.25, and a shaded CPPopt plus or minus 5 mmHg target band"
    >
      <rect width={W} height={H} fill="#081224" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        PRx vs CPP · THE CPPopt U-CURVE
      </text>
      <text x={W / 2} y={48} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10.5" fill="#94A3B8">
        4-hour window · each point a 5-min average · vertex = CPPopt
      </text>

      {/* CPPopt +/- 5 mmHg target band */}
      <rect x={xScale(CPPOPT - 5)} y={margin.top} width={xScale(CPPOPT + 5) - xScale(CPPOPT - 5)} height={plotH} fill="#10B981" opacity="0.12" />
      <text x={xScale(CPPOPT)} y={margin.top - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#10B981">
        CPPopt +/- 5
      </text>

      {/* Axes */}
      <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#475569" strokeWidth="1.4" />
      <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#475569" strokeWidth="1.4" />

      {/* X ticks (CPP) */}
      {[50, 60, 70, 80, 90].map((x) => (
        <g key={`x-${x}`}>
          <line x1={xScale(x)} y1={margin.top + plotH} x2={xScale(x)} y2={margin.top + plotH + 5} stroke="#475569" />
          <text x={xScale(x)} y={margin.top + plotH + 17} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fill="#94A3B8">
            {x}
          </text>
        </g>
      ))}
      <text x={margin.left + plotW / 2} y={H - 14} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="12" fontWeight="700" fill="#5EEAD4">
        CPP (mmHg)
      </text>

      {/* Y ticks (PRx) */}
      {[0.8, 0.4, 0.25, 0, -0.4].map((y) => (
        <g key={`y-${y}`}>
          <line x1={margin.left - 5} y1={yScale(y)} x2={margin.left} y2={yScale(y)} stroke="#475569" />
          <text x={margin.left - 9} y={yScale(y) + 3} textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
            {y > 0 ? `+${y}` : `${y}`}
          </text>
        </g>
      ))}
      <text x={20} y={margin.top + plotH / 2} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#5EEAD4" transform={`rotate(-90 20 ${margin.top + plotH / 2})`}>
        PRx
      </text>

      {/* +0.25 threshold line */}
      <line x1={margin.left} y1={yScale(0.25)} x2={margin.left + plotW} y2={yScale(0.25)} stroke="#EF4444" strokeWidth="1" strokeDasharray="5 3" opacity="0.9" />
      <text x={margin.left + plotW} y={yScale(0.25) - 4} textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#EF4444">
        PRx +0.25
      </text>

      {/* zero line */}
      <line x1={margin.left} y1={yScale(0)} x2={margin.left + plotW} y2={yScale(0)} stroke="#334155" strokeWidth="0.7" strokeDasharray="2 2" />

      {/* scatter */}
      {scatter.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.2" fill="#7DD3FC" opacity="0.7" />
      ))}

      {/* parabola fit */}
      <polyline points={curve.join(' ')} fill="none" stroke="#5EEAD4" strokeWidth="3" />

      {/* LLA / ULA markers (parabola crosses +0.25 at CPP 55 and 85) */}
      {[
        { cpp: 55, label: 'LLA 55' },
        { cpp: 85, label: 'ULA 85' },
      ].map((m) => (
        <g key={m.label}>
          <circle cx={xScale(m.cpp)} cy={yScale(0.25)} r="3.5" fill="#EF4444" stroke="#081224" strokeWidth="1" />
          <line x1={xScale(m.cpp)} y1={yScale(0.25)} x2={xScale(m.cpp)} y2={margin.top + plotH} stroke="#EF4444" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.6" />
          <text x={xScale(m.cpp)} y={yScale(0.25) - 8} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#EF4444">
            {m.label}
          </text>
        </g>
      ))}

      {/* CPPopt vertex */}
      <circle cx={xScale(CPPOPT)} cy={yScale(PRX_MIN)} r="4.5" fill="#10B981" stroke="#081224" strokeWidth="1.4" />
      <line x1={xScale(CPPOPT)} y1={yScale(PRX_MIN)} x2={xScale(CPPOPT)} y2={margin.top + plotH} stroke="#10B981" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.7" />
      <text x={xScale(CPPOPT)} y={yScale(PRX_MIN) + 18} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#10B981">
        CPPopt 70
      </text>

      {/* Right legend / interpretation panel */}
      <g transform={`translate(${W - margin.right + 14}, ${margin.top - 6})`}>
        <rect x="0" y="0" width="186" height="252" rx="6" fill="#152238" stroke="#2a3a55" />
        <text x="93" y="20" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          READING IT
        </text>

        <g transform="translate(12, 36)">
          <circle cx="6" cy="4" r="3" fill="#7DD3FC" />
          <text x="18" y="7" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">5-min PRx-CPP points</text>
        </g>
        <g transform="translate(12, 58)">
          <line x1="0" y1="4" x2="14" y2="4" stroke="#5EEAD4" strokeWidth="3" />
          <text x="20" y="7" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">least-squares parabola</text>
        </g>
        <g transform="translate(12, 80)">
          <circle cx="6" cy="4" r="3.5" fill="#10B981" />
          <text x="18" y="7" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">vertex = CPPopt (70)</text>
        </g>
        <g transform="translate(12, 102)">
          <circle cx="6" cy="4" r="3.5" fill="#EF4444" />
          <text x="18" y="7" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">LLA / ULA at +0.25</text>
        </g>
        <g transform="translate(12, 124)">
          <rect x="0" y="0" width="12" height="9" fill="#10B981" opacity="0.3" />
          <text x="18" y="8" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">target +/- 5 mmHg</text>
        </g>

        <line x1="12" y1="146" x2="174" y2="146" stroke="#2a3a55" strokeWidth="1" />
        <text x="12" y="164" fontFamily="Consolas, monospace" fontSize="9.5" fontWeight="700" fill="#FCD34D">
          NON-FITTABLE
        </text>
        <text x="12" y="180" fontFamily="Segoe UI, sans-serif" fontSize="9.5" fill="#FFFFFF">A flat curve or unclear</text>
        <text x="12" y="194" fontFamily="Segoe UI, sans-serif" fontSize="9.5" fill="#FFFFFF">vertex means CPPopt is</text>
        <text x="12" y="208" fontFamily="Segoe UI, sans-serif" fontSize="9.5" fill="#FFFFFF">not fittable; revert to</text>
        <text x="12" y="222" fontFamily="Segoe UI, sans-serif" fontSize="9.5" fill="#FFFFFF">the age-based CPP target.</text>
        <text x="12" y="240" fontFamily="Consolas, monospace" fontSize="8.5" fontStyle="italic" fill="#94A3B8">Some authors use +0.30.</text>
      </g>

      <text x={W / 2} y={H - 2} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu schematic · Steiner 2002 · Aries 2012 · Sorrentino 2012 (+0.25) · adult severe-TBI values
      </text>
    </svg>
  );
}
