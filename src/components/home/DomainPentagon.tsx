'use client';

import Link from 'next/link';
import { useState } from 'react';

type Vertex = {
  name: string;
  count: number;
  colorHex: string;
  examples: string;
  cx: number;
  cy: number;
  lx: number;
  ly: number;
  textAnchor: 'start' | 'middle' | 'end';
};

// Pentagon vertices at angles -90, -18, 54, 126, 198 deg from horizontal.
// Center (400, 300), radius 220.
const vertices: Vertex[] = [
  {
    name: 'Pressure',
    count: 6,
    colorHex: '#F59E0B',
    examples: 'ICP · CPP · PRx · CPPopt',
    cx: 400, cy: 80, lx: 400, ly: 18, textAnchor: 'middle',
  },
  {
    name: 'Flow',
    count: 3,
    colorHex: '#FBBF24',
    examples: 'TCD · Mx · Direct CBF',
    cx: 609, cy: 232, lx: 660, ly: 232, textAnchor: 'start',
  },
  {
    name: 'Oxygen',
    count: 4,
    colorHex: '#14B8A6',
    examples: 'NIRS · PbtO₂ · SjvO₂',
    cx: 529, cy: 488, lx: 580, ly: 510, textAnchor: 'start',
  },
  {
    name: 'Metabolism',
    count: 1,
    colorHex: '#A78BFA',
    examples: 'Microdialysis',
    cx: 271, cy: 488, lx: 220, ly: 510, textAnchor: 'end',
  },
  {
    name: 'Electrical',
    count: 6,
    colorHex: '#8B5CF6',
    examples: 'EEG · qEEG · aEEG · BIS · NPi · EPs',
    cx: 191, cy: 232, lx: 140, ly: 232, textAnchor: 'end',
  },
];

