/**
 * Transcranial Doppler insonation windows, lateral-view head with the four
 * standard windows (transtemporal, transorbital, suboccipital, submandibular)
 * and a Circle-of-Willis schematic centred inside.
 *
 * Original schematic for MNM-Edu, based on standard TCD insonation
 * conventions described in foundational neurosonography texts.
 */
export function TCDWindows() {
  const W = 720;
  const H = 460;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="TCD insonation windows: transtemporal, transorbital, suboccipital, submandibular with Circle of Willis">
      <defs>
        <linearGradient id="tcdSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBC8C8" />
          <stop offset="100%" stopColor="#E392A7" />
        </linearGradient>
        <radialGradient id="tcdBeam" cx="0" cy="0.5" r="1">
          <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        TCD INSONATION WINDOWS
      </text>
      <text x={W / 2} y={48} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10.5" fill="#94A3B8">
        2 MHz pulsed-wave probe · Doppler shift Δf = 2·f₀·v·cos(θ)/c · &lt; 30° insonation angle
      </text>

      {/* ─────────  Lateral-view head (left half)  ───────── */}
      <g transform="translate(40, 70)">
        {/* Head outline (lateral, facing right) */}
        <path
          d="M 50 200 Q 30 80 130 40 Q 240 20 320 50 Q 360 70 360 110 L 360 165 Q 365 175 360 180 L 350 180 L 350 200 Q 360 215 348 220 L 340 245 Q 332 270 310 280 L 290 295 Q 282 308 270 315 L 250 320 L 230 322 L 210 318 L 195 305 L 175 295 Q 150 280 120 268 Q 80 250 60 220 Q 50 210 50 200 Z"
          fill="url(#tcdSkin)"
          stroke="#7A4858"
          strokeWidth="1.5"
        />

        {/* Eye */}
        <ellipse cx="335" cy="130" rx="14" ry="9" fill="#FFFFFF" />
        <circle cx="335" cy="130" r="4" fill="#3F2330" />
        <circle cx="335" cy="130" r="1.5" fill="#000000" />

        {/* Eyebrow */}
        <path d="M 320 116 Q 335 110 350 116" fill="none" stroke="#3F2330" strokeWidth="2" />

        {/* Nose tip */}
        <path d="M 360 130 L 372 165 Q 367 175 358 175 Z" fill="#E392A7" stroke="#7A4858" strokeWidth="0.8" />

        {/* Mouth */}
        <path d="M 320 220 Q 340 226 360 220" fill="none" stroke="#7A4858" strokeWidth="1.4" />

        {/* Ear */}
        <path d="M 175 165 Q 165 165 160 175 L 160 195 Q 165 205 175 200 Q 178 188 175 165 Z" fill="#E392A7" stroke="#7A4858" strokeWidth="1" />
        <path d="M 168 175 Q 173 175 173 185 Q 168 192 168 175 Z" fill="#7A4858" opacity="0.5" />

        {/* Skull outline (interior cranium hint) */}
        <path
          d="M 70 200 Q 55 90 135 55 Q 235 35 305 65 Q 340 85 340 130 L 340 175 L 320 230 Q 305 260 270 270 Q 220 280 175 268 Q 120 250 90 220 Q 70 215 70 200 Z"
          fill="none"
          stroke="#475569"
          strokeWidth="1"
          strokeDasharray="3 2"
          opacity="0.6"
        />

        {/* Circle of Willis (centred in skull) */}
        <g transform="translate(195, 165)">
          {/* CoW ring */}
          <circle r="32" fill="none" stroke="#DC2626" strokeWidth="2" opacity="0.85" />

          {/* MCA, bilateral, going laterally */}
          <line x1="-20" y1="-12" x2="-95" y2="-15" stroke="#DC2626" strokeWidth="3" />
          <line x1="20" y1="-12" x2="95" y2="-15" stroke="#DC2626" strokeWidth="3" />
          <text x="-90" y="-22" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#DC2626">L MCA</text>
          <text x="90" y="-22" textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#DC2626">R MCA</text>

          {/* ACA, anterior */}
          <path d="M 0 -25 Q 5 -45 30 -55" stroke="#DC2626" strokeWidth="2" fill="none" />
          <text x="36" y="-58" fontFamily="Consolas, monospace" fontSize="9" fill="#DC2626">ACA</text>

          {/* PCA, posterior */}
          <line x1="-15" y1="22" x2="-50" y2="50" stroke="#DC2626" strokeWidth="2" />
          <line x1="15" y1="22" x2="50" y2="50" stroke="#DC2626" strokeWidth="2" />
          <text x="-65" y="62" fontFamily="Consolas, monospace" fontSize="9" fill="#DC2626">PCA</text>

          {/* Basilar */}
          <line x1="0" y1="32" x2="0" y2="78" stroke="#DC2626" strokeWidth="2.5" />
          <text x="8" y="86" fontFamily="Consolas, monospace" fontSize="9" fill="#DC2626">basilar</text>

          {/* ICA siphon coming up */}
          <path d="M 30 30 Q 50 55 50 95" stroke="#DC2626" strokeWidth="2.5" fill="none" />
          <text x="55" y="95" fontFamily="Consolas, monospace" fontSize="9" fill="#DC2626">ICA</text>
        </g>

        {/* ─── 1. Transtemporal window (above zygomatic arch) ─── */}
        <g>
          <circle cx="155" cy="155" r="14" fill="#FCD34D" opacity="0.55" stroke="#FCD34D" strokeWidth="2.5" />
          {/* Beam toward MCA */}
          <ellipse cx="180" cy="155" rx="60" ry="16" fill="url(#tcdBeam)" transform="rotate(-5 180 155)" />
          <text x="155" y="200" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FCD34D">1</text>
        </g>

        {/* ─── 2. Transorbital (eye) ─── */}
        <g>
          <circle cx="335" cy="130" r="9" fill="#5EEAD4" opacity="0.55" stroke="#5EEAD4" strokeWidth="2" />
          <ellipse cx="280" cy="135" rx="60" ry="10" fill="url(#tcdBeam)" transform="rotate(-179 280 135) translate(-110)" />
          <text x="345" y="106" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">2</text>
        </g>

        {/* ─── 3. Suboccipital (back of skull, neck flex) ─── */}
        <g>
          <circle cx="92" cy="240" r="12" fill="#A78BFA" opacity="0.55" stroke="#A78BFA" strokeWidth="2.5" />
          <ellipse cx="135" cy="220" rx="55" ry="12" fill="url(#tcdBeam)" transform="rotate(-30 135 220)" />
          <text x="80" y="270" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#A78BFA">3</text>
        </g>

        {/* ─── 4. Submandibular (under jaw) ─── */}
        <g>
          <circle cx="295" cy="305" r="10" fill="#F59E0B" opacity="0.55" stroke="#F59E0B" strokeWidth="2.5" />
          <ellipse cx="280" cy="265" rx="40" ry="9" fill="url(#tcdBeam)" transform="rotate(75 280 265)" />
          <text x="305" y="330" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#F59E0B">4</text>
        </g>
      </g>

      {/* ─────────  Right legend  ───────── */}
      <g transform="translate(465, 70)">
        <rect x="0" y="0" width="225" height="370" rx="6" fill="#152238" stroke="#2a3a55" />

        <text x="113" y="20" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          FOUR WINDOWS
        </text>

        <g transform="translate(12, 38)">
          <circle cx="9" cy="10" r="9" fill="#FCD34D" opacity="0.7" stroke="#FCD34D" strokeWidth="1.5" />
          <text x="9" y="14" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#0F1A2E">1</text>
          <text x="26" y="8" fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill="#FCD34D">Transtemporal</text>
          <text x="26" y="22" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">Above zygomatic arch</text>
          <text x="26" y="34" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">→ MCA · ACA · PCA · ICA</text>
          <text x="26" y="46" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">depth 35–55 mm (age)</text>
        </g>

        <g transform="translate(12, 110)">
          <circle cx="9" cy="10" r="9" fill="#5EEAD4" opacity="0.7" stroke="#5EEAD4" strokeWidth="1.5" />
          <text x="9" y="14" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#0F1A2E">2</text>
          <text x="26" y="8" fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill="#5EEAD4">Transorbital</text>
          <text x="26" y="22" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">Closed eyelid · low MI</text>
          <text x="26" y="34" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">→ ICA siphon · ophthalmic</text>
        </g>

        <g transform="translate(12, 168)">
          <circle cx="9" cy="10" r="9" fill="#A78BFA" opacity="0.7" stroke="#A78BFA" strokeWidth="1.5" />
          <text x="9" y="14" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#0F1A2E">3</text>
          <text x="26" y="8" fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill="#A78BFA">Suboccipital</text>
          <text x="26" y="22" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">Probe at foramen magnum</text>
          <text x="26" y="34" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">→ vertebral · basilar</text>
        </g>

        <g transform="translate(12, 226)">
          <circle cx="9" cy="10" r="9" fill="#F59E0B" opacity="0.7" stroke="#F59E0B" strokeWidth="1.5" />
          <text x="9" y="14" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#0F1A2E">4</text>
          <text x="26" y="8" fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill="#F59E0B">Submandibular</text>
          <text x="26" y="22" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">Under the jaw</text>
          <text x="26" y="34" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">→ extracranial ICA</text>
          <text x="26" y="46" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">(Lindegaard denominator)</text>
        </g>

        <line x1="14" y1="290" x2="211" y2="290" stroke="#2a3a55" strokeWidth="1" />

        <text x="113" y="308" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          KEY METRICS
        </text>
        <text x="14" y="326" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">PSV / EDV / MFV / PI</text>
        <text x="14" y="340" fontFamily="Consolas, monospace" fontSize="9.5" fill="#FFFFFF">Lindegaard = MCA / ICA</text>
        <text x="14" y="354" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">spasm vs hyperaemia</text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · standard 4-window TCD insonation
      </text>
    </svg>
  );
}
