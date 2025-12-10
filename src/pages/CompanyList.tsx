import { Plus } from "lucide-react";
import PageHeader from "../components/layout/PageHeader";
import SearchBar from "../components/SearchBar";
import PageSection from "../components/layout/PageSection";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Button } from "@/components/ui/Button";

const CompanyList = () => {
  const totalCompanies = 15; // mock data
  const [searchText, setSearchText] = useState("");

  return (
    <main className="flex">
      <Sidebar />
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title="Company"
          count={totalCompanies}
          countLabel="companies"
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
            filterLabel="Date Create"
            onFilterClick={() => {
              console.log("open category filter");
            }}
          />
        </div>
        <PageSection>
          <p className="text-sm text-gray-700">
            ที่นี่คือพื้นที่ content ของ Company list
          </p>
        </PageSection>
      </div>
    </main>
  );
};

export default CompanyList;
