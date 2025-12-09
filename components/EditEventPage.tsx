
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  X, Calendar, Clock, MapPin, Building2, FileText, 
  Package, Save, Plus, Trash2, Search, Users, 
  CheckCircle2, AlertCircle, ChevronDown, UploadCloud,
  Monitor, Wifi, ChevronLeft, ChevronRight, Check, Box, Minus, Star, Lock,
  Sun, Moon, Volume2, Laptop, Video, Zap, Link2, User, AlertTriangle, GripVertical, ArrowLeft, Map as MapIcon
} from 'lucide-react';
import { CompanyItem, PackageItem, EventItem, EventType, StaffMember, EquipmentItem, RoleType } from '../types';

interface EditEventPageProps {
  event: EventItem;
  onBack: () => void;
  onSave: (event: EventItem) => void;
  companies: CompanyItem[];
  packages: PackageItem[];
  staffList: StaffMember[];
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

// Helper to get category icon
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

// Roles matching the system RoleType for proper filtering
const AVAILABLE_ROLES = [
  'Host', 
  'IT Support', 
  'Manager', 
  'Coordinator', 
  'Security'
];

export const EditEventPage: React.FC<EditEventPageProps> = ({ 
  event,
  onBack, 
  onSave, 
  companies, 
  packages, 
  staffList, 
  equipmentList
}) => {
  // --- Form State Initialization ---
  const [formData, setFormData] = useState({
    title: event.title,
    type: event.type,
    companyId: event.companyId,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    description: event.description,
  });

  // --- Dynamic Sections State ---
  const [selectedPackageId, setSelectedPackageId] = useState<string>(event.packageId || '');
  const [selectedPeriod, setSelectedPeriod] = useState<'Morning' | 'Afternoon' | null>(null);
  
  // Package Carousel State
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);
  const [visiblePackages, setVisiblePackages] = useState(3);

