/**
 * Triple-lumen bolt, ICP + PbtO₂ + brain thermistor in one shaft, with
 * Kocher's-point insertion shown in coronal cross-section and a magnified
 * detail of the three sensor tips.
 *
 * Original schematic for MNM-Edu, derived from multi-parameter bolt device principles.
 */
export function PbtO2Probe() {
  const W = 720;
  const H = 460;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Triple-lumen bolt with ICP, PbtO₂, and brain temperature sensors">
      <defs>
        <linearGradient id="ppBone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8DFC9" />
          <stop offset="100%" stopColor="#C8B894" />
        </linearGradient>
        <linearGradient id="ppBrain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBC8C8" />
          <stop offset="100%" stopColor="#D88090" />
        </linearGradient>
        <radialGradient id="ppO2Glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        TRIPLE-LUMEN BOLT · ICP + PbtO₂ + BRAIN T°
      </text>

      {/* ─── Left: skull cross-section with bolt ─── */}
      <g transform="translate(40, 50)">
        <text x="120" y="14" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">
          INSERTION (CORONAL)
        </text>

        {/* Scalp */}
        <rect x="0" y="32" width="240" height="14" fill="#FBC8C8" stroke="#7A4858" strokeWidth="0.7" />
        {/* Skull */}
        <rect x="0" y="46" width="240" height="20" fill="url(#ppBone)" stroke="#7C6E50" strokeWidth="0.8" />
        {/* CSF */}
        <rect x="0" y="66" width="240" height="6" fill="#7DD3FC" opacity="0.6" />
        {/* Brain */}
        <rect x="0" y="72" width="240" height="190" fill="url(#ppBrain)" stroke="#A04060" strokeWidth="0.8" />
        <g stroke="#A04060" strokeWidth="0.5" fill="none" opacity="0.5">
          <path d="M 30 95 Q 60 90 90 95" />
          <path d="M 110 100 Q 140 95 170 100" />
          <path d="M 30 130 Q 70 125 110 130" />
          <path d="M 130 130 Q 170 125 210 130" />
          <path d="M 30 175 Q 80 175 130 180" />
          <path d="M 150 175 Q 200 175 230 180" />
          <path d="M 30 220 Q 90 220 150 222" />
        </g>

        {/* Bolt cap and shaft */}
        <rect x="108" y="14" width="24" height="6" rx="2" fill="#475569" />
        <rect x="112" y="20" width="16" height="42" fill="url(#ppBone)" stroke="#0F1A2E" strokeWidth="0.8" />
        <rect x="108" y="22" width="24" height="3" fill="#64748B" />
        <rect x="108" y="29" width="24" height="3" fill="#64748B" />
        <rect x="108" y="36" width="24" height="3" fill="#64748B" />
        <rect x="108" y="43" width="24" height="3" fill="#64748B" />

        {/* Three connector ports on cap */}
        <circle cx="115" cy="10" r="3" fill="#FCD34D" />
        <circle cx="120" cy="10" r="3" fill="#5EEAD4" />
        <circle cx="125" cy="10" r="3" fill="#EF4444" />

        {/* Single bolt shaft going down into brain */}
        <line x1="120" y1="62" x2="120" y2="240" stroke="#94A3B8" strokeWidth="2.4" />

        {/* Three sensor tips at slightly different depths */}
        <line x1="116" y1="62" x2="116" y2="232" stroke="#FCD34D" strokeWidth="1.5" />
        <line x1="120" y1="62" x2="120" y2="240" stroke="#5EEAD4" strokeWidth="1.5" />
        <line x1="124" y1="62" x2="124" y2="236" stroke="#EF4444" strokeWidth="1.5" />

        <circle cx="116" cy="232" r="3" fill="#FCD34D" stroke="#0F1A2E" strokeWidth="1" />
        <circle cx="120" cy="240" r="3.5" fill="#5EEAD4" stroke="#0F1A2E" strokeWidth="1" />
        <circle cx="124" cy="236" r="3" fill="#EF4444" stroke="#0F1A2E" strokeWidth="1" />

        {/* PbtO₂ glow showing local sample volume */}
        <circle cx="120" cy="240" r="14" fill="url(#ppO2Glow)" />

        {/* Call-out lines from tips */}
        <line x1="116" y1="232" x2="32" y2="270" stroke="#FCD34D" strokeWidth="0.6" strokeDasharray="2 2" />
        <text x="28" y="276" textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">ICP</text>

        <line x1="120" y1="240" x2="232" y2="290" stroke="#5EEAD4" strokeWidth="0.6" strokeDasharray="2 2" />
        <text x="232" y="298" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#5EEAD4">PbtO₂ tip</text>

        <line x1="124" y1="236" x2="232" y2="252" stroke="#EF4444" strokeWidth="0.6" strokeDasharray="2 2" />
        <text x="232" y="260" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#EF4444">brain T°</text>
      </g>

      {/* ─── Right: Magnified bolt detail ─── */}
      <g transform="translate(330, 60)">
        <text x="180" y="14" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">
          MAGNIFIED · TRIPLE-CHANNEL TIP
        </text>

        {/* Outer shaft */}
        <rect x="0" y="40" width="360" height="56" rx="8" fill="#1A2842" stroke="#94A3B8" strokeWidth="2" />

        {/* Three internal channels */}
        <rect x="14" y="48" width="332" height="11" fill="#FCD34D" opacity="0.25" stroke="#FCD34D" strokeWidth="0.7" rx="2" />
        <rect x="14" y="62" width="332" height="11" fill="#5EEAD4" opacity="0.25" stroke="#5EEAD4" strokeWidth="0.7" rx="2" />
        <rect x="14" y="76" width="332" height="11" fill="#EF4444" opacity="0.25" stroke="#EF4444" strokeWidth="0.7" rx="2" />

        {/* Sensor tips at far end (right) */}
        <g>
          {/* ICP */}
          <circle cx="356" cy="53" r="4" fill="#FCD34D" stroke="#0F1A2E" strokeWidth="1" />
          {/* PbtO₂ - polarographic / fluorescent */}
          <circle cx="356" cy="67" r="4.5" fill="#5EEAD4" stroke="#0F1A2E" strokeWidth="1" />
          {/* Thermistor */}
          <circle cx="356" cy="81" r="4" fill="#EF4444" stroke="#0F1A2E" strokeWidth="1" />
        </g>

        {/* Channel labels */}
        <text x="14" y="108" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">strain-gauge / fibre-optic</text>
        <text x="14" y="120" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">→ ICP, mmHg</text>

        <text x="14" y="138" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#5EEAD4">polarographic / fluorescent</text>
        <text x="14" y="150" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">→ PbtO₂, mmHg (local)</text>

        <text x="14" y="168" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#EF4444">thermistor</text>
        <text x="14" y="180" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">→ brain T°, °C</text>
      </g>

      {/* ─── Bottom: PbtO₂ thresholds + algorithm summary ─── */}
      <g transform="translate(40, 290)">
        <rect width="640" height="148" rx="6" fill="#152238" stroke="#2a3a55" />

        <text x="14" y="22" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          PbtO₂ THRESHOLDS · BOOST-style intervention
        </text>

        {/* Threshold bars */}
        <g transform="translate(14, 36)">
          <rect x="0" y="0" width="100" height="16" fill="#10B981" opacity="0.7" rx="2" />
          <text x="50" y="12" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#0F1A2E">
            ≥ 20 OK
          </text>

          <rect x="100" y="0" width="100" height="16" fill="#FCD34D" opacity="0.7" rx="2" />
          <text x="150" y="12" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#0F1A2E">
            15–20 borderline
          </text>

          <rect x="200" y="0" width="100" height="16" fill="#F59E0B" opacity="0.7" rx="2" />
          <text x="250" y="12" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#0F1A2E">
            10–15 act
          </text>

          <rect x="300" y="0" width="100" height="16" fill="#EF4444" opacity="0.85" rx="2" />
          <text x="350" y="12" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FFFFFF">
            &lt; 10 emergent
          </text>
          <text x="412" y="12" fontFamily="Consolas, monospace" fontSize="10" fill="#94A3B8">mmHg</text>
        </g>

        {/* Algorithm steps */}
        <text x="14" y="78" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4" letterSpacing="1">
          IF SUSTAINED &lt; 20 mmHg
        </text>
        <text x="14" y="94" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
          1. Confirm signal · 2. Raise CPP · 3. Raise FiO₂ to 60% · 4. Transfuse Hgb 9–10 · 5. Reduce CMRO₂
        </text>

        <text x="14" y="118" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FCD34D" letterSpacing="1">
          KEY CAVEATS
        </text>
        <text x="14" y="134" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
          Local sample (~ 17 mm² Licox · ~ 1 cm³ Neurovent-PTO) · 1–2 h equilibration · avoid placement in contusion
        </text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · Stiefel 2005 · Okonkwo 2017 (BOOST-II) · device principles
      </text>
    </svg>
  );
}
