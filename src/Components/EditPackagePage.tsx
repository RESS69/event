
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, Save, Plus, Minus, Search, Box, 
  Volume2, Laptop, Video, Zap, Link2, Trash2 
} from 'lucide-react';
import { PackageItem, EquipmentItem } from '../types';

interface EditPackagePageProps {
  pkg: PackageItem;
  onBack: () => void;
  onSave: (pkg: PackageItem) => void;
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

const getCategoryIcon = (category: string) => {
  const lower = category.toLowerCase();
  if (lower.includes('audio') || lower.includes('sound')) return <Volume2 size={18} />;
  if (lower.includes('computer') || lower.includes('laptop')) return <Laptop size={18} />;
  if (lower.includes('video') || lower.includes('camera')) return <Video size={18} />;
  if (lower.includes('light')) return <Zap size={18} />;
  if (lower.includes('furniture')) return <Box size={18} />; 
  if (lower.includes('cable')) return <Link2 size={18} />; 
  return <Box size={18} />;
};

export const EditPackagePage: React.FC<EditPackagePageProps> = ({ pkg, onBack, onSave, equipmentList }) => {
  const [packageName, setPackageName] = useState(pkg.name);
  
  // Selected items with quantity
  const [selectedItems, setSelectedItems] = useState<{ id: string; name: string; category: string; quantity: number }[]>([]);
  
  useEffect(() => {
    // Hydrate selectedItems from pkg.items strings
    const hydrated = pkg.items.map((itemStr, idx) => {
        const { count, name } = parsePackageItem(itemStr);
        // Try to find matching equipment in list to get category and ID
        const matchedEquip = equipmentList.find(e => e.name === name);
        return {
            id: matchedEquip ? matchedEquip.id : `legacy-${idx}`,
            name: name,
            category: matchedEquip ? matchedEquip.category : 'Other',
            quantity: count
        };
    });
    setSelectedItems(hydrated);
  }, [pkg, equipmentList]);

  const [equipSearch, setEquipSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = new Set(equipmentList.map(e => e.category));
    return ['All', ...Array.from(cats).sort()];
  }, [equipmentList]);

  const { availableEquipment, groupedEquipment } = useMemo(() => {
    let filtered = equipmentList.filter(item => 
      item.name.toLowerCase().includes(equipSearch.toLowerCase())
    );

    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    let grouped: Record<string, EquipmentItem[]> | null = null;
    
    if (activeCategory === 'All') {
       grouped = {};
       filtered.forEach(item => {
          if (!grouped![item.category]) grouped![item.category] = [];
          grouped![item.category].push(item);
       });
    }

    return { availableEquipment: filtered, groupedEquipment: grouped };
  }, [equipmentList, equipSearch, activeCategory]);

