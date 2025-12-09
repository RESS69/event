import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../../components/layout/PageHeader";
import { PageSection } from "../../components/layout/PageSection";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { SearchBar } from "../../components/SearchBar";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/outsource/")({
  component: OutsourceListRoute,
  staticData: {
    title: "OutsourceList",
  },
});

function OutsourceListRoute() {
  const totalOutsource = 12; // mock data
  const [searchText, setSearchText] = useState("");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Outsource"
        count={totalOutsource}
        countLabel="outsourced staff"
        actions={
          <PrimaryButton
            leftIcon={<Plus size={18} strokeWidth={2.5} />}
            // onClick={() => {
            //   console.log('go to /outsource/new');
            // }}
          >
            Add Outsource
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
          ที่นี่คือพื้นที่ content ของ Outsource list
        </p>
      </PageSection>
    </div>
  );
}
