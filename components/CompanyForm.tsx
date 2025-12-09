import React, { useState } from 'react';
import { Building2, MapPin, Phone, Mail, User, Plus, Trash2, Star } from 'lucide-react';
import { CompanyItem, ClientContact } from '../types';

interface CompanyFormValue {
  company: CompanyItem;
  contacts: ClientContact[];
}

interface CompanyFormProps {
  initialCompany?: CompanyItem;
  initialContacts?: ClientContact[];
  onSubmit: (value: CompanyFormValue) => void;
}

const emptyCompany: CompanyItem = {
  id: '',
  companyName: '',
  contactPerson: '',
  role: '',
  email: '',
  phone: '',
  isFavorite: false,
  createdAt: new Date().toISOString(),
  contacts: [],
  address: '',
  locationName: '',
  branch: '',
  taxId: '',
  officeHours: '',
  googleMapUrl: '',
  industry: '',
};

export const CompanyForm: React.FC<CompanyFormProps> = ({
  initialCompany,
  initialContacts,
  onSubmit,
}) => {
  const [company, setCompany] = useState<CompanyItem>({
    ...emptyCompany,
    ...initialCompany,
  });

  const [contacts, setContacts] = useState<ClientContact[]>(
    initialContacts && initialContacts.length > 0
      ? initialContacts
      : [
          {
            id: 'c-1',
            name: '',
            role: '',
            phone: '',
            email: '',
            isPrimary: true,
          },
        ],
  );

  const isEditMode = Boolean(initialCompany);

  const handleCompanyChange = (field: keyof CompanyItem, value: string | boolean) => {
    setCompany(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactChange = (id: string, field: keyof ClientContact, value: string | boolean) => {
    setContacts(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              [field]: value,
            }
          : c,
      ),
    );
  };

  const addContact = () => {
    setContacts(prev => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        name: '',
        role: '',
        phone: '',
        email: '',
        isPrimary: prev.length === 0,
      },
    ]);
  };

  const removeContact = (id: string) => {
    setContacts(prev => {
      if (prev.length === 1) return prev;

      const removed = prev.find(c => c.id === id);
      const rest = prev.filter(c => c.id !== id);

      if (removed?.isPrimary && rest.length > 0) {
        rest[0].isPrimary = true;
      }
      return [...rest];
    });
  };

  const setPrimaryContact = (id: string) => {
    setContacts(prev =>
      prev.map(c => ({
        ...c,
        isPrimary: c.id === id,
      })),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!company.companyName.trim()) {
      alert('กรุณากรอกชื่อบริษัท');
      return;
    }
    if (contacts.length === 0 || !contacts[0].name.trim()) {
      alert('กรุณาเพิ่มผู้ติดต่ออย่างน้อย 1 คน');
      return;
    }

    const primary = contacts.find(c => c.isPrimary) ?? contacts[0];

    const readyCompany: CompanyItem = {
      ...company,
      id: company.id || `co-${Date.now()}`,
      contactPerson: primary.name,
      role: primary.role,
      email: primary.email,
      phone: primary.phone,
      contacts,
    };

    onSubmit({
      company: readyCompany,
      contacts,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ยี่ห้อบริษัท + branch */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Building2 className="text-blue-500" size={18} />
          Company Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={company.companyName}
              onChange={e => handleCompanyChange('companyName', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none"
              placeholder="เช่น Event Flow Co., Ltd."
            />
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Branch
            </label>
            <input
              type="text"
              value={company.branch || ''}
              onChange={e => handleCompanyChange('branch', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none"
              placeholder="Head Office / Bangkok / etc."
            />
          </div>

          {/* Tax ID */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tax ID</label>
            <input
              type="text"
              value={company.taxId || ''}
              onChange={e => handleCompanyChange('taxId', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none"
              placeholder="เลขประจำตัวผู้เสียภาษี"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Industry</label>
            <input
              type="text"
              value={company.industry || ''}
              onChange={e => handleCompanyChange('industry', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none"
              placeholder="เช่น Education / Finance / Tech"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleCompanyChange('isFavorite', !company.isFavorite)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition ${
            company.isFavorite
              ? 'bg-amber-50 border-amber-300 text-amber-700'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Star
            size={14}
            className={
              company.isFavorite ? 'fill-amber-400 text-amber-500' : 'text-gray-400'
            }
          />
          <span>{company.isFavorite ? 'Favorite client' : 'Mark as favorite'}</span>
        </button>
      </section>

      {/* Address + Map */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="text-blue-500" size={18} />
          Address & Location
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
            <textarea
              value={company.address || ''}
              onChange={e => handleCompanyChange('address', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none min-h-[80px]"
              placeholder="ที่อยู่บริษัท"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Location Name (Building / Floor)
            </label>
            <input
              type="text"
              value={company.locationName || ''}
              onChange={e => handleCompanyChange('locationName', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Office Hours
            </label>
            <input
              type="text"
              value={company.officeHours || ''}
              onChange={e => handleCompanyChange('officeHours', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none"
              placeholder="Mon-Fri 9:00 - 18:00"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Google Map URL
            </label>
            <input
              type="text"
              value={company.googleMapUrl || ''}
              onChange={e => handleCompanyChange('googleMapUrl', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none"
              placeholder="https://maps.google.com/..."
            />
          </div>
        </div>
      </section>

      {/* Contact Persons */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <User className="text-blue-500" size={18} />
            Contact Persons
          </h2>
          <button
            type="button"
            onClick={addContact}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <Plus size={14} />
            Add Contact
          </button>
        </div>

        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <div
              key={contact.id}
              className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3 relative"
            >
              {contacts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeContact(contact.id)}
                  className="absolute right-2 top-2 text-gray-300 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => setPrimaryContact(contact.id)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border ${
                    contact.isPrimary
                      ? 'border-green-500 text-green-600 bg-green-50'
                      : 'border-gray-200 text-gray-500 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {contact.isPrimary ? 'Primary contact' : 'Set as primary'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={e =>
                      handleContactChange(contact.id, 'name', e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none"
                    placeholder="ชื่อ-นามสกุล"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Role</label>
                  <input
                    type="text"
                    value={contact.role}
                    onChange={e =>
                      handleContactChange(contact.id, 'role', e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none"
                    placeholder="เช่น Coordinator / Manager"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Phone</label>
                  <div className="relative">
                    <Phone
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={e =>
                        handleContactChange(contact.id, 'phone', e.target.value)
                      }
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none"
                      placeholder="0x-xxx-xxxx"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Email</label>
                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      value={contact.email}
                      onChange={e =>
                        handleContactChange(contact.id, 'email', e.target.value)
                      }
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => {
            setCompany({ ...emptyCompany, ...initialCompany });
            setContacts(
              initialContacts && initialContacts.length > 0
                ? initialContacts
                : [
                    {
                      id: 'c-1',
                      name: '',
                      role: '',
                      phone: '',
                      email: '',
                      isPrimary: true,
                    },
                  ],
            );
          }}
          className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-700"
        >
          {isEditMode ? 'Save Changes' : 'Save Company'}
        </button>
      </div>
    </form>
  );
};
