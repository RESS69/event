
import React, { useState } from 'react';
import { 
  ChevronLeft, LayoutDashboard, Folder, MapPin, 
  Phone, Clock, Info, ExternalLink, 
  User, Mail, Building2, MoreHorizontal, Trash2, Star, Edit
} from 'lucide-react';
import { CompanyItem, EventItem, ClientContact } from '../../types';

interface CompanyDetailPageProps {
  company: CompanyItem;
  events: EventItem[];
  onBack: () => void;
  onEventClick?: (event: EventItem) => void;
  onEdit?: (company: CompanyItem) => void;
  onDelete?: (id: string) => void;
}

type TabType = 'overview' | 'projects';

export const CompanyDetailPage: React.FC<CompanyDetailPageProps> = ({ company, events, onBack, onEventClick, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use local state for contacts to allow mock adding, initialize with legacy handling
  const [contactList, setContactList] = useState<ClientContact[]>(() => {
    if (company.contacts && company.contacts.length > 0) {
      return company.contacts;
    }
    // Fallback: Create a primary contact from legacy flat fields
    return [{
      id: `legacy-${company.id}`,
      name: company.contactPerson || 'Unknown Contact',
      role: company.role || 'Contact Person',
      phone: company.phone || '-',
      email: company.email || '-',
      isPrimary: true
    }];
  });

  const handleDeleteContact = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      const newContacts = contactList.filter(c => c.id !== id);
      // If we deleted the primary, assign a new one if available
      if (contactList.find(c => c.id === id)?.isPrimary && newContacts.length > 0) {
        newContacts[0].isPrimary = true;
      }
      setContactList(newContacts);
    }
  };

  const handleSetPrimary = (id: string) => {
    setContactList(prev => prev.map(c => ({
      ...c,
      isPrimary: c.id === id
    })));
  };

  // Identify Primary Contact - Ensure at least one is shown as Primary
  const primaryContact = contactList.find(c => c.isPrimary) || contactList[0];
  
  // Other Contacts
  const otherContacts = contactList.filter(c => c.id !== primaryContact?.id);

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">{company.companyName}</h1>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-sm text-gray-500">{company.industry || 'Technology & Software'}</span>
                   <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                   <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-100">Enterprise Client</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <MoreHorizontal size={20} />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-1">
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        onEdit?.(company);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <Edit size={14} className="text-gray-500" />
                      Edit Company
                    </button>
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        onDelete?.(company.id);
                        onBack();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                      <Trash2 size={14} />
                      Delete Company
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Segmented Tabs */}
          <div className="bg-gray-100 p-1.5 rounded-xl flex">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
                ${activeTab === 'overview' 
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}
              `}
            >
              <LayoutDashboard size={16} />
              Client Overview
            </button>
            <button 
              onClick={() => setActiveTab('projects')}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all
                ${activeTab === 'projects' 
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}
              `}
            >
              <Folder size={16} />
              Projects History
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 lg:p-8">
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
            
            {/* Left Column: Client Information (Company + Contacts) */}
            <div className="lg:col-span-2 space-y-6">
               <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                     <Building2 className="text-blue-600" size={20} />
                     <h3 className="text-base font-bold text-gray-900">Client Information</h3>
                  </div>

                  {/* Company Header inside card */}
                  <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-100">
                     <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold shadow-sm">
                        {company.companyName.charAt(0)}
                     </div>
                     <div>
                        <h2 className="text-2xl font-bold text-gray-900">{company.companyName}</h2>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-sm text-gray-500">{company.industry || 'Technology & Software'}</span>
                           <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                           <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-100">Enterprise Client</span>
                        </div>
                     </div>
                  </div>

                  {/* Contacts Section */}
                  <div>
                     <div className="flex justify-between items-end mb-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Persons ({contactList.length})</h4>
                     </div>

                     <div className="space-y-4">
                        {/* Primary Contact */}
                        {primaryContact && (
                           <div className="relative p-6 rounded-xl border border-blue-200 bg-white shadow-sm overflow-hidden group">
                              <div className="absolute top-0 right-0 flex">
                                 <div className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">
                                    Primary Contact
                                 </div>
                              </div>
                              {/* Primary Contact Actions */}
                              <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteContact(primaryContact.id); }}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-6"
                                    title="Delete Contact"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>

                              <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
                                 <div className="w-20 h-20 rounded-full bg-white border-2 border-blue-100 flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                                    <User size={40} strokeWidth={1.5} />
                                 </div>
                                 <div className="flex-1 text-center sm:text-left w-full">
                                    <h3 className="text-xl font-bold text-gray-900">{primaryContact.name}</h3>
                                    <p className="text-sm font-bold text-blue-600 uppercase mb-4">{primaryContact.role}</p>
                                    
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                                       <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                          <Phone size={16} className="text-blue-500" />
                                          <span className="text-sm font-medium">{primaryContact.phone}</span>
                                       </div>
                                       <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                          <Mail size={16} className="text-blue-500" />
                                          <span className="text-sm font-medium">{primaryContact.email}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* Other Contacts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {otherContacts.map(contact => (
                              <div key={contact.id} className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white relative group">
                                 <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                                       <User size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1 pr-6">
                                       <h5 className="font-bold text-gray-900 truncate">{contact.name}</h5>
                                       <p className="text-xs text-gray-500 font-bold uppercase mb-2 truncate">{contact.role}</p>
                                       <div className="space-y-1">
                                          <div className="flex items-center gap-2 text-xs text-gray-500">
                                             <Phone size={12} /> {contact.phone}
                                          </div>
                                          <div className="flex items-center gap-2 text-xs text-gray-500">
                                             <Mail size={12} /> <span className="truncate">{contact.email}</span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Action Buttons */}
                                 <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                       onClick={() => handleSetPrimary(contact.id)}
                                       className="p-1.5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                                       title="Set as Primary"
                                    >
                                       <Star size={16} />
                                    </button>
                                    <button 
                                       onClick={() => handleDeleteContact(contact.id)}
                                       className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                       title="Delete"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Column: Address & Map Preview */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                 {/* Card Header */}
                 <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2 text-gray-800 font-bold">
                       <MapPin className="text-red-500" size={18} />
                       Location
                    </div>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address || company.companyName)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                    >
                       Open Map
                    </a>
                 </div>

                 {/* Map Preview Area */}
                 <div className="relative h-80 bg-slate-100 group cursor-pointer overflow-hidden border-b border-gray-100">
                    <div className="absolute inset-0 opacity-40" 
                         style={{ 
                           backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
                           backgroundSize: '16px 16px' 
                         }} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative transform transition-transform group-hover:-translate-y-1 duration-300">
                           <div className="w-4 h-4 bg-red-500/30 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2 blur-sm animate-pulse"></div>
                           <MapPin className="w-10 h-10 text-red-600 drop-shadow-md fill-red-600" />
                        </div>
                    </div>
                 </div>

                 {/* Address Details Footer */}
                 <div className="p-5 bg-white">
                    <h4 className="text-base font-bold text-gray-900 mb-1 leading-snug">
                       {company.locationName || company.companyName}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                       {company.address || 'No specific address provided.'}
                    </p>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          /* Projects History Tab */
          <div className="w-full max-w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Project History</h3>
            
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
               <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-500 font-bold uppercase text-xs">
                     <tr>
                        <th className="px-6 py-4">Project Name</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Date</th>
                        <th className="px-6 py-4 text-right w-20">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {events.length > 0 ? events.map(event => (
                        <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                           <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                           <td className="px-6 py-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                 event.status === 'Complete' ? 'bg-green-100 text-green-700' :
                                 event.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                 'bg-red-100 text-red-700'
                              }`}>
                                 {event.status}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right text-gray-600">
                             {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                           </td>
                           <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => onEventClick?.(event)}
                                className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-blue-600 transition-colors"
                                title="View Event Details"
                              >
                                 <ExternalLink size={16} />
                              </button>
                           </td>
                        </tr>
                     )) : (
                        <tr>
                           <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                              No projects found for this company.
                           </td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
