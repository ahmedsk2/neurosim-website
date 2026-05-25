import Link from 'next/link';
import { listContent } from '@/lib/content';
import { PageHeader } from '@/components/layout/PageScaffold';
import { Card, Thumbnail } from '@/components/ui';
import { thumbForFoundation } from '@/lib/thumbnails';

export const metadata = { title: 'Foundations' };

export default function FoundationsIndex() {
  const docs = listContent('foundations');
  const order = [
    'autoregulation',
    'co2-o2-reactivity',
    'cerebral-metabolism',
    'monro-kellie',
    'marmarou-pv-curve',
    'astrup-cascade',
    'spreading-depolarizations',
    'blood-brain-barrier',
    'pediatric-physiology',
  ];
  const sorted = [...docs].sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));

  return (
    <div>
      <PageHeader
        eyebrow="Foundations"
        title="Cerebral physiology, primer"
        description="Nine compact chapters covering the physiology you need to make sense of every monitor on this site. Each chapter ends with a 3-question retrieval check."
      />
      <ol className="grid gap-3 list-none p-0 grid-cols-[repeat(auto-fit,minmax(min(360px,100%),1fr))]">
        {sorted.map((d, i) => {
          const thumb = thumbForFoundation(d.slug);
          return (
            <li key={d.slug}>
              <Link href={`/foundations/${d.slug}/`} className="block group">
                <Card className="h-full transition-colors group-hover:border-brand-teal">
                  <div className="flex items-start gap-3">
                    <Thumbnail
                      kind={thumb.kind}
                      tone={thumb.tone}
                      aspect="1/1"
                      className="h-14 w-14 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-teal text-surface-darker text-[11px] font-bold">
                          {i + 1}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-tealLight">
                          {d.frontmatter.eyebrow ?? 'Foundation'}
                        </span>
                      </div>
                      <h2 className="m-0 mt-1 text-[16px] font-bold text-ink group-hover:text-brand-tealLight">
                        {d.frontmatter.title}
                      </h2>
                    </div>
                  </div>
                  <p className="m-0 mt-2 text-[12.5px] text-ink/80 leading-[1.55]">
                    {d.frontmatter.description}
                  </p>
                </Card>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
