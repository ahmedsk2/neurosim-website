'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme, type Theme } from '@/lib/theme';

let mermaidPromise: Promise<typeof import('mermaid').default> | null = null;

async function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((m) => m.default);
  }
  return mermaidPromise;
}

type MermaidApi = Awaited<ReturnType<typeof getMermaid>>;

// Mermaid bakes its colors into the SVG at render time, so a diagram cannot adapt to
// the active theme via CSS alone. We therefore (re-)initialize mermaid with theme-matched
// variables before each render, and re-render whenever the active theme changes (the
// component's effect is keyed on the useTheme() value, which the theme toggle updates).
// The variables mirror the site design tokens so dark and light each look intentional and
// on-brand, not like mermaid's stock light theme.
//
// fontFamily is the explicit page stack (visually identical to the previous 'inherit')
// rather than 'inherit': mermaid measures label text in its own render sandbox, and when
// the font is 'inherit' that sandbox can resolve a different font than the final container,
// sizing node boxes too narrow and clipping long labels. Pinning the font makes the
// measured and rendered fonts match, so boxes fit their labels.
const FONT_FAMILY = '-apple-system, "Segoe UI", Roboto, sans-serif';

// Dark theme: the site's dark surface palette. Kept identical to the original values so
// dark does not regress; only fontFamily changed (from 'inherit' to the visually-identical
// explicit stack) to fix label box sizing.
const DARK_VARS = {
  background: '#0F1A2E', // --bg-dark
  primaryColor: '#13243A',
  primaryTextColor: '#E5E7EB',
  primaryBorderColor: '#5EEAD4', // teal-light
  lineColor: '#5EEAD4',
  secondaryColor: '#1E2C44',
  tertiaryColor: '#13243A',
  edgeLabelBackground: '#13243A',
  clusterBkg: '#13243A',
  clusterBorder: '#334155',
  fontFamily: FONT_FAMILY,
  fontSize: '13px',
};

// Light theme: mapped to the light design tokens. White node fills with a teal border and
// dark-navy text read cleanly on the light page (#F8FAFC) and on the diagram's light-gray
// container, so the diagram no longer appears as a dark island.
const LIGHT_VARS = {
  background: '#F1F5F9', // --bg-dark (light)
  primaryColor: '#FFFFFF', // --bg-card (light): white node fill
  primaryTextColor: '#0F172A', // --text (light)
  primaryBorderColor: '#0D9488', // --teal (light)
  lineColor: '#0F766E', // --teal-light (light): darker teal for line contrast on light
  secondaryColor: '#E2E8F0', // --bg-deeper (light)
  tertiaryColor: '#F1F5F9',
  edgeLabelBackground: '#FFFFFF',
  clusterBkg: '#F1F5F9',
  clusterBorder: '#94A3B8', // --border-strong (light)
  fontFamily: FONT_FAMILY,
  fontSize: '13px',
};

function configureMermaid(mermaid: MermaidApi, theme: Theme) {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: theme === 'light' ? LIGHT_VARS : DARK_VARS,
    flowchart: {
      // htmlLabels:true keeps HTML-entity decoding in labels (for example the edge labels
      // "R^2 >= 0.5", written as &ge;/&lt; in the source). The default wrappingWidth (~200px)
      // capped node width and clipped the longest label ("...to build buffer", ~254px), so
      // raise it: labels up to 400px now render single-line and mermaid sizes each node box
      // to its full label width, with no clipping. Genuinely longer labels still wrap.
      htmlLabels: true,
      wrappingWidth: 400,
      curve: 'basis',
      // useMaxWidth:false (design B3) makes mermaid emit the SVG at its intrinsic
      // pixel width/height (instead of width:100% + a max-width style that shrinks
      // it to the container). Combined with the .mermaid-scroll rules in
      // globals.css, the diagram still fits the column on desktop/tablet, but on a
      // phone it renders at full legible size and scrolls horizontally inside its
      // box rather than shrinking every label to fit a ~324px width.
      useMaxWidth: false,
    },
    securityLevel: 'loose',
  });
}

