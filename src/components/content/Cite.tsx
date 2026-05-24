'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui';
import { useCitations } from './CitationContext';
import { getReference } from '@/data/references';
import { formatReferenceFull } from '@/lib/citations';

export function Cite({ id }: { id: string }) {
  const { numberFor } = useCitations();
  const [open, setOpen] = useState(false);
  const ref = getReference(id);
  const n = numberFor(id);
  const display = n > 0 ? `${n}` : '?';

  if (!ref) {
    return (
      <span
        title={`Missing reference: ${id}`}
        className="inline-flex h-[1.4em] min-w-[1.6em] items-center justify-center rounded-full bg-status-danger px-1.5 text-[10px] font-bold text-white"
      >
        ?
      </span>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`Reference ${display}: ${ref.title}`}
          className="mx-0.5 inline-flex h-[1.5em] min-w-[1.7em] items-center justify-center rounded-full bg-brand-tealDark px-1.5 align-baseline text-[10px] font-bold text-white hover:bg-brand-teal focus-visible:bg-brand-teal"
        >
          {display}
        </button>
      </DialogTrigger>
      <DialogContent title={`Reference [${display}]`}>
        <div className="text-[13px] leading-[1.6]">
          <p className="m-0 mb-2.5 text-ink">{formatReferenceFull(ref)}</p>
          {ref.doi && (
            <p className="m-0">
              <a
                href={`https://doi.org/${ref.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-tealLight underline"
              >
                doi:{ref.doi}
              </a>
            </p>
          )}
          {ref.pmid && (
            <p className="m-0 mt-1">
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-tealLight underline"
              >
                PMID:{ref.pmid}
              </a>
            </p>
          )}
          {ref.open_access_url && (
            <p className="m-0 mt-1">
              <a
                href={ref.open_access_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-tealLight underline"
              >
                Open access PDF
              </a>
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
