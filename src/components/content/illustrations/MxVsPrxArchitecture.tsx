/**
 * Mx vs PRx, same Pearson, different signal.
 * Visual side-by-side of the moving-correlation pipeline:
 *   • PRx: MAP × ICP slow waves → 30 paired 10-s averages → Pearson r
 *   • Mx:  MAP × MFV slow waves → 30 paired 10-s averages → Pearson r
 *
 * Original schematic for MNM-Edu, derived from the published Pearson-window
 * convention used by both indices.
 */
export function MxVsPrxArchitecture() {
  const W = 720;
  const H = 380;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="PRx vs Mx, identical correlation pipeline, different second signal">
      <defs>
        <marker id="mxArrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#94A3B8" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        Mx · SAME PEARSON, DIFFERENT SECOND SIGNAL
      </text>
      <text x={W / 2} y={48} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10.5" fill="#94A3B8">
        Both indices: 30 paired 10-second averages → moving Pearson r → live index value
      </text>

      {/* Common MAP source at top */}
      <g>
        <rect x="270" y="68" width="180" height="40" rx="6" fill="#152238" stroke="#5EEAD4" strokeWidth="1.5" />
        <text x="360" y="86" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="1">
          MAP, slow waves
        </text>
        <text x="360" y="100" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
          Mayer-band ~ 0.05 Hz
        </text>
      </g>

      {/* Two arrows fanning out to ICP and MFV */}
      <line x1="320" y1="108" x2="180" y2="148" stroke="#94A3B8" strokeWidth="1.4" markerEnd="url(#mxArrow)" />
      <line x1="400" y1="108" x2="540" y2="148" stroke="#94A3B8" strokeWidth="1.4" markerEnd="url(#mxArrow)" />

      {/* ICP signal box (left) */}
      <g>
        <rect x="60" y="148" width="240" height="40" rx="6" fill="#3B0F1A" stroke="#EF4444" strokeWidth="1.2" />
        <text x="180" y="166" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#EF4444" letterSpacing="1">
          ICP, invasive bolt
        </text>
        <text x="180" y="180" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
          requires probe / EVD
        </text>
      </g>

      {/* MFV signal box (right) */}
      <g>
        <rect x="420" y="148" width="240" height="40" rx="6" fill="#3B2C0F" stroke="#FCD34D" strokeWidth="1.2" />
        <text x="540" y="166" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#FCD34D" letterSpacing="1">
          MFV, non-invasive TCD
        </text>
        <text x="540" y="180" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
          requires fixation probe
        </text>
      </g>

      {/* Down arrows */}
      <line x1="180" y1="188" x2="180" y2="212" stroke="#94A3B8" strokeWidth="1.4" markerEnd="url(#mxArrow)" />
      <line x1="540" y1="188" x2="540" y2="212" stroke="#94A3B8" strokeWidth="1.4" markerEnd="url(#mxArrow)" />

      {/* Common pipeline (middle row): "decimate to 10-s averages, slide a 30-pair window" */}
      <g>
        <rect x="60" y="212" width="240" height="48" rx="6" fill="#152238" stroke="#2a3a55" />
        <text x="180" y="232" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">
          Decimate ABP, ICP →
        </text>
        <text x="180" y="248" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">
          30 paired 10-s averages
        </text>

        <rect x="420" y="212" width="240" height="48" rx="6" fill="#152238" stroke="#2a3a55" />
        <text x="540" y="232" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">
          Decimate ABP, MFV →
        </text>
        <text x="540" y="248" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">
          30 paired 10-s averages
        </text>
      </g>

      <line x1="180" y1="260" x2="180" y2="284" stroke="#94A3B8" strokeWidth="1.4" markerEnd="url(#mxArrow)" />
      <line x1="540" y1="260" x2="540" y2="284" stroke="#94A3B8" strokeWidth="1.4" markerEnd="url(#mxArrow)" />

      {/* Final indices */}
      <g>
        <rect x="60" y="284" width="240" height="56" rx="6" fill="#3B0F1A" stroke="#EF4444" strokeWidth="1.5" />
        <text x="180" y="304" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="13" fontWeight="700" fill="#EF4444" letterSpacing="2">
          PRx
        </text>
        <text x="180" y="320" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">
          r (MAP, ICP)
        </text>
        <text x="180" y="334" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
          impaired ≥ 0.25
        </text>

        <rect x="420" y="284" width="240" height="56" rx="6" fill="#3B2C0F" stroke="#FCD34D" strokeWidth="1.5" />
        <text x="540" y="304" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="13" fontWeight="700" fill="#FCD34D" letterSpacing="2">
          Mx
        </text>
        <text x="540" y="320" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fill="#FFFFFF">
          r (MAP, MFV)
        </text>
        <text x="540" y="334" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
          impaired ≥ 0.30
        </text>
      </g>

      <text x={W / 2} y={H - 6} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · pipeline architecture per Czosnyka 1997 (PRx) and 1996 (Mx)
      </text>
    </svg>
  );
}
