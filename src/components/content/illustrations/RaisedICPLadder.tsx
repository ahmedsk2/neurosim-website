/**
 * Raised-ICP escalation ladder, pediatric bedside flow with full-width
 * tier bars, connector arrows, and "if response inadequate → next tier"
 * labels on each connector.
 *
 * Original schematic for MNM-Edu, adapted from PBTF / Kochanek 2019 pediatric
 * severe-TBI tier framework + current pediatric NCS / ESPNIC consensus.
 */
export function RaisedICPLadder() {
  const W = 720;
  const H = 500;

  const tierX = 16;
  const tierW = 688;

  const tiers = [
    {
      y: 70,
      label: 'TIER 0 · CONFIRM SIGNAL',
      detail: 'Transducer level · zero · clean waveform · sustained > 5 min',
      color: '#94A3B8',
      bg: '#1F2937',
    },
    {
      y: 138,
      label: 'TIER 1 · FIRST-LINE',
      detail: 'Head-up 30° · sedation · normocapnia · normothermia · Na 145–150 · drain EVD',
      color: '#10B981',
      bg: '#0F2E22',
    },
    {
      y: 206,
      label: 'TIER 2 · HYPEROSMOLAR',
      detail: '3% NaCl 3–5 mL/kg over 10–20 min  ·  OR mannitol 0.25–1 g/kg',
      color: '#FCD34D',
      bg: '#3B2C0F',
    },
    {
      y: 274,
      label: 'TIER 3 · DEEPER SEDATION ± NEUROMUSCULAR BLOCKADE',
      detail: 'Midazolam · fentanyl · paralyse if shivering / coughing driving ICP',
      color: '#F59E0B',
      bg: '#3B2D0F',
    },
    {
      y: 342,
      label: 'TIER 4 · BRIDGE THERAPIES',
      detail: 'PaCO₂ 30–35 BRIEFLY  ·  targeted hypothermia 35–36 °C',
      color: '#FB923C',
      bg: '#3B210F',
    },
    {
      y: 410,
      label: 'TIER 5 · BARBITURATE COMA / CRANIECTOMY',
      detail: 'Pentobarbital → cEEG burst-suppression  ·  surgical decompression',
      color: '#EF4444',
      bg: '#3B0F1A',
    },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Pediatric raised-ICP escalation ladder with full-width tier bars and connector arrows">
      <defs>
        <marker id="ricArrowDown" viewBox="0 0 8 8" refX="4" refY="6" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 8 0 L 4 6 Z" fill="#FCD34D" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      {/* Title */}
      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        RAISED ICP · PEDIATRIC ESCALATION LADDER
      </text>
      <text x={W / 2} y={48} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10.5" fill="#94A3B8">
        Each step = 30–60 min trial · Re-evaluate ICP / pupils / NIRS / CT before escalating
      </text>

      {/* Tiers */}
      {tiers.map((t, i) => (
        <g key={t.label}>
          {/* Bar */}
          <rect x={tierX} y={t.y} width={tierW} height="46" fill={t.bg} stroke={t.color} strokeWidth="1.5" rx="4" />
          <rect x={tierX} y={t.y} width="6" height="46" fill={t.color} />

          {/* Label */}
          <text x={tierX + 18} y={t.y + 19} fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill={t.color} letterSpacing="1.2">
            {t.label}
          </text>

          {/* Detail */}
          <text x={tierX + 18} y={t.y + 37} fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
            {t.detail}
          </text>

          {/* Connector arrow + "inadequate" label between tiers */}
          {i < tiers.length - 1 && (
            <g>
              <line
                x1={tierX + tierW / 2}
                y1={t.y + 46}
                x2={tierX + tierW / 2}
                y2={tiers[i + 1]!.y}
                stroke="#FCD34D"
                strokeWidth="1.6"
                markerEnd="url(#ricArrowDown)"
              />
              <text
                x={tierX + tierW / 2 + 10}
                y={t.y + 56}
                fontFamily="Consolas, monospace"
                fontSize="9"
                fill="#5EEAD4"
                fontStyle="italic"
              >
                if response inadequate
              </text>
            </g>
          )}
        </g>
      ))}

      {/* Bottom: warning + reminders (full width) */}
      <g transform={`translate(${tierX}, 466)`}>
        <rect width={tierW} height="22" rx="4" fill="#152238" stroke="#EF4444" strokeWidth="0.8" />
        <text x="14" y="15" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
          <tspan fontWeight="700" fill="#EF4444" letterSpacing="1.5">REMINDERS · </tspan>
          confirm signal first · prophylactic deep hyperventilation harms · individualise with PRx / CPPopt where available
        </text>
      </g>
    </svg>
  );
}
