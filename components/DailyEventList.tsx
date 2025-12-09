
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Clock, 
  MapPin, 
  Briefcase, 
  AlertCircle, 
  Check, 
  FileText, 
  Users, 
  Box, 
  Search,
  CheckCircle2,
  AlertTriangle,
  StickyNote,
  Download,
  UserPlus,
  Info,
  ArrowLeft,
  Calendar,
  Grid
} from 'lucide-react';
import { EventItem, StaffMember, CompanyItem, PackageItem } from '../types';
import { PACKAGE_DATA } from '../constants';
import { EventDetailView } from './EventDetailView';

interface DailyEventListProps {
  date: Date;
  events: EventItem[];
  staff: StaffMember[];
  companies: CompanyItem[];
  onBack: () => void;
  onDetailViewActive?: (active: boolean) => void;
  onEdit?: (event: EventItem) => void;
}

type SortOption = 'time' | 'name';

// --- Helper Component: Status Badge ---
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Complete: 'bg-green-100 text-green-700 border-green-200',
  };
  const colorClass = styles[status as keyof typeof styles] || styles.Pending;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
      {status === 'Pending' && <Clock size={12} />}
      {status === 'Complete' && <Check size={12} />}
      {status}
    </span>
  );
};

const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M8 14h.01"></path>
    <path d="M16 14h.01"></path>
  </svg>
);

