import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { headingAutolinkOptions } from '@/lib/mdxRehype';
import { listSlugs, loadContent, listContent } from '@/lib/content';
import { mdxComponents } from '@/components/mdx/components';
import { PageHeader } from '@/components/layout/PageScaffold';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PageSidebar } from '@/components/layout/PageSidebar';
import { PrevNextNav } from '@/components/layout/PrevNextNav';
import { readingTimeMinutes, formatReadingTime } from '@/lib/readingTime';
import { CitationProvider } from '@/components/content/CitationContext';
import { ReferencesList } from '@/components/content/Reference';
import { getModality, MODALITIES } from '@/data/modalities';
import type { EvidenceGrade } from '@/data/references';

export async function generateStaticParams() {
  return listSlugs('modalities').map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getModality(slug);
  const doc = loadContent('modalities', slug);
  const title = doc?.frontmatter.title ?? meta?.title ?? 'Modality';
  const description = doc?.frontmatter.description ?? meta?.summary;
  return {
    title,
    description,
    openGraph: { title, description, images: [`/og/modalities/${slug}.svg`] },
    twitter: { card: 'summary_large_image', title, description, images: [`/og/modalities/${slug}.svg`] },
  };
}

export default async function ModalityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = loadContent('modalities', slug);
  const meta = getModality(slug);
  if (!doc || !meta) notFound();

  const sameDomain = MODALITIES.filter((m) => m.domain === meta.domain && m.slug !== slug);
  const foundationDocs = listContent('foundations');
  const relatedFoundations = foundationDocs.filter((f) =>
    meta.relatedFoundations.includes(f.slug),
  );

  // Prev/Next walks the full modality list in declaration order.
  const myIdx = MODALITIES.findIndex((m) => m.slug === slug);
  const prevModality = myIdx > 0 ? MODALITIES[myIdx - 1] : null;
  const nextModality = myIdx >= 0 && myIdx < MODALITIES.length - 1 ? MODALITIES[myIdx + 1] : null;

  return (
    <div className="flex gap-8">
      <article className="prose-mnm flex-1 min-w-0">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Modalities', href: '/modalities/' },
            { label: meta.title },
          ]}
        />
        <PageHeader
          eyebrow={`${meta.short} · ${MODALITIES.find((m) => m.slug === slug)?.domain.replace(/-/g, ' ').toUpperCase()}`}
          title={doc.frontmatter.title}
          description={doc.frontmatter.description}
          grade={(doc.frontmatter.evidenceGrade as EvidenceGrade | undefined) ?? meta.evidenceGrade}
          lastReviewed={doc.frontmatter.lastReviewed}
          labels={meta.labels}
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
            prevModality
              ? {
                  href: `/modalities/${prevModality.slug}/`,
                  label: prevModality.title,
                  eyebrow: prevModality.short,
                }
              : null
          }
          next={
            nextModality
              ? {
                  href: `/modalities/${nextModality.slug}/`,
                  label: nextModality.title,
                  eyebrow: nextModality.short,
                }
              : null
          }
        />
      </article>
      <PageSidebar
        currentHref={`/modalities/${slug}/`}
        sections={[
          ...(sameDomain.length
            ? [
                {
                  title: meta.domain.replace(/-/g, ' '),
                  items: sameDomain.map((m) => ({
                    href: `/modalities/${m.slug}/`,
                    label: m.title,
                    short: m.short,
                  })),
                },
              ]
            : []),
          ...(relatedFoundations.length
            ? [
                {
                  title: 'Foundations',
                  items: relatedFoundations.map((f) => ({
                    href: `/foundations/${f.slug}/`,
                    label: f.frontmatter.title,
                    short: f.frontmatter.title,
                  })),
                },
              ]
            : []),
        ]}
      />
    </div>
  );
}
