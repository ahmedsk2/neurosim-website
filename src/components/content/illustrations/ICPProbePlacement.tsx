/**
 * ICP probe placement, coronal-view skull cross-section showing Kocher's
 * point intraparenchymal bolt and EVD ventricular catheter side-by-side,
 * with bolt-anatomy detail and zeroing reference plane.
 *
 * Original schematic for MNM-Edu, anatomical landmarks per standard
 * neurosurgical convention.
 */
export function ICPProbePlacement() {
  const W = 720;
  const H = 480;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="ICP probe placement: intraparenchymal bolt and EVD on coronal-view skull cross-section">
      <defs>
        <linearGradient id="ipScalp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBC8C8" />
          <stop offset="100%" stopColor="#E392A7" />
        </linearGradient>
        <linearGradient id="ipBone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8DFC9" />
          <stop offset="100%" stopColor="#C8B894" />
        </linearGradient>
        <linearGradient id="ipBrain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBC8C8" />
          <stop offset="100%" stopColor="#D88090" />
        </linearGradient>
        <pattern id="ipCSF" patternUnits="userSpaceOnUse" width="6" height="6">
          <rect width="6" height="6" fill="#7DD3FC" />
          <circle cx="3" cy="3" r="0.6" fill="#0EA5E9" opacity="0.4" />
        </pattern>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        ICP PROBE PLACEMENT · CORONAL VIEW
      </text>

      {/* ─────────  Coronal head outline (centred drawing area: x=80–460)  ───────── */}
      <g transform="translate(80, 70)">
        {/* Scalp + skull silhouette */}
        <path
          d="M 0 220 Q -10 100 90 50 Q 200 10 310 50 Q 420 100 410 220 Q 405 280 380 320 L 30 320 Q 5 280 0 220 Z"
          fill="url(#ipScalp)"
          stroke="#7A4858"
          strokeWidth="1.5"
        />

        {/* Skull bone */}
        <path
          d="M 18 220 Q 8 110 100 65 Q 205 28 305 65 Q 398 110 392 220 Q 388 270 365 305 L 45 305 Q 22 270 18 220 Z"
          fill="url(#ipBone)"
          stroke="#7C6E50"
          strokeWidth="1.2"
        />

        {/* Inner skull surface / dura */}
        <path
          d="M 32 220 Q 24 120 110 80 Q 205 45 300 80 Q 384 120 378 220 Q 374 260 354 290 L 56 290 Q 36 260 32 220 Z"
          fill="#1A2842"
          stroke="#9CA3AF"
          strokeWidth="0.7"
        />

        {/* Brain */}
        <path
          d="M 42 220 Q 35 130 116 90 Q 205 55 295 90 Q 374 130 368 220 Q 364 252 348 280 L 62 280 Q 46 252 42 220 Z"
          fill="url(#ipBrain)"
          stroke="#A04060"
          strokeWidth="0.8"
        />
        <g stroke="#A04060" strokeWidth="0.6" fill="none" opacity="0.4">
          <path d="M 60 130 Q 75 120 90 130" />
          <path d="M 100 110 Q 130 105 160 115" />
          <path d="M 175 100 Q 205 95 235 100" />
          <path d="M 250 105 Q 280 110 305 115" />
          <path d="M 320 130 Q 340 125 355 135" />
          <path d="M 60 165 Q 90 165 120 170" />
          <path d="M 130 155 Q 160 150 190 155" />
          <path d="M 215 155 Q 245 150 275 155" />
          <path d="M 290 165 Q 320 165 350 170" />
        </g>

        {/* Falx cerebri (midline) */}
        <line x1="205" y1="60" x2="205" y2="285" stroke="#7A4858" strokeWidth="1.5" opacity="0.55" />

        {/* Lateral ventricles (paired) */}
        <path d="M 145 175 Q 175 168 195 175 L 192 195 Q 165 200 145 192 Z" fill="url(#ipCSF)" stroke="#0284C7" strokeWidth="1" />
        <path d="M 215 175 Q 235 168 265 175 L 265 192 Q 240 200 215 195 Z" fill="url(#ipCSF)" stroke="#0284C7" strokeWidth="1" />

        {/* Coronal suture indication (along skull top) */}
        <path d="M 85 65 Q 200 50 320 65" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 2" fill="none" opacity="0.5" />

        {/* Kocher's point, RIGHT (non-dominant) intraparenchymal bolt */}
        <g transform="translate(255, 0)">
          {/* Cap */}
          <rect x="-12" y="14" width="24" height="8" rx="2" fill="#475569" stroke="#0F1A2E" strokeWidth="1" />
          {/* Bolt body */}
          <rect x="-8" y="22" width="16" height="42" fill="url(#ipBone)" stroke="#0F1A2E" strokeWidth="0.8" />
          <rect x="-8" y="26" width="16" height="3" fill="#64748B" />
          <rect x="-8" y="34" width="16" height="3" fill="#64748B" />
          <rect x="-8" y="42" width="16" height="3" fill="#64748B" />
          <rect x="-8" y="50" width="16" height="3" fill="#64748B" />

          {/* Probe shaft */}
          <line x1="0" y1="64" x2="0" y2="170" stroke="#FCD34D" strokeWidth="2.2" />
          <circle cx="0" cy="170" r="4" fill="#F59E0B" stroke="#0F1A2E" strokeWidth="1.2" />
        </g>

        {/* EVD on LEFT */}
        <g transform="translate(155, 0)">
          <rect x="-12" y="14" width="24" height="8" rx="2" fill="#475569" stroke="#0F1A2E" strokeWidth="1" />
          <rect x="-8" y="22" width="16" height="32" fill="url(#ipBone)" stroke="#0F1A2E" strokeWidth="0.8" />
          {/* Catheter */}
          <line x1="0" y1="54" x2="0" y2="180" stroke="#3B82F6" strokeWidth="2.5" />
          <circle cx="0" cy="180" r="3" fill="#0EA5E9" stroke="#0F1A2E" strokeWidth="1" />
        </g>
      </g>
      {/* ─── End of head group ─── */}

      {/* ═══ Anatomy labels, placed OUTSIDE the head silhouette ═══ */}

      {/* Top labels (above skull): one per probe with leader lines */}
      <text x="335" y="62" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FCD34D">
        IPM
      </text>
      <line x1="335" y1="68" x2="335" y2="78" stroke="#FCD34D" strokeWidth="0.6" strokeDasharray="2 2" />

      <text x="235" y="62" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#3B82F6">
        EVD
      </text>
      <line x1="235" y1="68" x2="235" y2="78" stroke="#3B82F6" strokeWidth="0.6" strokeDasharray="2 2" />

      {/* Shared "both at Kocher's point" subtitle, centered between the two bolts */}
      <text x="285" y="48" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
        both via Kocher&apos;s point · 2.5 cm lateral · non-dominant
      </text>

      {/* Coronal suture: dashed line shown on the skull (rendered in the head group);
          textual label deferred to the right-side legend ("at coronal suture") to avoid
          overlap with the legend rectangle and brain silhouette. */}

      {/* Right-bolt probe-tip call-out, placed below the head, labelled with leader */}
      <line x1="335" y1="240" x2="335" y2="305" stroke="#FCD34D" strokeWidth="0.6" strokeDasharray="2 2" />
      <rect x="270" y="305" width="130" height="42" rx="4" fill="#3B2C0F" stroke="#FCD34D" strokeWidth="0.8" />
      <text x="335" y="320" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">
        Strain-gauge /
      </text>
      <text x="335" y="332" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">
        fibre-optic tip
      </text>
      <text x="335" y="344" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fill="#94A3B8">
        ~ 2 cm into white matter
      </text>

      {/* EVD tip call-out, also placed below the head */}
      <line x1="235" y1="250" x2="155" y2="305" stroke="#3B82F6" strokeWidth="0.6" strokeDasharray="2 2" />
      <rect x="80" y="305" width="160" height="42" rx="4" fill="#172554" stroke="#3B82F6" strokeWidth="0.8" />
      <text x="160" y="320" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#3B82F6">
        EVD tip in lateral ventricle
      </text>
      <text x="160" y="332" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#3B82F6">
        silicone catheter
      </text>
      <text x="160" y="344" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fill="#94A3B8">
        therapeutic CSF drainage
      </text>

      {/* Tragus / Monro reference plane, clear band BELOW the head */}
      <line x1="20" y1="370" x2="475" y2="370" stroke="#FCD34D" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.7" />
      <text x="20" y="384" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">
        zero plane · tragus · foramen of Monro
      </text>
      <text x="20" y="396" fontFamily="Consolas, monospace" fontSize="8" fill="#94A3B8">
        EVD transducer level here · re-zero after head re-position
      </text>

      {/* ─────────  Right legend  ───────── */}
      <g transform="translate(490, 70)">
        <rect x="0" y="0" width="210" height="370" rx="6" fill="#152238" stroke="#2a3a55" />

        <text x="105" y="22" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          KOCHER&apos;S POINT
        </text>
        <text x="14" y="44" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">2.5 cm lateral to midline</text>
        <text x="14" y="60" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">at coronal suture</text>
        <text x="14" y="76" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">Non-dominant hemisphere</text>
        <text x="14" y="90" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">(unless lesion-driven)</text>

        <line x1="14" y1="106" x2="196" y2="106" stroke="#2a3a55" strokeWidth="1" />

        <text x="105" y="124" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#FCD34D" letterSpacing="2">
          INTRAPARENCHYMAL
        </text>
        <text x="14" y="146" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">Camino · Codman · Raumedic</text>
        <text x="14" y="160" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">Self-zeros pre-insertion</text>
        <text x="14" y="174" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">Tip in white matter ~2 cm</text>
        <text x="14" y="188" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">Drift over days possible</text>
        <text x="14" y="200" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">No CSF drainage</text>

        <line x1="14" y1="216" x2="196" y2="216" stroke="#2a3a55" strokeWidth="1" />

        <text x="105" y="234" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#3B82F6" letterSpacing="2">
          EVD CATHETER
        </text>
        <text x="14" y="256" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">Tip in lateral ventricle</text>
        <text x="14" y="270" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">External transducer</text>
        <text x="14" y="284" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">Zero at tragus</text>
        <text x="14" y="300" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">Therapeutic drainage</text>
        <text x="14" y="312" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">Risk: infection · blockage</text>

        <line x1="14" y1="328" x2="196" y2="328" stroke="#2a3a55" strokeWidth="1" />

        <text x="14" y="348" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FCD34D">Choose by:</text>
        <text x="14" y="362" fontFamily="Consolas, monospace" fontSize="9" fill="#FFFFFF">hydrocephalus → EVD</text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · coronal cross-section · landmarks per standard neurosurgical convention
      </text>
    </svg>
  );
}
