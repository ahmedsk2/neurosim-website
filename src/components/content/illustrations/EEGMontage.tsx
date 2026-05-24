/**
 * 10-20 EEG montage, top-down head view with electrode positions, PICU
 * reduced-array highlight, ear/nasion/inion landmarks, and a sample
 * waveform per band on the right.
 *
 * Original schematic for MNM-Edu, derived from the universally-published
 * 10-20 international electrode placement convention.
 */
export function EEGMontage() {
  const electrodes: Array<{ id: string; cx: number; cy: number; reduced?: boolean; region: string }> = [
    { id: 'Fp1', cx: 245, cy: 100, reduced: true, region: 'frontopolar' },
    { id: 'Fp2', cx: 335, cy: 100, reduced: true, region: 'frontopolar' },
    { id: 'F7', cx: 175, cy: 145, region: 'lateral frontal' },
    { id: 'F3', cx: 240, cy: 150, region: 'frontal' },
    { id: 'Fz', cx: 290, cy: 150, region: 'midline frontal' },
    { id: 'F4', cx: 340, cy: 150, region: 'frontal' },
    { id: 'F8', cx: 405, cy: 145, region: 'lateral frontal' },
    { id: 'T3', cx: 155, cy: 210, reduced: true, region: 'temporal' },
    { id: 'C3', cx: 235, cy: 210, reduced: true, region: 'central' },
    { id: 'Cz', cx: 290, cy: 210, reduced: true, region: 'midline central' },
    { id: 'C4', cx: 345, cy: 210, reduced: true, region: 'central' },
    { id: 'T4', cx: 425, cy: 210, reduced: true, region: 'temporal' },
    { id: 'T5', cx: 175, cy: 275, region: 'post-temporal' },
    { id: 'P3', cx: 240, cy: 270, region: 'parietal' },
    { id: 'Pz', cx: 290, cy: 270, region: 'midline parietal' },
    { id: 'P4', cx: 340, cy: 270, region: 'parietal' },
    { id: 'T6', cx: 405, cy: 275, region: 'post-temporal' },
    { id: 'O1', cx: 250, cy: 320, reduced: true, region: 'occipital' },
    { id: 'O2', cx: 330, cy: 320, reduced: true, region: 'occipital' },
  ];

  // Generate a small EEG waveform polyline for the legend
  const wave = (kind: string, x0: number, y0: number, w: number) => {
    const N = 80;
    const pts: string[] = [];
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      let amp = 0;
      switch (kind) {
        case 'beta':
          amp = 4 * Math.sin(t * 14) + 2 * Math.sin(t * 28);
          break;
        case 'alpha':
          amp = 6 * Math.sin(t * 8);
          break;
        case 'theta':
          amp = 8 * Math.sin(t * 4);
          break;
        case 'delta':
          amp = 10 * Math.sin(t * 2);
          break;
      }
      pts.push(`${(x0 + (i / N) * w).toFixed(1)},${(y0 + amp).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  return (
    <svg viewBox="0 0 720 480" className="block w-full h-auto" role="img" aria-label="10-20 EEG montage with PICU reduced subset and frequency-band waveforms">
      <defs>
        <linearGradient id="eegHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBC8C8" />
          <stop offset="100%" stopColor="#E392A7" />
        </linearGradient>
      </defs>

      <rect width="720" height="480" fill="#0F1A2E" />

      <text x="360" y="28" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        EEG MONTAGE · 10-20 SYSTEM
      </text>
      <text x="360" y="48" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10.5" fill="#94A3B8">
        Top-down view · highlighted = PICU reduced 8-channel array
      </text>

      {/* ─── Head outline (top-down) ─── */}
      <g>
        {/* Head circle */}
        <ellipse cx="290" cy="210" rx="180" ry="120" fill="url(#eegHead)" stroke="#7A4858" strokeWidth="1.5" />

        {/* Nasion (front) */}
        <path d="M 290 80 L 275 110 L 305 110 Z" fill="url(#eegHead)" stroke="#7A4858" strokeWidth="1.5" />
        <text x="290" y="74" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">NASION</text>

        {/* Ears (left and right) */}
        <ellipse cx="115" cy="210" rx="14" ry="22" fill="url(#eegHead)" stroke="#7A4858" strokeWidth="1.2" />
        <text x="80" y="214" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">L</text>
        <ellipse cx="465" cy="210" rx="14" ry="22" fill="url(#eegHead)" stroke="#7A4858" strokeWidth="1.2" />
        <text x="500" y="214" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">R</text>

        {/* Inion (back) */}
        <path d="M 290 340 L 275 320 L 305 320 Z" fill="url(#eegHead)" stroke="#7A4858" strokeWidth="1.5" />
        <text x="290" y="350" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">INION</text>

        {/* 10-20 grid lines (faint) */}
        <line x1="120" y1="210" x2="460" y2="210" stroke="#475569" strokeWidth="0.6" strokeDasharray="3 2" />
        <line x1="290" y1="100" x2="290" y2="320" stroke="#475569" strokeWidth="0.6" strokeDasharray="3 2" />
      </g>

      {/* Connections between reduced electrodes (montage hint) */}
      <g stroke="#FCD34D" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.45" fill="none">
        <line x1="245" y1="100" x2="335" y2="100" />
        <line x1="155" y1="210" x2="425" y2="210" />
        <line x1="250" y1="320" x2="330" y2="320" />
      </g>

      {/* Electrodes */}
      {electrodes.map((e) => (
        <g key={e.id}>
          {e.reduced && (
            <circle cx={e.cx} cy={e.cy} r="14" fill="#FCD34D" opacity="0.25" />
          )}
          <circle
            cx={e.cx}
            cy={e.cy}
            r="11"
            fill={e.reduced ? '#FCD34D' : '#5EEAD4'}
            opacity={e.reduced ? 1 : 0.55}
            stroke="#0F1A2E"
            strokeWidth="1.5"
          />
          <text
            x={e.cx}
            y={e.cy + 3.5}
            textAnchor="middle"
            fontFamily="Consolas, monospace"
            fontSize="9.5"
            fontWeight="700"
            fill="#0F1A2E"
          >
            {e.id}
          </text>
        </g>
      ))}

      {/* ─── Right legend ─── */}
      <g transform="translate(495, 70)">
        <rect x="0" y="0" width="200" height="370" rx="6" fill="#152238" stroke="#2a3a55" />

        <text x="100" y="22" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          ARRAYS
        </text>

        <g transform="translate(14, 38)">
          <circle cx="10" cy="10" r="9" fill="#5EEAD4" opacity="0.55" />
          <text x="28" y="14" fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill="#5EEAD4">Full 10-20</text>
          <text x="28" y="28" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">19 standard channels</text>
        </g>

        <g transform="translate(14, 76)">
          <circle cx="10" cy="10" r="9" fill="#FCD34D" />
          <text x="28" y="14" fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill="#FCD34D">PICU reduced</text>
          <text x="28" y="28" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">Fp1/Fp2 · C3/C4 · T3/T4 · O1/O2</text>
        </g>

        <line x1="14" y1="118" x2="186" y2="118" stroke="#2a3a55" strokeWidth="1" />

        <text x="100" y="138" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          FREQUENCY BANDS
        </text>

        <g transform="translate(14, 154)">
          <text x="0" y="9" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FFFFFF">β beta</text>
          <text x="0" y="22" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">13–30 Hz</text>
          <polyline points={wave('beta', 60, 14, 110)} fill="none" stroke="#86EFAC" strokeWidth="1.2" />
        </g>

        <g transform="translate(14, 194)">
          <text x="0" y="9" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FFFFFF">α alpha</text>
          <text x="0" y="22" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">8–13 Hz</text>
          <polyline points={wave('alpha', 60, 14, 110)} fill="none" stroke="#5EEAD4" strokeWidth="1.4" />
        </g>

        <g transform="translate(14, 234)">
          <text x="0" y="9" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FFFFFF">θ theta</text>
          <text x="0" y="22" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">4–8 Hz</text>
          <polyline points={wave('theta', 60, 14, 110)} fill="none" stroke="#FCD34D" strokeWidth="1.4" />
        </g>

        <g transform="translate(14, 274)">
          <text x="0" y="9" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FFFFFF">δ delta</text>
          <text x="0" y="22" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">0.5–4 Hz</text>
          <polyline points={wave('delta', 60, 14, 110)} fill="none" stroke="#F59E0B" strokeWidth="1.4" />
        </g>

        <line x1="14" y1="318" x2="186" y2="318" stroke="#2a3a55" strokeWidth="1" />

        <text x="14" y="338" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">SETUP TARGETS</text>
        <text x="14" y="352" fontFamily="Consolas, monospace" fontSize="9" fill="#FFFFFF">impedance &lt; 5 kΩ</text>
        <text x="14" y="364" fontFamily="Consolas, monospace" fontSize="9" fill="#FFFFFF">collodion (long stay) / paste</text>
      </g>

      {/* Bottom: naming convention legend */}
      <g transform="translate(50, 410)">
        <rect width="430" height="56" rx="6" fill="#152238" stroke="#2a3a55" />
        <text x="14" y="20" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          NAMING CONVENTION
        </text>
        <text x="14" y="36" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
          Letters: <tspan fontWeight="700">Fp</tspan> frontopolar · <tspan fontWeight="700">F</tspan> frontal · <tspan fontWeight="700">C</tspan> central · <tspan fontWeight="700">T</tspan> temporal · <tspan fontWeight="700">P</tspan> parietal · <tspan fontWeight="700">O</tspan> occipital
        </text>
        <text x="14" y="50" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
          Numbers: <tspan fontWeight="700">odd</tspan> = left, <tspan fontWeight="700">even</tspan> = right, <tspan fontWeight="700">z</tspan> = midline
        </text>
      </g>

      <text x="360" y="476" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · 10-20 international electrode placement · ACNS standardised terminology
      </text>
    </svg>
  );
}
