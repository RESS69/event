
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
import { StaffMember, RoleType } from '../types';

interface StaffTableProps {
  data: StaffMember[];
  showInitials?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (staff: StaffMember) => void;
}

type SortKey = 'name' | 'email' | 'phone';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const RoleBadge: React.FC<{ role: RoleType }> = ({ role }) => {
  const getStyles = (r: RoleType) => {
    switch (r) {
      case RoleType.HOST:
        return 'bg-red-100 text-red-700 border-red-200';
      case RoleType.IT_SUPPORT:
        return 'bg-green-100 text-green-700 border-green-200';
      case RoleType.MANAGER:
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case RoleType.SECURITY:
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case RoleType.COORDINATOR:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyles(role)}`}>
      {role}
    </span>
  );
};

export const StaffTable: React.FC<StaffTableProps> = ({ data, showInitials = false, onDelete, onEdit }) => {
  // Local state to handle favorite toggling
  const [staffList, setStaffList] = useState<StaffMember[]>(data);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Update staff list when data prop changes (e.g. switching views)
  useEffect(() => {
    setStaffList(data);
    setCurrentPage(1);
    setSearchTerm('');
    setSelectedRoles([]);
  }, [data]);
  
  // Sorting State (Default: Name A-Z)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  
  // Role Filter State
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>([]);
  const [isRoleFilterOpen, setIsRoleFilterOpen] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);

  // Action Menu State
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Handle click outside for filter dropdown and action menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Close Role Filter
      if (filterRef.current && !filterRef.current.contains(target)) {
        setIsRoleFilterOpen(false);
      }

      // Close Action Menu if clicking outside the wrapper
      if (!(target as HTMLElement).closest('.action-menu-wrapper')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRoles]);

  const toggleRole = (role: RoleType) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role]
    );
  };

  const toggleFavorite = (id: string) => {
    setStaffList(current => current.map(staff => 
      staff.id === id ? { ...staff, isFavorite: !staff.isFavorite } : staff
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

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // 1. Filter
  const filteredData = staffList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoles.length === 0 || item.roles.some(r => selectedRoles.includes(r));
    
    return matchesSearch && matchesRole;
  });

  // 2. Sort (Favorites first, then Column Sort)
  const sortedData = [...filteredData].sort((a, b) => {
    // Priority 1: Favorites always on top
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }

    // Priority 2: Selected Column
    const aValue = a[sortConfig.key].toString().toLowerCase();
    const bValue = b[sortConfig.key].toString().toLowerCase();

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    
    return 0;
  });

  // 3. Pagination Logic
  const totalRows = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentPageData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  // Handlers for pagination
  const goToPage = (page: number) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

  const allRoles = Object.values(RoleType);
  const filteredRoles = allRoles.filter(r => r.toLowerCase().includes(roleSearchTerm.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col bg-gray-50/50">
      {/* Header Actions */}
      <div className="p-6 pb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-3 flex-1 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Multi-select Role Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsRoleFilterOpen(!isRoleFilterOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl shadow-sm transition-all text-sm font-medium ${
                selectedRoles.length > 0 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter size={16} />
              <span>Role</span>
              {selectedRoles.length > 0 && (
                <span className="flex items-center justify-center bg-blue-200 text-blue-700 text-[10px] font-bold h-5 min-w-[20px] px-1 rounded-full">
                  {selectedRoles.length}
                </span>
              )}
              <ChevronDown size={14} className={`transition-transform duration-200 ${isRoleFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isRoleFilterOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search roles..." 
                      className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={roleSearchTerm}
                      onChange={(e) => setRoleSearchTerm(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>
                
                <div className="max-h-64 overflow-y-auto custom-scrollbar p-1.5">
                  {filteredRoles.map(role => (
                    <button
                      key={role}
                      onClick={() => toggleRole(role)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                          selectedRoles.includes(role) 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-gray-300 group-hover:border-blue-400 bg-white'
                        }`}>
                          {selectedRoles.includes(role) && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-sm text-gray-700">{role}</span>
                      </div>
                      <div className="scale-90 origin-right">
                         <RoleBadge role={role} />
                      </div>
                    </button>
                  ))}
                  {filteredRoles.length === 0 && (
                    <div className="p-8 text-center">
                       <p className="text-sm text-gray-500">No roles found</p>
                    </div>
                  )}
                </div>
                
                {selectedRoles.length > 0 && (
                  <div className="p-2 bg-gray-50 border-t border-gray-100">
                    <button 
                      onClick={() => setSelectedRoles([])}
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

      {/* Table Container */}
      <div className="px-6 pb-6">
        <div className="flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm">
          {/* Added max-h to limit table height and allow internal scrolling, ensuring pagination remains visible */}
          <div className="overflow-auto custom-scrollbar max-h-[calc(100vh-240px)] min-h-[400px]">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="bg-gray-50/95 sticky top-0 z-10 backdrop-blur-sm shadow-sm ring-1 ring-black/5">
                <tr>
                  <th 
                    className="py-4 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group/th select-none w-[25%]"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group/th select-none w-[25%]"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      {getSortIcon('email')}
                    </div>
                  </th>
                  <th 
                    className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors group/th select-none w-[20%]"
                    onClick={() => handleSort('phone')}
                  >
                    <div className="flex items-center gap-2">
                      Phone number
                      {getSortIcon('phone')}
                    </div>
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">
                    Role
                  </th>
                  <th className="py-4 px-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-[10%]">
                    
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentPageData.map((staff) => (
                  <tr key={staff.id} className={`hover:bg-blue-50/30 transition-colors group ${staff.isFavorite ? 'bg-yellow-50/10' : ''}`}>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          {showInitials ? (
                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs ring-2 ring-white shadow-sm">
                               {getInitials(staff.name)}
                             </div>
                          ) : (
                            <img 
                              src={staff.avatarUrl} 
                              alt={staff.name} 
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" 
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {staff.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-200 bg-white text-blue-700 text-sm">
                        {staff.email}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-200 bg-white text-blue-700 text-sm">
                        {staff.phone}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {staff.roles.slice(0, 2).map(role => (
                          <RoleBadge key={role} role={role} />
                        ))}
                        {staff.roles.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                            +{staff.roles.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="relative flex items-center justify-end gap-2 action-menu-wrapper">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(staff.id);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            staff.isFavorite 
                              ? 'text-yellow-400 hover:bg-yellow-50' 
                              : 'text-gray-300 hover:bg-gray-100 hover:text-yellow-400'
                          }`}
                        >
                          <Star size={18} className={staff.isFavorite ? "fill-yellow-400" : ""} />
                        </button>
                        
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === staff.id ? null : staff.id);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {/* Action Dropdown */}
                          {openMenuId === staff.id && (
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                              <div className="p-1">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.(staff);
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
                                    onDelete?.(staff.id);
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
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                          <Search size={24} className="opacity-50" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No staff members found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer Pagination */}
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