  // Initialize Extra Equipment from Event Data
  const [extraEquipment, setExtraEquipment] = useState<{ id: string; name: string; quantity: number }[]>(() => {
    if (!event.equipmentList) return [];
    return event.equipmentList
        .filter(item => item.extra > 0)
        .map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.extra
        }));
  });

  // Initialize Staff Requirements from Event Data
  const [staffRequirements, setStaffRequirements] = useState<{ 
    id: string; 
    role: string; 
    count: number; 
    assigned: string[] 
  }[]>(() => {
      if (!event.staffRequirements) return [];
      return event.staffRequirements.map((req, idx) => ({
          id: `req-${idx}-${Date.now()}`,
          role: req.roleName,
          count: req.required,
          assigned: req.members.map(m => m.id)
      }));
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVisiblePackages(1);
      else if (window.innerWidth < 1280) setVisiblePackages(2);
      else setVisiblePackages(3);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextPackage = () => {
    if (currentPackageIndex + visiblePackages < packages.length) {
      setCurrentPackageIndex(currentPackageIndex + visiblePackages);
    }
  };

  const prevPackage = () => {
    const newIndex = currentPackageIndex - visiblePackages;
    setCurrentPackageIndex(newIndex < 0 ? 0 : newIndex);
  };
  
  const [equipSearch, setEquipSearch] = useState('');
  
  // Equipment Categories
  const equipmentCategories = React.useMemo(() => 
    ['All', ...Array.from(new Set(equipmentList.map(e => e.category))).sort()], 
  [equipmentList]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Map State
  const [mapPin, setMapPin] = useState<{x: number, y: number} | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState<{ x: number, y: number } | null>(null);
  
  // Auto-select package for Offline events
  useEffect(() => {
    if (formData.type === 'Offline' && packages.length > 0 && !selectedPackageId) {
      setSelectedPackageId(packages[0].id);
    }
  }, [formData.type, packages, selectedPackageId]);

  const [newRole, setNewRole] = useState('Host');
  const [newRoleCount, setNewRoleCount] = useState<number | ''>(1);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  // --- Staff Picker (Side Popover) State ---
  const [isStaffPickerOpen, setIsStaffPickerOpen] = useState(false);
  const [staffPickerTab, setStaffPickerTab] = useState<'Available' | 'Busy'>('Available');
  const [staffSearch, setStaffSearch] = useState('');
  const [activeAssignReqId, setActiveAssignReqId] = useState<string | null>(null);
  
  // --- Conflict Handling State ---
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

  // --- Role Dropdown State ---
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const staffPickerRef = useRef<HTMLDivElement>(null);

  // --- Company Combobox State ---
  const [isCompanyPickerOpen, setIsCompanyPickerOpen] = useState(false);
  const [companySearch, setCompanySearch] = useState('');
  const [highlightedCompanyIndex, setHighlightedCompanyIndex] = useState(0);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
        setIsCompanyPickerOpen(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update company search text when a company is selected via ID
  useEffect(() => {
    const selected = companies.find(c => c.id === formData.companyId);
    if (selected) {
      setCompanySearch(selected.companyName);
    }
  }, [formData.companyId, companies]);


  // Equipment Logic
  const handleAddEquipment = (item: EquipmentItem) => {
    handleQuantityChange(item.name, 0, 0, 1);
  };

  const handleRemoveEquipment = (item: EquipmentItem) => {
    const current = extraEquipment.find(e => e.name === item.name);
    if (current) {
       handleQuantityChange(item.name, 0, current.quantity, -1);
    }
  };

  const handleQuantityChange = (itemName: string, inPkg: number, currentExtra: number, delta: number) => {
    const newExtra = currentExtra + delta;
    if (newExtra < 0) return; 

    setExtraEquipment(prev => {
      const existingIndex = prev.findIndex(e => e.name === itemName);
      const masterItem = equipmentList.find(e => e.name === itemName);
      const itemId = masterItem?.id || `temp-${itemName}`;

      if (existingIndex >= 0) {
        const updated = [...prev];
        const updatedExtra = updated[existingIndex].quantity + delta;
        
        if (updatedExtra === 0) {
            return prev.filter((_, i) => i !== existingIndex);
        }
        
        updated[existingIndex] = { ...updated[existingIndex], quantity: updatedExtra };
        return updated;
      } else {
        return [...prev, { id: itemId, name: itemName, quantity: delta }];
      }
    });
  };


  // Staff Logic
  const handleAddRole = () => {
    if (!newRole) return;
    const countToAdd = (newRoleCount === '' || newRoleCount < 1) ? 1 : newRoleCount;

    setStaffRequirements(prev => {
      const existingIndex = prev.findIndex(r => r.role === newRole);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          count: updated[existingIndex].count + countToAdd
        };
        return updated;
      }

      return [
        ...prev, 
        { 
          id: Date.now().toString(), 
          role: newRole, 
          count: countToAdd, 
          assigned: [] 
        }
      ];
    });
    setNewRoleCount(1); 
  };

  const initiateRemoveRole = (id: string) => {
    setRoleToDelete(id);
  };

  const confirmDeleteRole = () => {
    if (roleToDelete) {
      setStaffRequirements(prev => prev.filter(r => r.id !== roleToDelete));
      setRoleToDelete(null);
    }
  };
  
  const updateRoleCount = (id: string, delta: number) => {
    setStaffRequirements(prev => prev.map(req => {
      if (req.id === id) {
        const minCount = Math.max(1, req.assigned.length);
        const newCount = Math.max(minCount, req.count + delta);
        return { ...req, count: newCount };
      }
      return req;
    }));
  };

  const assignStaffToRole = (reqId: string, staffId: string) => {
    setStaffRequirements(prev => prev.map(req => {
      if (req.id === reqId) {
        if (req.assigned.includes(staffId)) return req;
        if (req.assigned.length >= req.count) return req;
        return { ...req, assigned: [...req.assigned, staffId] };
      }
      return req;
    }));
  };

  const removeStaffFromRole = (reqId: string, staffId: string) => {
    setStaffRequirements(prev => prev.map(req => {
      if (req.id === reqId) {
        return { ...req, assigned: req.assigned.filter(id => id !== staffId) };
      }
      return req;
    }));
  };

  // --- Drag & Drop Logic ---
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
                conflictingEventName: 'Tech Summit 2024 (09:00 - 12:00)' 
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

  const handleModalMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTempLocation({ x, y });
  };

  const confirmLocation = () => {
    if (tempLocation) {
        setMapPin(tempLocation);
        const lat = (13.7 + (tempLocation.y / 1000)).toFixed(6);
        const lng = (100.5 + (tempLocation.x / 1000)).toFixed(6);
        setFormData(prev => ({ ...prev, location: `${lat}, ${lng}` }));
        setIsMapModalOpen(false);
    }
  };

  // Submit Handler
  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'Event Name is required';
    if (!formData.companyId) newErrors.companyId = 'Company is required';
    if (!formData.date) newErrors.date = 'Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo(0, 0);
      return;
    }

    const updatedEvent: EventItem = {
      ...event,
      ...formData,
      packageId: selectedPackageId,
      // Map local state to EventItem structure
      staffRequirements: staffRequirements.map(req => ({
        roleName: req.role,
        required: req.count,
        assigned: req.assigned.length,
        members: req.assigned.map(id => staffList.find(s => s.id === id)!).filter(Boolean)
      })),
      staffIds: staffRequirements.flatMap(r => r.assigned),
      // Merge package items and extra items into equipmentList
      equipmentList: [
          // We recreate the structure based on what's currently selected
          ...extraEquipment.map(e => ({
            id: e.id,
            name: e.name,
            inPackage: 0,
            extra: e.quantity
          })),
      ]
    };

    onSave(updatedEvent);
  };

  // --- Derived Data for Equipment Table ---
  const selectedPackage = packages.find(p => p.id === selectedPackageId);
  const combinedEquipment = new Map<string, { name: string; inPkg: number; extra: number }>();

  if (selectedPackage) {
    selectedPackage.items.forEach(itemStr => {
      const { count, name } = parsePackageItem(itemStr);
      combinedEquipment.set(name, { name, inPkg: count, extra: 0 });
    });
  }

  extraEquipment.forEach(item => {
    const existing = combinedEquipment.get(item.name) || { name: item.name, inPkg: 0, extra: 0 };
    combinedEquipment.set(item.name, { ...existing, extra: existing.extra + item.quantity });
  });

  const equipmentRows: { name: string; inPkg: number; extra: number }[] = Array.from(combinedEquipment.values());

  // --- Filtered Staff for Picker ---
  const getFilteredStaffForPicker = () => {
    const assignedIds = staffRequirements.flatMap(r => r.assigned);
    const activeReq = staffRequirements.find(r => r.id === activeAssignReqId);
    const targetRole = activeReq?.role;

    return staffList.filter(s => {
      const isAssignedHere = assignedIds.includes(s.id);
      if (isAssignedHere) return false;

      if (targetRole && !s.roles.includes(targetRole as any)) {
          return false;
      }

      const matchesSearch = s.name.toLowerCase().includes(staffSearch.toLowerCase()) || 
                            s.roles.some(r => r.toLowerCase().includes(staffSearch.toLowerCase()));
      
      const matchesTab = staffPickerTab === 'Available' 
          ? s.status !== 'Busy' 
          : s.status === 'Busy';

      return matchesSearch && matchesTab;
    });
  };

  // --- Derived Data for Company Combobox ---
  const { flatCompanyList, recentCompanies, groupedCompanies } = useMemo<{
    flatCompanyList: CompanyItem[];
    recentCompanies: CompanyItem[];
    groupedCompanies: Record<string, CompanyItem[]>;
  }>(() => {
    const searchLower = companySearch.toLowerCase();
    const selectedCompany = companies.find(c => c.id === formData.companyId);
    const isExactMatch = selectedCompany && selectedCompany.companyName === companySearch;

    const filtered = isExactMatch 
      ? companies 
      : companies.filter(c => 
          c.companyName.toLowerCase().includes(searchLower) || 
          c.contactPerson.toLowerCase().includes(searchLower)
        );
    
    const recent = filtered.filter(c => c.isFavorite).slice(0, 3);
    const others = filtered; 
    
    const groups: Record<string, CompanyItem[]> = {};
    others.forEach(c => {
       const letter = c.companyName.charAt(0).toUpperCase();
       const key = /[A-Z]/.test(letter) ? letter : '#';
       if (!groups[key]) groups[key] = [];
       groups[key].push(c);
    });

    const sortedGroups = Object.keys(groups).sort().reduce((acc, key) => {
      acc[key] = groups[key].sort((a, b) => a.companyName.localeCompare(b.companyName));
      return acc;
    }, {} as Record<string, CompanyItem[]>);

    const flatList: CompanyItem[] = [];
    if (recent.length > 0) flatList.push(...recent);
    Object.values(sortedGroups).forEach(group => flatList.push(...group));
    const uniqueFlatList = Array.from(new Set(flatList));

    return { 
       recentCompanies: recent, 
       groupedCompanies: sortedGroups, 
       flatCompanyList: uniqueFlatList 
    };
  }, [companies, companySearch, formData.companyId]);

  const handleCompanySelect = (company: CompanyItem) => {
    setFormData(prev => ({ ...prev, companyId: company.id }));
    setCompanySearch(company.companyName);
    setIsCompanyPickerOpen(false);
    if (errors.companyId) setErrors(prev => ({ ...prev, companyId: '' }));
  };

  const handleCompanyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedCompanyIndex(prev => prev < flatCompanyList.length - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedCompanyIndex(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatCompanyList[highlightedCompanyIndex]) {
        handleCompanySelect(flatCompanyList[highlightedCompanyIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsCompanyPickerOpen(false);
    }
  };

  useEffect(() => {
    setHighlightedCompanyIndex(0);
  }, [companySearch, isCompanyPickerOpen]);

  const filteredRoles = useMemo(() => {
    return AVAILABLE_ROLES.filter(r => r.toLowerCase().includes(roleSearchTerm.toLowerCase()));
  }, [roleSearchTerm]);

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

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      
      {/* Page Header */}
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
              <h1 className="text-xl font-bold text-gray-900">Edit Event</h1>
              <p className="text-sm text-gray-500">Update event details and requirements</p>
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
              onClick={handleSave}
              className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-transform active:scale-95 flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8 pb-20">
          
        {/* 1. Basic Information */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Name</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${errors.title ? 'border-red-300' : 'border-gray-200'}`}
                placeholder="e.g. Annual Tech Conference 2024"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Company Searchable Combobox */}
            <div className="relative" ref={companyDropdownRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  placeholder="Select company..."
                  value={companySearch}
                  onChange={(e) => {
                    setCompanySearch(e.target.value);
                    setIsCompanyPickerOpen(true);
                    if (formData.companyId) setFormData(prev => ({ ...prev, companyId: '' })); 
                  }}
                  onFocus={() => setIsCompanyPickerOpen(true)}
                  onKeyDown={handleCompanyKeyDown}
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${errors.companyId ? 'border-red-300' : 'border-gray-200'}`}
                />
                <ChevronDown 
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-transform ${isCompanyPickerOpen ? 'rotate-180' : ''}`} 
                  size={16} 
                />
              </div>
              
              {isCompanyPickerOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
                  {flatCompanyList.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                       <Building2 size={24} className="mx-auto mb-2 opacity-50" />
                       <p className="text-sm">No companies found.</p>
                    </div>
                  ) : (
                    <div className="py-2">
                       {recentCompanies.length > 0 && !companySearch && (
                          <div className="mb-2">
                             <h5 className="px-4 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-y border-gray-100">Recent & Favorites</h5>
                             {recentCompanies.map(c => (
                                 <button
                                   key={`recent-${c.id}`}
                                   onClick={() => handleCompanySelect(c)}
                                   className={`w-full text-left px-4 py-2.5 flex items-center justify-between group transition-colors hover:bg-gray-50`}
                                 >
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                          {c.companyName.charAt(0)}
                                       </div>
                                       <div>
                                          <p className="text-sm font-semibold text-gray-900">{c.companyName}</p>
                                          <p className="text-xs text-gray-500">{c.contactPerson}</p>
                                       </div>
                                    </div>
                                    {c.isFavorite && <Star size={14} className="fill-yellow-400 text-yellow-400" />}
                                 </button>
                             ))}
                          </div>
                       )}

                       {Object.entries(groupedCompanies).map(([letter, items]) => (
                          <div key={letter}>
                             <h5 className="px-4 py-1.5 text-xs font-bold text-gray-500 bg-gray-50 border-y border-gray-100 sticky top-0">{letter}</h5>
                             {(items as CompanyItem[]).map(c => (
                                 <button
                                   key={c.id}
                                   onClick={() => handleCompanySelect(c)}
                                   className={`w-full text-left px-4 py-2.5 flex items-center justify-between group transition-colors hover:bg-gray-50 ${formData.companyId === c.id ? 'bg-blue-50' : ''}`}
                                 >
                                    <div className="flex items-center gap-3">
                                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${formData.companyId === c.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                          {c.companyName.charAt(0)}
                                       </div>
                                       <div>
                                          <p className={`text-sm font-semibold ${formData.companyId === c.id ? 'text-blue-700' : 'text-gray-900'}`}>
                                            {c.companyName}
                                          </p>
                                          <p className="text-xs text-gray-500">{c.contactPerson}</p>
                                       </div>
                                    </div>
                                    {formData.companyId === c.id && <Check size={16} className="text-blue-600" />}
                                 </button>
                             ))}
                          </div>
                       ))}
                    </div>
                  )}
                </div>
              )}
              {errors.companyId && <p className="text-xs text-red-500 mt-1">{errors.companyId}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type</label>
              <div className="flex bg-gray-100 p-1.5 rounded-xl">
                {(['Offline', 'Hybrid', 'Online'] as EventType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type }))}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      formData.type === type 
                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {type === 'Offline' && <Building2 size={16} />}
                    {type === 'Online' && <Wifi size={16} />}
                    {type === 'Hybrid' && <Monitor size={16} />}
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Schedule & Location */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Schedule
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none ${errors.date ? 'border-red-300' : 'border-gray-200'}`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="time" 
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="time" 
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Time Period <span className="text-gray-400 font-normal text-xs ml-1">(Quick Select)</span></label>
                 <button
                    type="button"
                    onClick={() => setSelectedPeriod('Morning')}
                    className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 group ${
                        selectedPeriod === 'Morning'
                            ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-orange-200 hover:bg-orange-50/30'
                    }`}
                >
                    <Sun size={20} className={selectedPeriod === 'Morning' ? 'fill-orange-500 text-orange-500' : 'text-gray-400 group-hover:text-orange-400'} />
                    <span className="font-bold text-sm">Morning</span>
                </button>
              </div>

              <div>
                 <label className="hidden md:block text-sm font-semibold text-transparent mb-2 select-none">Period</label>
                 <button
                    type="button"
                    onClick={() => setSelectedPeriod('Afternoon')}
                    className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 group ${
                        selectedPeriod === 'Afternoon'
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-indigo-200 hover:bg-indigo-50/30'
                    }`}
                >
                    <Moon size={20} className={selectedPeriod === 'Afternoon' ? 'fill-indigo-500 text-indigo-500' : 'text-gray-400 group-hover:text-indigo-400'} />
                    <span className="font-bold text-sm">Afternoon</span>
                </button>
              </div>
          </div>

          {formData.type !== 'Online' && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Venue Location</label>
              
              <div className="flex flex-col gap-4">
                 
                 {/* Map Visualization */}
                 <div className="w-full">
                    <div 
                      className="relative w-full h-64 bg-slate-100 rounded-xl border border-gray-200 overflow-hidden cursor-pointer group hover:ring-2 hover:ring-blue-400 transition-all"
                      onClick={() => setIsMapModalOpen(true)}
                    >
                        {/* Map Background Pattern */}
                        <div className="absolute inset-0 opacity-40" 
                             style={{ 
                               backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, transparent 1px)', 
                               backgroundSize: '20px 20px', 
                               backgroundPosition: '0 0, 10px 10px' 
                             }} 
                        />
                        <div className="absolute top-1/4 left-0 w-full h-4 bg-white/60"></div>
                        <div className="absolute top-0 left-1/3 w-4 h-full bg-white/60"></div>
                        <div className="absolute bottom-1/3 left-0 w-full h-3 bg-white/60 rotate-12 origin-left"></div>

                        <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-[10px] font-bold text-gray-500 pointer-events-none">MAP VIEW</div>
                        
                        {(mapPin || formData.location) ? (
                           <div 
                              className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 ease-out"
                              style={{ 
                                 left: mapPin ? `${mapPin.x}%` : '50%', 
                                 top: mapPin ? `${mapPin.y}%` : '50%' 
                              }}
                           >
                              <MapPin className="w-10 h-10 text-red-600 drop-shadow-lg fill-red-600 animate-bounce" />
                              <div className="w-3 h-3 bg-black/20 rounded-full blur-[2px] absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1"></div>
                              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded text-[10px] font-bold shadow-sm whitespace-nowrap border border-gray-200 text-gray-600">
                                 {formData.location || "Selected Location"}
                              </span>
                           </div>
                        ) : (
                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-600 bg-white/80 px-4 py-2 rounded-lg shadow-sm">
                                  <MapPin className="w-8 h-8 mb-1 opacity-50" />
                                  <span className="text-sm font-medium">Click to pin location on map</span>
                              </div>
                           </div>
                        )}
                    </div>
                 </div>
                 
                 {formData.location && (
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 ml-1">
                       <MapPin size={12} />
                       Current coordinates: <span className="font-mono font-medium text-gray-700">{formData.location}</span>
                    </p>
                 )}
              </div>
            </div>
          )}
        </section>

        {/* 3. Package Selection (Carousel) */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Package
          </h3>
          
          <div className="relative">
             <button 
                onClick={prevPackage}
                disabled={currentPackageIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 p-2 rounded-full bg-white shadow-lg border border-gray-100 transition-all duration-200 ${
                  currentPackageIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110 text-gray-700'
                }`}
              >
                <ChevronLeft size={24} />
              </button>

              <button 
                onClick={nextPackage}
                disabled={currentPackageIndex + visiblePackages >= packages.length}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 p-2 rounded-full bg-white shadow-lg border border-gray-100 transition-all duration-200 ${
                  currentPackageIndex + visiblePackages >= packages.length ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110 text-gray-700'
                }`}
              >
                <ChevronRight size={24} />
              </button>

              <div className="overflow-hidden px-1 py-1 -mx-1">
                <div 
                  className="flex gap-6 transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentPackageIndex * (100 / visiblePackages)}%)` }}
                >
                  {packages.map(pkg => {
                    const isOfflineMode = formData.type === 'Offline';
                    const isSelected = selectedPackageId === pkg.id;
                    const isDisabled = isOfflineMode && !isSelected;

                    return (
                      <div 
                        key={pkg.id}
                        className="flex-none transition-all duration-300"
                        style={{ width: `calc((100% - ${(visiblePackages - 1) * 24}px) / ${visiblePackages})` }}
                      >
                        <div 
                          onClick={() => !isDisabled && setSelectedPackageId(pkg.id)}
                          className={`
                            h-full rounded-2xl border-2 p-6 transition-all relative flex flex-col 
                            ${isSelected 
                              ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/10 cursor-default' 
                              : isDisabled 
                                ? 'border-gray-100 bg-gray-50/50 opacity-50 cursor-not-allowed grayscale' 
                                : 'border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer'
                            }
                          `}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${isSelected ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                              <Package size={24} />
                            </div>
                            {isSelected && (
                              <div className="text-blue-600 flex items-center gap-1 bg-blue-100 px-2 py-0.5 rounded-lg">
                                {isOfflineMode && <Lock size={12} />}
                                <span className="text-xs font-bold">{isOfflineMode ? 'Auto-Selected' : 'Selected'}</span>
                                <CheckCircle2 size={16} className="fill-blue-100" />
                              </div>
                            )}
                          </div>
                          <h4 className="font-bold text-xl text-gray-900 mb-2">{pkg.name}</h4>
                          <p className="text-sm text-gray-500 mb-4">{pkg.items.length} items included</p>
                          <ul className="space-y-2 mb-6 flex-1">
                             {pkg.items.slice(0, 4).map((item, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                   <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-blue-400' : 'bg-gray-300'}`}></span>
                                   {item}
                                </li>
                             ))}
                             {pkg.items.length > 4 && (
                                <li className="text-xs text-gray-400 italic pl-3.5">+ {pkg.items.length - 4} more items</li>
                             )}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
          </div>
        </section>

        {/* 4. Equipment */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Equipment
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
                        {equipmentCategories.map(cat => (
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
                                                const addedItem = extraEquipment.find(e => e.name === item.name);
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
                                                                        onClick={() => handleRemoveEquipment(item)}
                                                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-l-lg transition-colors"
                                                                    >
                                                                        <Minus size={14} />
                                                                    </button>
                                                                    <span className="w-8 text-center text-sm font-bold text-blue-600">{qty}</span>
                                                                    <button 
                                                                        onClick={() => handleAddEquipment(item)}
                                                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                                                                    >
                                                                        <Plus size={14} />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => handleAddEquipment(item)}
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
                                        const addedItem = extraEquipment.find(e => e.name === item.name);
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
                                                                onClick={() => handleRemoveEquipment(item)}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-l-lg transition-colors"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-bold text-blue-600">{qty}</span>
                                                            <button 
                                                                onClick={() => handleAddEquipment(item)}
                                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-r-lg transition-colors"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleAddEquipment(item)}
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
                            <p className="text-xs mt-1 opacity-70">Try changing category or search terms.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                 <h4 className="text-sm font-bold text-gray-700">Selected Equipment Summary</h4>
                 <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">
                    Total: {equipmentRows.reduce((acc, row) => acc + row.inPkg + row.extra, 0)} Items
                 </span>
              </div>
              <table className="w-full text-sm">
                  <thead className="bg-white text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium text-xs uppercase tracking-wider">Item Name</th>
                        <th className="px-6 py-3 text-center w-32 font-medium text-xs uppercase tracking-wider">In Pkg</th>
                        <th className="px-6 py-3 text-center w-40 font-medium text-xs uppercase tracking-wider bg-blue-50/30 text-blue-700">Extra</th>
                        <th className="px-6 py-3 text-center w-32 font-medium text-xs uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {equipmentRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-3 text-gray-900 font-medium">{row.name}</td>
                          <td className="px-6 py-3 text-center text-gray-500">{row.inPkg}</td>
                          <td className="px-6 py-3 text-center bg-blue-50/10">
                                <div className="flex items-center justify-center gap-3">
                                    <button 
                                      type="button" 
                                      onClick={() => handleQuantityChange(row.name, row.inPkg, row.extra, -1)}
                                      className={`w-6 h-6 flex items-center justify-center rounded border transition-colors shadow-sm ${
                                        row.extra > 0 
                                          ? 'bg-white border-gray-200 hover:bg-gray-50 text-gray-600' 
                                          : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                                      }`}
                                      disabled={row.extra <= 0}
                                    >
                                      -
                                    </button>
                                    <span className={`w-6 text-center font-bold ${row.extra !== 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                       {row.extra > 0 ? `+${row.extra}` : row.extra}
                                    </span>
                                    <button 
                                      type="button" 
                                      onClick={() => handleQuantityChange(row.name, row.inPkg, row.extra, 1)}
                                      className="w-6 h-6 flex items-center justify-center rounded bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors shadow-sm"
                                    >
                                      +
                                    </button>
                                </div>
                          </td>
                          <td className="px-6 py-3 text-center font-bold text-gray-900">{row.inPkg + row.extra}</td>
                        </tr>
                    ))}
                    {equipmentRows.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-gray-400 italic">
                            No equipment selected.
                          </td>
                        </tr>
                    )}
                  </tbody>
              </table>
            </div>
        </section>

        {/* 5. Staff */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Staff Management
            </h3>

            {/* Add Role Control */}
            <div className="flex flex-col sm:flex-row gap-6 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200 items-start">
              <div className="flex-1 w-full" ref={roleDropdownRef}>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Select Role</label>
                  
                  {/* Searchable Role Dropdown */}
                  <div className="relative">
                    <button 
                      type="button"
                      onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-gray-50 transition-all text-left"
                    >
                      <span className={newRole ? 'text-gray-900' : 'text-gray-500'}>{newRole || 'Select a role...'}</span>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isRoleDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <div className="p-2 border-b border-gray-100">
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
                        
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                          {filteredRoles.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">No roles found</div>
                          ) : (
                            filteredRoles.map(role => (
                              <button
                                key={role}
                                onClick={() => {
                                  setNewRole(role);
                                  setIsRoleDropdownOpen(false);
                                  setRoleSearchTerm('');
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left group ${
                                  newRole === role ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                }`}
                              >
                                <span className="text-sm font-medium">{role}</span>
                                {newRole === role && <Check size={14} className="text-blue-600" />}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
              </div>
              
              <div className="flex items-end gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                <div className="w-24">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Amount</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={newRoleCount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          setNewRoleCount('');
                        } else {
                          const num = parseInt(val);
                          setNewRoleCount(isNaN(num) ? '' : num);
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 text-center font-bold"
                    />
                </div>
                <button 
                    type="button" 
                    onClick={handleAddRole}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-blue-200 h-[42px]"
                >
                    Add
                </button>
              </div>
            </div>

            {/* Staff List Grid Layout & Popover Container */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staffRequirements.map((req, index) => {
                    const isComplete = req.assigned.length >= req.count;
                    const isActive = activeAssignReqId === req.id && isStaffPickerOpen;
                    const isRightColumn = index % 2 !== 0;

                    return (
                      <div key={req.id} className="relative group h-full">
                          <div 
                              className={`rounded-xl border-2 overflow-hidden transition-all duration-200 relative h-full flex flex-col ${
                                isActive 
                                  ? 'ring-4 ring-blue-100 border-blue-400 z-10' 
                                  : isComplete ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'
                              }`}
                          >
                              <div className="px-4 py-4 flex justify-between items-center border-b border-black/5 bg-white/50">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-800 text-lg">{req.role}</span>
                                    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                      <button 
                                        onClick={() => updateRoleCount(req.id, -1)}
                                        className={`w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors border-r border-gray-200 ${req.count <= 1 || req.count <= req.assigned.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={req.count <= 1 || req.count <= req.assigned.length}
                                      >
                                        -
                                      </button>
                                      <span className={`text-xs font-bold px-2 py-0.5 min-w-[24px] text-center ${isComplete ? 'text-green-700' : 'text-amber-700'}`}>
                                        {req.assigned.length} / {req.count}
                                      </span>
                                      <button 
                                        onClick={() => updateRoleCount(req.id, 1)}
                                        className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors border-l border-gray-200"
                                      >
                                        +
                                      </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setRoleToDelete(req.id)} className="text-xs font-medium text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-red-50">
                                      <Trash2 size={14} />
                                    </button>
                                    {isComplete 
                                      ? <span className="flex items-center justify-center w-6 h-6 text-white bg-green-500 rounded-full shadow-sm"><CheckCircle2 size={14} /></span>
                                      : <span className="flex items-center justify-center w-6 h-6 text-white bg-amber-500 rounded-full shadow-sm"><AlertCircle size={14} /></span>
                                    }
                                </div>
                              </div>
                              
                              <div 
                                className="p-4 space-y-3 flex-1"
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, req.id)}
                              >
                                {Array.from({ length: req.count }).map((_, idx) => {
                                    const assignedId = req.assigned[idx];
                                    const assignedMember = assignedId ? staffList.find(s => s.id === assignedId) : null;
                                    
                                    return (
                                      <React.Fragment key={idx}>
                                      {assignedMember ? (
                                          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                                              <div className="flex items-center gap-4 min-w-0">
                                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded uppercase tracking-wider shrink-0">#{idx + 1}</span>
                                                
                                                <div className="flex items-center gap-3 min-w-0">
                                                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm shrink-0">
                                                      {assignedMember.name.charAt(0)}
                                                  </div>
                                                  <div className="min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{assignedMember.name}</p>
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="flex items-center gap-2 shrink-0">
                                                <button 
                                                  onClick={() => removeStaffFromRole(req.id, assignedMember.id)} 
                                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                  <Trash2 size={16} />
                                                </button>
                                              </div>
                                          </div>
                                      ) : (
                                          <button 
                                             onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveAssignReqId(req.id);
                                                setStaffSearch('');
                                                setStaffPickerTab('Available');
                                                setIsStaffPickerOpen(true);
                                             }}
                                             className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed transition-colors group text-left ${
                                                isActive
                                                  ? 'border-blue-400 bg-blue-50' 
                                                  : 'border-amber-300 bg-amber-50 hover:bg-amber-100'
                                             }`}
                                          >
                                             <span className={`text-xs font-bold bg-white/50 px-2 py-1 rounded uppercase tracking-wider shrink-0 ${isActive ? 'text-blue-500' : 'text-amber-300'}`}>#{idx + 1}</span>
                                             <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm ${isActive ? 'bg-blue-100 text-blue-500' : 'bg-amber-100 text-amber-500'}`}>
                                                <Plus size={16} />
                                             </div>
                                             <span className={`text-sm font-medium italic ${isActive ? 'text-blue-700' : 'text-amber-700'}`}>
                                                {isActive ? 'Select from panel...' : 'Position Empty (Empty Slot)'}
                                             </span>
                                          </button>
                                      )}
                                      </React.Fragment>
                                    );
                                })}
                              </div>
                          </div>

                          {/* Contextual Popover */}
                          {isActive && (
                            <div 
                                ref={staffPickerRef}
                                className={`absolute top-0 z-50 w-[400px] bg-white shadow-2xl rounded-xl border border-gray-200 flex flex-col h-full min-h-[450px] animate-in fade-in zoom-in-95 duration-200 
                                ${isRightColumn ? 'right-full mr-4' : 'left-full ml-4'}
                            `}>
                               <div className={`absolute top-8 w-4 h-4 bg-white transform rotate-45 border-gray-200
                                   ${isRightColumn ? '-right-2 border-t border-r' : '-left-2 border-l border-b'}
                               `}></div>
                               
                               <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 rounded-t-xl">
                                  <div className="flex items-center gap-2">
                                     <Users size={18} className="text-blue-600" />
                                     <div>
                                        <h4 className="font-bold text-gray-900 leading-none">Available Team</h4>
                                        {(() => {
                                            const activeReq = staffRequirements.find(r => r.id === activeAssignReqId);
                                            if (activeReq) {
                                                return <p className="text-[10px] text-blue-600 font-medium mt-0.5">Filtering: {activeReq.role}</p>
                                            }
                                            return null;
                                        })()}
                                     </div>
                                     <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                                        {getFilteredStaffForPicker().length}
                                     </span>
                                  </div>
                                  <button 
                                     onClick={() => {
                                        setIsStaffPickerOpen(false);
                                        setActiveAssignReqId(null);
                                        setStaffSearch('');
                                     }} 
                                     className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                                  >
                                     <X size={18} />
                                  </button>
                                </div>

                               <div className="p-2 border-b border-gray-100 bg-white">
                                  <div className="flex bg-gray-100 p-1 rounded-lg mb-2">
                                     <button 
                                        onClick={() => setStaffPickerTab('Available')}
                                        className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${
                                           staffPickerTab === 'Available' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                     >
                                        Available
                                     </button>
                                     <button 
                                        onClick={() => setStaffPickerTab('Busy')}
                                        className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${
                                           staffPickerTab === 'Busy' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                     >
                                        Unavailable
                                     </button>
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
                                  {getFilteredStaffForPicker().map(staff => {
                                     const activeReq = staffRequirements.find(r => r.id === activeAssignReqId);
                                     const targetRole = activeReq?.role;
                                     const matchedRole = targetRole 
                                        ? staff.roles.find(r => r === targetRole)
                                        : (staffSearch ? staff.roles.find(r => r.toLowerCase().includes(staffSearch.toLowerCase())) : null);
                                     const roleToDisplay = matchedRole || staff.roles[0];
                                     const isHighlighted = !!matchedRole;

                                     return (
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
                                           <p className={`text-xs uppercase font-medium ${isHighlighted ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                                              {roleToDisplay}
                                           </p>
                                        </div>
                                        <GripVertical size={16} className="text-gray-300 group-hover:text-blue-400" />
                                     </div>
                                  )})}
                                  {getFilteredStaffForPicker().length === 0 && (
                                     <div className="text-center py-8 text-gray-400">
                                        <User size={32} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">No staff found</p>
                                     </div>
                                  )}
                                </div>
                               
                               <div className="p-3 bg-blue-50 border-t border-blue-100 text-center rounded-b-xl">
                                  <p className="text-[10px] text-blue-600 font-medium">
                                     Drag and drop to any empty slot
                                  </p>
                               </div>
                            </div>
                          )}
                      </div>
                    );
                })}
              </div>
            </div>
        </section>

        {/* 6. Files & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Files & Documents
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-8 flex flex-col items-center justify-center text-center hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group h-48">
                  <div className="w-12 h-12 rounded-full bg-gray-200 group-hover:bg-blue-200 flex items-center justify-center text-gray-500 group-hover:text-blue-600 mb-4 transition-colors">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-base font-bold text-gray-900">Drag and drop files here</p>
                  <p className="text-sm text-gray-500 mt-1">or <span className="text-blue-600 underline">Browse</span></p>
                  <p className="text-xs text-gray-400 mt-3 bg-white px-2 py-1 rounded-full border border-gray-200">Support: PDF, JPG, PNG (Max 10MB)</p>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Note / Brief
              </h3>
              <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none leading-relaxed"
                  placeholder="Enter any additional notes or brief for the event..."
              />
            </section>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {roleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 transform transition-all scale-100">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                        <Trash2 size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Role?</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Are you sure you want to remove this role? All assigned staff for this role will be cleared.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setRoleToDelete(null)}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmDeleteRole}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Conflict Handling Modal */}
      {conflictModal.isOpen && conflictModal.staff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-0 overflow-hidden transform transition-all scale-100 border border-red-100">
                <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600 shadow-sm border-4 border-white">
                        <AlertTriangle size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Schedule Conflict Detected</h3>
                    <p className="text-sm text-red-600 mt-1 font-medium">Staff member is currently busy</p>
                </div>
                
                <div className="p-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 mb-4">
                        <img 
                           src={conflictModal.staff.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(conflictModal.staff.name)}`} 
                           alt="Staff" 
                           className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div>
                           <p className="font-bold text-gray-900">{conflictModal.staff.name}</p>
                           <p className="text-xs text-gray-500 uppercase font-bold">{conflictModal.staff.roles[0]}</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 text-center leading-relaxed">
                       This staff member is already assigned to another event on the same day:
                    </p>
                    
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center mb-6">
                       <p className="text-sm font-bold text-red-800">{conflictModal.conflictingEventName}</p>
                    </div>

                    <p className="text-xs text-gray-400 text-center mb-6">
                       Confirming this action will remove them from the previous event and assign them here.
                    </p>

                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setConflictModal(prev => ({ ...prev, isOpen: false }))}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmConflictAssignment}
                            className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                        >
                            Confirm Assignment
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                 <h3 className="text-lg font-bold text-gray-900">Select Location on Map</h3>
                 <button onClick={() => setIsMapModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-4 bg-gray-50 border-b border-gray-200">
                 <div className="relative">
                    <MapIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                       type="text" 
                       placeholder="Enter latitude, longitude" 
                       className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                 </div>
              </div>

              <div className="flex-1 bg-gray-100 relative min-h-[350px] cursor-crosshair" onClick={handleModalMapClick}>
                  <div className="absolute inset-0 opacity-20" 
                      style={{ 
                        backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
                        backgroundSize: '40px 40px' 
                      }} 
                  />
                  {(tempLocation || mapPin) && (
                     <div 
                        className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200"
                        style={{ 
                           left: `${(tempLocation || mapPin!).x}%`, 
                           top: `${(tempLocation || mapPin!).y}%` 
                        }}
                     >
                        <MapIcon className="w-10 h-10 text-red-600 drop-shadow-lg fill-red-600" />
                        <div className="w-2 h-2 bg-black/30 rounded-full blur-[2px] absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1"></div>
                     </div>
                  )}
                  {!tempLocation && !mapPin && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-sm text-gray-400 font-medium bg-white/80 px-3 py-1 rounded shadow-sm">Click anywhere to place pin</p>
                     </div>
                  )}
              </div>

              <div className="p-6 border-t border-gray-200 bg-white space-y-4">
                 <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 flex justify-between items-center border border-gray-100">
                    <span>Selected Coordinates:</span>
                    <span className="font-mono font-bold text-gray-900">
                       {tempLocation 
                          ? `${(13.7 + (tempLocation.y / 1000)).toFixed(6)}, ${(100.5 + (tempLocation.x / 1000)).toFixed(6)}` 
                          : 'None'}
                    </span>
                 </div>
                 <p className="text-xs text-gray-400 text-center">Click on the map to select a different location</p>
                 
                 <div className="flex gap-3">
                    <button 
                       onClick={() => setIsMapModalOpen(false)}
                       className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                       Cancel
                    </button>
                    <button 
                       onClick={confirmLocation}
                       disabled={!tempLocation}
                       className="flex-1 px-4 py-2.5 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       Confirm Location
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
