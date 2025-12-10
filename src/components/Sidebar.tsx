import {
  Briefcase,
  Building2,
  CalendarDays,
  LayoutDashboard,
  Package,
  Users,
  Wrench,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";

export type SidebarView =
  | "dashboard"
  | "event"
  | "company"
  | "staff"
  | "outsource"
  | "equipment"
  | "package";

export interface SidebarProps {
  currentView: SidebarView;
  onNavigate: (view: SidebarView) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

// const MENU_ITEMS: { id: SidebarView; label: string }[] = [
//   { id: "dashboard", label: "Dashboard" },
//   { id: "event", label: "Event" },
//   { id: "company", label: "Company" },
//   { id: "staff", label: "Staff" },
//   { id: "outsource", label: "Outsource" },
//   { id: "equipment", label: "Equipment" },
//   { id: "package", label: "Package" },
// ];

export const Sidebar = () => {
  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 min-h-22 border-b px-6 py-6 border-gray-200">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white">
          EF
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">EventFlow</span>
          <span className="text-xs text-gray-500">Event Management</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm">
        <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
          Event Management
        </div>

        <SidebarItem to="/" label="Dashboard" icon={LayoutDashboard} />
        <SidebarItem to="/event" label="Event" icon={CalendarDays} />
        <SidebarItem to="/company" label="Company" icon={Building2} />
        <SidebarItem to="/staff" label="Staff" icon={Users} />
        <SidebarItem to="/outsource" label="Outsource" icon={Briefcase} />
        <SidebarItem to="/equipment" label="Equipment" icon={Wrench} />
        <SidebarItem to="/package" label="Package" icon={Package} />
      </nav>

      {/* โปรไฟล์ล่าง */}
      <div className="border-t border-gray-200 px-4 py-4">
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

        {/* {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-center text-xs text-gray-500 hover:bg-gray-50"
          >
            Close menu
          </button>
        )} */}
      </div>
    </aside>
  );
};

export default Sidebar;
