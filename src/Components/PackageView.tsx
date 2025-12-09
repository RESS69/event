
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit, Trash2, Check, Package, MoreHorizontal } from 'lucide-react';
import { PackageItem } from '../types';

interface PackageViewProps {
  data: PackageItem[];
  onDelete?: (id: string) => void;
  onEdit?: (pkg: PackageItem) => void;
}

export const PackageView: React.FC<PackageViewProps> = ({ data, onDelete, onEdit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(1);      // Mobile
      else if (width < 1024) setVisibleCount(2); // Tablet
      else setVisibleCount(3);                   // Desktop (Max 3)
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const nextSlide = () => {
    // Jump by the number of visible items (Page-like navigation)
    if (currentIndex + visibleCount < data.length) {
      setCurrentIndex(currentIndex + visibleCount);
    }
  };

  const prevSlide = () => {
    // Jump back by visible items
    const newIndex = currentIndex - visibleCount;
    setCurrentIndex(newIndex < 0 ? 0 : newIndex);
  };

  // Calculate if buttons should be disabled
  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex + visibleCount >= data.length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar bg-gray-50/30">
      <div className="flex-1 flex flex-col justify-center min-h-full p-6 lg:p-10">
        <div className="relative w-full">
          
          {/* Navigation Buttons */}
          <div className="absolute inset-y-0 left-0 flex items-center z-10 pointer-events-none">
             <button 
              onClick={prevSlide}
              disabled={isPrevDisabled}
              className={`pointer-events-auto p-3 rounded-full bg-white shadow-lg border border-gray-100 transition-all duration-200 transform translate-x-2 ${
                isPrevDisabled ? 'opacity-0 scale-90' : 'opacity-100 hover:scale-110 text-gray-700 hover:text-blue-600'
              }`}
            >
              <ChevronLeft size={24} />
            </button>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center z-10 pointer-events-none">
            <button 
              onClick={nextSlide}
              disabled={isNextDisabled}
              className={`pointer-events-auto p-3 rounded-full bg-white shadow-lg border border-gray-100 transition-all duration-200 transform -translate-x-2 ${
                isNextDisabled ? 'opacity-0 scale-90' : 'opacity-100 hover:scale-110 text-gray-700 hover:text-blue-600'
              }`}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Carousel Container */}
          <div className="overflow-hidden w-full px-2 py-8">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
            >
              {data.map((pkg) => (
                <div 
                  key={pkg.id}
                  className="flex-none px-3 transition-all duration-300"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col group relative min-h-[600px]">
                    <div className="p-8 border-b border-gray-50 bg-gradient-to-b from-white to-gray-50/30 rounded-t-2xl">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
                          <Package size={32} />
                        </div>
                        
                        {/* Action Menu */}
                        <div className="relative action-menu-wrapper">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === pkg.id ? null : pkg.id);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <MoreHorizontal size={20} />
                          </button>

                          {openMenuId === pkg.id && (
                            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                              <div className="p-1">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.(pkg);
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
                                    onDelete?.(pkg.id);
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
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate" title={pkg.name}>{pkg.name}</h3>
                      <div className="mt-4">
                         <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{pkg.items.length} items</span>
                      </div>
                    </div>

                    <div className="p-8 flex-1 bg-white rounded-b-2xl flex flex-col">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                        Included Equipment
                        <span className="h-px flex-1 bg-gray-100"></span>
                      </p>
                      <ul className="space-y-4 flex-1">
                        {pkg.items.slice(0, 8).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                            <div className="mt-0.5 min-w-[16px]">
                              <Check size={16} className="text-green-500" strokeWidth={3} />
                            </div>
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                        {pkg.items.length > 8 && (
                           <li className="text-xs text-gray-400 italic pl-7 pt-2">
                              + {pkg.items.length - 8} more items
                           </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};