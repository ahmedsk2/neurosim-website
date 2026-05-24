import { describe, it, expect } from 'vitest';
import { PATTERNS, npiWithSedation, asymmetryFlag } from '../engine';

describe('Pupil trainer engine', () => {
  it('12 canonical patterns', () => {
    expect(PATTERNS.length).toBe(12);
  });
  it('every pattern has bilateral side data + status + per-side reactivity', () => {
    for (const p of PATTERNS) {
      expect(p.left.size).toBeGreaterThan(0);
      expect(p.right.size).toBeGreaterThan(0);
      expect(p.left.npi).toBeGreaterThanOrEqual(0);
      expect(p.left.npi).toBeLessThanOrEqual(5);
      expect(p.right.npi).toBeGreaterThanOrEqual(0);
      expect(p.right.npi).toBeLessThanOrEqual(5);
      expect(['good', 'warn', 'danger']).toContain(p.status);
      expect(typeof p.leftReactsToLight).toBe('boolean');
      expect(typeof p.rightReactsToLight).toBe('boolean');
    }
  });
  it('sedation modifier is identity above BIS 40', () => {
    expect(npiWithSedation(4.5, 60)).toBe(4.5);
    expect(npiWithSedation(4.5, 40)).toBe(4.5);
  });
  it('sedation modifier reduces NPi below BIS 40', () => {
    expect(npiWithSedation(4.5, 20)).toBeLessThan(4.5);
    expect(npiWithSedation(4.5, 0)).toBeCloseTo(4.5 - 0.8, 5);
  });
  it('NPi never goes below 0', () => {
    expect(npiWithSedation(0.5, 0)).toBeGreaterThanOrEqual(0);
  });
  it('asymmetry flag triggers on > 1mm size difference', () => {
    const lEqual = { size: 3.5, npi: 4.5, constrictionPctPerSec: 22, latencyMs: 250, dilationVelMmPerSec: 1.5 };
    const lBigger = { ...lEqual, size: 5 };
    const r = lEqual;
    expect(asymmetryFlag(lEqual, r).significant).toBe(false);
    expect(asymmetryFlag(lBigger, r).significant).toBe(true);
  });
  it('left blown unilateral: left fixed, right reactive', () => {
    const blown = PATTERNS.find((p) => p.id === 'left_blown')!;
    expect(blown.leftReactsToLight).toBe(false);
    expect(blown.rightReactsToLight).toBe(true);
    expect(blown.left.size).toBeGreaterThan(blown.right.size + 1);
  });
});
