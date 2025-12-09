import React from 'react';
import { StaffMember } from '../types';
import { FormPageLayout } from './FormPageLayout';
import { StaffForm } from './StaffForm';

interface CreateStaffPageProps {
  onBack: () => void;
  onCreate: (staff: StaffMember) => void;
}

export const CreateStaffPage: React.FC<CreateStaffPageProps> = ({
  onBack,
  onCreate
}) => {
  return (
    <FormPageLayout
      title="Add New Staff"
      description="Create a new staff account and generate credentials"
      onBack={onBack}
    >
      <StaffForm onSubmit={onCreate} />
    </FormPageLayout>
  );
};
