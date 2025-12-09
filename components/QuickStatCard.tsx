import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface QuickStatCardProps {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
  helper?: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

/**
 * Card เล็ก ๆ สำหรับ Quick Stats ใช้ได้ทั้งในหน้าแสดงผล และหน้าแก้ไข
 */
export const QuickStatCard: React.FC<QuickStatCardProps> = ({
  icon: Icon,
  label,
  children,
  helper,
  className = '',
  iconClassName = ''
}) => {
  return (
    <div
      className={
        'bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden ' +
        className
      }
    >
      <div className="z-10 w-full">
        <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
        <div className="mt-1">{children}</div>
        {helper && <div className="mt-1 text-xs text-gray-400">{helper}</div>}
      </div>
      <Icon
        className={
          'absolute right-2 bottom-2 w-20 h-20 -rotate-12 text-gray-100 pointer-events-none ' +
          iconClassName
        }
      />
    </div>
  );
};
