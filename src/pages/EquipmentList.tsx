import { useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SearchBar } from "../components/SearchBar";
import Sidebar from "../components/Sidebar";
import { Plus } from "lucide-react";

const EquipmentList = () => {
  const totalItems = 20; // mock data
  const [searchText, setSearchText] = useState("");

  return (
    <main className="flex">
      <Sidebar />

      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title="Equipment"
          count={totalItems}
          countLabel="Equipment"
          actions={
            <PrimaryButton
              leftIcon={<Plus size={18} strokeWidth={2.5} />}
              onClick={() => {
                console.log("go to /equipment/new");
              }}
            >
              Add Equipment
            </PrimaryButton>
          }
        />

        <div className="px-6 pt-4 pb-2">
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Search equipment..."
            filterLabel="Catagory"
            onFilterClick={() => {
              console.log("open catagory filter");
            }}
          />
        </div>

        <PageSection>
          <p className="text-sm text-gray-700">
            ที่นี่คือพื้นที่ content ของ Equipment
          </p>
        </PageSection>
      </div>
    </main>
  );
};

export default EquipmentList;
