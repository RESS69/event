import React from 'react';
import { FormPageLayout } from './FormPageLayout';
import { CompanyForm } from './CompanyForm';
import { CompanyItem, ClientContact } from '../types';

interface EditCompanyPageProps {
  company: CompanyItem;
  onBack: () => void;
  onSave: (company: CompanyItem) => void;
}

export const EditCompanyPage: React.FC<EditCompanyPageProps> = ({
  company,
  onBack,
  onSave,
}) => {
  const handleSubmit = (value: { company: CompanyItem; contacts: ClientContact[] }) => {
    onSave({
      ...value.company,
      contacts: value.contacts,
    });
  };

  return (
    <FormPageLayout
      title="Edit Company"
      description={company.companyName}
      onBack={onBack}
    >
      <CompanyForm
        initialCompany={company}
        initialContacts={company.contacts}
        onSubmit={handleSubmit}
      />
    </FormPageLayout>
  );
};
