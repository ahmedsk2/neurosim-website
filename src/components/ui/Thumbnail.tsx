import { cn } from '@/lib/utils';

/**
 * Thumbnail, small abstract SVG that visually labels a card.
 * One component, ~20 named variants, mapped from modality / foundation /
 * integration slugs. Keeps cards visually distinguishable at a glance.
 */

export type ThumbnailKind =
  // Modality types
  | 'wave'
  | 'flow'
  | 'optode'
  | 'spectrum'
  | 'molecule'
  | 'ucurve'
  | 'pulse'
  | 'adjunct'
  // Foundation chapters
  | 'plateau'
  | 'skull'
  | 'pvcurve'
  | 'cascade'
  | 'propagation'
  | 'barrier'
  | 'pedshead'
  | 'co2-curve'
  | 'energy'
  // Integration scenarios
  | 'discordance'
  | 'ecmo'
  | 'braindeath'
  | 'osmotherapy'
  | 'newborn'
  | 'stroke'
  | 'seizure'
  | 'edema'
  | 'family'
  | 'metabolicicu'
  | 'meningitis';

const TONES: Record<string, { stroke: string; fill: string; bg: string; accent: string }> = {
  teal:    { stroke: '#14B8A6', fill: '#14B8A6', bg: 'rgba(20,184,166,0.10)',  accent: '#2DD4BF' },
  amber:   { stroke: '#F59E0B', fill: '#F59E0B', bg: 'rgba(245,158,11,0.10)',  accent: '#FBBF24' },
  purple:  { stroke: '#8B5CF6', fill: '#8B5CF6', bg: 'rgba(139,92,246,0.10)',  accent: '#A78BFA' },
  blue:    { stroke: '#3B82F6', fill: '#3B82F6', bg: 'rgba(59,130,246,0.10)',  accent: '#60A5FA' },
  green:   { stroke: '#10B981', fill: '#10B981', bg: 'rgba(16,185,129,0.10)',  accent: '#34D399' },
  red:     { stroke: '#EF4444', fill: '#EF4444', bg: 'rgba(239,68,68,0.10)',   accent: '#F87171' },
  neutral: { stroke: '#94A3B8', fill: '#94A3B8', bg: 'rgba(148,163,184,0.10)', accent: '#CBD5E1' },
};

export type ThumbnailTone = keyof typeof TONES;

export interface ThumbnailProps {
  kind: ThumbnailKind;
  tone?: ThumbnailTone;
  /** Visible aspect ratio. Default 16/9 fits card grids well. */
  aspect?: string;
  className?: string;
  ariaLabel?: string;
}

export function Thumbnail({
  kind,
  tone = 'teal',
  aspect = '16/9',
  className,
  ariaLabel,
}: ThumbnailProps) {
  const t = TONES[tone] ?? TONES.teal!;
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md border border-line',
        className,
      )}
      style={{ aspectRatio: aspect, background: t.bg }}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
    >
      <svg
        viewBox="0 0 200 110"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        focusable="false"
      >
        {renderShape(kind, t)}
      </svg>
    </div>
  );
}