// --- Helper Component: MultiSelect Company Filter ---
const MultiSelectCompany: React.FC<{
  companies: CompanyItem[];
  selected: string[];
  onChange: (selected: string[]) => void;
}> = ({ companies, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = companies.filter(c => c.companyName.toLowerCase().includes(search.toLowerCase()));

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 border rounded-lg shadow-sm transition-all text-sm font-medium ${
          selected.length > 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <BuildingIcon />
        <span>Company</span>
        {selected.length > 0 && (
          <span className="flex items-center justify-center bg-blue-200 text-blue-700 text-[10px] font-bold h-5 min-w-[20px] px-1 rounded-full">
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search company..." 
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
            {filtered.map(comp => (
              <button
                key={comp.id}
                onClick={() => toggle(comp.id)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left group"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                  selected.includes(comp.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400 bg-white'
                }`}>
                  {selected.includes(comp.id) && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm text-gray-700 truncate">{comp.companyName}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Deterministically mock missing staff for pending events
const getPendingIssues = (eventId: string) => {
  const roles = ['Security', 'Coordinator', 'IT Support', 'Host', 'Manager'];
  // Use event id to deterministically pick a role
  const charCode = eventId.charCodeAt(eventId.length - 1) || 0;
  const role = roles[charCode % roles.length];
  const count = (charCode % 2) + 1; // 1 or 2
  return { role, count };
};

// --- Main Component ---
export const DailyEventList: React.FC<DailyEventListProps> = ({ date, events, staff, companies, onBack, onDetailViewActive, onEdit }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('time');
  const [viewInfoEventId, setViewInfoEventId] = useState<string | null>(null);
  const [initialDetailTab, setInitialDetailTab] = useState<'overview' | 'team' | 'equipment' | 'documents'>('overview');

  // Effect to notify parent about detail view state
  useEffect(() => {
    if (onDetailViewActive) {
      onDetailViewActive(!!viewInfoEventId);
    }
    // Cleanup: reset to false if component unmounts while detail is active
    return () => {
      if (onDetailViewActive) onDetailViewActive(false);
    };
  }, [viewInfoEventId, onDetailViewActive]);

  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // 1. Filter events for the selected day
  const processedEvents = useMemo(() => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const targetDateStr = `${year}-${month}-${day}`;

    // Get all events for this date
    return events.filter(e => e.date === targetDateStr);
  }, [events, date]);

  // 2. Filter & Sort for Display
  const filteredEvents = useMemo(() => {
    let result = processedEvents;

    if (selectedCompanyIds.length > 0) {
      result = result.filter(e => selectedCompanyIds.includes(e.companyId));
    }

    return result.sort((a, b) => {
      if (sortOption === 'time') {
        return a.startTime.localeCompare(b.startTime);
      }
      if (sortOption === 'name') {
        return a.title.localeCompare(b.title);
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }, [processedEvents, selectedCompanyIds, sortOption]);

  // --- Render Detail View ---
  if (viewInfoEventId) {
    const selectedEvent = processedEvents.find(e => e.id === viewInfoEventId);
    if (selectedEvent) {
       const company = companies.find(c => c.id === selectedEvent.companyId);
       return (
          <EventDetailView 
             event={selectedEvent} 
             company={company}
             staffList={staff}
             onBack={() => setViewInfoEventId(null)} 
             initialTab={initialDetailTab}
             onEdit={onEdit}
          />
       );
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 p-6 h-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
           {/* Back Button */}
           <button 
             onClick={onBack}
             className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-gray-600"
           >
             <ChevronDown className="rotate-90" size={20} />
           </button>
           <div>
             <h2 className="text-2xl font-bold text-gray-900">{dateStr}</h2>
             <p className="text-sm text-gray-500">{filteredEvents.length} events scheduled</p>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
           {/* Sort */}
           <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
              <span className="text-xs text-gray-500 font-medium uppercase">Sort by:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="text-sm font-medium text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="time">Time (Earliest)</option>
                <option value="name">Name (A-Z)</option>
              </select>
           </div>
           
           {/* Filter */}
           <MultiSelectCompany 
              companies={companies}
              selected={selectedCompanyIds}
              onChange={setSelectedCompanyIds}
           />
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
        {filteredEvents.map((event) => {
          const isExpanded = expandedId === event.id;
          const company = companies.find(c => c.id === event.companyId);
          const pkg = PACKAGE_DATA.find(p => p.id === event.packageId) || PACKAGE_DATA[0];
          const pendingIssue = getPendingIssues(event.id);

          return (
            <div 
              key={event.id} 
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                isExpanded ? 'border-blue-200 shadow-md ring-1 ring-blue-100' : 'border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Card Header (Always Visible) */}
              <div 
                className="p-5 cursor-pointer select-none bg-white relative z-10"
                onClick={() => setExpandedId(isExpanded ? null : event.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon/Indicator */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    event.status === 'Complete' ? 'bg-green-100 text-green-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {event.status === 'Complete' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{event.title}</h3>
                      <StatusBadge status={event.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {event.startTime} - {event.endTime}
                      </span>
                      <span className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-md text-gray-700 font-medium">
                        <Briefcase size={12} />
                        {company?.companyName}
                      </span>
                    </div>
                    
                    {/* Preview Issues for Collapsed View */}
                    {!isExpanded && event.status === 'Pending' && (
                       <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-1 text-xs animate-in fade-in duration-300">
                          <div className="flex items-center gap-2 text-yellow-700 font-bold uppercase tracking-wide">
                             <Clock size={12} strokeWidth={3} />
                             Pending Action
                          </div>
                          <div className="text-gray-600 pl-5">
                             Missing <span className="font-semibold text-gray-900">{pendingIssue.count} {pendingIssue.role}</span> staff members.
                          </div>
                       </div>
                    )}
                  </div>

                  <button 
                    className={`p-2 rounded-full bg-gray-50 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-blue-50 text-blue-600' : ''}`}
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 pb-8 pt-2 bg-gray-50/50 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                   
                   {/* Action Buttons */}
                   <div className="flex justify-end mb-6">
                      <button 
                        onClick={() => {
                           setInitialDetailTab('overview');
                           setViewInfoEventId(event.id);
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                      >
                        <Info size={14} />
                        View Full Details
                      </button>
                   </div>

                   {/* Action Required Section (if Pending) */}
                   {event.status === 'Pending' && (
                     <div className="mb-6 rounded-xl border border-yellow-200 bg-white shadow-sm overflow-hidden">
                        <div className="bg-yellow-50 px-4 py-3 border-b border-yellow-100 flex items-center gap-2">
                           <AlertCircle size={18} className="text-yellow-600" />
                           <h4 className="font-bold text-yellow-800 text-sm">Action Required</h4>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                           <p className="text-sm text-gray-700">
                              <span className="font-bold text-yellow-600">[Staff Incomplete]</span> Missing {pendingIssue.count} staff members for {pendingIssue.role} role.
                           </p>
                           <button 
                              onClick={() => {
                                 setInitialDetailTab('team');
                                 setViewInfoEventId(event.id);
                              }}
                              className="text-xs font-medium text-blue-600 hover:underline bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                           >
                              <UserPlus size={14} />
                              Assign Staff
                           </button>
                        </div>
                     </div>
                   )}

                   {/* Main Grid Layout */}
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Card 1: General Information */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-full">
                         <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                            <FileText size={16} className="text-blue-600" /> General Information
                         </h4>
                         <div className="space-y-4">
                            <div>
                               <p className="text-xs text-gray-400 mb-1 font-medium">Event Name</p>
                               <p className="text-sm font-bold text-gray-900">{event.title}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <p className="text-xs text-gray-400 mb-1 font-medium">Company</p>
                                  <div className="flex items-center gap-1.5">
                                     <Briefcase size={14} className="text-gray-400" />
                                     <span className="text-sm font-medium text-gray-900 truncate">{company?.companyName}</span>
                                  </div>
                               </div>
                               <div>
                                  <p className="text-xs text-gray-400 mb-1 font-medium">Event Type</p>
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                     {event.type} Event
                                  </span>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Card 2: Schedule & Location */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 h-full">
                         <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                            <Calendar size={16} className="text-green-600" /> Schedule & Location
                         </h4>
                         <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <p className="text-xs text-gray-400 mb-1 font-medium">Date</p>
                                  <div className="flex items-center gap-1.5">
                                     <Calendar size={14} className="text-gray-400" />
                                     <span className="text-sm font-medium text-gray-900">{dateStr}</span>
                                  </div>
                               </div>
                               <div>
                                  <p className="text-xs text-gray-400 mb-1 font-medium">Time</p>
                                  <div className="flex items-center gap-1.5">
                                     <Clock size={14} className="text-gray-400" />
                                     <span className="text-sm font-medium text-gray-900">{event.startTime} - {event.endTime}</span>
                                  </div>
                               </div>
                            </div>
                            <div>
                               <p className="text-xs text-gray-400 mb-1 font-medium">Location</p>
                               <div className="flex items-start gap-1.5">
                                  <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                                  <span className="text-sm font-medium text-gray-900">{event.location}</span>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Card 3: Equipment */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col h-full">
                         <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                            <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                               <Box size={16} className="text-orange-500" /> Equipment Package
                            </h4>
                            <span className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded font-bold">
                               {pkg.name}
                            </span>
                         </div>
                         <div className="flex-1">
                            <ul className="space-y-2">
                               {pkg.items.slice(0, 4).map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                     <Check size={12} className="text-green-500 mt-0.5 shrink-0" />
                                     <span>{item}</span>
                                  </li>
                               ))}
                               {pkg.items.length > 4 && (
                                  <li className="text-xs text-gray-400 italic pl-5 pt-1">
                                     + {pkg.items.length - 4} more items
                                  </li>
                               )}
                            </ul>
                         </div>
                      </div>

                      {/* Card 4: Documents */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col h-full">
                         <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                            <FileText size={16} className="text-purple-600" /> Documents
                         </h4>
                         <div className="flex-1">
                            {event.documents.length > 0 ? (
                               <div className="space-y-2">
                                  {event.documents.slice(0, 3).map((doc, idx) => (
                                     <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 hover:bg-blue-50 transition-colors group">
                                        <div className="flex items-center gap-2 min-w-0">
                                           <div className="w-6 h-6 rounded bg-white border border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500 uppercase">
                                              {doc.type}
                                           </div>
                                           <span className="text-xs font-medium text-gray-700 truncate">{doc.name}</span>
                                        </div>
                                        <button className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                           <Download size={14} />
                                        </button>
                                     </div>
                                  ))}
                               </div>
                            ) : (
                               <div className="flex flex-col items-center justify-center h-full text-gray-400 py-4">
                                  <FileText size={24} className="opacity-20 mb-1" />
                                  <span className="text-xs">No documents</span>
                               </div>
                            )}
                         </div>
                      </div>

                      {/* Card 5: Notes - Full Width */}
                      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                         <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                            <StickyNote size={16} className="text-gray-600" /> Notes & Brief
                         </h4>
                         <div className="bg-yellow-50/50 rounded-lg p-4 border border-yellow-100">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                               {event.description || "No additional notes provided."}
                            </p>
                         </div>
                      </div>

                   </div>
                </div>
              )}
            </div>
          );
        })}
        
        {filteredEvents.length === 0 && (
           <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <Clock size={32} className="opacity-50" />
              </div>
              <p className="text-lg font-medium text-gray-500">No events found for this day.</p>
           </div>
        )}
      </div>
    </div>
  );
};
