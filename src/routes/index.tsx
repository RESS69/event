// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "../components/Sidebar";
import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";

export const Route = createFileRoute("/")({
  component: DashboardRoute,
  staticData: {
    title: "Dashboard",
  },
});

function DashboardRoute() {
  return (
    <main className="flex">
      <Sidebar />

      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader title="Dashboard" />

        <PageSection>
          <p className="text-sm text-gray-700">
            ที่นี่คือพื้นที่ Dashboard (เดี๋ยวค่อยเอา card สรุปตัวเลขกับ
            schedule มาใส่)
          </p>
        </PageSection>
      </div>
    </main>
  );
}
