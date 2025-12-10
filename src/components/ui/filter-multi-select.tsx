import * as React from "react";
import { X } from "lucide-react";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
} from "./multi-select";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FilterMultiSelectProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export function FilterMultiSelect({
  title,
  icon: Icon,
  options,
  selected,
  onChange,
  className,
}: FilterMultiSelectProps) {
  const isActive = selected.length > 0;

  return (
    <MultiSelect values={selected} onValuesChange={onChange}>
      <MultiSelectTrigger
        className={cn(
          // Style ปกติ (ยังไม่ได้เลือก) -> Border dashed, พื้นใส
          "h-8 w-fit border rounded-xl bg-transparent hover:bg-muted/50",

          // Style เมื่อมีการเลือก (Active) -> Border solid, พื้นสีฟ้าอ่อน, ตัวหนังสือสีน้ำเงิน
          isActive &&
            "border-solid border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",

          className
        )}
      >
        <div className="flex items-center gap-2">
          {/* Icon */}
          {Icon && (
            <Icon
              className={cn(
                "h-4 w-4",
                isActive ? "text-blue-700" : "text-muted-foreground"
              )}
            />
          )}

          {/* Title */}
          <span
            className={cn(
              "text-sm font-medium",
              isActive ? "text-blue-700" : "text-muted-foreground"
            )}
          >
            {title}
          </span>

          {/* Badge Count (โชว์เฉพาะตอนเลือก) */}
          {isActive && (
            <div className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-xl bg-blue-200 px-1 text-xs font-bold text-blue-700">
              {selected.length}
            </div>
          )}
        </div>
      </MultiSelectTrigger>

      <MultiSelectContent
        search={{
          emptyMessage: "Not found",
          placeholder: "Search...",
        }}
        align="start"
      >
        {options.map((option) => (
          <MultiSelectItem
            key={option.value}
            value={option.value}
            hasDescription={option.description}
          >
            {/* ถ้ามี Icon */}
            {option.icon && (
              <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}

            {/* ส่วนแสดงผล Text และ Description */}
            <div className="flex flex-col">
              <span className="leading-snug">{option.label}</span>
              {option.description && (
                <span className="text-[11px] text-muted-foreground/80">
                  {option.description}
                </span>
              )}
            </div>
          </MultiSelectItem>
        ))}

        {isActive && (
          <div className="sticky bottom-0 z-10 bg-white border-t p-1 shadow-sm">
            <button
              className="w-full text-xs text-center p-2 text-destructive hover:bg-destructive/5 hover:rounded-lg"
              onClick={(e) => {
                e.stopPropagation(); // ป้องกัน dropdown ปิดทันที
                onChange([]);
              }}
            >
              <span className="flex gap-1 items-center justify-center">
                <X size={14} className="mt-0.5" />
                <p className="font-medium">Clear filters</p>
              </span>
            </button>
          </div>
        )}
      </MultiSelectContent>
    </MultiSelect>
  );
}
