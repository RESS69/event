import React, { useState } from 'react';
import { User, Mail, Phone, Camera, Check, Star } from 'lucide-react';
import { RoleType, StaffMember, StaffType } from '../types';

interface OutsourceFormProps {
  initialStaff?: StaffMember;
  onSubmit: (staff: StaffMember) => void;
}

interface FormState {
  name: string;
  englishName: string;
  email: string;
  phone: string;
  roles: RoleType[];
  avatarUrl: string;
  isFavorite: boolean;
  status: 'Active' | 'Offline' | 'Busy';
}

const buildInitialState = (initialStaff?: StaffMember): FormState => {
  if (!initialStaff) {
    return {
      name: '',
      englishName: '',
      email: '',
      phone: '',
      roles: [],
      avatarUrl: '',
      isFavorite: false,
      status: 'Active'
    };
  }

  return {
    name: initialStaff.name,
    englishName: initialStaff.englishName ?? '',
    email: initialStaff.email,
    phone: initialStaff.phone,
    roles: initialStaff.roles,
    avatarUrl: initialStaff.avatarUrl,
    isFavorite: initialStaff.isFavorite,
    status: initialStaff.status
  };
};

export const OutsourceForm: React.FC<OutsourceFormProps> = ({ initialStaff, onSubmit }) => {
  const [form, setForm] = useState<FormState>(() => buildInitialState(initialStaff));
  const isEditMode = Boolean(initialStaff);

  const toggleRole = (role: RoleType) => {
    setForm(prev => {
      const exists = prev.roles.includes(role);
      return {
        ...prev,
        roles: exists ? prev.roles.filter(r => r !== role) : [...prev.roles, role]
      };
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm(prev => ({ ...prev, avatarUrl: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      alert('Please fill in required fields.');
      return;
    }

    if (form.roles.length === 0) {
      alert('Please select at least one role.');
      return;
    }

    const base: StaffMember = initialStaff ?? {
      id: `out-${Date.now().toString()}`,
      name: '',
      email: '',
      phone: '',
      roles: [],
      avatarUrl: '',
      isFavorite: false,
      status: 'Active',
      type: StaffType.OUTSOURCE
    };

    const result: StaffMember = {
      ...base,
      name: form.name.trim(),
      englishName: form.englishName.trim() || undefined,
      email: form.email.trim(),
      phone: form.phone.trim() || '-',
      roles: form.roles,
      avatarUrl: form.avatarUrl || base.avatarUrl || '',
      isFavorite: form.isFavorite,
      status: form.status,
      type: StaffType.OUTSOURCE
    };

    onSubmit(result);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile + basic info */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User size={18} className="text-blue-500" />
          Outsource Profile
        </h2>

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <label className="relative w-24 h-24 rounded-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden group self-center md:self-start">
            {form.avatarUrl ? (
              <img
                src={form.avatarUrl}
                alt={form.name || 'Outsource avatar'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400 text-xs">
                <Camera size={22} className="mb-1" />
                <span>Upload</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[11px] text-white transition-opacity">
              Change
            </div>
          </label>

          {/* Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name (TH) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                placeholder="ชื่อ-นามสกุล"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Name (EN)
              </label>
              <input
                type="text"
                value={form.englishName}
                onChange={e =>
                  setForm(prev => ({ ...prev, englishName: e.target.value }))
                }
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
                  placeholder="0x-xxx-xxxx"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role + status */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Roles</h3>
          <div className="flex flex-wrap gap-2">
            {(Object.values(RoleType) as RoleType[]).map(role => {
              const active = form.roles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={
                    'px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition ' +
                    (active
                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50')
                  }
                >
                  {active && <Check size={14} />}
                  <span>{role}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  status: e.target.value as FormState['status']
                }))
              }
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none"
            >
              <option value="Active">Active</option>
              <option value="Offline">Offline</option>
              <option value="Busy">Busy</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setForm(prev => ({ ...prev, isFavorite: !prev.isFavorite }))}
            className={
              'w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border transition ' +
              (form.isFavorite
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100')
            }
          >
            <Star
              size={14}
              className={
                form.isFavorite ? 'fill-amber-400 text-amber-500' : 'text-gray-400'
              }
            />
            <span>
              {form.isFavorite ? 'Marked as favorite' : 'Mark as favorite'}
            </span>
          </button>
        </div>
      </section>

      {/* Footer ปุ่ม */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setForm(buildInitialState(initialStaff))}
          className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-700"
        >
          {isEditMode ? 'Save Changes' : 'Save Outsource'}
        </button>
      </div>
    </form>
  );
};
