import React from 'react';
import { StaffMember } from '../types';
import { FormPageLayout } from './FormPageLayout';
import { StaffForm } from './StaffForm';

interface EditStaffPageProps {
  staff: StaffMember;
  onBack: () => void;
  onSave: (updatedStaff: StaffMember) => void;
}

export const EditStaffPage: React.FC<EditStaffPageProps> = ({
  staff,
  onBack,
  onSave
}) => {
  return (
    <FormPageLayout
      title="Edit Staff"
      description="Update staff details and credentials"
      onBack={onBack}
    >
      <StaffForm initialStaff={staff} onSubmit={onSave} />
    </FormPageLayout>
  );
};
