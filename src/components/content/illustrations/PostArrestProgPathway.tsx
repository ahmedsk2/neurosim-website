/**
 * Post-arrest pediatric prognostication timeline, multimodal swim-lanes
 * across hour-0 → day-7, with each modality contributing at specific
 * time-points and a convergence rule at 72 h + MRI at day 4–7.
 *
 * Original schematic for MNM-Edu, derived from pediatric post-arrest
 * multimodal prognostication consensus.
 */
export function PostArrestProgPathway() {
  const W = 720;
  const H = 460;
  const margin = { top: 80, bottom: 60, left: 120, right: 30 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const timepoints = [
    { x: 80, label: '0 h', sub: 'ROSC' },
    { x: 200, label: '24 h', sub: 'Cooling' },
    { x: 330, label: '48 h', sub: 'Rewarming' },
    { x: 450, label: '72 h', sub: 'Exam' },
    { x: 560, label: 'd 4–7', sub: 'MRI' },
  ];

  const lanes = [
    {
      y: 130,
      label: 'aEEG / cEEG',
      color: '#5EEAD4',
      icon: '〰',
      events: [
        { x: 80, info: 'Background continuity', strong: true },
        { x: 200, info: '6-h pattern (Toet)', strong: true },
        { x: 330, info: 'Watch rewarm seizures', strong: false },
        { x: 450, info: 'Reactivity test', strong: true },
      ],
    },
    {
      y: 180,
      label: 'NIRS bilateral',
      color: '#5EEAD4',
      icon: '◉',
      events: [
        { x: 80, info: 'Bilateral baseline', strong: true },
        { x: 200, info: 'SafeBoosC band', strong: true },
        { x: 330, info: 'Drop on rewarm?', strong: false },
      ],
    },
    {
      y: 230,
      label: 'Pupillometry NPi',
      color: '#5EEAD4',
      icon: '◎',
      events: [
        { x: 80, info: 'Q4h', strong: false },
        { x: 200, info: 'Trend NPi', strong: false },
        { x: 450, info: 'NPi on warming', strong: true },
      ],
    },
    {
      y: 280,
      label: 'SSEP / BAER',
      color: '#FCD34D',
      icon: '⚡',
      events: [
        { x: 450, info: 'N20 absence', strong: true },
      ],
    },
    {
      y: 330,
      label: 'MRI',
      color: '#EF4444',
      icon: '◈',
      events: [
        { x: 560, info: 'DWI / structural', strong: true },
      ],
    },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Post-arrest pediatric prognostication multimodal timeline">
      <defs>
        <linearGradient id="ppLane" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1E293B" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        POST-ARREST · PEDIATRIC PROGNOSTICATION TIMELINE
      </text>
      <text x={W / 2} y={48} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10.5" fill="#94A3B8">
        No single modality decides, convergence at 72 h + MRI at d 4–7 is the strongest signal
      </text>

      {/* Time axis */}
      <line x1={margin.left - 30} y1="80" x2={W - margin.right} y2="80" stroke="#475569" strokeWidth="1.5" />

      {timepoints.map((t) => (
        <g key={t.label} transform={`translate(${margin.left + t.x}, 0)`}>
          <line x1="0" y1="74" x2="0" y2="86" stroke="#475569" strokeWidth="1.5" />
          <line x1="0" y1="86" x2="0" y2={H - margin.bottom - 30} stroke="#1E293B" strokeWidth="0.6" strokeDasharray="2 2" />
          <text x="0" y="68" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#FCD34D">
            {t.label}
          </text>
          <text x="0" y="100" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="9" fill="#94A3B8">
            {t.sub}
          </text>
        </g>
      ))}

      {/* Modality lanes */}
      {lanes.map((lane) => (
        <g key={lane.label}>
          {/* Lane label */}
          <text x={margin.left - 8} y={lane.y + 4} textAnchor="end" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill={lane.color}>
            {lane.label}
          </text>
          <text x={margin.left - 8} y={lane.y + 18} textAnchor="end" fontFamily="Consolas, monospace" fontSize="14" fill={lane.color} opacity="0.7">
            {lane.icon}
          </text>

          {/* Lane background bar */}
          <line x1={margin.left} y1={lane.y} x2={W - margin.right - 10} y2={lane.y} stroke={lane.color} strokeWidth="22" opacity="0.08" />

          {/* Tick events */}
          {lane.events.map((e) => (
            <g key={`${lane.label}-${e.x}`} transform={`translate(${margin.left + e.x}, ${lane.y})`}>
              <circle r="7" fill={lane.color} stroke="#0F1A2E" strokeWidth="2.5" />
              {e.strong && (
                <circle r="11" fill="none" stroke={lane.color} strokeWidth="1.5" opacity="0.5" />
              )}
              <text x="0" y="-15" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="9" fontWeight={e.strong ? '700' : '400'} fill="#FFFFFF">
                {e.info}
              </text>
            </g>
          ))}
        </g>
      ))}

      {/* Bottom: Convergence rule */}
      <g transform="translate(40, 380)">
        <rect width="640" height="60" rx="6" fill="#152238" stroke="#5EEAD4" strokeWidth="1" />
        <text x="14" y="22" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          CONVERGENCE RULE
        </text>
        <text x="14" y="40" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          Two or more modalities pointing the same way at 72 h carry far more weight than any single number.
        </text>
        <text x="14" y="55" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          MRI at day 4–7 anchors the picture; clinical exam at 72 h remains the cornerstone.
        </text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · pediatric multimodal post-arrest prognostication consensus
      </text>
    </svg>
  );
}
