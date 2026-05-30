import Link from 'next/link';
import { CookieSettingsLink } from '@/components/consent/CookieSettingsLink';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface-dark">
      <div className="mx-auto max-w-page px-4 py-10 md:px-6 grid gap-8 md:grid-cols-4">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand-tealLight mb-1">
            MNM-Edu
          </div>
          <div className="text-[13px] text-ink mb-3 leading-[1.55]">
            An interactive, evidence-anchored educational resource for pediatric multimodal neuromonitoring.
          </div>
          <div className="text-[11px] text-ink-muted italic">
            Pedagogical resource, not a clinical device.
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-2">
            Learn
          </div>
          <ul className="space-y-1 text-[13px]">
            <li><Link href="/foundations/" className="text-ink hover:text-brand-tealLight">Foundations</Link></li>
            <li><Link href="/modalities/" className="text-ink hover:text-brand-tealLight">Modalities</Link></li>
            <li><Link href="/integration/" className="text-ink hover:text-brand-tealLight">Integration</Link></li>
            <li><Link href="/pediatrics/" className="text-ink hover:text-brand-tealLight">Pediatrics</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-2">
            Reference
          </div>
          <ul className="space-y-1 text-[13px]">
            <li><Link href="/evidence/" className="text-ink hover:text-brand-tealLight">Evidence library</Link></li>
            <li><Link href="/glossary/" className="text-ink hover:text-brand-tealLight">Glossary</Link></li>
            <li><Link href="/search/" className="text-ink hover:text-brand-tealLight">Search</Link></li>
            <li><Link href="/figure-credits/" className="text-ink hover:text-brand-tealLight">Figure credits</Link></li>
            <li><Link href="/roadmap/" className="text-ink hover:text-brand-tealLight">Roadmap</Link></li>
            <li><Link href="/about/" className="text-ink hover:text-brand-tealLight">About</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mb-2">
            Legal
          </div>
          <ul className="space-y-1 text-[13px]">
            <li><Link href="/privacy/" className="text-ink hover:text-brand-tealLight">Privacy policy</Link></li>
            <li><Link href="/terms/" className="text-ink hover:text-brand-tealLight">Terms of use</Link></li>
            <li className="text-ink/80">Educational content under CC BY-SA 4.0</li>
            <li className="text-ink/80">Code under MIT</li>
            <li className="text-ink/80">No PHI · no clinical advice</li>
            <li>
              <CookieSettingsLink />
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-page px-4 py-4 md:px-6 text-[11px] text-ink-muted flex flex-wrap items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} MNM-Edu. Pediatric Multimodal Neuromonitoring, Interactive.
          </div>
          <div>For educational use; not a substitute for clinical judgement.</div>
        </div>
      </div>
    </footer>
  );
}
