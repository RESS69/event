
import React from 'react';
import { Box, Package, ShieldCheck } from 'lucide-react';
import { EventItem } from '../types';
import { PACKAGE_DATA } from '../constants';

interface TabEquipmentProps {
  event: EventItem;
}

export const TabEquipment: React.FC<TabEquipmentProps> = ({ event }) => {
  const packages = PACKAGE_DATA.map(pkg => ({
    ...pkg,
    features: pkg.items,
    selected: pkg.id === event.packageId
  }));

  const equipmentList = event.equipmentList || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Package Selection Display */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">Selected Package</h3>
        </div>
        
        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-4 pb-4 -mx-2 px-2 snap-x custom-scrollbar">
            {packages.map((pkg, index) => (
                <div 
                    key={index}
                    className={`
                        relative flex-shrink-0 w-80 rounded-xl border-2 p-6 transition-all snap-center bg-white
                        ${pkg.selected ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 opacity-70 hover:opacity-100'}
                    `}
                >
                    {pkg.selected && (
                    <div className="absolute top-4 right-4">
                        <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    )}
                    <h4 className="font-bold text-lg mb-2 text-gray-800">{pkg.name}</h4>
                    <ul className="space-y-2 text-sm text-gray-600 mt-4">
                        {pkg.features.slice(0, 5).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 truncate">• {feature}</li>
                        ))}
                        {pkg.features.length > 5 && (
                           <li className="text-xs text-gray-400 italic pl-3">+ {pkg.features.length - 5} more items</li>
                        )}
                    </ul>
                </div>
            ))}
        </div>
        
        <div className="mt-2 flex items-center gap-2 text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100 inline-block">
           * Cannot remove items from the fixed package. Add items to "Extra" if needed.
        </div>
      </div>

      {/* Equipment List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Equipment List</h3>
          </div>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
            Total Items: {equipmentList.reduce((acc, item) => acc + item.inPackage + item.extra, 0)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-1/2">Items</th>
                <th className="px-6 py-4 text-center">In Pkg</th>
                <th className="px-6 py-4 text-center bg-blue-50/50 text-blue-700">Extra</th>
                <th className="px-6 py-4 text-center font-bold text-gray-800">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {equipmentList.map((item) => {
                const total = item.inPackage + item.extra;
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-800">{item.name}</td>
                    <td className="px-6 py-3 text-center text-gray-500">{item.inPackage}</td>
                    <td className="px-6 py-3 text-center bg-blue-50/10">
                      {item.extra > 0 ? (
                        <span className="text-blue-600 font-bold">+{item.extra}</span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-gray-900 bg-gray-50/30">
                      {total} <span className="text-xs font-normal text-gray-500 ml-1">units</span>
                    </td>
                  </tr>
                );
              })}
              {equipmentList.length === 0 && (
                 <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400">No detailed equipment list available.</td>
                 </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
               <tr>
                 <td colSpan={4} className="px-6 py-3 text-xs text-center text-gray-500">
                   Items not listed in the package must be added via the "Add Extra" request flow.
                 </td>
               </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
