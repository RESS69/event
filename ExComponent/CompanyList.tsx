
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Star, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  ChevronDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ArrowDownAZ,
  Calendar
} from 'lucide-react';
import { CompanyItem } from '../types';

interface CompanyListProps {
  data: CompanyItem[];
  onCompanyClick?: (company: CompanyItem) => void;
  onDelete?: (id: string) => void;
  onEdit?: (company: CompanyItem) => void;
}

type SortOption = 'createdAt' | 'companyName';

export const CompanyList: React.FC<CompanyListProps> = ({ data, onCompanyClick, onDelete, onEdit }) => {
  const [companies, setCompanies] = useState<CompanyItem[]>(data);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('createdAt');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setCompanies(data);
    setCurrentPage(1);
    setSearchTerm('');
  }, [data]);

  useEffect(() => {
    // Reset pagination when filter changes
    setCurrentPage(1);
  }, [searchTerm]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest('.action-menu-wrapper')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFavorite = (id: string) => {
    setCompanies(current => current.map(comp => 
      comp.id === id ? { ...comp, isFavorite: !comp.isFavorite } : comp
    ));
  };

  // Filter
  const filteredData = companies.filter(item => {
    const term = searchTerm.toLowerCase();
    return item.companyName.toLowerCase().includes(term) || 
           item.contactPerson.toLowerCase().includes(term);
  });

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    // Always Favorites first
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;

    if (sortOption === 'companyName') {
      return a.companyName.localeCompare(b.companyName);
    } else {
      // Date Created Descending (Newest first) if using date
      // But usually lists default to Newest first, or user might want oldest.
      // Let's do default creation date: Newest First
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Pagination Logic
  const totalRows = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentPageData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50/50">
      {/* Toolbar */}
      <div className="p-6 pb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-3 flex-1 w-full">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search company or contact name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <div className="relative inline-block text-left">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="text-sm font-medium text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="companyName">Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* List Container */}
      <div className="px-6 pb-6 flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2 max-h-[calc(100vh-250px)]">
          {currentPageData.map((company) => (
            <div 
              key={company.id} 
              className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group cursor-pointer ${company.isFavorite ? 'ring-1 ring-yellow-400/50 bg-yellow-50/10' : ''}`}
              onClick={() => onCompanyClick?.(company)}
            >
              <div className="flex items-start gap-4">
                {/* Favorite Star */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(company.id);
                  }}
                  className={`mt-1 p-1.5 rounded-lg transition-colors ${
                    company.isFavorite 
                      ? 'text-yellow-400 hover:bg-yellow-50' 
                      : 'text-gray-300 hover:bg-gray-100 hover:text-yellow-400'
                  }`}
                >
                  <Star size={20} className={company.isFavorite ? "fill-yellow-400" : ""} />
                </button>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{company.companyName}</h3>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium text-gray-900">{company.contactPerson}</span>
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{company.role}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                        <Mail size={14} />
                      </div>
                      <span className="truncate">{company.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                        <Phone size={14} />
                      </div>
                      <span>{company.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Action Menu */}
                <div className="relative action-menu-wrapper">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === company.id ? null : company.id);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <MoreHorizontal size={20} />
                  </button>

                  {openMenuId === company.id && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                      <div className="p-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            onEdit?.(company);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <Edit size={14} className="text-gray-500" />
                          Edit
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(company.id);
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
            </div>
          ))}

          {sortedData.length === 0 && (
             <div className="flex flex-col items-center justify-center text-gray-400 py-12">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <Search size={32} className="opacity-50" />
               </div>
               <p className="text-lg font-medium text-gray-500">No companies found</p>
             </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="mt-4 bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600 shadow-sm">
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
  );
};
