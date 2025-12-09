// src/Components/Sidebar.tsx
import React from 'react';

export type SidebarView =
  | 'dashboard'
  | 'event'
  | 'company'
  | 'staff'
  | 'outsource'
  | 'equipment'
  | 'package';

export interface SidebarProps {
  currentView: SidebarView;
  onNavigate: (view: SidebarView) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const MENU_ITEMS: { id: SidebarView; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'event', label: 'Event' },
  { id: 'company', label: 'Company' },
  { id: 'staff', label: 'Staff' },
  { id: 'outsource', label: 'Outsource' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'package', label: 'Package' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpen = true,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <aside className="hidden h-screen w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white">
          EF
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            EventFlow
          </span>
          <span className="text-xs text-gray-500">Event Management</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 text-sm">
        <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          Event Management
        </div>

        <div className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={[
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50',
                ].join(' ')}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs">
                  {item.label[0]}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* โปรไฟล์ล่าง */}
      <div className="border-t px-4 py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-gray-300" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-900">
              Admin User
            </span>
            <span className="text-[11px] text-gray-500">
              admin@eventflow.com
            </span>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-center text-xs text-gray-500 hover:bg-gray-50"
          >
            Close menu
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
