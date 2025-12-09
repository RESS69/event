import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../../components/layout/PageHeader";
import { PageSection } from "../../components/layout/PageSection";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { SearchBar } from "../../components/SearchBar";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/equipment/")({
  component: EquipmentListRoute,
  staticData: {
    title: "EquipmentList",
  },
});

function EquipmentListRoute() {
  const totalItems = 20; // mock data
  const [searchText, setSearchText] = useState("");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* 1) Header มีกรอบเองอยู่แล้ว */}
      <PageHeader
        title="Equipment"
        count={totalItems}
        countLabel="items"
        actions={
          <PrimaryButton
            leftIcon={<Plus size={18} strokeWidth={2.5} />}
            // onClick={() => {
            //   console.log('go to /equipment/new');
            // }}
          >
            Add Equipment
          </PrimaryButton>
        }
      />

      {/* 2) แถว SearchBar ด้านนอก PageSection
            ให้ระยะขอบเท่ากับ PageSection ใช้ px-6 pt-4 pb-2 */}
      <div className="px-6 pt-4 pb-2">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search equipment..."
          filterLabel="Category"
          onFilterClick={() => {
            console.log("open category filter");
          }}
        />
      </div>

      {/* 3) กรอบ content จริงอยู่ข้างล่าง */}
      <PageSection>
        <p className="text-sm text-gray-700">
          (เดี๋ยวใช้ searchText = "{searchText}" ไป filter ตารางอุปกรณ์จริง ๆ
          อีกที)
        </p>
      </PageSection>
    </div>
  );
}
