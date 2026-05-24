import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { listSlugs, loadContent } from '@/lib/content';
import { mdxComponents } from '@/components/mdx/components';
import { PageHeader } from '@/components/layout/PageScaffold';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { PageSidebar } from '@/components/layout/PageSidebar';
import { PrevNextNav } from '@/components/layout/PrevNextNav';
import { readingTimeMinutes, formatReadingTime } from '@/lib/readingTime';
import { CitationProvider } from '@/components/content/CitationContext';
import { ReferencesList } from '@/components/content/Reference';
import { INTEGRATION_CASES, getCase } from '@/data/integration-cases';
import { MODALITIES } from '@/data/modalities';

export async function generateStaticParams() {
  return listSlugs('integration').map((scenario) => ({ scenario }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ scenario: string }>;
}) {
  const { scenario } = await params;
  const c = getCase(scenario);
  const doc = loadContent('integration', scenario);
  const title = doc?.frontmatter.title ?? c?.title;
  const description = doc?.frontmatter.description ?? c?.premise;
  return {
    title,
    description,
    openGraph: { title, description, images: [`/og/integration/${scenario}.svg`] },
    twitter: { card: 'summary_large_image', title, description, images: [`/og/integration/${scenario}.svg`] },
  };
}

export default async function IntegrationPage({
  params,
}: {
  params: Promise<{ scenario: string }>;
}) {
  const { scenario } = await params;
  const doc = loadContent('integration', scenario);
  const c = getCase(scenario);
  if (!doc || !c) notFound();

  const otherCases = INTEGRATION_CASES.filter((x) => x.slug !== scenario);
  const involvedModalities = MODALITIES.filter((m) => c.modalities.includes(m.slug));

  const myIdx = INTEGRATION_CASES.findIndex((x) => x.slug === scenario);
  const prevCase = myIdx > 0 ? INTEGRATION_CASES[myIdx - 1] : null;
  const nextCase =
    myIdx >= 0 && myIdx < INTEGRATION_CASES.length - 1
      ? INTEGRATION_CASES[myIdx + 1]
      : null;

  return (
    <div className="flex gap-8">
      <article className="prose-mnm flex-1 min-w-0">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Integration', href: '/integration/' },
            { label: c.title },
          ]}
        />
        <PageHeader
          eyebrow="Integration scenario"
          title={doc.frontmatter.title}
          description={doc.frontmatter.description}
          readingTime={formatReadingTime(readingTimeMinutes(doc.body))}
        />
        <CitationProvider order={doc.citationOrder}>
          <MDXRemote
            source={doc.body}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkMath, remarkGfm],
                rehypePlugins: [rehypeKatex, rehypeSlug],
              },
            }}
          />
          <ReferencesList ids={doc.citationOrder} />
        </CitationProvider>
        <PrevNextNav
          prev={
            prevCase
              ? {
                  href: `/integration/${prevCase.slug}/`,
                  label: prevCase.title,
                  eyebrow: 'Scenario',
                }
              : null
          }
          next={
            nextCase
              ? {
                  href: `/integration/${nextCase.slug}/`,
                  label: nextCase.title,
                  eyebrow: 'Scenario',
                }
              : null
          }
        />
      </article>
      <PageSidebar
        currentHref={`/integration/${scenario}/`}
        sections={[
          ...(involvedModalities.length
            ? [
                {
                  title: 'Modalities in play',
                  items: involvedModalities.map((m) => ({
                    href: `/modalities/${m.slug}/`,
                    label: m.title,
                    short: m.short,
                  })),
                },
              ]
            : []),
          {
            title: 'Other scenarios',
            items: otherCases.map((x) => ({
              href: `/integration/${x.slug}/`,
              label: x.title,
            })),
          },
        ]}
      />
    </div>
  );
}
