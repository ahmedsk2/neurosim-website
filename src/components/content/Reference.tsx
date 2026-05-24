import { getReference } from '@/data/references';
import { formatReferenceFull } from '@/lib/citations';

export function Reference({ id }: { id: string }) {
  const r = getReference(id);
  if (!r) return <span className="text-status-dangerText">[missing reference: {id}]</span>;
  return (
    <span className="text-[12.5px] text-ink/90">
      {formatReferenceFull(r)}
      {r.doi && (
        <>
          {' '}
          <a
            href={`https://doi.org/${r.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-tealLight underline"
          >
            link
          </a>
        </>
      )}
    </span>
  );
}

export function ReferencesList({ ids }: { ids: string[] }) {
  if (ids.length === 0) return null;
  return (
    <section data-detail-block="all" className="mt-10 pt-6 border-t border-line">
      <h2 className="text-[14px] font-bold uppercase tracking-[0.16em] text-brand-tealLight m-0 mb-4">
        References
      </h2>
      <ol className="m-0 space-y-2 list-decimal list-inside">
        {ids.map((id) => {
          const r = getReference(id);
          if (!r) return <li key={id}>missing: {id}</li>;
          return (
            <li key={id} id={`ref-${id}`} className="text-[12.5px] leading-[1.55] text-ink/90">
              <Reference id={id} />
            </li>
          );
        })}
      </ol>
    </section>
  );
}
