/**
 * Subdural ECoG strip placement, top-down craniotomy view with strip on
 * cortical surface, SD wave propagation across contacts, and a stacked
 * DC-coupled trace strip showing the slow negative shift + HF suppression.
 *
 * Original schematic for MNM-Edu, derived from COSBID consensus on SD detection.
 */
export function ECoGStrip() {
  const W = 720;
  const H = 460;

  // Build a smooth synthetic DC-coupled trace per channel showing the SD passing
  const traceFor = (channelIdx: number, channelXmm: number, x0: number, y0: number, w: number) => {
    const N = 220;
    const pts: string[] = [];
    const wavePosMm = 30; // arbitrary frozen position
    const dist = Math.abs(channelXmm - wavePosMm);
    const passing = dist < 8;
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const phase = t * 12 + channelIdx;
      const localT = (t - 0.4) * 12; // for a slow shift centered around middle
      const dcShift = passing ? -16 * Math.exp(-(localT * localT) / 6) : 0;
      const hf = passing ? 0.4 * Math.sin(phase * 6) : 5 * Math.sin(phase * 6);
      const v = dcShift + hf + 2 * Math.sin(phase * 1.5);
      pts.push(`${(x0 + t * w).toFixed(1)},${(y0 + v).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Subdural ECoG strip placement on cortex with DC-coupled traces showing spreading depolarisation">
      <defs>
        <linearGradient id="ecogBone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8DFC9" />
          <stop offset="100%" stopColor="#C8B894" />
        </linearGradient>
        <linearGradient id="ecogBrain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBC8C8" />
          <stop offset="100%" stopColor="#D88090" />
        </linearGradient>
        <radialGradient id="ecogSDGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
        </radialGradient>
        <marker id="ecogArr" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#EF4444" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        SUBDURAL ECoG STRIP · SPREADING DEPOLARISATION DETECTION
      </text>

      {/* ─── Top: top-down craniotomy view ─── */}
      <g transform="translate(50, 60)">
        <text x="310" y="14" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">
          TOP-DOWN CRANIOTOMY VIEW
        </text>

        {/* Skull silhouette (top-down ellipse) */}
        <ellipse cx="310" cy="120" rx="280" ry="100" fill="url(#ecogBone)" stroke="#7C6E50" strokeWidth="2" />

        {/* Cortex visible through the bone-flap (lighter inset) */}
        <ellipse cx="310" cy="120" rx="240" ry="80" fill="url(#ecogBrain)" stroke="#A04060" strokeWidth="1.2" />

        {/* Sulci hint */}
        <g stroke="#A04060" strokeWidth="0.7" fill="none" opacity="0.55">
          <path d="M 110 80 Q 160 75 210 80" />
          <path d="M 230 70 Q 280 65 330 70" />
          <path d="M 350 70 Q 400 65 450 70" />
          <path d="M 470 75 Q 520 75 510 88" />
          <path d="M 110 110 Q 170 105 230 110" />
          <path d="M 250 100 Q 320 95 390 100" />
          <path d="M 410 100 Q 470 100 510 108" />
          <path d="M 110 145 Q 180 140 250 145" />
          <path d="M 270 140 Q 340 138 410 142" />
          <path d="M 430 140 Q 480 142 510 148" />
        </g>

        {/* Craniotomy / bone flap edge highlighted */}
        <ellipse cx="310" cy="120" rx="240" ry="80" fill="none" stroke="#7C6E50" strokeWidth="2.5" strokeDasharray="6 3" opacity="0.7" />
        <text x="555" y="60" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#7C6E50">
          craniotomy edge
        </text>

        {/* ECoG strip, silicone band with 6 platinum contacts */}
        <g transform="translate(155, 140)">
          {/* Silicone backing */}
          <rect x="0" y="-12" width="320" height="24" fill="#1F2937" stroke="#94A3B8" strokeWidth="1" rx="6" />

          {/* 6 contacts */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const cx = 30 + i * 52;
            return (
              <g key={i}>
                <circle cx={cx} cy="0" r="9" fill="#FCD34D" stroke="#0F1A2E" strokeWidth="1.5" />
                <text x={cx} y="3" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="8.5" fontWeight="700" fill="#0F1A2E">
                  {i + 1}
                </text>
              </g>
            );
          })}

          {/* Connector cable */}
          <path d="M 320 0 Q 380 -10 420 -40" stroke="#94A3B8" strokeWidth="3" fill="none" />
          <text x="430" y="-44" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#5EEAD4">
            → DC-coupled
          </text>
          <text x="430" y="-32" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#5EEAD4">
            amplifier
          </text>

          {/* SD wave passing, red cloud over contacts 2-3 */}
          <ellipse cx="80" cy="0" rx="40" ry="22" fill="url(#ecogSDGlow)" />
          <path d="M 100 0 L 130 0" stroke="#EF4444" strokeWidth="2" markerEnd="url(#ecogArr)" />
          <text x="80" y="-30" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#EF4444">
            SD wave · ~ 3 mm/min
          </text>
        </g>

        {/* Scale ruler */}
        <line x1="155" y1="200" x2="475" y2="200" stroke="#94A3B8" strokeWidth="1" />
        <line x1="155" y1="196" x2="155" y2="204" stroke="#94A3B8" strokeWidth="1" />
        <line x1="475" y1="196" x2="475" y2="204" stroke="#94A3B8" strokeWidth="1" />
        <text x="315" y="214" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
          60 mm strip · 6 contacts · 10 mm spacing
        </text>
      </g>

      {/* ─── Bottom: stacked DC-coupled traces ─── */}
      <g transform="translate(40, 250)">
        {/* Dark backing for the subtitle, which would otherwise overlap the cortex ellipse from the top group (cortex extends to abs y=260; subtitle baseline at abs y=250) */}
        <rect x="120" y="-9" width="400" height="14" fill="#0F1A2E" rx="2" />
        <text x="320" y="0" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">
          DC-COUPLED ECoG · 6 CHANNELS · SD WAVE PASSING ACROSS CHANNELS 2-3
        </text>

        {/* Trace box */}
        <rect x="0" y="14" width="640" height="170" fill="#152238" stroke="#2a3a55" strokeWidth="0.7" rx="3" />

        {/* Channel labels + traces */}
        {[
          { idx: 0, channelXmm: 5, label: 'Ch 1' },
          { idx: 1, channelXmm: 15, label: 'Ch 2' },
          { idx: 2, channelXmm: 25, label: 'Ch 3' },
          { idx: 3, channelXmm: 35, label: 'Ch 4' },
          { idx: 4, channelXmm: 45, label: 'Ch 5' },
          { idx: 5, channelXmm: 55, label: 'Ch 6' },
        ].map((ch, i) => {
          const passing = Math.abs(ch.channelXmm - 30) < 8;
          const yBase = 32 + i * 25;
          return (
            <g key={ch.label}>
              <text x="14" y={yBase + 4} fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill={passing ? '#EF4444' : '#5EEAD4'}>
                {ch.label}
              </text>
              <line x1="50" y1={yBase} x2="630" y2={yBase} stroke="#1E293B" strokeWidth="0.5" />
              <polyline
                points={traceFor(ch.idx, ch.channelXmm, 50, yBase, 580)}
                fill="none"
                stroke={passing ? '#EF4444' : '#5EEAD4'}
                strokeWidth="1.4"
              />
              {passing && (
                <text x="630" y={yBase + 4} textAnchor="end" fontFamily="Consolas, monospace" fontSize="8" fontWeight="700" fill="#EF4444">
                  ↓ DC shift + HF suppression
                </text>
              )}
            </g>
          );
        })}
      </g>

      {/* Bottom: explainer */}
      <g transform="translate(40, 410)">
        <rect width="640" height="40" rx="6" fill="#152238" stroke="#FCD34D" strokeWidth="1" />
        <text x="14" y="18" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FCD34D" letterSpacing="2">
          WHY DC-COUPLING MATTERS
        </text>
        <text x="14" y="34" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
          Most clinical EEG amplifiers high-pass filter at 0.1–0.5 Hz · they remove the slow shift that defines an SD · DC-coupled is essential.
        </text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · COSBID consensus · Hartings 2017 · Dreier 2017
      </text>
    </svg>
  );
}
