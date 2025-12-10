import type { ReactNode } from "react";

export type EventView = "calendar" | "daily";

interface ViewToggleProps {
  value: EventView;
  onChange: (value: EventView) => void;
  leftLabel?: ReactNode;
  rightLabel?: ReactNode;

  containerClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export function ViewToggle({
  value,
  onChange,
  leftLabel = "Calendar View",
  rightLabel = "Daily View",
  containerClassName,
  activeClassName,
  inactiveClassName,
}: ViewToggleProps) {
  const baseButtonClass =
    "px-4 py-1.5 text-sm font-medium rounded-full transition-colors";

  const defaultActiveClass = "bg-slate-900 text-white shadow-sm";
  const defaultInactiveClass = "text-gray-600 hover:bg-gray-50";

  const wrapperClass =
    "inline-flex items-center rounded- border border-gray-200 bg-white p-1 shadow-sm" +
    (containerClassName ? " " + containerClassName : "");

  return (
    <div className={wrapperClass}>
      {/* ปุ่มฝั่งซ้าย */}
      <button
        type="button"
        onClick={() => onChange("calendar")}
        className={
          baseButtonClass +
          " " +
          (value === "calendar"
            ? activeClassName || defaultActiveClass
            : inactiveClassName || defaultInactiveClass)
        }
      >
        {leftLabel}
      </button>

      {/* ปุ่มฝั่งขวา */}
      <button
        type="button"
        onClick={() => onChange("daily")}
        className={
          baseButtonClass +
          " " +
          (value === "daily"
            ? activeClassName || defaultActiveClass
            : inactiveClassName || defaultInactiveClass)
        }
      >
        {rightLabel}
      </button>
    </div>
  );
}

export default ViewToggle;
