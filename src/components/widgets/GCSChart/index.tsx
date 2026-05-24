'use client';

import { useState } from 'react';
import { Readout, ToggleRow } from '@/components/ui';
import { WidgetShell, WidgetGrid, WidgetPanel } from '../shared/WidgetShell';
import {
  EYE_OPTIONS,
  VERBAL_OPTIONS_ADULT,
  VERBAL_OPTIONS_CHILD,
  VERBAL_OPTIONS_PREVERBAL,
  MOTOR_OPTIONS,
  FOUR_EYE,
  FOUR_MOTOR,
  FOUR_BRAINSTEM,
  FOUR_RESP,
  totalGCS,
  totalFOUR,
  gcsSeverity,
  type AgeBracket,
} from './engine';

export default function GCSChart() {
  const [age, setAge] = useState<AgeBracket>('child');
  const [eye, setEye] = useState(4);
  const [verbal, setVerbal] = useState(5);
  const [motor, setMotor] = useState(6);
  const [fourEye, setFourEye] = useState(4);
  const [fourMotor, setFourMotor] = useState(4);
  const [fourBrainstem, setFourBrainstem] = useState(4);
  const [fourResp, setFourResp] = useState(4);

  const total = totalGCS({ eye, verbal, motor });
  const sev = gcsSeverity(total);
  const fourTotal = totalFOUR({
    eye: fourEye,
    motor: fourMotor,
    brainstem: fourBrainstem,
    respiration: fourResp,
  });
  const verbalOptions =
    age === 'preverbal'
      ? VERBAL_OPTIONS_PREVERBAL
      : age === 'child'
        ? VERBAL_OPTIONS_CHILD
        : VERBAL_OPTIONS_ADULT;

  return (
    <WidgetShell
      eyebrow="Pediatric MNM · Interactive"
      title="GCS · Pediatric GCS · FOUR score"
      controls={
        <>
          <ToggleRow<AgeBracket>
            label="Age bracket"
            value={age}
            onChange={setAge}
            options={[
              { value: 'preverbal', label: 'Pre-verbal (< 2y)' },
              { value: 'child', label: 'Child (2–14y)' },
              { value: 'adult', label: 'Adult / adolescent' },
            ]}
          />
        </>
      }
      footnote="Teasdale 1974, Wijdicks 2005, Tatman 1997"
    >
      <div className="grid gap-2.5 grid-cols-1 md:grid-cols-3 mb-2.5">
        <Readout
          label="GCS total"
          value={`${total}/15`}
          status={sev.status}
          hint={`E${eye} V${verbal} M${motor},${sev.label}`}
        />
        <Readout label="FOUR total" value={`${fourTotal}/16`} hint="Better in intubated patients" />
        <Readout
          label="Pediatric verbal scale"
          value={age === 'preverbal' ? 'pre-verbal' : age === 'child' ? 'child' : 'adult'}
          hint={age === 'preverbal' ? 'Tatman 1997' : 'standard'}
        />
      </div>
      <WidgetGrid>
        <WidgetPanel title="Glasgow Coma Scale">
          <ScoreRow label="Eye opening" options={EYE_OPTIONS} value={eye} onChange={setEye} />
          <ScoreRow label="Verbal" options={verbalOptions} value={verbal} onChange={setVerbal} />
          <ScoreRow label="Motor" options={MOTOR_OPTIONS} value={motor} onChange={setMotor} />
        </WidgetPanel>
        <WidgetPanel title="FOUR score">
          <ScoreRow label="Eye" options={FOUR_EYE} value={fourEye} onChange={setFourEye} />
          <ScoreRow label="Motor" options={FOUR_MOTOR} value={fourMotor} onChange={setFourMotor} />
          <ScoreRow
            label="Brainstem"
            options={FOUR_BRAINSTEM}
            value={fourBrainstem}
            onChange={setFourBrainstem}
          />
          <ScoreRow
            label="Respiration"
            options={FOUR_RESP}
            value={fourResp}
            onChange={setFourResp}
          />
        </WidgetPanel>
      </WidgetGrid>
    </WidgetShell>
  );
}

function ScoreRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { score: number; label: string }[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-1.5">
        {label}
      </div>
      <div className="space-y-1">
        {options.map((o) => (
          <button
            key={o.score}
            type="button"
            onClick={() => onChange(o.score)}
            className={
              'flex w-full items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-left text-[12.5px] transition-colors ' +
              (value === o.score
                ? 'border-brand-teal bg-brand-teal/15 text-ink'
                : 'border-line bg-surface-deeper text-ink-muted hover:border-brand-teal hover:text-ink')
            }
          >
            <span>{o.label}</span>
            <span className="font-mono font-bold text-brand-tealLight">{o.score}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
