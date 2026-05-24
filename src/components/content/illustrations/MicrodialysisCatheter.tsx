/**
 * Cerebral microdialysis catheter, magnified coaxial cross-section showing
 * inner perfusate inflow, semipermeable membrane (20 kDa MWCO), analyte
 * diffusion, and bedside vial collection.
 *
 * Original schematic for MNM-Edu, derived from microdialysis device principles.
 */
export function MicrodialysisCatheter() {
  const W = 720;
  const H = 460;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Microdialysis catheter cross-section with semipermeable membrane and analyte diffusion">
      <defs>
        <linearGradient id="mdcShaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="mdcBrain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBC8C8" />
          <stop offset="100%" stopColor="#D88090" />
        </linearGradient>
        <pattern id="mdcMembrane" patternUnits="userSpaceOnUse" width="6" height="6">
          <rect width="6" height="6" fill="#FCD34D" opacity="0.6" />
          <circle cx="3" cy="3" r="0.8" fill="#0F1A2E" />
        </pattern>
        <marker id="mdcArrIn" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#5EEAD4" />
        </marker>
        <marker id="mdcArrOut" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#3B82F6" />
        </marker>
        <marker id="mdcArrAna" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#FCD34D" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        CEREBRAL MICRODIALYSIS · CATHETER + MEMBRANE
      </text>

      {/* ─── Top-left: Bolt + skull insertion ─── */}
      <g transform="translate(60, 60)">
        <text x="80" y="14" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">
          INSERTION
        </text>

        <rect x="0" y="32" width="160" height="14" fill="#FBC8C8" stroke="#7A4858" strokeWidth="0.7" />
        <text x="-4" y="42" textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fill="#FFFFFF">scalp</text>
        <rect x="0" y="46" width="160" height="14" fill="#E8DFC9" stroke="#7C6E50" strokeWidth="0.7" />
        <text x="-4" y="56" textAnchor="end" fontFamily="Consolas, monospace" fontSize="9" fill="#FFFFFF">skull</text>
        <rect x="0" y="60" width="160" height="6" fill="#7DD3FC" opacity="0.6" />
        <text x="-4" y="65" textAnchor="end" fontFamily="Consolas, monospace" fontSize="8" fill="#FFFFFF">CSF</text>
        <rect x="0" y="66" width="160" height="100" fill="url(#mdcBrain)" stroke="#A04060" strokeWidth="0.8" />

        <rect x="74" y="20" width="12" height="42" fill="url(#mdcShaft)" stroke="#0F1A2E" strokeWidth="1" />
        <rect x="68" y="14" width="24" height="8" rx="2" fill="#475569" stroke="#0F1A2E" strokeWidth="0.8" />

        <line x1="80" y1="62" x2="80" y2="155" stroke="#FCD34D" strokeWidth="2.2" />

        {/* Active membrane region */}
        <rect x="76" y="135" width="8" height="20" fill="url(#mdcMembrane)" stroke="#92400E" strokeWidth="1" rx="1.5" />

        {/* Diffusion glow */}
        <circle cx="80" cy="145" r="18" fill="#FCD34D" opacity="0.12" />
        <circle cx="80" cy="145" r="11" fill="#FCD34D" opacity="0.18" />

        <line x1="84" y1="145" x2="170" y2="145" stroke="#FCD34D" strokeWidth="0.8" strokeDasharray="2 2" />
        <text x="174" y="143" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">10-mm</text>
        <text x="174" y="155" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">membrane</text>

        <text x="80" y="180" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8" fontStyle="italic">
          (zoom →)
        </text>
      </g>

      {/* ─── Right: Magnified membrane cross-section ─── */}
      <g transform="translate(280, 70)">
        <text x="200" y="4" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">
          MAGNIFIED MEMBRANE CROSS-SECTION
        </text>

        <rect x="0" y="14" width="400" height="160" fill="url(#mdcBrain)" opacity="0.8" stroke="#A04060" strokeWidth="0.8" rx="4" />
        {/* "brain interstitial fluid" label removed to free up the analyte-arrow row;
            the pink brain field + the bottom-row [analyte]ᵢˢᶠ notation convey the same. */}

        {/* Catheter outer wall */}
        <rect x="50" y="60" width="300" height="60" rx="20" fill="#0F1A2E" stroke="#FCD34D" strokeWidth="2" />
        <rect x="120" y="60" width="160" height="60" fill="url(#mdcMembrane)" stroke="#92400E" strokeWidth="1" rx="2" />

        {/* Inner perfusate tube */}
        <rect x="50" y="78" width="300" height="22" rx="8" fill="#1A2842" stroke="#5EEAD4" strokeWidth="1.2" />

        <line x1="60" y1="89" x2="340" y2="89" stroke="#5EEAD4" strokeWidth="1.2" markerEnd="url(#mdcArrIn)" />
        <text x="195" y="83" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#5EEAD4">
          PERFUSATE IN · 0.3 µL/min · artificial CSF
        </text>

        <line x1="340" y1="110" x2="60" y2="110" stroke="#3B82F6" strokeWidth="1.2" markerEnd="url(#mdcArrOut)" />
        <text x="195" y="105" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#3B82F6">
          DIALYSATE OUT → vial
        </text>

        <text x="200" y="56" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">
          semipermeable membrane (20 kDa MWCO)
        </text>

        {/* Analyte diffusion arrows */}
        {[150, 180, 220, 250, 280].map((x) => (
          <g key={x}>
            <line x1={x} y1="40" x2={x} y2="76" stroke="#FCD34D" strokeWidth="1.4" markerEnd="url(#mdcArrAna)" opacity="0.85" />
          </g>
        ))}
        <text x="215" y="34" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#FCD34D">
          ↓ glucose · lactate · pyruvate · glycerol · glutamate
        </text>

        {[150, 180, 220, 250, 280].map((x) => (
          <g key={`b${x}`}>
            <line x1={x} y1="158" x2={x} y2="120" stroke="#FCD34D" strokeWidth="1.4" markerEnd="url(#mdcArrAna)" opacity="0.85" />
          </g>
        ))}

        <text x="14" y="160" fontFamily="Consolas, monospace" fontSize="9" fill="#FCD34D">
          [analyte]ᵢˢᶠ &gt; [analyte]ₚₑᵣf → diffusion in
        </text>
      </g>

      {/* ─── Bottom: Bedside analyser + interpretation ─── */}
      <g transform="translate(60, 280)">
        <text x="0" y="0" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          BEDSIDE ANALYSER
        </text>

        <g transform="translate(0, 14)">
          <rect x="0" y="0" width="100" height="100" rx="8" fill="#152238" stroke="#94A3B8" strokeWidth="1.2" />
          <circle cx="50" cy="50" r="36" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 50 + 28 * Math.cos(rad);
            const cy = 50 + 28 * Math.sin(rad);
            return (
              <rect key={deg} x={cx - 4} y={cy - 6} width="8" height="12" rx="1.5" fill="#3B82F6" stroke="#0F1A2E" strokeWidth="0.6" />
            );
          })}
          <text x="50" y="54" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">vials</text>
          <text x="50" y="118" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fill="#94A3B8">q30–60 min</text>
        </g>

        <g transform="translate(160, 14)">
          <rect width="500" height="100" rx="6" fill="#152238" stroke="#2a3a55" />
          <text x="14" y="20" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">
            PATTERN INTERPRETATION (adult thresholds, pediatric sparse)
          </text>

          {[
            { label: 'Normal', lp: '< 25', glu: 'normal', color: '#10B981' },
            { label: 'Mitochondrial', lp: '≥ 25', glu: 'normal', color: '#FCD34D' },
            { label: 'Ischaemia', lp: '> 40', glu: '< 0.8 mmol/L', color: '#EF4444' },
            { label: 'Hyperglycolysis', lp: 'any', glu: 'high', color: '#A78BFA' },
            { label: 'Membrane breakdown', lp: 'any', glu: 'any (↑↑ glycerol)', color: '#F59E0B' },
          ].map((row, i) => (
            <g key={row.label} transform={`translate(14, ${36 + i * 12})`}>
              <circle cx="3" cy="-3" r="3" fill={row.color} />
              <text x="14" y="0" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill={row.color}>
                {row.label}
              </text>
              <text x="160" y="0" fontFamily="Consolas, monospace" fontSize="9" fill="#FFFFFF">
                L/P {row.lp}
              </text>
              <text x="260" y="0" fontFamily="Consolas, monospace" fontSize="9" fill="#FFFFFF">
                glu {row.glu}
              </text>
            </g>
          ))}
        </g>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · Hutchinson et al. consensus · device principles
      </text>
    </svg>
  );
}
