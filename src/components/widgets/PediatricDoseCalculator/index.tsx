'use client';

import { useState } from 'react';
import { WidgetShell, WidgetPanel } from '../shared/WidgetShell';
import { Readout } from '@/components/ui';

interface DoseRow {
  label: string;
  perKg: string;
  computed: string;
  hint: string;
  ceiling?: string;
}

export default function PediatricDoseCalculator() {
  const [weight, setWeight] = useState(20);
  const [age, setAge] = useState(72); // months

  const doses: DoseRow[] = [
    {
      label: '3% NaCl bolus',
      perKg: '5 mL/kg',
      computed: `${(5 * weight).toFixed(0)} mL over 20 min`,
      hint: 'May repeat per ICP and Na⁺ ceiling 160 mmol/L. Central line preferred for repeated boluses.',
    },
    {
      label: '23.4% NaCl emergency',
      perKg: '0.5 mL/kg',
      computed: `${(0.5 * weight).toFixed(1)} mL over 5–10 min`,
      hint: 'Reserve for impending herniation; central line ONLY. Higher-Na rebound risk than 3%.',
    },
    {
      label: 'Mannitol 20%',
      perKg: '0.5 g/kg = 2.5 mL/kg',
      computed: `${(2.5 * weight).toFixed(0)} mL = ${(0.5 * weight).toFixed(1)} g`,
      hint: 'Caution in hypovolaemia / renal failure. Serum osm ceiling 320 mOsm/kg.',
    },
    {
      label: 'Levetiracetam load (status)',
      perKg: '60 mg/kg',
      computed: `${Math.min(60 * weight, 4500).toFixed(0)} mg over 15 min`,
      ceiling: '4500 mg max',
      hint: 'First-line in pediatric SE per recent consensus. Renal-adjusted maintenance.',
    },
    {
      label: 'Fosphenytoin load',
      perKg: '20 mg PE/kg',
      computed: `${(20 * weight).toFixed(0)} mg PE over 10 min`,
      hint: 'Cardiac monitoring. Caution in cardiac conduction disease.',
    },
    {
      label: 'Midazolam bolus (status)',
      perKg: '0.1 mg/kg',
      computed: `${(0.1 * weight).toFixed(2)} mg`,
      hint: 'May repeat q5min × 2. Then infusion 0.05–0.4 mg/kg/h.',
    },
    {
      label: 'Pentobarbital coma load',
      perKg: '5–10 mg/kg',
      computed: `${(5 * weight).toFixed(0)}–${(10 * weight).toFixed(0)} mg over 30 min`,
      hint: 'Target burst-suppression on cEEG. Maintenance 1–5 mg/kg/h.',
    },
    {
      label: 'Propofol infusion',
      perKg: '50–200 mcg/kg/min',
      computed:
        age < 192
          ? `⚠ Give with caution · ${(50 * weight).toFixed(0)}–${(200 * weight).toFixed(0)} mcg/min (PRIS risk < 16 yr)`
          : `${(50 * weight).toFixed(0)}–${(200 * weight).toFixed(0)} mcg/min`,
      hint: 'Propofol Infusion Syndrome, limit dose ≤ 4 mg/kg/h and duration ≤ 48 h in children. Monitor lactate, CK, triglycerides.',
    },
    {
      label: 'Fentanyl bolus',
      perKg: '1–2 mcg/kg',
      computed: `${(1 * weight).toFixed(1)}–${(2 * weight).toFixed(1)} mcg`,
      hint: 'Reduce dose 50% in neonates. Watch for chest-wall rigidity at high boluses.',
    },
    {
      label: 'Vecuronium bolus (paralysis)',
      perKg: '0.1 mg/kg',
      computed: `${(0.1 * weight).toFixed(2)} mg`,
      hint: 'Confirm sedation depth FIRST. Only use to control ICP, not to mask consciousness.',
    },
  ];

  return (
    <WidgetShell
      eyebrow="Pediatric MNM · Bedside doses"
      title="Pediatric dose calculator, neuro-emergencies"
      controls={
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="weight" className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted whitespace-nowrap">
              Weight
            </label>
            <input
              id="weight"
              type="range"
              min={2}
              max={80}
              step={0.5}
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="flex-1 accent-brand-teal min-w-[140px]"
            />
            <div className="font-mono text-[14px] font-bold text-brand-tealLight whitespace-nowrap">
              {weight} kg
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="age" className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted whitespace-nowrap">
              Age
            </label>
            <input
              id="age"
              type="range"
              min={1}
              max={216}
              step={1}
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value, 10))}
              className="flex-1 accent-brand-teal min-w-[140px]"
            />
            <div className="font-mono text-[14px] font-bold text-brand-tealLight whitespace-nowrap">
              {age < 24 ? `${age} mo` : `${(age / 12).toFixed(1)} yr`}
            </div>
          </div>
        </div>
      }
      footnote="Starting points only, always cross-check against your unit's pediatric formulary. Doses derived from PBTF / Kochanek 2019, BMJ Best Practice, Lexicomp pediatric, and consensus PICU references."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-3">
        <Readout label="Weight" value={`${weight} kg`} hint="ideal body weight in older / obese" />
        <Readout
          label="Age"
          value={age < 24 ? `${age} mo` : `${(age / 12).toFixed(1)} yr`}
          hint={age < 192 ? 'PRIS-risk band (< 16 yr)' : 'Adolescent, adult-comparable'}
        />
        <Readout label="ETT size" value={`${(age / 48 + 4).toFixed(1)} mm`} hint="Cuffed: (age/4) + 3.5; uncuffed: (age/4) + 4" />
      </div>

      <WidgetPanel title="Dose table">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="border-b border-line">
              <th className="text-left py-2 pr-3 font-bold text-brand-tealLight">Drug / fluid</th>
              <th className="text-left py-2 pr-3 font-bold text-brand-tealLight">Per kg</th>
              <th className="text-left py-2 pr-3 font-bold text-brand-tealLight">For this patient</th>
              <th className="text-left py-2 font-bold text-brand-tealLight">Note</th>
            </tr>
          </thead>
          <tbody>
            {doses.map((d) => (
              <tr key={d.label} className="border-b border-line/40 align-top">
                <td className="py-1.5 pr-3 font-semibold text-ink whitespace-nowrap">{d.label}</td>
                <td className="py-1.5 pr-3 font-mono text-[11.5px] text-ink-muted whitespace-nowrap">{d.perKg}</td>
                <td className="py-1.5 pr-3 font-mono text-[11.5px] font-bold text-brand-tealLight">
                  {d.computed}
                  {d.ceiling && <span className="text-ink-dim text-[10px] ml-1">({d.ceiling})</span>}
                </td>
                <td className="py-1.5 text-[10.5px] text-ink-muted leading-normal">{d.hint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </WidgetPanel>

    </WidgetShell>
  );
}

export { PediatricDoseCalculator };
