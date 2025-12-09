// src/components/layout/PageSection.tsx
import type { ReactNode } from "react";

interface PageSectionProps {
  children: ReactNode;
}

export function PageSection({ children }: PageSectionProps) {
  return (
    <section className="flex-1 overflow-auto px-6 pb-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {children}
      </div>
    </section>
  );
}

export default PageSection;
