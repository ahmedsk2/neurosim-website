import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageScaffold';
import { AGE_BANDS, NORMS } from '@/data/pediatric-norms';
import { Card, EvidenceLevel } from '@/components/ui';
import { Pediatric } from '@/components/content/Pearl';

export const metadata = { title: 'Pediatrics' };

export default function PediatricsHub() {
  return (
    <div>
      <PageHeader
        eyebrow="Pediatrics"
        title="From newborn to adolescent"
        description="Age-banded normative values for hemodynamics, ICP, CPP, TCD, NIRS, NPi, and ONSD. Every cell carries a citation and an evidence chip, most pediatric MNM data are grade C or sparse, and we say so."
      />

      <Pediatric>
        <strong>Sparseness disclaimer.</strong> Pediatric MNM normative values are derived from
        heterogeneous populations and small studies. The figures below are working clinical defaults
       , individualize with autoregulation indices when you can.
      </Pediatric>

      <div className="my-6 overflow-x-auto">
        <table className="min-w-[900px] text-[12.5px] border-collapse">
          <thead>
            <tr className="border-b border-line">
              <th className="py-2 px-2 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-brand-tealLight">
                Parameter
              </th>
              {AGE_BANDS.map((b) => (
                <th
                  key={b.id}
                  className="py-2 px-2 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-brand-tealLight"
                >
                  {b.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NORMS.map((row) => (
              <tr key={row.id} className="border-b border-line/60">
                <td className="py-2 px-2 align-top">
                  <div className="font-bold text-ink">{row.label}</div>
                  <div className="text-[11px] text-ink-dim">{row.unit}</div>
                  {row.notes && <div className="text-[11px] text-ink-muted mt-1 max-w-[28ch]">{row.notes}</div>}
                </td>
                {AGE_BANDS.map((b) => {
                  const cell = row.per[b.id];
                  return (
                    <td key={b.id} className="py-2 px-2 align-top">
                      <div className="font-mono text-ink">{cell.normal}</div>
                      {cell.concern && (
                        <div className="font-mono text-status-dangerText text-[11px] mt-0.5">
                          ⚠ {cell.concern}
                        </div>
                      )}
                      <div className="mt-1 flex items-center gap-1">
                        {cell.grade && <EvidenceLevel grade={cell.grade} />}
                        <span className="text-[10px] text-ink-dim">{cell.source}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:grid-cols-3 mt-8">
        <Card>
          <div className="eyebrow mb-1">Age-specific physiology</div>
          <h3 className="m-0 mb-1 text-[15px] font-bold">Read the chapter</h3>
          <p className="m-0 text-[12.5px] text-ink/85 leading-[1.55]">
            See <Link href="/foundations/pediatric-physiology/" className="text-brand-tealLight underline">pediatric cerebral physiology</Link> for an in-depth tour of how the brain changes from term newborn to adolescent.
          </p>
        </Card>
        <Card>
          <div className="eyebrow mb-1">When to escalate</div>
          <h3 className="m-0 mb-1 text-[15px] font-bold">Pediatric TBI guidelines</h3>
          <p className="m-0 text-[12.5px] text-ink/85 leading-[1.55]">
            The <Link href="/evidence/" className="text-brand-tealLight underline">Kochanek 2019 guidelines</Link> set the canonical thresholds for pediatric severe TBI.
          </p>
        </Card>
        <Card>
          <div className="eyebrow mb-1">In the newborn</div>
          <h3 className="m-0 mb-1 text-[15px] font-bold">aEEG, NIRS, pupillometry</h3>
          <p className="m-0 text-[12.5px] text-ink/85 leading-[1.55]">
            See the <Link href="/integration/mnm-in-the-newborn/" className="text-brand-tealLight underline">HIE day-2 scenario</Link> for a worked NICU case.
          </p>
        </Card>
      </div>
    </div>
  );
}