  const handleQuantityChange = (item: EquipmentItem, delta: number) => {
    setSelectedItems(prev => {
      // Logic same as create
      const existingIndex = prev.findIndex(i => i.name === item.name); // Match by name to handle legacy items better
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQuantity = updated[existingIndex].quantity + delta;
        
        if (newQuantity <= 0) {
          return prev.filter((_, i) => i !== existingIndex);
        }
        
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQuantity };
        return updated;
      } else if (delta > 0) {
        return [...prev, { id: item.id, name: item.name, category: item.category, quantity: delta }];
      }
      
      return prev;
    });
  };

  const removeItem = (itemName: string) => {
    setSelectedItems(prev => prev.filter(i => i.name !== itemName));
  };

  const handleSubmit = () => {
    if (!packageName) {
      alert('Package Name is required');
      return;
    }
    if (selectedItems.length === 0) {
      alert('Please add at least one item to the package');
      return;
    }

    const itemStrings = selectedItems.map(i => 
      `${i.quantity}x ${i.name}`
    );

    const updatedPackage: PackageItem = {
      ...pkg,
      name: packageName,
      items: itemStrings
    };

    onSave(updatedPackage);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Edit Package</h1>
              <p className="text-sm text-gray-500">Update service package details</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={onBack}
               className="px-6 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
             >
               Cancel
             </button>
             <button 
               onClick={handleSubmit}
               className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-transform active:scale-95 flex items-center gap-2"
             >
               <Save size={18} />
               Save Changes
             </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-8 pb-20">
          
        {/* 1. Package Name */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Package Information
          </h3>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Package Name</label>
            <input 
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
            />
          </div>
        </section>

        {/* 2. Add Equipment */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Add Equipment
            </h3>

            <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-[420px] mb-6">
                <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search equipment items..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={equipSearch}
                            onChange={(e) => setEquipSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 custom-scrollbar snap-x">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all snap-start ${
                                    activeCategory === cat 
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' 
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {availableEquipment.length > 0 ? (
                        <>
                            {activeCategory === 'All' && groupedEquipment ? (
                                <div>
                                    {Object.entries(groupedEquipment).sort().map(([category, items]) => (
                                        <div key={category}>
                                            <div className="px-4 py-2 bg-gray-50 border-y border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0 z-0">
                                                {category}
                                            </div>
                                            {(items as EquipmentItem[]).map(item => {
                                                const addedItem = selectedItems.find(i => i.name === item.name);
                                                const qty = addedItem ? addedItem.quantity : 0;
                                                return (
                                                    <div key={item.id} className="group flex items-center justify-between p-4 border-b border-gray-100 hover:bg-blue-50/30 transition-colors last:border-b-0">
                                                        <div className="flex items-center gap-4 min-w-0">
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0">
                                                                {getCategoryIcon(item.category)}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-bold text-gray-900 truncate pr-4">{item.name}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-3 shrink-0">
                                                            {qty > 0 ? (
                                                                <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                                                                    <button 
                                                                        onClick={() => handleQuantityChange(item, -1)}
                                                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-l-lg transition-colors"
                                                                    >
                                                                        <Minus size={14} />
                                                                    </button>
                                                                    <span className="w-8 text-center text-sm font-bold text-blue-600">{qty}</span>
                                                                    <button 
                                                                        onClick={() => handleQuantityChange(item, 1)}
                                                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => handleQuantityChange(item, 1)}
                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-200 text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                                                                >
                                                                    <Plus size={18} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    {availableEquipment.map(item => {
                                        const addedItem = selectedItems.find(i => i.name === item.name);
                                        const qty = addedItem ? addedItem.quantity : 0;
                                        return (
                                            <div key={item.id} className="group flex items-center justify-between p-4 border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:text-blue-600 group-hover:bg-blue-100 transition-colors shrink-0">
                                                        {getCategoryIcon(item.category)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 truncate pr-4">{item.name}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3 shrink-0">
                                                    {qty > 0 ? (
                                                        <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                                                            <button 
                                                                onClick={() => handleQuantityChange(item, -1)}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-l-lg transition-colors"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-bold text-blue-600">{qty}</span>
                                                            <button 
                                                                onClick={() => handleQuantityChange(item, 1)}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleQuantityChange(item, 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 border border-gray-200 text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                                                        >
                                                            <Plus size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Box size={48} className="opacity-20 mb-4" />
                            <p className="text-sm font-medium">No items found.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>

        {/* 3. Selected Equipment Summary */}
        <section className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                <h4 className="text-sm font-bold text-gray-700">Selected Equipment Summary</h4>
                <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">
                Total: {selectedItems.reduce((acc, i) => acc + i.quantity, 0)} Items
                </span>
            </div>
            <table className="w-full text-sm">
                <thead className="bg-white text-gray-500 font-semibold border-b border-gray-100">
                <tr>
                    <th className="px-6 py-3 text-left font-medium text-xs uppercase tracking-wider w-2/3">Item Name</th>
                    <th className="px-6 py-3 text-center font-medium text-xs uppercase tracking-wider w-1/3">Quantity (Total)</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {selectedItems.map((item, idx) => {
                    // Match original item to get icon if possible
                    const originalItem = equipmentList.find(e => e.name === item.name) || { 
                      id: item.id,
                      name: item.name,
                      category: item.category,
                      total: 0,
                      isFavorite: false
                    } as EquipmentItem;

                    return (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 text-gray-900 font-medium">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                        {getCategoryIcon(item.category)}
                                    </div>
                                    <span>{item.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => handleQuantityChange(originalItem, -1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-8 text-center font-bold text-blue-600 text-base">{item.quantity}</span>
                                    <button 
                                        type="button" 
                                        onClick={() => handleQuantityChange(originalItem, 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm"
                                    >
                                        <Plus size={14} />
                                    </button>
                                    
                                    <div className="w-px h-6 bg-gray-200 mx-2"></div>

                                    <button 
                                        type="button"
                                        onClick={() => removeItem(item.name)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                {selectedItems.length === 0 && (
                    <tr>
                        <td colSpan={2} className="py-12 text-center text-gray-400 italic bg-gray-50/30">
                            No equipment selected.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </section>

      </div>
    </div>
  );
};