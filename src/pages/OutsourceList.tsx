import { useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { SearchBar } from "../components/SearchBar";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";

const staffOptions: FilterOption[] = [
  { value: "alice", label: "Alice", description: "Host" },
  { value: "bob", label: "Bob", description: "IT Support" },
  { value: "charlie", label: "Charlie" },
  { value: "john", label: "John" },
];
const OutsourceList = () => {
  const totalOutsource = 12; // mock data
  const [searchText, setSearchText] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  return (
    <>
      <PageHeader
        title="Outsource"
        count={totalOutsource}
        countLabel="outsourced staff"
        actions={
          <Button variant="primary" size="add">
            <Plus size={18} strokeWidth={2.5} />
            Add Outsource
          </Button>
        }
      />

      <div className="px-6 pt-4 pb-2">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search Company..."
          filterSlot={
            <FilterMultiSelect
              title="Company"
              options={staffOptions}
              selected={selectedStaff}
              onChange={setSelectedStaff}
            />
          }
        />
      </div>

      <PageSection>
        <p className="text-sm text-gray-700">
          ที่นี่คือพื้นที่ content ของ Outsource list
        </p>
      </PageSection>
    </>
  );
};

export default OutsourceList;
