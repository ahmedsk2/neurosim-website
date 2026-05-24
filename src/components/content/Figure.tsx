import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface FigureProps {
  /** Inline SVG via children, or pass `src` for an external image. */
  children?: ReactNode;
  src?: string;
  alt?: string;
  caption?: ReactNode;
  /** Attribution / source / license. Renders below the caption. */
  attribution?: ReactNode;
  /** Set wide for wider-than-prose rendering. */
  wide?: boolean;
  className?: string;
  /** Number/label visible in the corner. */
  label?: string;
}

export function Figure({
  children,
  src,
  alt,
  caption,
  attribution,
  wide = false,
  className,
  label,
}: FigureProps) {
  return (
    <figure
      className={cn(
        'my-6 rounded-lg border border-line bg-surface-card overflow-hidden',
        wide && 'w-full',
        className,
      )}
    >
      <div className="relative bg-surface-deeper">
        {label && (
          <span className="absolute top-2 left-2 z-10 inline-flex items-center rounded-full bg-surface-darker px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-tealLight">
            {label}
          </span>
        )}
        {src ? (
          <img src={src} alt={alt ?? ''} className="block w-full h-auto" loading="lazy" />
        ) : (
          <div className="block w-full">{children}</div>
        )}
      </div>
      {(caption || attribution) && (
        <figcaption className="px-4 py-3 text-[12px] text-ink/85 leading-[1.5]">
          {caption && <div>{caption}</div>}
          {attribution && (
            <div className="mt-1 text-[11px] text-ink-muted italic">{attribution}</div>
          )}
        </figcaption>
      )}
    </figure>
  );
}
