import { describe, it, expect } from 'vitest';
import { probability } from '../index';

describe('Plateau-wave probability engine', () => {
  it('zero compliance + high vasomotor + marginal CPP → highest probability', () => {
    const p = probability(0, 1, 1);
    expect(p).toBeGreaterThan(0);
    expect(p).toBeLessThanOrEqual(1);
  });
  it('full compliance → zero probability', () => {
    expect(probability(1, 1, 1)).toBe(0);
  });
  it('zero vasomotor → zero probability', () => {
    expect(probability(0.3, 0, 1)).toBe(0);
  });
  it('output bounded [0, 1]', () => {
    for (let c = 0; c <= 1; c += 0.1) {
      for (let v = 0; v <= 1; v += 0.1) {
        for (let m = 0; m <= 1; m += 0.1) {
          const p = probability(c, v, m);
          expect(p).toBeGreaterThanOrEqual(0);
          expect(p).toBeLessThanOrEqual(1);
        }
      }
    }
  });
});
