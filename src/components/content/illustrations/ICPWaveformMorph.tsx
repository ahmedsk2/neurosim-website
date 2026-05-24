/**
 * ICP waveform P1 / P2 / P3 morphology, three compliance states with
 * shared y-axis, peak labels with leader lines, RAP / amplitude metrics.
 *
 * Original schematic for MNM-Edu, derived from standard ICP-pulse-morphology
 * physiology (P1 percussion / P2 tidal / P3 dicrotic).
 */
export function ICPWaveformMorph() {
  const W = 720;
  const H = 480;

  /** Build a Gaussian-sum cycle for the three peaks. */
  const cycle = (p1: number, p2: number, p3: number, sigma = 0.05) => {
    const phases = [0.12, 0.36, 0.62];
    const N = 220;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const v =
        p1 * Math.exp(-((t - phases[0]!) ** 2) / (2 * sigma * sigma)) +
        p2 * Math.exp(-((t - phases[1]!) ** 2) / (2 * sigma * sigma)) +
        p3 * Math.exp(-((t - phases[2]!) ** 2) / (2 * sigma * sigma));
      pts.push({ x: t, y: v });
    }
    return pts;
  };

  const drawWave = (
    p1: number,
    p2: number,
    p3: number,
    ox: number,
    oy: number,
    w: number,
    h: number,
    yMax: number,
  ) => {
    const pts = cycle(p1, p2, p3);
    return pts
      .map((p, i) => {
        const px = ox + p.x * w;
        const py = oy + h - (p.y / yMax) * h;
        return `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`;
      })
      .join(' ');
  };

  const cols = [
    {
      label: 'NORMAL',
      subtitle: 'P1 > P2 > P3',
      weights: { p1: 1.0, p2: 0.6, p3: 0.4 },
      x: 50,
      color: '#10B981',
      bg: '#0F2E22',
      amp: '~ 4–6 mmHg',
      rap: 'RAP < 0.3',
      desc: 'Compliant brain, buffer reserves intact.',
      action: 'Routine monitoring',
    },
    {
      label: 'LOW COMPLIANCE',
      subtitle: 'P2 ≈ P1',
      weights: { p1: 0.7, p2: 0.9, p3: 0.4 },
      x: 270,
      color: '#FCD34D',
      bg: '#3B2C0F',
      amp: '~ 6–8 mmHg',
      rap: 'RAP 0.6–0.9',
      desc: 'Compromised reserve, even at "normal" mean ICP.',
      action: 'Watch trend · review',
    },
    {
      label: 'EXHAUSTED',
      subtitle: 'P2 > P1 · rounded',
      weights: { p1: 0.5, p2: 1.0, p3: 0.4 },
      x: 490,
      color: '#EF4444',
      bg: '#3B0F1A',
      amp: '> 10 mmHg',
      rap: 'RAP collapsing',
      desc: 'Decompensating, plateau-wave risk.',
      action: 'Escalate immediately',
    },
  ];

  // Common y-max for visual fairness
  const yMax = 1.0;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="ICP waveform morphology, normal, low compliance, exhausted">
      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        ICP WAVEFORM · COMPLIANCE STATES
      </text>
      <text x={W / 2} y={48} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10.5" fill="#94A3B8">
        Same mean ICP, three different physiological states, the morphology is the diagnosis
      </text>

      {cols.map((col) => (
        <g key={col.label}>
          {/* Card background */}
          <rect x={col.x} y="70" width="180" height="320" rx="6" fill={col.bg} stroke={col.color} strokeWidth="1.4" />
          <rect x={col.x} y="70" width="180" height="6" fill={col.color} />

          {/* Title */}
          <text x={col.x + 90} y="98" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill={col.color} letterSpacing="2">
            {col.label}
          </text>
          <text x={col.x + 90} y="114" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fill={col.color}>
            {col.subtitle}
          </text>

          {/* Mini grid for waveform */}
          <rect x={col.x + 14} y="130" width="152" height="100" fill="#152238" stroke="#2a3a55" strokeWidth="0.7" rx="3" />
          {/* Horizontal grid */}
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1={col.x + 14} y1={130 + g * 100} x2={col.x + 166} y2={130 + g * 100} stroke="#1E293B" strokeWidth="0.6" />
          ))}

          {/* Waveform */}
          <path
            d={drawWave(col.weights.p1, col.weights.p2, col.weights.p3, col.x + 14, 130, 152, 100, yMax)}
            stroke={col.color}
            strokeWidth="2.2"
            fill="none"
          />
          {/* Subtle filled area under wave */}
          <path
            d={`${drawWave(col.weights.p1, col.weights.p2, col.weights.p3, col.x + 14, 130, 152, 100, yMax)} L ${col.x + 166} 230 L ${col.x + 14} 230 Z`}
            fill={col.color}
            opacity="0.12"
          />

          {/* Peak labels with markers */}
          {[
            { phase: 0.12, peak: col.weights.p1, label: 'P1' },
            { phase: 0.36, peak: col.weights.p2, label: 'P2' },
            { phase: 0.62, peak: col.weights.p3, label: 'P3' },
          ].map((p) => {
            const px = col.x + 14 + p.phase * 152;
            const py = 130 + 100 - (p.peak / yMax) * 100;
            return (
              <g key={p.label}>
                <circle cx={px} cy={py} r="3" fill={col.color} stroke="#0F1A2E" strokeWidth="1.5" />
                <text x={px} y={py - 8} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9.5" fontWeight="700" fill="#FFFFFF">
                  {p.label}
                </text>
              </g>
            );
          })}

          {/* Time axis */}
          <text x={col.x + 14} y="245" fontFamily="Consolas, monospace" fontSize="8" fill="#94A3B8">0</text>
          <text x={col.x + 166} y="245" textAnchor="end" fontFamily="Consolas, monospace" fontSize="8" fill="#94A3B8">~ 0.8 s (1 cardiac cycle)</text>

          {/* Metrics */}
          <text x={col.x + 14} y="270" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#5EEAD4">AMP</text>
          <text x={col.x + 50} y="270" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">{col.amp}</text>

          <text x={col.x + 14} y="288" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#5EEAD4">RAP</text>
          <text x={col.x + 50} y="288" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">{col.rap}</text>

          {/* Description */}
          <text x={col.x + 14} y="318" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
            {col.desc.split(',')[0]}
          </text>
          <text x={col.x + 14} y="332" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#94A3B8" fontStyle="italic">
            {col.desc.split(',')[1] || ''}
          </text>

          {/* Action */}
          <rect x={col.x + 14} y="350" width="152" height="26" rx="3" fill={col.color} opacity="0.15" />
          <text x={col.x + 90} y="367" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill={col.color}>
            {col.action}
          </text>
        </g>
      ))}

      {/* Bottom: Peak anatomy */}
      <g transform="translate(50, 410)">
        <rect width="620" height="58" rx="6" fill="#152238" stroke="#2a3a55" />
        <text x="14" y="22" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          PEAK ANATOMY
        </text>
        <text x="14" y="40" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          <tspan fontWeight="700">P1</tspan> percussion (arterial pulse · choroid plexus) ·
          <tspan fontWeight="700"> P2</tspan> tidal (cerebral compliance) ·
          <tspan fontWeight="700"> P3</tspan> dicrotic (venous)
        </text>
        <text x="14" y="55" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#94A3B8" fontStyle="italic">
          P2 dominance reflects loss of compliance, the arterial pulse is no longer absorbed by an elastic cranium.
        </text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · Czosnyka 2004 · waveform analysis principles
      </text>
    </svg>
  );
}
