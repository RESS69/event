
import React from 'react';
import { Calendar, Clock, MapPin, Building2, FileText, CheckCircle2, User, Mail, Phone, AlertCircle, Sun, Moon } from 'lucide-react';
import { EventItem, CompanyItem } from '../types';
import { StatusBadge } from './StatusBadge';
import { QuickStatCard } from './QuickStatCard';


interface TabOverviewProps {
  event: EventItem;
  company?: CompanyItem;
}

export const TabOverview: React.FC<TabOverviewProps> = ({ event, company }) => {
  // Determine layout mode: "Online" uses one layout, "Offline" and "Hybrid" use another (with map)
  const isOnlineLayout = event.type === 'Online';

  // Dynamic Status Calculation
  const getEventStatus = () => {
    if (event.status === 'Pending') {
      return { 
        label: 'Pending Staff', 
        type: 'warning' as const, 
        icon: AlertCircle,
        colorClass: 'text-amber-50',
        desc: 'Staff assignment incomplete'
      };
    }

    return { 
      label: 'Ready', 
      type: 'success' as const, 
      icon: CheckCircle2,
      colorClass: 'text-green-50',
      desc: 'All staff assigned & confirmed'
    };
  };

  const status = getEventStatus();
  const StatusIcon = status.icon;

  // Split contacts into Primary and Others
  const primaryContact = event.clientContacts[0];
  const otherContacts = event.clientContacts.slice(1);
  const companyName = company?.companyName || 'Unknown Company';
  const industry = event.industry || 'Corporate';

  // Calculate Period
  const startHour = parseInt(event.startTime.split(':')[0], 10);
  const period = startHour < 12 ? 'Morning' : 'Afternoon';
  const PeriodIcon = period === 'Morning' ? Sun : Moon;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatCard icon={Calendar} label="Event Date">
          <p className="text-2xl font-bold text-gray-900">{event.date}</p>
        </QuickStatCard>

        <QuickStatCard icon={Clock} label="Time">
          <p className="text-2xl font-bold text-gray-900">
            {event.startTime} - {event.endTime}
          </p>
        </QuickStatCard>

        <QuickStatCard icon={PeriodIcon} label="Period">
          <p
            className={
              'text-2xl font-bold ' +
              (period === 'Morning' ? 'text-orange-600' : 'text-indigo-600')
            }
          >
            {period}
          </p>
        </QuickStatCard>

        <QuickStatCard
          icon={StatusIcon}
          label="Status"
          helper={<span>{status.desc}</span>}
          iconClassName={status.colorClass}
        >
          <div className="mt-1">
            <StatusBadge status={status.label} type={status.type} />
          </div>
        </QuickStatCard>
      </div>

      <div className={`grid grid-cols-1 ${!isOnlineLayout ? 'lg:grid-cols-3' : ''} gap-6 items-start`}>
        {/* Left Column - Client Info & Notes */}
        <div className={`${!isOnlineLayout ? 'lg:col-span-2' : 'col-span-1'} space-y-6`}>
          
          {/* Client Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                <Building2 className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">Client Information</h3>
              </div>
              <div className="p-8 space-y-8">
                {/* Company Header */}
                <div className="flex items-start gap-5">
                   <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold flex-shrink-0 shadow-inner">
                      {companyName.charAt(0)}
                   </div>
                   <div>
                      <h2 className="text-2xl font-bold text-gray-900 leading-tight">{companyName}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 font-medium">{industry}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Enterprise Client</span>
                      </div>
                   </div>
                </div>
                
                <div className="border-t border-gray-100"></div>

                {/* Contact List */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Contact Persons ({event.clientContacts.length})</h4>
                  
                  <div className="space-y-4">
                    {/* Primary Contact */}
                    {primaryContact && (
                       <div className="relative p-6 rounded-xl border-2 border-blue-100 bg-blue-50/20 hover:border-blue-300 transition-all shadow-sm">
                          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg uppercase tracking-wider shadow-sm z-10">
                              Primary Contact
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                              <div className="w-16 h-16 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                                <User size={32} />
                              </div>
                              <div className="flex-1 min-w-0 w-full">
                                <div className="pr-24 mb-2">
                                  <p className="text-xl font-bold text-gray-900 truncate" title={primaryContact.name}>{primaryContact.name}</p>
                                  <p className="text-sm text-blue-700 font-bold uppercase tracking-wide">{primaryContact.role}</p>
                                </div>
                                
                                <div className="flex flex-wrap gap-x-8 gap-y-3 mt-3 p-3 bg-white/60 rounded-lg border border-blue-100/50">
                                  <div className="flex items-center gap-2.5 text-gray-700">
                                      <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-blue-500">
                                          <Phone size={14} />
                                      </div>
                                      <span className="font-semibold text-sm">{primaryContact.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2.5 text-gray-700">
                                      <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-blue-500">
                                          <Mail size={14} />
                                      </div>
                                      <span className="font-medium text-sm">{primaryContact.email}</span>
                                  </div>
                                </div>
                              </div>
                          </div>
                       </div>
                    )}

                    {/* Other Contacts Grid */}
                    {otherContacts.length > 0 && (
                      <div className={`grid grid-cols-1 md:grid-cols-2 ${isOnlineLayout ? 'lg:grid-cols-3' : ''} gap-4 pt-2`}>
                        {otherContacts.map((contact) => (
                          <div key={contact.id} className="group p-4 rounded-xl border border-gray-100 bg-gray-50/30 hover:bg-white hover:shadow-md hover:border-gray-200 transition-all duration-200">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm group-hover:text-gray-600 group-hover:border-gray-200 flex-shrink-0">
                                  <User size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-base font-bold text-gray-800 truncate" title={contact.name}>{contact.name}</p>
                                  <p className="text-xs text-gray-500 font-medium truncate uppercase tracking-wide mb-2">{contact.role}</p>
                                  
                                  <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Phone size={14} className="text-gray-400" />
                                        <span className="truncate">{contact.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Mail size={14} className="text-gray-400" />
                                        <span className="truncate">{contact.email}</span>
                                    </div>
                                  </div>
                                </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
           </div>

          {/* Note / Brief */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-800">Note / Brief</h3>
            </div>
            <div className="p-6 bg-white">
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-5 text-gray-800 whitespace-pre-wrap leading-relaxed text-base relative">
                 <div className="absolute top-0 left-0 w-1 h-full bg-amber-300 rounded-l-lg"></div>
                 {event.note || "No additional notes provided."}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3) - Location - Only for Offline/Hybrid */}
        {!isOnlineLayout && (
          <div className="space-y-6 lg:sticky lg:top-28 transition-all">
             {/* Location Map */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
               <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                 <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                   <MapPin className="w-5 h-5 text-red-500" /> Location
                 </h3>
                 <a href="#" className="text-xs bg-white border border-gray-200 px-3 py-1 rounded-full text-gray-600 hover:text-blue-600 hover:border-blue-200 font-medium transition-colors">
                   Open Map
                 </a>
               </div>
               <div className="h-80 bg-gray-100 relative group cursor-pointer overflow-hidden">
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                      <div className="w-full h-full opacity-10 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <span className="flex h-4 w-4 absolute -top-1 -right-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                        </span>
                        <MapPin className="w-10 h-10 text-red-600 drop-shadow-lg relative z-10" fill="currentColor" />
                      </div>
                  </div>
               </div>
               <div className="p-6">
                 <p className="text-base text-gray-800 font-medium leading-relaxed">{event.location}</p>
                 <div className="mt-4 pt-4 border-t border-gray-100">
                   <p className="text-sm text-gray-400 italic">Contact venue for parking info.</p>
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