export function DomainPentagon() {
  const [hovered, setHovered] = useState<number | null>(null);

  // Opacity helpers driven by hover state: when a vertex is hovered, brighten
  // it + its spoke and dim everything else.
  const vertexOpacity = (i: number) => (hovered == null ? 1 : hovered === i ? 1 : 0.32);
  const spokeOpacity = (i: number) => (hovered == null ? 0.45 : hovered === i ? 1 : 0.15);
  const spokeWidth = (i: number) => (hovered === i ? 2 : 1);
  const meshOpacity = hovered == null ? 0.15 : 0.06;

  return (
    <section aria-labelledby="domains-title" className="py-12 md:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="eyebrow mb-2 text-brand-tealLight">What it is</p>
        <h2
          id="domains-title"
          className="m-0 mb-4 text-[26px] md:text-[34px] font-bold leading-tight"
        >
          Five signals. One pediatric brain. Real time.
        </h2>
        <p className="m-0 text-[15px] md:text-[16px] text-ink/85 leading-[1.6]">
          Modern pediatric neurocritical care no longer treats the brain as a single number. Five
          physiological domains are monitored in parallel, each catches a different mode of
          secondary injury that the others would miss. No single signal is enough; the clinical
          question only resolves when the streams are interpreted together. Hover a vertex below to
          isolate its spoke.
        </p>
      </div>

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className="flex justify-center">
          <svg
            role="img"
            aria-labelledby="pentagon-title pentagon-desc"
            viewBox="0 0 800 600"
            className="h-auto w-full max-w-[680px]"
            onMouseLeave={() => setHovered(null)}
          >
            <title id="pentagon-title">Five monitoring domains</title>
            <desc id="pentagon-desc">
              Pentagon diagram showing five physiological domains around a central pediatric brain
              node: pressure, flow, oxygen, metabolism, and electrical activity. Hover a vertex to
              isolate it.
            </desc>

            <g style={{ opacity: meshOpacity, transition: 'opacity 200ms ease' }}>
              {vertices.map((a, i) =>
                vertices.slice(i + 1).map((b, j) => (
                  <line
                    key={`${i}-${j}`}
                    x1={a.cx}
                    y1={a.cy}
                    x2={b.cx}
                    y2={b.cy}
                    stroke="#94A3B8"
                    strokeWidth="1"
                  />
                )),
              )}
            </g>

            {vertices.map((v, i) => (
              <line
                key={`spoke-${i}`}
                x1="400"
                y1="284"
                x2={v.cx}
                y2={v.cy}
                stroke={v.colorHex}
                strokeWidth={spokeWidth(i)}
                strokeDasharray="3 4"
                style={{ opacity: spokeOpacity(i), transition: 'opacity 200ms ease, stroke-width 200ms ease' }}
              />
            ))}

            <g>
              <circle cx="400" cy="284" r="64" fill="#0F1A2E" stroke="#2A3B55" strokeWidth="1.5" />
              <ellipse
                cx="400"
                cy="280"
                rx="44"
                ry="44"
                fill="none"
                stroke={hovered != null ? vertices[hovered]!.colorHex : '#14B8A6'}
                strokeWidth="1"
                opacity={hovered != null ? 0.75 : 0.4}
                style={{ transition: 'stroke 200ms ease, opacity 200ms ease' }}
              />
              <text
                x="400"
                y="280"
                textAnchor="middle"
                fill="#E5E7EB"
                fontSize="13"
                fontFamily="system-ui"
                fontWeight="500"
              >
                the pediatric
              </text>
              <text
                x="400"
                y="298"
                textAnchor="middle"
                fill="#E5E7EB"
                fontSize="13"
                fontFamily="system-ui"
                fontWeight="500"
              >
                brain
              </text>
            </g>

            {vertices.map((v, i) => {
              const isActive = hovered === i;
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  tabIndex={0}
                  style={{
                    opacity: vertexOpacity(i),
                    transition: 'opacity 200ms ease',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  aria-label={`${v.name}: ${v.count} modalities,${v.examples}`}
                >
                  {isActive && (
                    <circle
                      cx={v.cx}
                      cy={v.cy}
                      r="52"
                      fill={v.colorHex}
                      opacity="0.12"
                    />
                  )}
                  <circle
                    cx={v.cx}
                    cy={v.cy}
                    r={isActive ? 42 : 40}
                    fill="#0F1A2E"
                    stroke={v.colorHex}
                    strokeWidth={isActive ? 3 : 2}
                    style={{ transition: 'r 200ms ease, stroke-width 200ms ease' }}
                  />
                  <text
                    x={v.cx}
                    y={v.cy - 4}
                    textAnchor="middle"
                    fill={v.colorHex}
                    fontSize="14"
                    fontFamily="system-ui"
                    fontWeight="500"
                  >
                    {v.name}
                  </text>
                  <text
                    x={v.cx}
                    y={v.cy + 14}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="11"
                    fontFamily="system-ui"
                  >
                    {v.count} {v.count === 1 ? 'modality' : 'modalities'}
                  </text>
                  <text
                    x={v.lx}
                    y={v.ly}
                    textAnchor={v.textAnchor}
                    fill={isActive ? v.colorHex : '#64748B'}
                    fontSize="11"
                    fontFamily="system-ui"
                    letterSpacing="0.05em"
                    style={{ transition: 'fill 200ms ease' }}
                  >
                    {v.examples}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="space-y-3">
          {vertices.map((v, i) => {
            const isActive = hovered === i;
            return (
              <div
                key={v.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((prev) => (prev === i ? null : prev))}
                className="flex cursor-default items-start gap-4 rounded-md border bg-surface-card px-4 py-3 transition-colors"
                style={{
                  borderColor: isActive ? v.colorHex : '',
                  background: isActive ? `${v.colorHex}1A` : '',
                }}
              >
                <span
                  aria-hidden
                  className="mt-1 inline-block h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: v.colorHex }}
                />
                <div>
                  <h3 className="m-0 text-[14px] font-bold text-ink">{v.name}</h3>
                  <p className="m-0 mt-1 text-[12.5px] text-ink/80 leading-[1.5]">{v.examples}</p>
                </div>
                <span
                  className="ml-auto text-[10px] font-mono text-ink-dim"
                  aria-label={`${v.count} modalities`}
                >
                  {v.count}
                </span>
              </div>
            );
          })}
          <p className="m-0 pt-1 text-[12px] text-ink-dim">
            Plus pupillometry, ONSD ultrasound, fontanelle US, brain temperature, and non-invasive
            ICP estimators, bedside anchors that cross every domain.
          </p>
          <Link
            href="/modalities/"
            className="mt-3 inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.06em] text-brand-tealLight hover:text-brand-teal"
          >
            See all 24 modalities <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
