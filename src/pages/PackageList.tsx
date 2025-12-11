import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import Sidebar from "../components/Sidebar";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

const PackageList = () => {
  const totalPackages = 9; // mock data

  return (
    <>
      <PageHeader
        title="Package"
        count={totalPackages}
        countLabel="Package"
        actions={
          <Button variant="primary" size="add">
            <Plus size={18} strokeWidth={2.5} />
            Create Company
          </Button>
        }
      />

      <PageSection>
        <p className="text-sm text-gray-700">
          ที่นี่คือพื้นที่ content ของ Package list
        </p>
      </PageSection>
    </>
  );
};
export default PackageList;
