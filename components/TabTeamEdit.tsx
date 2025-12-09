
import React, { useState } from 'react';
import { Users, Trash2, Plus, X, Search, User } from 'lucide-react';
import { EventItem, StaffMember } from '../types';

interface TabTeamEditProps {
  event: EventItem;
  staffList: StaffMember[];
  onChange: (event: EventItem) => void;
}

export const TabTeamEdit: React.FC<TabTeamEditProps> = ({ event, staffList, onChange }) => {
  const [newRole, setNewRole] = useState('Host');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeReqId, setActiveReqId] = useState<string | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');

  // Helpers to update requirements
  const updateRequirements = (updater: (reqs: typeof event.staffRequirements) => typeof event.staffRequirements) => {
     const newRequirements = updater([...event.staffRequirements]);
     // Update staffIds based on requirements
     const newStaffIds = newRequirements.flatMap(req => req.members.map(m => m.id));
     
     onChange({
        ...event,
        staffRequirements: newRequirements,
        staffIds: newStaffIds
     });
  };

  const handleAddRole = () => {
    updateRequirements(reqs => [
       ...reqs,
       { roleName: newRole, required: 1, assigned: 0, members: [] }
    ]);
  };

  const handleDeleteRole = (index: number) => {
    updateRequirements(reqs => reqs.filter((_, i) => i !== index));
  };

  const handleUpdateCount = (index: number, delta: number) => {
    updateRequirements(reqs => {
       const req = reqs[index];
       const newCount = Math.max(req.assigned, req.required + delta);
       reqs[index] = { ...req, required: newCount };
       return reqs;
    });
  };

  const handleRemoveMember = (roleIndex: number, memberId: string) => {
    updateRequirements(reqs => {
       const req = reqs[roleIndex];
       req.members = req.members.filter(m => m.id !== memberId);
       req.assigned = req.members.length;
       return reqs;
    });
  };

  const handleAddMember = (staff: StaffMember) => {
    if (activeReqId !== null) {
       // activeReqId here is actually the index in this simple implementation context or we need to add IDs to requirements in EventItem type proper, 
       // but EventItem.staffRequirements doesn't have IDs in type definition. 
       // We'll use index for now since we map over it.
       const index = parseInt(activeReqId); 
       updateRequirements(reqs => {
          const req = reqs[index];
          if (!req.members.find(m => m.id === staff.id)) {
             req.members.push(staff);
             req.assigned = req.members.length;
          }
          return reqs;
       });
       setIsPickerOpen(false);
       setPickerSearch('');
    }
  };

  // Filter staff for picker
  const getFilteredStaff = () => {
     const currentAssignedIds = event.staffIds;
     return staffList.filter(s => 
        !currentAssignedIds.includes(s.id) && 
        (s.name.toLowerCase().includes(pickerSearch.toLowerCase()) || s.roles.some(r => r.toLowerCase().includes(pickerSearch.toLowerCase())))
     );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Add Role Section */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
         <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Add New Role Group</label>
            <select 
               value={newRole}
               onChange={(e) => setNewRole(e.target.value)}
               className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
            >
               {['Host', 'IT Support', 'Manager', 'Coordinator', 'Security', 'Sound Engineer'].map(r => (
                  <option key={r} value={r}>{r}</option>
               ))}
            </select>
         </div>
         <button 
            onClick={handleAddRole}
            className="self-end px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
         >
            Add Role
         </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {event.staffRequirements.map((req, index) => {
          const isComplete = req.assigned >= req.required;
          return (
            <div key={index} className={`rounded-xl border shadow-sm flex flex-col ${isComplete ? 'bg-green-50/30 border-green-200' : 'bg-amber-50/30 border-amber-200'}`}>
              
              {/* Card Header */}
              <div className="px-4 py-3 border-b border-gray-200/50 flex justify-between items-center bg-white/50">
                 <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-800">{req.roleName}</h4>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isComplete ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                       {req.assigned} / {req.required}
                    </span>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg h-7">
                       <button 
                          onClick={() => handleUpdateCount(index, -1)}
                          disabled={req.required <= 1 || req.required <= req.assigned}
                          className="w-7 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 disabled:opacity-30"
                       >
                          -
                       </button>
                       <button 
                          onClick={() => handleUpdateCount(index, 1)}
                          className="w-7 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 border-l border-gray-200"
                       >
                          +
                       </button>
                    </div>
                    <button 
                       onClick={() => handleDeleteRole(index)}
                       className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                       <Trash2 size={16} />
                    </button>
                 </div>
              </div>

              {/* Members List */}
              <div className="p-4 space-y-2 flex-1">
                 {req.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                       <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                             {member.name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-700 truncate">{member.name}</span>
                       </div>
                       <button 
                          onClick={() => handleRemoveMember(index, member.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                       >
                          <X size={14} />
                       </button>
                    </div>
                 ))}
                 
                 {/* Add Button */}
                 {req.assigned < req.required && (
                    <button 
                       onClick={() => {
                          setActiveReqId(index.toString());
                          setIsPickerOpen(true);
                       }}
                       className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-sm font-medium hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                    >
                       <Plus size={16} /> Assign Staff
                    </button>
                 )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Picker Modal */}
      {isPickerOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[80vh]">
               <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Select Staff</h3>
                  <button onClick={() => setIsPickerOpen(false)} className="text-gray-400 hover:text-gray-600">
                     <X size={20} />
                  </button>
               </div>
               
               <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                     <input 
                        type="text" 
                        placeholder="Search staff..." 
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                        value={pickerSearch}
                        onChange={(e) => setPickerSearch(e.target.value)}
                     />
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
                  {getFilteredStaff().map(staff => (
                     <button 
                        key={staff.id}
                        onClick={() => handleAddMember(staff)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors text-left group"
                     >
                        <div className="relative">
                           <img 
                              src={staff.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}`}
                              alt={staff.name} 
                              className="w-10 h-10 rounded-full border border-gray-200 group-hover:border-blue-200"
                           />
                           <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${staff.status === 'Busy' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        </div>
                        <div>
                           <p className="text-sm font-bold text-gray-900">{staff.name}</p>
                           <p className="text-xs text-gray-500">{staff.roles.join(', ')}</p>
                        </div>
                     </button>
                  ))}
                  {getFilteredStaff().length === 0 && (
                     <div className="py-8 text-center text-gray-400">
                        <User size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No available staff found</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
