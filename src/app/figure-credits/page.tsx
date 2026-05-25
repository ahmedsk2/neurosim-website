import { PageHeader } from '@/components/layout/PageScaffold';
import { Card, Callout } from '@/components/ui';

export const metadata = {
  title: 'Figure credits and curation guide',
  description:
    'Open-licence sources for medical figures, attribution standards used on this site, and a how-to guide for adding new images.',
};

export default function FigureCreditsPage() {
  return (
    <div className="prose-mnm prose-wide">
      <PageHeader
        eyebrow="Figures"
        title="Figure credits and curation guide"
        description="How this site sources its images, the licensing standard, and where to find more open-licensed medical figures."
      />

      <h2>How this site handles figures</h2>
      <p>
        Most figures on this site are <strong>original SVG illustrations</strong> created
        for MNM-Edu and released under CC BY-SA 4.0. They appear inline using the{' '}
        <code>&lt;Figure&gt;</code> component with a caption and the attribution{' '}
        <em>&quot;MNM-Edu, original schematic.&quot;</em>
      </p>

      <p>
        Where an externally-sourced image adds materially to teaching, the site uses the{' '}
        <code>&lt;SourcedFigure&gt;</code> component, which displays full attribution
        metadata: creator, source, year, and licence (with a link to the licence text).
        Externally-sourced figures are <strong>only</strong> used when their licence
        permits the re-use, typically Creative Commons (CC BY, CC BY-SA, CC0), public
        domain, or explicit permission from the rights holder.
      </p>

      <Callout type="caveat" title="What we do not do">
        <p className="m-0">
          We do not embed copyrighted figures from journal articles based on citation
          alone. Citation acknowledges the source; it does not grant a re-use licence.
          For copyright-restricted figures we cannot re-license, the page links out to
          the original source instead of reproducing the image.
        </p>
      </Callout>

      <h2>Recommended open-licence sources</h2>

      <Card className="my-3">
        <h3 className="m-0 mb-2 text-[14px] font-bold text-brand-tealLight">
          Servier Medical Art
        </h3>
        <p className="m-0 mb-1 text-[12.5px]">
          Around 3,000 high-quality medical illustrations covering anatomy, monitoring
          devices, ICU equipment, and procedures. Free to use under CC BY 3.0 with
          attribution.
        </p>
        <p className="m-0 text-[11px] text-ink-muted">
          smart.servier.com · CC BY 3.0
        </p>
      </Card>

      <Card className="my-3">
        <h3 className="m-0 mb-2 text-[14px] font-bold text-brand-tealLight">
          Wikimedia Commons
        </h3>
        <p className="m-0 mb-1 text-[12.5px]">
          Large library of medical illustrations, photographs, and diagrams. Licences
          vary per file, check the file&apos;s page for the specific licence (often
          CC BY, CC BY-SA, or public domain). Quality is heterogeneous; verify
          accuracy before use.
        </p>
        <p className="m-0 text-[11px] text-ink-muted">
          commons.wikimedia.org · per-file licence
        </p>
      </Card>

      <Card className="my-3">
        <h3 className="m-0 mb-2 text-[14px] font-bold text-brand-tealLight">
          PubMed Central, open-access subset
        </h3>
        <p className="m-0 mb-1 text-[12.5px]">
          A growing fraction of articles indexed in PMC are CC BY or CC BY-NC. Figures
          in those articles inherit the article&apos;s licence and can be re-used with
          attribution. Filter PMC by &quot;Open Access&quot; and check the licence
          statement on each article.
        </p>
        <p className="m-0 text-[11px] text-ink-muted">
          ncbi.nlm.nih.gov/pmc · per-article licence
        </p>
      </Card>

      <Card className="my-3">
        <h3 className="m-0 mb-2 text-[14px] font-bold text-brand-tealLight">
          NIH / NLM / CDC / NIBIB
        </h3>
        <p className="m-0 mb-1 text-[12.5px]">
          Most images produced by US federal-government agencies are in the public
          domain. The NLM&apos;s Open-i image database aggregates open biomedical
          images. Useful for educational illustrations of devices, anatomy, and
          imaging modalities.
        </p>
        <p className="m-0 text-[11px] text-ink-muted">
          openi.nlm.nih.gov · public domain (mostly)
        </p>
      </Card>

      <Card className="my-3">
        <h3 className="m-0 mb-2 text-[14px] font-bold text-brand-tealLight">
          OpenStax Anatomy &amp; Physiology
        </h3>
        <p className="m-0 mb-1 text-[12.5px]">
          Textbook-quality anatomical illustrations under CC BY 4.0. Comprehensive
          coverage of brain, vasculature, autonomic nervous system, and head/neck
          anatomy. Excellent baseline for foundation chapters.
        </p>
        <p className="m-0 text-[11px] text-ink-muted">
          openstax.org · CC BY 4.0
        </p>
      </Card>

      <Card className="my-3">
        <h3 className="m-0 mb-2 text-[14px] font-bold text-brand-tealLight">
          BioRender (free educational tier)
        </h3>
        <p className="m-0 mb-1 text-[12.5px]">
          Many figures available free for educational use; check the specific
          licence terms before redistribution. Useful for cell-level and pathway
          illustrations not covered by the sources above.
        </p>
        <p className="m-0 text-[11px] text-ink-muted">
          biorender.com · per-figure terms
        </p>
      </Card>

      <h2>Adding a new sourced figure</h2>
      <p className="text-[13px]">Three-step process for contributors:</p>

      <ol className="text-[13px] leading-[1.7]">
        <li>
          <strong>Verify the licence.</strong> Confirm the image is CC-licensed,
          public domain, or that you have explicit written permission. &quot;Found on
          Google&quot; is not a licence. If in doubt, do not use it.
        </li>
        <li>
          <strong>Download the image</strong> and place it under{' '}
          <code>/public/figures/&lt;modality-or-foundation-slug&gt;/</code>. Use a
          clear filename; preserve the original where possible.
        </li>
        <li>
          <strong>Add to the page</strong> with the <code>&lt;SourcedFigure&gt;</code>{' '}
          component:
        </li>
      </ol>

      <Card className="my-3 p-0">
        <pre className="m-0 overflow-x-auto p-3 text-[11.5px] leading-normal text-ink">
{`<SourcedFigure
  src="/figures/icp/icp-bolt-photo.jpg"
  alt="Camino bolt in situ on a pediatric patient, frontal placement"
  caption="Camino intraparenchymal bolt placed at Kocher's point. Note the
    subcutaneous tunnel exit and the bolt threading."
  creator="Smith J, Brown K"
  source="Smith 2020, J Pediatr Crit Care (PMC open access)"
  sourceUrl="https://www.ncbi.nlm.nih.gov/pmc/articles/PMCxxxxxxx/"
  license="cc-by-4.0"
  year={2020}
  label="Fig. 2"
  modified={false}
/>`}
        </pre>
      </Card>

      <h2>License compatibility</h2>
      <p className="text-[13px]">
        This site&apos;s educational content is released under <strong>CC BY-SA 4.0</strong>.
        That means downstream re-users must license derivative works under the same or
        compatible terms. Practical implications:
      </p>

      <ul className="text-[13px] leading-[1.7]">
        <li>
          <strong>CC BY 4.0 / CC BY 3.0 / CC0 / public domain</strong> figures can be
          embedded directly, they&apos;re compatible with CC BY-SA.
        </li>
        <li>
          <strong>CC BY-SA 4.0 / 3.0</strong> figures can be embedded; the page they
          appear on inherits the SA requirement.
        </li>
        <li>
          <strong>CC BY-NC</strong> (non-commercial) figures are problematic for an
          openly-redistributable site. We avoid them unless the page is clearly marked
          non-commercial.
        </li>
        <li>
          <strong>&quot;All rights reserved&quot;</strong> figures are not used,
          regardless of citation.
        </li>
      </ul>

      <h2>The <code>&lt;SourcedFigure&gt;</code> component contract</h2>
      <p className="text-[13px]">
        Every external image must carry these fields:
      </p>

      <ul className="text-[13px]">
        <li><code>src</code>, local or external URL</li>
        <li><code>alt</code>, descriptive accessibility text</li>
        <li><code>caption</code>, what the figure shows (educational caption)</li>
        <li><code>creator</code>, original author(s)</li>
        <li><code>source</code>, publication / archive name</li>
        <li><code>sourceUrl</code>, link to source page (for verification)</li>
        <li><code>license</code>, CC variant, public-domain, or permission-granted</li>
        <li><code>year</code>, original publication year</li>
        <li><code>modified</code>, whether the image was modified for this site (CC BY-SA requires disclosure)</li>
        <li><code>permissionNote</code>, for explicit-permission cases, the email or correspondence reference</li>
      </ul>

      <Callout type="real-world" title="Honesty over breadth">
        <p className="m-0">
          It is better to have fewer figures, all properly licensed and attributed,
          than many figures of dubious provenance. Where an open-licence image is not
          available, the inline SVG schematic (or a written description) is the right
          choice. The CC BY-SA promise to readers is more important than visual polish.
        </p>
      </Callout>
    </div>
  );
}
