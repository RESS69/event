// src/routes/outsource.index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../Components/Layout/PageHeader';
import { PageSection } from '../Components/Layout/PageSection';
import { PrimaryButton } from '../Components/Ui/PrimaryButton';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/outsource/')({
  component: OutsourceListRoute,
});

function OutsourceListRoute() {
  const totalOutsource = 12; // mock data

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Outsource"
        count={totalOutsource}
        countLabel="outsourced staff"
        actions={
          <PrimaryButton
            leftIcon={<Plus size={18} strokeWidth={2.5} />}
            // onClick={() => {
            //   console.log('go to /outsource/new');
            // }}
          >
            Add Outsource
          </PrimaryButton>
        }
      />

      <PageSection>
        <p className="text-sm text-gray-700">
          ที่นี่คือพื้นที่ content ของ Outsource list
        </p>
      </PageSection>
    </div>
  );
}
