import '@/styles/home.css';
import { Hero } from '@/components/home/Hero';
import { SectionNav } from '@/components/home/SectionNav';
import { StatStrip } from '@/components/home/StatStrip';
import { DomainPentagon } from '@/components/home/DomainPentagon';
import { SecondaryInjuryTimeline } from '@/components/home/SecondaryInjuryTimeline';
import { ModalityGridTeaser } from '@/components/home/ModalityGridTeaser';
import { FoundationsEntry } from '@/components/home/FoundationsEntry';
import { AboutFooter } from '@/components/home/AboutFooter';

export const metadata = {
  title: 'Pediatric Multimodal Neuromonitoring, MNM-Edu',
  description:
    'An evidence-anchored educational resource on pediatric multimodal neuromonitoring: 24 modalities, foundations curriculum, interactive widgets, and case library.',
};

export default function HomePage() {
  return (
    <div className="space-y-10 md:space-y-14">
      <Hero />
      <SectionNav />
      {/* scroll-mt-44 leaves room for the 56-px sticky header + 44-px section nav so
          target headings aren't covered when the SectionNav jump scrolls to them. */}
      <div id="stats" className="scroll-mt-44">
        <StatStrip />
      </div>
      <div id="domains" className="scroll-mt-44">
        <DomainPentagon />
      </div>
      <div id="why" className="scroll-mt-44">
        <SecondaryInjuryTimeline />
      </div>
      <div id="catalog" className="scroll-mt-44">
        <ModalityGridTeaser />
      </div>
      <div id="foundations" className="scroll-mt-44">
        <FoundationsEntry />
      </div>
      <div id="about" className="scroll-mt-44">
        <AboutFooter />
      </div>
      <p className="pt-2 text-center text-[11px] italic text-ink-dim">
        Pedagogical resource, not a clinical device. Always individualise bedside decisions; always
        check the references.
      </p>
    </div>
  );
}
