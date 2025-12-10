// src/components/ui/SegmentedToggle.tsx
import type { ReactNode } from "react";

export type ToggleValue = string;

interface ToggleOption<T extends ToggleValue = ToggleValue> {
  value: T;
  label: ReactNode;
}

interface SegmentedToggleProps<T extends ToggleValue = ToggleValue> {
  value: T;
  onChange: (value: T) => void;
  options: ToggleOption<T>[];

  // ไว้เผื่ออยากปรับสี/สไตล์จากแต่ละหน้า
  containerClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export function SegmentedToggle<T extends ToggleValue = ToggleValue>({
  value,
  onChange,
  options,
  containerClassName,
  activeClassName,
  inactiveClassName,
}: SegmentedToggleProps<T>) {
  const baseButtonClass =
    "px-4 py-1.5 text-sm font-medium rounded-lg transition-colors";

  const defaultActiveClass = "bg-blue-600 text-white shadow-sm";
  const defaultInactiveClass = "text-gray-600 hover:bg-gray-50";

  const wrapperClass =
    "inline-flex items-center rounded-lg border border-gray-200 bg-white p-1 shadow-sm" +
    (containerClassName ? " " + containerClassName : "");

  return (
    <div className={wrapperClass}>
      {options.map((option) => {
        const isActive = option.value === value;
        const stateClass = isActive
          ? activeClassName || defaultActiveClass
          : inactiveClassName || defaultInactiveClass;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={baseButtonClass + " " + stateClass}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedToggle;
