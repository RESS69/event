import React from 'react';
import { FormPageLayout } from './FormPageLayout';
import { PackageForm } from './PackageForm';
import { PackageItem, EquipmentItem } from '../types';

interface EditPackagePageProps {
  pkg: PackageItem;
  equipmentList: EquipmentItem[];
  onBack: () => void;
  onSave: (pkg: PackageItem) => void;
}

export const EditPackagePage: React.FC<EditPackagePageProps> = ({
  pkg,
  equipmentList,
  onBack,
  onSave,
}) => {
  return (
    <FormPageLayout
      title="Edit Package"
      description={pkg.name}
      onBack={onBack}
    >
      <PackageForm initialPackage={pkg} equipmentList={equipmentList} onSubmit={onSave} />
    </FormPageLayout>
  );
};
