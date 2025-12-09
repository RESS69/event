import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface FormPageLayoutProps {
  title: string;
  description?: string;
  onBack: () => void;
  children: React.ReactNode;
}

/**
 * Layout สำหรับหน้าสร้าง/แก้ไข (Create/Edit) แบบเต็มจอ
 */
export const FormPageLayout: React.FC<FormPageLayoutProps> = ({
  title,
  description,
  onBack,
  children
}) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              {description && (
                <p className="text-sm text-gray-500">{description}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 max-w-6xl mx-auto w-full pb-10">
        {children}
      </main>
    </div>
  );
};
