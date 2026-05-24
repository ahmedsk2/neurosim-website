/**
 * Pupillary light reflex pathway, top-down view with both eyes, optic
 * chiasm crossover, pretectal + Edinger-Westphal nuclei, ciliary ganglia,
 * and the efferent CN III loop. Highlights the consensual reflex and
 * uncal-herniation lesion site.
 *
 * Original schematic for MNM-Edu, derived from standard neuroanatomy
 * descriptions of the pupillary reflex arc.
 */
export function PupillaryPathway() {
  const W = 720;
  const H = 480;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Pupillary light reflex pathway with bilateral eyes, chiasm, midbrain nuclei, and CN III efferent loop">
      <defs>
        <linearGradient id="ppEye" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
        <radialGradient id="ppLight" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
        </radialGradient>
        <marker id="ppArrAff" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#5EEAD4" />
        </marker>
        <marker id="ppArrEff" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#F59E0B" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        PUPILLARY LIGHT REFLEX · TOP-DOWN VIEW
      </text>
      <text x={W / 2} y={48} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10.5" fill="#94A3B8">
        retina → CN II → chiasm → pretectal n. → Edinger-Westphal → CN III → ciliary g. → iris sphincter
      </text>

      {/* Brainstem / midbrain background */}
      <ellipse cx={W / 2} cy={250} rx="200" ry="100" fill="#152238" stroke="#475569" strokeWidth="1.5" opacity="0.7" />
      {/* "midbrain (rostral brainstem)" label moved below the EW labels block (which sits at y=325-337) to avoid collision with "parasympathetic origin" */}
      <text x={W / 2} y={355} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9.5" fill="#94A3B8" fontStyle="italic">
        midbrain (rostral brainstem)
      </text>

      {/* ───────────  Left Eye  ─────────── */}
      <g transform={`translate(${130}, ${250})`}>
        {/* Sclera */}
        <ellipse cx="0" cy="0" rx="44" ry="34" fill="url(#ppEye)" stroke="#475569" strokeWidth="1.2" />
        {/* Iris */}
        <circle cx="0" cy="0" r="22" fill="#5DADE2" stroke="#1E5681" strokeWidth="1" />
        {/* Pupil, constricted (under light) */}
        <circle cx="0" cy="0" r="6" fill="#0F1A2E" />
        {/* Highlight */}
        <circle cx="-6" cy="-6" r="3" fill="#FFFFFF" opacity="0.7" />

        {/* Light incident */}
        <line x1="-95" y1="-30" x2="-50" y2="-10" stroke="#FCD34D" strokeWidth="2.5" markerEnd="url(#ppArrEff)" />
        <line x1="-95" y1="-15" x2="-50" y2="0" stroke="#FCD34D" strokeWidth="2.5" markerEnd="url(#ppArrEff)" />
        <line x1="-95" y1="0" x2="-50" y2="10" stroke="#FCD34D" strokeWidth="2.5" markerEnd="url(#ppArrEff)" />
        <ellipse cx="-115" cy="-5" rx="22" ry="14" fill="url(#ppLight)" />
        <text x="-115" y="-30" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FCD34D">LIGHT</text>
        <text x="-115" y="-18" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8.5" fill="#FCD34D">stimulus</text>

        {/* Eye label */}
        <text x="0" y="58" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">L EYE</text>
        <text x="0" y="72" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="9.5" fill="#10B981">direct constriction</text>
      </g>

      {/* ───────────  Right Eye  ─────────── */}
      <g transform={`translate(${590}, ${250})`}>
        {/* Sclera */}
        <ellipse cx="0" cy="0" rx="44" ry="34" fill="url(#ppEye)" stroke="#475569" strokeWidth="1.2" />
        {/* Iris */}
        <circle cx="0" cy="0" r="22" fill="#5DADE2" stroke="#1E5681" strokeWidth="1" />
        {/* Pupil, also constricted (consensual) */}
        <circle cx="0" cy="0" r="6" fill="#0F1A2E" />
        <circle cx="-6" cy="-6" r="3" fill="#FFFFFF" opacity="0.7" />

        {/* Eye label */}
        <text x="0" y="58" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">R EYE</text>
        <text x="0" y="72" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="9.5" fill="#10B981">consensual constriction</text>
      </g>

      {/* ───────────  Optic nerves + chiasm  ─────────── */}
      {/* L afferent, to chiasm */}
      <line x1="174" y1="250" x2="320" y2="220" stroke="#5EEAD4" strokeWidth="2.5" />
      <text x="220" y="225" fontFamily="Consolas, monospace" fontSize="9.5" fontWeight="700" fill="#5EEAD4">CN II (afferent)</text>

      {/* R afferent, to chiasm */}
      <line x1="546" y1="250" x2="400" y2="220" stroke="#5EEAD4" strokeWidth="2.5" />
      <text x="445" y="225" fontFamily="Consolas, monospace" fontSize="9.5" fontWeight="700" fill="#5EEAD4">CN II</text>

      {/* Chiasm crossover */}
      <g transform="translate(360, 215)">
        <path d="M -40 5 Q 0 0 40 5" fill="none" stroke="#5EEAD4" strokeWidth="2.5" />
        <path d="M 40 5 Q 0 10 -40 5" fill="none" stroke="#5EEAD4" strokeWidth="2.5" />
        <ellipse cx="0" cy="5" rx="48" ry="9" fill="none" stroke="#94A3B8" strokeWidth="0.6" strokeDasharray="2 2" />
        <text x="0" y="-2" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#94A3B8">OPTIC CHIASM</text>
      </g>

      {/* Optic tracts going to pretectal nuclei */}
      <line x1="320" y1="225" x2="290" y2="265" stroke="#5EEAD4" strokeWidth="2" strokeDasharray="2 2" markerEnd="url(#ppArrAff)" />
      <line x1="400" y1="225" x2="430" y2="265" stroke="#5EEAD4" strokeWidth="2" strokeDasharray="2 2" markerEnd="url(#ppArrAff)" />

      {/* ───────────  Pretectal nuclei (paired)  ─────────── */}
      <g>
        <ellipse cx="295" cy="275" rx="16" ry="11" fill="#FCD34D" stroke="#92400E" strokeWidth="1" />
        <text x="295" y="278" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fontWeight="700" fill="#0F1A2E">PT</text>
        <ellipse cx="425" cy="275" rx="16" ry="11" fill="#FCD34D" stroke="#92400E" strokeWidth="1" />
        <text x="425" y="278" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fontWeight="700" fill="#0F1A2E">PT</text>
        <text x="360" y="265" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">PRETECTAL NUCLEI (paired)</text>
      </g>

      {/* PT → EW bilaterally (commissures) */}
      <path d="M 311 280 Q 360 285 409 280" stroke="#FCD34D" strokeWidth="1.4" strokeDasharray="2 2" fill="none" />

      {/* ───────────  Edinger-Westphal nuclei  ─────────── */}
      <g>
        <ellipse cx="320" cy="305" rx="13" ry="9" fill="#F97316" stroke="#7C2D12" strokeWidth="1" />
        <text x="320" y="308" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fontWeight="700" fill="#0F1A2E">EW</text>
        <ellipse cx="400" cy="305" rx="13" ry="9" fill="#F97316" stroke="#7C2D12" strokeWidth="1" />
        <text x="400" y="308" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fontWeight="700" fill="#0F1A2E">EW</text>
        <text x="360" y="325" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#F97316">EDINGER-WESTPHAL</text>
        <text x="360" y="337" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8.5" fill="#94A3B8">parasympathetic origin</text>
      </g>

      {/* PT → EW (intrinsic) */}
      <line x1="298" y1="285" x2="318" y2="298" stroke="#FCD34D" strokeWidth="1.2" strokeDasharray="1 2" />
      <line x1="422" y1="285" x2="402" y2="298" stroke="#FCD34D" strokeWidth="1.2" strokeDasharray="1 2" />

      {/* ───────────  CN III efferent paths  ─────────── */}
      {/* L EW → L eye (efferent CN III loop) */}
      <path d="M 310 308 Q 240 350 175 280" fill="none" stroke="#F59E0B" strokeWidth="2.2" markerEnd="url(#ppArrEff)" />
      <text x="190" y="370" fontFamily="Consolas, monospace" fontSize="9.5" fontWeight="700" fill="#F59E0B">CN III (efferent)</text>

      {/* R EW → R eye */}
      <path d="M 410 308 Q 480 350 545 280" fill="none" stroke="#F59E0B" strokeWidth="2.2" markerEnd="url(#ppArrEff)" />
      <text x="475" y="370" fontFamily="Consolas, monospace" fontSize="9.5" fontWeight="700" fill="#F59E0B">CN III (efferent)</text>

      {/* Ciliary ganglion */}
      <circle cx="220" cy="320" r="6" fill="#F97316" stroke="#7C2D12" strokeWidth="1" />
      <text x="220" y="338" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fill="#F97316">ciliary g.</text>
      <circle cx="500" cy="320" r="6" fill="#F97316" stroke="#7C2D12" strokeWidth="1" />
      <text x="500" y="338" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8" fill="#F97316">ciliary g.</text>

      {/* Tentorial edge / herniation lesion site */}
      <g>
        <path d="M 230 290 Q 235 280 245 285" stroke="#EF4444" strokeWidth="2.5" fill="none" />
        <circle cx="237" cy="287" r="9" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="2 2" />
        <text x="237" y="270" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#EF4444">⚠ tentorial edge</text>
      </g>

      {/* ───────────  Bottom: Lesion key + interpretation  ─────────── */}
      <g transform="translate(40, 395)">
        <rect width="640" height="86" rx="6" fill="#152238" stroke="#2a3a55" />

        <text x="14" y="22" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#EF4444" letterSpacing="2">
          UNCAL HERNIATION
        </text>
        <text x="14" y="40" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          Mass effect compresses CN III at the tentorial edge. Parasympathetic fibres run
        </text>
        <text x="14" y="55" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          on the dorsal surface of the nerve and fail first → ipsilateral pupil dilates and fixes.
        </text>
        <text x="14" y="64" fontFamily="Segoe UI, sans-serif" fontSize="10" fontStyle="italic" fill="#94A3B8">
          Direct &amp; consensual reflexes both absent on the affected side when light is shone there.
        </text>
        <text x="14" y="76" fontFamily="Segoe UI, sans-serif" fontSize="10" fontStyle="italic" fill="#94A3B8">
          (light to unaffected eye: both pupils still constrict via the intact contralateral arc.)
        </text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · standard neuroanatomy of the pupillary reflex arc
      </text>
    </svg>
  );
}
