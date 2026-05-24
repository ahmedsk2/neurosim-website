/**
 * SSEP signal pathway, body silhouette showing median nerve at wrist,
 * brachial plexus, dorsal columns, brainstem nuclei, thalamus, cortex,
 * with latency annotations and a sample N20 trace.
 *
 * Original schematic for MNM-Edu, derived from standard SSEP neurophysiology.
 */
export function EvokedPotentialPathway() {
  const W = 720;
  const H = 480;

  // SSEP trace mock (P9 → N13 → P14 → N20)
  const ssepPath = (() => {
    const N = 200;
    const pts: string[] = [];
    for (let i = 0; i < N; i++) {
      const ms = (i / N) * 30; // 0-30 ms
      let v = 0;
      v += 8 * Math.exp(-((ms - 9) ** 2) / 1.5); // P9
      v += -10 * Math.exp(-((ms - 13) ** 2) / 1.5); // N13
      v += 6 * Math.exp(-((ms - 14) ** 2) / 1.0); // P14
      v += -16 * Math.exp(-((ms - 20) ** 2) / 1.5); // N20 (negative-down convention but we plot up=positive)
      const x = 380 + (ms / 30) * 280;
      const y = 380 - v;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  })();

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="SSEP signal pathway from median nerve at wrist to N20 cortical response">
      <defs>
        <linearGradient id="epBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBC8C8" />
          <stop offset="100%" stopColor="#D88090" />
        </linearGradient>
        <marker id="epArr" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#5EEAD4" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        SSEP · MEDIAN-NERVE PATHWAY
      </text>

      {/* ─── Left: body silhouette + pathway ─── */}
      <g transform="translate(40, 60)">
        {/* Head */}
        <ellipse cx="135" cy="50" rx="42" ry="38" fill="url(#epBody)" stroke="#7A4858" strokeWidth="1.2" />

        {/* Neck */}
        <rect x="120" y="85" width="30" height="22" fill="url(#epBody)" stroke="#7A4858" strokeWidth="1" />

        {/* Torso */}
        <path d="M 95 107 Q 105 100 135 100 Q 165 100 175 107 L 195 250 Q 195 280 175 285 L 95 285 Q 75 280 75 250 Z" fill="url(#epBody)" stroke="#7A4858" strokeWidth="1.2" />

        {/* Right arm (fully drawn, the stim side) */}
        <path d="M 175 117 L 230 145 L 280 195 L 295 245 L 285 280" fill="none" stroke="#7A4858" strokeWidth="14" strokeLinecap="round" />
        <path d="M 175 117 L 230 145 L 280 195 L 295 245 L 285 280" fill="none" stroke="url(#epBody)" strokeWidth="11" strokeLinecap="round" />

        {/* Hand */}
        <ellipse cx="280" cy="290" rx="14" ry="10" fill="url(#epBody)" stroke="#7A4858" strokeWidth="1" />

        {/* Median nerve (yellow, running through arm) */}
        <path d="M 175 117 L 230 145 L 280 195 L 295 245 L 285 280" fill="none" stroke="#FCD34D" strokeWidth="2" strokeDasharray="3 2" />

        {/* Stim electrode at wrist */}
        <g transform="translate(285, 280)">
          <rect x="-8" y="-3" width="16" height="6" fill="#5EEAD4" stroke="#0F1A2E" strokeWidth="0.7" />
          <text x="0" y="-10" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#5EEAD4">STIM</text>
          <text x="0" y="22" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fill="#94A3B8">~ 25 mA · 0.2 ms</text>
        </g>

        {/* Pathway nodes, Erb's point, cervical, brainstem, thalamus, cortex */}
        {[
          { cx: 215, cy: 122, label: 'P9', name: "Erb's point", lat: '~ 9 ms', color: '#FCD34D' },
          { cx: 152, cy: 110, label: 'N13', name: 'cervical cord', lat: '~ 13 ms', color: '#FCD34D' },
          { cx: 145, cy: 78, label: 'P14', name: 'brainstem', lat: '~ 14 ms', color: '#FCD34D' },
          { cx: 138, cy: 50, label: 'N20', name: 'cortex (CP)', lat: '~ 20 ms', color: '#EF4444' },
        ].map((node) => (
          <g key={node.label}>
            <circle cx={node.cx} cy={node.cy} r="9" fill={node.color} stroke="#0F1A2E" strokeWidth="1.5" />
            <text x={node.cx} y={node.cy + 3} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fontWeight="700" fill="#0F1A2E">
              {node.label}
            </text>
          </g>
        ))}

        {/* Pathway arrows */}
        <path d="M 285 280 Q 250 245 230 200 Q 220 160 218 130" stroke="#5EEAD4" strokeWidth="1.4" fill="none" markerEnd="url(#epArr)" />
        <line x1="208" y1="122" x2="160" y2="113" stroke="#5EEAD4" strokeWidth="1.4" markerEnd="url(#epArr)" />
        <line x1="150" y1="103" x2="146" y2="86" stroke="#5EEAD4" strokeWidth="1.4" markerEnd="url(#epArr)" />
        <line x1="143" y1="71" x2="139" y2="58" stroke="#5EEAD4" strokeWidth="1.4" markerEnd="url(#epArr)" />

        {/* Recording electrodes, Erb, Cv, CP */}
        <text x="240" y="118" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">{"Erb's"}</text>
        <text x="20" y="113" textAnchor="start" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">cervical</text>
        <text x="20" y="80" textAnchor="start" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">brainstem</text>
        <text x="20" y="50" textAnchor="start" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#EF4444">CP3/CP4</text>
      </g>

      {/* ─── Right: SSEP trace ─── */}
      <g transform="translate(0, 0)">
        <text x="520" y="100" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">
          SSEP TRACE (averaged ~ 200 trials)
        </text>

        {/* Plot box */}
        <rect x="380" y="120" width="280" height="280" fill="#152238" stroke="#2a3a55" strokeWidth="0.7" rx="3" />

        {/* Time axis */}
        <line x1="380" y1="380" x2="660" y2="380" stroke="#475569" strokeWidth="1" />
        {[0, 5, 10, 15, 20, 25, 30].map((ms) => (
          <g key={ms}>
            <line x1={380 + (ms / 30) * 280} y1="380" x2={380 + (ms / 30) * 280} y2="385" stroke="#475569" />
            <text x={380 + (ms / 30) * 280} y="396" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
              {ms}
            </text>
          </g>
        ))}
        <text x="520" y="416" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">
          ms post-stimulus
        </text>

        {/* Y axis */}
        <line x1="380" y1="120" x2="380" y2="380" stroke="#475569" strokeWidth="1" />
        <text x="372" y="126" textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">+</text>
        <text x="372" y="384" textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">−</text>

        {/* Zero line */}
        <line x1="380" y1="380" x2="660" y2="380" stroke="#1E293B" strokeWidth="0.5" />

        {/* Trace */}
        <polyline points={ssepPath} stroke="#5EEAD4" strokeWidth="1.8" fill="none" />

        {/* Peak labels on trace */}
        {[
          { ms: 9, label: 'P9', dy: -10, color: '#FCD34D' },
          { ms: 13, label: 'N13', dy: 18, color: '#FCD34D' },
          { ms: 14, label: 'P14', dy: -10, color: '#FCD34D' },
          { ms: 20, label: 'N20', dy: 24, color: '#EF4444' },
        ].map((p) => (
          <g key={p.label}>
            <line
              x1={380 + (p.ms / 30) * 280}
              y1="120"
              x2={380 + (p.ms / 30) * 280}
              y2="380"
              stroke={p.color}
              strokeWidth="0.5"
              strokeDasharray="2 2"
              opacity="0.5"
            />
            <text
              x={380 + (p.ms / 30) * 280}
              y={p.dy < 0 ? 130 + p.dy : 365 + p.dy}
              textAnchor="middle"
              fontFamily="Consolas, monospace"
              fontSize="10"
              fontWeight="700"
              fill={p.color}
            >
              {p.label}
            </text>
          </g>
        ))}
      </g>

      {/* Bottom: prognostic use box */}
      <g transform="translate(40, 420)">
        <rect width="640" height="50" rx="6" fill="#152238" stroke="#EF4444" strokeWidth="1" />
        <text x="14" y="20" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#EF4444" letterSpacing="2">
          PROGNOSTIC USE · POST-ARREST COMA
        </text>
        <text x="14" y="38" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          Bilaterally absent N20 at 24–72 h (after warming, off NMB) is highly specific for poor outcome, resistant to sedation + hypothermia.
        </text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · standard median-nerve SSEP neurophysiology
      </text>
    </svg>
  );
}
