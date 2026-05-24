'use client';

import dynamic from 'next/dynamic';
import { type ComponentType } from 'react';

type WidgetProps = Record<string, unknown>;

const REGISTRY: Record<string, () => Promise<{ default: ComponentType<WidgetProps> }>> = {
  CPPoptUCurve: () => import('@/components/widgets/CPPoptUCurve'),
  PRxCalculator: () => import('@/components/widgets/PRxCalculator'),
  ICPWaveformTrainer: () => import('@/components/widgets/ICPWaveformTrainer'),
  TCDWaveformExplorer: () => import('@/components/widgets/TCDWaveformExplorer'),
  LindegaardCalculator: () => import('@/components/widgets/LindegaardCalculator'),
  NIRSDisplay: () => import('@/components/widgets/NIRSDisplay'),
  EEGPatternLibrary: () => import('@/components/widgets/EEGPatternLibrary'),
  aEEGGenerator: () => import('@/components/widgets/aEEGGenerator'),
  PupilTrainer: () => import('@/components/widgets/PupilTrainer'),
  AstrupCascade: () => import('@/components/widgets/AstrupCascade'),
  MarmarouPVCurve: () => import('@/components/widgets/MarmarouPVCurve'),
  CPPTriangle: () => import('@/components/widgets/CPPTriangle'),
  CO2ReactivityCurve: () => import('@/components/widgets/CO2ReactivityCurve'),
  GCSChart: () => import('@/components/widgets/GCSChart'),
  PbtO2Demo: () => import('@/components/widgets/PbtO2Demo'),
  MicrodialysisGrid: () => import('@/components/widgets/MicrodialysisGrid'),
  SjvO2Demo: () => import('@/components/widgets/SjvO2Demo'),
  ONSDDemo: () => import('@/components/widgets/ONSDDemo'),
  NonInvasiveICPDemo: () => import('@/components/widgets/NonInvasiveICPDemo'),
  AgeBandNorms: () => import('@/components/widgets/AgeBandNorms'),
  qEEGSpectrogram: () => import('@/components/widgets/qEEGSpectrogram'),
  BISDemo: () => import('@/components/widgets/BISDemo'),
  PEEPICPMAPDemo: () => import('@/components/widgets/PEEPICPMAPDemo'),
  RAPDemo: () => import('@/components/widgets/RAPDemo'),
  CushingReflexDemo: () => import('@/components/widgets/CushingReflexDemo'),
  PlateauWaveSimulator: () => import('@/components/widgets/PlateauWaveSimulator'),
  MultimodalDiscordance: () => import('@/components/widgets/MultimodalDiscordance'),
  SpreadingDepolarizationAnimator: () => import('@/components/widgets/SpreadingDepolarizationAnimator'),
  OsmotherapyExplorer: () => import('@/components/widgets/OsmotherapyExplorer'),
  SSEPViewer: () => import('@/components/widgets/SSEPViewer'),
  BrainTempDemo: () => import('@/components/widgets/BrainTempDemo'),
  ThermalCBFDemo: () => import('@/components/widgets/ThermalCBFDemo'),
  SDPropagation: () => import('@/components/widgets/SDPropagation'),
  LassenCurve: () => import('@/components/widgets/LassenCurve'),
  O2ReactivityCurve: () => import('@/components/widgets/O2ReactivityCurve'),
  CMRO2TempSlider: () => import('@/components/widgets/CMRO2TempSlider'),
  VolumeCompartmentAnimation: () => import('@/components/widgets/VolumeCompartmentAnimation'),
  GCSChartQuick: () => import('@/components/widgets/GCSChartQuick'),
  PediatricDoseCalculator: () => import('@/components/widgets/PediatricDoseCalculator'),
  OrxCalculator: () => import('@/components/widgets/OrxCalculator'),
  MxCalculator: () => import('@/components/widgets/MxCalculator'),
  MAPoptUCurve: () => import('@/components/widgets/MAPoptUCurve'),
};

export function WidgetEmbed({
  name,
  ...rest
}: {
  name: string;
} & WidgetProps) {
  const loader = REGISTRY[name];
  if (!loader) {
    return (
      <div className="my-4 rounded-md border border-status-danger bg-status-danger/10 p-3 text-[12px] text-status-dangerText">
        Unknown widget: <code>{name}</code>
      </div>
    );
  }
  const Component = dynamic(loader, {
    ssr: false,
    loading: () => <WidgetSkeleton name={name} />,
  });
  return <Component {...rest} />;
}

/**
 * Skeleton shown while a widget bundle is loading. Approximates the widget's
 * canvas dimensions so the surrounding layout doesn't jump when it hydrates.
 * Subtle pulsing teal frame + a "Loading widget" caption.
 */
function WidgetSkeleton({ name }: { name: string }) {
  return (
    <div
      role="status"
      aria-busy
      aria-label={`Loading ${name} widget`}
      className="my-4 overflow-hidden rounded-lg border border-line bg-surface-card"
    >
      <div className="flex items-center justify-between border-b border-line bg-surface-deeper/40 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-brand-teal" />
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-tealLight">
            {name}
          </span>
        </div>
        <span className="text-[10px] text-ink-dim animate-pulse">Loading widget…</span>
      </div>
      <div className="space-y-3 p-4">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-md bg-surface-deeper"
              style={{ animationDelay: `${i * 90}ms` }}
            />
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="h-32 animate-pulse rounded-md bg-surface-deeper" />
          <div className="h-32 animate-pulse rounded-md bg-surface-deeper" style={{ animationDelay: '120ms' }} />
        </div>
        <div className="h-44 animate-pulse rounded-md bg-surface-deeper" style={{ animationDelay: '240ms' }} />
      </div>
    </div>
  );
}
