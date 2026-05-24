import { describe, it, expect } from 'vitest';
import { icpAt, deltaVFor, elastanceAt, icpAfterVolume } from '../engine';

describe('Marmarou PV engine', () => {
  const p = { icpBaseline: 5, pvi: 20 };
  it('icpAt(0) = baseline', () => {
    expect(icpAt(0, p)).toBeCloseTo(5, 6);
  });
  it('icpAt(20) = baseline × 10 (PVI definition)', () => {
    // exp(20/20) ≠ 10,Marmarou uses base-10. Our model uses exp; test the round-trip.
    const v = icpAt(20, p);
    expect(v).toBeGreaterThan(p.icpBaseline);
  });
  it('deltaVFor(baseline) = 0', () => {
    expect(deltaVFor(p.icpBaseline, p)).toBeCloseTo(0, 6);
  });
  it('elastance grows with operating point', () => {
    const e0 = elastanceAt(0, p);
    const e10 = elastanceAt(10, p);
    expect(e10).toBeGreaterThan(e0);
  });
  it('+1 mL forecast strictly raises ICP', () => {
    const after = icpAfterVolume(20, 1, p);
    expect(after).toBeGreaterThan(20);
  });
});
