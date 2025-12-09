import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../../components/layout/PageHeader";
import { PageSection } from "../../components/layout/PageSection";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { SearchBar } from "../../components/SearchBar";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/staff/")({
  component: StaffListRoute,
  staticData: {
    title: "StaffList",
  },
});

function StaffListRoute() {
  const totalStaff = 35;
  const [searchText, setSearchText] = useState("");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Staff"
        count={totalStaff}
        countLabel="active members"
        actions={
          <PrimaryButton
            leftIcon={<Plus size={18} strokeWidth={2.5} />}
            // onClick={() => {
            //   // เดี๋ยวค่อยต่อ router.navigate ภายหลัง
            //   console.log('go to /staff/new');
            // }}
          >
            Add Staff
          </PrimaryButton>
        }
      />
      <div className="px-6 pt-4 pb-2">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search equipment..."
          filterLabel="Role"
          onFilterClick={() => {
            console.log("open category filter");
          }}
        />
      </div>
      <PageSection>
        <p className="text-sm text-gray-700">
          ที่นี่คือพื้นที่ content ของ Staff
        </p>
      </PageSection>
    </div>
  );
}
