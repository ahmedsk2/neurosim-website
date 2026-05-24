/**
 * Cranial vault compartments, brain (~80%), CSF (~10%), blood (~10%).
 * Used in foundations/monro-kellie + modalities/icp.
 *
 * Mid-sagittal cross-section of the head showing the three compensable
 * compartments, ventricular system, vasculature, and the spinal-canal CSF
 * translocation pathway that defines compensation tier 1.
 */
export function BrainCompartments() {
  return (
    <svg viewBox="0 0 720 420" className="block w-full h-auto" role="img" aria-label="Mid-sagittal cross-section of cranial compartments">
      <defs>
        <linearGradient id="bcSkull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8DFC9" />
          <stop offset="100%" stopColor="#C8B894" />
        </linearGradient>
        <linearGradient id="bcBrain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBC8C8" />
          <stop offset="100%" stopColor="#E892A7" />
        </linearGradient>
        <pattern id="bcCSF" patternUnits="userSpaceOnUse" width="6" height="6">
          <rect width="6" height="6" fill="#7DD3FC" />
          <circle cx="3" cy="3" r="0.6" fill="#0EA5E9" opacity="0.4" />
        </pattern>
        <linearGradient id="bcVessel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <marker id="bcArrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#FCD34D" />
        </marker>
      </defs>

      <rect width="720" height="420" fill="#0F1A2E" />
      <text x="360" y="28" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="14" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
        MONRO-KELLIE · MID-SAGITTAL CROSS-SECTION
      </text>

      {/* Outer skull bone, calvarium */}
      <path
        d="M 70 200 Q 60 110 140 70 Q 220 40 290 50 Q 360 60 380 90 L 390 100 Q 395 105 395 115 L 395 175 Q 410 185 405 200 L 400 215 Q 395 235 380 240 L 360 248 Q 350 260 340 280 L 320 305 L 300 320 L 285 332 Q 280 340 285 348 Q 290 354 290 360 L 280 360 L 270 350 L 250 348 L 230 350 L 220 358 L 200 358 L 200 340 Q 195 330 175 325 L 130 305 Q 100 280 80 250 Q 70 230 70 200 Z"
        fill="url(#bcSkull)"
        stroke="#7C6E50"
        strokeWidth="2"
      />

      {/* Inner table / dural space gap */}
      <path
        d="M 96 200 Q 90 130 150 95 Q 220 65 285 75 Q 345 82 365 105 L 372 115 L 372 170 Q 380 180 378 195 L 372 215 Q 365 230 350 235 L 332 240 Q 320 258 310 275 L 290 295 L 273 305 L 260 320 L 235 322 L 220 326 L 215 332 L 215 318 Q 210 312 195 308 L 145 290 Q 118 268 100 240 Q 92 222 96 200 Z"
        fill="#1A2842"
        stroke="#9CA3AF"
        strokeWidth="0.8"
      />

      {/* Brain parenchyma, cerebrum */}
      <path
        d="M 105 205 Q 100 140 152 108 Q 220 80 282 88 Q 335 95 355 115 L 360 125 L 360 168 Q 366 178 363 192 L 358 210 Q 350 222 338 226 L 320 232 Q 310 245 305 260 L 290 275 L 270 285 Q 240 290 215 285 Q 175 280 145 268 Q 115 250 105 220 Z"
        fill="url(#bcBrain)"
        stroke="#A04060"
        strokeWidth="1"
      />

      {/* Sulci / gyri texture lines on cerebrum */}
      <g stroke="#A04060" strokeWidth="0.7" fill="none" opacity="0.6">
        <path d="M 130 130 Q 145 125 160 130 Q 170 140 165 150" />
        <path d="M 175 105 Q 195 100 215 110" />
        <path d="M 230 95 Q 250 92 270 98" />
        <path d="M 285 100 Q 310 110 330 120" />
        <path d="M 145 165 Q 165 165 185 170" />
        <path d="M 200 145 Q 225 145 250 150" />
        <path d="M 265 140 Q 290 145 315 150" />
        <path d="M 330 140 Q 348 148 355 158" />
        <path d="M 145 195 Q 175 195 205 200" />
        <path d="M 220 175 Q 250 175 285 180" />
        <path d="M 295 175 Q 325 180 350 185" />
      </g>

      {/* Lateral ventricle, CSF in ventricular system */}
      <path
        d="M 175 155 Q 220 145 275 155 Q 285 180 250 195 Q 215 200 180 192 Q 165 175 175 155 Z"
        fill="url(#bcCSF)"
        stroke="#0284C7"
        strokeWidth="1"
      />

      {/* Third ventricle */}
      <ellipse cx="245" cy="220" rx="14" ry="22" fill="url(#bcCSF)" stroke="#0284C7" strokeWidth="1" />

      {/* Aqueduct */}
      <path d="M 240 240 L 232 270" stroke="#0284C7" strokeWidth="2" fill="none" />

      {/* Fourth ventricle */}
      <ellipse cx="225" cy="282" rx="14" ry="9" fill="url(#bcCSF)" stroke="#0284C7" strokeWidth="1" />

      {/* Cerebellum */}
      <path
        d="M 235 270 Q 270 268 300 275 Q 320 285 318 305 Q 310 322 285 325 Q 255 322 235 308 Q 226 290 235 270 Z"
        fill="#F8B5C0"
        stroke="#A04060"
        strokeWidth="1"
      />
      <g stroke="#A04060" strokeWidth="0.5" fill="none" opacity="0.7">
        <path d="M 245 280 Q 260 278 275 282" />
        <path d="M 250 290 Q 270 290 290 295" />
        <path d="M 255 305 Q 275 305 295 310" />
        <path d="M 260 318 Q 280 320 300 320" />
      </g>

      {/* Brainstem */}
      <path
        d="M 215 255 L 218 320 L 210 350 Q 220 358 218 365 L 212 365 L 212 360 L 200 358 L 195 350 L 200 320 L 205 280 L 215 255 Z"
        fill="#FBC8C8"
        stroke="#A04060"
        strokeWidth="1"
      />

      {/* Subarachnoid CSF space, outer crescent around brain */}
      <g fill="url(#bcCSF)" opacity="0.85">
        <path d="M 100 200 Q 95 135 150 100 Q 155 110 153 120 Q 145 135 140 155 Q 138 175 138 195 Q 110 200 100 200 Z" />
        <path d="M 360 110 L 360 168 Q 358 165 350 162 L 345 110 Z" />
        <path d="M 102 215 Q 110 245 145 268 Q 153 270 152 263 Q 130 250 113 230 Q 105 222 102 215 Z" />
      </g>

      {/* Spinal cord and canal continuing from brainstem */}
      <rect x="200" y="358" width="20" height="40" fill="url(#bcCSF)" stroke="#0284C7" strokeWidth="1" />
      <rect x="206" y="358" width="8" height="40" fill="#FBC8C8" stroke="#A04060" strokeWidth="0.6" />

      {/* Carotid + basilar vessel hint */}
      <path d="M 175 285 Q 192 268 200 240" stroke="url(#bcVessel)" strokeWidth="2.5" fill="none" />
      <circle cx="175" cy="285" r="3" fill="#DC2626" />

      {/* Compensation arrow, CSF translocating to spinal canal */}
      <path d="M 220 325 Q 213 345 210 380" stroke="#FCD34D" strokeWidth="2" fill="none" strokeDasharray="4 3" markerEnd="url(#bcArrow)" />
      <text x="160" y="385" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">CSF →</text>
      <text x="160" y="395" fontFamily="Consolas, monospace" fontSize="9" fontWeight="700" fill="#FCD34D">spinal canal</text>

      {/* Anatomy labels */}
      <g fontFamily="Segoe UI, sans-serif" fontSize="10" fill="#FFFFFF">
        <text x="225" y="170" textAnchor="middle">Lateral ventricle</text>
        <text x="280" y="220">Third v.</text>
        <text x="335" y="290">Cerebellum</text>
        <text x="180" y="335">Brainstem</text>
        <text x="73" y="170">Skull</text>
        <text x="60" y="220">Subarachnoid</text>
        <text x="60" y="232" fontStyle="italic">CSF space</text>
      </g>

      {/* Right panel, Monro-Kellie + compartments */}
      <g transform="translate(425, 60)">
        <text fontFamily="Segoe UI, sans-serif" fontSize="11" fontWeight="700" fill="#5EEAD4" letterSpacing="2">
          MONRO-KELLIE DOCTRINE
        </text>
        <text y="20" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">The cranial vault is rigid (after fontanelle closure).</text>
        <text y="36" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">Volume added must be matched by volume removed.</text>

        <rect x="0" y="50" width="270" height="36" fill="#152238" stroke="#FCD34D" strokeWidth="1" rx="3" />
        <text x="135" y="73" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="13" fontWeight="700" fill="#FCD34D">
          V<tspan fontSize="9" dy="3">brain</tspan><tspan dy="-3"> + V</tspan><tspan fontSize="9" dy="3">CSF</tspan><tspan dy="-3"> + V</tspan><tspan fontSize="9" dy="3">blood</tspan><tspan dy="-3"> = const</tspan>
        </text>

        <text y="110" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#5EEAD4" letterSpacing="1">
          COMPARTMENTS (adult)
        </text>

        <g transform="translate(0, 122)">
          <rect x="0" y="0" width="14" height="14" fill="url(#bcBrain)" stroke="#A04060" strokeWidth="0.7" />
          <text x="22" y="11" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
            <tspan fontWeight="700">Brain parenchyma</tspan> · ~80% · 1200 mL
          </text>
        </g>
        <g transform="translate(0, 142)">
          <rect x="0" y="0" width="14" height="14" fill="url(#bcCSF)" stroke="#0284C7" strokeWidth="0.7" />
          <text x="22" y="11" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
            <tspan fontWeight="700">CSF</tspan> · ~10% · 150 mL
          </text>
        </g>
        <g transform="translate(0, 162)">
          <rect x="0" y="0" width="14" height="14" fill="url(#bcVessel)" stroke="#7F1D1D" strokeWidth="0.7" />
          <text x="22" y="11" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">
            <tspan fontWeight="700">Blood</tspan> · ~10% · 150 mL (75 mL arterial / 75 mL venous)
          </text>
        </g>

        <text y="200" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#5EEAD4" letterSpacing="1">
          COMPENSATION CASCADE
        </text>

        <g transform="translate(0, 215)">
          <circle cx="9" cy="9" r="8" fill="#3B82F6" />
          <text x="9" y="13" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#FFFFFF">1</text>
          <text x="24" y="13" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">CSF translocates to spinal canal (~80 mL)</text>
        </g>
        <g transform="translate(0, 235)">
          <circle cx="9" cy="9" r="8" fill="#DC2626" />
          <text x="9" y="13" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#FFFFFF">2</text>
          <text x="24" y="13" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FFFFFF">Venous blood is squeezed out (~60 mL)</text>
        </g>
        <g transform="translate(0, 255)">
          <circle cx="9" cy="9" r="8" fill="#F59E0B" />
          <text x="9" y="13" textAnchor="middle" fontFamily="Segoe UI, sans-serif" fontSize="10" fontWeight="700" fill="#0F1A2E">3</text>
          <text x="24" y="13" fontFamily="Segoe UI, sans-serif" fontSize="11" fill="#FCD34D" fontWeight="700">Buffers exhausted → ICP rises exponentially</text>
        </g>
      </g>

      <text x="360" y="408" textAnchor="middle" fontFamily="Consolas, monospace" fontSize="9" fill="#64748B">
        MNM-Edu original schematic · Monro 1783 · Kellie 1824 · adult volumes; pediatric scaled by age
      </text>
    </svg>
  );
}
