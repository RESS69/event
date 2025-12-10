// src/routes/staff/index.tsx
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { SearchBar } from "../components/SearchBar";
import Button from "../components/ui/Button";
import Sidebar from "../components/Sidebar";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/staff")({
  component: StaffListRoute,
  staticData: {
    title: "StaffList",
  },
});

function StaffListRoute() {
  const totalStaff = 35;
  const [searchText, setSearchText] = useState("");

  return (
    <main className="flex">
      <Sidebar />

      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title="Staff"
          count={totalStaff}
          countLabel="staff members"
          actions={
            <Button
              icon={<Plus size={18} strokeWidth={2.5} />}
              title="Add Staff"
              className="bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            />
          }
        />

        <div className="px-6 pt-4 pb-2">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Search staff..."
            filterLabel="Role"
            onFilterClick={() => {
              console.log("open role filter");
            }}
          />
        </div>

        <PageSection>
          <p className="text-sm text-gray-700">
            ที่นี่คือพื้นที่ content ของ Staff
          </p>
        </PageSection>
      </div>
    </main>
  );
}

export default StaffListRoute;
