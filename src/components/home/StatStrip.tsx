'use client';

import { useRef } from 'react';
import { useCountUp } from '@/hooks/useCountUp';

interface Stat {
  number: number;
  suffix?: string;
  colorClass: string;
  headline: string;
  cite: string;
}

const stats: Stat[] = [
  {
    number: 40,
    suffix: '%',
    colorClass: 'text-brand-amber',
    headline: 'of children in PICU coma have seizures invisible to bedside exam.',
    cite: 'Abend NS et al., Neurology 2011,pooled critically ill pediatric cohorts.',
  },
  {
    number: 90,
    suffix: '%',
    colorClass: 'text-brand-tealLight',
    headline: 'reduction in first stroke with annual TCD screening in sickle cell anemia.',
    cite: 'Adams RJ et al., NEJM 1998,STOP randomized trial.',
  },
  {
    number: 24,
    suffix: '',
    colorClass: 'text-brand-purple',
    headline: 'modality pages, each paired with an interactive widget.',
    cite: 'Pressure · flow · oxygen · metabolism · electrical activity.',
  },
];

export function StatStrip() {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <section aria-labelledby="stat-strip-title">
      <h2 id="stat-strip-title" className="sr-only">
        Three facts that define the field
      </h2>
      <div ref={ref} className="border-y border-line py-10 md:py-14">
        <dl className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {stats.map((s, i) => (
            <StatCell key={i} stat={s} containerRef={ref} />
          ))}
        </dl>
      </div>
    </section>
  );
}

function StatCell({
  stat,
  containerRef,
}: {
  stat: Stat;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const value = useCountUp({ target: stat.number, ref: containerRef });
  return (
    <div className="text-left">
      <dt
        className={`m-0 text-[56px] md:text-[72px] font-bold leading-none tabular-nums ${stat.colorClass}`}
      >
        {value}
        {stat.suffix}
      </dt>
      <dd className="m-0 mt-3 text-[15px] text-ink leading-[1.55]">{stat.headline}</dd>
      <p className="m-0 mt-2 text-[11px] italic text-ink-dim">{stat.cite}</p>
    </div>
  );
}
