
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { StaffTable } from './components/StaffTable';
import { EquipmentTable } from './components/EquipmentTable';
import { PackageView } from './components/PackageView';
import { CompanyList } from './components/CompanyList';
import { CompanyDetailPage } from './components/CompanyDetailPage';
import { EventCalendar } from './components/EventCalendar';
import { EventDetailView } from './components/EventDetailView';
import { CreateEventPage } from './components/CreateEventPage';
import { EditEventPage } from './components/EditEventPage';
import { CreateCompanyPage } from './components/CreateCompanyPage';
import { EditCompanyPage } from './components/EditCompanyPage';
import { CreateStaffPage } from './components/CreateStaffPage'; 
import { EditStaffPage } from './components/EditStaffPage';
import { CreateOutsourcePage } from './components/CreateOutsourcePage';
import { EditOutsourcePage } from './components/EditOutsourcePage';
import { CreateEquipmentPage } from './components/CreateEquipmentPage';
import { EditEquipmentPage } from './components/EditEquipmentPage';
import { CreatePackagePage } from './components/CreatePackagePage';
import { EditPackagePage } from './components/EditPackagePage';
import { STAFF_DATA, OUTSOURCE_DATA, EQUIPMENT_DATA, PACKAGE_DATA, COMPANY_DATA, EVENT_DATA } from './constants';
import { Menu, Plus } from 'lucide-react';
import { ViewType, EventItem, CompanyItem, StaffMember, EquipmentItem, PackageItem } from './types';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  
  // Navigation History State
  const [previousView, setPreviousView] = useState<ViewType>('dashboard');

  // Lifted State
  const [events, setEvents] = useState<EventItem[]>(EVENT_DATA);
  const [companies, setCompanies] = useState<CompanyItem[]>(COMPANY_DATA);
  const [staffList, setStaffList] = useState<StaffMember[]>(STAFF_DATA); 
  const [outsourceList, setOutsourceList] = useState<StaffMember[]>(OUTSOURCE_DATA);
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(EQUIPMENT_DATA);
  const [packages, setPackages] = useState<PackageItem[]>(PACKAGE_DATA);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedOutsourceId, setSelectedOutsourceId] = useState<string | null>(null);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Reset header visibility when navigating between main views
  useEffect(() => {
    setIsHeaderVisible(true);
  }, [currentView]);

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'staff': return 'Staff';
      case 'outsource': return 'Outsource';
      case 'equipment': return 'Equipment';
      case 'package': return 'Package';
      case 'company': return 'Company';
      case 'event': return 'Event';
      case 'create-event': return 'Create Event';
      case 'edit-event': return 'Edit Event';
      case 'create-company': return 'Create Company';
      case 'edit-company': return 'Edit Company';
      case 'create-staff': return 'Add Staff';
      case 'edit-staff': return 'Edit Staff';
      case 'create-outsource': return 'Add Outsource';
      case 'edit-outsource': return 'Edit Outsource';
      case 'create-equipment': return 'Add Equipment';
      case 'edit-equipment': return 'Edit Equipment';
      case 'create-package': return 'Create Package';
      case 'edit-package': return 'Edit Package';
      default: return 'Dashboard';
    }
  };

  const getItemCount = () => {
    switch (currentView) {
      case 'staff': return staffList.length;
      case 'outsource': return outsourceList.length;
      case 'equipment': return equipmentList.length;
      case 'package': return packages.length;
      case 'company': return companies.length;
      case 'event': return events.length;
      default: return 0;
    }
  };

  const getItemLabel = () => {
    switch (currentView) {
      case 'equipment': return 'items';
      case 'package': return 'packages';
      case 'company': return 'companies';
      case 'event': return 'events';
      default: return 'active members';
    }
  };

  // --- Delete Handlers ---

  const handleDeleteStaff = (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaffList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleDeleteOutsource = (id: string) => {
    if (window.confirm('Are you sure you want to delete this outsource member?')) {
      setOutsourceList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleDeleteEquipment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      setEquipmentList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleDeletePackage = (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleDeleteCompany = (id: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      setCompanies(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- Create Handlers ---

  const handleCreateEvent = (newEventData: Partial<EventItem>) => {
    // Basic Mock ID generation and defaults
    const newEvent: EventItem = {
      id: `evt-new-${Date.now()}`,
      title: newEventData.title || 'New Event',
      date: newEventData.date || new Date().toISOString().split('T')[0],
      startTime: newEventData.startTime || '09:00',
      endTime: newEventData.endTime || '10:00',
      type: newEventData.type || 'Offline',
      status: newEventData.status || 'Pending',
      staffIds: newEventData.staffIds || [],
      companyId: newEventData.companyId || '',
      location: newEventData.location || 'TBD',
      description: newEventData.description || '',
      documents: [],
      packageId: newEventData.packageId,
      // Extended fields
      clientContacts: [], // Would typically fetch based on company
      staffRequirements: newEventData.staffRequirements || [],
      equipmentList: newEventData.equipmentList || [],
      // New ER Fields
      rehearsalDate: newEventData.rehearsalDate,
      officeAppointmentTime: newEventData.officeAppointmentTime,
      venueAppointmentTime: newEventData.venueAppointmentTime,
      registrationOpenTime: newEventData.registrationOpenTime,
      quoteNumber: newEventData.quoteNumber,
      quoteIssueDate: newEventData.quoteIssueDate,
      quoteStatus: newEventData.quoteStatus,
      queueNumber: events.length + 1
    };

    setEvents(prev => [...prev, newEvent]);
    setCurrentView('event');
  };

  const handleUpdateEvent = (updatedEvent: EventItem) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    // If returning to detail, ensure we view the updated event
    setSelectedEventId(updatedEvent.id);
    setCurrentView('event-detail');
  };

  const handleCreateCompany = (newCompanyData: any) => {
    // Determine the primary contact (the first one added)
    const primaryContact = newCompanyData.contacts && newCompanyData.contacts.length > 0 
      ? newCompanyData.contacts[0] 
      : { name: '', role: '', phone: '', email: '' };

    const newCompany: CompanyItem = {
      id: `comp-new-${Date.now()}`,
      companyName: newCompanyData.companyName,
      contactPerson: primaryContact.name,
      role: primaryContact.role, // Mapping role to role
      email: primaryContact.email,
      phone: primaryContact.phone,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      // Add detailed fields
      address: newCompanyData.address,
      contacts: newCompanyData.contacts,
      locationName: newCompanyData.companyName, // Default location name to company name if not provided
      officeHours: '9:00 AM - 6:00 PM', // Default
      industry: newCompanyData.industry
    };

    setCompanies(prev => [newCompany, ...prev]);
    setCurrentView('company');
  };

  const handleUpdateCompany = (updatedCompany: CompanyItem) => {
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
    // If returning to detail, ensure we view the updated company
    setSelectedCompanyId(updatedCompany.id);
    setCurrentView('company-detail');
  };

  const handleCreateStaff = (newStaff: StaffMember) => {
    setStaffList(prev => [newStaff, ...prev]);
    setCurrentView('staff');
  };

  const handleUpdateStaff = (updatedStaff: StaffMember) => {
    setStaffList(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
    setCurrentView('staff');
  };

  const handleCreateOutsource = (newOutsource: StaffMember) => {
    setOutsourceList(prev => [newOutsource, ...prev]);
    setCurrentView('outsource');
  };

  const handleUpdateOutsource = (updatedStaff: StaffMember) => {
    setOutsourceList(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
    setCurrentView('outsource');
  };

  const handleCreateEquipment = (newItem: EquipmentItem) => {
    setEquipmentList(prev => [newItem, ...prev]);
    setCurrentView('equipment');
  };

  const handleUpdateEquipment = (updatedItem: EquipmentItem) => {
    setEquipmentList(prev => prev.map(e => e.id === updatedItem.id ? updatedItem : e));
    setCurrentView('equipment');
  };

  const handleCreatePackage = (newPackage: PackageItem) => {
    setPackages(prev => [newPackage, ...prev]);
    setCurrentView('package');
  };

  const handleUpdatePackage = (updatedPackage: PackageItem) => {
    setPackages(prev => prev.map(p => p.id === updatedPackage.id ? updatedPackage : p));
    setCurrentView('package');
  };

  const handleCompanyClick = (company: CompanyItem) => {
    setSelectedCompanyId(company.id);
    setCurrentView('company-detail');
  };

  const handleCompanyEdit = (company: CompanyItem) => {
    setSelectedCompanyId(company.id);
    setCurrentView('edit-company');
  };

  const handleEventClick = (event: EventItem) => {
    setSelectedEventId(event.id);
    setPreviousView(currentView); // Store where we came from
    setCurrentView('event-detail');
  };

  const handleStaffEdit = (staff: StaffMember) => {
    setSelectedStaffId(staff.id);
    setCurrentView('edit-staff');
  };

  const handleOutsourceEdit = (staff: StaffMember) => {
    setSelectedOutsourceId(staff.id);
    setCurrentView('edit-outsource');
  };

  const handleEquipmentEdit = (item: EquipmentItem) => {
    setSelectedEquipmentId(item.id);
    setCurrentView('edit-equipment');
  };

  const handlePackageEdit = (pkg: PackageItem) => {
    setSelectedPackageId(pkg.id);
    setCurrentView('edit-package');
  };

  // Full page views without sidebar
  if (currentView === 'create-event') {
    return (
      <CreateEventPage 
        onBack={() => setCurrentView('event')}
        onCreate={handleCreateEvent}
        companies={companies}
        packages={packages}
        staffList={[...staffList, ...outsourceList]} // Pass updated combined list
        equipmentList={equipmentList}
      />
    );
  }

  if (currentView === 'edit-event') {
    const selectedEvent = events.find(e => e.id === selectedEventId);
    if (!selectedEvent) {
       // Fallback if event not found
       setCurrentView('event');
       return null;
    }
    return (
      <EditEventPage 
        event={selectedEvent}
        companies={companies}
        packages={packages}
        staffList={[...staffList, ...outsourceList]}
        equipmentList={equipmentList}
        onBack={() => setCurrentView('event-detail')}
        onSave={handleUpdateEvent}
      />
    );
  }

  if (currentView === 'create-company') {
    return (
      <CreateCompanyPage 
        onBack={() => setCurrentView('company')}
        onCreate={handleCreateCompany}
      />
    );
  }

  if (currentView === 'edit-company') {
    const selectedCompany = companies.find(c => c.id === selectedCompanyId);
    if (!selectedCompany) {
      setCurrentView('company');
      return null;
    }
    return (
      <EditCompanyPage 
        company={selectedCompany}
        onBack={() => setCurrentView('company-detail')}
        onSave={handleUpdateCompany}
      />
    );
  }

  if (currentView === 'create-staff') {
    return (
      <CreateStaffPage 
        onBack={() => setCurrentView('staff')}
        onCreate={handleCreateStaff}
      />
    );
  }

  if (currentView === 'edit-staff') {
    const selectedStaff = staffList.find(s => s.id === selectedStaffId);
    if (!selectedStaff) {
      setCurrentView('staff');
      return null;
    }
    return (
      <EditStaffPage 
        staff={selectedStaff}
        onBack={() => setCurrentView('staff')}
        onSave={handleUpdateStaff}
      />
    );
  }

  if (currentView === 'create-outsource') {
    return (
      <CreateOutsourcePage 
        onBack={() => setCurrentView('outsource')}
        onCreate={handleCreateOutsource}
      />
    );
  }

  if (currentView === 'edit-outsource') {
    const selectedStaff = outsourceList.find(s => s.id === selectedOutsourceId);
    if (!selectedStaff) {
      setCurrentView('outsource');
      return null;
    }
    return (
      <EditOutsourcePage 
        staff={selectedStaff}
        onBack={() => setCurrentView('outsource')}
        onSave={handleUpdateOutsource}
      />
    );
  }

  if (currentView === 'create-equipment') {
    return (
      <CreateEquipmentPage 
        onBack={() => setCurrentView('equipment')}
        onCreate={handleCreateEquipment}
      />
    );
  }

  if (currentView === 'edit-equipment') {
    const selectedItem = equipmentList.find(e => e.id === selectedEquipmentId);
    if (!selectedItem) {
      setCurrentView('equipment');
      return null;
    }
    return (
      <EditEquipmentPage
        equipment={selectedItem}
        onBack={() => setCurrentView('equipment')}
        onSave={handleUpdateEquipment}
      />
    );
  }

  if (currentView === 'create-package') {
    return (
      <CreatePackagePage 
        onBack={() => setCurrentView('package')}
        onCreate={handleCreatePackage}
        equipmentList={equipmentList}
      />
    );
  }

  if (currentView === 'edit-package') {
    const selectedPkg = packages.find(p => p.id === selectedPackageId);
    if (!selectedPkg) {
      setCurrentView('package');
      return null;
    }
    return (
      <EditPackagePage
        pkg={selectedPkg}
        onBack={() => setCurrentView('package')}
        onSave={handleUpdatePackage}
        equipmentList={equipmentList}
      />
    );
  }

  return (
    <div className={`flex bg-gray-50 text-gray-900 font-sans ${currentView === 'package' ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        currentView={currentView === 'company-detail' ? 'company' : (currentView === 'event-detail' ? 'event' : currentView)}
        onNavigate={setCurrentView}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
        {/* Top Header - Conditionally rendered: hide on Detail Views */}
        {isHeaderVisible && currentView !== 'company-detail' && currentView !== 'event-detail' && (
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <button 
                className="p-2 -ml-2 rounded-lg hover:bg-gray-100 lg:hidden text-gray-600"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {getHeaderTitle()}
                </h1>
                {currentView !== 'dashboard' && (
                  <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    {getItemCount()} {getItemLabel()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentView === 'staff' && (
                  <button 
                    onClick={() => setCurrentView('create-staff')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm shadow-blue-200"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                    Add Staff
                  </button>
              )}
              {currentView === 'outsource' && (
                  <button 
                    onClick={() => setCurrentView('create-outsource')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm shadow-blue-200"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                    Add Outsource
                  </button>
              )}
              {currentView === 'equipment' && (
                  <button 
                    onClick={() => setCurrentView('create-equipment')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm shadow-blue-200"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                    Add Equipment
                  </button>
              )}
              {currentView === 'package' && (
                  <button 
                    onClick={() => setCurrentView('create-package')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm shadow-blue-200"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                    Create Package
                  </button>
              )}
              {currentView === 'company' && (
                  <button 
                    onClick={() => setCurrentView('create-company')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm shadow-blue-200"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                    Add Company
                  </button>
              )}
              {currentView === 'event' && (
                  <button 
                    onClick={() => setCurrentView('create-event')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm shadow-blue-200"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                    Create Event
                  </button>
              )}
            </div>
          </header>
        )}

        {currentView === 'dashboard' ? (
          <Dashboard 
            events={events}
            staff={staffList}
            companies={companies}
            equipment={equipmentList}
            onNavigate={setCurrentView}
            onEventClick={handleEventClick}
          />
        ) : currentView === 'company-detail' ? (
           (() => {
             const selectedCompany = companies.find(c => c.id === selectedCompanyId);
             if (!selectedCompany) {
                setCurrentView('company');
                return null;
             }
             const companyEvents = events.filter(e => e.companyId === selectedCompany.id);
             return (
               <CompanyDetailPage 
                 company={selectedCompany}
                 events={companyEvents}
                 onBack={() => setCurrentView('company')}
                 onEventClick={handleEventClick}
                 onEdit={() => handleCompanyEdit(selectedCompany)}
                 onDelete={handleDeleteCompany}
               />
             );
           })()
        ) : currentView === 'event-detail' ? (
           (() => {
             const selectedEvent = events.find(e => e.id === selectedEventId);
             const company = companies.find(c => c.id === selectedEvent?.companyId);
             if (!selectedEvent) {
                setCurrentView('event');
                return null;
             }
             return (
               <EventDetailView 
                 event={selectedEvent} 
                 company={company} 
                 staffList={[...staffList, ...outsourceList]}
                 onBack={() => setCurrentView(previousView)}
                 onEdit={(e) => {
                    setSelectedEventId(e.id);
                    setPreviousView(currentView === 'event' ? 'event' : 'dashboard');
                    setCurrentView('edit-event');
                 }}
               />
             );
           })()
        ) : currentView === 'equipment' ? (
          <EquipmentTable 
            data={equipmentList} 
            onDelete={handleDeleteEquipment}
            onEdit={handleEquipmentEdit}
          />
        ) : currentView === 'package' ? (
          <PackageView 
            data={packages} 
            onDelete={handleDeletePackage}
            onEdit={handlePackageEdit}
          />
        ) : currentView === 'company' ? (
          <CompanyList 
            data={companies} 
            onCompanyClick={handleCompanyClick} 
            onDelete={handleDeleteCompany}
            onEdit={handleCompanyEdit}
          />
        ) : currentView === 'event' ? (
          <>
            <EventCalendar 
              events={events} 
              staff={[...staffList, ...outsourceList]} 
              companies={companies}
              onDetailViewActive={(active) => setIsHeaderVisible(!active)}
              onEdit={(e) => {
                setSelectedEventId(e.id);
                setPreviousView('event');
                setCurrentView('edit-event');
              }}
            />
          </>
        ) : currentView === 'staff' || currentView === 'outsource' ? (
          <StaffTable 
            data={currentView === 'staff' ? staffList : outsourceList} 
            showInitials={currentView === 'outsource'}
            onDelete={currentView === 'staff' ? handleDeleteStaff : handleDeleteOutsource}
            onEdit={currentView === 'staff' ? handleStaffEdit : handleOutsourceEdit}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Select a menu item to view details</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
