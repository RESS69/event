// src/routes/equipment.index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../Components/Layout/PageHeader';
import { PageSection } from '../Components/Layout/PageSection';
import { PrimaryButton } from '../Components/Ui/PrimaryButton';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/Equipment/')({
  component: EquipmentListRoute,
});

function EquipmentListRoute() {
  const totalItems = 48; // mock data

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Equipment"
        count={totalItems}
        countLabel="items"
        actions={
          <PrimaryButton
            leftIcon={<Plus size={18} strokeWidth={2.5} />}
            // onClick={() => {
            //   console.log('go to /equipment/new');
            // }}
          >
            Add Equipment
          </PrimaryButton>
        }
      />

      <PageSection>
        <p className="text-sm text-gray-700">
          ที่นี่คือพื้นที่ content ของ Equipment list
        </p>
      </PageSection>
    </div>
  );
}
