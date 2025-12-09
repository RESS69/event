
import React from 'react';
import { Calendar, Clock, MapPin, Building2, FileText, ChevronDown } from 'lucide-react';
import { EventItem, CompanyItem, EventStatus } from '../types';
import { QuickStatCard } from './QuickStatCard';


interface TabOverviewEditProps {
  event: EventItem;
  companies: CompanyItem[];
  onChange: (event: EventItem) => void;
}

export const TabOverviewEdit: React.FC<TabOverviewEditProps> = ({ event, companies, onChange }) => {
  
  const updateField = (field: keyof EventItem, value: any) => {
     onChange({ ...event, [field]: value });
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
     const newCompanyId = e.target.value;
     const company = companies.find(c => c.id === newCompanyId);
     // Update company ID and optionally refresh client contacts from company defaults
     onChange({
        ...event,
        companyId: newCompanyId,
        // Optional: Reset client contacts to company defaults or keep existing if manually edited?
        // For simplicity, we'll fetch fresh contacts from company if available
        clientContacts: company?.contacts || [] 
     });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Quick Stats Row (Editable) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickStatCard icon={Calendar} label="Event Date">
          <input
            type="date"
            value={event.date}
            onChange={e => updateField('date', e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          />
        </QuickStatCard>

        <QuickStatCard icon={Clock} label="Time">
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={event.startTime}
              onChange={e => updateField('startTime', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
            <span className="text-gray-400">-</span>
            <input
              type="time"
              value={event.endTime}
              onChange={e => updateField('endTime', e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>
        </QuickStatCard>

        <QuickStatCard icon={FileText} label="Status">
          <div className="relative">
            <select
              value={event.status}
              onChange={e =>
                updateField('status', e.target.value as EventStatus)
              }
              className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl text-sm px-3 py-2.5 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-8 cursor-pointer outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              size={16}
            />
          </div>
        </QuickStatCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Client Info (Company Selection) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                <Building2 className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">Client Information</h3>
              </div>
              <div className="p-6">
                 <label className="block text-sm font-bold text-gray-700 mb-2">Company</label>
                 <div className="relative">
                    <select
                        value={event.companyId}
                        onChange={handleCompanyChange}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-10 cursor-pointer"
                    >
                        <option value="" disabled>Select a company</option>
                        {companies.map(c => (
                            <option key={c.id} value={c.id}>{c.companyName}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                 </div>
                 
                 {/* Contacts Display (Read-Only Preview in Edit Mode) */}
                 {event.clientContacts.length > 0 && (
                    <div className="mt-6 space-y-3">
                       <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Associated Contacts</p>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {event.clientContacts.map(contact => (
                             <div key={contact.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex flex-col text-sm">
                                <span className="font-bold text-gray-900">{contact.name}</span>
                                <span className="text-xs text-gray-500">{contact.role}</span>
                                <span className="text-xs text-gray-400 mt-1">{contact.email}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}
              </div>
          </div>

          {/* Note / Brief */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-800">Note / Brief</h3>
            </div>
            <div className="p-6">
               <textarea
                  value={event.note || ''}
                  onChange={(e) => updateField('note', e.target.value)}
                  className="w-full h-40 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  placeholder="Enter notes here..."
               />
            </div>
          </div>
        </div>

        {/* Right Column (Location) */}
        <div className="lg:col-span-1 space-y-6">
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
               <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                 <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                   <MapPin className="w-5 h-5 text-red-500" /> Location
                 </h3>
               </div>
               <div className="p-6">
                 <label className="block text-sm font-bold text-gray-700 mb-2">Venue / Address</label>
                 <textarea
                    value={event.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-3 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                    placeholder="Enter location..."
                 />
                 <div className="mt-4 pt-4 border-t border-gray-100">
                   <p className="text-sm text-gray-400 italic">Coordinates can be pasted here directly.</p>
                 </div>
               </div>
             </div>
        </div>
      </div>
    </div>
  );
};