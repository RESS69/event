import React, { useEffect, useRef, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Check,
  Search,
  ChevronDown
} from 'lucide-react';
import { StaffMember, RoleType, StaffType } from '../types';

interface StaffFormProps {
  initialStaff?: StaffMember;
  onSubmit: (staff: StaffMember) => void;
}

export const StaffForm: React.FC<StaffFormProps> = ({ initialStaff, onSubmit }) => {
  const [formData, setFormData] = useState(() => ({
    name: initialStaff?.name ?? '',
    email: initialStaff?.email ?? '',
    phone: initialStaff?.phone ?? '',
    roles: (initialStaff?.roles ?? []) as RoleType[],
    username:
      initialStaff?.username ??
      (initialStaff?.email
        ? initialStaff.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
        : ''),
    password: initialStaff?.password ?? ''
  }));

  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const roleDropdownRef = useRef<HTMLDivElement | null>(null);

  // ปิด dropdown เมื่อคลิกรอบนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // auto-generate username จาก email (เฉพาะตอนสร้าง)
  useEffect(() => {
    if (initialStaff) return; // edit mode ไม่ไปทับของเดิม

    if (!formData.email) {
      setFormData(prev => ({ ...prev, username: '' }));
      return;
    }
    const prefix = formData.email.split('@')[0];
    setFormData(prev => ({
      ...prev,
      username: prefix.toLowerCase().replace(/[^a-z0-9]/g, '')
    }));
  }, [formData.email, initialStaff]);

  const generatePassword = () => {
    const chars =
      'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 12; i += 1) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: pass }));
  };

  const handleCopyCredentials = () => {
    const text = `Username: ${formData.username}\nPassword: ${formData.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleRole = (role: RoleType) => {
    setFormData(prev => {
      const exists = prev.roles.includes(role);
      return {
        ...prev,
        roles: exists ? prev.roles.filter(r => r !== role) : [...prev.roles, role]
      };
    });
  };

  const filteredRoles = (Object.values(RoleType) as RoleType[]).filter(r =>
    r.toLowerCase().includes(roleSearchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert('Please fill in required fields.');
      return;
    }

    if (formData.roles.length === 0) {
      alert('Please select at least one role.');
      return;
    }

    const base: StaffMember = initialStaff ?? {
      id: Date.now().toString(),
      name: '',
      email: '',
      phone: '',
      roles: [],
      avatarUrl: '',
      isFavorite: false,
      status: 'Active',
      type: StaffType.INTERNAL
    };

    const result: StaffMember = {
      ...base,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      roles: formData.roles,
      username: formData.username,
      password: formData.password,
      type: StaffType.INTERNAL
    };

    onSubmit(result);
  };

  const isEditMode = Boolean(initialStaff);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Grid บน: Basic info + Credentials */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ซ้าย: ข้อมูลพื้นฐาน */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User size={18} className="text-blue-500" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                  placeholder="e.g. Somchai Jai-dee"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
                  placeholder="0x-xxx-xxxx"
                />
              </div>
            </div>

            {/* Roles */}
            <div className="relative" ref={roleDropdownRef}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Roles <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(o => !o)}
                className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm flex flex-wrap gap-2 min-h-[50px] items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-wrap gap-2">
                  {formData.roles.length === 0 && (
                    <span className="text-gray-400 font-medium">
                      Select roles...
                    </span>
                  )}
                  {formData.roles.map(role => (
                    <span
                      key={role}
                      className="bg-white text-gray-700 px-2.5 py-0.5 rounded-lg text-xs font-medium shadow-sm border border-gray-200"
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <ChevronDown
                  size={18}
                  className={`text-gray-400 transition-transform duration-200 ${
                    isRoleDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="Search roles..."
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 outline-none"
                        value={roleSearchTerm}
                        onChange={e => setRoleSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="max-h-56 overflow-y-auto custom-scrollbar">
                    {filteredRoles.map(role => {
                      const active = formData.roles.includes(role);
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => toggleRole(role)}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50"
                        >
                          <span className="flex items-center gap-2">
                            <Shield
                              size={16}
                              className={active ? 'text-blue-500' : 'text-gray-400'}
                            />
                            <span className="text-gray-800">{role}</span>
                          </span>
                          {active && <Check size={16} className="text-blue-500" />}
                        </button>
                      );
                    })}
                    {filteredRoles.length === 0 && (
                      <p className="text-center text-gray-400 text-sm py-3">
                        No roles found
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ขวา: Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <LockIcon />
            Login Credentials
          </h2>

          <p className="text-xs text-gray-500 leading-relaxed">
            System automatically generates a secure username and password. You can
            regenerate the password or copy credentials to share with staff.
          </p>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.username}
                onChange={e =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full pr-10 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:border-blue-500 outline-none"
                placeholder="auto-generated"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pr-24 pl-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:border-blue-500 outline-none"
                placeholder={isEditMode ? '********' : 'Click generate'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={generatePassword}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700"
            >
              <RefreshCw size={14} />
              Generate Strong Password
            </button>

            <button
              type="button"
              onClick={handleCopyCredentials}
              disabled={!formData.username || !formData.password}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl border border-blue-500 text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Credentials'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer ปุ่ม */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() =>
            setFormData({
              name: initialStaff?.name ?? '',
              email: initialStaff?.email ?? '',
              phone: initialStaff?.phone ?? '',
              roles: (initialStaff?.roles ?? []) as RoleType[],
              username:
                initialStaff?.username ??
                (initialStaff?.email
                  ? initialStaff.email
                      .split('@')[0]
                      .toLowerCase()
                      .replace(/[^a-z0-9]/g, '')
                  : ''),
              password: initialStaff?.password ?? ''
            })
          }
          className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Reset
        </button>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-700"
        >
          {isEditMode ? 'Save Changes' : 'Save Staff'}
        </button>
      </div>
    </form>
  );
};

const LockIcon: React.FC = () => (
  <div className="w-7 h-7 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
    <Shield size={16} />
  </div>
);
