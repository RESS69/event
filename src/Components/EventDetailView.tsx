
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Users, Box, FileText, ChevronLeft, MoreHorizontal, Building2, Edit, Trash2 } from 'lucide-react';
import { TabOverview } from './TabOverview';
import { TabTeam } from './TabTeam';
import { TabEquipment } from './TabEquipment';
import { TabDocuments } from './TabDocuments';
import { EventItem, CompanyItem, EventType, StaffMember } from '../types';

type Tab = 'overview' | 'team' | 'equipment' | 'documents';

interface EventDetailViewProps {
  event: EventItem;
  company?: CompanyItem;
  staffList?: StaffMember[];
  onBack: () => void;
  onEdit?: (event: EventItem) => void;
  initialTab?: Tab;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({ event, company, staffList = [], onBack, onEdit, initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'equipment', label: 'Equipment', icon: Box },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case 'Online': return 'bg-green-100 text-green-800 border-green-200';
      case 'Hybrid': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50 text-gray-900">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          
          {/* Header Row */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-4">
              <button 
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors mt-0.5"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex flex-col">
                 <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl font-bold text-gray-900 leading-tight">{event.title}</h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getEventTypeColor(event.type)}`}>
                       {event.type}
                    </span>
                 </div>
                 
                 <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                   <div className="flex items-center gap-1.5">
                     <Building2 size={14} className="text-gray-400" />
                     <span className="font-medium text-gray-600">{company?.companyName}</span>
                   </div>
                 </div>
              </div>
            </div>

            {/* Right Actions */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full transition-colors ${isMenuOpen ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              >
                <MoreHorizontal size={20} />
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-[60] animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      if (onEdit) onEdit(event);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
                  >
                    <Edit size={16} className="text-gray-400" /> 
                    Edit Event
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors">
                    <Trash2 size={16} className="text-red-400" /> 
                    Delete Event
                  </button>
                </div>
              )}
            </div>
          </div>
        
          {/* Segmented Control Tabs */}
          <div className="bg-gray-100 p-1.5 rounded-xl flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap
                    ${isActive 
                      ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}
                  `}
                >
                  <Icon size={16} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 overflow-y-auto custom-scrollbar">
        {activeTab === 'overview' && <TabOverview event={event} company={company} />}
        {activeTab === 'team' && <TabTeam event={event} staffList={staffList} />}
        {activeTab === 'equipment' && <TabEquipment event={event} />}
        {activeTab === 'documents' && <TabDocuments event={event} />}
      </main>
    </div>
  );
};
