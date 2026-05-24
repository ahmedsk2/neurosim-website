/**
 * Mx, autoregulation contrast figure.
 * Two-panel side-by-side: MAP and MFV slow-waves under intact vs impaired
 * cerebral autoregulation. Shows graphically why Pearson r between MAP and
 * MFV (Mx) is near-zero when intact and strongly positive when impaired.
 *
 * Original schematic for MNM-Edu, visualises the Czosnyka 1996 Mx concept.
 */
export function MxAutoregContrast() {
  const W = 720;
  const H = 380;

  /** Build a sine-stack polyline given amplitude and a flag for whether MFV
   *  tracks MAP (impaired) or is buffered (intact). */
  const buildTrace = (
    centerY: number,
    isMap: boolean,
    intact: boolean,
  ): string => {
    const N = 240;
    const x0 = 70;
    const x1 = 350;
    const W = x1 - x0;
    const pts: string[] = [];
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const slow1 = Math.sin(2 * Math.PI * 2 * t);
      const slow2 = 0.6 * Math.sin(2 * Math.PI * 1.2 * t + 0.7);
      const ultra = 0.4 * Math.sin(2 * Math.PI * 0.4 * t);
      let v = slow1 + slow2 + ultra;
      if (!isMap) {
        // MFV: flat under intact autoreg, full-amplitude under impaired
        v = intact ? 0.08 * v : 0.85 * v;
      }
      const amp = isMap ? 22 : 22; // same display scale for visual comparison
      const y = centerY - v * amp;
      const x = x0 + t * W;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  };

  /** Scatter points reflecting r ≈ 0.05 (intact) vs r ≈ 0.6 (impaired). */
  const scatterPoints = (impaired: boolean, x0: number, y0: number, w: number, hp: number) => {
    const N = 30;
    const pts: { x: number; y: number }[] = [];
    let prev = 0;
    for (let i = 0; i < N; i++) {
      const noise = ((i * 9301 + 49297) % 233280) / 233280 - 0.5;
      const map = (i / (N - 1)) * 2 - 1 + 0.6 * noise;
      let mfv;
      if (impaired) {
        mfv = 0.7 * map + 0.25 * noise;
      } else {
        // Near-zero correlation: random with small drift
        prev = 0.4 * prev + 0.2 * noise + 0.1 * (Math.random() - 0.5);
        mfv = prev;
      }
      pts.push({
        x: x0 + ((map + 1.6) / 3.2) * w,
        y: y0 + hp - ((mfv + 1.4) / 2.8) * hp,
      });
    }
    return pts;
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto" role="img" aria-label="Mx contrast: MAP and MFV slow-waves under intact vs impaired autoregulation">
      <rect width={W} height={H} fill="#0F1A2E" />

      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        Mx · MAP vs TCD-MFV SLOW-WAVES
      </text>
      <text x={W / 2} y={48} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fill="#94A3B8">
        Same MAP slow-waves on both sides. The MFV behaviour is what changes.
      </text>

      {/* ─── Left panel: INTACT autoregulation ─── */}
      <g>
        <rect x="60" y="68" width="290" height="232" rx="6" fill="#0F2E22" stroke="#10B981" strokeWidth="1.2" />
        <text x="205" y="86" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#10B981" letterSpacing="2">
          INTACT AUTOREGULATION
        </text>
        <text x="205" y="100" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
          vessel constricts as MAP rises → MFV stays buffered
        </text>

        {/* MAP trace */}
        <text x="68" y="120" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">MAP</text>
        <line x1="70" y1="148" x2="350" y2="148" stroke="#1E293B" strokeWidth="0.6" strokeDasharray="2 2" />
        <polyline points={buildTrace(148, true, true)} stroke="#5EEAD4" strokeWidth="1.6" fill="none" />

        {/* MFV trace (flat) */}
        <text x="68" y="190" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FCD34D">MFV</text>
        <line x1="70" y1="218" x2="350" y2="218" stroke="#1E293B" strokeWidth="0.6" strokeDasharray="2 2" />
        <polyline points={buildTrace(218, false, true)} stroke="#FCD34D" strokeWidth="1.6" fill="none" />

        {/* Scatter inset */}
        <text x="205" y="248" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#10B981">
          Mx ≈ 0.05 · near zero
        </text>
        <rect x="120" y="252" width="170" height="40" fill="#152238" stroke="#10B981" strokeWidth="0.5" />
        {scatterPoints(false, 120, 252, 170, 40).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.6" fill="#10B981" />
        ))}
      </g>

      {/* ─── Right panel: IMPAIRED autoregulation ─── */}
      <g>
        <rect x="370" y="68" width="290" height="232" rx="6" fill="#3B0F1A" stroke="#EF4444" strokeWidth="1.2" />
        <text x="515" y="86" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#EF4444" letterSpacing="2">
          IMPAIRED · PASSIVE
        </text>
        <text x="515" y="100" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">
          vessel cannot constrict → MFV passively follows MAP
        </text>

        {/* MAP trace */}
        <text x="378" y="120" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#5EEAD4">MAP</text>
        <line x1="380" y1="148" x2="660" y2="148" stroke="#1E293B" strokeWidth="0.6" strokeDasharray="2 2" />
        <polyline
          points={buildTrace(148, true, false).split(' ').map((p) => {
            const [x, y] = p.split(',');
            return `${parseFloat(x!) + 310},${y}`;
          }).join(' ')}
          stroke="#5EEAD4"
          strokeWidth="1.6"
          fill="none"
        />

        {/* MFV trace (tracks MAP) */}
        <text x="378" y="190" fontFamily="Consolas, monospace" fontSize="10" fontWeight="700" fill="#FCD34D">MFV</text>
        <line x1="380" y1="218" x2="660" y2="218" stroke="#1E293B" strokeWidth="0.6" strokeDasharray="2 2" />
        <polyline
          points={buildTrace(218, false, false).split(' ').map((p) => {
            const [x, y] = p.split(',');
            return `${parseFloat(x!) + 310},${y}`;
          }).join(' ')}
          stroke="#FCD34D"
          strokeWidth="1.6"
          fill="none"
        />

        {/* Scatter inset */}
        <text x="515" y="248" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#EF4444">
          Mx ≈ 0.6 · strongly positive
        </text>
        <rect x="430" y="252" width="170" height="40" fill="#152238" stroke="#EF4444" strokeWidth="0.5" />
        {scatterPoints(true, 430, 252, 170, 40).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.6" fill="#EF4444" />
        ))}
      </g>

      {/* Bottom: take-away */}
      <g transform="translate(40, 320)">
        <rect width="640" height="40" rx="6" fill="#152238" stroke="#2a3a55" />
        <text x="14" y="20" fontFamily="Consolas, monospace" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          Mx = Pearson r (MAP, MFV) · 30 paired 10-s averages · 5-minute moving window
        </text>
        <text x="14" y="34" fontFamily="Segoe UI, sans-serif" fontSize="10.5" fill="#FFFFFF">
          Same arithmetic as PRx, substitute MFV for ICP. Useful when no ICP probe is in.
        </text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · Czosnyka 1996 (Mx) · Schmidt 2003
      </text>
    </svg>
  );
}
