export type AutoregMode = 'realistic' | 'intact' | 'impaired';

export interface PairedSample {
  t: number;
  map: number;
  icp: number;
  cpp: number;
}

export interface PRxPoint {
  t: number;
  prx: number;
  cpp: number;
}

export interface RawSample {
  t: number;
  v: number;
  map?: number;
}

export interface FitCoeff {
  a: number;
  b: number;
  c: number;
}

export interface CPPoptConfig {
  sampleRateHz: number;
  decimationSec: number;
  windowSize: number;
  prxIntervalSec: number;
  bufferHours: number;
  cppBinSize: number;
  cppBinMin: number;
  cppBinMax: number;
  minBinsForFit: number;
  minSamplesPerBin: number;
  trueCPPopt: number;
  autoregBandWidth: number;
}

export interface CPPoptState {
  mode: AutoregMode;
  rawAbp: RawSample[];
  rawIcp: RawSample[];
  meanPairs: PairedSample[];
  prxTrace: PRxPoint[];
  cppoptBuffer: PRxPoint[];
  binData: Record<number, number>;
  fitCoeff: FitCoeff | null;
  cppoptValue: number | null;
  prxValue: number | null;
  simT: number;
  prxLastUpdateMin: number;
}

export const DEFAULT_CONFIG: CPPoptConfig = {
  sampleRateHz: 100,
  decimationSec: 10,
  windowSize: 30,
  prxIntervalSec: 60,
  bufferHours: 4,
  cppBinSize: 5,
  cppBinMin: 40,
  cppBinMax: 110,
  minBinsForFit: 4,
  minSamplesPerBin: 12,
  trueCPPopt: 70,
  autoregBandWidth: 18,
};

export function makeInitialState(): CPPoptState {
  return {
    mode: 'realistic',
    rawAbp: [],
    rawIcp: [],
    meanPairs: [],
    prxTrace: [],
    cppoptBuffer: [],
    binData: {},
    fitCoeff: null,
    cppoptValue: null,
    prxValue: null,
    simT: 0,
    prxLastUpdateMin: 0,
  };
}
