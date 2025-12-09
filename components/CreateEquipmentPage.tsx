import React from 'react';
import { EquipmentItem } from '../types';
import { FormPageLayout } from './FormPageLayout';
import { EquipmentForm } from './EquipmentForm';

interface CreateEquipmentPageProps {
  onBack: () => void;
  onCreate: (item: EquipmentItem) => void;
}

export const CreateEquipmentPage: React.FC<CreateEquipmentPageProps> = ({
  onBack,
  onCreate
}) => {
  return (
    <FormPageLayout
      title="Add Equipment"
      description="Add a new equipment item to the inventory"
      onBack={onBack}
    >
      <EquipmentForm onSubmit={onCreate} />
    </FormPageLayout>
  );
};
