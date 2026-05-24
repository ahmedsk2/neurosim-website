/**
 * Layered autoregulation curves, healthy adult vs young child vs severe TBI
 * vs lost (pressure-passive). Demonstrates plateau width and slope changes.
 *
 * Original schematic for MNM-Edu, derived from textbook Lassen-curve physiology.
 */
export function AutoregLayered() {
  const W = 720;
  const H = 380;
  const margin = { top: 70, right: 250, bottom: 70, left: 70 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const xScale = (mmHg: number) => margin.left + (mmHg / 200) * plotW;
  const yScale = (cbf: number) => margin.top + plotH - (cbf / 100) * plotH;

  /** Build a Lassen-style curve as a smoothed polyline. */
  const curve = (lla: number, ula: number, plateau: number) => {
    const points: string[] = [];
    for (let mmHg = 0; mmHg <= 200; mmHg += 1) {
      let cbf: number;
      if (mmHg < lla) {
        cbf = (mmHg / lla) * plateau;
      } else if (mmHg < ula) {
        cbf = plateau;
      } else {
        cbf = plateau + ((mmHg - ula) / (200 - ula)) * 35;
      }
      points.push(`${xScale(mmHg).toFixed(1)},${yScale(cbf).toFixed(1)}`);
    }
    return points.join(' ');
  };

  // Plateau filled regions
  const plateauArea = (lla: number, ula: number, plateau: number, color: string) => {
    return (
      <path
        d={`M ${xScale(lla)} ${yScale(plateau)} L ${xScale(ula)} ${yScale(plateau)} L ${xScale(ula)} ${yScale(0)} L ${xScale(lla)} ${yScale(0)} Z`}
        fill={color}
        opacity="0.06"
      />
    );
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Lassen autoregulation curves: healthy adult, young child, severe TBI, and lost autoregulation">
      <defs>
        <marker id="alArrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#94A3B8" />
        </marker>
        <pattern id="alGrid" patternUnits="userSpaceOnUse" width={plotW / 8} height={plotH / 5}>
          <path d={`M 0 0 L 0 ${plotH / 5} M 0 0 L ${plotW / 8} 0`} stroke="#1E293B" strokeWidth="0.7" fill="none" />
        </pattern>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      {/* Title */}
      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        LASSEN CURVES · POPULATION → PATIENT
      </text>
      <text x={W / 2} y={48} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#94A3B8">
        Cerebral autoregulation flattens flow against blood-pressure swings, until it can&apos;t.
      </text>

      {/* Plot background grid */}
      <rect x={margin.left} y={margin.top} width={plotW} height={plotH} fill="url(#alGrid)" />

      {/* Plateau highlight, healthy adult */}
      {plateauArea(60, 150, 50, "#10B981")}

      {/* Axes */}
      <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#475569" strokeWidth="1.5" />
      <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#475569" strokeWidth="1.5" />

      {/* X-axis ticks + labels */}
      {[0, 25, 50, 75, 100, 125, 150, 175, 200].map((x) => (
        <g key={`x-${x}`}>
          <line x1={xScale(x)} y1={margin.top + plotH} x2={xScale(x)} y2={margin.top + plotH + 5} stroke="#475569" />
          <text x={xScale(x)} y={margin.top + plotH + 18} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fill="#94A3B8">
            {x}
          </text>
        </g>
      ))}
      <text x={margin.left + plotW / 2} y={H - 18} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="12" fontWeight="700" fill="#5EEAD4">
        Mean arterial pressure (mmHg)
      </text>

      {/* Y-axis ticks + labels */}
      {[0, 25, 50, 75, 100].map((y) => (
        <g key={`y-${y}`}>
          <line x1={margin.left - 5} y1={yScale(y)} x2={margin.left} y2={yScale(y)} stroke="#475569" />
          <text x={margin.left - 10} y={yScale(y) + 3} textAnchor="end" fontFamily="Consolas, monospace" fontSize="10" fill="#94A3B8">
            {y}
          </text>
        </g>
      ))}
      <text x={20} y={margin.top + plotH / 2} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#5EEAD4" transform={`rotate(-90 20 ${margin.top + plotH / 2})`}>
        CBF (mL / 100 g / min)
      </text>

      {/* LLA / ULA reference markers (healthy adult) */}
      <g>
        <line x1={xScale(60)} y1={margin.top + plotH} x2={xScale(60)} y2={yScale(50)} stroke="#10B981" strokeWidth="0.6" strokeDasharray="2 2" />
        <line x1={xScale(150)} y1={margin.top + plotH} x2={xScale(150)} y2={yScale(50)} stroke="#10B981" strokeWidth="0.6" strokeDasharray="2 2" />
        <text x={xScale(60)} y={margin.top + 14} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#10B981">
          LLA 60
        </text>
        <text x={xScale(150)} y={margin.top + 14} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#10B981">
          ULA 150
        </text>
      </g>

      {/* Lost, pressure-passive linear */}
      <polyline
        points={Array.from({ length: 201 }, (_, i) => `${xScale(i).toFixed(1)},${yScale(i * 0.5).toFixed(1)}`).join(' ')}
        fill="none"
        stroke="#EF4444"
        strokeWidth="2"
        strokeDasharray="4 3"
        opacity="0.85"
      />

      {/* Severe TBI, narrowed, right-shifted */}
      <polyline
        points={curve(80, 130, 50)}
        fill="none"
        stroke="#FCD34D"
        strokeWidth="2.5"
        strokeDasharray="6 3"
      />

      {/* Young child, narrower plateau, lower LLA */}
      <polyline
        points={curve(45, 110, 50)}
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2"
      />

      {/* Healthy adult, gold-standard curve */}
      <polyline
        points={curve(60, 150, 50)}
        fill="none"
        stroke="#10B981"
        strokeWidth="3"
      />

      {/* Operating-point dots */}
      <circle cx={xScale(105)} cy={yScale(50)} r="3.5" fill="#10B981" stroke="#0F1A2E" strokeWidth="1" />
      <circle cx={xScale(40)} cy={yScale(50 * 40 / 80)} r="3.5" fill="#FCD34D" stroke="#0F1A2E" strokeWidth="1" />

      {/* Annotation: healthy operating, placed in upper empty area, leader vertical */}
      <line x1={xScale(105)} y1={yScale(50)} x2={xScale(105)} y2={yScale(85) + 14} stroke="#10B981" strokeWidth="0.8" strokeDasharray="3 2" />
      <text x={xScale(105)} y={yScale(85) - 4} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#10B981">healthy · on plateau</text>
      <text x={xScale(105)} y={yScale(85) + 12} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#10B981">CPP = 105</text>

      {/* Annotation: TBI low operating, placed in upper-left empty area */}
      <line x1={xScale(40)} y1={yScale(50 * 40 / 80)} x2={xScale(20)} y2={yScale(85) + 14} stroke="#FCD34D" strokeWidth="0.8" strokeDasharray="3 2" />
      <text x={xScale(20)} y={yScale(85) - 4} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#FCD34D">TBI · CPP 40</text>
      <text x={xScale(20)} y={yScale(85) + 12} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#FCD34D">below LLA → passive</text>

      {/* Right-side legend panel */}
      <g transform={`translate(${W - margin.right + 10}, ${margin.top - 10})`}>
        <rect x="0" y="0" width="230" height="290" rx="6" fill="#152238" stroke="#2a3a55" />

        <text x="115" y="20" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          PROFILES
        </text>

        <g transform="translate(12, 38)">
          <line x1="0" y1="0" x2="22" y2="0" stroke="#10B981" strokeWidth="3" />
          <text x="30" y="4" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#10B981">Healthy adult</text>
          <text x="30" y="18" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">LLA 60 · ULA 150 · 90-mmHg plateau</text>
        </g>

        <g transform="translate(12, 72)">
          <line x1="0" y1="0" x2="22" y2="0" stroke="#3B82F6" strokeWidth="2.5" />
          <text x="30" y="4" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#3B82F6">Young child</text>
          <text x="30" y="18" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">LLA 45 · ULA 110 · 65-mmHg plateau</text>
        </g>

        <g transform="translate(12, 106)">
          <line x1="0" y1="0" x2="22" y2="0" stroke="#FCD34D" strokeWidth="2.5" strokeDasharray="6 3" />
          <text x="30" y="4" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#FCD34D">Severe TBI</text>
          <text x="30" y="18" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">LLA 80 · ULA 130 · 50-mmHg plateau</text>
          <text x="30" y="30" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">narrowed + right-shifted</text>
        </g>

        <g transform="translate(12, 154)">
          <line x1="0" y1="0" x2="22" y2="0" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
          <text x="30" y="4" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#EF4444">Lost (passive)</text>
          <text x="30" y="18" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">CBF tracks MAP linearly</text>
        </g>

        <line x1="12" y1="190" x2="218" y2="190" stroke="#2a3a55" strokeWidth="1" />

        <text x="115" y="208" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          BEDSIDE INDICES
        </text>

        <text x="12" y="226" fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill="#FFFFFF">PRx</text>
        <text x="50" y="226" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">· invasive (MAP↔ICP slow)</text>

        <text x="12" y="244" fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill="#FFFFFF">Mx</text>
        <text x="50" y="244" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">· TCD (MAP↔MFV)</text>

        <text x="12" y="262" fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill="#FFFFFF">ORx/COx</text>
        <text x="60" y="262" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">· NIRS (MAP↔rSO₂)</text>

        <text x="12" y="280" fontFamily="Segoe UI, sans-serif" fontSize="9" fill="#94A3B8" fontStyle="italic">
          All sample the slow-wave layer.
        </text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · derived from Lassen 1959 + pediatric extensions
      </text>
    </svg>
  );
}
