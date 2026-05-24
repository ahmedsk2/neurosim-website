'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

let mermaidPromise: Promise<typeof import('mermaid').default> | null = null;
let initialized = false;

async function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((m) => m.default);
  }
  const mermaid = await mermaidPromise;
  if (!initialized) {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        // Tuned to the site's dark surface palette.
        background: '#0F1A2E',
        primaryColor: '#13243A',
        primaryTextColor: '#E5E7EB',
        primaryBorderColor: '#5EEAD4',
        lineColor: '#5EEAD4',
        secondaryColor: '#1E2C44',
        tertiaryColor: '#13243A',
        edgeLabelBackground: '#13243A',
        clusterBkg: '#13243A',
        clusterBorder: '#334155',
        fontFamily: 'inherit',
        fontSize: '13px',
      },
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        useMaxWidth: true,
      },
      securityLevel: 'loose',
    });
    initialized = true;
  }
  return mermaid;
}

let counter = 0;

export function Mermaid({ chart, className }: { chart: string; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    counter += 1;
    const id = `mermaid-${counter}-${Date.now().toString(36)}`;
    getMermaid()
      .then((m) => m.render(id, chart.trim()))
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
  }, [chart]);

  if (err) {
    return (
      <div className="my-3 rounded-md border border-status-danger/40 bg-status-danger/10 p-3 text-[12px] text-status-dangerText">
        <div className="font-semibold mb-1">Mermaid render error</div>
        <pre className="m-0 overflow-x-auto whitespace-pre-wrap text-[11px]">{err}</pre>
      </div>
    );
  }
  const containerClass = cn(
    'my-4 overflow-x-auto rounded-md border border-line bg-surface-deeper p-3 [&_svg]:max-w-full [&_svg]:h-auto',
    className,
  );
  if (svg) {
    return (
      <div
        ref={ref}
        className={containerClass}
        aria-label="Diagram"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }
  return (
    <div ref={ref} className={containerClass} aria-label="Diagram">
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
