import React from 'react';
import { FormPageLayout } from './FormPageLayout';
import { PackageForm } from './PackageForm';
import { PackageItem, EquipmentItem } from '../types';

interface CreatePackagePageProps {
  onBack: () => void;
  equipmentList: EquipmentItem[];
  onCreate: (pkg: PackageItem) => void;
}

export const CreatePackagePage: React.FC<CreatePackagePageProps> = ({
  onBack,
  equipmentList,
  onCreate,
}) => {
  return (
    <FormPageLayout
      title="Create Package"
      description="Bundle equipment into reusable packages"
      onBack={onBack}
    >
      <PackageForm equipmentList={equipmentList} onSubmit={onCreate} />
    </FormPageLayout>
  );
};
