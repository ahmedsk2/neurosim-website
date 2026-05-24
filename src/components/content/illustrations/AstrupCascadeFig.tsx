/**
 * Astrup ischemic cascade, vertical CBF axis with EEG morphology, cellular
 * events, and reversibility windows. Includes mini EEG traces per band and
 * a CBF "thermometer" gradient showing the path from normal to infarct.
 *
 * Original schematic for MNM-Edu, physiology framework from Astrup, Siesjö,
 * and Symon's 1981 ischemic-thresholds work.
 */
export function AstrupCascadeFig() {
  const W = 720;
  const H = 500;

  const bands = [
    {
      y: 70,
      cbf: '≥ 50',
      label: 'NORMAL',
      desc: 'Synapses + ion pumps active',
      color: '#10B981',
      eeg: 'alpha + beta',
      cell: 'Oxidative metabolism',
      reversibility: 'Fully reversible',
      eegTrace: 'fast',
    },
    {
      y: 138,
      cbf: '35–49',
      label: 'DROWSY',
      desc: 'Mild slowing; protein syn ↓',
      color: '#10B981',
      eeg: 'theta dominant',
      cell: 'Protein synthesis ↓',
      reversibility: 'Fully reversible',
      eegTrace: 'medium',
    },
    {
      y: 206,
      cbf: '25–34',
      label: 'SLOW DELTA',
      desc: 'Glycolysis ↑ · lactate ↑',
      color: '#FCD34D',
      eeg: 'delta dominant',
      cell: 'Anaerobic glycolysis',
      reversibility: 'Reversible · hours',
      eegTrace: 'slow',
    },
    {
      y: 274,
      cbf: '15–24',
      label: 'SUPPRESSED',
      desc: 'Na/K-ATPase failing',
      color: '#F59E0B',
      eeg: 'low voltage',
      cell: 'Glutamate spike',
      reversibility: 'Tight window · min',
      eegTrace: 'low',
    },
    {
      y: 342,
      cbf: '< 15',
      label: 'ISOELECTRIC',
      desc: 'Anoxic depol. · cell death',
      color: '#EF4444',
      eeg: 'flat',
      cell: 'Mitochondrial collapse',
      reversibility: 'Irreversible',
      eegTrace: 'flat',
    },
  ];

  /** Generate a small EEG trace polyline by morphology. */
  const traceFor = (kind: string, x0: number, y0: number, w: number) => {
    const N = 80;
    const points: string[] = [];
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const x = x0 + (i / N) * w;
      let amp = 0;
      switch (kind) {
        case 'fast':
          amp = 6 * Math.sin(t * 8) + 3 * Math.sin(t * 24);
          break;
        case 'medium':
          amp = 6 * Math.sin(t * 4) + 2 * Math.sin(t * 12);
          break;
        case 'slow':
          amp = 9 * Math.sin(t * 2);
          break;
        case 'low':
          amp = 2 * Math.sin(t * 3);
          break;
        case 'flat':
        default:
          amp = 0.6 * Math.sin(t * 1);
      }
      points.push(`${x.toFixed(1)},${(y0 + amp).toFixed(1)}`);
    }
    return points.join(' ');
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Astrup ischemic cascade, CBF thresholds, EEG morphology, cellular events, reversibility">
      <defs>
        <linearGradient id="acGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="30%" stopColor="#FCD34D" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
        <marker id="acArrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#94A3B8" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        ASTRUP ISCHEMIC CASCADE
      </text>
      <text x={W / 2} y={48} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#94A3B8">
        Synaptic activity fails first; cell death follows. EEG is the earliest bedside signal.
      </text>

      {/* CBF thermometer gradient on the far left */}
      <rect x="32" y="70" width="20" height="340" fill="url(#acGradient)" rx="3" />
      <text x="42" y="64" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">CBF</text>
      <text x="42" y="424" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">↓</text>

      {bands.map((b, i) => (
        <g key={i}>
          {/* Tier rectangle */}
          <rect x="70" y={b.y} width="80" height="56" fill={b.color} opacity="0.78" rx="3" />
          <rect x="70" y={b.y} width="6" height="56" fill={b.color} />
          <text x="115" y={b.y + 22} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="13" fontWeight="700" fill="#0F1A2E">
            {b.cbf}
          </text>
          <text x="115" y={b.y + 38} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fill="#0F1A2E">
            mL/100g/min
          </text>

          {/* Label + desc */}
          <text x="170" y={b.y + 18} fontFamily="Segoe UI, sans-serif" fontSize="13" fontWeight="700" fill={b.color} letterSpacing="1">
            {b.label}
          </text>
          <text x="170" y={b.y + 34} fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
            {b.desc}
          </text>

          {/* Mini EEG trace */}
          <rect x="365" y={b.y + 8} width="120" height="40" fill="#152238" stroke="#2a3a55" strokeWidth="0.7" rx="2" />
          <polyline
            points={traceFor(b.eegTrace, 370, b.y + 28, 110)}
            fill="none"
            stroke={b.color}
            strokeWidth="1.3"
          />
          <text x="425" y={b.y + 6} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fill="#94A3B8">
            EEG: {b.eeg}
          </text>

          {/* Cellular */}
          <text x="500" y={b.y + 22} fontFamily="Consolas, monospace" fontSize="10" fill="#94A3B8">
            <tspan fontWeight="700" fill="#5EEAD4">cells:</tspan> {b.cell}
          </text>

          {/* Reversibility */}
          <text x="500" y={b.y + 38} fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill={b.color}>
            {b.reversibility}
          </text>
        </g>
      ))}

      {/* Penumbra bracket */}
      <g>
        <path d={`M 700 195 L 712 195 L 712 296 L 700 296`} fill="none" stroke="#FCD34D" strokeWidth="1.5" />
        <text x="708" y="246" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#FCD34D" transform="rotate(90 708 246)">
          PENUMBRA
        </text>
      </g>

      {/* Bottom take-away */}
      <rect x="60" y="425" width="600" height="60" rx="6" fill="#152238" stroke="#2a3a55" />
      <text x="80" y="446" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        CLINICAL TAKEAWAYS
      </text>
      <text x="80" y="464" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
        • EEG slowing precedes cell death, qEEG ADR detects DCI hours before clinical exam in SAH.
      </text>
      <text x="80" y="478" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
        • The penumbra (CBF 15–34) is salvageable, restoring perfusion reverses ischaemia within minutes-to-hours.
      </text>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · Astrup / Siesjö / Symon 1981 · Hossmann 1994
      </text>
    </svg>
  );
}
