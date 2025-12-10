import { useState } from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";

// ปรับ path ให้ตรงกับที่เก็บไฟล์จริง
import ViewToggle, { EventView } from "../components/ui/ViewToggle";

const EventList = () => {
  // เดี๋ยวค่อยเปลี่ยนเป็นข้อมูลจริงทีหลัง
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

        {/* เอา toggle มาวางตรงนี้ */}
        <div className="border-b border-gray-100 bg-slate-50 px-6 py-3">
          <div className="flex items-center justify-between">
            {/* ซ้าย: ปุ่มสลับ Calendar / Daily */}
            <ViewToggle
              value={view}
              onChange={(nextView) => setView(nextView)}
              leftLabel="Calendar View"
              rightLabel="Daily View"
              activeClassName="bg-blue-600 text-white shadow-sm"
              inactiveClassName="text-gray-500 hover:bg-gray-100"
            />

            {/* ขวา: status chips  */}
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

        {/* กรอบ content สีขาวสำหรับ Event list */}
        <PageSection>
          {view === "calendar" ? (
            <p className="text-sm text-gray-700">
              ตอนนี้อยู่ในโหมด <span className="font-medium">Calendar View</span>{" "}
              (พื้นที่สำหรับ calendar component)
            </p>
          ) : (
            <p className="text-sm text-gray-700">
              ตอนนี้อยู่ในโหมด <span className="font-medium">Daily View</span>{" "}
              (พื้นที่สำหรับ list / table รายวัน)
            </p>
          )}
        </PageSection>
      </div>
    </main>
  );
};

export default EventList;
