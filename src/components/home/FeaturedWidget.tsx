import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EvidenceLevel } from '@/components/ui';
import { WidgetEmbed } from '@/components/content';

export function FeaturedWidget() {
  return (
    <section
      aria-labelledby="featured-widget-title"
      className="rounded-lg border border-line bg-surface-card p-5 md:p-7"
    >
      <div className="mb-5">
        <p className="eyebrow mb-2 text-brand-amber">Featured widget</p>
        <h2
          id="featured-widget-title"
          className="m-0 mb-3 text-[22px] md:text-[26px] font-bold leading-tight"
        >
          CPPopt, find the bottom of the U.
        </h2>
        <p className="m-0 mb-3 max-w-[70ch] text-[13.5px] leading-[1.6] text-ink/85">
          Watch four hours of synthetic ABP and ICP fold themselves into 5-minute PRx values, into
          5-mmHg bins, into a parabolic fit. The vertex is the patient&apos;s individualised CPP
          target. Toggle autoregulation status mid-run and see the curve flatten.
        </p>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <EvidenceLevel grade="B" />
          <span className="text-[11px] text-ink-dim">Steiner 2002 · Aries 2012 · COGiTATE 2024</span>
          <Link
            href="/modalities/cppopt/"
            className="ml-auto inline-flex items-center gap-2 rounded-md bg-brand-amber px-4 py-2 text-[12px] font-bold uppercase tracking-[0.06em] text-surface-darker hover:bg-brand-amberLight"
          >
            Open CPPopt page <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
      <WidgetEmbed name="CPPoptUCurve" />
    </section>
  );
}
