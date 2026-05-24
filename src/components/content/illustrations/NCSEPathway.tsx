/**
 * NCSE / pediatric SE diagnostic and treatment pathway, flowchart with
 * decision diamond, action boxes, time-anchored treatment ladder, and
 * pediatric-specific safety notes.
 *
 * NCSE = non-convulsive status epilepticus.
 * SE = status epilepticus (seizure ≥ 5 min, or recurrent without recovery).
 *
 * Original schematic for MNM-Edu, adapted from ESETT 2019 (pediatric
 * subgroup), ACNS 2021 critical-care EEG terminology, NCS / Brophy 2012,
 * AES 2016 guideline, and current pediatric NCS expert recommendations.
 */
export function NCSEPathway() {
  const W = 720;
  const H = 520;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Pediatric NCSE / status epilepticus diagnostic and treatment pathway flowchart">
      <defs>
        <marker id="ncseArr" viewBox="0 0 8 8" refX="4" refY="6" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 8 0 L 4 6 Z" fill="#94A3B8" />
        </marker>
        <marker id="ncseArrG" viewBox="0 0 8 8" refX="4" refY="6" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 8 0 L 4 6 Z" fill="#10B981" />
        </marker>
        <marker id="ncseArrR" viewBox="0 0 8 8" refX="4" refY="6" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 8 0 L 4 6 Z" fill="#EF4444" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      {/* Title */}
      <text x={W / 2} y={26} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        PEDIATRIC SE / NCSE · DIAGNOSTIC &amp; TREATMENT PATHWAY
      </text>
      <text x={W / 2} y={44} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9.5" fill="#94A3B8">
        SE = status epilepticus · NCSE = non-convulsive status epilepticus
      </text>

      {/* ═══ Top, Suspect ═══ */}
      <g>
        <rect x="40" y="58" width="640" height="62" rx="8" fill="#3B2C0F" stroke="#FCD34D" strokeWidth="2" />
        <text x={W / 2} y="78" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#FCD34D" letterSpacing="2">
          SUSPECT SE / NCSE
        </text>
        <text x={W / 2} y="96" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          Convulsive ≥ 5 min · subtle motor signs · unexplained altered consciousness
        </text>
        <text x={W / 2} y="110" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
          aEEG narrowing · post-convulsive failure to wake · post-arrest / encephalitis / TBI
        </text>
      </g>

      <line x1={W / 2} y1="120" x2={W / 2} y2="148" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#ncseArr)" />

      {/* ═══ Action, full-montage cEEG ═══ */}
      <g>
        <rect x="80" y="148" width="560" height="58" rx="8" fill="#0F2E22" stroke="#5EEAD4" strokeWidth="2" />
        <text x={W / 2} y="168" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="1">
          STABILISE (ABC) + FULL-MONTAGE cEEG · TARGET &lt; 60 MIN
        </text>
        <text x={W / 2} y="186" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10.5" fill="#FFFFFF">
          aEEG cannot diagnose NCSE, only the full montage can
        </text>
        <text x={W / 2} y="200" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
          glucose · electrolytes · ABG · IV access · time the seizure
        </text>
      </g>

      <line x1={W / 2} y1="206" x2={W / 2} y2="232" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#ncseArr)" />

      {/* ═══ Decision diamond ═══ */}
      <g transform={`translate(${W / 2}, 260)`}>
        <polygon points="0,-30 95,0 0,30 -95,0" fill="#1A2842" stroke="#5EEAD4" strokeWidth="2" />
        <text x="0" y="-3" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#5EEAD4">
          cEEG result?
        </text>
        <text x="0" y="14" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
          rhythmic / evolving?
        </text>
      </g>

      {/* ═══ NO branch, left ═══ */}
      <line x1="265" y1="260" x2="195" y2="260" stroke="#10B981" strokeWidth="1.5" markerEnd="url(#ncseArrG)" />
      <text x="230" y="252" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#10B981">
        NO
      </text>

      <g>
        <rect x="40" y="225" width="155" height="68" rx="6" fill="#0F2E22" stroke="#10B981" strokeWidth="1.5" />
        <text x="117" y="246" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#10B981" letterSpacing="1">
          NCSE EXCLUDED
        </text>
        <text x="117" y="264" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
          Pursue alternative
        </text>
        <text x="117" y="278" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
          diagnosis &amp; supportive
        </text>
      </g>

      {/* ═══ YES branch, right ═══ */}
      <line x1="455" y1="260" x2="525" y2="260" stroke="#EF4444" strokeWidth="1.5" markerEnd="url(#ncseArrR)" />
      <text x="490" y="252" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#EF4444">
        YES
      </text>

      <g>
        <rect x="525" y="225" width="155" height="68" rx="6" fill="#3B0F1A" stroke="#EF4444" strokeWidth="1.5" />
        <text x="602" y="246" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#EF4444" letterSpacing="1">
          SE / NCSE CONFIRMED
        </text>
        <text x="602" y="264" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
          Treat per ladder
        </text>
        <text x="602" y="278" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
          (right) →
        </text>
      </g>

      {/* ═══ Treatment ladder (right side, time-anchored) ═══ */}
      <line x1="602" y1="293" x2="602" y2="318" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#ncseArr)" />

      <g>
        <rect x="425" y="318" width="255" height="40" rx="4" fill="#3B2C0F" stroke="#FCD34D" strokeWidth="1.2" />
        <text x="552" y="334" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FCD34D">
          5–20 min · 1st-line BZD
        </text>
        <text x="552" y="350" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
          Midazolam 0.2 mg/kg IM (max 10) or 0.1 mg/kg IV
        </text>
      </g>

      <line x1="552" y1="358" x2="552" y2="378" stroke="#94A3B8" strokeWidth="1.2" markerEnd="url(#ncseArr)" />

      <g>
        <rect x="425" y="378" width="255" height="40" rx="4" fill="#3B2C0F" stroke="#FCD34D" strokeWidth="1.2" />
        <text x="552" y="394" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FCD34D">
          20–40 min · 2nd-line (established SE)
        </text>
        <text x="552" y="410" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
          Levetiracetam 60 / Fos-PHT 20 PE / VPA 40 mg/kg
        </text>
      </g>

      <line x1="552" y1="418" x2="552" y2="438" stroke="#94A3B8" strokeWidth="1.2" markerEnd="url(#ncseArr)" />

      <g>
        <rect x="425" y="438" width="255" height="40" rx="4" fill="#3B0F1A" stroke="#EF4444" strokeWidth="1.2" />
        <text x="552" y="454" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#EF4444">
          &gt; 40 min · refractory → continuous infusion
        </text>
        <text x="552" y="470" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
          Midazolam infusion ± ketamine · target on cEEG
        </text>
      </g>

      {/* ═══ Left "consider" panel ═══ */}
      <g>
        <rect x="40" y="318" width="180" height="160" rx="6" fill="#152238" stroke="#A78BFA" strokeWidth="1" />
        <text x="130" y="338" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#A78BFA" letterSpacing="2">
          ALSO CONSIDER
        </text>
        <text x="54" y="358" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">• Fever / sepsis workup</text>
        <text x="54" y="376" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">• Toxic-metabolic screen</text>
        <text x="54" y="394" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">• Imaging (focal signs)</text>
        <text x="54" y="412" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">• Encephalitis / HSV PCR</text>
        <text x="54" y="430" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">• Autoimmune panel</text>
        <text x="54" y="448" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">• Pyridoxine (young)</text>
        <text x="54" y="468" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8" fontStyle="italic">aetiology drives next step</text>
      </g>

      {/* ═══ Centre, wean note ═══ */}
      <g>
        <rect x="240" y="318" width="170" height="50" rx="6" fill="#152238" stroke="#5EEAD4" strokeWidth="1" />
        <text x="325" y="336" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4" letterSpacing="1">
          BEFORE WEANING
        </text>
        <text x="325" y="352" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="9.5" fill="#FFFFFF">
          24 h seizure-free on cEEG
        </text>
        <text x="325" y="364" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="9.5" fill="#FFFFFF">
          before reducing infusions
        </text>
      </g>

      <g>
        <rect x="240" y="378" width="170" height="100" rx="6" fill="#152238" stroke="#FCD34D" strokeWidth="1" />
        <text x="325" y="396" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FCD34D" letterSpacing="1">
          PEDIATRIC SAFETY
        </text>
        <text x="252" y="414" fontFamily="Segoe UI, sans-serif" fontSize="9.5" fill="#FFFFFF">• Avoid prolonged</text>
        <text x="252" y="426" fontFamily="Segoe UI, sans-serif" fontSize="9.5" fill="#FFFFFF">  propofol &lt; 16 yr (PRIS)</text>
        <text x="252" y="442" fontFamily="Segoe UI, sans-serif" fontSize="9.5" fill="#FFFFFF">• Avoid valproate in</text>
        <text x="252" y="454" fontFamily="Segoe UI, sans-serif" fontSize="9.5" fill="#FFFFFF">  POLG / mitochondrial</text>
        <text x="252" y="470" fontFamily="Segoe UI, sans-serif" fontSize="9.5" fill="#FFFFFF">• Cardiac monitor on Fos-PHT</text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · ESETT 2019 · ACNS 2021 · NCS / Brophy 2012 · AES 2016 · pediatric NCS expert recommendations
      </text>
    </svg>
  );
}
