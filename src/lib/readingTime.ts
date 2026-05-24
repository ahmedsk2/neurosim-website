/**
 * Estimate reading time for a chunk of MDX/markdown text.
 * Strips frontmatter, code fences, JSX tags, and markdown noise before
 * counting words. Uses 200 wpm (adjusted down to 170 for technical content).
 */
const WPM = 170;

export function readingTimeMinutes(body: string): number {
  if (!body) return 0;
  const cleaned = body
    .replace(/^---[\s\S]*?---/m, '') // frontmatter (already stripped by loader, but defensive)
    .replace(/```[\s\S]*?```/g, '') // fenced code blocks
    .replace(/`[^`]*`/g, '') // inline code
    .replace(/<[^>]+>/g, ' ') // JSX/HTML tags
    .replace(/\$\$[\s\S]*?\$\$/g, '') // block math
    .replace(/\$[^$]*\$/g, '') // inline math
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[[^\]]*\]\([^)]*\)/g, '$1') // markdown link → label
    .replace(/[#*_>~|`-]/g, ' ') // strip markdown punctuation
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return 0;
  const words = cleaned.split(' ').length;
  return Math.max(1, Math.round(words / WPM));
}

export function formatReadingTime(minutes: number): string {
  if (!minutes) return '';
  return `${minutes}-min read`;
}
