import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { headingAutolinkOptions } from '@/lib/mdxRehype';
import { listContent, listSlugs, loadContent } from '@/lib/content';
import { mdxComponents } from '@/components/mdx/components';
import { PageHeader } from '@/components/layout/PageScaffold';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PageSidebar } from '@/components/layout/PageSidebar';
import { PrevNextNav } from '@/components/layout/PrevNextNav';
import { readingTimeMinutes, formatReadingTime } from '@/lib/readingTime';
import { CitationProvider } from '@/components/content/CitationContext';
import { ReferencesList } from '@/components/content/Reference';
import { MODALITIES } from '@/data/modalities';
import type { EvidenceGrade } from '@/data/references';

const FOUNDATION_ORDER = [
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

export async function generateStaticParams() {
  return listSlugs('foundations').map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = loadContent('foundations', slug);
  if (!doc) return {};
  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    openGraph: {
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
      images: [`/og/foundations/${slug}.svg`],
    },
    twitter: {
      card: 'summary_large_image',
      title: doc.frontmatter.title,
      description: doc.frontmatter.description,
      images: [`/og/foundations/${slug}.svg`],
    },
  };
}

export default async function FoundationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = loadContent('foundations', slug);
  if (!doc) notFound();

  const allFoundations = listContent('foundations').sort(
    (a, b) => FOUNDATION_ORDER.indexOf(a.slug) - FOUNDATION_ORDER.indexOf(b.slug),
  );
  const relatedModalitySlugs = (doc.frontmatter.relatedModalities as string[] | undefined) ?? [];
  const relatedModalities = MODALITIES.filter((m) => relatedModalitySlugs.includes(m.slug));

  const myIdx = allFoundations.findIndex((f) => f.slug === slug);
  const prevFoundation = myIdx > 0 ? allFoundations[myIdx - 1] : null;
  const nextFoundation =
    myIdx >= 0 && myIdx < allFoundations.length - 1 ? allFoundations[myIdx + 1] : null;

  return (
    <div className="flex gap-8">
      <article className="prose-mnm flex-1 min-w-0">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Foundations', href: '/foundations/' },
            { label: doc.frontmatter.title },
          ]}
        />
        <PageHeader
          eyebrow={doc.frontmatter.eyebrow ?? 'Foundation'}
          title={doc.frontmatter.title}
          description={doc.frontmatter.description}
          grade={doc.frontmatter.evidenceGrade as EvidenceGrade | undefined}
          lastReviewed={doc.frontmatter.lastReviewed}
          readingTime={formatReadingTime(readingTimeMinutes(doc.body))}
        />
        <CitationProvider order={doc.citationOrder}>
          <MDXRemote
            source={doc.body}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkMath, remarkGfm],
                rehypePlugins: [rehypeKatex, rehypeSlug, [rehypeAutolinkHeadings, headingAutolinkOptions]],
              },
              // First-party MDX only (never untrusted): blockJS:false re-enables JS
              // expression props like <Quiz questions={[...]} />; blockDangerousJS:true
              // still blocks eval/Function/process/require. See docs/_audit/WAVE4_DISCOVERY.md.
              blockJS: false,
              blockDangerousJS: true,
            }}
          />
          <ReferencesList ids={doc.citationOrder} />
        </CitationProvider>
        <PrevNextNav
          prev={
            prevFoundation
              ? {
                  href: `/foundations/${prevFoundation.slug}/`,
                  label: prevFoundation.frontmatter.title,
                  eyebrow: 'Foundations',
                }
              : null
          }
          next={
            nextFoundation
              ? {
                  href: `/foundations/${nextFoundation.slug}/`,
                  label: nextFoundation.frontmatter.title,
                  eyebrow: 'Foundations',
                }
              : null
          }
        />
      </article>
      <PageSidebar
        currentHref={`/foundations/${slug}/`}
        sections={[
          {
            title: 'Foundations',
            items: allFoundations.map((f) => ({
              href: `/foundations/${f.slug}/`,
              label: f.frontmatter.title,
              short: f.frontmatter.title,
            })),
          },
          ...(relatedModalities.length
            ? [
                {
                  title: 'Related modalities',
                  items: relatedModalities.map((m) => ({
                    href: `/modalities/${m.slug}/`,
                    label: m.title,
                    short: m.short,
                  })),
                },
              ]
            : []),
        ]}
      />
    </div>
  );
}
