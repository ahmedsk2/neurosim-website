import { type ReactNode } from 'react';
import { ExternalLink, Image as ImageIcon, FileText } from 'lucide-react';

/**
 * License options for externally-sourced figures.
 * Each value is the SPDX-style identifier or a free-text equivalent.
 * Anything other than "public-domain" or a CC variant should include a manual
 * permission note in `permissionNote`.
 */
export type FigureLicense =
  | 'cc-by-4.0'
  | 'cc-by-3.0'
  | 'cc-by-sa-4.0'
  | 'cc-by-sa-3.0'
  | 'cc-by-nc-4.0'
  | 'cc-by-nc-sa-4.0'
  | 'cc0-1.0'
  | 'public-domain'
  | 'gov-public-domain'
  | 'permission-granted'
  | 'fair-use-pending'
  | 'other';

const LICENSE_LABELS: Record<FigureLicense, string> = {
  'cc-by-4.0': 'CC BY 4.0',
  'cc-by-3.0': 'CC BY 3.0',
  'cc-by-sa-4.0': 'CC BY-SA 4.0',
  'cc-by-sa-3.0': 'CC BY-SA 3.0',
  'cc-by-nc-4.0': 'CC BY-NC 4.0',
  'cc-by-nc-sa-4.0': 'CC BY-NC-SA 4.0',
  'cc0-1.0': 'CC0',
  'public-domain': 'Public domain',
  'gov-public-domain': 'Public domain (US gov)',
  'permission-granted': 'Permission granted',
  'fair-use-pending': 'Fair use, review pending',
  'other': 'See note',
};

const LICENSE_LINKS: Partial<Record<FigureLicense, string>> = {
  'cc-by-4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'cc-by-3.0': 'https://creativecommons.org/licenses/by/3.0/',
  'cc-by-sa-4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
  'cc-by-sa-3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'cc-by-nc-4.0': 'https://creativecommons.org/licenses/by-nc/4.0/',
  'cc-by-nc-sa-4.0': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  'cc0-1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
};

export interface SourcedFigureProps {
  /** Image source, local /public/figures/ path or external URL. */
  src: string;
  /** Alt text, REQUIRED for accessibility. */
  alt: string;
  /** Educator-facing caption explaining what the figure shows. */
  caption: ReactNode;
  /** Original creator(s) of the figure. */
  creator: string;
  /** Source publication / archive (e.g., "Wikimedia Commons", "Smith 2019, Stroke"). */
  source: string;
  /** URL to the source page (for verification + further reading). */
  sourceUrl?: string;
  /** Licence under which this figure is re-used. */
  license: FigureLicense;
  /** Year of original publication. */
  year?: number;
  /** Optional figure label ("Fig. 1", "Fig. 2a"). */
  label?: string;
  /** Notes on permission, modifications, fair-use rationale. */
  permissionNote?: string;
  /** Whether the image was modified for this site (must be disclosed for ShareAlike). */
  modified?: boolean;
  /** Width hint for responsive sizing. */
  className?: string;
}

/**
 * Render an externally-sourced figure with full attribution metadata.
 * The visible caption shows: figure label · caption · creator · source · licence.
 * Designed for re-use of CC-licensed / public-domain / permission-granted images.
 *
 * NEVER use this component for images you do not have explicit licence to redistribute.
 * "Found on Google" is not a licence.
 */
export function SourcedFigure({
  src,
  alt,
  caption,
  creator,
  source,
  sourceUrl,
  license,
  year,
  label,
  permissionNote,
  modified,
  className,
}: SourcedFigureProps) {
  const licenseLabel = LICENSE_LABELS[license];
  const licenseLink = LICENSE_LINKS[license];

  return (
    <figure
      className={
        'my-5 overflow-hidden rounded-md border border-line bg-surface-deeper ' +
        (className ?? '')
      }
    >
      <div className="relative bg-surface-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="block w-full h-auto"
          loading="lazy"
        />
      </div>

      <figcaption className="px-3 py-2.5 text-[12px] leading-[1.55] text-ink">
        {label && (
          <span className="mr-1 font-bold uppercase tracking-[0.08em] text-brand-tealLight">
            {label}.
          </span>
        )}
        {caption}

        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <ImageIcon className="h-3 w-3 text-ink-dim" aria-hidden />
            {creator}
          </span>

          <span className="text-ink-dim">·</span>

          <span className="inline-flex items-center gap-1">
            <FileText className="h-3 w-3 text-ink-dim" aria-hidden />
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-tealLight hover:underline inline-flex items-center gap-0.5"
              >
                {source}
                {year ? ` (${year})` : ''}
                <ExternalLink className="h-2.5 w-2.5" aria-hidden />
              </a>
            ) : (
              <>
                {source}
                {year ? ` (${year})` : ''}
              </>
            )}
          </span>

          <span className="text-ink-dim">·</span>

          <span className="inline-flex items-center">
            {licenseLink ? (
              <a
                href={licenseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-tealLight hover:underline"
              >
                {licenseLabel}
              </a>
            ) : (
              <span className="text-ink-muted">{licenseLabel}</span>
            )}
          </span>

          {modified && (
            <>
              <span className="text-ink-dim">·</span>
              <span className="text-brand-amber">modified</span>
            </>
          )}
        </div>

        {permissionNote && (
          <div className="mt-1 text-[10px] text-ink-dim italic">{permissionNote}</div>
        )}
      </figcaption>
    </figure>
  );
}
