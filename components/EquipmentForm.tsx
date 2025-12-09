import React, { useEffect, useRef, useState } from 'react';
import { Box, Tag, Search, ChevronDown, Check } from 'lucide-react';
import { EquipmentItem } from '../types';

interface EquipmentFormProps {
  initialItem?: EquipmentItem;
  onSubmit: (item: EquipmentItem) => void;
}

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  initialItem,
  onSubmit
}) => {
  const [formData, setFormData] = useState(() => ({
    name: initialItem?.name ?? '',
    category: initialItem?.category ?? 'Audio'
  }));

  const categories = ['Audio', 'Video', 'Lighting', 'Computer', 'Furniture', 'Cables', 'Other'];

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = categories.filter(c =>
    c.toLowerCase().includes(categorySearchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert('Equipment Name is required');
      return;
    }

    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    const base: EquipmentItem = initialItem ?? {
      id: `eq-${Date.now().toString()}`,
      name: '',
      category: 'Audio'
    };

    const result: EquipmentItem = {
      ...base,
      name: formData.name,
      category: formData.category
    };

    onSubmit(result);
  };

  const isEditMode = Boolean(initialItem);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Equipment Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Equipment Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Box
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="e.g. Wireless Microphone Set"
              />
            </div>
          </div>

          {/* Category */}
          <div ref={categoryDropdownRef}>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Category
            </label>

            <div className="relative">
              <Tag
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                size={18}
              />
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(o => !o)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none transition-all flex items-center justify-between hover:bg-gray-100"
              >
                <span
                  className={
                    formData.category
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-400'
                  }
                >
                  {formData.category || 'Select Category'}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform duration-200 ${
                    isCategoryDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-500 outline-none"
                        value={categorySearchTerm}
                        onChange={e => setCategorySearchTerm(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-56 overflow-y-auto custom-scrollbar">
                    {filteredCategories.map(category => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, category });
                          setIsCategoryDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Box size={16} className="text-gray-500" />
                          <span className="text-gray-800">{category}</span>
                        </span>
                        {formData.category === category && (
                          <Check size={16} className="text-blue-500" />
                        )}
                      </button>
                    ))}
                    {filteredCategories.length === 0 && (
                      <p className="text-center text-gray-400 text-sm py-3">
                        No categories found
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() =>
            setFormData({
              name: initialItem?.name ?? '',
              category: initialItem?.category ?? 'Audio'
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
          {isEditMode ? 'Save Changes' : 'Save Equipment'}
        </button>
      </div>
    </form>
  );
};