let counter = 0;

export function Mermaid({ chart, className }: { chart: string; className?: string }) {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement | null>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [scrollable, setScrollable] = useState(false);

  // Re-runs on theme change (toggle) as well as chart change, so a diagram on screen
  // re-renders into the new theme instead of leaving a stale dark/light diagram behind.
  useEffect(() => {
    let cancelled = false;
    counter += 1;
    const id = `mermaid-${counter}-${Date.now().toString(36)}`;
    getMermaid()
      .then((m) => {
        configureMermaid(m, theme);
        return m.render(id, chart.trim());
      })
      .then(({ svg }) => {
        if (cancelled) return;
        setSvg(svg);
        setErr(null);
      })
      .catch((e) => {
        if (cancelled) return;
        setErr(e instanceof Error ? e.message : 'Mermaid render failed');
        setSvg(null);
      });
    return () => {
      cancelled = true;
    };
  }, [chart, theme]);

  // design B3: make the container a focusable, labelled scroll region ONLY when the
  // rendered diagram is wider than its box (which happens on phones, where the SVG now
  // keeps its intrinsic legible width instead of shrinking to fit). This mirrors the
  // TableScroll pattern: keyboard users can scroll it and AT announces it, with no dead
  // tab stops on desktop/tablet where the diagram fits. Re-measures when the SVG changes
  // (render, theme toggle) and on resize.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScrollable(el.scrollWidth - el.clientWidth > 1);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [svg, theme]);

  if (err) {
    return (
      <div className="my-3 rounded-md border border-status-danger/40 bg-status-danger/10 p-3 text-[12px] text-status-dangerText">
        <div className="font-semibold mb-1">Mermaid render error</div>
        <pre className="m-0 overflow-x-auto whitespace-pre-wrap text-[11px]">{err}</pre>
      </div>
    );
  }
  // Scroll + SVG sizing live in the .mermaid-scroll block in globals.css (design B3):
  // fit-to-column on desktop/tablet, intrinsic-width-and-scroll on phones.
  const containerClass = cn(
    'mermaid-scroll my-4 rounded-md border border-line bg-surface-deeper p-3',
    className,
  );
  // When the diagram overflows (phones), expose the box as a labelled scroll region;
  // otherwise just label it, with no extra tab stop. Mirrors TableScroll.
  const regionProps = scrollable
    ? {
        role: 'region' as const,
        'aria-label': 'Diagram, scroll sideways to see all of it',
        tabIndex: 0,
        'data-scrollable': true,
      }
    : { 'aria-label': 'Diagram' };
  if (svg) {
    return (
      <div
        ref={ref}
        className={containerClass}
        {...regionProps}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }
  return (
    <div ref={ref} className={containerClass} {...regionProps}>
      <pre className="m-0 overflow-x-auto whitespace-pre text-[11px] text-ink-dim font-mono">
        {chart}
      </pre>
    </div>
  );
}

// Helper to plug into the MDX `pre` slot. Detects ```mermaid blocks and routes
// them through the client renderer; other code blocks fall back to the default
// rendering (preserved by the parent renderer that calls this).
export function MermaidPre({ children }: { children: React.ReactNode }) {
  // children is typically a single <code> element. Extract its className + text.
  const child = Array.isArray(children) ? children[0] : children;
  const props = (child as { props?: { className?: string; children?: string } } | null)?.props;
  const className = props?.className ?? '';
  const code = typeof props?.children === 'string' ? props.children : '';
  const isMermaid = /(^|\s)language-mermaid(\s|$)/.test(className);
  if (isMermaid && code) {
    return <Mermaid chart={code} />;
  }
  return <pre className="my-3 overflow-x-auto rounded-md bg-surface-deeper p-3 text-[12px]">{children}</pre>;
}
