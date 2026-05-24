import { describe, it, expect } from 'vitest';
import {
  couplingFor,
  pearson,
  quadFit,
  makeRng,
  step,
  recomputeCPPopt,
  reset,
} from '../engine';
import { DEFAULT_CONFIG, makeInitialState } from '../types';

describe('CPPopt engine', () => {
  it('Pearson is 1 for identical sequences', () => {
    expect(pearson([1, 2, 3, 4], [1, 2, 3, 4])).toBeCloseTo(1, 6);
  });
  it('Pearson is -1 for perfectly anti-correlated sequences', () => {
    expect(pearson([1, 2, 3, 4], [4, 3, 2, 1])).toBeCloseTo(-1, 6);
  });
  it('Pearson is 0 for orthogonal sequences', () => {
    expect(pearson([1, 0, -1, 0], [0, 1, 0, -1])).toBeCloseTo(0, 6);
  });
  it('couplingFor returns negative for intact', () => {
    expect(couplingFor(70, 'intact', DEFAULT_CONFIG)).toBeLessThan(0);
  });
  it('couplingFor returns positive for impaired', () => {
    expect(couplingFor(70, 'impaired', DEFAULT_CONFIG)).toBeGreaterThan(0);
  });
  it('realistic mode is most negative at the trueCPPopt', () => {
    const c0 = couplingFor(70, 'realistic', DEFAULT_CONFIG);
    const c1 = couplingFor(50, 'realistic', DEFAULT_CONFIG);
    const c2 = couplingFor(95, 'realistic', DEFAULT_CONFIG);
    expect(c0).toBeLessThan(c1);
    expect(c0).toBeLessThan(c2);
  });
  it('quadFit recovers (a, b, c) from a clean parabola', () => {
    // y = 2x^2 - 4x + 1
    const xs = [0, 1, 2, 3, 4];
    const ys = xs.map((x) => 2 * x * x - 4 * x + 1);
    const fit = quadFit(xs, ys);
    expect(fit).not.toBeNull();
    expect(fit!.a).toBeCloseTo(2, 5);
    expect(fit!.b).toBeCloseTo(-4, 5);
    expect(fit!.c).toBeCloseTo(1, 5);
  });
  it('quadFit returns null for fewer than 3 points', () => {
    expect(quadFit([1, 2], [1, 2])).toBeNull();
  });
  it('determinism: same seed produces identical state', () => {
    const s1 = makeInitialState();
    const s2 = makeInitialState();
    const r1 = makeRng(7);
    const r2 = makeRng(7);
    step(s1, 1, 10, DEFAULT_CONFIG, r1);
    step(s2, 1, 10, DEFAULT_CONFIG, r2);
    expect(s1.simT).toBe(s2.simT);
    expect(s1.rawAbp.length).toBe(s2.rawAbp.length);
    if (s1.rawAbp.length > 0) {
      expect(s1.rawAbp[0]!.v).toBeCloseTo(s2.rawAbp[0]!.v);
    }
  });
  it('reset clears state', () => {
    const s = makeInitialState();
    const r = makeRng(1);
    step(s, 5, 60, DEFAULT_CONFIG, r);
    expect(s.simT).toBeGreaterThan(0);
    reset(s);
    expect(s.simT).toBe(0);
    expect(s.rawAbp.length).toBe(0);
    expect(s.meanPairs.length).toBe(0);
  });
  it('recomputeCPPopt produces a value when bins span an interval', () => {
    const s = makeInitialState();
    // Synthesize bin data manually
    const bufferLen = 500;
    for (let i = 0; i < bufferLen; i++) {
      const cpp = 50 + (i % 10) * 6;
      const prx = (cpp - 70) ** 2 / 800 - 0.4 + (i % 5) * 0.02;
      s.cppoptBuffer.push({ t: i * 60, prx, cpp });
    }
    recomputeCPPopt(s, DEFAULT_CONFIG);
    expect(s.cppoptValue).not.toBeNull();
    expect(s.cppoptValue!).toBeGreaterThan(50);
    expect(s.cppoptValue!).toBeLessThan(110);
  });
});
