import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import Sidebar from "../components/Sidebar";
import { Plus } from "lucide-react";
import Button from "../components/ui/Button";

export const Route = createFileRoute("/package/")({
  component: PackageListRoute,
  staticData: {
    title: "PackageList",
  },
});

function PackageListRoute() {
  const totalPackages = 9; // mock data

  return (
    <main className="flex">
      <Sidebar />

      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title="Package"
          count={totalPackages}
          countLabel="Package"
          actions={
            <Button
              icon={<Plus size={18} strokeWidth={2.5} />}
              title="Add Package"
              className="bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            />
          }
        />

        <PageSection>
          <p className="text-sm text-gray-700">
            ที่นี่คือพื้นที่ content ของ Package list
          </p>
        </PageSection>
      </div>
    </main>
  );
}
export default PackageListRoute;
