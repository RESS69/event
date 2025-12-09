
import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, MapPin, Building2, FileText, 
  Package, Save, Plus, Trash2, Search, User, 
  CheckCircle2, AlertCircle, ChevronDown, UploadCloud,
  Monitor, Wifi, Users
} from 'lucide-react';
import { CompanyItem, PackageItem, EventItem, EventType, EventStatus, StaffMember, EquipmentItem } from '../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (event: Partial<EventItem>) => void;
  companies: CompanyItem[];
  packages: PackageItem[];
  staffList: StaffMember[];
  equipmentList: EquipmentItem[];
}

// Helper to parse package items string "4x Mic" -> { count: 4, name: "Mic" }
const parsePackageItem = (itemStr: string) => {
  const match = itemStr.match(/^(\d+)x\s+(.+)$/);
  if (match) {
    return { count: parseInt(match[1], 10), name: match[2].trim() };
  }
  return { count: 1, name: itemStr.trim() };
};

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate, 
  companies, 
  packages,
  staffList,
  equipmentList
}) => {
  // --- Form State ---
  const [formData, setFormData] = useState({
    title: '',
    type: 'Offline' as EventType,
    companyId: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
  });

  // --- Dynamic Sections State ---
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  
  // Equipment: We track "Extra" items. "In Pkg" is derived from selectedPackageId.
  const [extraEquipment, setExtraEquipment] = useState<{ id: string; name: string; quantity: number }[]>([]);
  const [equipSearch, setEquipSearch] = useState('');
  
  // Staff: Roles and assigned users
  const [staffRequirements, setStaffRequirements] = useState<{ 
    id: string; 
    role: string; 
    count: number; 
    assigned: string[] 
  }[]>([]);
  const [newRole, setNewRole] = useState('Host');
  const [newRoleCount, setNewRoleCount] = useState(1);

  // Files
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset on Open
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        type: 'Offline',
        companyId: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
      });
      setSelectedPackageId('');
      setExtraEquipment([]);
      setStaffRequirements([]);
      setFiles([]);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Equipment Logic
  const handleAddEquipment = (item: EquipmentItem) => {
    setExtraEquipment(prev => {
      const existing = prev.find(e => e.id === item.id);
      if (existing) {
        return prev.map(e => e.id === item.id ? { ...e, quantity: e.quantity + 1 } : e);
      }
      return [...prev, { id: item.id, name: item.name, quantity: 1 }];
    });
    setEquipSearch('');
  };

  const updateExtraQuantity = (id: string, delta: number) => {
    setExtraEquipment(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, quantity: Math.max(0, e.quantity + delta) };
      }
      return e;
    }).filter(e => e.quantity > 0));
  };

  // Staff Logic
  const handleAddRole = () => {
    if (!newRole) return;
    setStaffRequirements(prev => [
      ...prev, 
      { 
        id: Date.now().toString(), 
        role: newRole, 
        count: newRoleCount, 
        assigned: [] 
      }
    ]);
  };

  const removeRole = (id: string) => {
    setStaffRequirements(prev => prev.filter(r => r.id !== id));
  };

  const assignStaffToRole = (reqId: string, staffId: string) => {
    setStaffRequirements(prev => prev.map(req => {
      if (req.id === reqId) {
        // Prevent duplicate assignment in same role
        if (req.assigned.includes(staffId)) return req;
        // Prevent exceeding count
        if (req.assigned.length >= req.count) return req;
        return { ...req, assigned: [...req.assigned, staffId] };
      }
      return req;
    }));
  };

  const removeStaffFromRole = (reqId: string, staffId: string) => {
    setStaffRequirements(prev => prev.map(req => {
      if (req.id === reqId) {
        return { ...req, assigned: req.assigned.filter(id => id !== staffId) };
      }
      return req;
    }));
  };

  // Submit
  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Event Name is required';
    if (!formData.companyId) newErrors.companyId = 'Company is required';
    if (!formData.date) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Construct final Equipment List (Package items + Extra)
    // For demo, we just structure it to match EventItem expectation roughly
    const pkg = packages.find(p => p.id === selectedPackageId);
    // Note: in a real app we'd map pkg items to IDs. Here we simplify.

    onCreate({
      ...formData,
      status: 'Pending',
      packageId: selectedPackageId,
      // Map local state to EventItem structure
      staffRequirements: staffRequirements.map(req => ({
        roleName: req.role,
        required: req.count,
        assigned: req.assigned.length,
        members: req.assigned.map(id => staffList.find(s => s.id === id)!).filter(Boolean)
      })),
      staffIds: staffRequirements.flatMap(r => r.assigned),
      // Simple mock for equipment list
      equipmentList: extraEquipment.map(e => ({
        id: e.id,
        name: e.name,
        inPackage: 0,
        extra: e.quantity
      }))
    });
  };

  // --- Derived Data for Equipment Table ---
  const selectedPackage = packages.find(p => p.id === selectedPackageId);
  
  // Combine Package Items and Extra Items for the table
  const combinedEquipment = new Map<string, { name: string; inPkg: number; extra: number }>();

  if (selectedPackage) {
    selectedPackage.items.forEach(itemStr => {
      const { count, name } = parsePackageItem(itemStr);
      combinedEquipment.set(name, { name, inPkg: count, extra: 0 });
    });
  }

  extraEquipment.forEach(item => {
    const existing = combinedEquipment.get(item.name) || { name: item.name, inPkg: 0, extra: 0 };
    combinedEquipment.set(item.name, { ...existing, extra: existing.extra + item.quantity });
  });

  const equipmentRows = Array.from(combinedEquipment.values());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col relative z-10 overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-5 bg-white border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
            <p className="text-sm text-gray-500 mt-1">Fill in the details to schedule a new event</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
          
          {/* 1. Basic Information */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Name</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${errors.title ? 'border-red-300' : 'border-gray-200'}`}
                  placeholder="e.g. Annual Tech Conference 2024"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select 
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none ${errors.companyId ? 'border-red-300' : 'border-gray-200'}`}
                  >
                    <option value="">Select Company</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.companyName}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
                {errors.companyId && <p className="text-xs text-red-500 mt-1">{errors.companyId}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {(['Offline', 'Online', 'Hybrid'] as EventType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type }))}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.type === type 
                          ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {type === 'Offline' && <Building2 size={16} />}
                      {type === 'Online' && <Wifi size={16} />}
                      {type === 'Hybrid' && <Monitor size={16} />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 2. Schedule & Location */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Schedule
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2">
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Date</label>
                 <div className="relative">
                   <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                     type="date" 
                     name="date"
                     value={formData.date}
                     onChange={handleInputChange}
                     className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none ${errors.date ? 'border-red-300' : 'border-gray-200'}`}
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                 <div className="relative">
                   <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                     type="time" 
                     name="startTime"
                     value={formData.startTime}
                     onChange={handleInputChange}
                     className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                 <div className="relative">
                   <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                     type="time" 
                     name="endTime"
                     value={formData.endTime}
                     onChange={handleInputChange}
                     className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                   />
                 </div>
               </div>
            </div>

            {formData.type !== 'Online' && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Venue / Location</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter venue address..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <button type="button" className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium text-sm hover:bg-blue-100 transition-colors flex items-center gap-2">
                     <MapPin size={16} />
                     Pin Map
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 3. Package Selection */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Package
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {packages.slice(0, 3).map(pkg => (
                <div 
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`cursor-pointer rounded-xl border-2 p-5 transition-all relative ${
                    selectedPackageId === pkg.id 
                      ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/10' 
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  {selectedPackageId === pkg.id && (
                    <div className="absolute top-3 right-3 text-blue-600">
                      <CheckCircle2 size={24} className="fill-blue-100" />
                    </div>
                  )}
                  <div className="p-2 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 mb-3">
                    <Package size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900">{pkg.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{pkg.items.length} items included</p>
                  <p className="text-blue-600 font-bold mt-3">{pkg.price}</p>
                </div>
              ))}
            </div>
            {formData.type === 'Offline' && (
               <p className="text-xs text-red-500 mt-4 flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  If offline, only specific packages are available. (Demo note)
               </p>
            )}
          </section>

          {/* 4. Equipment */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                  Equipment
                </h3>
                
                {/* Search / Add Extra */}
                <div className="relative w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                   <input 
                      type="text" 
                      placeholder="Add extra equipment..." 
                      className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      value={equipSearch}
                      onChange={(e) => setEquipSearch(e.target.value)}
                   />
                   {equipSearch && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-40 overflow-auto">
                         {equipmentList.filter(e => e.name.toLowerCase().includes(equipSearch.toLowerCase())).map(item => (
                            <button 
                               key={item.id}
                               type="button"
                               onClick={() => handleAddEquipment(item)}
                               className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex justify-between"
                            >
                               <span>{item.name}</span>
                               <span className="text-xs text-gray-400">Stock: {item.total}</span>
                            </button>
                         ))}
                      </div>
                   )}
                </div>
             </div>
             
             <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                   <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                         <th className="px-4 py-3 text-left">Items</th>
                         <th className="px-4 py-3 text-center w-24">In Pkg</th>
                         <th className="px-4 py-3 text-center w-32 bg-blue-50/50 text-blue-700">Extra</th>
                         <th className="px-4 py-3 text-center w-24">Total</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {equipmentRows.map((row, idx) => (
                         <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-gray-900">{row.name}</td>
                            <td className="px-4 py-3 text-center text-gray-500">{row.inPkg}</td>
                            <td className="px-4 py-3 text-center bg-blue-50/10">
                               {row.extra > 0 || row.inPkg === 0 ? (
                                  <div className="flex items-center justify-center gap-2">
                                     <button 
                                        type="button" 
                                        onClick={() => updateExtraQuantity(extraEquipment.find(e => e.name === row.name)?.id || '', -1)}
                                        className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                                     >
                                        -
                                     </button>
                                     <span className="w-4 text-center font-medium text-blue-600">{row.extra}</span>
                                     <button 
                                        type="button" 
                                        onClick={() => updateExtraQuantity(extraEquipment.find(e => e.name === row.name)?.id || '', 1)}
                                        className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                                     >
                                        +
                                     </button>
                                  </div>
                               ) : (
                                  <span className="text-gray-300">-</span>
                               )}
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-gray-900">{row.inPkg + row.extra}</td>
                         </tr>
                      ))}
                      {equipmentRows.length === 0 && (
                         <tr>
                            <td colSpan={4} className="py-8 text-center text-gray-400 italic">Select a package to see equipment list</td>
                         </tr>
                      )}
                   </tbody>
                </table>
             </div>
             <p className="text-xs text-red-500 mt-3 text-right">
                * Items in package cannot be removed. Add "Extra" to increase quantity.
             </p>
          </section>

          {/* 5. Staff */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                  Staff
                </h3>
             </div>

             {/* Add Role Control */}
             <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 items-end">
                <div className="flex-1">
                   <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Add Role</label>
                   <select 
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                   >
                      {['Host', 'Technician', 'Project Manager', 'Coordinator', 'Security', 'Sound Engineer'].map(r => (
                         <option key={r} value={r}>{r}</option>
                      ))}
                   </select>
                </div>
                <div className="w-24">
                   <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Amount</label>
                   <input 
                      type="number" 
                      min="1" 
                      value={newRoleCount}
                      onChange={(e) => setNewRoleCount(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
                   />
                </div>
                <button 
                   type="button" 
                   onClick={handleAddRole}
                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors mb-[1px]"
                >
                   Add
                </button>
             </div>

             {/* Staff List */}
             <div className="space-y-3">
                {staffRequirements.map(req => {
                   const isComplete = req.assigned.length >= req.count;
                   return (
                      <div 
                         key={req.id} 
                         className={`rounded-xl border overflow-hidden ${isComplete ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}
                      >
                         <div className="px-4 py-3 flex justify-between items-center border-b border-black/5 bg-white/50">
                            <div className="flex items-center gap-2">
                               <span className="font-bold text-gray-800">{req.role}</span>
                               <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isComplete ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {req.assigned.length}/{req.count}
                               </span>
                            </div>
                            <div className="flex items-center gap-2">
                               <button className="text-xs text-gray-500 hover:text-blue-600">[Edit]</button>
                               <button onClick={() => removeRole(req.id)} className="text-xs text-gray-500 hover:text-red-600">[Delete]</button>
                               {isComplete 
                                  ? <span className="flex items-center gap-1 text-xs font-bold text-white bg-green-500 px-2 py-1 rounded ml-2"><CheckCircle2 size={12} /> Complete</span>
                                  : <span className="flex items-center gap-1 text-xs font-bold text-white bg-red-500 px-2 py-1 rounded ml-2"><X size={12} /> Incomplete</span>
                               }
                            </div>
                         </div>
                         
                         <div className="p-3 space-y-2">
                            {Array.from({ length: req.count }).map((_, idx) => {
                               const assignedId = req.assigned[idx];
                               const assignedMember = assignedId ? staffList.find(s => s.id === assignedId) : null;
                               
                               return (
                                  <div key={idx} className="flex items-center justify-between bg-white/60 p-2 rounded border border-black/5 text-sm">
                                     <span className="text-gray-500 font-medium w-16">Slot {idx + 1}:</span>
                                     
                                     {assignedMember ? (
                                        <div className="flex-1 flex items-center gap-2">
                                           <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                              {assignedMember.name.charAt(0)}
                                           </div>
                                           <span className="text-gray-900 font-medium">{assignedMember.name}</span>
                                        </div>
                                     ) : (
                                        <div className="flex-1 text-gray-400 italic">
                                           (Assign Person)
                                        </div>
                                     )}

                                     <div className="flex items-center gap-2">
                                        {assignedMember ? (
                                           <button onClick={() => removeStaffFromRole(req.id, assignedMember.id)} className="text-xs text-red-500 hover:underline">Clear</button>
                                        ) : (
                                            // Quick mock assignment (assign random unassigned staff)
                                            <button 
                                               onClick={() => {
                                                  const available = staffList.find(s => !req.assigned.includes(s.id));
                                                  if (available) assignStaffToRole(req.id, available.id);
                                               }}
                                               className="text-xs text-blue-600 hover:underline"
                                            >
                                               Assign
                                            </button>
                                        )}
                                     </div>
                                  </div>
                               );
                            })}
                         </div>
                      </div>
                   );
                })}
                {staffRequirements.length === 0 && (
                   <p className="text-center text-gray-400 italic py-4">No roles added yet.</p>
                )}
             </div>
          </section>

          {/* 6. Files & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                  Files & Documents
                </h3>
                <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-6 flex flex-col items-center justify-center text-center hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group h-40">
                   <div className="w-10 h-10 rounded-full bg-gray-200 group-hover:bg-blue-200 flex items-center justify-center text-gray-500 group-hover:text-blue-600 mb-3 transition-colors">
                      <UploadCloud size={20} />
                   </div>
                   <p className="text-sm font-medium text-gray-900">Drag and drop files here</p>
                   <p className="text-xs text-gray-500 mt-1">or <span className="text-blue-600 underline">Browse</span></p>
                   <p className="text-[10px] text-gray-400 mt-2">Support: PDF, JPG, PNG (Max 10MB)</p>
                </div>
             </section>

             <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                  Note / Brief
                </h3>
                <textarea 
                   name="description"
                   value={formData.description}
                   onChange={handleInputChange}
                   className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                   placeholder="Enter any additional notes or brief for the event..."
                />
             </section>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-white border-t border-gray-200 flex justify-end gap-3 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-transform active:scale-95 flex items-center gap-2"
          >
            <Save size={18} />
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
};
