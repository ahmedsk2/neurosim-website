/**
 * Retrograde internal jugular catheter at the jugular bulb, anatomical
 * lateral view with skull base, jugular foramen, IJ vein, retrograde
 * catheter path, and tip-position confirmation reference (C1-C2 vertebrae).
 *
 * Original schematic for MNM-Edu, derived from standard SjvO₂ catheterisation anatomy.
 */
export function JugularBulbCatheter() {
  const W = 720;
  const H = 480;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Retrograde IJ catheter at the jugular bulb for SjvO₂">
      <defs>
        <linearGradient id="jbcSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBC8C8" />
          <stop offset="100%" stopColor="#E392A7" />
        </linearGradient>
        <linearGradient id="jbcBone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8DFC9" />
          <stop offset="100%" stopColor="#C8B894" />
        </linearGradient>
        <linearGradient id="jbcVein" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
        <radialGradient id="jbcBulb" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </radialGradient>
        <marker id="jbcArr" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#FCD34D" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        RETROGRADE INTERNAL JUGULAR CATHETER · SjvO₂
      </text>
      <text x={W / 2} y={48} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10.5" fill="#94A3B8">
        Lateral neck view · catheter advanced cephalad against venous flow into the bulb
      </text>

      {/* ─── Left: Lateral head + neck ─── */}
      <g transform="translate(50, 60)">
        {/* Head outline (lateral, facing left) */}
        <path
          d="M 220 80 Q 245 30 195 12 Q 130 0 80 22 Q 35 50 38 95 Q 35 120 50 130 L 60 138 Q 75 145 88 138 L 100 130 L 130 132 L 145 142 L 160 150 L 180 145 L 195 130 Q 220 110 220 80 Z"
          fill="url(#jbcSkin)"
          stroke="#7A4858"
          strokeWidth="1.5"
        />

        {/* Skull base / mastoid hint */}
        <ellipse cx="160" cy="105" rx="70" ry="35" fill="url(#jbcBone)" stroke="#7C6E50" strokeWidth="1" opacity="0.45" />

        {/* Eye */}
        <ellipse cx="92" cy="65" rx="11" ry="6" fill="#FFFFFF" />
        <circle cx="92" cy="65" r="3.5" fill="#3F2330" />

        {/* Nose */}
        <path d="M 60 90 L 50 122 Q 55 130 65 125 Z" fill="#E392A7" stroke="#7A4858" strokeWidth="0.8" />

        {/* Mouth */}
        <path d="M 95 132 Q 110 138 125 132" fill="none" stroke="#7A4858" strokeWidth="1.2" />

        {/* Mastoid process, landmark */}
        <ellipse cx="195" cy="135" rx="8" ry="14" fill="url(#jbcBone)" stroke="#7C6E50" strokeWidth="1" />
        <text x="225" y="138" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#94A3B8">mastoid process</text>

        {/* Neck silhouette */}
        <path
          d="M 100 145 L 95 280 L 195 280 L 195 155 Q 195 150 190 148 L 165 155 L 130 158 L 110 152 Z"
          fill="url(#jbcSkin)"
          stroke="#7A4858"
          strokeWidth="1.5"
        />

        {/* Jaw line */}
        <path d="M 100 145 Q 130 175 195 155" fill="none" stroke="#7A4858" strokeWidth="0.8" opacity="0.6" />

        {/* Cervical vertebrae C1-C7 outlines (along spine) */}
        {[
          { y: 152, label: 'C1' },
          { y: 167, label: 'C2' },
          { y: 184, label: 'C3' },
          { y: 201, label: 'C4' },
          { y: 220, label: 'C5' },
          { y: 240, label: 'C6' },
          { y: 260, label: 'C7' },
        ].map((v, i) => (
          <g key={v.label}>
            <ellipse cx="170" cy={v.y} rx="14" ry="6" fill="url(#jbcBone)" stroke="#7C6E50" strokeWidth="0.7" />
            <text x="190" y={v.y + 2} fontFamily="Consolas, monospace" fontSize="8" fontWeight="700" fill={i < 2 ? '#FCD34D' : '#94A3B8'}>
              {v.label}
            </text>
          </g>
        ))}

        {/* Reference line at C1-C2 inferior border */}
        <line x1="50" y1="172" x2="220" y2="172" stroke="#FCD34D" strokeWidth="0.6" strokeDasharray="3 2" opacity="0.7" />
        <text x="50" y="166" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">tip target plane (C1–C2)</text>

        {/* Jugular foramen and bulb (just below skull base) */}
        <circle cx="155" cy="138" r="6" fill="#3B82F6" opacity="0.6" stroke="#1E40AF" strokeWidth="0.8" />
        {/* "jugular foramen" label, moved to the right of head with leader line to avoid overlap with face silhouette */}
        <line x1="162" y1="138" x2="232" y2="108" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="2 2" />
        <text x="236" y="111" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#3B82F6">jugular foramen</text>

        {/* Jugular bulb (dilation) */}
        <ellipse cx="148" cy="160" rx="14" ry="20" fill="url(#jbcBulb)" stroke="#1E40AF" strokeWidth="1" />
        {/* "jugular BULB" label, moved to the right of head with leader line */}
        <line x1="163" y1="160" x2="232" y2="160" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="2 2" />
        <text x="236" y="158" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#3B82F6">jugular BULB</text>
        <text x="236" y="170" fontFamily="Consolas, monospace" fontSize="8" fill="#3B82F6">(dilation at exit)</text>

        {/* Internal jugular vein going down */}
        <path d="M 148 180 L 144 280" stroke="url(#jbcVein)" strokeWidth="14" opacity="0.85" fill="none" />
        {/* "internal jugular vein" label, moved BELOW the C7 vertebra to avoid colliding with vertebra labels */}
        <line x1="155" y1="268" x2="232" y2="268" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="2 2" />
        <text x="236" y="271" fontFamily="Consolas, monospace" fontSize="9.5" fontWeight="700" fill="#3B82F6">internal jugular vein</text>

        {/* Catheter, entering from below, advanced retrograde */}
        <path d="M 144 282 Q 144 250 144 200 Q 144 175 148 162" fill="none" stroke="#FCD34D" strokeWidth="2.6" />
        <circle cx="148" cy="160" r="3" fill="#FCD34D" stroke="#0F1A2E" strokeWidth="1" />

        {/* Retrograde direction arrow; label moved to the right margin */}
        <line x1="155" y1="240" x2="155" y2="200" stroke="#FCD34D" strokeWidth="1.5" markerEnd="url(#jbcArr)" />
        <line x1="162" y1="218" x2="232" y2="218" stroke="#FCD34D" strokeWidth="0.5" strokeDasharray="2 2" />
        <text x="236" y="221" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">retrograde (cephalad)</text>

        {/* Catheter entry (skin puncture); label moved to the right margin */}
        <circle cx="144" cy="282" r="3" fill="#EF4444" />
        <line x1="150" y1="284" x2="232" y2="292" stroke="#EF4444" strokeWidth="0.5" strokeDasharray="2 2" />
        <text x="236" y="295" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#EF4444">IJ puncture</text>
        <text x="236" y="307" fontFamily="Consolas, monospace" fontSize="8" fill="#94A3B8">US-guided · cricoid level</text>

        {/* Blood-flow direction arrow in IJ (dashed downward); label removed because the arrow is self-explanatory and the prior label crowded the catheter region */}
        <line x1="130" y1="200" x2="130" y2="240" stroke="#3B82F6" strokeWidth="1" strokeDasharray="2 2" markerEnd="url(#jbcArr)" />
      </g>

      {/* ─── Right legend ─── */}
      <g transform="translate(450, 70)">
        <rect width="240" height="370" rx="6" fill="#152238" stroke="#2a3a55" />

        <text x="120" y="22" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          PLACEMENT
        </text>
        <text x="14" y="42" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          • Right IJ usually preferred
        </text>
        <text x="14" y="58" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          (dominant venous drainage)
        </text>
        <text x="14" y="76" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          • Standard IJ access
        </text>
        <text x="14" y="92" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          (US guidance, Seldinger)
        </text>
        <text x="14" y="110" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          • Advance cephalad ~ 15 cm
        </text>
        <text x="14" y="126" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          until resistance, that&apos;s the bulb
        </text>

        <line x1="14" y1="142" x2="226" y2="142" stroke="#2a3a55" strokeWidth="1" />

        <text x="120" y="162" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#FCD34D" letterSpacing="2">
          CONFIRMATION
        </text>
        <text x="14" y="182" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          Lateral cervical X-ray:
        </text>
        <text x="14" y="198" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#FCD34D">
          tip at C1–C2 inferior border
        </text>
        <text x="14" y="214" fontFamily="Consolas, monospace" fontSize="10" fill="#94A3B8">
          (level of mastoid process)
        </text>

        <line x1="14" y1="234" x2="226" y2="234" stroke="#2a3a55" strokeWidth="1" />

        <text x="120" y="254" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          SAMPLING
        </text>
        <text x="14" y="274" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          Fibre-optic continuous SjvO₂
        </text>
        <text x="14" y="290" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          OR intermittent co-oximetry
        </text>
        <text x="14" y="308" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#EF4444">
          Aspirate ≤ 2 mL/min
        </text>
        <text x="14" y="322" fontFamily="Consolas, monospace" fontSize="10" fill="#94A3B8">
          fast aspiration → entrains
        </text>
        <text x="14" y="334" fontFamily="Consolas, monospace" fontSize="10" fill="#94A3B8">
          extracerebral blood (artifact)
        </text>

        <text x="14" y="356" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">Normal: 50–75%</text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · Robertson 1989 · Macmillan 2000 · Gopinath 1994
      </text>
    </svg>
  );
}
