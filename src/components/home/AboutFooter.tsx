import Link from 'next/link';

const exploreLinks = [
  { href: '/foundations/', label: 'Foundations' },
  { href: '/modalities/', label: 'All 24 modalities' },
  { href: '/integration/', label: 'Integration scenarios' },
  { href: '/pediatrics/', label: 'Pediatric norms' },
  { href: '/glossary/', label: 'Glossary' },
  { href: '/evidence/', label: 'References & evidence' },
  { href: '/teach/fellow-lecture/', label: 'Fellow lecture deck' },
];

export function AboutFooter() {
  return (
    <section
      aria-labelledby="about-title"
      className="rounded-lg border-t border-line bg-surface-card px-6 py-10 md:px-10 md:py-14"
    >
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div className="md:col-span-2">
          <p className="eyebrow mb-2 text-ink-dim">About this resource</p>
          <h2
            id="about-title"
            className="m-0 mb-4 text-[22px] md:text-[28px] font-bold leading-tight"
          >
            Built by a pediatric intensivist, for the team.
          </h2>
          <p className="m-0 max-w-[70ch] text-[14px] leading-[1.65] text-ink/85">
            MNM-Edu is an open educational resource focused on pediatric multimodal neuromonitoring.
            Every modality page is grounded in current peer-reviewed literature; evidence levels are
            stated honestly; widgets demonstrate the physiology you can&apos;t see at the bedside.
            The companion simulation platform, NeuroSim ICU, drives bedside-realistic cases for
            fellow training.
          </p>
          <p className="m-0 mt-3 max-w-[70ch] text-[12.5px] text-ink-dim">
            Pull requests, corrections, and case contributions welcome.
          </p>
        </div>
        <nav aria-label="Explore the site" className="space-y-2 text-[14px]">
          <h3 className="m-0 mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-dim">
            Explore
          </h3>
          {exploreLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-ink/85 transition-colors hover:text-brand-tealLight"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
