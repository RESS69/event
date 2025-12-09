// src/routes/staff.index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../Components/Layout/PageHeader';
import { PrimaryButton } from '../Components/Ui/PrimaryButton';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/staff/')({
  component: StaffListRoute,
});

function StaffListRoute() {
  const totalStaff = 35;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Staff"
        count={totalStaff}
        countLabel="active members"
        actions={
          <PrimaryButton
            leftIcon={<Plus size={18} strokeWidth={2.5} />}
            // onClick={() => {
            //   // เดี๋ยวค่อยต่อ router.navigate ภายหลัง
            //   console.log('go to /staff/new');
            // }}
          >
            Add Staff
          </PrimaryButton>
        }
      />

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          {/* ตรงนี้จะเป็นตาราง staff จริง ๆ */}
          <p className="text-sm text-gray-700">
            ที่นี่คือพื้นที่ content ของ Staff list
          </p>
        </div>
      </div>
    </div>
  );
}
