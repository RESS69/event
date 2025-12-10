import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../Components/Layout/PageHeader";
import { PageSection } from "../Components/Layout/PageSection";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SearchBar } from "../Components/SearchBar";
import { Plus } from "lucide-react";
import Sidebar from "../Components/Sidebar";

export const Route = createFileRoute("/event/")({
  component: EventListRoute,
  staticData: {
    title: "Event",
  },
});

function EventListRoute() {
  // เดี๋ยวค่อยเปลี่ยนเป็นข้อมูลจริงทีหลัง
  const totalEvent = 15;

  return (
    <main className="flex">
            <Sidebar />
      
            <div className="flex min-h-0 flex-1 flex-col">
              <PageHeader
                title="Event"
                count={totalEvent}
                countLabel="Event"
                actions={
                  <PrimaryButton
                    leftIcon={<Plus size={18} strokeWidth={2.5} />}
                    onClick={() => {
                      console.log("go to /event/new");
                    }}
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
    </main>
  );
}
export default EventListRoute;
