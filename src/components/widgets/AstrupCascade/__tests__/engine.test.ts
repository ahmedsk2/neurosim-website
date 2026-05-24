import { describe, it, expect } from 'vitest';
import { THRESHOLDS, bandFor } from '../engine';

describe('Astrup cascade engine', () => {
  it('CBF 60 → normal band', () => {
    expect(bandFor(60).band).toBe('normal');
  });
  it('CBF 30 → slow_delta band', () => {
    expect(bandFor(30).band).toBe('slow_delta');
  });
  it('CBF 20 → suppressed', () => {
    expect(bandFor(20).band).toBe('suppressed_low_voltage');
  });
  it('CBF 10 → isoelectric', () => {
    expect(bandFor(10).band).toBe('isoelectric');
  });
  it('THRESHOLDS sorted from high to low CBF', () => {
    for (let i = 1; i < THRESHOLDS.length; i++) {
      expect(THRESHOLDS[i]!.cbf).toBeLessThan(THRESHOLDS[i - 1]!.cbf);
    }
  });
});
