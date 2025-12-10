// EventList.tsx
import { useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import SegmentedToggle from "../components/ui/SegmentView";

type EventView = "calendar" | "daily";

const EventList = () => {
  const totalEvent = 15;
  const [view, setView] = useState<EventView>("calendar");

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

        {/* แถบด้านล่างหัวข้อ + toggle */}
        <div className="border-b border-gray-100 bg-slate-50 px-6 py-3">
          <div className="flex items-center justify-between">
            <SegmentedToggle<EventView>
              value={view}
              onChange={setView}
              options={[ /*เพิ่มจำนวนช่อง */
                { value: "calendar", label: "Calendar View" },
                { value: "daily", label: "Daily View" },
              ]}
            />

            {/* status ด้านขวา (ตามดีไซน์รูป) */}
            <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-1 text-xs font-medium text-gray-600">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                Pending
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Complete
              </span>
            </div>
          </div>
        </div>

        <PageSection>
          {view === "calendar" ? (
            <p className="text-sm text-gray-700">
              ตอนนี้อยู่ในโหมด <span className="font-medium">Calendar View</span>
            </p>
          ) : (
            <p className="text-sm text-gray-700">
              ตอนนี้อยู่ในโหมด <span className="font-medium">Daily View</span>
            </p>
          )}
        </PageSection>
      </div>
    </main>
  );
};

export default EventList;
