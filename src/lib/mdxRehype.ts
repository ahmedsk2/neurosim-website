import type { Options as AutolinkOptions } from 'rehype-autolink-headings';

/**
 * Shared rehype-autolink-headings config for the page-level MDXRemote pipeline
 * (modalities, foundations, integration). It MUST be placed AFTER rehype-slug in
 * the rehype array, because rehype-slug assigns the heading `id` that this anchor
 * links to.
 *
 * behavior 'append' adds, as the heading's last child, a real <a href="#id">. We
 * override the plugin's decorative defaults (aria-hidden + tabindex -1) so the
 * anchor is keyboard-focusable and carries an accessible name ("Link to this
 * section"); the visible "#" affordance is aria-hidden so it is not announced
 * twice. Styling and the hover/focus reveal live in `.heading-anchor`
 * (src/styles/globals.css).
 */
export const headingAutolinkOptions: AutolinkOptions = {
  behavior: 'append',
  properties: { className: ['heading-anchor'], ariaLabel: 'Link to this section' },
  content: {
    type: 'element',
    tagName: 'span',
    properties: { ariaHidden: true },
    children: [{ type: 'text', value: '#' }],
  },
};
