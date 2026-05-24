import Link from 'next/link';
import { Thumbnail } from '@/components/ui';
import { thumbForFoundation } from '@/lib/thumbnails';

const chapters = [
  {
    n: 1,
    slug: 'monro-kellie',
    title: 'The Monro-Kellie doctrine',
    summary: 'Why the rigid skull turns swelling into a pressure problem.',
  },
  {
    n: 2,
    slug: 'autoregulation',
    title: 'Cerebral autoregulation',
    summary: 'The Lassen curve, its limits, and why the curve moves.',
  },
  {
    n: 3,
    slug: 'pediatric-physiology',
    title: 'The pediatric brain is different',
    summary: 'Open fontanelles, age-banded targets, maturational EEG patterns.',
  },
  {
    n: 4,
    slug: 'marmarou-pv-curve',
    title: 'The pressure-volume curve',
    summary: 'Compliance, RAP, and the steep segment where small volumes hurt.',
  },
  {
    n: 5,
    slug: 'astrup-cascade',
    title: 'The Astrup ischemic cascade',
    summary: 'CBF, oxygen, ion pumps, the staged collapse to infarction.',
  },
  {
    n: 6,
    slug: 'spreading-depolarizations',
    title: 'Spreading depolarizations',
    summary: 'The slow secondary-injury wave that DC-coupled ECoG can catch.',
  },
];

export function FoundationsEntry() {
  return (
    <section aria-labelledby="foundations-title" className="py-12 md:py-16">
      <div className="mb-8 max-w-2xl">
        <p className="eyebrow mb-2 text-brand-purple">How to start</p>
        <h2
          id="foundations-title"
          className="m-0 mb-4 text-[26px] md:text-[34px] font-bold leading-tight"
        >
          Six chapters to walk in with.
        </h2>
        <p className="m-0 text-[15px] md:text-[16px] text-ink/85 leading-[1.6]">
          The foundations curriculum builds the intuition for everything downstream, Monro-Kellie,
          autoregulation, the pediatric brain&apos;s age-specific physiology. New trainees start
          here; experienced intensivists return for the controversies and references.
        </p>
      </div>

      <ul className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 lg:grid-cols-3">
        {chapters.map((c) => {
          const thumb = thumbForFoundation(c.slug);
          return (
            <li key={c.slug}>
              <Link
                href={`/foundations/${c.slug}/`}
                className="group block h-full rounded-md border border-line border-l-2 border-l-brand-teal bg-surface-card p-4 transition-colors hover:border-brand-teal hover:bg-surface-deeper focus:outline-none focus:ring-2 focus:ring-brand-teal"
              >
                <div className="flex items-start gap-3">
                  <Thumbnail
                    kind={thumb.kind}
                    tone={thumb.tone}
                    aspect="1/1"
                    className="h-14 w-14 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="m-0 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-dim">
                      Chapter {c.n}
                    </p>
                    <h3 className="m-0 mt-1 text-[16px] font-bold text-ink group-hover:text-brand-tealLight">
                      {c.title}
                    </h3>
                  </div>
                </div>
                <p className="m-0 mt-2 text-[13px] leading-[1.55] text-ink/80">{c.summary}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-brand-tealLight">
                  Read <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
