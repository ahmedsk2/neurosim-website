'use client';

import { useEffect, useRef, useState } from 'react';
import { Readout, Button } from '@/components/ui';
import { WidgetShell, WidgetPanel } from '../shared/WidgetShell';

type CaseId = 'prx-orx' | 'tcd-icp' | 'pbto2-cpp';

interface Snapshot {
  t: number;
  icp: number;
  cpp: number;
  prx: number;
  orx: number;
  rso2: number;
  tcdMfv: number;
  pbto2: number;
  note?: string;
}

const CASES: Record<CaseId, { label: string; subtitle: string; frames: Snapshot[] }> = {
  'prx-orx': {
    label: 'PRx says intact, ORx says impaired',
    subtitle: 'Frontal contusion under the NIRS optode. Global PRx normal; regional ORx pressure-passive.',
    frames: build({ length: 60 }, (i) => ({
      t: i,
      icp: 18,
      cpp: 65,
      prx: -0.05 + 0.02 * Math.sin(i / 5),
      orx: 0.34 + 0.05 * Math.sin(i / 4),
      rso2: 60 - i * 0.05,
      tcdMfv: 90,
      pbto2: 22,
      note: i === 30 ? 'Frontal contusion expanding under right optode' : undefined,
    })),
  },
  'tcd-icp': {
    label: 'TCD climbing, ICP normal, vasospasm',
    subtitle: 'SAH day 6. MFV doubles over an hour while ICP is unchanged.',
    frames: build({ length: 60 }, (i) => ({
      t: i,
      icp: 12,
      cpp: 70,
      prx: 0,
      orx: 0,
      rso2: 65,
      tcdMfv: 90 + i * 1.5,
      pbto2: 22 - i * 0.1,
      note: i === 35 ? 'Lindegaard ratio crosses 5, symptomatic vasospasm' : undefined,
    })),
  },
  'pbto2-cpp': {
    label: 'PbtO₂ low despite normal CPP',
    subtitle: 'Microvascular failure. CPP comfortable, PbtO₂ falls, a different lever needed.',
    frames: build({ length: 60 }, (i) => ({
      t: i,
      icp: 14,
      cpp: 75,
      prx: -0.08,
      orx: -0.05,
      rso2: 64,
      tcdMfv: 95,
      pbto2: 22 - i * 0.15,
      note: i === 35 ? 'PbtO₂ < 18 sustained, escalate FiO₂, transfuse' : undefined,
    })),
  },
};

function build<T>(opts: { length: number }, fn: (i: number) => T): T[] {
  return Array.from({ length: opts.length }, (_, i) => fn(i));
}

export default function MultimodalDiscordance() {
  const [caseId, setCaseId] = useState<CaseId>('prx-orx');
  const [frame, setFrame] = useState(0);
  const [running, setRunning] = useState(true);
  const rafRef = useRef<number | null>(null);
  // performance.now() seeds the delta-time baseline for the rAF loop. It is read in
  // render only to initialize the ref (used once); moving it into the effect would
  // shift the first-frame/resume dt, so the in-render read is kept intentionally.
  // eslint-disable-next-line react-hooks/purity
  const lastRef = useRef(performance.now());

  useEffect(() => {
    const tick = (now: number) => {
      const dt = now - lastRef.current;
      lastRef.current = now;
      if (running) {
        setFrame((f) => {
          const next = f + dt / 1000;
          return next >= 60 ? 0 : next;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const data = CASES[caseId];
  const idx = Math.floor(frame);
  const cur = data.frames[Math.min(idx, data.frames.length - 1)]!;

  return (
    <WidgetShell
      eyebrow="Multimodal · discordance"
      title="Three canned discordance scenarios"
      controls={
        <>
          {(Object.keys(CASES) as CaseId[]).map((id) => (
            <Button key={id} variant={id === caseId ? 'primary' : 'secondary'} onClick={() => { setCaseId(id); setFrame(0); }}>
              {CASES[id].label}
            </Button>
          ))}
          <Button variant="secondary" onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Play'}</Button>
        </>
      }
      status={{ variant: 'demo', label: data.label }}
      footnote="Pedagogical scenarios, not real-patient data."
    >
      <p className="text-[12.5px] text-ink/85 leading-[1.55] mb-3 max-w-[70ch]">{data.subtitle}</p>
      <div className="grid gap-2.5 grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-2.5">
        <Readout label="ICP" value={cur.icp.toFixed(0)} unit="mmHg" status={cur.icp <= 20 ? 'good' : 'warn'} />
        <Readout label="CPP" value={cur.cpp.toFixed(0)} unit="mmHg" status={cur.cpp >= 60 ? 'good' : 'danger'} />
        <Readout label="PRx" value={cur.prx.toFixed(2)} status={cur.prx < 0.05 ? 'good' : cur.prx < 0.25 ? 'warn' : 'danger'} />
        <Readout label="ORx" value={cur.orx.toFixed(2)} status={cur.orx < 0.05 ? 'good' : cur.orx < 0.25 ? 'warn' : 'danger'} />
        <Readout label="rSO₂" value={cur.rso2.toFixed(0)} unit="%" status={cur.rso2 >= 60 ? 'good' : 'warn'} />
        <Readout label="TCD MFV" value={cur.tcdMfv.toFixed(0)} unit="cm/s" status={cur.tcdMfv > 130 ? 'warn' : 'good'} />
        <Readout label="PbtO₂" value={cur.pbto2.toFixed(0)} unit="mmHg" status={cur.pbto2 >= 20 ? 'good' : cur.pbto2 >= 15 ? 'warn' : 'danger'} />
      </div>
      <WidgetPanel title={`Sim-time ${idx} of ${data.frames.length} s`}>
        <div className="h-2 rounded-full bg-surface-deeper overflow-hidden">
          <div className="h-full bg-brand-teal" style={{ width: `${(idx / data.frames.length) * 100}%` }} />
        </div>
        {cur.note && (
          <div className="mt-3 rounded-md border-l-[3px] border-l-brand-amber bg-surface-deeper px-3 py-2 text-[12.5px] text-ink/90 leading-[1.55]">
            <strong className="text-brand-amber">Annotation:</strong> {cur.note}
          </div>
        )}
        <p className="mt-3 text-[11.5px] text-ink-muted leading-[1.55]">
          Each scenario plays a 60-second deterministic loop. Numbers reach a clinically meaningful state at ~30 s. The teaching is in the moment two monitors disagree about whether to act.
        </p>
      </WidgetPanel>
    </WidgetShell>
  );
}
