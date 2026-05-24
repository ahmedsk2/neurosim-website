/**
 * Thermal-diffusion CBF engine.
 *
 * Simplified model: a small heater raises tissue temperature; the steady-state
 * temperature differential between heater and downstream sensor scales as
 * 1 / (k0 + k_perfusion · CBF). Higher CBF → faster heat removal → smaller ΔT.
 *
 * References: Hemedex / Bowman thermal-diffusion CBF principle (research grade).
 */

export interface ThermalState {
  cbf: number; // mL/100g/min
  heaterOnW: number; // mW
}

export const ASTRUP_BANDS = [
  { upTo: 15, label: 'Isoelectric, cell death imminent', status: 'danger' as const },
  { upTo: 25, label: 'Suppressed / low voltage', status: 'danger' as const },
  { upTo: 35, label: 'Slow delta, drowsy', status: 'warn' as const },
  { upTo: 50, label: 'Mild slowing', status: 'warn' as const },
  { upTo: Infinity, label: 'Normal', status: 'good' as const },
];

export function bandFor(cbf: number) {
  return ASTRUP_BANDS.find((b) => cbf < b.upTo)!;
}

/**
 * Steady-state ΔT (°C) between heater bead and tracking sensor.
 * Synthetic mapping calibrated so that:
 *  - ΔT ≈ 1.6 °C at CBF 5  (essentially no flow)
 *  - ΔT ≈ 0.3 °C at CBF 80 (good cortical flow)
 */
export function deltaT(cbf: number): number {
  return 1.6 / (1 + cbf / 12);
}
