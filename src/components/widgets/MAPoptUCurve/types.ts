/**
 * Types for the MAPopt-from-ORx/Mx widget, non-invasive equivalent of the
 * PRx-driven CPPopt widget. Bins by MAP (no ICP/CPP available), runs two
 * parallel reactivity pipelines (ORx and Mx) on the same patient simulation
 * so the user can compare them side-by-side.
 */

import type { AutoregMode } from '../_shared/correlationIndex';
export type { AutoregMode };

export type IndexChoice = 'orx' | 'mx';

export interface RawSample {
  t: number;
  v: number;
  map?: number;
}

export interface PairedSample {
  t: number;
  map: number;
  rso2: number;
  mfv: number;
}

export interface IndexBufferPoint {
  t: number;
  map: number;
  r: number;
}

export interface FitCoeff {
  a: number;
  b: number;
  c: number;
}

export interface IndexPipelineState {
  trace: { t: number; r: number }[];
  buffer: IndexBufferPoint[];
  binData: Record<number, number>;
  fitCoeff: FitCoeff | null;
  optValue: number | null;
  rValue: number | null;
}

export interface MAPoptState {
  mode: AutoregMode;
  rawAbp: RawSample[];
  rawRso2: RawSample[];
  rawMfv: RawSample[];
  meanPairs: PairedSample[];
  orx: IndexPipelineState;
  mx: IndexPipelineState;
  simT: number;
  lastUpdateMin: number;
}

export interface MAPoptConfig {
  sampleRateHz: number;
  decimationSec: number;
  windowSize: number;
  bufferHours: number;
  mapBinSize: number;
  mapBinMin: number;
  mapBinMax: number;
  minBinsForFit: number;
  minSamplesPerBin: number;
  trueMAPopt: number;
  autoregBandWidth: number;
}

export const DEFAULT_CONFIG: MAPoptConfig = {
  sampleRateHz: 100,
  decimationSec: 10,
  windowSize: 30,
  bufferHours: 4,
  mapBinSize: 5,
  mapBinMin: 50,
  mapBinMax: 110,
  minBinsForFit: 4,
  minSamplesPerBin: 12,
  trueMAPopt: 85,
  autoregBandWidth: 35,
};

export function makeInitialPipeline(): IndexPipelineState {
  return {
    trace: [],
    buffer: [],
    binData: {},
    fitCoeff: null,
    optValue: null,
    rValue: null,
  };
}

export function makeInitialState(): MAPoptState {
  return {
    mode: 'realistic',
    rawAbp: [],
    rawRso2: [],
    rawMfv: [],
    meanPairs: [],
    orx: makeInitialPipeline(),
    mx: makeInitialPipeline(),
    simT: 0,
    lastUpdateMin: 0,
  };
}
