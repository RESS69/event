import React, { useMemo, useState } from 'react';
import { Package, Tag, Box, Plus, Trash2, Search, Check } from 'lucide-react';
import { PackageItem, EquipmentItem } from '../types';

interface PackageFormProps {
  initialPackage?: PackageItem;
  equipmentList: EquipmentItem[];
  onSubmit: (pkg: PackageItem) => void;
}

interface InternalState {
  name: string;
  price: string;
  selectedEquipmentIds: string[];
  customItems: string[];
  newCustomItem: string;
}

export const PackageForm: React.FC<PackageFormProps> = ({
  initialPackage,
  equipmentList,
  onSubmit,
}) => {
  const [state, setState] = useState<InternalState>(() => {
    const selectedFromItems =
      initialPackage?.items
        ?.map(itemName => {
          const eq = equipmentList.find(e => e.name === itemName);
          return eq?.id;
        })
        .filter((id): id is string => Boolean(id)) ?? [];

    const customFromItems =
      initialPackage?.items?.filter(
        name => !equipmentList.some(e => e.name === name),
      ) ?? [];

    return {
      name: initialPackage?.name ?? '',
      price: initialPackage?.price ?? '',
      selectedEquipmentIds: selectedFromItems,
      customItems: customFromItems,
      newCustomItem: '',
    };
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const unique = new Set(equipmentList.map(e => e.category));
    return ['All', ...Array.from(unique).sort()];
  }, [equipmentList]);

  const filteredEquipment = useMemo(() => {
    let result = [...equipmentList];
    if (activeCategory !== 'All') {
      result = result.filter(eq => eq.category === activeCategory);
    }
    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase();
      result = result.filter(eq => eq.name.toLowerCase().includes(t));
    }
    return result;
  }, [equipmentList, activeCategory, searchTerm]);

  const toggleEquipment = (id: string) => {
    setState(prev => {
      const exists = prev.selectedEquipmentIds.includes(id);
      return {
        ...prev,
        selectedEquipmentIds: exists
          ? prev.selectedEquipmentIds.filter(x => x !== id)
          : [...prev.selectedEquipmentIds, id],
      };
    });
  };

  const addCustomItem = () => {
    if (!state.newCustomItem.trim()) return;
    setState(prev => ({
      ...prev,
      customItems: [...prev.customItems, prev.newCustomItem.trim()],
      newCustomItem: '',
    }));
  };

  const removeCustomItem = (index: number) => {
    setState(prev => ({
      ...prev,
      customItems: prev.customItems.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.name.trim()) {
      alert('กรุณากรอกชื่อ Package');
      return;
    }
    if (!state.price.trim()) {
      alert('กรุณากรอกราคา');
      return;
    }

    const selectedEquipNames = state.selectedEquipmentIds
      .map(id => equipmentList.find(e => e.id === id)?.name)
      .filter((name): name is string => Boolean(name));

    const pkg: PackageItem = {
      id: initialPackage?.id ?? `pkg-${Date.now()}`,
      name: state.name.trim(),
      price: state.price.trim(),
      items: [...selectedEquipNames, ...state.customItems],
    };

    onSubmit(pkg);
  };

  const isEditMode = Boolean(initialPackage);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic info */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Package className="text-blue-500" size={18} />
          Package Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Package Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={state.name}
              onChange={e => setState(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none"
              placeholder="Standard Seminar Package"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Tag
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={state.price}
                onChange={e => setState(prev => ({ ...prev, price: e.target.value }))}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none"
                placeholder="e.g. 50,000 THB"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Select equipment */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Box className="text-blue-500" size={18} />
            Included Equipment
          </h2>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search equipment..."
              className="pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs focus:bg-white focus:border-blue-500 outline-none"
            />
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* category filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium ${
                  active
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
          {filteredEquipment.map(eq => {
            const active = state.selectedEquipmentIds.includes(eq.id);
            return (
              <button
                key={eq.id}
                type="button"
                onClick={() => toggleEquipment(eq.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs text-left ${
                  active
                    ? 'bg-blue-50 border-blue-400 text-blue-800'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Box size={14} className="text-gray-400" />
                  <span className="font-medium">{eq.name}</span>
                  <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">
                    {eq.category}
                  </span>
                </span>
                {active && <Check size={14} className="text-blue-600" />}
              </button>
            );
          })}
          {filteredEquipment.length === 0 && (
            <div className="col-span-full text-center text-xs text-gray-400 py-6">
              No equipment found
            </div>
          )}
        </div>
      </section>

      {/* Custom items */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Tag className="text-blue-500" size={18} />
          Extra Items (Description only)
        </h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={state.newCustomItem}
            onChange={e =>
              setState(prev => ({
                ...prev,
                newCustomItem: e.target.value,
              }))
            }
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-blue-500 outline-none"
            placeholder="e.g. On-site support for 2 days"
          />
          <button
            type="button"
            onClick={addCustomItem}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 text-white text-xs font-medium hover:bg-black"
          >
            <Plus size={14} />
            Add
          </button>
        </div>

        {state.customItems.length > 0 && (
          <ul className="space-y-2">
            {state.customItems.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 text-xs text-gray-700"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeCustomItem(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() =>
            setState({
              name: initialPackage?.name ?? '',
              price: initialPackage?.price ?? '',
              selectedEquipmentIds: [],
              customItems: [],
              newCustomItem: '',
            })
          }
          className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-sm hover:bg-blue-700"
        >
          {isEditMode ? 'Save Changes' : 'Save Package'}
        </button>
      </div>
    </form>
  );
};
