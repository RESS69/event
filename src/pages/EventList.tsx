import { useNavigate } from "@tanstack/react-router";   // ✅ เพิ่มอันนี้
import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { Plus } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
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
const EventList = () => {
  const totalEvent = 15;
  const navigate = useNavigate();                       // ✅ ใช้ hook ของ TanStack


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
            <Button variant="primary" size="add"
              onClick={() =>
                navigate({
                  to: "/createEvent",                 // 👈 เปลี่ยนให้ตรงกับ path ที่ตั้งใน routes
                })
              }
            >
              <Plus size={18} strokeWidth={2.5} />
              Create Event
            </Button>
          }
        />

        {/* Tabs + Status chips + Content */}
        <Tabs defaultValue="calendar" className="flex flex-1 flex-col">
          {/* แถบด้านบน: TabsList + status ด้านขวา */}
          <div className="px-6 pb-1 pt-6">
            <div className="flex items-center justify-between">
              {/* ซ้าย: Tabs */}
              <TabsList className="p-1">
                <TabsTab value="calendar">Calendar View</TabsTab>
                <TabsTab value="daily">Daily View</TabsTab>
              </TabsList>

              {/* ขวา: status chips */}
              <div className="inline-flex items-center gap-3 rounded-md border border-gray-100 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
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
