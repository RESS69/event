// src/components/SearchBar.tsx
import type { ChangeEvent, ReactNode } from "react";
import { Search, Filter } from "lucide-react";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** ข้อความบนปุ่ม filter เช่น "Category" */
  filterLabel?: string;
  /** คลิกปุ่ม filter (กรณีใช้ปุ่ม default) */
  onFilterClick?: () => void;
  /** ถ้าส่งอันนี้มา จะใช้แทนปุ่ม filter เดิม */
  filterSlot?: ReactNode;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  filterLabel = "Filter",
  onFilterClick,
  filterSlot,
}: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const showDefaultFilterButton = !filterSlot && onFilterClick;

  return (
    <div className="flex items-center gap-3">
      {/* ช่องค้นหา */}
      <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-0.5 shadow-sm">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="h-8 flex-1 border-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* ถ้ามี filterSlot ให้ใช้แทนปุ่ม default */}
      {filterSlot}

      {/* ถ้าไม่มี filterSlot แต่มี onFilterClick → ใช้ปุ่ม filter เดิม */}
      {showDefaultFilterButton && (
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          onClick={onFilterClick}
        >
          <Filter className="h-4 w-4 text-gray-500" />
          <span>{filterLabel}</span>
          <span className="text-gray-400">▾</span>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