function renderShape(kind: ThumbnailKind, t: { stroke: string; fill: string; bg: string; accent: string }) {
  switch (kind) {
    // ── modality-type variants ──────────────────────────────────────────────
    case 'wave': // pressure waveform (P1 P2 P3 morphology)
      return (
        <g>
          {[10, 80, 150].map((dx) => (
            <path
              key={dx}
              d={`M ${dx} 70 L ${dx + 12} 30 L ${dx + 20} 50 L ${dx + 28} 45 L ${dx + 40} 70`}
              fill="none"
              stroke={t.stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          <line x1="0" y1="95" x2="200" y2="95" stroke={t.stroke} strokeOpacity="0.25" strokeWidth="1" />
        </g>
      );
    case 'flow': // pulsatile Doppler envelope
      return (
        <g>
          <path
            d="M 0 80 Q 25 30 50 80 T 100 80 T 150 80 T 200 80"
            fill="none"
            stroke={t.stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 0 80 Q 25 60 50 80 T 100 80 T 150 80 T 200 80"
            fill={t.stroke}
            fillOpacity="0.15"
          />
        </g>
      );
    case 'optode': // bilateral NIRS pads with arc photon path
      return (
        <g>
          <rect x="40" y="35" width="32" height="14" rx="3" fill={t.stroke} />
          <rect x="128" y="35" width="32" height="14" rx="3" fill={t.stroke} />
          <path
            d="M 56 49 Q 100 95 144 49"
            fill="none"
            stroke={t.accent}
            strokeWidth="1.6"
            strokeDasharray="3 3"
          />
          <text
            x="100"
            y="78"
            textAnchor="middle"
            fill={t.accent}
            fontSize="11"
            fontFamily="system-ui"
            fontWeight="600"
          >
            rSO₂
          </text>
        </g>
      );
    case 'spectrum': // EEG-style frequency bands
      return (
        <g>
          {[0, 16, 32, 48, 64, 80].map((y, i) => (
            <rect
              key={i}
              x="10"
              y={y / 2 + 18}
              width="180"
              height="6"
              rx="2"
              fill={t.stroke}
              opacity={0.25 + (i % 3) * 0.2}
            />
          ))}
        </g>
      );
    case 'molecule': // metabolic dots cluster
      return (
        <g>
          {[
            [60, 55, 16],
            [100, 35, 11],
            [140, 60, 14],
            [85, 80, 9],
            [125, 78, 7],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill={t.stroke} opacity={0.45 + (i % 3) * 0.15} />
          ))}
          {[[60, 55, 100, 35], [100, 35, 140, 60], [140, 60, 85, 80], [85, 80, 125, 78]].map(
            ([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={t.stroke}
                strokeWidth="1"
                opacity="0.4"
              />
            ),
          )}
        </g>
      );
    case 'ucurve': // CPPopt parabola
      return (
        <g>
          <path
            d="M 10 30 Q 100 130 190 30"
            fill="none"
            stroke={t.stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="100" cy="85" r="5" fill={t.stroke} />
          <line x1="100" y1="35" x2="100" y2="100" stroke={t.accent} strokeWidth="1" strokeDasharray="3 3" />
          <text x="100" y="22" textAnchor="middle" fontSize="10" fill={t.accent} fontWeight="700" fontFamily="system-ui">
            CPPopt
          </text>
        </g>
      );
    case 'pulse': // ECG-like clinical pulse
      return (
        <g>
          <path
            d="M 0 60 L 50 60 L 60 60 L 65 45 L 72 78 L 78 30 L 84 60 L 200 60"
            fill="none"
            stroke={t.stroke}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    case 'adjunct': // pupil reactivity dot
      return (
        <g>
          <circle cx="100" cy="55" r="22" fill={t.stroke} fillOpacity="0.12" />
          <circle cx="100" cy="55" r="14" fill="none" stroke={t.stroke} strokeWidth="1.4" strokeDasharray="3 3" />
          <circle cx="100" cy="55" r="6" fill={t.stroke} />
        </g>
      );

    // ── foundation variants ─────────────────────────────────────────────────
    case 'plateau': // Lassen plateau
      return (
        <g>
          <path
            d="M 10 80 Q 30 80 45 50 L 145 50 Q 165 50 190 80"
            fill="none"
            stroke={t.stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text x="100" y="40" textAnchor="middle" fontSize="9" fill={t.accent} fontWeight="700" fontFamily="system-ui" letterSpacing="0.1em">
            CBF
          </text>
        </g>
      );
    case 'skull': // Monro-Kellie skull cross-section
      return (
        <g>
          <ellipse cx="100" cy="55" rx="70" ry="40" fill="none" stroke={t.stroke} strokeWidth="2" />
          <ellipse cx="100" cy="55" rx="46" ry="22" fill={t.stroke} fillOpacity="0.12" stroke={t.stroke} strokeWidth="1" />
          <text x="100" y="58" textAnchor="middle" fontSize="9" fill={t.accent} fontWeight="700" fontFamily="system-ui">
            brain · blood · CSF
          </text>
        </g>
      );
    case 'pvcurve': // exponential PV curve
      return (
        <g>
          <path
            d="M 10 80 C 80 80, 130 75, 160 30 L 190 15"
            fill="none"
            stroke={t.stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line x1="10" y1="90" x2="190" y2="90" stroke={t.accent} strokeOpacity="0.4" strokeWidth="1" />
          <line x1="10" y1="10" x2="10" y2="90" stroke={t.accent} strokeOpacity="0.4" strokeWidth="1" />
        </g>
      );
    case 'cascade': // Astrup staged drops
      return (
        <g>
          {[
            [10, 30, 50, 30],
            [50, 30, 50, 50],
            [50, 50, 100, 50],
            [100, 50, 100, 70],
            [100, 70, 150, 70],
            [150, 70, 150, 90],
            [150, 90, 190, 90],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={t.stroke} strokeWidth="2" strokeLinecap="round" />
          ))}
          {[
            [50, 30],
            [100, 50],
            [150, 70],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" fill={t.stroke} />
          ))}
        </g>
      );
    case 'propagation': // spreading depolarization wave fronts
      return (
        <g>
          {[20, 60, 100, 140, 180].map((cx, i) => (
            <circle
              key={cx}
              cx={cx}
              cy="55"
              r="14"
              fill="none"
              stroke={t.stroke}
              strokeWidth="2"
              opacity={1 - i * 0.18}
            />
          ))}
        </g>
      );
    case 'barrier': // tight junction bars
      return (
        <g>
          {[20, 60, 100, 140, 180].map((cx) => (
            <g key={cx}>
              <rect x={cx - 6} y="20" width="12" height="70" rx="2" fill={t.stroke} opacity="0.35" />
              <line x1={cx} y1="20" x2={cx} y2="90" stroke={t.accent} strokeWidth="1.5" />
            </g>
          ))}
        </g>
      );
    case 'pedshead': // pediatric head with open fontanelle
      return (
        <g>
          <ellipse cx="100" cy="60" rx="56" ry="40" fill="none" stroke={t.stroke} strokeWidth="2" />
          <path d="M 80 28 Q 100 18 120 28" fill="none" stroke={t.accent} strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="125" cy="58" r="3" fill={t.stroke} />
        </g>
      );
    case 'co2-curve': // CO2 reactivity sigmoid
      return (
        <g>
          <path
            d="M 10 80 C 50 80, 70 80, 100 50 C 130 20, 150 20, 190 20"
            fill="none"
            stroke={t.stroke}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text x="100" y="100" textAnchor="middle" fontSize="9" fill={t.accent} fontWeight="700" fontFamily="system-ui">
            CO₂ vs CBF
          </text>
        </g>
      );
    case 'energy': // cerebral metabolism, energy bolt
      return (
        <g>
          <path
            d="M 80 15 L 60 60 L 95 60 L 80 95 L 130 50 L 100 50 L 115 15 Z"
            fill={t.stroke}
            fillOpacity="0.35"
            stroke={t.stroke}
            strokeWidth="1.5"
          />
        </g>
      );

    // ── integration variants ────────────────────────────────────────────────
    case 'discordance': // two diverging waves
      return (
        <g>
          <path d="M 10 30 Q 60 30 100 55 T 190 80" fill="none" stroke={t.stroke} strokeWidth="2" />
          <path d="M 10 80 Q 60 80 100 55 T 190 30" fill="none" stroke={t.accent} strokeWidth="2" />
          <text x="100" y="20" textAnchor="middle" fontSize="9" fill={t.accent} fontWeight="700" fontFamily="system-ui">
            disagree
          </text>
        </g>
      );
    case 'ecmo': // circulating loop
      return (
        <g>
          <ellipse cx="100" cy="55" rx="60" ry="32" fill="none" stroke={t.stroke} strokeWidth="2" />
          <circle cx="40" cy="55" r="8" fill={t.stroke} />
          <circle cx="160" cy="55" r="8" fill={t.accent} />
          <text x="100" y="58" textAnchor="middle" fontSize="9" fill={t.accent} fontWeight="700" fontFamily="system-ui" letterSpacing="0.1em">
            ECMO
          </text>
        </g>
      );
    case 'braindeath':
      return (
        <g>
          <ellipse cx="100" cy="55" rx="55" ry="35" fill="none" stroke={t.stroke} strokeWidth="2" strokeDasharray="4 3" />
          <line x1="50" y1="55" x2="150" y2="55" stroke={t.stroke} strokeWidth="2" />
          <text x="100" y="100" textAnchor="middle" fontSize="9" fill={t.accent} fontWeight="700" fontFamily="system-ui" letterSpacing="0.1em">
            ISOELECTRIC
          </text>
        </g>
      );
    case 'osmotherapy':
      return (
        <g>
          <rect x="60" y="20" width="80" height="60" rx="6" fill={t.stroke} fillOpacity="0.18" stroke={t.stroke} strokeWidth="1.5" />
          {[70, 90, 110, 130].map((cx, i) => (
            <circle key={i} cx={cx} cy={40 + (i % 2) * 10} r="3" fill={t.accent} />
          ))}
          <text x="100" y="100" textAnchor="middle" fontSize="9" fill={t.accent} fontWeight="700" fontFamily="system-ui">
            3% NaCl · mannitol
          </text>
        </g>
      );
    case 'newborn':
      return (
        <g>
          <ellipse cx="100" cy="60" rx="60" ry="42" fill="none" stroke={t.stroke} strokeWidth="2" />
          <path d="M 78 28 Q 100 18 122 28" fill="none" stroke={t.accent} strokeWidth="2" />
          <text x="100" y="100" textAnchor="middle" fontSize="9" fill={t.accent} fontWeight="700" fontFamily="system-ui">
            NICU
          </text>
        </g>
      );
    case 'stroke':
      return (
        <g>
          <ellipse cx="100" cy="55" rx="60" ry="36" fill="none" stroke={t.stroke} strokeWidth="2" />
          <path d="M 95 40 L 70 70 L 95 70 L 85 90 L 130 60 L 105 60 L 115 35 Z" fill={t.accent} fillOpacity="0.6" />
        </g>
      );
    case 'seizure':
      return (
        <g>
          <path
            d="M 0 55 L 30 55 L 35 30 L 42 80 L 49 25 L 56 78 L 63 30 L 70 55 L 200 55"
            fill="none"
            stroke={t.stroke}
            strokeWidth="2"
          />
        </g>
      );
    case 'edema':
      return (
        <g>
          <ellipse cx="100" cy="55" rx="62" ry="35" fill={t.stroke} fillOpacity="0.18" stroke={t.stroke} strokeWidth="2" />
          <ellipse cx="100" cy="55" rx="45" ry="25" fill="none" stroke={t.accent} strokeWidth="1" strokeDasharray="3 3" />
        </g>
      );
    case 'family':
      return (
        <g>
          {[60, 100, 140].map((cx, i) => (
            <g key={cx}>
              <circle cx={cx} cy={i === 1 ? 38 : 48} r="9" fill={t.stroke} opacity={0.6 + i * 0.1} />
              <rect x={cx - 12} y={i === 1 ? 50 : 60} width="24" height="32" rx="6" fill={t.stroke} opacity={0.45 + i * 0.1} />
            </g>
          ))}
        </g>
      );
    case 'metabolicicu':
      return (
        <g>
          <path
            d="M 10 65 L 60 65 L 75 30 L 95 90 L 110 30 L 130 65 L 190 65"
            fill="none"
            stroke={t.stroke}
            strokeWidth="2"
          />
          <text x="100" y="105" textAnchor="middle" fontSize="9" fill={t.accent} fontWeight="700" fontFamily="system-ui" letterSpacing="0.1em">
            LPR · GLUCOSE
          </text>
        </g>
      );
    case 'meningitis':
      return (
        <g>
          <ellipse cx="100" cy="55" rx="60" ry="36" fill="none" stroke={t.stroke} strokeWidth="2" />
          {[55, 75, 95, 115, 135].map((cx) => (
            <circle key={cx} cx={cx} cy="55" r="4" fill={t.accent} />
          ))}
        </g>
      );

    default:
      return (
        <g>
          <rect x="20" y="20" width="160" height="70" rx="8" fill={t.stroke} fillOpacity="0.15" />
        </g>
      );
  }
}
