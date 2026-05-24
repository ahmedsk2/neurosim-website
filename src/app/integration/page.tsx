import Link from 'next/link';
import { INTEGRATION_CASES } from '@/data/integration-cases';
import { PageHeader } from '@/components/layout/PageScaffold';
import { Card, Thumbnail } from '@/components/ui';
import { thumbForIntegration } from '@/lib/thumbnails';

export const metadata = { title: 'Integration scenarios' };

export default function IntegrationIndex() {
  return (
    <div>
      <PageHeader
        eyebrow="Integration"
        title="When monitors agree, and when they disagree"
        description="Ten clinical scenarios where two or three modalities tell different stories. Walk through the discordance, learn the heuristics, then try the decision points."
      />
      <ol className="grid gap-3 list-none p-0 grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))]">
        {INTEGRATION_CASES.map((c, i) => {
          const thumb = thumbForIntegration(c.slug);
          return (
            <li key={c.slug}>
              <Link href={`/integration/${c.slug}/`} className="block group">
                <Card className="h-full transition-colors group-hover:border-brand-teal">
                  <div className="flex items-start gap-3">
                    <Thumbnail
                      kind={thumb.kind}
                      tone={thumb.tone}
                      aspect="1/1"
                      className="h-14 w-14 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-amber text-surface-darker text-[11px] font-bold">
                          {i + 1}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-amber">
                          Scenario
                        </span>
                      </div>
                      <h2 className="m-0 mt-1 text-[15.5px] font-bold text-ink group-hover:text-brand-tealLight">
                        {c.title}
                      </h2>
                    </div>
                  </div>
                  <p className="m-0 mt-2 text-[12.5px] text-ink/85 leading-[1.55]">{c.premise}</p>
                  <div className="mt-2 text-[10px] font-mono text-ink-dim">{c.modalities.join(' · ')}</div>
                </Card>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
