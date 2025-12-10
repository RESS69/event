import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";

const EventList = () => {
  const totalEvent = 15;

  return (
    <main className="flex">
      <Sidebar />

      <div className="flex min-h-0 flex-1 flex-col">
        {/* Header บนสุด */}
        <PageHeader
          title="Event"
          count={totalEvent}
          countLabel="Event"
          actions={
            <Button variant="primary" size="add">
              <Plus size={18} strokeWidth={2.5} />
              Create Event
            </Button>
          }
        />

        {/* Tabs + Status chips + Content */}
        <Tabs defaultValue="calendar" className="flex flex-1 flex-col">
          {/* แถบด้านบน: TabsList + status ด้านขวา */}
          <div className="border-b border-gray-100 bg-slate-50 px-6 py-3">
            <div className="flex items-center justify-between">
              {/* ซ้าย: Tabs */}
              <TabsList className="p-1">
                <TabsTab value="calendar">Calendar View</TabsTab>
                <TabsTab value="daily">Daily View</TabsTab>
              </TabsList>

              {/* ขวา: status chips */}
              <div className="inline-flex items-center gap-3 rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600">
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

          {/* เนื้อหาแต่ละ tab */}
          <PageSection>
            <TabsPanel value="calendar">
              <p className="text-sm text-gray-700">
                ตอนนี้อยู่ในโหมด{" "}
                <span className="font-medium">Calendar View</span>{" "}
                (เดี๋ยวค่อยเอา calendar component มาวางตรงนี้)
              </p>
            </TabsPanel>

            <TabsPanel value="daily">
              <p className="text-sm text-gray-700">
                ตอนนี้อยู่ในโหมด <span className="font-medium">Daily View</span>{" "}
                (พื้นที่สำหรับ table / list รายวัน)
              </p>
            </TabsPanel>
          </PageSection>
        </Tabs>
      </div>
    </main>
  );
};

export default EventList;
