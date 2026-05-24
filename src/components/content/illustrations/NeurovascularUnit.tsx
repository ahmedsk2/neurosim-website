/**
 * Neurovascular unit + blood-brain barrier, capillary cross-section showing
 * endothelium, tight junctions, basement membrane, pericyte, astrocyte
 * end-feet, and adjacent neuron, with permeability arrows.
 *
 * Original schematic for MNM-Edu, derived from standard NVU anatomy.
 */
export function NeurovascularUnit() {
  const W = 720;
  const H = 540;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Neurovascular unit cross-section: capillary, endothelium, tight junctions, pericyte, astrocyte end-feet, neuron">
      <defs>
        <linearGradient id="nvuLumen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCA5A5" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <radialGradient id="nvuRBC" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FCA5A5" />
          <stop offset="100%" stopColor="#991B1B" />
        </radialGradient>
        <linearGradient id="nvuEndo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0F766E" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="nvuAstrocyte" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#16A34A" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="nvuPericyte" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <marker id="nvuArrG" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#5EEAD4" />
        </marker>
        <marker id="nvuArrB" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#3B82F6" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        NEUROVASCULAR UNIT · CAPILLARY CROSS-SECTION
      </text>
      <text x={W / 2} y={48} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10.5" fill="#94A3B8">
        Endothelium · tight junctions · basement membrane · pericyte · astrocyte end-feet · neuron
      </text>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BAND 1 (y=70–135): Top labels (pericyte, tight junction, etc.)   */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/* Endothelium leader + label (top-left, far from pericyte) */}
      <line x1="80" y1="180" x2="80" y2="100" stroke="#5EEAD4" strokeWidth="0.6" strokeDasharray="2 2" />
      <text x="80" y="92" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#5EEAD4">
        endothelium
      </text>

      {/* Pericyte label (above pericyte, well-separated) */}
      <line x1="240" y1="155" x2="240" y2="100" stroke="#A78BFA" strokeWidth="0.6" strokeDasharray="2 2" />
      <text x="240" y="92" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#A78BFA">
        pericyte
      </text>

      {/* Tight junction label, moved right of pericyte to avoid overlap */}
      <line x1="380" y1="190" x2="380" y2="120" stroke="#FCD34D" strokeWidth="0.6" strokeDasharray="2 2" />
      <text x="380" y="105" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">
        tight junction
      </text>
      <text x="380" y="118" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fill="#FCD34D">
        claudin-5 · occludin
      </text>

      {/* Basement membrane label, far right, well-separated */}
      <line x1="540" y1="170" x2="540" y2="100" stroke="#94A3B8" strokeWidth="0.6" strokeDasharray="2 2" />
      <text x="540" y="92" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
        basement membrane
      </text>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BAND 2 (y=140–290): Capillary with cells, RBCs, pericyte         */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/* Pericyte (top, embedded in basement membrane region) */}
      <g>
        <ellipse cx="240" cy="155" rx="34" ry="14" fill="url(#nvuPericyte)" stroke="#6D28D9" strokeWidth="1" />
        <circle cx="240" cy="155" r="6" fill="#5B21B6" opacity="0.8" />
        <line x1="206" y1="155" x2="180" y2="148" stroke="#A78BFA" strokeWidth="1.2" />
        <line x1="274" y1="155" x2="300" y2="148" stroke="#A78BFA" strokeWidth="1.2" />
      </g>

      {/* Top basement membrane band */}
      <rect x="60" y="170" width="600" height="5" fill="#94A3B8" opacity="0.6" />

      {/* Top endothelial cells with tight junctions */}
      {[80, 180, 280, 380, 480, 580].map((x, i) => (
        <g key={`endo-top-${i}`}>
          <rect x={x} y="175" width="100" height="20" fill="url(#nvuEndo)" stroke="#0F766E" strokeWidth="1" />
          <ellipse cx={x + 50} cy="185" rx="12" ry="5" fill="#0F766E" opacity="0.7" />
          {i > 0 && (
            <g>
              <line x1={x} y1="175" x2={x} y2="195" stroke="#FCD34D" strokeWidth="3.5" />
              <circle cx={x} cy="179" r="1.4" fill="#0F1A2E" />
              <circle cx={x} cy="185" r="1.4" fill="#0F1A2E" />
              <circle cx={x} cy="191" r="1.4" fill="#0F1A2E" />
            </g>
          )}
        </g>
      ))}

      {/* Capillary lumen */}
      <rect x="60" y="195" width="600" height="80" fill="url(#nvuLumen)" opacity="0.45" />

      {/* RBCs */}
      <g>
        <ellipse cx="120" cy="235" rx="22" ry="11" fill="url(#nvuRBC)" stroke="#7F1D1D" strokeWidth="0.8" />
        <ellipse cx="220" cy="231" rx="22" ry="11" fill="url(#nvuRBC)" stroke="#7F1D1D" strokeWidth="0.8" />
        <ellipse cx="320" cy="237" rx="22" ry="11" fill="url(#nvuRBC)" stroke="#7F1D1D" strokeWidth="0.8" />
        <ellipse cx="420" cy="229" rx="22" ry="11" fill="url(#nvuRBC)" stroke="#7F1D1D" strokeWidth="0.8" />
        <ellipse cx="540" cy="235" rx="22" ry="11" fill="url(#nvuRBC)" stroke="#7F1D1D" strokeWidth="0.8" />
        <ellipse cx="620" cy="233" rx="22" ry="11" fill="url(#nvuRBC)" stroke="#7F1D1D" strokeWidth="0.8" />
      </g>

      {/* Lumen label */}
      <text x="370" y="210" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FFFFFF" letterSpacing="2">
        CAPILLARY LUMEN (blood)
      </text>

      {/* Bottom endothelial cells with tight junctions */}
      {[80, 180, 280, 380, 480, 580].map((x, i) => (
        <g key={`endo-bot-${i}`}>
          <rect x={x} y="275" width="100" height="20" fill="url(#nvuEndo)" stroke="#0F766E" strokeWidth="1" />
          <ellipse cx={x + 50} cy="285" rx="12" ry="5" fill="#0F766E" opacity="0.7" />
          {i > 0 && (
            <g>
              <line x1={x} y1="275" x2={x} y2="295" stroke="#FCD34D" strokeWidth="3.5" />
              <circle cx={x} cy="279" r="1.4" fill="#0F1A2E" />
              <circle cx={x} cy="285" r="1.4" fill="#0F1A2E" />
              <circle cx={x} cy="291" r="1.4" fill="#0F1A2E" />
            </g>
          )}
        </g>
      ))}

      {/* Bottom basement membrane band */}
      <rect x="60" y="295" width="600" height="5" fill="#94A3B8" opacity="0.6" />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BAND 3 (y=305–340): Astrocyte end-feet wrapping the abluminal    */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {[100, 200, 300, 400, 500, 600].map((x, i) => (
        <ellipse key={`endfeet-${i}`} cx={x} cy="312" rx="40" ry="10" fill="url(#nvuAstrocyte)" stroke="#16A34A" strokeWidth="0.8" />
      ))}

      {/* End-foot label (left side) */}
      <line x1="100" y1="312" x2="40" y2="345" stroke="#86EFAC" strokeWidth="0.6" strokeDasharray="2 2" />
      <text x="36" y="356" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#86EFAC">
        astrocyte
      </text>
      <text x="36" y="368" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#86EFAC">
        end-foot
      </text>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BAND 4 (y=340–410): Astrocyte body + neuron in dedicated row     */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/* Astrocyte body */}
      <g transform="translate(280, 380)">
        <circle r="14" fill="#86EFAC" stroke="#16A34A" strokeWidth="1.2" />
        <circle r="6" fill="#16A34A" opacity="0.9" />
        {/* Process arms toward end-feet (going up) */}
        <line x1="0" y1="-14" x2="-30" y2="-50" stroke="#16A34A" strokeWidth="2.5" />
        <line x1="0" y1="-14" x2="0" y2="-55" stroke="#16A34A" strokeWidth="2.5" />
        <line x1="0" y1="-14" x2="30" y2="-50" stroke="#16A34A" strokeWidth="2.5" />
        {/* Arm reaching toward neuron */}
        <line x1="14" y1="0" x2="60" y2="0" stroke="#16A34A" strokeWidth="1.8" />
        <text x="0" y="32" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#86EFAC">
          astrocyte
        </text>
      </g>

      {/* Neuron */}
      <g transform="translate(420, 380)">
        <ellipse cx="0" cy="0" rx="22" ry="16" fill="#FBBF24" stroke="#B45309" strokeWidth="1.2" />
        <circle cx="0" cy="0" r="6" fill="#92400E" opacity="0.7" />
        {/* Dendrites */}
        <line x1="-22" y1="-3" x2="-50" y2="-15" stroke="#B45309" strokeWidth="1.4" />
        <line x1="-22" y1="3" x2="-55" y2="10" stroke="#B45309" strokeWidth="1.4" />
        <line x1="22" y1="-3" x2="55" y2="-15" stroke="#B45309" strokeWidth="1.4" />
        <line x1="22" y1="3" x2="50" y2="10" stroke="#B45309" strokeWidth="1.4" />
        {/* Axon down (away from arrows) */}
        <line x1="0" y1="16" x2="0" y2="40" stroke="#B45309" strokeWidth="2.5" />
        <text x="0" y="-26" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FBBF24">
          neuron
        </text>
      </g>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BAND 5 (y=440–510): Permeability arrows in clean grid            */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <text x="60" y="455" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        WHAT CROSSES THE BBB
      </text>

      {/* Row 1,left: O2/CO2 free diffusion */}
      <g transform="translate(60, 470)">
        <line x1="0" y1="6" x2="36" y2="6" stroke="#5EEAD4" strokeWidth="2.2" markerEnd="url(#nvuArrG)" />
        <text x="44" y="4" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">O₂ · CO₂</text>
        <text x="44" y="16" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">free diffusion · seconds</text>
      </g>

      {/* Row 1,right: GLUT1 glucose */}
      <g transform="translate(260, 470)">
        <line x1="0" y1="6" x2="36" y2="6" stroke="#3B82F6" strokeWidth="2.2" markerEnd="url(#nvuArrB)" />
        <text x="44" y="4" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#3B82F6">glucose</text>
        <text x="44" y="16" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">GLUT1 facilitated</text>
      </g>

      {/* Row 1,far right: LAT1 amino acids */}
      <g transform="translate(460, 470)">
        <line x1="0" y1="6" x2="36" y2="6" stroke="#3B82F6" strokeWidth="2.2" strokeDasharray="3 2" markerEnd="url(#nvuArrB)" />
        <text x="44" y="4" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#3B82F6">L-DOPA · AAs</text>
        <text x="44" y="16" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">LAT1 transporter</text>
      </g>

      {/* Row 2,center: drugs blocked */}
      <g transform="translate(60, 500)">
        <line x1="0" y1="6" x2="36" y2="6" stroke="#EF4444" strokeWidth="2.2" strokeDasharray="3 2" />
        <line x1="22" y1="0" x2="14" y2="12" stroke="#EF4444" strokeWidth="2" />
        <text x="44" y="4" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#EF4444">most drugs · proteins · large polar molecules</text>
        <text x="44" y="16" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">excluded by tight junctions + active efflux (P-gp, MRPs)</text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · standard neurovascular-unit anatomy
      </text>
    </svg>
  );
}
