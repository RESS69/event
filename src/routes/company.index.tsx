// src/routes/company.index.tsx
import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../Components/Layout/PageHeader';
import { PageSection } from '../Components/Layout/PageSection';
import { PrimaryButton } from '../Components/Ui/PrimaryButton';
import { SearchBar } from '../Components/SearchBar';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/company/')({
  component: CompanyListRoute,
});

function CompanyListRoute() {
  const totalCompanies = 15; // mock data
    const [searchText, setSearchText] = useState('');
  

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Company"
        count={totalCompanies}
        countLabel="companies"
        actions={
          <PrimaryButton
            leftIcon={<Plus size={18} strokeWidth={2.5} />}
            // onClick={() => {
            //   console.log('go to /company/new');
            // }}
          >
            Add Company
          </PrimaryButton>
        }
      />
      <div className="px-6 pt-4 pb-2">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search equipment..."
          filterLabel="Date Create"
          onFilterClick={() => {
            console.log('open category filter');
          }}
        />
      </div>
      <PageSection>
        <p className="text-sm text-gray-700">
          ที่นี่คือพื้นที่ content ของ Company list
        </p>
      </PageSection>
    </div>
  );
}
