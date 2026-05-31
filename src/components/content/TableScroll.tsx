'use client';

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react';

/**
 * Horizontal-scroll wrapper for MDX data tables.
 *
 * GFM tables on content pages (modalities, foundations, integration) can have a
 * min-content width wider than a phone viewport, for example the age-band threshold
 * tables. Without a scroll container such a table widens the whole page and forces
 * page-level horizontal scrolling (audit A1: the ICP page scrolled to 402px at a 375px
 * viewport). This wrapper keeps the overflow inside the table's own box: on desktop the
 * table fills the column (width:100%, unchanged); on a narrow screen the wrapper scrolls
 * internally and the page does not.
 *
 * The wrapper becomes a focusable, labelled scroll region only WHEN it actually
 * overflows, so keyboard users can scroll it and assistive tech announces it, without
 * adding dead tab stops to tables that already fit (and with no SSR/hydration mismatch:
 * the first render is always the non-overflowing state). The visible affordance is a
 * thin, token-matched scrollbar (see .prose-table-scroll in globals.css); no gradient or
 * fade overlay is used, deliberately, so the clinical values in edge columns are never
 * tinted.
 */
export function TableScroll(props: ComponentPropsWithoutRef<'table'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScrollable(el.scrollWidth - el.clientWidth > 1);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="prose-table-scroll"
      data-scrollable={scrollable || undefined}
      {...(scrollable
        ? {
            role: 'region',
            'aria-label': 'Table, scroll sideways to see all columns',
            tabIndex: 0,
          }
        : {})}
    >
      <table {...props} />
    </div>
  );
}
