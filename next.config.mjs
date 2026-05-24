import createMDX from '@next/mdx';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  reactStrictMode: true,
  experimental: { mdxRs: false },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkMath, remarkGfm],
    rehypePlugins: [rehypeKatex, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
  },
});

export default withMDX(nextConfig);
