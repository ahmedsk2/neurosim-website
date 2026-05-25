'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Three.js is client-only; ssr: false ensures the brain mounts after hydration.
const BrainModel = dynamic(() => import('./BrainModel'), {
  ssr: false,
  loading: () => <div aria-hidden className="brain-model-loading" />,
});

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-lg border-l-4 border-l-brand-teal bg-surface-card px-6 py-12 md:px-10 md:py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 70% 50%, rgba(20,184,166,0.10), transparent 70%)',
        }}
      />
      <div className="relative z-10 grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-8">
        <div>
          <p className="eyebrow mb-3 text-brand-tealLight">
            Pediatric Multimodal Neuromonitoring
          </p>
          <h1
            id="hero-title"
            className="m-0 mb-5 text-[34px] md:text-[44px] lg:text-[52px] font-bold leading-[1.05] tracking-tight"
          >
            The first injury takes <span className="text-brand-amber">seconds</span>.
            <br />
            The second injury takes <span className="text-brand-tealLight">hours</span>.
          </h1>
          <p className="m-0 mb-7 max-w-[70ch] text-[15px] md:text-[16px] text-ink/85 leading-[1.6]">
            Multimodal neuromonitoring catches the secondary injury cascade that bedside exam
            misses. Five signal streams, pressure, flow, oxygen, metabolism, electrical activity,
            layered on the same pediatric patient, interpreted together.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/foundations/"
              className="inline-flex items-center gap-2 rounded-md bg-brand-teal px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.06em] text-surface-darker hover:bg-brand-tealLight focus:outline-hidden focus:ring-2 focus:ring-brand-tealLight"
            >
              Start with foundations <span aria-hidden>→</span>
            </Link>
            <Link
              href="/modalities/"
              className="inline-flex items-center gap-2 rounded-md border border-brand-tealDark px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.06em] text-brand-tealLight hover:bg-surface-deeper hover:border-brand-teal focus:outline-hidden focus:ring-2 focus:ring-brand-teal"
            >
              Browse 24 modalities <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
        <div className="relative">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

/**
 * HeroIllustration, composite of:
 *   - 3D rotating brain (WebGL, lazy)
 *   - Faint skull silhouette (fixed)
 *   - Five SVG channel overlays with live waveforms + stagger-fade-in
 */
