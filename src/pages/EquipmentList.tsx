import { useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { SearchBar } from "../components/SearchBar";
import Sidebar from "../components/Sidebar";
import { Button } from "@/components/ui/Button";
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
            <Button variant="primary" size="add">
              <Plus size={18} strokeWidth={2.5} />
              Create Company
            </Button>
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
