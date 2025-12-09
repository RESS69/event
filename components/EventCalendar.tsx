
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Users, 
  Building2, 
  Calendar as CalendarIcon, 
  Check,
  ChevronDown,
  X,
  LayoutList,
  Clock,
  MapPin,
  Info
} from 'lucide-react';
import { EventItem, StaffMember, CompanyItem } from '../types';
import { DailyEventList } from './DailyEventList';

interface EventCalendarProps {
  events: EventItem[];
  staff: StaffMember[];
  companies: CompanyItem[];
  onDetailViewActive?: (active: boolean) => void;
  onEdit?: (event: EventItem) => void;
}

interface FilterDropdownProps {
  label: string;
  icon: React.ReactNode;
  options: { id: string; label: string; subLabel?: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
  align?: 'left' | 'right';
}

// Mock Available Staff Data for the Popover
const MOCK_AVAILABLE_STAFF = [
  { name: 'Sarah Jenkins', role: 'Host' },
  { name: 'Michael Chen', role: 'IT Support' },
  { name: 'Emily Davis', role: 'Coordinator' },
  { name: 'David Wilson', role: 'Security' },
  { name: 'Jessica Wong', role: 'Manager' }
];

const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  label, 
  icon, 
  options, 
  selected, 
  onChange,
  multiSelect = true,
  align = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase()) || 
    (opt.subLabel && opt.subLabel.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleOption = (id: string) => {
    if (multiSelect) {
      onChange(
        selected.includes(id) 
          ? selected.filter(s => s !== id) 
          : [...selected, id]
      );
    } else {
      onChange(selected.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 border rounded-lg shadow-sm transition-all text-sm font-medium whitespace-nowrap ${
          selected.length > 0 
            ? 'bg-blue-50 border-blue-200 text-blue-700' 
            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
        }`}
      >
        {icon}
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="flex items-center justify-center bg-blue-200 text-blue-700 text-[10px] font-bold h-5 min-w-[20px] px-1 rounded-full">
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${align === 'right' ? 'right-0' : 'left-0'}`}>
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
            {filteredOptions.map(opt => (
              <button
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className="w-full flex items-start gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left group"
              >
                <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                  selected.includes(opt.id) 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border-gray-300 group-hover:border-blue-400 bg-white'
                }`}>
                  {selected.includes(opt.id) && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-gray-700 truncate">{opt.label}</div>
                  {opt.subLabel && <div className="text-xs text-gray-400 truncate">{opt.subLabel}</div>}
                </div>
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">No items found</div>
            )}
          </div>

          {selected.length > 0 && (
            <div className="p-2 bg-gray-50 border-t border-gray-100">
               <button 
                  onClick={() => onChange([])}
                  className="w-full py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1"
               >
                  <X size={14} />
                  Clear Selection
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const EventCalendar: React.FC<EventCalendarProps> = ({ events, staff, companies, onDetailViewActive, onEdit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'daily'>('calendar');
  const [calendarScope, setCalendarScope] = useState<'month' | 'year'>('month');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Info Popover State
  const [activeInfoDate, setActiveInfoDate] = useState<string | null>(null);
  const infoPopoverRef = useRef<HTMLDivElement>(null);

  // Filters State
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Handle clicking outside info popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoPopoverRef.current && !infoPopoverRef.current.contains(event.target as Node)) {
        setActiveInfoDate(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation
  const handlePrev = () => {
    if (calendarScope === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
    }
  };
  
  const handleNext = () => {
    if (calendarScope === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
    }
  };

  // Data Processing
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search Term
      if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Staff Filter
      if (selectedStaff.length > 0 && !event.staffIds.some(id => selectedStaff.includes(id))) {
        return false;
      }
      // Company Filter
      if (selectedCompanies.length > 0 && !selectedCompanies.includes(event.companyId)) {
        return false;
      }
      // Type Filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(event.type)) {
        return false;
      }
      // Status Filter
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(event.status)) {
        return false;
      }
      return true;
    });
  }, [events, searchTerm, selectedStaff, selectedCompanies, selectedTypes, selectedStatuses]);

  const currentMonthEventsCount = useMemo(() => {
    return filteredEvents.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    }).length;
  }, [filteredEvents, currentDate]);

  // Month View Grid Generation
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDayOfWeek);

    const endDayOfWeek = lastDayOfMonth.getDay(); // 0-6
    const daysToAdd = 6 - endDayOfWeek;
    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + daysToAdd);

    const days = [];
    let current = new Date(startDate);

    while (current <= endDate) {
       days.push({
          date: new Date(current),
          isCurrentMonth: current.getMonth() === month
       });
       current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [currentDate]);

  const getEventsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    return filteredEvents
      .filter(e => e.date === dateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'bg-green-500';
      default: return 'bg-yellow-400'; // Incomplete/Pending
    }
  };

  // Helper to get background and border style for event card in calendar
  const getEventStyle = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-50 border-green-200 hover:border-green-400';
      case 'Pending':
        return 'bg-yellow-50 border-yellow-200 hover:border-yellow-400';
      default:
        return 'bg-blue-50 border-blue-100 hover:border-blue-300';
    }
  };

  const getEventTextStyle = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'text-green-700';
      case 'Pending':
        return 'text-yellow-800';
      default:
        return 'text-blue-700';
    }
  };

  // Dropdown Options
  const staffOptions = staff.map(s => ({ id: s.id, label: s.name, subLabel: s.roles[0] }));
  const companyOptions = companies.map(c => ({ id: c.id, label: c.companyName }));
  const typeOptions = [
    { id: 'Online', label: 'Online' },
    { id: 'Hybrid', label: 'Hybrid' },
    { id: 'Offline', label: 'Offline' }
  ];
  const statusOptions = [
    { id: 'Complete', label: 'Complete' },
    { id: 'Pending', label: 'Pending' }
  ];

  if (view === 'daily') {
    return (
      <DailyEventList 
         date={currentDate} 
         events={events} // Pass all events to calculate conflicts
         staff={staff}
         companies={companies}
         onBack={() => setView('calendar')}
         onDetailViewActive={onDetailViewActive}
         onEdit={onEdit}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 relative">
      {/* Controls & Filters */}
      <div className="p-6 pb-2 space-y-4">
        {/* Top Row: View Toggle & Legend */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
            <button 
              onClick={() => setView('calendar')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-900 text-white shadow-sm"
            >
              Calendar View
            </button>
            <button 
              onClick={() => setView('daily')}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-gray-600 hover:bg-gray-50"
            >
              Daily View
            </button>
          </div>

          {/* Legend */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
             <div className="flex items-center gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
               <span>Pending</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
               <span>Complete</span>
             </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
          {/* Search */}
          <div className="relative flex-1 w-full lg:w-auto min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search events..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="h-6 w-px bg-gray-200 hidden lg:block mx-1"></div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto pb-1 lg:pb-0">
             <FilterDropdown 
                label="Staff" 
                icon={<Users size={14} />} 
                options={staffOptions} 
                selected={selectedStaff} 
                onChange={setSelectedStaff} 
             />
             <FilterDropdown 
                label="Company" 
                icon={<Building2 size={14} />} 
                options={companyOptions} 
                selected={selectedCompanies} 
                onChange={setSelectedCompanies} 
             />
             <FilterDropdown 
                label="Event Type" 
                icon={<CalendarIcon size={14} />} 
                options={typeOptions} 
                selected={selectedTypes} 
                onChange={setSelectedTypes}
                align="right"
             />
             <FilterDropdown 
                label="Status" 
                icon={<Check size={14} />} 
                options={statusOptions} 
                selected={selectedStatuses} 
                onChange={setSelectedStatuses}
                align="right"
             />
          </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
          
          {/* Calendar Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                <button onClick={handlePrev} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={handleNext} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600">
                  <ChevronRight size={18} />
                </button>
              </div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {calendarScope === 'month' 
                  ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                  : `${currentDate.getFullYear()}`
                }
                {calendarScope === 'month' && (
                   <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                     {currentMonthEventsCount} Events
                  </span>
                )}
              </h2>
            </div>
            
            {/* View Mode Toggle: Month / Year */}
            <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
               <button 
                 onClick={() => setCalendarScope('month')}
                 className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                   calendarScope === 'month' 
                     ? 'bg-gray-900 text-white shadow-sm' 
                     : 'text-gray-600 hover:bg-gray-50'
                 }`}
               >
                 Month
               </button>
               <button 
                 onClick={() => setCalendarScope('year')}
                 className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                   calendarScope === 'year' 
                     ? 'bg-gray-900 text-white shadow-sm' 
                     : 'text-gray-600 hover:bg-gray-50'
                 }`}
               >
                 Year
               </button>
            </div>
          </div>

          {/* Month View Content */}
          {calendarScope === 'month' && (
            <>
              {/* Days Header */}
              <div className="grid grid-cols-7 border-b border-gray-100">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto">
                {monthDays.map((day, index) => {
                  const dayEvents = getEventsForDate(day.date);
                  const isToday = new Date().toDateString() === day.date.toDateString();
                  const isSelectedMonth = day.isCurrentMonth;
                  const hiddenCount = dayEvents.length > 2 ? dayEvents.length - 2 : 0;
                  const dateKey = day.date.toDateString();
                  const isActive = activeInfoDate === dateKey;
                  
                  // Calculate pending count
                  const pendingCount = dayEvents.filter(e => e.status === 'Pending').length;

                  // Determine row position for popover direction
                  const rowIndex = Math.floor(index / 7);
                  const isBottomRow = rowIndex >= 3;

                  return (
                    <div 
                      key={index} 
                      className={`min-h-[120px] p-2 border-b border-r border-gray-100 relative flex flex-col gap-1 transition-colors ${
                        isSelectedMonth ? 'bg-white' : 'bg-gray-50/50'
                      } hover:bg-gray-50 ${isToday ? 'ring-2 ring-blue-600 z-10 ring-inset' : ''}`}
                    >
                      {/* Date Number */}
                      <div className="flex justify-between items-center mb-2 relative">
                        <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                          isToday 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                            : isSelectedMonth ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {day.date.getDate()}
                        </span>
                        
                        {/* Info Icon & Popover */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveInfoDate(isActive ? null : dateKey);
                            }}
                            className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out ${
                                isActive 
                                  ? 'bg-blue-100 text-blue-600 rotate-180' 
                                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                          >
                            {isActive ? <X size={14} strokeWidth={2.5} /> : <Info size={14} />}
                          </button>

                          {isActive && (
                            <div 
                              ref={infoPopoverRef}
                              className={`absolute right-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-[100] animate-in fade-in zoom-in-95 duration-200 overflow-hidden ${
                                isBottomRow 
                                  ? 'bottom-full mb-2 origin-bottom-right' 
                                  : 'top-full mt-2 origin-top-right'
                              }`}
                            >
                              <div className="p-3 bg-blue-50/50 border-b border-blue-100 flex justify-between items-center">
                                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide flex items-center gap-1.5">
                                  <Users size={12} className="text-blue-700" />
                                  Available Staff
                                </h4>
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{MOCK_AVAILABLE_STAFF.length}</span>
                              </div>
                              <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                                {MOCK_AVAILABLE_STAFF.map((staff, i) => (
                                  <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-gray-200">
                                      {staff.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-gray-900 truncate">{staff.name}</p>
                                      <p className="text-[10px] text-gray-500 truncate">{staff.role}</p>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Event Bars */}
                      <div className="flex-1 flex flex-col gap-1 mb-6">
                        {dayEvents.slice(0, 2).map(event => (
                          <div 
                            key={event.id} 
                            className={`group relative flex items-start gap-1.5 pl-1.5 pr-2 py-1.5 rounded-md border cursor-pointer transition-all hover:shadow-sm ${getEventStyle(event.status)}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentDate(day.date);
                              setView('daily');
                            }}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(event.status)} shrink-0 mt-1`} />
                            <div className="min-w-0 flex-1">
                              <p className={`text-[10px] font-bold truncate leading-tight mb-0.5 ${getEventTextStyle(event.status)}`}>
                                {event.startTime} - {event.endTime}
                              </p>
                              <p className="text-[10px] font-medium text-gray-700 truncate leading-tight">{event.title}</p>
                            </div>
                          </div>
                        ))}
                        {hiddenCount > 0 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentDate(day.date);
                              setView('daily');
                            }}
                            className="text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 w-full text-left px-1 py-0.5 rounded transition-colors"
                          >
                            + {hiddenCount} more
                          </button>
                        )}
                      </div>

                      {/* Pending Badge - Bottom Right */}
                      {pendingCount > 0 && (
                        <div className="absolute bottom-2 right-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm">
                            {pendingCount} Pending
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Year View Content */}
          {calendarScope === 'year' && (
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 12 }).map((_, monthIndex) => {
                     const year = currentDate.getFullYear();
                     const firstDayOfMonth = new Date(year, monthIndex, 1);
                     const monthName = months[monthIndex];
                     
                     // Determine start day of week (0=Sun)
                     const startDay = firstDayOfMonth.getDay();
                     
                     // Days in current month
                     const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
                     
                     // Days in previous month (for padding)
                     const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();
                     
                     const daysArray = [];
                     
                     // 1. Previous Month Padding
                     for (let i = startDay - 1; i >= 0; i--) {
                        daysArray.push({ 
                          day: daysInPrevMonth - i, 
                          isCurrent: false,
                          fullDate: new Date(year, monthIndex - 1, daysInPrevMonth - i)
                        });
                     }
                     
                     // 2. Current Month Days
                     for (let i = 1; i <= daysInMonth; i++) {
                        daysArray.push({ 
                          day: i, 
                          isCurrent: true,
                          fullDate: new Date(year, monthIndex, i)
                        });
                     }
                     
                     // 3. Next Month Padding (Fill remaining slots to complete the last week)
                     const remainingSlots = 7 - (daysArray.length % 7);
                     if (remainingSlots < 7) {
                        for (let i = 1; i <= remainingSlots; i++) {
                           daysArray.push({ 
                             day: i, 
                             isCurrent: false,
                             fullDate: new Date(year, monthIndex + 1, i)
                           });
                        }
                     }

                     return (
                        <div key={monthName} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white flex flex-col h-full">
                           <h3 
                             className="text-sm font-bold text-gray-900 mb-3 text-center cursor-pointer hover:text-blue-600 transition-colors"
                             onClick={() => {
                               setCurrentDate(new Date(year, monthIndex, 1));
                               setCalendarScope('month');
                               window.scrollTo(0, 0);
                             }}
                           >
                             {monthName}
                           </h3>
                           <div className="grid grid-cols-7 gap-1 mb-2">
                              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                                 <div key={d} className="text-[10px] font-semibold text-gray-400 text-center">{d}</div>
                              ))}
                           </div>
                           <div className="grid grid-cols-7 gap-y-2 gap-x-1 flex-1 content-between">
                              {daysArray.map((d, idx) => {
                                 const isToday = new Date().toDateString() === d.fullDate.toDateString();
                                 
                                 // Find events for this day
                                 let dots: string[] = [];
                                 
                                 // Calculate correct string for comparison
                                 const dayYear = d.fullDate.getFullYear();
                                 const dayMonth = String(d.fullDate.getMonth() + 1).padStart(2, '0');
                                 const dayDate = String(d.fullDate.getDate()).padStart(2, '0');
                                 const currentDayStr = `${dayYear}-${dayMonth}-${dayDate}`;

                                 const dayEvents = filteredEvents.filter(e => e.date === currentDayStr);
                                    
                                 // Collect status colors (limit to 3 dots)
                                 dayEvents.forEach(e => {
                                    if (dots.length < 3) {
                                       let color = 'bg-yellow-400';
                                       if (e.status === 'Complete') color = 'bg-green-500';
                                       dots.push(color);
                                    }
                                 });

                                 return (
                                    <div 
                                      key={idx} 
                                      className="flex flex-col items-center h-8 cursor-pointer hover:bg-blue-50 rounded-md transition-colors"
                                      onClick={() => {
                                        setCurrentDate(d.fullDate);
                                        setView('daily');
                                      }}
                                    >
                                       <span className={`text-xs font-medium ${
                                          isToday
                                            ? 'text-blue-600 font-bold' 
                                            : d.isCurrent ? 'text-gray-700' : 'text-gray-300'
                                       }`}>
                                         {d.day}
                                       </span>
                                       <div className="flex gap-0.5 mt-0.5 h-1.5">
                                          {dots.map((color, i) => (
                                             <div key={i} className={`w-1 h-1 rounded-full ${color}`} />
                                          ))}
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
