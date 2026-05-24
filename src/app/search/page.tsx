import { PageHeader } from '@/components/layout/PageScaffold';
import SearchClient from './SearchClient';
import { writeSearchIndexJSON } from '@/lib/search';

export const metadata = { title: 'Search' };

export default function SearchPage() {
  // Side-effect: build search index at static-export time.
  writeSearchIndexJSON();
  return (
    <div>
      <PageHeader
        eyebrow="Search"
        title="Find anything"
        description="Searches across all foundation chapters, modality pages, integration scenarios, and the pediatrics hub. Both Essentials and Deep Dive content are indexed."
      />
      <SearchClient />
    </div>
  );
}
