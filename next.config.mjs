// MDX content is compiled at the page level by next-mdx-remote/rsc (see the
// dynamic [slug] / [scenario] route pages, which pass their own remark/rehype
// plugins). @next/mdx is intentionally not wired here: nothing imports .mdx as a
// module and there are no .mdx route files, so it compiled nothing.
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ['ts', 'tsx'],
  reactStrictMode: true,
};

export default nextConfig;