function HeroIllustration() {
  const reducedMotion = useReducedMotion();
  return (
    <div className="hero-illustration relative mx-auto aspect-square w-full max-w-[600px]">
      {/* LAYER 1: 3D brain */}
      <div className="absolute inset-0">
        <BrainModel reducedMotion={reducedMotion} />
      </div>

      {/* LAYER 2: SVG channel overlay */}
      <svg
        role="img"
        aria-labelledby="hero-svg-title hero-svg-desc"
        viewBox="0 0 600 600"
        className="hero-svg-overlay absolute inset-0 h-full w-full"
      >
        <title id="hero-svg-title">Five pediatric neuromonitoring channels</title>
        <desc id="hero-svg-desc">
          Five monitoring channels labeled around a rotating 3D brain: ICP, NIRS, cEEG, TCD, and
          pupillometry.
        </desc>

        {/* Faint skull silhouette anchor for the channels */}
        <ellipse
          cx="300"
          cy="290"
          rx="210"
          ry="200"
          fill="none"
          stroke="#2A3B55"
          strokeWidth="1"
          opacity="0.25"
        />

        {/* CHANNEL 1: ICP */}
        <g className="hero-channel hero-channel-1">
          <line x1="300" y1="60" x2="300" y2="98" stroke="#F59E0B" strokeWidth="2.5" />
          <rect x="292" y="53" width="16" height="10" fill="#F59E0B" rx="1" />
          <text x="32" y="72" fill="#F59E0B" fontSize="12" fontFamily="system-ui" letterSpacing="0.1em">
            ICP
          </text>
          <text x="32" y="98" fill="#E5E7EB" fontSize="24" fontFamily="system-ui" fontWeight="500">
            14
            <tspan fontSize="12" fill="#94A3B8" dx="4">
              mmHg
            </tspan>
          </text>
          <path
            className="hero-icp-wave"
            d="M 32 124 L 60 124 L 65 108 L 73 116 L 82 120 L 95 124 L 120 124 L 125 108 L 133 116 L 142 120 L 155 124 L 180 124"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="1.5"
          />
        </g>

        {/* CHANNEL 2: NIRS */}
        <g className="hero-channel hero-channel-2">
          <rect x="388" y="160" width="32" height="18" fill="#14B8A6" rx="3" />
          <rect
            className="hero-nirs-pulse"
            x="388"
            y="160"
            width="32"
            height="18"
            fill="none"
            stroke="#2DD4BF"
            strokeWidth="1"
            rx="3"
          />
          <text x="455" y="162" fill="#14B8A6" fontSize="12" fontFamily="system-ui" letterSpacing="0.1em">
            NIRS rSO₂
          </text>
          <text x="455" y="188" fill="#E5E7EB" fontSize="24" fontFamily="system-ui" fontWeight="500">
            72
            <tspan fontSize="12" fill="#94A3B8" dx="4">
              %
            </tspan>
          </text>
        </g>

        {/* CHANNEL 3: cEEG */}
        <g className="hero-channel hero-channel-3">
          <text x="32" y="200" fill="#8B5CF6" fontSize="12" fontFamily="system-ui" letterSpacing="0.1em">
            cEEG
          </text>
          <g transform="translate(32 210)">
            <rect className="hero-eeg-band-0" x="0" y="0" width="100" height="4" fill="#8B5CF6" />
            <rect className="hero-eeg-band-1" x="0" y="7" width="100" height="4" fill="#8B5CF6" />
            <rect className="hero-eeg-band-2" x="0" y="14" width="100" height="4" fill="#8B5CF6" />
            <rect className="hero-eeg-band-3" x="0" y="21" width="100" height="4" fill="#8B5CF6" />
            <rect className="hero-eeg-band-4" x="0" y="28" width="100" height="4" fill="#8B5CF6" />
          </g>
        </g>

        {/* CHANNEL 4: TCD */}
        <g className="hero-channel hero-channel-4">
          <rect x="460" y="285" width="22" height="14" fill="#FBBF24" rx="2" />
          <text x="495" y="298" fill="#FBBF24" fontSize="12" fontFamily="system-ui" letterSpacing="0.1em">
            TCD MCA
          </text>
          <text x="495" y="324" fill="#E5E7EB" fontSize="24" fontFamily="system-ui" fontWeight="500">
            80
            <tspan fontSize="12" fill="#94A3B8" dx="4">
              cm/s
            </tspan>
          </text>
          <path
            className="hero-tcd-wave"
            d="M 495 346 Q 510 332 525 344 L 530 346 Q 545 332 560 344 L 565 346"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="1.5"
          />
        </g>

        {/* CHANNEL 5: NPi */}
        <g className="hero-channel hero-channel-5">
          <text x="32" y="390" fill="#2DD4BF" fontSize="12" fontFamily="system-ui" letterSpacing="0.1em">
            NPi
          </text>
          <text x="32" y="416" fill="#E5E7EB" fontSize="24" fontFamily="system-ui" fontWeight="500">
            4.2
          </text>
        </g>

        {/* Bottom annotation strip */}
        <g opacity="0.7">
          <line x1="32" y1="560" x2="568" y2="560" stroke="#1E293B" strokeWidth="1" />
          <text x="32" y="582" fill="#64748B" fontSize="10" fontFamily="system-ui" letterSpacing="0.15em">
            PRESSURE · FLOW · OXYGEN · METABOLISM · ELECTRICAL
          </text>
        </g>
      </svg>
    </div>
  );
}
