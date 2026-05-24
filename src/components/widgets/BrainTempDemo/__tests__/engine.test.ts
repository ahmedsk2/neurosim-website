import { describe, it, expect } from 'vitest';
import { brainTempFor, cmro2Multiplier, classifyTemp } from '../engine';

describe('Brain temperature engine', () => {
  it('baseline gradient ~ 0.4 °C', () => {
    const b = brainTempFor({ coreC: 37, hasSeizure: false, hasHyperemia: false, highIcp: false });
    expect(b - 37).toBeCloseTo(0.4, 5);
  });
  it('seizure widens gradient', () => {
    const noSeizure = brainTempFor({ coreC: 37, hasSeizure: false, hasHyperemia: false, highIcp: false });
    const seizure = brainTempFor({ coreC: 37, hasSeizure: true, hasHyperemia: false, highIcp: false });
    expect(seizure).toBeGreaterThan(noSeizure);
  });
  it('Q10 = 1.07 → +7% per °C', () => {
    expect(cmro2Multiplier(38)).toBeCloseTo(1.07, 4);
    expect(cmro2Multiplier(36)).toBeCloseTo(1 / 1.07, 4);
  });
  it('classifyTemp boundaries', () => {
    expect(classifyTemp(37).status).toBe('good');
    expect(classifyTemp(38).status).toBe('warn');
    expect(classifyTemp(39).status).toBe('danger');
    expect(classifyTemp(36).status).toBe('warn');
  });
});
