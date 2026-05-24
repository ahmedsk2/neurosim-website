'use client';

import { useState } from 'react';
import { Readout, ToggleRow } from '@/components/ui';
import { gcsSeverity, totalGCS } from '../GCSChart/engine';

export default function GCSChartQuick() {
  const [eye, setEye] = useState(4);
  const [verbal, setVerbal] = useState(5);
  const [motor, setMotor] = useState(6);
  const total = totalGCS({ eye, verbal, motor });
  const sev = gcsSeverity(total);
  return (
    <div
      data-no-print
      className="my-3 rounded-lg border border-line bg-surface-card p-3 md:p-4"
      role="form"
      aria-label="Quick GCS calculator"
    >
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-tealLight mb-2">
        GCS quick · embeddable
      </div>
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-2 mb-2.5">
        <Readout label="GCS total" value={`${total}/15`} status={sev.status} hint={`E${eye} V${verbal} M${motor}`} />
        <Readout label="Severity" value={sev.label} status={sev.status} />
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <ToggleRow<string>
          label="Eye"
          value={String(eye)}
          onChange={(v) => setEye(parseInt(v, 10))}
          options={[
            { value: '4', label: '4 spont' },
            { value: '3', label: '3 voice' },
            { value: '2', label: '2 pain' },
            { value: '1', label: '1 none' },
          ]}
        />
        <ToggleRow<string>
          label="Verbal"
          value={String(verbal)}
          onChange={(v) => setVerbal(parseInt(v, 10))}
          options={[
            { value: '5', label: '5' },
            { value: '4', label: '4' },
            { value: '3', label: '3' },
            { value: '2', label: '2' },
            { value: '1', label: '1' },
          ]}
        />
        <ToggleRow<string>
          label="Motor"
          value={String(motor)}
          onChange={(v) => setMotor(parseInt(v, 10))}
          options={[
            { value: '6', label: '6' },
            { value: '5', label: '5' },
            { value: '4', label: '4' },
            { value: '3', label: '3' },
            { value: '2', label: '2' },
            { value: '1', label: '1' },
          ]}
        />
      </div>
    </div>
  );
}
