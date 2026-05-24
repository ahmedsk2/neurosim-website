'use client';

import { useState } from 'react';
import { WidgetShell, WidgetPanel } from '../shared/WidgetShell';
import { AGE_BANDS, NORMS, findBand, type AgeBand } from '@/data/pediatric-norms';
import { EvidenceLevel } from '@/components/ui';

export default function AgeBandNorms() {
  const [months, setMonths] = useState(36);
  const band = findBand(months);
  const meta = AGE_BANDS.find((b) => b.id === band)!;

  return (
    <WidgetShell
      eyebrow="Pediatrics · Norms reference"
      title="Age-banded normative values"
      controls={
        <div className="flex w-full flex-col gap-1.5 md:flex-row md:items-center md:gap-4">
          <label htmlFor="age-slider" className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
            Patient age
          </label>
          <input
            id="age-slider"
            type="range"
            min={0}
            max={216}
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value, 10))}
            className="flex-1 accent-brand-teal"
          />
          <div className="font-mono text-[14px] font-bold text-brand-tealLight whitespace-nowrap">
            {formatAge(months)}
          </div>
          <div className="text-[11px] text-ink-muted whitespace-nowrap">{meta.label}</div>
        </div>
      }
      footnote="PALS 2020, Kochanek 2019 (PBTF), Tasker 2023, O'Brien 2015 (TCD), Padayachy 2012 (ONSD)"
    >
      <WidgetPanel>
        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full text-[12.5px] border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left py-2 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-tealLight">
                  Parameter
                </th>
                <th className="text-left py-2 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-tealLight">
                  Normal
                </th>
                <th className="text-left py-2 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-tealLight">
                  Concern
                </th>
                <th className="text-left py-2 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-tealLight">
                  Evidence
                </th>
              </tr>
            </thead>
            <tbody>
              {NORMS.map((row) => {
                const cell = row.per[band];
                return (
                  <tr key={row.id} className="border-b border-line/60">
                    <td className="py-2 px-2 align-top">
                      <div className="font-bold text-ink">{row.label}</div>
                      <div className="text-[10px] text-ink-dim">{row.unit}</div>
                    </td>
                    <td className="py-2 px-2 font-mono text-ink">{cell.normal}</td>
                    <td className="py-2 px-2 font-mono text-status-dangerText">
                      {cell.concern ?? ''}
                    </td>
                    <td className="py-2 px-2 align-top">
                      <div className="flex items-center gap-1.5">
                        {cell.grade && <EvidenceLevel grade={cell.grade} />}
                        <span className="text-[10px] text-ink-dim">{cell.source}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </WidgetPanel>
    </WidgetShell>
  );
}

function formatAge(months: number): string {
  if (months < 1) return '< 1 month';
  if (months < 24) return `${months} mo`;
  return `${(months / 12).toFixed(1)} yr`;
}
