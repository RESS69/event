
import React, { useState } from 'react';
import { Package, Search, Plus, Minus, X, Box } from 'lucide-react';
import { EventItem, EquipmentItem, PackageItem } from '../types';

interface TabEquipmentEditProps {
  event: EventItem;
  equipmentList: EquipmentItem[];
  packages: PackageItem[];
  onChange: (event: EventItem) => void;
}

export const TabEquipmentEdit: React.FC<TabEquipmentEditProps> = ({ event, equipmentList, packages, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const currentPackage = packages.find(p => p.id === event.packageId) || packages[0];
  const currentEquipList = event.equipmentList || [];

  const handlePackageChange = (pkgId: string) => {
    // When package changes, update packageId. 
    // In a real app, you might also want to reset or recalculate 'inPackage' counts in equipmentList
    // For this mock, we assume equipmentList 'inPackage' is static or handled by backend logic on save.
    // We'll just update the ID for now.
    onChange({ ...event, packageId: pkgId });
  };

  const updateEquipmentList = (updater: (list: typeof event.equipmentList) => typeof event.equipmentList) => {
     onChange({ ...event, equipmentList: updater([...event.equipmentList]) });
  };

  const handleAddExtra = (item: EquipmentItem) => {
     updateEquipmentList(list => {
        const existing = list.find(e => e.name === item.name);
        if (existing) {
           existing.extra += 1;
           return list;
        } else {
           // If not in list, add it
           return [...list, { id: item.id, name: item.name, inPackage: 0, extra: 1 }];
        }
     });
  };

  const handleUpdateExtra = (itemName: string, delta: number) => {
     updateEquipmentList(list => {
        const item = list.find(e => e.name === itemName);
        if (item) {
           item.extra = Math.max(0, item.extra + delta);
           // If it becomes 0 extra and 0 inPackage, optionally remove it? 
           // Keeping it if inPackage > 0
           if (item.extra === 0 && item.inPackage === 0) {
              return list.filter(e => e.name !== itemName);
           }
        }
        return list;
     });
  };

  const filteredAvailableEquipment = equipmentList.filter(e => 
     e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Package Selector */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
         <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="text-blue-600" /> Package Selection
         </h3>
         <div className="flex overflow-x-auto gap-4 pb-4 -mx-2 px-2 custom-scrollbar snap-x">
            {packages.map(pkg => {
               const isSelected = pkg.id === event.packageId;
               return (
                  <button 
                     key={pkg.id}
                     onClick={() => handlePackageChange(pkg.id)}
                     className={`flex-shrink-0 w-72 p-5 rounded-xl border-2 text-left transition-all relative snap-center ${
                        isSelected 
                           ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20' 
                           : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                     }`}
                  >
                     <div className="font-bold text-gray-900 mb-1">{pkg.name}</div>
                     <div className="text-sm text-gray-500 mb-3">{pkg.items.length} items</div>
                     <div className={`text-xs font-bold px-2 py-1 rounded inline-block ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {isSelected ? 'Selected' : 'Select'}
                     </div>
                  </button>
               );
            })}
         </div>
      </div>

      {/* Equipment List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* List View */}
         <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
               <h4 className="font-bold text-gray-800">Current Equipment List</h4>
               <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-500">
                  Total Items: {currentEquipList.reduce((acc, item) => acc + item.inPackage + item.extra, 0)}
               </span>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full text-sm">
                  <thead className="bg-white text-gray-500 border-b border-gray-100">
                     <tr>
                        <th className="px-6 py-3 text-left font-semibold">Item</th>
                        <th className="px-6 py-3 text-center font-semibold w-24">In Pkg</th>
                        <th className="px-6 py-3 text-center font-semibold w-32 bg-blue-50/30 text-blue-700">Extra</th>
                        <th className="px-6 py-3 text-center font-semibold w-24">Total</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                     {currentEquipList.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                           <td className="px-6 py-3 font-medium text-gray-900">{item.name}</td>
                           <td className="px-6 py-3 text-center text-gray-500">{item.inPackage}</td>
                           <td className="px-6 py-3 text-center bg-blue-50/10">
                              <div className="flex items-center justify-center gap-2">
                                 <button 
                                    onClick={() => handleUpdateExtra(item.name, -1)}
                                    disabled={item.extra <= 0}
                                    className="w-6 h-6 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                 >
                                    -
                                 </button>
                                 <span className="w-6 text-center font-bold text-blue-600">{item.extra}</span>
                                 <button 
                                    onClick={() => handleUpdateExtra(item.name, 1)}
                                    className="w-6 h-6 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                                 >
                                    +
                                 </button>
                              </div>
                           </td>
                           <td className="px-6 py-3 text-center font-bold text-gray-900">{item.inPackage + item.extra}</td>
                        </tr>
                     ))}
                     {currentEquipList.length === 0 && (
                        <tr>
                           <td colSpan={4} className="py-8 text-center text-gray-400">No equipment listed.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Add Equipment Panel */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-100">
               <h4 className="font-bold text-gray-800 mb-3">Add Extra Equipment</h4>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                     type="text" 
                     placeholder="Search item..." 
                     className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-2">
               {filteredAvailableEquipment.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-all group">
                     <div>
                        <p className="text-sm font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.category}</p>
                     </div>
                     <button 
                        onClick={() => handleAddExtra(item)}
                        className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-600 hover:text-white transition-colors"
                     >
                        <Plus size={16} />
                     </button>
                  </div>
               ))}
               {filteredAvailableEquipment.length === 0 && (
                  <div className="py-8 text-center text-gray-400 flex flex-col items-center">
                     <Box size={24} className="mb-2 opacity-30" />
                     <span className="text-xs">No items found</span>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
