'use client';

import { useState } from 'react';
import { Readout } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';

// PI rises with ICP per Bellner: ICP_est = 10.93 × PI − 1.28
function piFromIcp(icp: number) {
  return Math.max(0.6, (icp + 1.28) / 10.93);
}
function bellner(pi: number) {
  return 10.93 * pi - 1.28;
}

export default function NonInvasiveICPDemo() {
  const [icpTrue, setIcpTrue] = useState(15);
  const pi = piFromIcp(icpTrue);
  const bellnerEst = bellner(pi);
  const tympanic = icpTrue + (Math.random() - 0.5) * 4 - 2; // noisy
  const b4c = icpTrue + (Math.random() - 0.5) * 6;

  return (
    <WidgetShell
      eyebrow="Non-invasive ICP"
      title="Estimating ICP without a bolt"
      footnote="Robba 2017 (review); Bellner 2004; Andrade 2021 (B4C); Brasil 2021."
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-4 mb-2.5">
        <Readout label="Invasive (truth)" value={icpTrue} unit="mmHg" />
        <Readout label="TCD PI (estimator)" value={pi.toFixed(2)} unit="" hint="Bellner 2004" />
        <Readout label="ICP from PI" value={bellnerEst.toFixed(0)} unit="mmHg" hint={`error ${(bellnerEst - icpTrue).toFixed(0)} mmHg`} />
        <Readout label="B4C extensometer" value={b4c.toFixed(0)} unit="mmHg" hint="trend, not absolute" />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Methods compared">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left py-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-tealLight">Method</th>
                <th className="text-left py-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-tealLight">Output</th>
                <th className="text-left py-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-tealLight">Best use</th>
                <th className="text-left py-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-tealLight">Limit</th>
              </tr>
            </thead>
            <tbody className="text-ink/85">
              <tr className="border-b border-line/60">
                <td className="py-1.5 px-2 font-bold">TCD PI (Bellner)</td>
                <td className="py-1.5 px-2">absolute, ±5–10 mmHg</td>
                <td className="py-1.5 px-2">Quick triage</td>
                <td className="py-1.5 px-2">Confounded by CO₂, distal resistance</td>
              </tr>
              <tr className="border-b border-line/60">
                <td className="py-1.5 px-2 font-bold">B4C extensometer</td>
                <td className="py-1.5 px-2">P2/P1 ratio + waveform</td>
                <td className="py-1.5 px-2">Trend, compliance</td>
                <td className="py-1.5 px-2">Not validated for absolute ICP</td>
              </tr>
              <tr className="border-b border-line/60">
                <td className="py-1.5 px-2 font-bold">Tympanic membrane displacement</td>
                <td className="py-1.5 px-2">Cochlear pressure</td>
                <td className="py-1.5 px-2">Research-grade</td>
                <td className="py-1.5 px-2">Patent cochlear aqueduct required</td>
              </tr>
              <tr className="border-b border-line/60">
                <td className="py-1.5 px-2 font-bold">2-depth TCD (Ragauskas)</td>
                <td className="py-1.5 px-2">Absolute, invasive-grade</td>
                <td className="py-1.5 px-2">Specialised centres</td>
                <td className="py-1.5 px-2">Operator + equipment</td>
              </tr>
              <tr>
                <td className="py-1.5 px-2 font-bold">ONSD ultrasound</td>
                <td className="py-1.5 px-2">Static</td>
                <td className="py-1.5 px-2">Triage in ED / NICU</td>
                <td className="py-1.5 px-2">Operator-dependent</td>
              </tr>
            </tbody>
          </table>
        </WidgetPanel>
        <WidgetPanel title="Move ICP, watch the estimators">
          <input
            type="range"
            min={5}
            max={50}
            value={icpTrue}
            onChange={(e) => setIcpTrue(parseInt(e.target.value, 10))}
            className="w-full accent-brand-teal"
            aria-label="True ICP"
          />
          <p className="mt-3 text-[12px] text-ink/85 leading-[1.55]">
            Bellner formula: <code className="font-mono text-brand-tealLight">ICP_est = 10.93·PI − 1.28</code>. Useful for trend; do not titrate therapy from a single number.
          </p>
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}
