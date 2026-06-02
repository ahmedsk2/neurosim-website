/**
 * CPPopt outcome dose-response (Aries 2012, Fig 3): six-month outcome versus
 * SIGNED deviation of median CPP from CPPopt. Outcome is best near CPPopt and
 * falls in BOTH directions, an asymmetrical relationship: deviation below CPPopt
 * tracks rising mortality, deviation above CPPopt tracks rising severe disability.
 *
 * NB this is the paper's Figure 3 (outcome vs deviation). The PRx-vs-CPP curve is
 * the paper's Figure 2 and is a separate figure (prx-vs-cpp-ucurve).
 *
 * Original schematic for MNM-Edu. Adult severe-TBI cohort (n = 299), cohort CPPopt
 * approx 75 to 80 mmHg. Representative heights, not digitised bars.
 */
export function CppoptDoseResponse() {
  const W = 720;
  const H = 400;
  const margin = { top: 64, right: 214, bottom: 64, left: 66 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const xMin = -15;
  const xMax = 15;
  const yMin = 0;
  const yMax = 60;
  const xScale = (d: number) => margin.left + ((d - xMin) / (xMax - xMin)) * plotW;
  const yScale = (p: number) => margin.top + plotH - ((p - yMin) / (yMax - yMin)) * plotH;

  // Asymmetrical hill: favourable-outcome % peaks just above CPPopt, falls both ways.
  const PEAK_X = 2;
  const PEAK_Y = 47;
  const aLeft = 0.075;
  const aRight = 0.085;
  const fav = (d: number) => {
    const a = d < PEAK_X ? aLeft : aRight;
    return Math.max(yMin, PEAK_Y - a * (d - PEAK_X) ** 2);
  };

  const curve: string[] = [];
  for (let d = xMin; d <= xMax + 1e-6; d += 0.5) {
    curve.push(`${xScale(d).toFixed(1)},${yScale(fav(d)).toFixed(1)}`);
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block w-full h-auto"
      role="img"
      aria-label="CPPopt outcome dose-response from Aries 2012 Figure 3. The horizontal axis is median CPP minus CPPopt in mmHg from minus 15 to plus 15; the vertical axis is six-month favourable GOS percentage. Outcome peaks near CPPopt and falls in both directions: below CPPopt tracks rising mortality, above CPPopt tracks rising severe disability."
    >
      <defs>
        <marker id="drArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="#FFFFFF" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#081224" />

      <text x={W / 2} y={26} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        OUTCOME vs DEVIATION FROM CPPopt
      </text>
      <text x={W / 2} y={46} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10.5" fill="#94A3B8">
        Aries 2012 Fig 3 · best near CPPopt · worse in BOTH directions (asymmetrical)
      </text>

      {/* optimal band 0 to +5 */}
      <rect x={xScale(0)} y={margin.top} width={xScale(5) - xScale(0)} height={plotH} fill="#10B981" opacity="0.12" />

      {/* Axes */}
      <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#475569" strokeWidth="1.4" />
      <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#475569" strokeWidth="1.4" />

      {/* X ticks */}
      {[-15, -10, -5, 0, 5, 10, 15].map((x) => (
        <g key={`x-${x}`}>
          <line x1={xScale(x)} y1={margin.top + plotH} x2={xScale(x)} y2={margin.top + plotH + 5} stroke="#475569" />
          <text x={xScale(x)} y={margin.top + plotH + 17} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9.5" fill="#94A3B8">
            {x > 0 ? `+${x}` : `${x}`}
          </text>
        </g>
      ))}
      <text x={margin.left + plotW / 2} y={H - 16} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="12" fontWeight="700" fill="#5EEAD4">
        Median CPP - CPPopt (mmHg)
      </text>

      {/* Y ticks */}
      {[0, 20, 40, 60].map((y) => (
        <g key={`y-${y}`}>
          <line x1={margin.left - 5} y1={yScale(y)} x2={margin.left} y2={yScale(y)} stroke="#475569" />
          <text x={margin.left - 9} y={yScale(y) + 3} textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
            {y}
          </text>
        </g>
      ))}
      <text x={20} y={margin.top + plotH / 2} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#5EEAD4" transform={`rotate(-90 20 ${margin.top + plotH / 2})`}>
        6-month favourable GOS (%)
      </text>

      {/* CPPopt centre line */}
      <line x1={xScale(0)} y1={margin.top} x2={xScale(0)} y2={margin.top + plotH} stroke="#10B981" strokeWidth="0.9" strokeDasharray="3 2" opacity="0.8" />
      <text x={xScale(0)} y={margin.top - 5} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#10B981">
        at CPPopt
      </text>

      {/* favourable-outcome curve */}
      <polyline points={curve.join(' ')} fill="none" stroke="#5EEAD4" strokeWidth="3.2" />

      {/* peak marker */}
      <circle cx={xScale(PEAK_X)} cy={yScale(PEAK_Y)} r="4" fill="#10B981" stroke="#081224" strokeWidth="1.2" />

      {/* left arm: rising mortality */}
      <line x1={xScale(-6)} y1={yScale(fav(-6)) + 10} x2={xScale(-12.5)} y2={yScale(fav(-12.5)) + 10} stroke="#FFFFFF" strokeWidth="1.6" markerEnd="url(#drArrow)" />
      <text x={xScale(-9.5)} y={yScale(fav(-11)) + 30} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#EF4444">
        below CPPopt:
      </text>
      <text x={xScale(-9.5)} y={yScale(fav(-11)) + 44} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#EF4444">
        rising mortality
      </text>

      {/* right arm: rising severe disability */}
      <line x1={xScale(7)} y1={yScale(fav(7)) + 10} x2={xScale(12.5)} y2={yScale(fav(12.5)) + 10} stroke="#FFFFFF" strokeWidth="1.6" markerEnd="url(#drArrow)" />
      <text x={xScale(9.5)} y={yScale(fav(11)) + 30} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#FCD34D">
        above CPPopt:
      </text>
      <text x={xScale(9.5)} y={yScale(fav(11)) + 44} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#FCD34D">
        rising severe disability
      </text>

      {/* Right legend panel */}
      <g transform={`translate(${W - margin.right + 14}, ${margin.top - 6})`}>
        <rect x="0" y="0" width="188" height="248" rx="6" fill="#152238" stroke="#2a3a55" />
        <text x="94" y="20" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          THE ASYMMETRY
        </text>

        <text x="12" y="42" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">Outcome is best when</text>
        <text x="12" y="56" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">median CPP sits near the</text>
        <text x="12" y="70" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">individual CPPopt.</text>

        <g transform="translate(12, 86)">
          <rect x="0" y="0" width="12" height="9" rx="2" fill="#EF4444" />
          <text x="18" y="8" fontFamily="Consolas, monospace" fontSize="9.5" fontWeight="700" fill="#EF4444">left arm</text>
          <text x="0" y="24" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">CPP below CPPopt:</text>
          <text x="0" y="38" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">rising mortality.</text>
        </g>
        <g transform="translate(12, 140)">
          <rect x="0" y="0" width="12" height="9" rx="2" fill="#FCD34D" />
          <text x="18" y="8" fontFamily="Consolas, monospace" fontSize="9.5" fontWeight="700" fill="#FCD34D">right arm</text>
          <text x="0" y="24" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">CPP above CPPopt:</text>
          <text x="0" y="38" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">rising severe disability.</text>
        </g>

        <line x1="12" y1="196" x2="176" y2="196" stroke="#2a3a55" strokeWidth="1" />
        <text x="12" y="213" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">n = 299 · adult severe TBI</text>
        <text x="12" y="227" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">cohort CPPopt approx 75-80</text>
        <text x="12" y="241" fontFamily="Segoe UI, sans-serif" fontSize="8.5" fontStyle="italic" fill="#FCD34D">paediatric CPPopt is lower</text>
      </g>

      <text x={W / 2} y={H - 3} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu schematic · Aries 2012 (Fig 3) · 6-month GOS · adult severe TBI, paediatric CPPopt lower and age-dependent
      </text>
    </svg>
  );
}
