/**
 * ONSD transorbital ultrasound view, sector cone showing globe (anechoic),
 * optic nerve (hypoechoic), surrounding sheath (hyperechoic), and the
 * 3 mm-posterior measurement reference plane with caliper.
 *
 * Original schematic for MNM-Edu, derived from standard ONSD measurement
 * convention.
 */
export function ONSDUltrasound() {
  const W = 720;
  const H = 460;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Transorbital ONSD ultrasound view with caliper at 3 mm posterior to globe">
      <defs>
        <linearGradient id="onsdGel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F1A2E" />
        </linearGradient>
        <radialGradient id="onsdGlobe" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="#020617" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
        <pattern id="onsdNoise" patternUnits="userSpaceOnUse" width="3" height="3">
          <rect width="3" height="3" fill="#1E293B" />
          <circle cx="1.5" cy="1.5" r="0.4" fill="#475569" opacity="0.4" />
        </pattern>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        OPTIC NERVE SHEATH DIAMETER · TRANSORBITAL ULTRASOUND
      </text>

      {/* ─── Left: external view of probe on closed eye ─── */}
      <g transform="translate(50, 60)">
        <text x="120" y="14" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">
          PROBE PLACEMENT
        </text>

        {/* Forehead + closed eye area */}
        <path d="M 0 80 Q 30 25 130 20 Q 220 25 240 80 Q 240 130 220 160 Q 130 180 30 160 Q 0 130 0 80 Z" fill="#FBC8C8" stroke="#7A4858" strokeWidth="1.5" />

        {/* Eyebrow */}
        <path d="M 30 50 Q 80 38 130 45" fill="none" stroke="#3F2330" strokeWidth="3" />

        {/* Closed eyelid (with lashes) */}
        <ellipse cx="120" cy="98" rx="65" ry="12" fill="#E392A7" stroke="#7A4858" strokeWidth="1" />
        <path d="M 60 110 L 58 122" stroke="#3F2330" strokeWidth="0.8" />
        <path d="M 80 110 L 78 124" stroke="#3F2330" strokeWidth="0.8" />
        <path d="M 100 110 L 98 124" stroke="#3F2330" strokeWidth="0.8" />
        <path d="M 120 110 L 120 124" stroke="#3F2330" strokeWidth="0.8" />
        <path d="M 140 110 L 142 124" stroke="#3F2330" strokeWidth="0.8" />
        <path d="M 160 110 L 162 124" stroke="#3F2330" strokeWidth="0.8" />
        <path d="M 180 110 L 182 122" stroke="#3F2330" strokeWidth="0.8" />

        {/* Generous gel layer */}
        <rect x="60" y="86" width="120" height="6" fill="#5EEAD4" opacity="0.45" rx="3" />

        {/* Probe (linear) */}
        <rect x="60" y="60" width="120" height="30" rx="4" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.2" />
        <rect x="62" y="86" width="116" height="3" fill="#FCD34D" />
        <text x="120" y="78" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">
          LINEAR 10–18 MHz
        </text>

        {/* Probe cable */}
        <path d="M 60 60 Q 30 30 0 30" fill="none" stroke="#94A3B8" strokeWidth="2" />

        {/* Light-pressure indicator */}
        <text x="120" y="200" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#FCD34D" fontStyle="italic">
          generous gel · light pressure
        </text>
        <text x="120" y="214" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#EF4444" fontStyle="italic">
          do NOT depress globe
        </text>
      </g>

      {/* ─── Centre: Ultrasound sector view ─── */}
      <g transform="translate(310, 60)">
        <text x="180" y="14" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">
          B-MODE SECTOR VIEW
        </text>

        {/* Sector cone */}
        <path
          d="M 130 30 L 230 30 L 320 280 L 40 280 Z"
          fill="url(#onsdNoise)"
          stroke="#475569"
          strokeWidth="1.2"
        />

        {/* Probe footprint at top */}
        <rect x="130" y="22" width="100" height="10" fill="#FCD34D" />
        <text x="180" y="42" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fontWeight="700" fill="#0F1A2E">PROBE</text>

        {/* Vitreous (anechoic globe) */}
        <ellipse cx="180" cy="120" rx="80" ry="60" fill="url(#onsdGlobe)" stroke="#94A3B8" strokeWidth="1.2" />

        {/* Lens (hyperechoic anterior structure) */}
        <ellipse cx="180" cy="68" rx="22" ry="6" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="0.8" />
        <text x="180" y="60" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fill="#94A3B8">lens</text>

        {/* Posterior pole + disc */}
        <ellipse cx="180" cy="178" rx="12" ry="3" fill="#94A3B8" />

        <text x="180" y="125" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">vitreous</text>
        <text x="180" y="138" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fill="#94A3B8">(anechoic)</text>

        {/* Optic nerve (hypoechoic) */}
        <rect x="167" y="180" width="26" height="100" fill="#1E293B" stroke="#475569" strokeWidth="0.7" />

        {/* Optic nerve sheath, hyperechoic flanking lines */}
        <line x1="167" y1="180" x2="167" y2="280" stroke="#FCD34D" strokeWidth="2.5" />
        <line x1="193" y1="180" x2="193" y2="280" stroke="#FCD34D" strokeWidth="2.5" />

        {/* Reference line: 3 mm posterior to globe */}
        <line x1="120" y1="208" x2="240" y2="208" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 2" />
        <text x="98" y="212" textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#F59E0B">
          3 mm posterior
        </text>

        {/* Indicator from globe to reference */}
        <line x1="178" y1="178" x2="178" y2="208" stroke="#F59E0B" strokeWidth="1" />
        <text x="160" y="195" fontFamily="Consolas, monospace" fontSize="8" fill="#F59E0B">3 mm</text>

        {/* Caliper measurement at reference plane */}
        <line x1="167" y1="208" x2="193" y2="208" stroke="#5EEAD4" strokeWidth="3" />
        <line x1="167" y1="203" x2="167" y2="213" stroke="#5EEAD4" strokeWidth="3" />
        <line x1="193" y1="203" x2="193" y2="213" stroke="#5EEAD4" strokeWidth="3" />
        <text x="180" y="232" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="13" fontWeight="700" fill="#5EEAD4">
          ONSD = 5.4 mm
        </text>
        <text x="180" y="246" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#FCD34D">
          (above pediatric threshold)
        </text>

        {/* Anatomy labels */}
        <text x="194" y="184" fontFamily="Consolas, monospace" fontSize="8" fontWeight="700" fill="#FCD34D">sheath</text>
        <text x="180" y="290" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#94A3B8">
          optic nerve (hypoechoic)
        </text>
      </g>

      {/* ─── Bottom: thresholds card ─── */}
      <g transform="translate(50, 360)">
        <rect width="640" height="80" rx="6" fill="#152238" stroke="#2a3a55" />

        <text x="14" y="20" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          PEDIATRIC THRESHOLDS (Padayachy 2012)
        </text>

        <g transform="translate(20, 36)">
          <rect x="0" y="0" width="180" height="32" fill="#0F2E22" stroke="#10B981" strokeWidth="1" rx="3" />
          <text x="14" y="14" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#10B981">&lt; 1 year</text>
          <text x="14" y="27" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">concern &gt; 4.0 mm</text>
        </g>

        <g transform="translate(220, 36)">
          <rect x="0" y="0" width="180" height="32" fill="#3B2C0F" stroke="#FCD34D" strokeWidth="1" rx="3" />
          <text x="14" y="14" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FCD34D">1–15 years</text>
          <text x="14" y="27" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">concern &gt; 4.5 mm</text>
        </g>

        <g transform="translate(420, 36)">
          <rect x="0" y="0" width="180" height="32" fill="#3B210F" stroke="#FB923C" strokeWidth="1" rx="3" />
          <text x="14" y="14" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FB923C">adult</text>
          <text x="14" y="27" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">concern &gt; 5.0 mm</text>
        </g>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · Hansen 1997 · Helmke 1996 · Geeraerts 2008 · Padayachy 2012 · Robba 2018
      </text>
    </svg>
  );
}
