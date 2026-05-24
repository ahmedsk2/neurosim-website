import { describe, it, expect } from 'vitest';
import { totalGCS, gcsSeverity, totalFOUR } from '../engine';

describe('GCS engine', () => {
  it('totals correctly', () => {
    expect(totalGCS({ eye: 4, verbal: 5, motor: 6 })).toBe(15);
    expect(totalGCS({ eye: 1, verbal: 1, motor: 1 })).toBe(3);
  });
  it('classifies severity by Teasdale boundaries', () => {
    expect(gcsSeverity(15).status).toBe('good');
    expect(gcsSeverity(13).status).toBe('good');
    expect(gcsSeverity(12).status).toBe('warn');
    expect(gcsSeverity(9).status).toBe('warn');
    expect(gcsSeverity(8).status).toBe('danger');
    expect(gcsSeverity(3).status).toBe('danger');
  });
  it('FOUR total is 16 max, 0 min', () => {
    expect(totalFOUR({ eye: 4, motor: 4, brainstem: 4, respiration: 4 })).toBe(16);
    expect(totalFOUR({ eye: 0, motor: 0, brainstem: 0, respiration: 0 })).toBe(0);
  });
});
