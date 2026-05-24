import { describe, it, expect } from 'vitest';
import { hrFor, sbpFor, respPattern } from '../index';

describe('Cushing reflex engine', () => {
  it('below threshold → baseline HR/BP/normal resp', () => {
    expect(hrFor(20)).toBe(100);
    expect(sbpFor(20)).toBe(110);
    expect(respPattern(20)).toBe('normal');
  });
  it('ICP 35 → bradycardia + hypertension', () => {
    expect(hrFor(35)).toBeLessThan(100);
    expect(sbpFor(35)).toBeGreaterThan(110);
    expect(respPattern(35)).toBe('cheyne_stokes');
  });
  it('ICP 50 → near-apnea pattern', () => {
    expect(respPattern(55)).toBe('apnoea');
  });
  it('HR floor 38', () => {
    expect(hrFor(60)).toBeGreaterThanOrEqual(38);
  });
  it('SBP ceiling 220', () => {
    expect(sbpFor(120)).toBeLessThanOrEqual(220);
  });
});
