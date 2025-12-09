// src/components/ui/PrimaryButton.tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

// ⬇️ ให้มัน extend ButtonHTMLAttributes<HTMLButtonElement>
//    จะได้มี onClick, disabled, type, className ฯลฯ ครบ ๆ
export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  leftIcon?: ReactNode;
  className?: string;
}

export function PrimaryButton({
  children,
  leftIcon,
  className = "",
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      // ถ้าอยากให้เปลี่ยน type จากข้างนอก ก็ไม่ fix type="button" ทับ
      className={
        "inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 " +
        "text-sm font-medium text-white shadow-sm shadow-blue-200 " +
        "transition-colors hover:bg-blue-700 " +
        className
      }
      {...rest} // ← รวม onClick, disabled, type, aria-* ต่าง ๆ
    >
      {leftIcon && (
        <span className="flex items-center justify-center">{leftIcon}</span>
      )}
      <span>{children}</span>
    </button>
  );
}

export default PrimaryButton;
