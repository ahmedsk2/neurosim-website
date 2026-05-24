import { describe, it, expect } from 'vitest';
import { bandFor, deltaT, ASTRUP_BANDS } from '../engine';

describe('Thermal CBF engine', () => {
  it('low CBF → high ΔT', () => {
    expect(deltaT(5)).toBeGreaterThan(deltaT(80));
  });
  it('CBF 80 → ΔT < 0.5 °C', () => {
    expect(deltaT(80)).toBeLessThan(0.5);
  });
  it('bandFor monotonic with CBF', () => {
    const cbfs = [5, 20, 30, 40, 60];
    const labels = cbfs.map((c) => bandFor(c).label);
    expect(labels).toEqual([
      'Isoelectric, cell death imminent',
      'Suppressed / low voltage',
      'Slow delta, drowsy',
      'Mild slowing',
      'Normal',
    ]);
  });
  it('ASTRUP_BANDS sorted ascending', () => {
    for (let i = 1; i < ASTRUP_BANDS.length; i++) {
      expect(ASTRUP_BANDS[i]!.upTo).toBeGreaterThan(ASTRUP_BANDS[i - 1]!.upTo);
    }
  });
});
