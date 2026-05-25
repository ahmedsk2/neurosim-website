'use client';

import { useEffect, useState } from 'react';
import { Readout, Button } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

interface Compartments {
  brain: number; // mL
  csf: number;
  blood: number;
  pathology: number; // hematoma / edema / tumor
}

const TOTAL_VAULT_ML = 1500;
const PVI_ML = 20;

export default function VolumeCompartmentAnimation() {
  const [pathology, setPathology] = useState(0); // mL added
  const [icp, setIcp] = useState(8);

  const baseline: Compartments = { brain: 1200, csf: 150, blood: 150, pathology: 0 };
  // Compensation: CSF translocates first (up to 80 mL), then blood (up to 60 mL).
  const csfLoss = Math.min(80, pathology);
  const bloodLoss = Math.max(0, Math.min(60, pathology - 80));
  const compensated = csfLoss + bloodLoss;
  const uncompensated = Math.max(0, pathology - compensated);
  const targetIcp = 8 * Math.exp(uncompensated / PVI_ML);

  // Smooth ICP toward target
  useEffect(() => {
    const id = setInterval(() => {
      setIcp((cur) => cur + (targetIcp - cur) * 0.15);
    }, 50);
    return () => clearInterval(id);
  }, [targetIcp]);

  return (
    <WidgetShell
      eyebrow="Foundation · Monro-Kellie"
      title="Volume compartments, CSF first, then blood, then ICP"
      controls={
        <>
          <Button variant="primary" onClick={() => setPathology((p) => Math.min(200, p + 5))}>+ 5 mL volume</Button>
          <Button variant="secondary" onClick={() => setPathology(0)}>Reset</Button>
        </>
      }
      status={icp < 15 ? { variant: 'good', label: 'Compensated' } : icp < 22 ? { variant: 'warn', label: 'Borderline' } : { variant: 'danger', label: 'Decompensated' }}
      footnote="Monro 1783, Kellie 1824, Marmarou 1975."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-4 mb-2.5">
        <Readout label="Added volume" value={pathology.toFixed(0)} unit="mL" />
        <Readout label="CSF lost" value={csfLoss.toFixed(0)} unit="mL" hint="80 mL max" />
        <Readout label="Venous blood lost" value={bloodLoss.toFixed(0)} unit="mL" hint="60 mL max" />
        <Readout label="ICP" value={icp.toFixed(0)} unit="mmHg" status={icp < 15 ? 'good' : icp < 22 ? 'warn' : 'danger'} hint={uncompensated > 0 ? `+${uncompensated.toFixed(0)} mL uncompensated` : 'fully compensated'} />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Cranial vault (1500 mL)">
          <CompartmentBar
            comps={{
              brain: baseline.brain,
              csf: Math.max(0, baseline.csf - csfLoss),
              blood: Math.max(0, baseline.blood - bloodLoss),
              pathology,
            }}
            total={TOTAL_VAULT_ML}
          />
        </WidgetPanel>
        <WidgetPanel title="What's happening">
          <ol className="text-[12.5px] text-ink/85 leading-[1.6] space-y-2 list-decimal list-inside">
            <li><strong>CSF translocates</strong> to the spinal subarachnoid space first, cheapest buffer.</li>
            <li><strong>Venous blood compresses</strong> next, accelerated cerebral venous outflow.</li>
            <li>Beyond ~140 mL added, both buffers exhausted,<strong>ICP rises exponentially</strong> per Marmarou.</li>
            <li>In children &lt; 18 months, an open fontanelle adds a slow third buffer (days–weeks).</li>
          </ol>
          <p className="mt-3 text-[11.5px] text-ink-muted">
            Reset the simulation, then add 5 mL at a time and watch the order of compensation.
          </p>
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}

function CompartmentBar({ comps, total }: { comps: Compartments; total: number }) {
  const used = comps.brain + comps.csf + comps.blood + comps.pathology;
  const empty = Math.max(0, total - used);
  const pct = (v: number) => (v / total) * 100;
  return (
    <div>
      <div className="flex h-12 rounded-md overflow-hidden border border-line">
        <div className="bg-brand-teal" style={{ width: `${pct(comps.brain)}%` }} title={`Brain ${comps.brain.toFixed(0)} mL`} />
        <div className="bg-brand-blue" style={{ width: `${pct(comps.csf)}%` }} title={`CSF ${comps.csf.toFixed(0)} mL`} />
        <div className="bg-status-danger" style={{ width: `${pct(comps.blood)}%` }} title={`Blood ${comps.blood.toFixed(0)} mL`} />
        <div className="bg-brand-amber" style={{ width: `${pct(comps.pathology)}%` }} title={`Pathology ${comps.pathology.toFixed(0)} mL`} />
        {empty > 0 && <div className="bg-surface-deeper" style={{ width: `${pct(empty)}%` }} />}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-[11px]">
        <Legend color="brand-teal" label="Brain" v={comps.brain} />
        <Legend color="brand-blue" label="CSF" v={comps.csf} />
        <Legend color="status-danger" label="Blood" v={comps.blood} />
        <Legend color="brand-amber" label="Pathology" v={comps.pathology} />
      </div>
    </div>
  );
}

function Legend({ color, label, v }: { color: string; label: string; v: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block h-3 w-3 rounded-xs bg-${color}`} aria-hidden />
      <span className="text-ink-muted">{label}</span>
      <span className="ml-auto font-mono text-ink">{v.toFixed(0)} mL</span>
    </div>
  );
}
