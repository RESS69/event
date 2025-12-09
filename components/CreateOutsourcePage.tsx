import React from 'react';
import { StaffMember } from '../types';
import { FormPageLayout } from './FormPageLayout';
import { OutsourceForm } from './OutsourceForm';

interface CreateOutsourcePageProps {
  onBack: () => void;
  onCreate: (staff: StaffMember) => void;
}

export const CreateOutsourcePage: React.FC<CreateOutsourcePageProps> = ({
  onBack,
  onCreate
}) => {
  return (
    <FormPageLayout
      title="Add New Outsource"
      description="Add a new external staff member"
      onBack={onBack}
    >
      <OutsourceForm onSubmit={onCreate} />
    </FormPageLayout>
  );
};
