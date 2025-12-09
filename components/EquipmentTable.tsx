
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Check, 
  ChevronDown, 
  X, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Edit, 
  Trash2
} from 'lucide-react';
import { EquipmentItem } from '../types';

interface EquipmentTableProps {
  data: EquipmentItem[];
  onDelete?: (id: string) => void;
  onEdit?: (item: EquipmentItem) => void;
}

type SortKey = 'name' | 'category';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const getStyles = (c: string) => {
    const lower = c.toLowerCase();
    if (lower.includes('audio')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (lower.includes('computer') || lower.includes('laptop')) return 'bg-green-100 text-green-700 border-green-200';
    if (lower.includes('video') || lower.includes('camera')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (lower.includes('light')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (lower.includes('furniture')) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (lower.includes('cable')) return 'bg-gray-100 text-gray-700 border-gray-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles(category)}`}>
      {['Audio', 'Computer', 'Video', 'Lighting'].some(k => category.includes(k)) && (
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStyles(category).replace('bg-', 'bg-current ').split(' ')[0]}`}></span>
      )}
      {category}
    </span>
  );
};

export const EquipmentTable: React.FC<EquipmentTableProps> = ({ data, onDelete, onEdit }) => {
  const [items, setItems] = useState<EquipmentItem[]>(data);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    setItems(data);
    setCurrentPage(1);
    setSearchTerm('');
    setSelectedCategories([]);
  }, [data]);
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (filterRef.current && !filterRef.current.contains(target)) {
        setIsCategoryFilterOpen(false);
      }
      if (!(target as HTMLElement).closest('.action-menu-wrapper')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const toggleFavorite = (id: string) => {
    setItems(current => current.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="text-gray-300 opacity-0 group-hover/th:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="text-blue-600" />
      : <ArrowDown size={14} className="text-blue-600" />;
  };

  const filteredData = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    return matchesSearch && matchesCategory;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
       const comp = aValue.localeCompare(bValue);
       return sortConfig.direction === 'asc' ? comp : -comp;
    }
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalRows = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentPageData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Extract unique categories
  const allCategories = Array.from(new Set(data.map(item => item.category))).sort() as string[];
  const filteredCategories = allCategories.filter(c => c.toLowerCase().includes(categorySearchTerm.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col bg-gray-50/50">
      <div className="p-6 pb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-3 flex-1 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search equipment..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl shadow-sm transition-all text-sm font-medium ${
                selectedCategories.length > 0 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter size={16} />
              <span>Category</span>
              {selectedCategories.length > 0 && (
                <span className="flex items-center justify-center bg-blue-200 text-blue-700 text-[10px] font-bold h-5 min-w-[20px] px-1 rounded-full">
                  {selectedCategories.length}
                </span>
              )}
              <ChevronDown size={14} className={`transition-transform duration-200 ${isCategoryFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryFilterOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search categories..." 
                      className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={categorySearchTerm}
                      onChange={(e) => setCategorySearchTerm(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                
                <div className="max-h-64 overflow-y-auto custom-scrollbar p-1.5">
                  {filteredCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                          selectedCategories.includes(category) 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-gray-300 group-hover:border-blue-400 bg-white'
                        }`}>
                          {selectedCategories.includes(category) && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-sm text-gray-700">{category}</span>
                      </div>
                    </button>
                  ))}
                  {filteredCategories.length === 0 && (
                    <div className="p-8 text-center">
                       <p className="text-sm text-gray-500">No categories found</p>
                    </div>
                  )}
                </div>
                
                {selectedCategories.length > 0 && (
                  <div className="p-2 bg-gray-50 border-t border-gray-100">
                    <button 
                      onClick={() => setSelectedCategories([])}
                      className="w-full py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <X size={14} />
                      Clear Selection
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="overflow-auto custom-scrollbar max-h-[calc(100vh-240px)] min-h-[400px]">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="bg-gray-50/95 sticky top-0 z-10 backdrop-blur-sm shadow-sm ring-1 ring-black/5">
                <tr>
                  <th 
                    className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group/th select-none w-[50%]"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group/th select-none w-[40%]"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-2">
                      Category
                      {getSortIcon('category')}
                    </div>
                  </th>
                  <th className="py-4 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentPageData.map((item) => (
                  <tr key={item.id} className={`hover:bg-blue-50/30 transition-colors group ${item.isFavorite ? 'bg-yellow-50/10' : ''}`}>
                    <td className="py-3 px-6">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <CategoryBadge category={item.category} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="relative flex items-center justify-end gap-2 action-menu-wrapper">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            item.isFavorite 
                              ? 'text-yellow-400 hover:bg-yellow-50' 
                              : 'text-gray-300 hover:bg-gray-100 hover:text-yellow-400'
                          }`}
                        >
                          <Star size={18} className={item.isFavorite ? "fill-yellow-400" : ""} />
                        </button>
                        
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === item.id ? null : item.id);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {openMenuId === item.id && (
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                              <div className="p-1">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.(item);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                >
                                  <Edit size={14} className="text-gray-500" />
                                  Edit
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(item.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {sortedData.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                          <Search size={24} className="opacity-50" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No equipment found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="border-t border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 bg-white rounded-b-2xl">
            <div className="font-medium">
              {totalRows} row(s) total.
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <div className="relative">
                  <select 
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-black text-white pl-3 pr-8 py-1 rounded-lg text-sm font-medium focus:outline-none cursor-pointer hover:bg-gray-800 transition-colors"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                 <span className="min-w-[80px] text-center">Page {currentPage} of {totalPages}</span>
                 <div className="flex items-center gap-1">
                    <button 
                      onClick={() => goToPage(1)} 
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-gray-500"
                    >
                      <ChevronsLeft size={18} />
                    </button>
                    <button 
                      onClick={() => goToPage(currentPage - 1)} 
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-gray-500"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      onClick={() => goToPage(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-gray-500"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <button 
                      onClick={() => goToPage(totalPages)} 
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-gray-500"
                    >
                      <ChevronsRight size={18} />
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};