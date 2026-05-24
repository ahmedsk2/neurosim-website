/**
 * NIRS optode placement, frontal-view head with bilateral source-detector
 * pairs, sagittal cross-section showing the banana-shaped photon path through
 * scalp / skull / cortex, and modified Beer-Lambert equation block.
 *
 * Original schematic for MNM-Edu, derived from standard NIRS-physics
 * principles (modified Beer-Lambert; banana-shaped photon migration).
 */
export function NIRSOptodes() {
  const W = 720;
  const H = 460;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="NIRS optode placement: frontal view + sagittal cross-section showing banana-shaped photon path">
      <defs>
        <linearGradient id="nirsScalp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBC8C8" />
          <stop offset="100%" stopColor="#E392A7" />
        </linearGradient>
        <linearGradient id="nirsBone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8DFC9" />
          <stop offset="100%" stopColor="#C8B894" />
        </linearGradient>
        <linearGradient id="nirsCortex" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8B5C0" />
          <stop offset="100%" stopColor="#D88090" />
        </linearGradient>
        <radialGradient id="nirsPhotonGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <marker id="nirsArrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#94A3B8" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        NIRS · OPTODE PLACEMENT &amp; PHOTON PATH
      </text>

      {/* ─────────────  LEFT: frontal-view head with optodes  ─────────── */}
      <g transform="translate(40, 50)">
        <text x="160" y="14" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4" letterSpacing="1">
          FRONTAL VIEW
        </text>

        {/* Face / head */}
        <ellipse cx="160" cy="170" rx="135" ry="155" fill="url(#nirsScalp)" stroke="#7A4858" strokeWidth="1.5" />

        {/* Hairline */}
        <path d="M 35 130 Q 80 80 160 70 Q 240 80 285 130" fill="none" stroke="#7A4858" strokeWidth="1.2" opacity="0.6" />

        {/* Eyebrows */}
        <path d="M 90 175 Q 110 168 130 175" fill="none" stroke="#3F2330" strokeWidth="2" />
        <path d="M 190 175 Q 210 168 230 175" fill="none" stroke="#3F2330" strokeWidth="2" />

        {/* Eyes */}
        <ellipse cx="110" cy="200" rx="11" ry="6" fill="#FFFFFF" />
        <circle cx="110" cy="200" r="3.5" fill="#3F2330" />
        <ellipse cx="210" cy="200" rx="11" ry="6" fill="#FFFFFF" />
        <circle cx="210" cy="200" r="3.5" fill="#3F2330" />

        {/* Nose */}
        <path d="M 160 205 L 153 245 Q 160 252 167 245 Z" fill="#E392A7" stroke="#7A4858" strokeWidth="0.8" />

        {/* Mouth */}
        <path d="M 140 285 Q 160 295 180 285" fill="none" stroke="#7A4858" strokeWidth="1.5" />

        {/* L NIRS pad, above L brow, lateral */}
        <g transform="translate(80, 130)">
          <rect x="-22" y="-12" width="44" height="24" rx="4" fill="#0F1A2E" stroke="#FCD34D" strokeWidth="1.5" />
          <rect x="-18" y="-2" width="6" height="6" rx="1" fill="#FCD34D" />
          <rect x="12" y="-2" width="6" height="6" rx="1" fill="#5EEAD4" />
          <text x="0" y="3" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="7" fontWeight="700" fill="#94A3B8">L1</text>
        </g>
        {/* External L label, lifted 6 px clear of the pad's top edge at y=118 */}
        <text x="80" y="112" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FCD34D">L</text>

        {/* R NIRS pad */}
        <g transform="translate(240, 130)">
          <rect x="-22" y="-12" width="44" height="24" rx="4" fill="#0F1A2E" stroke="#FCD34D" strokeWidth="1.5" />
          <rect x="-18" y="-2" width="6" height="6" rx="1" fill="#FCD34D" />
          <rect x="12" y="-2" width="6" height="6" rx="1" fill="#5EEAD4" />
          <text x="0" y="3" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="7" fontWeight="700" fill="#94A3B8">R1</text>
        </g>
        {/* External R label, lifted 6 px clear of the pad's top edge at y=118 */}
        <text x="240" y="112" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FCD34D">R</text>

        {/* Cable hint */}
        <path d="M 80 130 L 50 70" stroke="#94A3B8" strokeWidth="1.2" fill="none" />
        <path d="M 240 130 L 270 70" stroke="#94A3B8" strokeWidth="1.2" fill="none" />

        {/* Distance annotation */}
        <line x1="58" y1="140" x2="102" y2="140" stroke="#5EEAD4" strokeWidth="0.8" markerEnd="url(#nirsArrow)" />
        <line x1="102" y1="140" x2="58" y2="140" stroke="#5EEAD4" strokeWidth="0.8" markerEnd="url(#nirsArrow)" />
        <text x="80" y="153" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#5EEAD4">~3–4 cm</text>
      </g>

      {/* ───────────  RIGHT: sagittal cross-section with banana path  ──── */}
      <g transform="translate(370, 50)">
        <text x="170" y="10" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4" letterSpacing="1">
          SAGITTAL CROSS-SECTION
        </text>

        {/* Source optode (positioned ABOVE scalp band, well below title) */}
        <g transform="translate(80, 38)">
          <rect x="-12" y="-7" width="24" height="14" rx="2" fill="#0F1A2E" stroke="#FCD34D" strokeWidth="1.2" />
          <rect x="-7" y="-3" width="14" height="6" fill="#FCD34D" />
          <text x="-16" y="2" textAnchor="end" fontFamily="Consolas, monospace" fontSize="8" fontWeight="700" fill="#FCD34D">source</text>
        </g>

        {/* Detector optodes (multi-distance) */}
        <g transform="translate(180, 38)">
          <rect x="-12" y="-7" width="24" height="14" rx="2" fill="#0F1A2E" stroke="#5EEAD4" strokeWidth="1.2" />
          <rect x="-7" y="-3" width="14" height="6" fill="#5EEAD4" />
          <text x="0" y="-8" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#5EEAD4">D₁ short</text>
        </g>

        <g transform="translate(280, 38)">
          <rect x="-12" y="-7" width="24" height="14" rx="2" fill="#0F1A2E" stroke="#5EEAD4" strokeWidth="1.2" />
          <rect x="-7" y="-3" width="14" height="6" fill="#5EEAD4" />
          <text x="0" y="-8" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#5EEAD4">D₂ long</text>
        </g>

        {/* Tissue layers (top-down stack),start AFTER optodes at y=50 */}
        <rect x="0" y="50" width="340" height="22" fill="url(#nirsScalp)" stroke="#7A4858" strokeWidth="0.8" />
        <text x="-6" y="64" textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fill="#FFFFFF">scalp</text>
        <text x="346" y="64" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">~ 5 mm</text>

        <rect x="0" y="72" width="340" height="20" fill="url(#nirsBone)" stroke="#7C6E50" strokeWidth="0.8" />
        <text x="-6" y="86" textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fill="#FFFFFF">skull</text>
        <text x="346" y="86" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">~ 5–7 mm</text>

        <rect x="0" y="92" width="340" height="10" fill="url(#nirsCortex)" opacity="0.4" stroke="#A04060" strokeWidth="0.5" />
        <text x="-6" y="100" textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fill="#FFFFFF">CSF</text>

        <rect x="0" y="102" width="340" height="80" fill="url(#nirsCortex)" stroke="#A04060" strokeWidth="0.8" />
        <g stroke="#A04060" strokeWidth="0.6" fill="none" opacity="0.55">
          <path d="M 30 128 Q 50 123 70 128" />
          <path d="M 90 123 Q 110 118 130 123" />
          <path d="M 160 128 Q 180 123 200 128" />
          <path d="M 220 123 Q 240 118 260 123" />
          <path d="M 290 128 Q 310 123 330 128" />
          <path d="M 30 158 Q 60 153 90 158" />
          <path d="M 110 158 Q 140 153 170 158" />
          <path d="M 200 158 Q 230 153 260 158" />
          <path d="M 280 158 Q 310 153 335 158" />
        </g>
        <text x="-6" y="135" textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fill="#FFFFFF">cortex</text>
        <text x="-6" y="148" textAnchor="end" fontFamily="Consolas, monospace" fontSize="8" fill="#94A3B8">(grey matter)</text>

        {/* Short banana, scalp/skull only (path begins at source y=45 = 38+7) */}
        <ellipse cx="130" cy="76" rx="55" ry="20" fill="url(#nirsPhotonGlow)" />
        <path d="M 80 45 Q 130 100 180 45" fill="none" stroke="#FCD34D" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.85" />
        <text x="130" y="194" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">short path · scalp/skull only</text>

        {/* Long banana, through cortex */}
        <ellipse cx="180" cy="120" rx="105" ry="48" fill="url(#nirsPhotonGlow)" />
        <path d="M 80 45 Q 180 190 280 45" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.95" />
        <text x="180" y="210" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#F59E0B">long path · samples cortex (~ 1–2 cm depth)</text>

        {/* Spatial-resolved subtraction note */}
        <text x="170" y="226" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8" fontStyle="italic">
          D₂ − D₁ ⇒ subtract scalp/skull contamination
        </text>
      </g>

      {/* ───────────  Bottom: Beer-Lambert + interpretation  ──────────── */}
      <g transform="translate(40, 320)">
        <rect x="0" y="0" width="320" height="135" rx="6" fill="#152238" stroke="#2a3a55" />
        <text x="14" y="22" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          MODIFIED BEER-LAMBERT
        </text>
        <text x="14" y="46" fontFamily="Consolas, monospace" fontSize="13" fontWeight="700" fill="#FFFFFF">
          A = ε · c · d · DPF + G
        </text>
        <text x="14" y="64" fontFamily="Consolas, monospace" fontSize="9.5" fill="#94A3B8">
          A = absorbance · ε = extinction
        </text>
        <text x="14" y="76" fontFamily="Consolas, monospace" fontSize="9.5" fill="#94A3B8">
          c = chromophore concentration
        </text>
        <text x="14" y="88" fontFamily="Consolas, monospace" fontSize="9.5" fill="#94A3B8">
          d = source-detector distance
        </text>
        <text x="14" y="100" fontFamily="Consolas, monospace" fontSize="9.5" fill="#94A3B8">
          DPF = differential pathlength factor
        </text>
        <text x="14" y="122" fontFamily="Consolas, monospace" fontSize="10.5" fill="#FFFFFF">
          Two wavelengths → HbO₂ : HbR → rSO₂ %
        </text>
      </g>

      <g transform="translate(380, 320)">
        <rect x="0" y="0" width="300" height="120" rx="6" fill="#152238" stroke="#2a3a55" />
        <text x="14" y="22" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          BEDSIDE BAND
        </text>
        <text x="14" y="46" fontFamily="Consolas, monospace" fontSize="11" fill="#FFFFFF">Term newborn 65–85%</text>
        <text x="14" y="64" fontFamily="Consolas, monospace" fontSize="11" fill="#FFFFFF">Older child / adult 60–80%</text>
        <text x="14" y="82" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#FCD34D">Asymmetry &gt; 10% → flag</text>
        <text x="14" y="100" fontFamily="Consolas, monospace" fontSize="10" fill="#94A3B8">
          Sample weighted ~ 70% venous : 25% arterial
        </text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · modified Beer-Lambert · banana-shape photon migration
      </text>
    </svg>
  );
}
