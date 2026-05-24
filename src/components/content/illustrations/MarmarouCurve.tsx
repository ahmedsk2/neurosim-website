/**
 * Marmarou pressure-volume curve, 4-segment sigmoid that includes the
 * terminal microvascular-collapse plateau.
 *
 * Segment colours match the canonical teaching reference:
 *   1. Blue   — Compensation (high compliance, flat phase)
 *   2. Yellow — Decreasing compliance (compensatory reserve gradually depleted)
 *   3. Red    — Minimal compliance (steep rise, increased risk of ischaemia / herniation)
 *   4. Gray   — Collapse of cerebral microvasculature (terminal plateau)
 *
 * The Marmarou exponential `ICP = ICP₀ · exp(ΔV / PVI)` describes the rising
 * (blue → red) portion only; the terminal plateau represents loss of CPP and
 * vascular collapse where pressure can no longer rise.
 */
export function MarmarouCurve() {
  const W = 720;
  const H = 480;
  const margin = { top: 70, right: 220, bottom: 70, left: 70 };
  const plotW = W - margin.left - margin.right; // 430
  const plotH = H - margin.top - margin.bottom; // 340

  // Volume / pressure scale, conceptual (matches the unitless reference)
  const xMin = -10;
  const xMax = 30;
  const yMin = 0;
  const yMax = 90;

  const xScale = (x: number) => margin.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const yScale = (y: number) => margin.top + plotH - ((y - yMin) / (yMax - yMin)) * plotH;

  // Sigmoid: rises steeply through V_c then plateaus (microvascular collapse)
  const ICP_BASELINE = 5;
  const ICP_MAX = 78;
  const V_INFLECTION = 13;
  const K = 0.32;
  const icp = (V: number): number =>
    ICP_BASELINE + (ICP_MAX - ICP_BASELINE) / (1 + Math.exp(-K * (V - V_INFLECTION)));

  // Segment boundaries along the curve
  const SEG = {
    blueEnd: 3,    // end of compensation
    yellowEnd: 10, // end of decreasing compliance
    redEnd: 22,    // end of minimal compliance
  };

  const buildSegment = (vStart: number, vEnd: number): string => {
    const pts: string[] = [];
    const step = 0.25;
    for (let V = vStart; V <= vEnd + 1e-6; V += step) {
      pts.push(`${xScale(V).toFixed(1)},${yScale(icp(V)).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  const COLOR = {
    blue: '#2563EB',
    yellow: '#F59E0B',
    red: '#DC2626',
    gray: '#6B7280',
    bgBlue: 'rgba(37, 99, 235, 0.10)',
    bgYellow: 'rgba(245, 158, 11, 0.10)',
    bgRed: 'rgba(220, 38, 38, 0.10)',
    bgGray: 'rgba(107, 114, 128, 0.10)',
  };

  // Anchor points for in-curve labels (mid-segment)
  const mid = (a: number, b: number) => (a + b) / 2;
  const labelBlue = { vx: mid(xMin, SEG.blueEnd), vy: icp(mid(xMin, SEG.blueEnd)) };
  const labelYellow = { vx: mid(SEG.blueEnd, SEG.yellowEnd), vy: icp(mid(SEG.blueEnd, SEG.yellowEnd)) };
  const labelRed = { vx: mid(SEG.yellowEnd, SEG.redEnd), vy: icp(mid(SEG.yellowEnd, SEG.redEnd)) };
  const labelGray = { vx: mid(SEG.redEnd, xMax), vy: icp(mid(SEG.redEnd, xMax)) };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block w-full h-auto"
      role="img"
      aria-label="Marmarou pressure-volume curve with four colored compliance phases ending in microvascular collapse"
    >
      <defs>
        <marker id="mcArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 Z" fill="#FFFFFF" />
        </marker>
      </defs>

      <rect width={W} height={H} fill="#0F1A2E" />

      {/* Title */}
      <text x={W / 2} y={28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        MARMAROU PRESSURE-VOLUME CURVE
      </text>
      <text x={W / 2} y={48} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="10.5" fill="#94A3B8">
        Four compliance phases · ICP = ICP₀·exp(ΔV/PVI) until microvascular collapse
      </text>

      {/* Background zone tints (subtle) */}
      <rect x={xScale(xMin)} y={margin.top} width={xScale(SEG.blueEnd) - xScale(xMin)} height={plotH} fill={COLOR.bgBlue} />
      <rect x={xScale(SEG.blueEnd)} y={margin.top} width={xScale(SEG.yellowEnd) - xScale(SEG.blueEnd)} height={plotH} fill={COLOR.bgYellow} />
      <rect x={xScale(SEG.yellowEnd)} y={margin.top} width={xScale(SEG.redEnd) - xScale(SEG.yellowEnd)} height={plotH} fill={COLOR.bgRed} />
      <rect x={xScale(SEG.redEnd)} y={margin.top} width={xScale(xMax) - xScale(SEG.redEnd)} height={plotH} fill={COLOR.bgGray} />

      {/* Axes (simple, no grid) */}
      <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke="#94A3B8" strokeWidth="1.4" />
      <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#94A3B8" strokeWidth="1.4" />
      {/* Tick stubs only, no numeric labels (matches the conceptual reference) */}
      {[xMin, 0, 10, 20, xMax].map((x) => (
        <line key={`xt-${x}`} x1={xScale(x)} y1={margin.top + plotH} x2={xScale(x)} y2={margin.top + plotH + 4} stroke="#94A3B8" strokeWidth="1" />
      ))}
      {[0, 30, 60, 90].map((y) => (
        <line key={`yt-${y}`} x1={margin.left - 4} y1={yScale(y)} x2={margin.left} y2={yScale(y)} stroke="#94A3B8" strokeWidth="1" />
      ))}
      <text x={margin.left + plotW / 2} y={H - 24} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="13" fontWeight="700" fontStyle="italic" fill="#E2E8F0">
        Intracranial Volume
      </text>
      <text
        x={24}
        y={margin.top + plotH / 2}
        textAnchor="middle"
        fontFamily="Segoe UI, sans-serif"
        fontSize="13"
        fontWeight="700"
        fontStyle="italic"
        fill="#E2E8F0"
        transform={`rotate(-90 24 ${margin.top + plotH / 2})`}
      >
        Intracranial Pressure
      </text>

      {/* ─── 4-segment colored curve ─── */}
      {/* Each segment slightly overlaps its neighbour (~0.5 step) so the join is seamless */}
      <polyline points={buildSegment(xMin, SEG.blueEnd + 0.25)} fill="none" stroke={COLOR.blue} strokeWidth="4.5" strokeLinecap="round" />
      <polyline points={buildSegment(SEG.blueEnd, SEG.yellowEnd + 0.25)} fill="none" stroke={COLOR.yellow} strokeWidth="4.5" strokeLinecap="round" />
      <polyline points={buildSegment(SEG.yellowEnd, SEG.redEnd + 0.25)} fill="none" stroke={COLOR.red} strokeWidth="4.5" strokeLinecap="round" />
      <polyline points={buildSegment(SEG.redEnd, xMax)} fill="none" stroke={COLOR.gray} strokeWidth="4.5" strokeLinecap="round" />

      {/* ─── Curve segment labels (matching the reference) ─── */}

      {/* Blue: Compensation / High compliance — below the curve in the flat zone */}
      <text x={xScale(labelBlue.vx)} y={yScale(labelBlue.vy) + 32} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="13" fontWeight="600" fill="#E2E8F0">
        Compensation
      </text>
      <text x={xScale(labelBlue.vx)} y={yScale(labelBlue.vy) + 50} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11.5" fontStyle="italic" fill={COLOR.blue}>
        High compliance
      </text>

      {/* Yellow: Decreasing compliance / Compensatory reserve gradually depleted */}
      <text x={xScale(labelYellow.vx) + 6} y={yScale(labelYellow.vy) - 22} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="13" fontWeight="600" fill="#E2E8F0">
        Compensatory reserve
      </text>
      <text x={xScale(labelYellow.vx) + 6} y={yScale(labelYellow.vy) - 7} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="13" fontWeight="600" fill="#E2E8F0">
        gradually depleted
      </text>
      <text x={xScale(labelYellow.vx) + 36} y={yScale(labelYellow.vy) + 32} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11.5" fontStyle="italic" fill={COLOR.yellow}>
        Decreasing compliance
      </text>

      {/* Red: Increased risk text + arrow + Minimal compliance label rotated along curve */}
      {/* Upward arrow showing "worsening" direction, inside the steep red zone */}
      <line
        x1={xScale(15.5)}
        y1={yScale(icp(15.5)) + 60}
        x2={xScale(15.5)}
        y2={yScale(icp(15.5)) - 20}
        stroke="#FFFFFF"
        strokeWidth="2"
        markerEnd="url(#mcArrow)"
      />
      {/* "Increased risk of cerebral ischemia and herniation" — three lines, left of arrow */}
      <text x={xScale(11)} y={yScale(icp(15.5)) - 5} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="12.5" fontWeight="500" fill="#E2E8F0">
        Increased risk of
      </text>
      <text x={xScale(11)} y={yScale(icp(15.5)) + 12} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="12.5" fontWeight="500" fill="#E2E8F0">
        cerebral ischemia and
      </text>
      <text x={xScale(11)} y={yScale(icp(15.5)) + 29} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="12.5" fontWeight="500" fill="#E2E8F0">
        herniation
      </text>
      {/* "Minimal compliance" — italic, rotated to follow the steep curve */}
      <text
        x={xScale(20)}
        y={yScale(icp(20))}
        textAnchor="middle"
        fontFamily="Segoe UI, sans-serif"
        fontSize="12.5"
        fontStyle="italic"
        fill={COLOR.red}
        transform={`rotate(-58 ${xScale(20)} ${yScale(icp(20))})`}
      >
        Minimal compliance
      </text>

      {/* Gray: Collapse of cerebral microvasculature — upper-right above the plateau */}
      <text x={xScale(labelGray.vx) - 10} y={yScale(labelGray.vy) - 28} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="13" fontWeight="600" fill="#E2E8F0">
        Collapse of cerebral
      </text>
      <text x={xScale(labelGray.vx) - 10} y={yScale(labelGray.vy) - 11} textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="13" fontWeight="600" fill="#E2E8F0">
        microvasculature
      </text>

      {/* ─── Right legend: four phases with colour swatches ─── */}
      <g transform={`translate(${W - margin.right + 12}, ${margin.top})`}>
        <rect x="0" y="0" width="196" height="340" rx="6" fill="#152238" stroke="#2a3a55" />

        <text x="98" y="22" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          FOUR PHASES
        </text>

        {/* Phase 1: Blue */}
        <g transform="translate(12, 40)">
          <rect x="0" y="0" width="20" height="8" rx="2" fill={COLOR.blue} />
          <text x="28" y="8" fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill={COLOR.blue}>1 · Compensation</text>
          <text x="0" y="24" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">CSF + venous buffer intact;</text>
          <text x="0" y="38" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">large ΔV, small ICP rise.</text>
          <text x="0" y="52" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">RAP &lt; 0.3</text>
        </g>

        {/* Phase 2: Yellow */}
        <g transform="translate(12, 110)">
          <rect x="0" y="0" width="20" height="8" rx="2" fill={COLOR.yellow} />
          <text x="28" y="8" fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill={COLOR.yellow}>2 · Decreasing compliance</text>
          <text x="0" y="24" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">Compensatory reserve</text>
          <text x="0" y="38" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">gradually depleted.</text>
          <text x="0" y="52" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">RAP 0.4 – 0.8</text>
        </g>

        {/* Phase 3: Red */}
        <g transform="translate(12, 180)">
          <rect x="0" y="0" width="20" height="8" rx="2" fill={COLOR.red} />
          <text x="28" y="8" fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill={COLOR.red}>3 · Minimal compliance</text>
          <text x="0" y="24" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">Small ΔV → large ICP rise;</text>
          <text x="0" y="38" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">ischemia / herniation risk.</text>
          <text x="0" y="52" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">RAP rising → near 1</text>
        </g>

        {/* Phase 4: Gray */}
        <g transform="translate(12, 250)">
          <rect x="0" y="0" width="20" height="8" rx="2" fill={COLOR.gray} />
          <text x="28" y="8" fontFamily="Consolas, monospace" fontSize="10.5" fontWeight="700" fill={COLOR.gray}>4 · Microvascular collapse</text>
          <text x="0" y="24" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">CPP exhausted; vessels</text>
          <text x="0" y="38" fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">collapse; pulse fails.</text>
          <text x="0" y="52" fontFamily="Consolas, monospace" fontSize="9" fill="#94A3B8">RAP collapses to 0</text>
        </g>

        <line x1="12" y1="316" x2="184" y2="316" stroke="#2a3a55" strokeWidth="1" />
        <text x="98" y="332" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fontStyle="italic" fill="#94A3B8">
          Pediatric PVI scales by age
        </text>
      </g>

      <text x={W / 2} y={H - 4} textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · Marmarou et al. 1975 · adult PVI ≈ 20 mL · sigmoid with terminal microvascular-collapse plateau
      </text>
    </svg>
  );
}
