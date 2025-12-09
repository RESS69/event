// src/routes/package.index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../Components/Layout/PageHeader';
import { PageSection } from '../Components/Layout/PageSection';
import { PrimaryButton } from '../Components/Ui/PrimaryButton';
import { SearchBar } from '../Components/SearchBar';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/package/')({
  component: PackageListRoute,
});

function PackageListRoute() {
  const totalPackages = 9; // mock data

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Package"
        count={totalPackages}
        countLabel="packages"
        actions={
          <PrimaryButton
            leftIcon={<Plus size={18} strokeWidth={2.5} />}
            // onClick={() => {
            //   console.log('go to /package/new');
            // }}
          >
            Create Package
          </PrimaryButton>
        }
      />

      <PageSection>
        <p className="text-sm text-gray-700">
          ที่นี่คือพื้นที่ content ของ Package list
        </p>
      </PageSection>
    </div>
  );
}
