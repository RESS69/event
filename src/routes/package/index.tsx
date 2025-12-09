import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../../components/layout/PageHeader";
import { PageSection } from "../../components/layout/PageSection";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { SearchBar } from "../../components/SearchBar";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/package/")({
  component: PackageListRoute,
  staticData: {
    title: "PackageList",
  },
});

function PackageListRoute() {
  const totalPackages = 9; // mock data

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Package"
        count={totalPackages}
        countLabel="packages"
        actions={
          <PrimaryButton
            leftIcon={<Plus size={18} strokeWidth={2.5} />}
            // onClick={() => {
            //   console.log('go to /package/new');
            // }}
          >
            Create Package
          </PrimaryButton>
        }
      />

      <PageSection>
        <p className="text-sm text-gray-700">
          ที่นี่คือพื้นที่ content ของ Package list
        </p>
      </PageSection>
    </div>
  );
}
