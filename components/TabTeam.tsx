
import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, ChevronDown, ChevronUp, User, CheckCircle2, AlertCircle, 
  Trash2, Plus, X, Search, GripVertical, AlertTriangle, Check
} from 'lucide-react';
import { EventItem, StaffMember, StaffType, StaffRequirement } from '../types';

interface TabTeamProps {
  event: EventItem;
  staffList: StaffMember[];
}

interface LocalRequirement {
  id: string;
  role: string;
  count: number;
  assigned: string[];
}

export const TabTeam: React.FC<TabTeamProps> = ({ event, staffList }) => {
  // Local state for interactivity
  const [requirements, setRequirements] = useState<LocalRequirement[]>([]);
  const [activeReqId, setActiveReqId] = useState<string | null>(null);
  
  // Add Role Modal State
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('Host');
  const [newRoleCount, setNewRoleCount] = useState<number | ''>(1);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false); // Custom dropdown state
  
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  // Popover State
  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState<'Available' | 'Busy'>('Available');
  const [staffSearch, setStaffSearch] = useState('');
  const staffPickerRef = useRef<HTMLDivElement>(null);

  // Conflict Modal State
  const [conflictModal, setConflictModal] = useState<{
    isOpen: boolean;
    staff: StaffMember | null;
    targetReqId: string | null;
    conflictingEventName: string;
  }>({
    isOpen: false,
    staff: null,
    targetReqId: null,
    conflictingEventName: '',
  });

  // Initialize local state from event requirements
  useEffect(() => {
    const initialReqs = event.staffRequirements.map((req, idx) => ({
      id: `req-${idx}-${Date.now()}`, // Generate temporary unique IDs
      role: req.roleName,
      count: req.required,
      assigned: req.members.map(m => m.id)
    }));
    setRequirements(initialReqs);
  }, [event.staffRequirements]); // Re-init if prop changes deeply

  // Reset dropdown when modal opens
  useEffect(() => {
    if (isAddRoleModalOpen) {
      setIsRoleDropdownOpen(false);
    }
  }, [isAddRoleModalOpen]);

  // --- Handlers ---

  const handleAddRole = () => {
    const countToAdd = (newRoleCount === '' || newRoleCount < 1) ? 1 : newRoleCount;
    
    setRequirements(prev => {
        // Check if role already exists
        const existingIndex = prev.findIndex(req => req.role === newRole);
        
        if (existingIndex >= 0) {
            // Update existing role count
            const updated = [...prev];
            const currentReq = updated[existingIndex];
            updated[existingIndex] = {
                ...currentReq,
                count: currentReq.count + countToAdd
            };
            return updated;
        } else {
            // Add new role card
            return [
                ...prev,
                { id: `new-${Date.now()}`, role: newRole, count: countToAdd, assigned: [] }
            ];
        }
    });
    
    setNewRoleCount(1);
    setIsAddRoleModalOpen(false);
  };

  const updateRoleCount = (id: string, delta: number) => {
    setRequirements(prev => prev.map(req => {
      if (req.id === id) {
        const minCount = Math.max(1, req.assigned.length);
        const newCount = Math.max(minCount, req.count + delta);
        return { ...req, count: newCount };
      }
      return req;
    }));
  };

  const confirmDeleteRole = () => {
    if (roleToDelete) {
      setRequirements(prev => prev.filter(r => r.id !== roleToDelete));
      setRoleToDelete(null);
    }
  };

  const assignStaffToRole = (reqId: string, staffId: string) => {
    setRequirements(prev => prev.map(req => {
      if (req.id === reqId) {
        if (req.assigned.includes(staffId)) return req;
        if (req.assigned.length >= req.count) return req;
        return { ...req, assigned: [...req.assigned, staffId] };
      }
      return req;
    }));
  };

  const removeStaffFromRole = (reqId: string, staffId: string) => {
    setRequirements(prev => prev.map(req => {
      if (req.id === reqId) {
        return { ...req, assigned: req.assigned.filter(id => id !== staffId) };
      }
      return req;
    }));
  };

  // Drag & Drop
  const handleDragStart = (e: React.DragEvent, staff: StaffMember) => {
    e.dataTransfer.setData('staffId', staff.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, reqId: string) => {
    e.preventDefault();
    const staffId = e.dataTransfer.getData('staffId');
    const staffMember = staffList.find(s => s.id === staffId);

    if (staffMember) {
        if (staffMember.status === 'Busy') {
            setConflictModal({
                isOpen: true,
                staff: staffMember,
                targetReqId: reqId,
                conflictingEventName: 'Another Event (Busy)'
            });
        } else {
            assignStaffToRole(reqId, staffId);
        }
    }
  };

  const confirmConflictAssignment = () => {
      if (conflictModal.staff && conflictModal.targetReqId) {
          assignStaffToRole(conflictModal.targetReqId, conflictModal.staff.id);
          setConflictModal(prev => ({ ...prev, isOpen: false }));
      }
  };

  // Filter Staff for Popover
  const getFilteredStaff = () => {
    const assignedIds = requirements.flatMap(r => r.assigned);
    const activeReq = requirements.find(r => r.id === activeReqId);
    const targetRole = activeReq?.role;

    return staffList.filter(s => {
      if (assignedIds.includes(s.id)) return false;
      
      // Strict Role Matching: Only show staff that have the role of the clicked card
      if (targetRole && !s.roles.includes(targetRole as any)) {
         return false; 
      }

      const matchesSearch = s.name.toLowerCase().includes(staffSearch.toLowerCase()) || 
                            s.roles.some(r => r.toLowerCase().includes(staffSearch.toLowerCase()));
      const matchesTab = pickerTab === 'Available' ? s.status !== 'Busy' : s.status === 'Busy';
      
      return matchesSearch && matchesTab;
    });
  };

  // --- Render ---
  
  // Group logic for Summary Section (derived from current local state)
  const allAssignedIds = requirements.flatMap(r => r.assigned);
  const assignedStaffObjects = allAssignedIds.map(id => staffList.find(s => s.id === id)).filter(Boolean) as StaffMember[];
  
  const internalStaff = assignedStaffObjects.filter(m => m.type === StaffType.INTERNAL);
  const outsourceStaff = assignedStaffObjects.filter(m => m.type === StaffType.OUTSOURCE);

  const [internalOpen, setInternalOpen] = useState(true);
  const [outsourceOpen, setOutsourceOpen] = useState(true);

  return (
    <>
    <div className="space-y-8 animate-in fade-in duration-300 pb-20">
      
      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
        {requirements.map((req, index) => {
          const isComplete = req.assigned.length >= req.count;
          const isActive = activeReqId === req.id && isStaffPickerOpen;
          // Determine placement for popover (right column goes left, etc)
          const isRightColumn = (index + 1) % 3 === 0; 

          return (
            <div key={req.id} className="relative group h-full">
               <div className={`rounded-xl border-2 overflow-hidden h-full flex flex-col transition-all duration-200 ${
                  isActive ? 'ring-4 ring-blue-100 border-blue-400 z-10' : 
                  isComplete ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'
               }`}>
                  
                  {/* Header */}
                  <div className="px-4 py-3 flex justify-between items-center border-b border-black/5 bg-white/50">
                     <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-800 text-lg">{req.role}</span>
                        {/* Count Controls */}
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm h-7">
                           <button 
                              onClick={() => updateRoleCount(req.id, -1)}
                              disabled={req.count <= 1 || req.count <= req.assigned.length}
                              className="w-7 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 border-r border-gray-200 disabled:opacity-50"
                           >
                              -
                           </button>
                           <span className={`text-xs font-bold px-2 min-w-[24px] text-center ${isComplete ? 'text-green-700' : 'text-amber-700'}`}>
                              {req.assigned.length}/{req.count}
                           </span>
                           <button 
                              onClick={() => updateRoleCount(req.id, 1)}
                              className="w-7 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 border-l border-gray-200"
                           >
                              +
                           </button>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => setRoleToDelete(req.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                           <Trash2 size={16} />
                        </button>
                        {isComplete 
                           ? <span className="flex items-center justify-center w-6 h-6 text-white bg-green-500 rounded-full shadow-sm"><CheckCircle2 size={14} /></span>
                           : <span className="flex items-center justify-center w-6 h-6 text-white bg-amber-500 rounded-full shadow-sm"><AlertCircle size={14} /></span>
                        }
                     </div>
                  </div>

                  {/* List / Drop Zone */}
                  <div 
                     className="p-4 space-y-3 flex-1"
                     onDragOver={handleDragOver}
                     onDrop={(e) => handleDrop(e, req.id)}
                  >
                     {Array.from({ length: req.count }).map((_, i) => {
                        const memberId = req.assigned[i];
                        const member = memberId ? staffList.find(s => s.id === memberId) : null;
                        
                        return (
                           <React.Fragment key={i}>
                              {member ? (
                                 <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-4 min-w-0">
                                       <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded uppercase tracking-wider shrink-0">#{i + 1}</span>
                                       <div className="flex items-center gap-3 min-w-0">
                                          <img 
                                             src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                                             alt={member.name}
                                             className="w-8 h-8 rounded-full bg-gray-100 object-cover border-2 border-white shadow-sm shrink-0"
                                          />
                                          <div className="min-w-0">
                                             <p className="text-sm font-bold text-gray-900 truncate">{member.name}</p>
                                          </div>
                                       </div>
                                    </div>
                                    <button 
                                       onClick={() => removeStaffFromRole(req.id, member.id)}
                                       className="text-gray-400 hover:text-red-600 p-1.5 rounded hover:bg-red-50 transition-colors"
                                    >
                                       <Trash2 size={14} />
                                    </button>
                                 </div>
                              ) : (
                                 // Empty Slot
                                 <button 
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       setActiveReqId(req.id);
                                       setStaffSearch('');
                                       setPickerTab('Available');
                                       setIsStaffPickerOpen(true);
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed transition-colors group text-left ${
                                       isActive ? 'border-blue-400 bg-blue-50' : 'border-amber-300 bg-amber-50 hover:bg-amber-100'
                                    }`}
                                 >
                                    <span className={`text-xs font-bold bg-white/50 px-2 py-1 rounded uppercase tracking-wider shrink-0 ${isActive ? 'text-blue-500' : 'text-amber-300'}`}>#{i + 1}</span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${isActive ? 'bg-blue-100 text-blue-500' : 'bg-amber-100 text-amber-500'}`}>
                                       <Plus size={16} />
                                    </div>
                                    <span className={`text-sm font-medium italic ${isActive ? 'text-blue-700' : 'text-amber-700'}`}>
                                       {isActive ? 'Select from panel...' : 'Position Empty'}
                                    </span>
                                 </button>
                              )}
                           </React.Fragment>
                        );
                     })}
                  </div>
               </div>

               {/* Staff Picker Popover */}
               {isActive && (
                  <div 
                     ref={staffPickerRef}
                     className={`absolute top-0 z-50 w-[350px] bg-white shadow-2xl rounded-xl border border-gray-200 flex flex-col h-full min-h-[400px] animate-in fade-in zoom-in-95 duration-200 
                     ${isRightColumn ? 'right-full mr-4' : 'left-full ml-4'}
                  `}>
                     {/* Arrow */}
                     <div className={`absolute top-8 w-4 h-4 bg-white transform rotate-45 border-gray-200 ${isRightColumn ? '-right-2 border-t border-r' : '-left-2 border-l border-b'}`}></div>
                     
                     <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 rounded-t-xl">
                        <div className="flex items-center gap-2">
                           <Users size={18} className="text-blue-600" />
                           <div>
                              <h4 className="font-bold text-gray-900 leading-tight">Available Team</h4>
                              <p className="text-[10px] text-blue-600 font-medium">Filtering: {req.role}</p>
                           </div>
                           <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">{getFilteredStaff().length}</span>
                        </div>
                        <button onClick={() => setIsStaffPickerOpen(false)} className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600"><X size={18} /></button>
                     </div>

                     <div className="p-3 border-b border-gray-100 bg-white space-y-2">
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                           <button onClick={() => setPickerTab('Available')} className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${pickerTab === 'Available' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}>Available</button>
                           <button onClick={() => setPickerTab('Busy')} className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${pickerTab === 'Busy' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}>Unavailable</button>
                        </div>
                        <div className="relative">
                           <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                           <input 
                              type="text" 
                              placeholder="Search staff..." 
                              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={staffSearch}
                              onChange={(e) => setStaffSearch(e.target.value)}
                           />
                        </div>
                     </div>

                     <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-2 bg-gray-50/50">
                        {getFilteredStaff().map(staff => (
                           <div 
                              key={staff.id}
                              draggable="true"
                              onDragStart={(e) => handleDragStart(e, staff)}
                              className="group bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 cursor-grab active:cursor-grabbing transition-all flex items-center gap-3 select-none"
                           >
                              <div className="relative">
                                 <img 
                                    src={staff.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}`} 
                                    alt={staff.name} 
                                    className={`w-10 h-10 rounded-full object-cover border-2 ${staff.status === 'Busy' ? 'border-red-100 grayscale' : 'border-white'}`}
                                 />
                                 <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${staff.status === 'Busy' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className={`text-sm font-bold truncate ${staff.status === 'Busy' ? 'text-gray-500' : 'text-gray-900'}`}>{staff.name}</p>
                                 <p className="text-xs text-gray-500">{staff.roles.join(', ')}</p>
                              </div>
                              <GripVertical size={16} className="text-gray-300 group-hover:text-blue-400" />
                           </div>
                        ))}
                        {getFilteredStaff().length === 0 && <div className="text-center py-8 text-gray-400 text-xs">No matching staff found</div>}
                     </div>
                  </div>
               )}
            </div>
          );
        })}

        {/* Add Role Card */}
        <button
            onClick={() => setIsAddRoleModalOpen(true)}
            className="min-h-[300px] rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 gap-3 group h-full"
        >
            <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
               <Plus size={32} />
            </div>
            <span className="font-bold text-lg">Add New Role</span>
        </button>
      </div>

      {/* Summary Lists */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 border-l-4 border-blue-500 pl-3">Assigned Staff Summary</h3>
        
        {/* Internal Staff Accordion */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <button 
            onClick={() => setInternalOpen(!internalOpen)}
            className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm"><Users size={16} /></span>
              <span className="font-semibold text-gray-800">Internal Staff ({internalStaff.length})</span>
            </div>
            {internalOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </button>
          
          {internalOpen && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
              {internalStaff.map(staff => (
                <StaffCard key={staff.id} staff={staff} />
              ))}
              {internalStaff.length === 0 && <p className="text-gray-400 italic col-span-2 text-center py-4">No internal staff assigned.</p>}
            </div>
          )}
        </div>

        {/* Outsource Staff Accordion */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <button 
            onClick={() => setOutsourceOpen(!outsourceOpen)}
            className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="bg-purple-600 text-white p-1.5 rounded-lg shadow-sm"><User size={16} /></span>
              <span className="font-semibold text-gray-800">OutSource ({outsourceStaff.length})</span>
            </div>
            {outsourceOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </button>
          
          {outsourceOpen && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
              {outsourceStaff.map(staff => (
                <StaffCard key={staff.id} staff={staff} />
              ))}
               {outsourceStaff.length === 0 && <p className="text-gray-400 italic col-span-2 text-center py-4">No outsource staff assigned.</p>}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Delete Modal - MOVED OUTSIDE ANIMATION CONTAINER */}
    {roleToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
               <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto text-red-600">
                  <Trash2 size={24} />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Role?</h3>
               <p className="text-sm text-gray-500 mb-6">Are you sure? This will remove all assigned staff for this role.</p>
               <div className="flex gap-3">
                  <button onClick={() => setRoleToDelete(null)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50">Cancel</button>
                  <button onClick={confirmDeleteRole} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-md">Delete</button>
               </div>
            </div>
        </div>
    )}

    {/* Add Role Modal - MOVED OUTSIDE ANIMATION CONTAINER */}
    {isAddRoleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Add New Role</h3>
                  <button onClick={() => setIsAddRoleModalOpen(false)} className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600">
                     <X size={24} />
                  </button>
               </div>
               
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Select Role</label>
                     <div className="relative">
                        <button
                           type="button"
                           onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-left flex justify-between items-center transition-all"
                        >
                           <span className="font-medium text-gray-900">{newRole}</span>
                           <ChevronDown size={20} className={`text-gray-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isRoleDropdownOpen && (
                           <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto custom-scrollbar p-1">
                              {['Host', 'IT Support', 'Manager', 'Coordinator', 'Security', 'Sound Engineer'].map(r => (
                                 <button
                                    key={r}
                                    onClick={() => {
                                       setNewRole(r);
                                       setIsRoleDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                                       newRole === r ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                 >
                                    <span>{r}</span>
                                    {newRole === r && <Check size={16} className="text-blue-600" />}
                                 </button>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
                  
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Amount</label>
                     <input 
                        type="number" 
                        min="1" 
                        value={newRoleCount}
                        onChange={(e) => setNewRoleCount(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                     />
                  </div>
                  
                  <button 
                     onClick={handleAddRole}
                     className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-colors mt-4"
                  >
                     {requirements.some(r => r.role === newRole) ? 'Update Role Count' : 'Add Role Card'}
                  </button>
               </div>
            </div>
        </div>
    )}

    {/* Conflict Modal - MOVED OUTSIDE ANIMATION CONTAINER */}
    {conflictModal.isOpen && conflictModal.staff && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-red-100">
               <div className="bg-red-50 p-6 text-center border-b border-red-100">
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto text-red-600 border-4 border-white shadow-sm">
                     <AlertTriangle size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Schedule Conflict</h3>
                  <p className="text-sm text-red-600 mt-1 font-medium">Staff member is busy</p>
               </div>
               <div className="p-6">
                  <p className="text-sm text-gray-600 text-center mb-6">
                     <strong>{conflictModal.staff.name}</strong> is assigned to <span className="text-red-600 font-bold">{conflictModal.conflictingEventName}</span>. Move them here?
                  </p>
                  <div className="flex gap-3">
                     <button onClick={() => setConflictModal(prev => ({...prev, isOpen: false}))} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50">Cancel</button>
                     <button onClick={confirmConflictAssignment} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg">Confirm Move</button>
                  </div>
               </div>
            </div>
        </div>
    )}
    </>
  );
};

const StaffCard: React.FC<{ staff: StaffMember }> = ({ staff }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all bg-white shadow-sm">
    <img 
      src={staff.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=random`} 
      alt={staff.name} 
      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" 
    />
    <div>
      <div className="flex flex-wrap gap-1 mb-1">
         {staff.roles.map(r => (
            <span key={r} className="text-[10px] font-bold uppercase tracking-wide text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{r}</span>
         ))}
      </div>
      <p className="text-sm font-bold text-gray-800">{staff.name}</p>
      {staff.englishName && <p className="text-xs text-gray-400">{staff.englishName}</p>}
    </div>
  </div>
);
