/**
 * PRx pattern library: four canonical PRx traces over a 4-hour window.
 *   (a) intact      PRx near zero / slightly negative
 *   (b) impaired    PRx sustained above +0.25 for hours
 *   (c) oscillating PRx swinging 0 to 0.4 every 20 to 40 min
 *   (d) artefactual PRx jumping to extremes then back (reject from CPPopt fit)
 *
 * Threshold +0.25 (Sorrentino 2012); 3-tier interpretation (Czosnyka 1997).
 * Original schematic for MNM-Edu. Illustrative traces, not patient data.
 */
export function PrxTimeSeries() {
  const W = 720;
  const H = 448;

  // Deterministic pseudo-noise in [-0.5, 0.5] keyed on sample index (render-pure).
  const noise = (i: number) => ((i * 9301 + 49297) % 233280) / 233280 - 0.5;
  const clamp = (v: number) => Math.max(-1, Math.min(1, v));

  type Panel = {
    tag: string;
    title: string;
    note: string;
    color: string;
    fn: (t: number, i: number) => number;
  };

  const panels: Panel[] = [
    {
      tag: '(a)',
      title: 'INTACT',
      note: 'PRx < 0.05 · continue current CPP',
      color: '#10B981',
      fn: (t, i) => -0.05 + 0.12 * Math.sin((2 * Math.PI * t) / 1.3) + 0.05 * noise(i),
    },
    {
      tag: '(b)',
      title: 'IMPAIRED',
      note: 'PRx > 0.25 sustained · re-target CPPopt',
      color: '#EF4444',
      fn: (t, i) => 0.4 + 0.07 * Math.sin((2 * Math.PI * t) / 1.1) + 0.03 * noise(i),
    },
    {
      tag: '(c)',
      title: 'OSCILLATING',
      note: 'swings 0 to 0.4 every 20 to 40 min',
      color: '#FCD34D',
      fn: (t, i) => 0.2 + 0.2 * Math.sin((2 * Math.PI * t) / 0.5) + 0.03 * noise(i),
    },
    {
      tag: '(d)',
      title: 'ARTEFACTUAL',
      note: 'reject from the CPPopt fit',
      color: '#94A3B8',
      fn: (t, i) => {
        const spikes: [number, number][] = [
          [0.8, 0.95],
          [1.9, -0.88],
          [3.0, 0.92],
          [3.6, -0.8],
        ];
        for (const [c, v] of spikes) {
          if (Math.abs(t - c) < 0.045) return v;
        }
        return -0.02 + 0.05 * Math.sin((2 * Math.PI * t) / 1.4) + 0.03 * noise(i);
      },
    },
  ];

  const PW = 318;
  const PH = 150;
  const GAP = 16;
  const X0 = 44;
  const Y0 = 68;
  const positions = [
    { x: X0, y: Y0 },
    { x: X0 + PW + GAP, y: Y0 },
    { x: X0, y: Y0 + PH + GAP },
    { x: X0 + PW + GAP, y: Y0 + PH + GAP },
  ];

  const renderPanel = (p: Panel, pos: { x: number; y: number }, idx: number) => {
    const px = pos.x;
    const py = pos.y;
    const plotL = px + 34;
    const plotR = px + PW - 12;
    const plotT = py + 26;
    const plotB = py + PH - 20;
    const xScale = (t: number) => plotL + (t / 4) * (plotR - plotL);
    const yScale = (v: number) => plotB - ((v + 1) / 2) * (plotB - plotT);

    const N = 220;
    const pts: string[] = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 4;
      pts.push(`${xScale(t).toFixed(1)},${yScale(clamp(p.fn(t, i))).toFixed(1)}`);
    }

    return (
      <g key={idx}>
        <rect x={px} y={py} width={PW} height={PH} rx="6" fill="#0B1B33" stroke="#23344f" strokeWidth="1" />
        <text x={px + 12} y={py + 17} fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill={p.color} letterSpacing="1">
          {p.tag} {p.title}
        </text>
        {[1, 0, -1].map((v) => (
          <text key={v} x={px + 30} y={yScale(v) + 3} textAnchor="end" fontFamily="Consolas, monospace" fontSize="8" fill="#64748B">
            {v > 0 ? `+${v}` : `${v}`}
          </text>
        ))}
        {/* zero baseline */}
        <line x1={plotL} y1={yScale(0)} x2={plotR} y2={yScale(0)} stroke="#334155" strokeWidth="0.7" />
        {/* +0.25 impairment threshold */}
        <line x1={plotL} y1={yScale(0.25)} x2={plotR} y2={yScale(0.25)} stroke="#EF4444" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.85" />
        <text x={plotR} y={yScale(0.25) - 3} textAnchor="end" fontFamily="Consolas, monospace" fontSize="8" fill="#EF4444">
          +0.25
        </text>
        <polyline points={pts.join(' ')} fill="none" stroke={p.color} strokeWidth="1.7" />
        <text x={px + 12} y={py + PH - 6} fontFamily="Segoe UI, sans-serif" fontSize="8.5" fill="#94A3B8">
          {p.note}
        </text>
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block w-full h-auto"
      role="img"
      aria-label="Four-panel PRx pattern library: intact (near zero), impaired (sustained above 0.25), oscillating, and artefactual traces, each over a 4-hour window, with the +0.25 impairment threshold marked"
    >
      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        PRx PATTERN LIBRARY · FOUR CANONICAL TRACES
      </text>
      <text x={W / 2} y={48} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fill="#94A3B8">
        Each panel spans a 4-hour window · y-axis PRx from -1 to +1 · threshold +0.25 (Sorrentino 2012)
      </text>

      {panels.map((p, i) => renderPanel(p, positions[i]!, i))}

      {/* 3-tier legend strip */}
      <g transform={`translate(${X0}, 404)`}>
        <rect width={W - 2 * X0} height="30" rx="6" fill="#152238" stroke="#2a3a55" />
        <text x="14" y="19" fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill="#5EEAD4" letterSpacing="1">
          PRx 3-TIER
        </text>
        <text x="110" y="19" fontFamily="Segoe UI, sans-serif" fontSize="10.5" fill="#FFFFFF">
          &lt; 0.05 intact (teal) · 0.05 to 0.25 ambiguous · &gt; 0.25 impaired (red) · artefact spikes are rejected, not interpreted
        </text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · Sorrentino 2012 (+0.25 threshold) · Czosnyka 1997 (PRx)
      </text>
    </svg>
  );
}
