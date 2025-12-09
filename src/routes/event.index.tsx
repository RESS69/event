// src/routes/company.index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../Components/Layout/PageHeader';
import { PageSection } from '../Components/Layout/PageSection';
import { PrimaryButton } from '../Components/Ui/PrimaryButton';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/event/')({
  component: CompanyListRoute,
});

function CompanyListRoute() {
  // เดี๋ยวค่อยเปลี่ยนเป็นข้อมูลจริงทีหลัง
  const totalCompanies = 15;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header มีกรอบเหมือนหน้า Staff */}
      <PageHeader
        title="Event"
        count={totalCompanies}
        countLabel="Event"
        actions={
          <PrimaryButton
            leftIcon={<Plus size={18} strokeWidth={2.5} />}
            // onClick={() => {
            //   // ไว้ค่อยต่อ /company/new ภายหลัง
            //   console.log('go to /company/new');
            // }}
          >
            Create Event
          </PrimaryButton>
        }
      />

      {/* กรอบ content สีขาวสำหรับ Company list */}
      <PageSection>
        <p className="text-sm text-gray-700">
          ที่นี่คือพื้นที่ content ของ Event
          (เดี๋ยวเราค่อยมาใส่ Card / Table จริง ๆ ต่ออีกที)
        </p>
      </PageSection>
    </div>
  );
}
