
import React, { useState } from 'react';
import { 
  Users, 
  CalendarDays, 
  Building2, 
  Wrench, 
  ArrowRight,
  Clock,
  Briefcase
} from 'lucide-react';
import { ViewType, EventItem, StaffMember, CompanyItem, EquipmentItem } from '../types';

interface DashboardProps {
  events: EventItem[];
  staff: StaffMember[];
  companies: CompanyItem[];
  equipment: EquipmentItem[];
  onNavigate: (view: ViewType) => void;
  onEventClick: (event: EventItem) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ events, staff, companies, equipment, onNavigate, onEventClick }) => {
  const [filterDays, setFilterDays] = useState<3 | 7>(7);

  // Calculate Date Range
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight to include today's events
  
  const limitDate = new Date(today);
  limitDate.setDate(today.getDate() + filterDays);
  limitDate.setHours(23, 59, 59, 999); // End of the limit day

  // Get upcoming events that are PENDING within the filter range
  const upcomingPendingEvents = [...events]
    .filter(e => {
      const eventDate = new Date(e.date);
      // Fix date string parsing time zone issue by setting time to midnight if needed, 
      // but assuming YYYY-MM-DD string is parsed as UTC or Local midnight correctly for comparison
      // Ensuring purely date based comparison:
      const d = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      return e.status === 'Pending' && d >= today && d <= limitDate;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const totalPendingEvents = events.filter(e => e.status === 'Pending').length;

  const StatCard = ({ title, value, icon: Icon, colorClass, onClick }: any) => (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="flex items-center text-xs font-medium text-gray-400 min-h-[16px]">
        {/* Subtext removed as requested */}
        <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 p-6 lg:p-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your event operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Events" 
          value={events.length} 
          icon={CalendarDays}
          colorClass="bg-blue-50 text-blue-600"
          onClick={() => onNavigate('event')}
        />
        <StatCard 
          title="Staff Members" 
          value={staff.length} 
          icon={Users}
          colorClass="bg-green-50 text-green-600"
          onClick={() => onNavigate('staff')}
        />
        <StatCard 
          title="Companies" 
          value={companies.length} 
          icon={Building2}
          colorClass="bg-purple-50 text-purple-600"
          onClick={() => onNavigate('company')}
        />
        <StatCard 
          title="Pending Events" 
          value={totalPendingEvents} 
          icon={Clock}
          colorClass="bg-orange-50 text-orange-600"
          onClick={() => onNavigate('event')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upcoming Pending Events */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col max-h-[400px]">
          <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center bg-gray-50/50 gap-4 flex-shrink-0">
            <div className="flex items-center gap-4">
                <h3 className="font-bold text-gray-900">Upcoming Pending</h3>
                <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setFilterDays(3); }}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filterDays === 3 ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                    >
                        3 Days
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setFilterDays(7); }}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filterDays === 7 ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                    >
                        7 Days
                    </button>
                </div>
            </div>
            <button 
              onClick={() => onNavigate('event')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View Calendar
            </button>
          </div>
          <div className="divide-y divide-gray-100 flex-1 overflow-y-auto custom-scrollbar">
            {upcomingPendingEvents.map(event => (
              <div 
                key={event.id} 
                className="p-5 hover:bg-gray-50 transition-colors flex items-center gap-4 group cursor-pointer" 
                onClick={() => onEventClick(event)}
              >
                <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-700 border border-blue-100 group-hover:border-blue-200 group-hover:bg-blue-100 transition-colors">
                  <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">{event.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Clock size={14} /> {event.startTime}</span>
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {events.find(e => e.id === event.id)?.companyId ? companies.find(c => c.id === event.companyId)?.companyName : 'No Company'}</span>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                  {event.status}
                </div>
              </div>
            ))}
            {upcomingPendingEvents.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                No pending events in the next {filterDays} days.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-fit">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate('create-event')}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarDays size={20} />
              </div>
              <div>
                <span className="block font-bold text-gray-900 text-sm">Create New Event</span>
                <span className="block text-xs text-gray-500">Schedule a meeting or event</span>
              </div>
            </button>

            <button 
              onClick={() => onNavigate('create-staff')}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={20} />
              </div>
              <div>
                <span className="block font-bold text-gray-900 text-sm">Add Staff Member</span>
                <span className="block text-xs text-gray-500">Register new internal staff</span>
              </div>
            </button>

            <button 
              onClick={() => onNavigate('create-company')}
              className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 size={20} />
              </div>
              <div>
                <span className="block font-bold text-gray-900 text-sm">Add Company</span>
                <span className="block text-xs text-gray-500">Create new client profile</span>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
