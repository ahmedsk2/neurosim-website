import { MODALITIES } from '@/data/modalities';
import { PageHeader } from '@/components/layout/PageScaffold';
import { ModalitiesBrowser } from '@/components/modalities/ModalitiesBrowser';

export const metadata = { title: 'Modalities' };

export default function ModalitiesIndex() {
  return (
    <div>
      <PageHeader
        eyebrow="Modalities"
        title={`${MODALITIES.length} monitors, one template`}
        description="Every modality opens with the bedside view, walks through the physical signal, links physiology to a hands-on widget, then closes with pediatric-specific evidence and recent literature. Use the filters to narrow by type (electrical, flow, pressure…), invasiveness, usage, population, and validation status."
      />
      <ModalitiesBrowser modalities={MODALITIES} />
    </div>
  );
}
