
import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Building2, 
  Users, 
  Briefcase, 
  Wrench, 
  Package
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

interface NavItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, active = false, onClick }: NavItemProps) => (
  <button 
    onClick={onClick}
    className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-blue-50 text-blue-600 font-medium shadow-sm' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <Icon size={20} className={active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
    <span className="text-sm">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, currentView, onNavigate }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 z-30 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
            EF
          </div>
          <span className="text-lg font-bold text-gray-800 tracking-tight">EventFlow</span>
        </div>

        <div className="flex-1 py-6 px-4 overflow-y-auto custom-scrollbar space-y-8">
          
          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Event Management</h3>
            <div className="space-y-1">
              <NavItem 
                icon={LayoutDashboard} 
                label="Dashboard"
                active={currentView === 'dashboard'}
                onClick={() => onNavigate('dashboard')}
              />
              <NavItem 
                icon={CalendarDays} 
                label="Event" 
                active={currentView === 'event'}
                onClick={() => onNavigate('event')}
              />
              <NavItem 
                icon={Building2} 
                label="Company" 
                active={currentView === 'company'}
                onClick={() => onNavigate('company')}
              />
              
              <NavItem 
                icon={Users} 
                label="Staff" 
                active={currentView === 'staff'}
                onClick={() => onNavigate('staff')}
              />
              
              <NavItem 
                icon={Briefcase} 
                label="Outsource" 
                active={currentView === 'outsource'}
                onClick={() => onNavigate('outsource')}
              />
              
              <NavItem 
                icon={Wrench} 
                label="Equipment" 
                active={currentView === 'equipment'}
                onClick={() => onNavigate('equipment')}
              />
              <NavItem 
                icon={Package} 
                label="Package" 
                active={currentView === 'package'}
                onClick={() => onNavigate('package')}
              />
            </div>
          </div>

          {/* Settings section removed as per request */}
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <img src="https://picsum.photos/100/100?random=99" alt="Admin" className="w-9 h-9 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@eventflow.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
