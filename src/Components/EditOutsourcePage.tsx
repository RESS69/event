import React from 'react';
import { StaffMember } from '../types';
import { FormPageLayout } from './FormPageLayout';
import { OutsourceForm } from './OutsourceForm';

interface EditOutsourcePageProps {
  staff: StaffMember;
  onBack: () => void;
  onSave: (staff: StaffMember) => void;
}

export const EditOutsourcePage: React.FC<EditOutsourcePageProps> = ({
  staff,
  onBack,
  onSave
}) => {
  return (
    <FormPageLayout
      title="Edit Outsource"
      description={staff.name}
      onBack={onBack}
    >
      <OutsourceForm initialStaff={staff} onSubmit={onSave} />
    </FormPageLayout>
  );
};
