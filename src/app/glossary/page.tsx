import { PageHeader } from '@/components/layout/PageScaffold';
import { GlossaryIndex } from './GlossaryIndex';

export const metadata = { title: 'Glossary' };

export default function GlossaryPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Glossary"
        title="Common terms in pediatric MNM"
        description="Hover-card definitions appear inline on the modality and foundation pages, this is the master list. Search or jump by first letter."
      />
      <GlossaryIndex />
    </div>
  );
}
