import React from 'react';
import { FormPageLayout } from './FormPageLayout';
import { CompanyForm } from './CompanyForm';
import { CompanyItem, ClientContact } from '../types';

interface CreateCompanyPageProps {
  onBack: () => void;
  onCreate: (company: CompanyItem) => void;
}

export const CreateCompanyPage: React.FC<CreateCompanyPageProps> = ({
  onBack,
  onCreate,
}) => {
  const handleSubmit = (value: { company: CompanyItem; contacts: ClientContact[] }) => {
    onCreate({
      ...value.company,
      contacts: value.contacts,
    });
  };

  return (
    <FormPageLayout
      title="Add Company"
      description="Create a new company profile and contacts"
      onBack={onBack}
    >
      <CompanyForm onSubmit={handleSubmit} />
    </FormPageLayout>
  );
};
