import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../../components/layout/PageHeader";
import { PageSection } from "../../components/layout/PageSection";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { SearchBar } from "../../components/SearchBar";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/event/")({
  component: CompanyListRoute,
  staticData: {
    title: "CompanyList",
  },
});

function CompanyListRoute() {
  // เดี๋ยวค่อยเปลี่ยนเป็นข้อมูลจริงทีหลัง
  const totalCompanies = 15;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header มีกรอบเหมือนหน้า Staff */}
      <PageHeader
        title="Event"
        count={totalCompanies}
        countLabel="Event"
        actions={
          <PrimaryButton
            leftIcon={<Plus size={18} strokeWidth={2.5} />}
            // onClick={() => {
            //   // ไว้ค่อยต่อ /company/new ภายหลัง
            //   console.log('go to /company/new');
            // }}
          >
            Create Event
          </PrimaryButton>
        }
      />

      {/* กรอบ content สีขาวสำหรับ Company list */}
      <PageSection>
        <p className="text-sm text-gray-700">
          ที่นี่คือพื้นที่ content ของ Event (เดี๋ยวเราค่อยมาใส่ Card / Table
          จริง ๆ ต่ออีกที)
        </p>
      </PageSection>
    </div>
  );
}
